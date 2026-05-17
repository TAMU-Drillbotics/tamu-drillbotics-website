'use client';

import { Suspense, useEffect, useRef, useState, type ComponentRef } from 'react';
import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF, Html, useProgress } from '@react-three/drei';

// Draco decoder hosted by Google — required because the GLB was Draco-compressed
// during the Fusion 360 → USDZ → Blender → glTF export pipeline.
useGLTF.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

const RIG_URL = '/models/rig.glb';

// Pull the underlying three OrbitControls instance type off the drei component
// — gives us reset() / saveState() without adding a `three-stdlib` import.
type OrbitControlsHandle = ComponentRef<typeof OrbitControls>;

function Rig() {
  const { scene } = useGLTF(RIG_URL);
  return <primitive object={scene} />;
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div
        className="font-mono tracking-wider text-sm"
        style={{ color: '#E0E0E0' }}
      >
        LOADING {Math.round(progress)}%
      </div>
    </Html>
  );
}

// After GLB loads and Stage auto-frames the camera, persist that pose as the
// OrbitControls saved state so reset() restores the framed view instead of
// the original camera-prop position.
function SaveInitialView() {
  const controls = useThree((s) => s.controls) as OrbitControlsHandle | null;
  useEffect(() => {
    if (!controls) return;
    // Stage frames in useLayoutEffect; defer a frame so we capture the framed pose.
    const id = requestAnimationFrame(() => controls.saveState());
    return () => cancelAnimationFrame(id);
  }, [controls]);
  return null;
}

export default function RigViewer() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControlsHandle | null>(null);
  const [isActive, setIsActive] = useState(false);

  // Has the user touched the camera since the last reset/activation?
  // Set by OrbitControls' onChange (gated on isActive — see comment there).
  // Cleared after any programmatic reset() call.
  const isDirtyRef = useRef(false);

  // Tracks the previous isActive value so the deactivation effect below can
  // detect a true → false edge without firing on initial mount.
  const prevActiveRef = useRef(false);

  // Click-to-activate: scroll only zooms when the user explicitly engages,
  // so passing the cursor through the canvas mid-page-scroll doesn't hijack scroll.
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      const wrap = wrapperRef.current;
      if (!wrap) return;
      setIsActive(wrap.contains(e.target as Node));
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  // Wheel capture: gate page scroll based on the active state. MUST be a
  // native listener with { passive: false } — React's synthetic onWheel is
  // passive by default and silently ignores preventDefault(). This sits in
  // ADDITION to OrbitControls' enableZoom={isActive}: enableZoom decides
  // whether the wheel zooms the camera; this listener decides whether the
  // wheel also scrolls the page.
  useEffect(() => {
    const wrap = wrapperRef.current;
    if (!wrap) return;
    const onWheel = (e: WheelEvent) => {
      if (!isActive) return; // inactive → let page scroll normally
      e.preventDefault();
      e.stopPropagation();
    };
    wrap.addEventListener('wheel', onWheel, { passive: false });
    return () => wrap.removeEventListener('wheel', onWheel);
  }, [isActive]);

  // Reset camera when the viewer re-enters the viewport after being scrolled out.
  useEffect(() => {
    const wrap = wrapperRef.current;
    if (!wrap) return;
    // Seed truthy so the initial "first paint, already visible" fire doesn't
    // trigger a reset before the user has interacted.
    let wasIntersecting = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !wasIntersecting) {
          controlsRef.current?.reset();
          isDirtyRef.current = false; // any reset zeros the dirty flag
        }
        wasIntersecting = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, []);

  // Reset camera on the active → inactive transition, but only if the user
  // actually moved the camera. Activate-then-deactivate with no manipulation
  // leaves the framing alone.
  useEffect(() => {
    if (prevActiveRef.current && !isActive) {
      if (isDirtyRef.current) {
        controlsRef.current?.reset();
        isDirtyRef.current = false;
      }
    }
    prevActiveRef.current = isActive;
  }, [isActive]);

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full h-[600px] bg-[#0A0A0A] rounded-lg overflow-hidden border transition-colors duration-200 ${
        isActive ? 'border-[#500000]/60' : 'border-[#500000]/20'
      }`}
    >
      <Canvas
        // ── ADJUSTABLE: camera framing ──
        camera={{ position: [4, 3, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        shadows
      >
        <Suspense fallback={<Loader />}>
          <Stage
            // ── ADJUSTABLE: lighting environment preset
            //    options: 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' |
            //             'apartment' | 'studio' | 'city' | 'park' | 'lobby'
            environment="warehouse"
            // ── ADJUSTABLE: lighting intensity (0–2 typical)
            intensity={0.4}
            shadows={{ type: 'contact', opacity: 0.5, blur: 2 }}
            // ── ADJUSTABLE: padding around the model (1.0 = tight, 2.0 = loose)
            adjustCamera={1.2}
          >
            <Rig />
          </Stage>
          {/* Captures the Stage-framed pose as the OrbitControls reset target. */}
          <SaveInitialView />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          makeDefault
          // Mark the camera dirty on any user-driven change. The isActive gate
          // is the key filter: the user can only manipulate the camera when
          // active, so onChange events fired during programmatic reset() (which
          // we only call after deactivation or on intersection re-entry, both
          // typically isActive=false) are filtered out automatically.
          onChange={() => {
            if (isActive) isDirtyRef.current = true;
          }}
          enableDamping
          dampingFactor={0.05}
          // Scroll-zoom is gated by the click-to-activate state.
          enableZoom={isActive}
          // Pan is enabled and screen-aligned (more intuitive than world-aligned).
          // OrbitControls automatically switches LEFT-drag → PAN when the user
          // holds Ctrl (or Meta / Shift) during the gesture, as long as enablePan
          // is true. RIGHT-drag always pans as a fallback for non-Ctrl muscle memory.
          enablePan
          // ── ADJUSTABLE: pan speed (1.0 default; lower = slower)
          panSpeed={1.0}
          screenSpacePanning
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN,
          }}
          // ── ADJUSTABLE: zoom limits (world units)
          //    minDistance=0.01 lets the user zoom into individual components
          //    without hitting a wall (true 0 breaks three's camera math).
          minDistance={0.01}
          maxDistance={20}
          // ── ADJUSTABLE: polar angle limits
          //    minPolarAngle=0 means user can look straight down from above
          //    maxPolarAngle=Math.PI/1.8 prevents going below the ground plane
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>

      {/* Controls legend (top-right, only when active) */}
      {isActive && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-3 right-3 font-mono text-xs px-2 py-1 text-[#E0E0E0]/40 text-right leading-snug space-y-0.5"
        >
          <div>Drag: orbit</div>
          <div>Ctrl+Drag: pan</div>
          <div>Scroll: zoom</div>
        </div>
      )}

      {/* Activation hint (bottom-right) — pointer-events:none so it can't intercept clicks */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 right-3 font-mono text-xs px-2 py-1 text-[#E0E0E0]/40 transition-opacity duration-200"
      >
        {isActive ? 'Click outside to exit' : 'Click to activate'}
      </div>
    </div>
  );
}

// Pre-warm the GLB + Draco decoder so the first interaction feels snappier
useGLTF.preload(RIG_URL);
