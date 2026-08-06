import Link from "next/link";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { TimelineOrchestrator, useTimelineBeat } from "@/components/TimelineOrchestrator";
import { ENGINEERING_HERO_TIMELINE } from "@/lib/engineeringHeroTimeline";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useInView } from "@/hooks/useInView";

// 3D rig viewer — client-only (three.js + WebGL). Pulsing skeleton matches the
// viewer's dimensions so layout doesn't jump while the chunk + GLB load.
const RigViewer = dynamic(() => import("@/components/RigViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#0A0A0A] rounded-lg overflow-hidden border border-[#500000]/20 animate-pulse" />
  ),
});

/* ════════ shared motion presets ════════ */
const REVEAL = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" } as const,
  transition: { duration: 0.5, ease: "easeOut" as const },
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" } as const,
  transition: { duration: 0.45, delay, ease: "easeOut" as const },
});

// Variants for the § 05 DATA section. The grid wrapper triggers the whole
// sequence via whileInView; children inherit and animate from their own
// variants so the chained delays preserve the desktop timing on mobile too.
//
// Keep the chained delays below tight. `pathLength` animates via
// stroke-dasharray/dashoffset, which repaints on the main thread — so the
// length of this ladder is literally how long the section competes with
// scrolling for main-thread time. The trigger fires at amount: 0.05, i.e.
// while the user is still scrolling toward the section, so a four-second
// ladder (the original) spent all four seconds repainting three SVGs during
// the scroll that brought it into view. ~2s total reads the same and costs
// half as much.
const DATA_CARD_VARIANTS = (delay: number) => ({
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay, ease: "easeOut" as const },
  },
});
const DATA_PATH_VARIANTS = (delay: number, duration = 0.9) => ({
  hidden: { pathLength: 0 },
  visible: {
    pathLength: 1,
    transition: { duration, delay, ease: [0.16, 1, 0.3, 1] as const },
  },
});
const DATA_BOX_VARIANTS = (delay: number) => ({
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, delay, ease: [0.16, 1, 0.3, 1] as const },
  },
});
const DATA_FADE_VARIANTS = (delay: number, duration = 0.3) => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration, delay, ease: "easeOut" as const } },
});

/* ════════ small helpers ════════ */
function Reg({ pos, light = false }: { pos: "tl" | "tr" | "bl" | "br"; light?: boolean }) {
  const place =
    pos === "tl"
      ? "left-[42px] top-[42px]"
      : pos === "tr"
      ? "right-[42px] top-[42px]"
      : pos === "bl"
      ? "left-[42px] bottom-[42px]"
      : "right-[42px] bottom-[42px]";
  const color = light ? "bg-[#ffffff8a]" : "bg-ink-4";
  return (
    <span className={`hidden md:block absolute w-3.5 h-3.5 ${place}`} aria-hidden="true">
      <span className={`absolute left-0 right-0 top-1/2 h-px ${color}`} />
      <span className={`absolute top-0 bottom-0 left-1/2 w-px ${color}`} />
    </span>
  );
}

function SectionBar({
  num,
  label,
  dark = false,
}: {
  num: string;
  label: string;
  dark?: boolean;
}) {
  const tag = dark ? "text-[#FAFAFA]" : "text-ink";
  const numColor = dark ? "text-amber" : "text-maroon";
  const rule = dark ? "bg-[#ffffff1f]" : "bg-rule-strong";
  return (
    <div className="max-w-[1440px] mx-auto px-5 md:px-14">
      <div className="flex items-center gap-[18px] py-3.5 font-mono text-[10px] tracking-[.18em] uppercase">
        <motion.span
          className={`inline-flex items-baseline gap-2.5 font-medium ${tag}`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <span className={`font-medium ${numColor}`}>&sect; {num}</span> &middot; {label}
        </motion.span>
        <motion.span
          className={`flex-1 h-px origin-center ${rule}`}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}


function SecEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="inline-flex items-center gap-3 font-mono text-[11px] tracking-[.18em] uppercase text-ink-2 mb-[22px]"
      {...fadeUp(0)}
    >
      <span
        className="w-[7px] h-[7px] rounded-full bg-maroon"
        style={{ boxShadow: "0 0 0 3px rgba(80,0,0,0.125)" }}
      />
      <span>{children}</span>
    </motion.div>
  );
}

function SecTitle({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      {...fadeUp(0.08)}
      className="font-heading font-semibold text-[36px] md:text-[72px] leading-[.94] tracking-[-.02em] m-0 text-ink"
    >
      {children}
    </motion.h2>
  );
}

// Minimal status chip for sections describing planned-but-not-yet-deployed
// systems (e.g. the ML control loop, sensor-fusion pipeline). Reuses the
// existing `amber-pulse` keyframe so it reads as a live status indicator,
// not ornamentation.
function RoadmapChip() {
  return (
    <motion.div
      {...fadeUp(0.04)}
      className="inline-flex items-center gap-2 border border-amber/60 px-2.5 py-1 font-mono text-[10px] tracking-[.22em] uppercase text-ink-2 mb-5"
    >
      <span
        aria-hidden="true"
        className="inline-block w-1.5 h-1.5 rounded-full bg-amber"
        style={{
          boxShadow:
            '0 0 0 2px rgba(200,150,62,0.18), 0 0 6px rgba(200,150,62,0.55)',
          animation: 'amber-pulse 2.4s ease-in-out infinite',
        }}
      />
      <span>Planned &middot; Not yet deployed</span>
    </motion.div>
  );
}

/* ════════ § 04 — control-loop schematic ════════
   Split out of the page body so the marching-ants flow arrows can be gated on
   visibility. They animate `stroke-dashoffset`, which the compositor can't
   take: each frame is a main-thread re-raster of this whole 640×420 SVG,
   pattern-filled background grid and all. CSS animations aren't paused when
   they scroll off screen, so left alone this burns paint time for the entire
   life of the page — including while the user is scrolling somewhere else.
   `contain: paint` keeps the repaints from invalidating the surrounding card. */
function CtrlLoopDiagram() {
  const [ref, inView] = useInView<HTMLDivElement>({ rootMargin: "150px" });

  return (
    <div ref={ref} style={{ contain: "paint" }}>
      <svg className="block w-full h-auto" viewBox="0 0 640 420" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker
            id="loop-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="8"
            markerHeight="8"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 Z" fill="#500000" />
          </marker>
          <marker
            id="loop-arrow-amber"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="8"
            markerHeight="8"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 Z" fill="#C8963E" />
          </marker>
          <pattern id="loop-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="#1a1a1a09" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width="640" height="420" fill="url(#loop-grid)" />

        <text x="320" y="220" textAnchor="middle" fontFamily="Chakra Petch" fontSize="20" fontWeight="600" fill="#1A1A1A">
          1 kHz
        </text>
        <text x="320" y="260" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#a5a5a5" letterSpacing="3">
          CLOSED · DETERMINISTIC
        </text>

        {/* nodes */}
        {[
          { x: 50, y: 40, stage: "01", title: "SENSORS", sub: "7 CH · ACQ", maroonBorder: false, amber: false },
          { x: 240, y: 20, stage: "02", title: "CONDITION", sub: "FILTER · SCALE", maroonBorder: false, amber: false },
          { x: 430, y: 40, stage: "03", title: "P.I.D CORE", sub: "3-AXIS · COUPLED", maroonBorder: false, amber: false },
          { x: 430, y: 320, stage: "04", title: "M.L INFERENCE", sub: "ADVISORY · TRIM", maroonBorder: false, amber: true },
          { x: 240, y: 340, stage: "05", title: "COMMANDS", sub: "CAN · DISPATCH", maroonBorder: false, amber: false },
          { x: 50, y: 320, stage: "06", title: "DRILL", sub: "PHYSICAL · WORLD", maroonBorder: true, amber: false },
        ].map((n) => {
          const stroke = n.amber ? "#C8963E" : n.maroonBorder ? "#500000" : "#1A1A1A";
          const strokeWidth = n.maroonBorder ? 2 : 1.5;
          const stageFill = n.amber ? "#a07217" : "#500000";
          return (
            <g key={n.stage}>
              <rect x={n.x} y={n.y} width="160" height="60" fill="#fff" stroke={stroke} strokeWidth={strokeWidth} />
              <text x={n.x + 10} y={n.y + 18} fontFamily="JetBrains Mono" fontSize="9" fill={stageFill} letterSpacing="2">
                STAGE · {n.stage}
              </text>
              <text x={n.x + 10} y={n.y + 42} fontFamily="Chakra Petch" fontSize="16" fontWeight="600" fill="#1A1A1A">
                {n.title}
              </text>
              <text x={n.x + 10} y={n.y + 56} fontFamily="JetBrains Mono" fontSize="8" fill="#6b6b6b" letterSpacing="2">
                {n.sub}
              </text>
            </g>
          );
        })}

        {/* flow arcs */}
        {[
          "M210,70 L240,50",
          "M400,50 L430,70",
          "M510,100 L510,320",
          "M430,360 L400,370",
          "M240,370 L210,370",
          "M130,320 L130,100",
        ].map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="#500000"
            strokeWidth="1.5"
            strokeDasharray="6 6"
            markerEnd="url(#loop-arrow)"
            className="flow-dash"
            data-paused={!inView}
          />
        ))}

        {/* ML advisory arc */}
        <path
          d="M430,340 C 380,280 380,180 430,100"
          fill="none"
          stroke="#C8963E"
          strokeWidth="1.2"
          strokeDasharray="3 3"
          markerEnd="url(#loop-arrow-amber)"
        />
        <text x="20" y="412" fontFamily="JetBrains Mono" fontSize="9" fill="#a5a5a5" letterSpacing="2">
          DWG · CL-001
        </text>
        <text x="540" y="412" fontFamily="JetBrains Mono" fontSize="9" fill="#a5a5a5" letterSpacing="2">
          REV A
        </text>
      </svg>
    </div>
  );
}

/* ════════ § 01 — mech ════════ */
const mechRef: { group: string; rows: [string, string][] }[] = [
  {
    group: "Frame",
    rows: [
      ["Material", "6061-T6 AL"],
      ["Extrusion", "2 × 2 IN T-SLOT"],
      ["Platforms", "3-TIER"],
      ["Lift Capacity", "≈ 700 LB"],
      ["Total Height", "≈ 60 IN"],
    ],
  },
  {
    group: "Drillstring",
    rows: [
      ["Steering", "3-WING RSS"],
      ["Drive Shaft", "17-7 PH SS"],
      ["Drill Pipe", "FLEXIBLE NYLON"],
      ["Hyd. Pressure", "≈ 2000 PSI"],
      ["Bit", "1.75\" PDC"],
    ],
  },
];

/* ════════ § 03 — electronics ════════ */
type SensorRow = { id: string; measure: string; component: string; detail: string };
const sensors: SensorRow[] = [
  { id: "IMU-01", measure: "Orientation", component: "TDK ICM-20948", detail: "9-axis, in BHA" },
  { id: "DEP-01", measure: "Depth (TVD)", component: "LPPS-36B", detail: "Linear position" },
  { id: "TRQ-01", measure: "Torque", component: "FUTEK TFF400", detail: "Inline rotary" },
  { id: "RPM-01", measure: "Rotary Speed", component: "US Digital E6", detail: "Optical encoder" },
  { id: "WOB-01", measure: "Weight-on-Bit", component: "FUTEK LSB200", detail: "Load cell" },
  { id: "TMP-01", measure: "Temperature", component: "DS18B20", detail: "Thermal monitor" },
  { id: "VIB-01", measure: "Vibration", component: "ADXL356", detail: "MEMS, high-g" },
];

type ActuatorRow = { id: string; subsystem: string; component: string; detail: string };
const actuators: ActuatorRow[] = [
  { id: "ROT-01", subsystem: "Bit Rotation", component: "Maxon EC-i 40 BLDC", detail: "High torque density, closed-loop" },
  { id: "HST-01", subsystem: "Hoist · Z-Axis", component: "2× NEMA-23 + Ball Screw", detail: "Dual-motor synchronized lift" },
  { id: "HYD-01", subsystem: "Hydraulic Control", component: "Danfoss PVG32 Monoblock", detail: "Proportional flow control" },
  { id: "HYD-02", subsystem: "Wing Actuation", component: "3× Double-Acting Pistons", detail: "6 controllable ports" },
  { id: "CLT-01", subsystem: "Coolant Loop", component: "Seaflo 12 V DC Pump", detail: "Continuous-duty centrifugal" },
];


/* ═══════════════════════════════════════════════════════
   § 01 hero — orchestrated entrance + scroll-driven collapse
   ═══════════════════════════════════════════════════════

   Layout strategy:
   - The outer wrapper is 150dvh tall, giving the sticky stage 50dvh of
     scroll travel to consume before it releases and § 03 flows in.
   - The sticky stage pins at top: var(--nav-height), exactly the viewport
     minus the nav, so it is the only thing on screen while pinned.
   - The headline holds the stage's top 28vh; the render frame fills the
     rest. Scroll progress drives the headline up by -28vh while the render
     frame's top shrinks 28vh → 0, expanding into the freed space. Fully
     reversible by scrolling back up.
   - The entrance (headline wipe, render-frame fade) is a one-shot
     orchestrated sequence, independent of scroll.
   - prefers-reduced-motion: the entrance shows its final state at once;
     the scroll-driven collapse still works, being user-initiated. */

const HEADLINE_VH = 28;

// The sticky stage stays pinned for the first 50dvh of the 150dvh wrapper's
// scroll travel — scrollYProgress 0 → 1/3. The collapse completes within that
// window so the headline is fully cleared right as the stage releases.
const COLLAPSE_END = 1 / 3;

function RigHero() {
  const isMobile = useIsMobile();
  const headlineBeat = useTimelineBeat("headlineReveal");
  const frameBeat = useTimelineBeat("renderFrame");
  const reducedMotion = headlineBeat.reducedMotion;

  // Scroll-driven collapse. scrollYProgress (0 → 1) over the 150dvh wrapper
  // drives the headline out and the render frame up. Raw motion values bound
  // straight to style — no spring/smoothing layer (per spec; the resulting
  // wheel-step lag is a known issue, addressed separately).
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end start"],
  });
  const headlineY = useTransform(
    scrollYProgress,
    [0, COLLAPSE_END],
    ["0vh", `-${HEADLINE_VH}vh`],
  );
  const headlineOpacity = useTransform(scrollYProgress, [0, COLLAPSE_END], [1, 0]);
  const renderFrameTop = useTransform(
    scrollYProgress,
    [0, COLLAPSE_END],
    [`${HEADLINE_VH}vh`, "0vh"],
  );

  if (isMobile) {
    return (
      <section className="relative">
        <div className="max-w-[1440px] mx-auto px-5 pt-10 pb-4">
          <h1 className="font-heading font-bold text-[56px] leading-[.86] tracking-[-.025em] uppercase m-0 text-ink mb-3">
            <motion.span
              className="inline-block"
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{
                clipPath: headlineBeat.hasFired
                  ? "inset(0 0 0 0)"
                  : "inset(0 100% 0 0)",
              }}
              transition={{ duration: reducedMotion ? 0 : 0.5, ease: "easeOut" }}
            >
              The Rig<span className="text-maroon">.</span>
            </motion.span>
          </h1>
          {/* Mobile: pre-rendered turntable video instead of live WebGL.
              The full RigViewer (13 MB Draco-compressed GLB + warehouse HDRI
              + per-frame shading) was unplayably heavy on phones; this is the
              same camera path baked into a 2.9 MB MP4 / 5.1 MB WebM that costs
              the device almost nothing to play. Generated by
              scripts/render-rig-video.mjs. */}
          <motion.div
            className="w-full h-[60svh] bg-[#1A1A1A] rounded-lg overflow-hidden border border-[#500000]/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: frameBeat.hasFired ? 1 : 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.4, ease: "easeOut" }}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="block w-full h-full object-contain"
              aria-label="Autonomous drilling rig 3D model, turntable view"
            >
              <source src="/models/rig-loop.webm" type="video/webm" />
              <source src="/models/rig-loop.mp4" type="video/mp4" />
            </video>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section ref={wrapperRef} className="relative" style={{ height: "150dvh" }}>
      <div className="sticky top-[var(--nav-height)] h-[calc(100dvh-var(--nav-height))] max-w-[1440px] mx-auto px-5 md:px-14 pb-6">
        <div className="relative w-full h-full overflow-hidden">
          {/* Headline — slides up and fades out with scroll progress. A
              SIBLING of the render frame; its motion never touches the frame. */}
          <motion.div
            className="absolute left-0 right-0 top-0 flex flex-col justify-end"
            style={{
              height: `${HEADLINE_VH}vh`,
              y: headlineY,
              opacity: headlineOpacity,
            }}
          >
            {/* Registration crosses above the headline — same corner marks
                used to frame the § sections. Inside the headline wrapper, so
                they slide + fade out with it on scroll. */}
            <Reg pos="tl" />
            <Reg pos="tr" />
            <h1 className="font-heading font-bold text-[56px] md:text-[148px] leading-[.86] tracking-[-.025em] uppercase m-0 text-ink">
              <motion.span
                className="inline-block"
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{
                  clipPath: headlineBeat.hasFired
                    ? "inset(0 0 0 0)"
                    : "inset(0 100% 0 0)",
                }}
                transition={{ duration: reducedMotion ? 0 : 0.5, ease: "easeOut" }}
              >
                The Rig<span className="text-maroon">.</span>
              </motion.span>
            </h1>
          </motion.div>

          {/* Render frame — always mounted. `top` shrinks 28vh → 0 with scroll;
              opacity fades in once on the renderFrame beat, then holds at 1. */}
          <motion.div
            className="absolute left-0 right-0 bottom-0"
            style={{ top: renderFrameTop }}
            initial={{ opacity: 0 }}
            animate={{ opacity: frameBeat.hasFired ? 1 : 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.4, ease: "easeOut" }}
          >
            <RigViewer />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════ */
export default function Engineering() {
  return (
    <div
      className="flex flex-col bg-bg"
      style={{
        backgroundImage:
          "linear-gradient(to right, #1a1a1a15 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a15 1px, transparent 1px)",
        backgroundSize: "80px 80px",
        backgroundPosition: "-1px -1px",
      }}
    >
      <Nav />

      {/* ════════ § 01 — VISUALIZER (orchestrated entrance + scroll-driven collapse) ════════ */}
      <TimelineOrchestrator timeline={ENGINEERING_HERO_TIMELINE}>
        <RigHero />
      </TimelineOrchestrator>

      {/* ════════ § 01 — MECHANICAL ════════ */}
      <motion.section {...REVEAL}>
        <SectionBar num="01" label="MECHANICAL" />

        <div className="relative max-w-[1440px] mx-auto px-5 md:px-14 pt-12 md:pt-20 pb-16 md:pb-24">
          <Reg pos="tl" />
          <Reg pos="tr" />
          <Reg pos="bl" />
          <Reg pos="br" />

          <SecTitle>
            Materials, design, physics<span className="text-maroon">.</span>
          </SecTitle>

          <div className="grid grid-cols-1 md:grid-cols-[1.15fr_1fr] gap-y-8 gap-x-8 md:gap-x-16 items-start pt-8 md:pt-12">
            <motion.div {...fadeUp(0.1)}>
              <p className="text-[19px] leading-[1.55] text-ink font-medium m-0 mb-6">
                The rig is a model-scale autonomous drilling system — a vertical aluminum tower built to drill into an
                unknown rock block, then steer the bit through three target points with no human intervention.
              </p>
              <p className="text-[17px] leading-[1.6] text-ink-2 m-0 mb-[18px]">
                The frame is a modular tower of <strong className="text-ink font-semibold">6061-T6 aluminum 2-by-2-inch
                T-slot extrusion</strong>, joined with aluminum corner brackets and thread-locked fasteners. The modular T-slot 
                profile allows for customizable sensor mounting and reconfiguration. Three platforms carry the subsystems — a top 
                actuation deck, a mid-frame elevator carrying the drillstring and top-drive assembly, and a bottom platform for 
                fluid and cutting collection.
              </p>
              <p className="text-[17px] leading-[1.6] text-ink-2 m-0 mb-[18px]">
              <span className="text-amber">(tbd)</span> Vertical motion comes from two <strong className="text-ink font-semibold">NEMA-32 stepper motors </strong>
                driving lead screws; sharing the load gives a lift capacity near 700 lb and sets weight-on-bit through the
                elevator platform. (tbd)
              </p>
              <p className="text-[17px] leading-[1.6] text-ink-2 m-0">
              <span className="text-amber">(tbd)</span> Steering uses a hydraulically actuated <strong className="text-ink font-semibold">push-the-bit rotary
                steerable system</strong> — three independently controlled wings, each driven by a dedicated piston near
                2000 psi, biasing the bit toward the commanded direction. Safety is built into the structure: a
                polycarbonate enclosure contains debris, door interlocks gate operation, a hardware-and-software E-stop
                cuts power, and the hydraulic seals are sized to fail before any structural component does.
              </p>
            </motion.div>

            <motion.div {...fadeUp(0.2)}>
              <div className="border border-rule-strong bg-white">
                <div className="px-[18px] py-3.5 border-b border-rule-strong flex items-center justify-between font-mono text-[10.5px] tracking-[.18em] uppercase text-ink-3">
                  <span className="text-ink font-medium">MECH-REF-01</span>
                  <span>Components</span>
                </div>
                {mechRef.map(({ group, rows }) => (
                  <div key={group}>
                    <div className="px-[18px] pt-3.5 pb-1.5 font-mono text-[10px] tracking-[.22em] uppercase text-maroon border-b border-rule">
                      {group}
                    </div>
                    <ul className="list-none m-0 p-0">
                      {rows.map(([k, v]) => (
                        <li
                          key={k}
                          className="grid grid-cols-[1fr_auto] gap-6 items-baseline px-[18px] py-[11px] border-b border-dashed border-rule-strong last:border-b-0 font-mono text-[10.5px] tracking-[.14em] uppercase"
                        >
                          <span className="text-ink-3">{k}</span>
                          <span className="font-heading text-[13px] font-medium tracking-[.04em] text-ink text-right">
                            {v}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="px-[18px] py-3 border-t border-rule-strong flex items-center justify-between font-mono text-[10px] tracking-[.18em] uppercase text-ink-4">
                  <span>Reference Sheet</span>
                  <span className="text-ink-2">REV A · 05/26</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* frame assembly drawing */}
          <motion.div
            {...fadeUp(0.18)}
            className="mt-10 border border-rule-strong bg-white"
          >
            <div className="px-[18px] py-3.5 border-b border-rule-strong flex items-center justify-between font-mono text-[10.5px] tracking-[.18em] uppercase text-ink-3">
              <span className="text-ink font-medium">MECH-WF-01</span>
              <span>Frame Assembly Drawing</span>
            </div>
            <div className="p-6">
              <img
                src="/rig-pictures/rig-drawing-report.png"
                alt="Engineering drawing of the rig frame — dimensioned front elevation and isometric view"
                className="block mx-auto w-full max-w-[760px] h-auto"
              />
            </div>
            <div className="px-[18px] py-3 border-t border-rule-strong flex items-center justify-between font-mono text-[10px] tracking-[.18em] uppercase text-ink-4">
              <span>Drawn &middot; B. Chacon</span>
              <span className="text-ink-2">09 / 18 / 25</span>
            </div>
          </motion.div>

          {/* drillstring assembly render — source image is portrait; rotated
              90° into a horizontal strip via a swapped-dimension wrapper. */}
          <motion.div
            {...fadeUp(0.22)}
            className="mt-10 border border-rule-strong bg-white"
          >
            <div className="px-[18px] py-3.5 border-b border-rule-strong flex items-center justify-between font-mono text-[10.5px] tracking-[.18em] uppercase text-ink-3">
              <span className="text-ink font-medium">MECH-DS-01</span>
              <span>Drillstring Assembly</span>
            </div>
            <div className="p-6">
              <div
                className="relative mx-auto w-full overflow-hidden"
                style={{ aspectRatio: "1117 / 209", maxWidth: "900px" }}
              >
                <img
                  src="/rig-pictures/rig-drillstring.png"
                  alt="Full drillstring assembly render — top drive, drive shaft, and bottom-hole assembly"
                  className="absolute left-1/2 top-1/2"
                  style={{
                    height: "534.45%",
                    width: "auto",
                    maxWidth: "none",
                    transform: "translate(-50%, -50%) rotate(90deg)",
                  }}
                />
              </div>
            </div>
            <div className="px-[18px] py-3 border-t border-rule-strong flex items-center justify-between font-mono text-[10px] tracking-[.18em] uppercase text-ink-4">
              <span>Drillstring &middot; Full Assembly</span>
              <span className="text-ink-2">CAD · Render</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ════════ § 02 — STEERING ════════ */}
      <motion.section {...REVEAL}>
        <SectionBar num="02" label="STEERING" />

        <div className="relative max-w-[1440px] mx-auto px-5 md:px-14 pt-12 md:pt-20 pb-16 md:pb-24">
          <Reg pos="tl" />
          <Reg pos="tr" />
          <Reg pos="bl" />
          <Reg pos="br" />

          <SecTitle>
            Three wings, one trajectory<span className="text-maroon">.</span>
          </SecTitle>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-y-8 gap-x-8 md:gap-x-16 items-start pt-8 md:pt-12">
            <motion.div {...fadeUp(0.1)}>
              <p className="text-[19px] leading-[1.55] text-ink font-medium m-0 mb-6">
                Steering. Once the bit enters the rock, a rotary steerable system bends
                the well toward three target points — no tripping the string, no human intervention.
              </p>
              <p className="text-[17px] leading-[1.6] text-ink-2 m-0 mb-[18px]">
                The RSS is a <strong className="text-ink font-semibold">push-the-bit</strong> design: three steering
                wings spaced evenly around the bottom-hole assembly, each driven by its own hydraulic piston. A wedge
                mechanism converts piston extension into radial wing deployment, forcing the wing against the wellbore
                wall — and the reaction force biases the bit toward the commanded direction.
              </p>
              <p className="text-[17px] leading-[1.6] text-ink-2 m-0 mb-[18px]">
                Each wing is controlled independently through a hydraulic block that monitors flow and pressure. Those
                readings estimate actuation force and wing extension, which in turn resolve the bit&apos;s toolface and
                orientation relative to the formation. Fully retracted, the wing tips sit slightly proud of the BHA to
                double as drilling stabilizers.
              </p>
              <p className="text-[17px] leading-[1.6] text-ink-2 m-0">
                High-pressure hydraulics demand a deliberate failure mode. Yor-Lok fittings and stainless tubing carry
                margin to roughly 9000 psi against a ~2000 psi working pressure, while the U-Cup piston seals are sized
                as a <strong className="text-ink font-semibold">mechanical fuse</strong> — the weakest pressure
                boundary, designed to fail before any machined steel component does.
              </p>
            </motion.div>

            <motion.div {...fadeUp(0.2)}>
              <div className="border border-rule-strong bg-white">
                <div className="px-[18px] py-3.5 border-b border-rule-strong flex items-center justify-between font-mono text-[10.5px] tracking-[.18em] uppercase text-ink-3">
                  <span className="text-ink font-medium">RSS-XS-01</span>
                  <span>Cross-Section</span>
                </div>
                <div className="p-6">
                  <img
                    src="/rig-pictures/rig-rss.png"
                    alt="Cross-section of the rotary steerable system — drill pipe, high-pressure fitting, hydraulic piston, steering wing, and driveshaft"
                    className="block mx-auto w-full h-auto"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ════════ § 03 — ELECTRONICS ════════ */}
      <motion.section {...REVEAL}>
        <SectionBar num="03" label="ELECTRONICS" />

        <div className="relative max-w-[1440px] mx-auto px-5 md:px-14 pt-12 md:pt-20 pb-16 md:pb-24">
          <Reg pos="tl" />
          <Reg pos="tr" />
          <Reg pos="bl" />
          <Reg pos="br" />

          <SecTitle>
            From signal to actuator<span className="text-maroon">.</span>
          </SecTitle>

          <div className="grid grid-cols-1 md:grid-cols-[1.15fr_1fr] gap-y-8 gap-x-8 md:gap-x-16 items-start pt-8 md:pt-12">
            <motion.div {...fadeUp(0.1)}>
              <p className="text-[19px] leading-[1.55] text-ink font-medium m-0 mb-6">
              Seven sensor channels turn the rig&apos;s physical behavior into a measured state — orientation, depth,
                torque, speed, weight-on-bit, temperature, and vibration — feeding the drives that steer and advance the
                bit.
              </p>
              <p className="text-[17px] leading-[1.6] text-ink-2 m-0 mb-[18px]">
              <span className="text-amber">(tbd)</span> The <strong className="text-ink font-semibold">sensor stack</strong> centers on a 9-axis ICM-20948 IMU in
                the bottom-hole assembly, an LPPS-36B linear sensor for true vertical depth, a FUTEK TFF400 inline torque
                sensor and US Digital E6 encoder at the drill motor, and a FUTEK LSB200 load cell reading weight-on-bit
                between the hoist and the string. A DS18B20 tracks temperature and an ADXL356 MEMS accelerometer catches
                high-g shock and vibration.
              </p>
              <p className="text-[17px] leading-[1.6] text-ink-2 m-0 mb-[18px]">
              <span className="text-amber">(tbd)</span> Actuation electronics close the loop around each motor. A <strong className="text-ink font-semibold">Maxon
                EPOS4 Compact</strong> drive runs the rotary BLDC over EtherCAT, while Leadshine iCS-RS closed-loop drives
                handle the hoist steppers. Hydraulic steering valves are positioned by a 16-bit ADC/DAC stage for
                proportional solenoid current, with every solenoid channel opto-isolated from the logic side.
              </p>   
              <p className="text-[17px] leading-[1.6] text-ink-2 m-0">
              <span className="text-amber">(tbd)</span> A <strong className="text-ink font-semibold">Raspberry Pi 4</strong> handles supervisory logging, UI, and
                diagnostics alongside a GPU-equipped main computer, with a custom PCB carrying the IMU/ADC front-end and a
                CAN-FD transceiver. Everything runs off a 24 V DC bus through isolated DC-DC modules, resettable fuses, and
                transient suppression. An optional Semtech SX1276 LoRa link is under evaluation to thin the wiring down the
                drillstring.
              </p>
            </motion.div>

            <motion.div {...fadeUp(0.2)}>
              <div className="flex items-baseline justify-between pb-3 font-mono text-[10px] tracking-[.22em] uppercase">
                <span className="text-maroon">Sensors</span>
                <span className="text-ink-3">7 Channels</span>
              </div>
              <table className="w-full border-separate border-spacing-0 border border-rule-strong bg-white font-mono">
                <thead>
                  <tr>
                    {["ID", "Measurement", "Component", "Detail"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-3.5 py-3 text-[9.5px] tracking-[.22em] uppercase text-maroon bg-[#fafafa] border-b border-rule-strong font-medium"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sensors.map((s, i) => (
                    <tr key={i}>
                      <td className="px-3.5 py-[11px] border-b border-dashed border-rule-strong last:border-b-0 font-heading text-[13px] font-medium text-ink tracking-[.04em] uppercase">
                        {s.id}
                      </td>
                      <td className="px-3.5 py-[11px] text-[11px] tracking-[.08em] uppercase border-b border-dashed border-rule-strong last:border-b-0 text-ink-2">
                        {s.measure}
                      </td>
                      <td className="px-3.5 py-[11px] text-[11px] tracking-[.08em] uppercase border-b border-dashed border-rule-strong last:border-b-0 text-ink-2">
                        {s.component}
                      </td>
                      <td className="px-3.5 py-[11px] text-[11px] tracking-[.08em] uppercase border-b border-dashed border-rule-strong last:border-b-0 text-ink-2">
                        {s.detail}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>

          {/* actuators table — mirrors the sensors table (report Table 2) */}
          <motion.div {...fadeUp(0.15)} className="mt-12">
            <div className="flex items-baseline justify-between pb-3 font-mono text-[10px] tracking-[.22em] uppercase">
              <span className="text-maroon">Actuators</span>
              <span className="text-ink-3">5 Drive Channels</span>
            </div>
            <table className="w-full border-separate border-spacing-0 border border-rule-strong bg-white font-mono">
              <thead>
                <tr>
                  {["ID", "Subsystem", "Component", "Detail"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3.5 py-3 text-[9.5px] tracking-[.22em] uppercase text-maroon bg-[#fafafa] border-b border-rule-strong font-medium"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {actuators.map((a, i) => (
                  <tr key={i}>
                    <td className="px-3.5 py-[11px] border-b border-dashed border-rule-strong last:border-b-0 font-heading text-[13px] font-medium text-ink tracking-[.04em] uppercase">
                      {a.id}
                    </td>
                    <td className="px-3.5 py-[11px] text-[11px] tracking-[.08em] uppercase border-b border-dashed border-rule-strong last:border-b-0 text-ink-2">
                      {a.subsystem}
                    </td>
                    <td className="px-3.5 py-[11px] text-[11px] tracking-[.08em] uppercase border-b border-dashed border-rule-strong last:border-b-0 text-ink-2">
                      {a.component}
                    </td>
                    <td className="px-3.5 py-[11px] text-[11px] tracking-[.08em] uppercase border-b border-dashed border-rule-strong last:border-b-0 text-ink-2">
                      {a.detail}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </motion.section>

      {/* ════════ § 04 — SOFTWARE ════════ */}
      <motion.section {...REVEAL}>
        <SectionBar num="04" label="SOFTWARE" />

        <div className="relative max-w-[1440px] mx-auto px-5 md:px-14 pt-12 md:pt-20 pb-16 md:pb-24">
          <Reg pos="tl" />
          <Reg pos="tr" />
          <Reg pos="bl" />
          <Reg pos="br" />

          <div>
            <RoadmapChip />
          </div>
          <SecTitle>
            Code that controls<span className="text-maroon">.</span>
          </SecTitle>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-y-8 gap-x-8 md:gap-x-16 items-start pt-8 md:pt-12">
            <motion.div {...fadeUp(0.1)}>
              <p className="text-[19px] leading-[1.55] text-ink font-medium m-0 mb-6">
                A real-time control loop closes around every revolution of the bit — embedded C on an STM32
                microcontroller, deterministic to the microsecond.
              </p>
              <p className="text-[17px] leading-[1.6] text-ink-2 m-0 mb-[18px]">
                The firmware layer runs priority-pinned tasks for sensor acquisition, control compute, and CAN dispatch.
                <strong className="text-ink font-semibold"> PID controllers</strong> regulate the coupled drilling axes —
                RPM, feed rate, and weight-on-bit — and drive the steering response that holds the bit on its commanded
                trajectory.
              </p>
              <p className="text-[17px] leading-[1.6] text-ink-2 m-0 mb-[18px]">
                An <strong className="text-ink font-semibold">ML interfacing layer</strong> pipes a downsampled sensor
                frame over high-speed serial to a co-processor running inference, then receives gain-trim and setpoint
                deltas back. The model never has direct authority — control authority always sits with the deterministic
                PID core, with the ML layer recommending, not commanding.
              </p>
              <p className="text-[17px] leading-[1.6] text-ink-2 m-0">
                Telemetry is broadcast over CAN to a <strong className="text-ink font-semibold">Raspberry Pi 4</strong>
                {" "}that handles logging, the operator UI, and diagnostics — capturing every run at 1 kHz for offline
                analysis and model training.
              </p>
            </motion.div>

            <motion.div {...fadeUp(0.2)}>
              <div className="border border-rule-strong bg-white relative">
                <div className="px-[18px] py-3.5 border-b border-rule flex items-center font-mono text-[10.5px] tracking-[.18em] uppercase text-ink-3">
                  <span className="text-ink">CTRL-LOOP</span>
                </div>

                <CtrlLoopDiagram />

                <div className="grid grid-cols-2 md:grid-cols-4 border-t border-rule">
                  {[
                    { k: "Sampling", v: "10", u: "kHz" },
                    { k: "Control", v: "1", u: "kHz" },
                    { k: "Latency", v: "< 800", u: "µs" },
                    { k: "Jitter", v: "12", u: "µs" },
                  ].map((s, i, arr) => (
                    <div
                      key={s.k}
                      className={`px-4 py-3.5 font-mono border-dashed border-rule-strong ${i < arr.length - 1 ? "md:border-r" : ""}`}
                    >
                      <span className="block text-[9.5px] tracking-[.22em] uppercase text-ink-3 mb-1.5">{s.k}</span>
                      <span className="font-heading text-[20px] font-semibold text-ink tracking-[.02em]">
                        {s.v}
                        <span className="font-mono text-[10px] text-ink-3 ml-1 tracking-[.16em]">{s.u}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ════════ § 05 — DATA ════════ */}
      <motion.section {...REVEAL}>
        <SectionBar num="05" label="DATA" />

        <div className="relative max-w-[1440px] mx-auto px-5 md:px-14 pt-12 md:pt-20 pb-16 md:pb-24">
          <Reg pos="tl" />
          <Reg pos="tr" />
          <Reg pos="bl" />
          <Reg pos="br" />

          <div>
            <RoadmapChip />
          </div>
          <SecTitle>
            Sensor fusion meets machine learning<span className="text-maroon">.</span>
          </SecTitle>

          {/* All animations in this section fire from the same parent
              viewport trigger so the chained delays sequence the same way on
              mobile (where the cards stack and each card alone wouldn't
              otherwise cover its individual viewport margin) as on desktop.
              Children just declare variants — they inherit "hidden" →
              "visible" from this parent. */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8 pt-8 md:pt-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
          >
            {/* D-01 */}
            <motion.div
              variants={DATA_CARD_VARIANTS(0.06)}
              className="border border-rule-strong bg-white p-6 flex flex-col"
            >
              <div className="font-mono text-[10px] tracking-[.22em] uppercase text-maroon mb-3.5">D-01 · Sensor Fusion</div>
              <h3 className="font-heading font-semibold text-[24px] text-ink m-0 mb-3.5 tracking-[.01em] leading-[1.05]">
                Unified state from messy reality.
              </h3>
              <p className="text-[15px] leading-[1.55] text-ink-2 m-0 mb-6">
                A Kalman-style estimator combines pressure, torque, RPM, depth, and IMU streams into a single bit-state
                vector — denoised, time-aligned, and physically-constrained. The fused estimate, not raw sensors, is what
                the controller and ML layer see.
              </p>
              <div className="mt-auto border border-rule bg-[#fafafa] h-[160px] relative flex items-center justify-center"
                style={{ contain: "paint" }}>
                <svg viewBox="0 0 320 140" className="w-[88%] h-[88%]" xmlns="http://www.w3.org/2000/svg">
                  <g fill="none" strokeWidth="1">
                    <motion.path
                      d="M0 80 Q 40 30 80 75 T 160 70 T 240 80 T 320 75"
                      stroke="#1a1a1a26"
                      variants={DATA_PATH_VARIANTS(0.25, 0.7)}
                    />
                    <motion.path
                      d="M0 95 Q 40 60 80 90 T 160 85 T 240 95 T 320 90"
                      stroke="#C8963E55"
                      variants={DATA_PATH_VARIANTS(0.25, 0.7)}
                    />
                    <motion.path
                      d="M0 65 Q 40 100 80 60 T 160 55 T 240 70 T 320 60"
                      stroke="#1a1a1a44"
                      variants={DATA_PATH_VARIANTS(0.25, 0.7)}
                    />
                  </g>
                  <motion.path
                    d="M0 80 Q 40 50 80 78 T 160 72 T 240 82 T 320 78"
                    stroke="#500000"
                    strokeWidth="1.8"
                    fill="none"
                    variants={DATA_PATH_VARIANTS(0.5, 0.6)}
                  />
                  <g fontFamily="JetBrains Mono" fontSize="8" fill="#6b6b6b" letterSpacing="2">
                    <text x="6" y="14">RAW STREAMS</text>
                  </g>
                </svg>
              </div>
            </motion.div>

            {/* D-02 */}
            <motion.div variants={DATA_CARD_VARIANTS(0.12)} className="border border-rule-strong bg-white p-6 flex flex-col">
              <div className="font-mono text-[10px] tracking-[.22em] uppercase text-maroon mb-3.5">D-02 · Model Training</div>
              <h3 className="font-heading font-semibold text-[24px] text-ink m-0 mb-3.5 tracking-[.01em] leading-[1.05]">
                Offline, dataset-driven, reproducible.
              </h3>
              <p className="text-[15px] leading-[1.55] text-ink-2 m-0 mb-6">
                Recorded drill runs form a versioned dataset; models are trained in PyTorch with deterministic seeds and
                checkpointed to a registry. Each release ships with a model card, hyperparameter manifest, and evaluation
                harness.
              </p>
              <div className="mt-auto border border-rule bg-[#fafafa] h-[160px] relative flex items-center justify-center"
                style={{ contain: "paint" }}>
                <svg viewBox="0 0 320 140" className="w-[88%] h-[88%]" xmlns="http://www.w3.org/2000/svg">
                  {/* connectors */}
                  {[
                    { d: "M70 70 L90 70", delay: 0.6 },
                    { d: "M150 70 L170 70", delay: 0.7 },
                    { d: "M230 70 L250 70", delay: 0.8 },
                  ].map((c) => (
                    <motion.path
                      key={c.d}
                      d={c.d}
                      stroke="#500000"
                      strokeWidth="1.2"
                      fill="none"
                      variants={DATA_PATH_VARIANTS(c.delay, 0.18)}
                    />
                  ))}
                  {/* boxes */}
                  {[
                    { x: 10, label: "RUN CSV", delay: 0.55, accent: false },
                    { x: 90, label: "TRAIN", delay: 0.65, accent: false },
                    { x: 170, label: "EVAL", delay: 0.75, accent: false },
                    { x: 250, label: "CKPT", delay: 0.85, accent: true },
                  ].map((b) => (
                    <motion.g
                      key={b.label}
                      variants={DATA_BOX_VARIANTS(b.delay)}
                    >
                      <rect
                        x={b.x}
                        y={50}
                        width={60}
                        height={40}
                        fill="#fff"
                        stroke={b.accent ? "#500000" : "#1a1a1a"}
                        strokeWidth={b.accent ? 1.5 : 1}
                      />
                      <text
                        x={b.x + 30}
                        y={70}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontFamily="JetBrains Mono"
                        fontSize="8"
                        letterSpacing="1.5"
                        fill={b.accent ? "#500000" : "#6b6b6b"}
                      >
                        {b.label}
                      </text>
                    </motion.g>
                  ))}
                  <text x="6" y="14" fontFamily="JetBrains Mono" fontSize="8" fill="#a07217" letterSpacing="2">
                    PIPELINE
                  </text>
                </svg>
              </div>
            </motion.div>

            {/* D-03 */}
            <motion.div variants={DATA_CARD_VARIANTS(0.18)} className="border border-rule-strong bg-white p-6 flex flex-col">
              <div className="font-mono text-[10px] tracking-[.22em] uppercase text-maroon mb-3.5">D-03 · Real-Time Inference</div>
              <h3 className="font-heading font-semibold text-[24px] text-ink m-0 mb-3.5 tracking-[.01em] leading-[1.05]">
                On-rig, low-latency, advisory.
              </h3>
              <p className="text-[15px] leading-[1.55] text-ink-2 m-0 mb-6">
                Quantized models run on a dedicated CUDA-accelerated edge module beside the controller. The inference
                pipeline is hard-budgeted: drop a frame, miss a deadline, fall through to PID-only — never block the loop.
              </p>
              <div className="mt-auto border border-rule bg-[#fafafa] h-[160px] relative flex items-center justify-center"
                style={{ contain: "paint" }}>
                <svg viewBox="0 0 320 140" className="w-[88%] h-[88%]" xmlns="http://www.w3.org/2000/svg">
                  {/* connectors */}
                  {[
                    { d: "M70 70 L90 70", delay: 1.0 },
                    { d: "M150 70 L170 70", delay: 1.1 },
                    { d: "M230 70 L250 70", delay: 1.2 },
                  ].map((c) => (
                    <motion.path
                      key={c.d}
                      d={c.d}
                      stroke="#500000"
                      strokeWidth="1.2"
                      fill="none"
                      variants={DATA_PATH_VARIANTS(c.delay, 0.18)}
                    />
                  ))}
                  {/* boxes */}
                  {[
                    { x: 10, label: "FRAME IN", delay: 0.95, accent: "none" as const },
                    { x: 90, label: "CUDA INF", delay: 1.05, accent: "amber" as const },
                    { x: 170, label: "TRIM OUT", delay: 1.15, accent: "none" as const },
                    { x: 250, label: "PID", delay: 1.25, accent: "none" as const },
                  ].map((b) => {
                    const stroke =
                      b.accent === "amber" ? "#C8963E" : "#1a1a1a";
                    const textFill =
                      b.accent === "amber" ? "#a07217" : "#6b6b6b";
                    const strokeWidth = b.accent === "amber" ? 1.5 : 1;
                    return (
                      <motion.g
                        key={b.label}
                        variants={DATA_BOX_VARIANTS(b.delay)}
                      >
                        <rect
                          x={b.x}
                          y={50}
                          width={60}
                          height={40}
                          fill="#fff"
                          stroke={stroke}
                          strokeWidth={strokeWidth}
                        />
                        <text
                          x={b.x + 30}
                          y={70}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontFamily="JetBrains Mono"
                          fontSize="8"
                          letterSpacing="1.5"
                          fill={textFill}
                        >
                          {b.label}
                        </text>
                      </motion.g>
                    );
                  })}
                  {/* budget line */}
                  <motion.path
                    d="M10 115 L310 115"
                    stroke="#1a1a1a44"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    fill="none"
                    variants={DATA_PATH_VARIANTS(1.35, 0.4)}
                  />
                  <text x="6" y="14" fontFamily="JetBrains Mono" fontSize="8" fill="#a07217" letterSpacing="2">
                    PIPELINE · IN-001
                  </text>
                  <motion.text
                    x="310"
                    y="132"
                    textAnchor="end"
                    fontFamily="JetBrains Mono"
                    fontSize="8"
                    fill="#a07217"
                    letterSpacing="2"
                    variants={DATA_FADE_VARIANTS(1.55)}
                  >
                    BUDGET · &lt; 800µs
                  </motion.text>
                </svg>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
