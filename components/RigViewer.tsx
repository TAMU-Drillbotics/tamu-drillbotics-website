'use client';

import { Suspense, useEffect, useRef, useState, type ComponentRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF, Html, useProgress, type StageProps } from '@react-three/drei';
import { useIsMobile } from '@/hooks/useIsMobile';
import { GRID_PX } from '@/lib/rigCapture';

// Draco decoder hosted by Google — required because the GLB was Draco-compressed
// during the Fusion 360 → USDZ → Blender → glTF export pipeline.
useGLTF.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

const RIG_URL = '/models/rig.glb';

// Turns off the `observe` on the <Bounds> that <Stage> wraps the model in.
//
// With `observe` on, every canvas resize runs a full Box3.setFromObject()
// traversal of the entire model — inside a useLayoutEffect, i.e. synchronously
// between scroll and paint. The hero no longer animates the panel's size, so
// this is no longer per-frame, but it still fires on every window resize for
// no benefit: the rig is static and already framed. The initial fit is
// unaffected: <Stage>'s own <Refit> still fits once the model is centered, and
// Bounds always refreshes on first mount regardless of `observe`.
//
// Passed untyped because drei's <Stage> forwards its rest props to <Bounds>
// (core/Stage.js) but declares that rest as <group> props, so `observe` isn't
// in StageProps. Verified against @react-three/drei 10.7.x.
const DISABLE_BOUNDS_OBSERVE = { observe: false } as unknown as Partial<StageProps>;

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

// ── ADJUSTABLE: how far up the rig sits in the frame, as a fraction of frame
// height (0 = no shift, 0.12 ≈ 12% up). The rig's bottom was being clipped.
const FRAME_SHIFT = 0.04;

// Capture mode (?capture=1): used by scripts/render-rig-video.mjs to drive
// the rig through deterministic camera angles for offline video pre-rendering.
// Disables auto-rotate and exposes window.__setRigAngle(rad) so Puppeteer
// can advance frame-by-frame, plus window.__rigReady once the GLB has loaded
// and the camera is in its Stage-framed starting pose.
function CaptureController() {
  const camera = useThree((s) => s.camera);
  const initialRef = useRef<{ r: number; phase: number } | null>(null);
  const readyRef = useRef(false);

  useFrame(() => {
    if (!initialRef.current) {
      const x = camera.position.x;
      const z = camera.position.z;
      const r = Math.sqrt(x * x + z * z);
      if (r < 0.01) return; // Stage hasn't framed yet
      const phase = Math.atan2(z, x);
      initialRef.current = { r, phase };
    }
    if (!readyRef.current && initialRef.current) {
      readyRef.current = true;
      (window as unknown as { __rigReady: boolean }).__rigReady = true;
    }
  });

  useEffect(() => {
    const win = window as unknown as {
      __setRigAngle?: (delta: number) => boolean;
      __rigReady?: boolean;
    };
    win.__setRigAngle = (deltaAngle: number) => {
      if (!initialRef.current) return false;
      const { r, phase } = initialRef.current;
      const angle = phase + deltaAngle;
      camera.position.x = r * Math.cos(angle);
      camera.position.z = r * Math.sin(angle);
      camera.lookAt(0, 0, 0);
      return true;
    };
    return () => {
      delete win.__setRigAngle;
      delete win.__rigReady;
    };
  }, [camera]);

  return null;
}

// Mobile-only camera auto-rotate. OrbitControls.connect() forcibly sets
// `style.touchAction = 'none'` on the underlying <canvas> from inside three.js,
// which overrides any CSS we try to apply and blocks vertical page scroll
// whenever a finger lands on the rig. We sidestep that by skipping
// OrbitControls entirely on mobile and orbiting the camera manually with
// useFrame. No event listeners are attached to the canvas, so touch flows
// through to the page.
//
// Clamping delta is critical on iOS Safari: when the user scrolls, the
// browser pauses RAF for the entire scroll + post-scroll address-bar settle
// window (often 200–1000ms). When RAF resumes, useFrame's `delta` reports
// that whole gap as a single frame's worth of time. Without a clamp we
// either snap forward by a huge angle (visible "skip") or — with the cos/sin
// math — wrap past and look frozen until the next frame catches up. Clamping
// to ~50ms makes the rig pick up from where it left off, eliminating both
// the perceived pause and the jump.
function MobileAutoRotate({ speed = 0.25 }: { speed?: number }) {
  const camera = useThree((s) => s.camera);
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const angle = dt * speed;
    const dx = camera.position.x;
    const dz = camera.position.z;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    // Orbit around the Y axis at origin (Stage centers the rig at the world origin).
    camera.position.x = dx * cosA - dz * sinA;
    camera.position.z = dx * sinA + dz * cosA;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// Nothing in this scene ever moves: the rig is a static GLB, and only the
// camera is animated. three, however, re-renders the spotlight's 1024²
// shadow map on EVERY frame, re-submitting the whole model's geometry each
// time. Let the scene settle — <Stage> repositions its lights once <Center>
// reports the model's radius, which takes a few frames — then freeze the
// shadow map. The camera orbiting doesn't invalidate it; shadow maps are
// rendered from the light, not the viewer.
function FreezeShadowMap({ settleFrames = 90 }: { settleFrames?: number }) {
  const frames = useRef(0);
  const shadowMap = useRef<THREE.WebGLRenderer['shadowMap'] | null>(null);

  // Reads the renderer off the frame state rather than closing over
  // useThree()'s value — same object, but it keeps the mutation out of a
  // captured hook result.
  useFrame((state) => {
    shadowMap.current = state.gl.shadowMap;
    if (frames.current < settleFrames) {
      frames.current++;
      return;
    }
    if (state.gl.shadowMap.autoUpdate) {
      state.gl.shadowMap.autoUpdate = false;
      state.gl.shadowMap.needsUpdate = true; // one final pass, then never again
    }
  });

  // This subtree sits under <Suspense>; if it ever re-suspends, hand shadow
  // updates back so the reloaded scene gets a correct map before we re-freeze.
  useEffect(
    () => () => {
      if (shadowMap.current) shadowMap.current.autoUpdate = true;
    },
    [],
  );

  return null;
}

// Pushes the rendered image up within the black frame so the rig's bottom
// (and its contact shadow) isn't clipped.
//
// Earlier attempts moved the camera or the model — both failed because
// <Stage> wraps the rig in drei's <Bounds>, which RE-FRAMES the rig (moving
// the camera + OrbitControls target) whenever it re-fits, overwriting any
// transform-based nudge.
//
// This instead uses the camera's *view offset* — part of the projection
// matrix, not the camera transform. <Bounds> never touches it, so the shift
// survives every re-frame.
//
// Note: setViewOffset() also forces camera.aspect = fullWidth/fullHeight, so
// it MUST be passed the real canvas dimensions (not 1,1 — that squares the
// aspect and stretches the render) and re-applied whenever the canvas resizes.
function FrameShift() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const { width, height } = size;
    // Positive offsetY shifts the frustum window down → content renders higher.
    // Scaling the offset by height keeps the shift a constant fraction of the
    // frame regardless of resolution.
    cam.setViewOffset(width, height, 0, height * FRAME_SHIFT, width, height);
    cam.updateProjectionMatrix();
    return () => {
      cam.clearViewOffset();
      cam.updateProjectionMatrix();
    };
  }, [camera, size]);
  return null;
}

export default function RigViewer({ captureMode = false }: { captureMode?: boolean } = {}) {
  const isMobile = useIsMobile();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControlsHandle | null>(null);

  // Is the viewer anywhere near the screen?
  //
  // A <Canvas> does NOT pause itself when scrolled away. Left alone, this one
  // renders three full traversals of the rig's geometry on every frame, for
  // the entire life of the page — the spotlight's shadow map, ContactShadows'
  // depth pass (plus four fullscreen blurs), and the scene itself, at up to
  // 2× DPR with MSAA. That is the whole frame budget on an integrated GPU,
  // which is why scrolling stutters *page-wide* — including down in § 04/§ 05
  // where the rig is thousands of pixels off screen. Gate the loop instead.
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const wrap = wrapperRef.current;
    if (!wrap) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: '200px', // resume just before it scrolls back in
    });
    io.observe(wrap);
    return () => io.disconnect();
  }, []);

  // Wheel routing: plain wheel scrolls the page, Ctrl/Cmd + wheel zooms.
  //
  // This replaces the old click-to-activate gate. Entering live 3D is now an
  // explicit choice made on the mode switch, so a second in-canvas activation
  // step is redundant — but the underlying conflict it solved is not: with
  // zoom simply left on, scrolling the page with the cursor over the canvas
  // would dolly the camera instead, trapping the user in the hero.
  //
  // Drag is unambiguous and stays unconditional; only the wheel is arbitrated,
  // by modifier, the same convention embedded maps use:
  //   - unmodified → stopPropagation() in the CAPTURE phase, so the event
  //     never reaches OrbitControls' listener on the canvas. preventDefault is
  //     NOT called, so the page scrolls normally.
  //   - Ctrl/Cmd    → preventDefault() to suppress the browser's page-zoom,
  //     then let it through to OrbitControls untouched.
  //
  // MUST be a native listener with { passive: false } — React's synthetic
  // onWheel is passive by default and silently ignores preventDefault().
  useEffect(() => {
    const wrap = wrapperRef.current;
    if (!wrap) return;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        return;
      }
      e.stopPropagation();
    };
    wrap.addEventListener('wheel', onWheel, { passive: false, capture: true });
    return () => wrap.removeEventListener('wheel', onWheel, { capture: true });
  }, []);

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
        }
        wasIntersecting = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      // The border and corner rounding are chrome for the live viewer, and
      // must NOT be drawn in capture mode: /capture-rig renders this component
      // edge-to-edge at 1080x1080, so a 1px maroon border lands on the outer
      // pixel column/row of every captured frame and gets baked into the
      // turntable video — which then shows two maroon lines floating at the
      // letterbox seams once the video is letterboxed into a wider panel.
      className={`relative w-full h-full bg-[#1A1A1A] ${
        captureMode ? '' : 'rounded-lg overflow-hidden border border-[#500000]/60'
      }`}
    >
      {/* Engineering grid — faint background layer behind the 3D model.
          Sits before the (transparent, alpha:true) Canvas in DOM order so the
          canvas paints over it; line spacing ~matches the site's coarse grid.
          RigStage's video panel re-derives its own grid from GRID_PX so the
          baked grid and the CSS one line up — keep them in sync. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(250,250,250,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(250,250,250,0.04) 1px, transparent 1px)',
          backgroundSize: `${GRID_PX}px ${GRID_PX}px`,
        }}
      />

      <Canvas
        // ── ADJUSTABLE: camera framing ──
        // <Stage>/<Bounds> auto-fits the distance; only this vector's
        // DIRECTION matters (azimuth ~73°, elevation ~13°).
        camera={{ position: [2.39, 0.59, 0.75], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        shadows
        // The panel is a fixed-size box now, so the only resizes left are real
        // ones: window resize, and on iOS the address-bar collapse firing a
        // burst of them mid-scroll. Debounce absorbs the burst — each resize
        // costs a full WebGLRenderer.setSize(), i.e. reallocating the MSAA
        // drawing buffer and shadow targets.
        //
        // This was debounce:0 while the hero animated the panel's `top`; that
        // forced a re-measure every scroll frame, which is precisely the cost
        // the static layout removes. Do not reintroduce a size animation here.
        resize={{ debounce: 200 }}
        // 'never' halts the loop entirely while off screen (the canvas keeps
        // its last drawn frame, and the scene is static, so there is nothing
        // to catch up on when it resumes). Capture mode always renders — the
        // Puppeteer script in scripts/render-rig-video.mjs steps the camera
        // frame by frame and needs the loop running to draw each angle.
        frameloop={captureMode || inView ? 'always' : 'never'}
      >
        <Suspense fallback={<Loader />}>
          <Stage
            // ── ADJUSTABLE: lighting environment preset
            //    options: 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' |
            //             'apartment' | 'studio' | 'city' | 'park' | 'lobby'
            environment="warehouse"
            // ── ADJUSTABLE: lighting intensity (0–2 typical)
            intensity={0.4}
            // `frames` caps drei's ContactShadows, which otherwise re-renders
            // its depth pass + four fullscreen blurs on every single frame,
            // forever. The rig never moves and the shadow is cast from a fixed
            // overhead orthographic camera, so it is identical on frame 60 and
            // frame 60,000 — render it while the scene settles, then stop.
            shadows={{ type: 'contact', opacity: 0.5, blur: 2, frames: 60 }}
            // ── ADJUSTABLE: padding around the model (1.0 = tight, 2.0 = loose)
            adjustCamera={1.2}
            {...DISABLE_BOUNDS_OBSERVE}
          >
            <Rig />
          </Stage>
          {/* Captures the Stage-framed pose as the OrbitControls reset target. */}
          <SaveInitialView />
          {/* Lifts the rendered rig up in the frame so its bottom isn't clipped. */}
          <FrameShift />
          {/* Stops re-rendering the spotlight's shadow map once it's settled. */}
          <FreezeShadowMap />
        </Suspense>

        {/* Mobile: skip OrbitControls (its connect() forces touch-action:none
            on the canvas which blocks page scroll). Rotate via useFrame instead. */}
        {!captureMode && isMobile && <MobileAutoRotate />}

        {/* Capture mode: deterministic angle setter for offline video render. */}
        {captureMode && <CaptureController />}

        {!captureMode && !isMobile && <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.05}
          // Always on. The wheel-routing listener on the wrapper decides
          // whether OrbitControls ever sees a wheel event at all (Ctrl/Cmd
          // held), so this no longer needs to gate scroll behaviour itself.
          enableZoom
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
        />}
      </Canvas>

      {/* Controls legend (top-right, desktop only). Always shown now — there
          is no activation step left to discover, so the legend is the only
          thing telling the user the wheel needs Ctrl/Cmd to zoom.
          `!captureMode` is load-bearing: /capture-rig renders this component
          at desktop width, so anything drawn here gets burned into every
          frame of the baked turntable video. The old activation hint was not
          gated and is visible in the currently-shipped rig-loop.mp4. */}
      {!captureMode && !isMobile && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-3 right-3 font-mono text-xs px-2 py-1 text-[#E0E0E0]/40 text-right leading-snug space-y-0.5"
        >
          <div>Drag: orbit</div>
          <div>Right-drag: pan</div>
          <div>Ctrl+Scroll: zoom</div>
        </div>
      )}
    </div>
  );
}

// Pre-warm the GLB + Draco decoder so the first interaction feels snappier
useGLTF.preload(RIG_URL);
