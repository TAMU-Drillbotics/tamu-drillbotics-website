import Link from "next/link";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { TimelineOrchestrator, useTimelineBeat } from "@/components/TimelineOrchestrator";
import { ENGINEERING_HERO_TIMELINE } from "@/lib/engineeringHeroTimeline";

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
    <span className={`absolute w-3.5 h-3.5 ${place}`} aria-hidden="true">
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
    <div className="max-w-[1440px] mx-auto px-14">
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
      className="font-heading font-semibold text-[72px] leading-[.94] tracking-[-.02em] m-0 text-ink"
    >
      {children}
    </motion.h2>
  );
}

/* ════════ § 01 — mech ════════ */
const mechCallouts: {
  id: string;
  title: string;
  sub: string;
  status: string;
  statusColor: "maroon" | "amber" | "grey";
}[] = [
  {
    id: "M-01",
    title: "Drillstring",
    sub: "Hydraulic push-the-bit RSS — three steering wings on a 17-7 PH drive shaft inside a flexible nylon drill pipe.",
    status: "In Build",
    statusColor: "amber" as const,
  },
  {
    id: "M-02",
    title: "Frame",
    sub: "6061-T6 aluminum T-slot tower, three stacked platforms, dual lead-screw vertical actuation near 700 lb.",
    status: "In Build",
    statusColor: "amber" as const,
  },
  {
    id: "M-03",
    title: "Safety",
    sub: "Polycarbonate enclosure, door interlocks, hardware + software E-stop, pressure seals designed to fail first.",
    status: "In Review",
    statusColor: "grey" as const,
  },
];

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
    group: "Drivetrain",
    rows: [
      ["Rotary Drive", "MAXON EC-i 40"],
      ["Max Speed", "2500 RPM"],
      ["Hoist", "2× NEMA-23"],
      ["Coolant Pump", "SEAFLO 12 V"],
    ],
  },
  {
    group: "Drillstring",
    rows: [
      ["Steering", "3-WING RSS"],
      ["Drive Shaft", "17-7 PH SS"],
      ["Drill Pipe", "FLEXIBLE NYLON"],
      ["Hyd. Pressure", "≈ 2000 PSI"],
      ["Bit", "TBD"],
    ],
  },
  {
    group: "Safety",
    rows: [
      ["Enclosure", "POLYCARBONATE"],
      ["E-Stop", "HW + SW"],
      ["Seal Rating", "5000 PSI"],
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

/* ════════ § 06 — roadmap ════════ */
type Phase = { num: string; name: string; date: string; status: string; kind: "done" | "active" | "next" | "planned" };
const phases: Phase[] = [
  { num: "01", name: "Structural Assembly", date: "Sep · 2025", status: "Complete", kind: "done" },
  { num: "02", name: "Hoist / Elevator", date: "Oct · 2025", status: "Complete", kind: "done" },
  { num: "03", name: "Drivetrain Bring-up", date: "Nov · 2025 – Jan · 2026", status: "In Progress", kind: "active" },
  { num: "04", name: "Sensor Array Install", date: "Feb · 2026", status: "Next", kind: "next" },
  { num: "05", name: "Control S/W Integration", date: "Mar · 2026", status: "Planned", kind: "planned" },
  { num: "06", name: "ML Pipeline Deploy", date: "Apr · 2026", status: "Planned", kind: "planned" },
  { num: "07", name: "Autonomous Testing", date: "May · 2026", status: "Planned", kind: "planned" },
  { num: "08", name: "Competition Readiness", date: "Jun · 2026", status: "Planned", kind: "planned" },
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

  return (
    <section ref={wrapperRef} className="relative" style={{ height: "150dvh" }}>
      <div className="sticky top-[var(--nav-height)] h-[calc(100dvh-var(--nav-height))] max-w-[1440px] mx-auto px-14 pb-6">
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
            <h1 className="font-heading font-bold text-[148px] leading-[.86] tracking-[-.025em] uppercase m-0 text-ink">
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

        <div className="relative max-w-[1440px] mx-auto px-14 pt-20 pb-24">
          <Reg pos="tl" />
          <Reg pos="tr" />
          <Reg pos="bl" />
          <Reg pos="br" />

          <SecEyebrow>Mechanical Engineering</SecEyebrow>
          <SecTitle>
            Materials, design, physics<span className="text-maroon">.</span>
          </SecTitle>

          <div className="grid grid-cols-[1.15fr_1fr] gap-x-16 items-start pt-12">
            <motion.div {...fadeUp(0.1)}>
              <p className="text-[19px] leading-[1.55] text-ink font-medium m-0 mb-6">
                The rig is a model-scale autonomous drilling system — a vertical aluminum tower built to drill into an
                unknown rock block, then steer the bit through three target points with no human intervention.
              </p>
              <p className="text-[17px] leading-[1.6] text-ink-2 m-0 mb-[18px]">
                The frame is a modular tower of <strong className="text-ink font-semibold">6061-T6 aluminum 2-by-2-inch
                T-slot extrusion</strong>, joined with aluminum corner brackets and thread-locked fasteners. Three stacked
                platforms separate the subsystems — a top actuation deck, a mid-frame elevator carrying the bottom-hole
                assembly, and a bottom platform for fluid handling — and the T-slot profile lets sensor and bracket
                placement be reconfigured throughout the build.
              </p>
              <p className="text-[17px] leading-[1.6] text-ink-2 m-0 mb-[18px]">
                Vertical motion comes from two <strong className="text-ink font-semibold">NEMA-23 stepper motors</strong>
                driving lead screws; sharing the load gives a lift capacity near 700 lb and sets weight-on-bit through the
                elevator platform. A top-mounted Maxon EC-i 40 brushless DC motor spins the string at up to 2500 RPM. The
                drillstring runs a 17-7 PH stainless drive shaft inside a flexible, non-rotating nylon pipe that doubles as
                the drilling-fluid conduit.
              </p>
              <p className="text-[17px] leading-[1.6] text-ink-2 m-0">
                Steering uses a hydraulically actuated <strong className="text-ink font-semibold">push-the-bit rotary
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

          {/* callouts strip */}
          <motion.div {...fadeUp(0.1)} className="mt-14 grid grid-cols-3 border border-rule-strong bg-white">
            {mechCallouts.map((c, i) => (
              <div
                key={c.id}
                className={`p-6 pb-[22px] relative ${i < mechCallouts.length - 1 ? "border-r border-rule-strong" : ""}`}
              >
                <div className="flex items-center justify-between mb-3.5 font-mono text-[10px] tracking-[.22em] uppercase text-ink-3">
                  <span className="text-maroon">{c.id}</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        c.statusColor === "maroon"
                          ? "bg-maroon"
                          : c.statusColor === "amber"
                          ? "bg-amber"
                          : "bg-ink-4"
                      }`}
                    />
                    {c.status}
                  </span>
                </div>
                <h3 className="font-heading font-semibold text-[22px] text-ink tracking-[.01em] m-0 mb-2">
                  {c.title}
                </h3>
                <p className="text-[14px] leading-[1.5] text-ink-2 m-0">{c.sub}</p>
              </div>
            ))}
          </motion.div>

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

        <div className="relative max-w-[1440px] mx-auto px-14 pt-20 pb-24">
          <Reg pos="tl" />
          <Reg pos="tr" />
          <Reg pos="bl" />
          <Reg pos="br" />

          <SecEyebrow>Rotary Steerable System</SecEyebrow>
          <SecTitle>
            Three wings, one trajectory<span className="text-maroon">.</span>
          </SecTitle>

          <div className="grid grid-cols-[1fr_1.2fr] gap-x-16 items-start pt-12">
            <motion.div {...fadeUp(0.1)}>
              <p className="text-[19px] leading-[1.55] text-ink font-medium m-0 mb-6">
                Steering is where the rig earns its name. Once the bit enters the rock, a rotary steerable system bends
                the well toward three target points — no tripping the string, no human hand on the controls.
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
                <div className="px-[18px] py-3 border-t border-rule-strong flex items-center justify-between font-mono text-[10px] tracking-[.18em] uppercase text-ink-4">
                  <span>Push-the-Bit RSS</span>
                  <span className="text-ink-2">BHA · Section</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ════════ § 03 — ELECTRONICS ════════ */}
      <motion.section {...REVEAL}>
        <SectionBar num="03" label="ELECTRONICS" />

        <div className="relative max-w-[1440px] mx-auto px-14 pt-20 pb-24">
          <Reg pos="tl" />
          <Reg pos="tr" />
          <Reg pos="bl" />
          <Reg pos="br" />

          <SecEyebrow>Electronics Stack</SecEyebrow>
          <SecTitle>
            From signal to actuator<span className="text-maroon">.</span>
          </SecTitle>

          <div className="grid grid-cols-[1.15fr_1fr] gap-x-16 items-start pt-12">
            <motion.div {...fadeUp(0.1)}>
              <p className="text-[19px] leading-[1.55] text-ink font-medium m-0 mb-6">
                Seven sensor channels turn the rig&apos;s physical behavior into a measured state — orientation, depth,
                torque, speed, weight-on-bit, temperature, and vibration — feeding the drives that steer and advance the
                bit.
              </p>
              <p className="text-[17px] leading-[1.6] text-ink-2 m-0 mb-[18px]">
                The <strong className="text-ink font-semibold">sensor stack</strong> centers on a 9-axis ICM-20948 IMU in
                the bottom-hole assembly, an LPPS-36B linear sensor for true vertical depth, a FUTEK TFF400 inline torque
                sensor and US Digital E6 encoder at the drill motor, and a FUTEK LSB200 load cell reading weight-on-bit
                between the hoist and the string. A DS18B20 tracks temperature and an ADXL356 MEMS accelerometer catches
                high-g shock and vibration.
              </p>
              <p className="text-[17px] leading-[1.6] text-ink-2 m-0 mb-[18px]">
                Actuation electronics close the loop around each motor. A <strong className="text-ink font-semibold">Maxon
                EPOS4 Compact</strong> drive runs the rotary BLDC over EtherCAT, while Leadshine iCS-RS closed-loop drives
                handle the hoist steppers. Hydraulic steering valves are positioned by a 16-bit ADC/DAC stage for
                proportional solenoid current, with every solenoid channel opto-isolated from the logic side.
              </p>
              <p className="text-[17px] leading-[1.6] text-ink-2 m-0">
                A <strong className="text-ink font-semibold">Raspberry Pi 4</strong> handles supervisory logging, UI, and
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

        <div className="relative max-w-[1440px] mx-auto px-14 pt-20 pb-24">
          <Reg pos="tl" />
          <Reg pos="tr" />
          <Reg pos="bl" />
          <Reg pos="br" />

          <SecEyebrow>Software Stack &amp; Control Loop</SecEyebrow>
          <SecTitle>
            Code that controls steel<span className="text-maroon">.</span>
          </SecTitle>

          <div className="grid grid-cols-[1fr_1.2fr] gap-x-16 items-start pt-12">
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
                <div className="px-[18px] py-3.5 border-b border-rule flex items-center justify-between font-mono text-[10.5px] tracking-[.18em] uppercase text-ink-3">
                  <span className="text-ink">CTRL-LOOP · CL-001</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-maroon"
                      style={{ animation: "pulse-dot 1.6s ease-in-out infinite" }}
                    />
                    Active · 1 kHz
                  </span>
                </div>

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
                    <pattern id="loop-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M40 0H0V40" fill="none" stroke="#1a1a1a09" strokeWidth="1" />
                    </pattern>
                  </defs>

                  <rect width="640" height="420" fill="url(#loop-grid)" />

                  <text x="320" y="200" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#6b6b6b" letterSpacing="3">
                    CONTROL · LOOP
                  </text>
                  <text x="320" y="220" textAnchor="middle" fontFamily="Chakra Petch" fontSize="20" fontWeight="600" fill="#1A1A1A">
                    1 kHz
                  </text>
                  <text x="320" y="240" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#a5a5a5" letterSpacing="3">
                    CLOSED · DETERMINISTIC
                  </text>

                  {/* nodes */}
                  {[
                    { x: 50, y: 40, stage: "01", title: "SENSORS", sub: "14 CH · ACQ", maroonBorder: false, amber: false },
                    { x: 240, y: 20, stage: "02", title: "CONDITION", sub: "FILTER · SCALE", maroonBorder: false, amber: false },
                    { x: 430, y: 40, stage: "03", title: "PID CORE", sub: "3-AXIS · COUPLED", maroonBorder: false, amber: false },
                    { x: 430, y: 320, stage: "04", title: "ML INFER", sub: "ADVISORY · TRIM", maroonBorder: false, amber: true },
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
                      style={{ animation: "flow-dash 1.4s linear infinite" }}
                    />
                  ))}

                  {/* ML advisory arc */}
                  <path
                    d="M430,340 C 380,280 380,180 430,100"
                    fill="none"
                    stroke="#C8963E"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                    markerEnd="url(#loop-arrow)"
                  />
                  <text x="350" y="220" fontFamily="JetBrains Mono" fontSize="9" fill="#a07217" letterSpacing="2">
                    ADVISORY
                  </text>

                  <text x="20" y="412" fontFamily="JetBrains Mono" fontSize="9" fill="#a5a5a5" letterSpacing="2">
                    DWG · CL-001
                  </text>
                  <text x="540" y="412" fontFamily="JetBrains Mono" fontSize="9" fill="#a5a5a5" letterSpacing="2">
                    REV A
                  </text>
                </svg>

                <div className="grid grid-cols-4 border-t border-rule">
                  {[
                    { k: "Sampling", v: "10", u: "kHz" },
                    { k: "Control", v: "1", u: "kHz" },
                    { k: "Latency", v: "< 800", u: "µs" },
                    { k: "Jitter", v: "12", u: "µs" },
                  ].map((s, i, arr) => (
                    <div
                      key={s.k}
                      className={`px-4 py-3.5 font-mono ${i < arr.length - 1 ? "border-r border-dashed border-rule-strong" : ""}`}
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

        <div className="relative max-w-[1440px] mx-auto px-14 pt-20 pb-24">
          <Reg pos="tl" />
          <Reg pos="tr" />
          <Reg pos="bl" />
          <Reg pos="br" />

          <SecEyebrow>Data &amp; Machine Learning</SecEyebrow>
          <SecTitle>
            Sensor fusion meets machine learning<span className="text-maroon">.</span>
          </SecTitle>

          <div className="grid grid-cols-3 gap-x-8 pt-12">
            {/* D-01 */}
            <motion.div {...fadeUp(0.1)} className="border border-rule-strong bg-white p-6 flex flex-col">
              <div className="font-mono text-[10px] tracking-[.22em] uppercase text-maroon mb-3.5">D-01 · Sensor Fusion</div>
              <h3 className="font-heading font-semibold text-[24px] text-ink m-0 mb-3.5 tracking-[.01em] leading-[1.05]">
                Unified state from messy reality.
              </h3>
              <p className="text-[15px] leading-[1.55] text-ink-2 m-0 mb-6">
                A Kalman-style estimator combines pressure, torque, RPM, depth, and IMU streams into a single bit-state
                vector — denoised, time-aligned, and physically-constrained. The fused estimate, not raw sensors, is what
                the controller and ML layer see.
              </p>
              <div className="mt-auto border border-rule bg-[#fafafa] h-[160px] relative flex items-center justify-center">
                <svg viewBox="0 0 320 140" className="w-[88%] h-[88%]" xmlns="http://www.w3.org/2000/svg">
                  <g stroke="#1a1a1a26" fill="none" strokeWidth="1">
                    <path d="M0 80 Q 40 30 80 75 T 160 70 T 240 80 T 320 75" />
                    <path d="M0 95 Q 40 60 80 90 T 160 85 T 240 95 T 320 90" stroke="#C8963E55" />
                    <path d="M0 65 Q 40 100 80 60 T 160 55 T 240 70 T 320 60" stroke="#1a1a1a44" />
                  </g>
                  <path d="M0 80 Q 40 50 80 78 T 160 72 T 240 82 T 320 78" stroke="#500000" strokeWidth="1.8" fill="none" />
                  <g fontFamily="JetBrains Mono" fontSize="8" fill="#6b6b6b" letterSpacing="2">
                    <text x="6" y="14">RAW · STREAMS</text>
                    <text x="220" y="130">FUSED · ESTIMATE</text>
                  </g>
                </svg>
              </div>
            </motion.div>

            {/* D-02 */}
            <motion.div {...fadeUp(0.18)} className="border border-rule-strong bg-white p-6 flex flex-col">
              <div className="font-mono text-[10px] tracking-[.22em] uppercase text-maroon mb-3.5">D-02 · Model Training</div>
              <h3 className="font-heading font-semibold text-[24px] text-ink m-0 mb-3.5 tracking-[.01em] leading-[1.05]">
                Offline, dataset-driven, reproducible.
              </h3>
              <p className="text-[15px] leading-[1.55] text-ink-2 m-0 mb-6">
                Recorded drill runs form a versioned dataset; models are trained in PyTorch with deterministic seeds and
                checkpointed to a registry. Each release ships with a model card, hyperparameter manifest, and evaluation
                harness.
              </p>
              <div className="mt-auto border border-rule bg-[#fafafa] h-[160px] relative flex items-center justify-center">
                <svg viewBox="0 0 320 140" className="w-[88%] h-[88%]" xmlns="http://www.w3.org/2000/svg">
                  <g fontFamily="JetBrains Mono" fontSize="7" fill="#6b6b6b" letterSpacing="2">
                    <rect x="14" y="50" width="56" height="40" fill="#fff" stroke="#1a1a1a" strokeWidth="1" />
                    <text x="20" y="74">RUNS · CSV</text>
                    <rect x="100" y="50" width="56" height="40" fill="#fff" stroke="#1a1a1a" strokeWidth="1" />
                    <text x="108" y="74">TRAIN · PT</text>
                    <rect x="186" y="50" width="56" height="40" fill="#fff" stroke="#1a1a1a" strokeWidth="1" />
                    <text x="192" y="74">EVAL · CV</text>
                    <rect x="252" y="50" width="56" height="40" fill="#fff" stroke="#500000" strokeWidth="1.5" />
                    <text x="258" y="74" fill="#500000">CKPT</text>
                  </g>
                  <g stroke="#500000" strokeWidth="1.2" fill="none">
                    <path d="M70 70 L100 70" />
                    <path d="M156 70 L186 70" />
                    <path d="M242 70 L252 70" />
                  </g>
                  <g fontFamily="JetBrains Mono" fontSize="8" fill="#a07217" letterSpacing="2">
                    <text x="6" y="14">PIPELINE · TR-001</text>
                    <text x="240" y="130">REGISTRY</text>
                  </g>
                </svg>
              </div>
            </motion.div>

            {/* D-03 */}
            <motion.div {...fadeUp(0.26)} className="border border-rule-strong bg-white p-6 flex flex-col">
              <div className="font-mono text-[10px] tracking-[.22em] uppercase text-maroon mb-3.5">D-03 · Real-Time Inference</div>
              <h3 className="font-heading font-semibold text-[24px] text-ink m-0 mb-3.5 tracking-[.01em] leading-[1.05]">
                On-rig, low-latency, advisory.
              </h3>
              <p className="text-[15px] leading-[1.55] text-ink-2 m-0 mb-6">
                Quantized models run on a dedicated CUDA-accelerated edge module beside the controller. The inference
                pipeline is hard-budgeted: drop a frame, miss a deadline, fall through to PID-only — never block the loop.
              </p>
              <div className="mt-auto border border-rule bg-[#fafafa] h-[160px] relative flex items-center justify-center">
                <svg viewBox="0 0 320 140" className="w-[88%] h-[88%]" xmlns="http://www.w3.org/2000/svg">
                  <g fontFamily="JetBrains Mono" fontSize="7" fill="#6b6b6b" letterSpacing="2">
                    <rect x="14" y="50" width="56" height="40" fill="#fff" stroke="#1a1a1a" strokeWidth="1" />
                    <text x="20" y="74">FRAME · IN</text>
                    <rect x="100" y="50" width="56" height="40" fill="#fff" stroke="#C8963E" strokeWidth="1.5" />
                    <text x="108" y="74" fill="#a07217">CUDA · INF</text>
                    <rect x="186" y="50" width="56" height="40" fill="#fff" stroke="#1a1a1a" strokeWidth="1" />
                    <text x="194" y="74">TRIM · OUT</text>
                    <rect x="252" y="50" width="56" height="40" fill="#fff" stroke="#1a1a1a" strokeWidth="1" />
                    <text x="262" y="74">PID</text>
                  </g>
                  <g stroke="#500000" strokeWidth="1.2" fill="none">
                    <path d="M70 70 L100 70" />
                    <path d="M156 70 L186 70" />
                    <path d="M242 70 L252 70" />
                  </g>
                  <path d="M70 110 L308 110" stroke="#1a1a1a44" strokeWidth="1" strokeDasharray="3 3" fill="none" />
                  <g fontFamily="JetBrains Mono" fontSize="8" fill="#a07217" letterSpacing="2">
                    <text x="6" y="14">PIPELINE · IN-001</text>
                    <text x="200" y="130">BUDGET · &lt; 800µs</text>
                  </g>
                </svg>
              </div>
            </motion.div>
          </div>

          {/* metrics strip */}
          <motion.div {...fadeUp(0.18)} className="mt-10 border border-rule-strong bg-white grid grid-cols-5">
            {[
              { k: "Model Accuracy", v: "94.2", u: "%" },
              { k: "Inference Latency", v: "612", u: "µs" },
              { k: "Throughput", v: "1.4", u: "TF" },
              { k: "Dataset Hours", v: "218", u: "hr" },
              { k: "Param Count", v: "2.1", u: "M" },
            ].map((m, i, arr) => (
              <div
                key={m.k}
                className={`px-5 py-[18px] font-mono ${i < arr.length - 1 ? "border-r border-dashed border-rule-strong" : ""}`}
              >
                <span className="block text-[9.5px] tracking-[.22em] uppercase text-ink-3 mb-2">{m.k}</span>
                <span className="font-heading text-[26px] font-semibold text-ink tracking-[.01em]">
                  {m.v}
                  <span className="font-mono text-[11px] text-ink-3 ml-1 tracking-[.14em]">{m.u}</span>
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ════════ § 06 — ROADMAP ════════ */}
      <motion.section {...REVEAL}>
        <SectionBar num="06" label="ROADMAP" />

        <div className="relative max-w-[1440px] mx-auto px-14 pt-20 pb-24">
          <Reg pos="tl" />
          <Reg pos="tr" />
          <Reg pos="bl" />
          <Reg pos="br" />

          <SecEyebrow>2025–26 Build Cycle</SecEyebrow>
          <SecTitle>
            What&rsquo;s next<span className="text-maroon">.</span>
          </SecTitle>

          <div className="pt-12">
            <motion.div
              {...fadeUp(0.1)}
              className="flex items-center justify-between pb-[18px] border-b border-rule-strong mb-8 font-mono text-[10.5px] tracking-[.18em] uppercase text-ink-3"
            >
              <span className="font-heading text-[28px] text-ink font-semibold tracking-[.02em]">
                <span className="text-maroon">34</span> %
              </span>
              <span className="flex-1 mx-8 h-1 bg-[#1a1a1a12] relative">
                <motion.i
                  className="absolute left-0 top-0 bottom-0 bg-maroon origin-left block"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  style={{ width: "34%" }}
                />
                <span className="absolute -top-1.5 w-0.5 h-4 bg-ink" style={{ left: "34%" }}>
                  <span className="absolute -left-[3px] -top-[3px] w-2 h-2 border border-ink bg-white" />
                </span>
              </span>
              <span>Cycle Completion · Wk 14 / 32</span>
            </motion.div>

            <motion.div {...fadeUp(0.18)} className="grid grid-cols-8 border border-rule-strong bg-white">
              {phases.map((p, i) => {
                const numColor =
                  p.kind === "done"
                    ? "text-ink"
                    : p.kind === "active"
                    ? "text-amber"
                    : p.kind === "next"
                    ? "text-ink-2"
                    : "text-ink-4";
                const statusColor =
                  p.kind === "done"
                    ? "text-maroon"
                    : p.kind === "active"
                    ? "text-[#a07217]"
                    : p.kind === "next"
                    ? "text-ink-2"
                    : "text-ink-3";
                const dotColor =
                  p.kind === "done"
                    ? "bg-maroon"
                    : p.kind === "active"
                    ? "bg-amber"
                    : p.kind === "next"
                    ? "bg-ink-2"
                    : "bg-ink-4";
                const isActive = p.kind === "active";
                return (
                  <div
                    key={p.num}
                    className={`px-[18px] py-[22px] pb-5 relative flex flex-col min-h-[200px] ${
                      i < phases.length - 1 ? "border-r border-rule-strong" : ""
                    } ${isActive ? "bg-[#fff7ee] border-t-2 border-t-amber -mt-[2px]" : ""}`}
                  >
                    {/* tiny vertical tick above each phase */}
                    <span
                      className={`absolute left-1/2 top-0 w-px h-3 -translate-x-1/2 -translate-y-1/2 ${
                        p.kind === "done" ? "bg-maroon" : p.kind === "active" ? "bg-amber" : "bg-ink-4"
                      }`}
                      aria-hidden="true"
                    />
                    <div className={`font-heading text-[36px] font-semibold leading-none tracking-[.01em] mb-3.5 ${numColor}`}>
                      {p.num}
                    </div>
                    <h4 className={`font-heading text-[13px] font-medium leading-[1.2] m-0 mb-3 tracking-[.04em] uppercase ${isActive ? "text-ink" : "text-ink"}`}>
                      {p.name}
                    </h4>
                    <div className="font-mono text-[10px] tracking-[.18em] uppercase text-ink-3 mb-auto">{p.date}</div>
                    <div className={`mt-[18px] inline-flex items-center gap-2 font-mono text-[9.5px] tracking-[.22em] uppercase ${statusColor}`}>
                      <span className={`w-2 h-2 ${dotColor}`} />
                      {p.status}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ════════ § 07 — CTA ════════ */}
      <motion.section
        {...REVEAL}
        className="bg-[#1A1A1A] text-[#FAFAFA] border-t border-rule-strong"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff0a 1px, transparent 1px), linear-gradient(to bottom, #ffffff0a 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          backgroundPosition: "-1px -1px",
        }}
      >
        <SectionBar num="07" label="NEXT STEPS" dark />

        <div className="relative max-w-[1440px] mx-auto px-14 py-[88px] grid grid-cols-[1.2fr_1fr] gap-x-16">
          <Reg pos="tl" light />
          <Reg pos="tr" light />
          <Reg pos="bl" light />
          <Reg pos="br" light />

          <div>
            <motion.div
              {...fadeUp(0)}
              className="inline-flex items-center gap-3 font-mono text-[11px] tracking-[.18em] uppercase text-[#ffffffc4] mb-6"
            >
              <span className="w-[7px] h-[7px] rounded-full bg-amber" style={{ boxShadow: "0 0 0 3px #C8963E30" }} />
              <span>You&rsquo;ve seen the spec sheet</span>
            </motion.div>
            <motion.h2
              {...fadeUp(0.1)}
              className="font-heading font-semibold text-[88px] leading-[.92] tracking-[-.025em] m-0 text-[#FAFAFA]"
            >
              Now build it<br />with us<span className="text-amber">.</span>
            </motion.h2>
            <motion.p
              {...fadeUp(0.2)}
              className="mt-6 max-w-[480px] text-[17px] leading-[1.55] text-[#ffffffd0]"
            >
              If the depth here resonates, there are two ways to move from spectator to participant. Pick the one that
              fits.
            </motion.p>
          </div>

          <motion.div {...fadeUp(0.15)} className="grid grid-cols-1 gap-3.5 self-start mt-12">
            {/* Card 01 — maroon (no hover-darken) */}
            <Link
              href="/apply#apply-form"
              className="p-8 pb-7 flex flex-col text-[#FAFAFA] no-underline min-h-[230px] bg-maroon group"
            >
              <div className="flex items-center justify-between font-mono text-[10.5px] tracking-[.18em] uppercase text-[#ffffff8a] mb-6">
                <span className="font-heading text-sm text-[#FAFAFA] tracking-[.04em] font-medium">01</span>
                <span>The Team</span>
              </div>
              <h3 className="font-heading font-semibold text-[30px] leading-[1.02] tracking-[-.012em] m-0 mb-2.5 text-[#FAFAFA]">
                Want to build this<span className="text-amber">?</span>
              </h3>
              <p className="text-[14.5px] leading-[1.5] text-[#ffffffbf] m-0 mb-6 max-w-[380px]">
                Open roles across mechanical, electrical, software, and ML. Find where you fit.
              </p>
              <span className="oct-clip mt-auto self-start font-heading text-[12.5px] tracking-[.16em] uppercase font-semibold px-[18px] py-3 bg-[#FAFAFA] text-maroon border border-[#FAFAFA] inline-flex items-center gap-3.5 transition-all duration-150 group-hover:bg-amber group-hover:border-amber group-hover:text-ink">
                Apply Now
                <span className="inline-block w-[22px] h-px bg-current relative">
                  <span className="absolute right-0 -top-[3px] w-[7px] h-[7px] border-t border-r border-current rotate-45" />
                </span>
              </span>
            </Link>

            {/* Card 02 — dark (no hover-darken) */}
            <Link
              href="/sponsors"
              className="p-8 pb-7 flex flex-col text-[#FAFAFA] no-underline min-h-[230px] bg-[#0d0d0d] border border-[#ffffff1f] group"
            >
              <div className="flex items-center justify-between font-mono text-[10.5px] tracking-[.18em] uppercase text-[#ffffff8a] mb-6">
                <span className="font-heading text-sm text-[#FAFAFA] tracking-[.04em] font-medium">02</span>
                <span>The Partners</span>
              </div>
              <h3 className="font-heading font-semibold text-[30px] leading-[1.02] tracking-[-.012em] m-0 mb-2.5 text-[#FAFAFA]">
                Support the work<span className="text-amber">.</span>
              </h3>
              <p className="text-[14.5px] leading-[1.5] text-[#ffffffbf] m-0 mb-6 max-w-[380px]">
                Sponsor a year of engineering, R&amp;D, and student development.
              </p>
              <span className="oct-outline-light mt-auto self-start font-heading text-[12.5px] tracking-[.16em] uppercase font-semibold px-[18px] py-3 text-[#FAFAFA] inline-flex items-center gap-3.5 transition-all duration-150 group-hover:text-ink">
                Become a Sponsor
                <span className="inline-block w-[22px] h-px bg-current relative">
                  <span className="absolute right-0 -top-[3px] w-[7px] h-[7px] border-t border-r border-current rotate-45" />
                </span>
              </span>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
