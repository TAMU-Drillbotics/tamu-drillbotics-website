'use client';

import dynamic from 'next/dynamic';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GRID_CELLS } from '@/lib/rigCapture';

// Live WebGL viewer — client-only, and deliberately NOT imported at module
// scope. `dynamic()` only fetches the chunk when the component is first
// rendered, and RigViewer's module body calls useGLTF.preload() on the 13 MB
// GLB. Keeping <RigViewer> unmounted until the user opts in therefore keeps
// three.js, the Draco decoder and the model entirely off the wire for the
// default visit.
const RigViewer = dynamic(() => import('@/components/RigViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#0A0A0A] rounded-lg overflow-hidden border border-[#500000]/20 animate-pulse" />
  ),
});

export type RigMode = 'video' | 'live';

// Once the panel is this far past the viewport edge for this long, live 3D
// turns itself off and the switch returns to Video.
//
// Gating the frame loop (which RigViewer already does) stops the GPU *work*
// but keeps the context, its framebuffers and the uploaded geometry resident.
// Unmounting is what actually returns that memory.
//
// This is a ONE-WAY transition: scrolling back does not re-arm live 3D, the
// user asks for it again. An earlier version kept the user's intent and
// remounted the viewer on return, which was worse in practice — rebuilding
// the scene (Draco parse, Stage re-fit, shadow-map re-render, HDRI re-upload)
// landed in the middle of an active scroll and visibly stuttered. Doing it
// on a deliberate click instead puts that cost where the user is waiting for
// it rather than where they are moving.
//
// The quarter-viewport margin keeps a small overscroll from tripping it.
const RELEASE_ROOT_MARGIN = '25%';
const RELEASE_DELAY_MS = 800;

// Tear down when the main thread is next idle rather than the instant the
// timer fires. Disposing a WebGL context is synchronous and not cheap, and
// the timer will often elapse while the user is still scrolling; deferring to
// idle keeps that work out of the scroll's frame budget. The timeout bounds
// how long "idle" is allowed to take, and the setTimeout branch covers
// browsers without requestIdleCallback.
function whenIdle(fn: () => void, timeout = 1000): () => void {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    const id = window.requestIdleCallback(fn, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(fn, 0);
  return () => clearTimeout(id);
}

/* ═══════════════════════════════════════════════════════
   BAKED TURNTABLE
   ═══════════════════════════════════════════════════════ */

// The default view. Same camera path as the live scene, pre-rendered by
// scripts/render-rig-video.mjs into a 2.9 MB MP4 / 5.1 MB WebM. Decoding is
// handled by the GPU's video block rather than the main thread, so it costs
// the page essentially nothing while scrolling — which is the entire point.
function RigTurntable() {
  const panelRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Match the panel's CSS grid to the grid baked into the video.
  //
  // The footage is square and `object-contain`, so on a wider panel it is
  // letterboxed: it renders at min(w, h) with bars either side. Its baked grid
  // therefore appears at min(w, h) / GRID_CELLS px — smaller than the panel's
  // own grid, which is what made the bars read as a different, coarser grid
  // stuck onto the sides of the video.
  //
  // Deriving the pitch from the panel box keeps the two continuous at any
  // size, and offsetting the background by the letterbox bar width lines the
  // rules up across the seam instead of merely matching their spacing.
  //
  // Runs on resize only — never on scroll. The panel is a fixed-size box now
  // (see the note in engineering.tsx), so in practice this fires on window
  // resize and once on mount.
  useEffect(() => {
    const panel = panelRef.current;
    const grid = gridRef.current;
    if (!panel || !grid) return;

    const sync = () => {
      const { width, height } = panel.getBoundingClientRect();
      if (!width || !height) return;
      const shown = Math.min(width, height); // object-contain on square source
      const cell = shown / GRID_CELLS;
      grid.style.backgroundSize = `${cell}px ${cell}px`;
      // Origin of the video's own grid within the panel.
      grid.style.backgroundPosition = `${(width - shown) / 2}px ${(height - shown) / 2}px`;
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(panel);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={panelRef}
      className="relative w-full h-full bg-[#1A1A1A] rounded-lg overflow-hidden border border-[#500000]/20"
    >
      {/* Engineering grid — continuous with the one baked into the footage, so
          the letterbox bars read as more of the same backdrop rather than as
          panel edges. Sizing/offset are set from the effect above. */}
      <div
        ref={gridRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(250,250,250,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(250,250,250,0.04) 1px, transparent 1px)',
        }}
      />
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="relative block w-full h-full object-contain"
        aria-label="Autonomous drilling rig 3D model, turntable view"
      >
        <source src="/models/rig-loop.webm" type="video/webm" />
        <source src="/models/rig-loop.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MODE SWITCH
   ═══════════════════════════════════════════════════════ */

// Segmented VIDEO / LIVE 3D toggle.
//
// The sliding knob animates `x` only — a compositable transform, so it runs
// on the compositor and never touches layout. That matters here more than
// usual: this control sits directly above a canvas, and the whole reason the
// hero was rebuilt is that animating a layout property next to a <Canvas>
// forced a drawing-buffer reallocation on every frame.
function ModeSwitch({
  mode,
  onChange,
}: {
  mode: RigMode;
  onChange: (mode: RigMode) => void;
}) {
  const reducedMotion = useReducedMotion();
  const isLive = mode === 'live';

  return (
    <div className="flex items-center gap-3">
      {/* Status LED — amber while the live renderer is mounted, matching the
          amber used for advisory states elsewhere on the site. Mode and
          renderer are the same thing again, so this needs no third state. */}
      <span className="flex items-center gap-2 font-mono text-[10px] tracking-[.18em] uppercase text-ink-4">
        <span
          aria-hidden="true"
          className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
          style={{
            backgroundColor: isLive ? '#C8963E' : '#a5a5a5',
            boxShadow: isLive ? '0 0 6px rgba(200,150,62,.7)' : 'none',
          }}
        />
        {isLive ? 'GPU' : 'Idle'}
      </span>

      <button
        type="button"
        role="switch"
        aria-checked={isLive}
        aria-label="Live 3D render"
        onClick={() => onChange(isLive ? 'video' : 'live')}
        className="group relative flex items-stretch h-[30px] border border-rule-strong bg-white cursor-pointer select-none overflow-hidden transition-colors duration-200 hover:border-[#500000]/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#500000]"
      >
        {/* Sliding knob. Sized to half the track and moved by exactly its own
            width, so the two segments stay identical at any label width. */}
        <motion.span
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-0 w-1/2 bg-maroon"
          initial={false}
          animate={{ x: isLive ? '100%' : '0%' }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { type: 'spring', stiffness: 420, damping: 34 }
          }
        />
        {(['video', 'live'] as const).map((value) => (
          <span
            key={value}
            className={`relative z-10 flex items-center justify-center w-[72px] font-mono text-[9.5px] tracking-[.18em] uppercase transition-colors duration-200 ${
              mode === value ? 'text-white' : 'text-ink-3'
            }`}
          >
            {value === 'video' ? 'Video' : 'Live 3D'}
          </span>
        ))}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ADVISORY TOAST
   ═══════════════════════════════════════════════════════ */

const TOAST_MS = 7000;

function Toast({ onDismiss }: { onDismiss: () => void }) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const id = setTimeout(onDismiss, TOAST_MS);
    return () => clearTimeout(id);
  }, [onDismiss]);

  return (
    <motion.div
      role="status"
      className="fixed bottom-6 right-6 z-50 w-[min(360px,calc(100vw-3rem))] border border-rule-strong bg-white shadow-[0_18px_40px_-24px_rgba(26,26,26,.5)]"
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      transition={{ duration: reducedMotion ? 0 : 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Amber rule across the top — the site's advisory accent. */}
      <div aria-hidden="true" className="h-[2px] bg-amber" />

      <div className="px-4 py-3.5">
        <div className="flex items-start justify-between gap-3">
          <span className="font-mono text-[10px] tracking-[.18em] uppercase text-ink-3">
            Live render engaged
          </span>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            className="font-mono text-[11px] leading-none text-ink-4 hover:text-ink transition-colors cursor-pointer -mt-0.5"
          >
            &#10005;
          </button>
        </div>
        <p className="text-[13.5px] leading-[1.5] text-ink-2 m-0 mt-2">
          The rig is a 13&nbsp;MB CAD model rendered live in your browser. Expect
          heavy memory and GPU use, and a warmer laptop. Flip back to{' '}
          <span className="font-mono text-[11.5px] tracking-[.12em] uppercase text-ink">
            Video
          </span>{' '}
          to free it.
        </p>
      </div>

      {/* Countdown rule — a plain scaleX transform, so the toast costs the
          compositor a single layer and the main thread nothing. */}
      {!reducedMotion && (
        <motion.div
          aria-hidden="true"
          className="h-[1px] bg-amber/40 origin-left"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: TOAST_MS / 1000, ease: 'linear' }}
        />
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   STAGE
   ═══════════════════════════════════════════════════════ */

/**
 * The hero's render panel: a baked turntable by default, live WebGL on
 * request.
 *
 * Live 3D is opt-in rather than automatic because the cost is not just the
 * frame loop — it is a 13 MB Draco GLB download, a Draco decode on the main
 * thread, and a WebGL context holding the decoded geometry plus a warehouse
 * HDRI in GPU memory for as long as the page is open. None of that is
 * recoverable by gating the frame loop; the only way to not pay it is to not
 * mount the viewer. Switching back to Video unmounts <RigViewer>, and R3F
 * disposes the context and its buffers on unmount.
 *
 * The same teardown runs automatically once the panel is well clear of the
 * viewport: live 3D switches itself back off, so a visitor who turns it on
 * and then reads the rest of the page is not holding a WebGL context open
 * for a hero they cannot see. Turning it back on is a deliberate click.
 *
 * `showSwitch` is false on mobile: the live viewer was unplayable on phones
 * (which is why the baked video exists), so there is nothing to offer.
 */
export default function RigStage({ showSwitch = true }: { showSwitch?: boolean }) {
  const [mode, setMode] = useState<RigMode>('video');
  const [toastVisible, setToastVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Release the renderer once the panel has been well off screen for a beat.
  // Subscribe-only: the single setState lives in the observer callback, not
  // the effect body.
  useEffect(() => {
    if (mode !== 'live') return;
    const el = panelRef.current;
    if (!el) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelIdle: (() => void) | undefined;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Came back before the timer elapsed — stand down.
          clearTimeout(timer);
          cancelIdle?.();
          cancelIdle = undefined;
          return;
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
          cancelIdle = whenIdle(() => setMode('video'));
        }, RELEASE_DELAY_MS);
      },
      { rootMargin: RELEASE_ROOT_MARGIN },
    );
    io.observe(el);
    return () => {
      clearTimeout(timer);
      cancelIdle?.();
      io.disconnect();
    };
  }, [mode]);

  // Advise once per session, not on every toggle — a user flipping back and
  // forth already knows what they opted into.
  const hasWarnedRef = useRef(false);

  const handleChange = useCallback((next: RigMode) => {
    setMode(next);
    if (next === 'live' && !hasWarnedRef.current) {
      hasWarnedRef.current = true;
      setToastVisible(true);
    } else if (next === 'video') {
      setToastVisible(false);
    }
  }, []);

  const dismissToast = useCallback(() => setToastVisible(false), []);

  return (
    <div className="flex flex-col h-full min-h-0">
      {showSwitch && (
        <div className="flex-none flex items-center justify-end pb-2.5">
          <ModeSwitch mode={mode} onChange={handleChange} />
        </div>
      )}

      <div ref={panelRef} className="flex-1 min-h-0">
        {mode === 'live' ? <RigViewer /> : <RigTurntable />}
      </div>

      <AnimatePresence>
        {toastVisible && <Toast key="rig-toast" onDismiss={dismissToast} />}
      </AnimatePresence>
    </div>
  );
}
