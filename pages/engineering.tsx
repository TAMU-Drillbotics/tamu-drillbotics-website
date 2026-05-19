import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

// 3D rig viewer — client-only (three.js + WebGL). Pulsing skeleton matches the
// viewer's dimensions so layout doesn't jump while the chunk + GLB load.
const RigViewer = dynamic(() => import("@/components/RigViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-[#0A0A0A] rounded-lg overflow-hidden border border-[#500000]/20 animate-pulse" />
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

/* ════════ § 01 — visualizer right panel ════════ */
function RigOverviewPanel() {
  const specs = [
    ["Height", "1.20 M"],
    ["Footprint", "0.60 × 0.60 M"],
    ["Weight", "85 KG"],
    ["Bit Type", "PDC · 12.5 MM"],
    ["Drive", "BLDC · DIRECT"],
    ["Sensors", "14 CH"],
    ["Controller", "STM32H7"],
    ["Est. Compl.", "Q1 / 2026"],
  ];
  return (
    <aside className="border-l border-rule-strong pl-8 flex flex-col" aria-label="Rig Overview">
      <div className="flex items-center justify-between font-mono text-[11px] tracking-[.18em] uppercase text-ink-3 pb-3.5 border-b border-rule-strong">
        <span className="text-ink font-medium">Rig Overview</span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full bg-maroon"
            style={{ animation: "pulse-dot 1.6s ease-in-out infinite" }}
          />
          In Build
        </span>
      </div>

      <div className="py-5 border-b border-rule-strong">
        <div className="font-mono text-[10px] tracking-[.22em] uppercase text-ink-3 mb-2">
          TAMU Drillbotics /
        </div>
        <div className="font-heading text-[26px] font-semibold tracking-[.02em] text-ink leading-none">
          RIG-<span className="text-maroon">02</span>
        </div>
      </div>

      <ul className="list-none m-0 p-0">
        {specs.map(([k, v]) => (
          <li
            key={k}
            className="flex items-baseline justify-between py-3 border-b border-dashed border-rule-strong font-mono text-[10.5px] tracking-[.14em] uppercase"
          >
            <span className="text-ink-3">{k}</span>
            <span className="font-heading text-[13px] font-medium tracking-[.04em] text-ink">{v}</span>
          </li>
        ))}
      </ul>

      <div className="pt-[18px] mt-auto border-t border-rule-strong">
        <div className="flex justify-between items-baseline font-mono text-[10px] tracking-[.18em] uppercase text-ink-3 mb-2.5">
          <span>Build Phase</span>
          <span className="font-heading text-[16px] text-ink font-semibold tracking-[.02em]">02 / 04</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          <span className="h-[5px] bg-ink" />
          <span className="h-[5px] bg-maroon" />
          <span className="h-[5px] bg-[#1a1a1a12]" />
          <span className="h-[5px] bg-[#1a1a1a12]" />
        </div>
      </div>
    </aside>
  );
}

/* ════════ § 03 — mech ════════ */
const mechCallouts = [
  {
    id: "M-01",
    title: "Drillstring",
    sub: "PDC bit, length-matched shaft, mud-jacketed coupling. Tuned for clean cuttings transport.",
    status: "Operational",
    statusColor: "maroon" as const,
  },
  {
    id: "M-02",
    title: "Frame",
    sub: "8020 aluminum tower, FEA-validated, with sensor mounts on every face.",
    status: "In Build",
    statusColor: "amber" as const,
  },
  {
    id: "M-03",
    title: "Safety",
    sub: "Plexiglass enclosure, dual-channel interlock, hardware E-stop upstream of drivers.",
    status: "In Review",
    statusColor: "grey" as const,
  },
];

const mechRef: { group: string; rows: [string, string][] }[] = [
  {
    group: "Structure",
    rows: [
      ["Frame", "8020 · 40 × 40"],
      ["Material", "6061-T6 AL"],
      ["Max Deflection", "0.5 MM"],
      ["Total Height", "1.20 M"],
    ],
  },
  {
    group: "Drillstring",
    rows: [
      ["Bit", "PDC · 12.5 MM"],
      ["Shaft", "SS-316 · 8 MM"],
      ["Mud Flow", "2.4 L / MIN"],
      ["WOB Range", "5 – 35 N"],
    ],
  },
  {
    group: "Safety",
    rows: [
      ["Enclosure", "PMMA · 8 MM"],
      ["Interlock", "DUAL CH"],
      ["E-Stop", "CAT-1"],
    ],
  },
];

/* ════════ § 04 — electronics ════════ */
type SensorRow = { id: string; type: string; iface: string; rate: string; purpose: string; tbd?: boolean };
const sensors: SensorRow[] = [
  { id: "PT-01", type: "Press.", iface: "I2C", rate: "200 Hz", purpose: "Mud Line" },
  { id: "TQ-01", type: "Torque", iface: "SPI", rate: "1 kHz", purpose: "Bit Reaction" },
  { id: "RPM-01", type: "Hall", iface: "GPIO", rate: "1 kHz", purpose: "Spindle" },
  { id: "DPT-01", type: "Optical", iface: "UART", rate: "500 Hz", purpose: "Feed Depth" },
  { id: "TBD", type: "—", iface: "—", rate: "—", purpose: "—", tbd: true },
  { id: "TBD", type: "—", iface: "—", rate: "—", purpose: "—", tbd: true },
  { id: "TBD", type: "—", iface: "—", rate: "—", purpose: "—", tbd: true },
  { id: "TBD", type: "—", iface: "—", rate: "—", purpose: "—", tbd: true },
  { id: "TBD", type: "—", iface: "—", rate: "—", purpose: "—", tbd: true },
  { id: "TBD", type: "—", iface: "—", rate: "—", purpose: "—", tbd: true },
];

/* ════════ § 08 — roadmap ════════ */
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
   PAGE
   ═══════════════════════════════════════════════════════ */
export default function Engineering() {
  return (
    <div
      className="flex flex-col bg-bg"
      style={{
        backgroundImage:
          "linear-gradient(to right, #1a1a1a09 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a09 1px, transparent 1px)",
        backgroundSize: "80px 80px",
        backgroundPosition: "-1px -1px",
      }}
    >
      <Nav />

      {/* ════════ § 01 — VISUALIZER ════════ */}
      <section>
        <div className="relative max-w-[1440px] mx-auto px-14 pt-12 pb-16 grid grid-cols-[minmax(0,1fr)_380px] gap-x-12">
          <Reg pos="tl" />
          <Reg pos="tr" />
          <Reg pos="bl" />
          <Reg pos="br" />

          <motion.div {...REVEAL}>
            {/* Caption */}
            <p
              className="m-0 mb-3 text-[13px] tracking-[.02em]"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                color: "rgba(224,224,224,0.6)",
              }}
            >
              
            </p>

            {/* Live 3D viewer (client-only) */}
            <RigViewer />

            {/* Interaction hints */}
          </motion.div>

          {/* Right rig overview panel */}
          <motion.div {...REVEAL}>
            <RigOverviewPanel />
          </motion.div>
        </div>
      </section>

      {/* ════════ § 03 — MECHANICAL ════════ */}
      <motion.section {...REVEAL}>
        <SectionBar num="03" label="MECHANICAL" />

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
                The rig is a precision instrument scaled down — a 1.2-metre tower built to drill repeatable holes,
                instrument every reaction, and survive autonomous operation.
              </p>
              <p className="text-[17px] leading-[1.6] text-ink-2 m-0 mb-[18px]">
                The frame is fabricated from <strong className="text-ink font-semibold">8020 aluminum extrusion</strong>,
                T-slot profiled for rapid iteration on sensor and bracket placement. FEA-driven structural analysis sets a
                target deflection under 0.5 mm at peak weight-on-bit, validated against load-cell readings during dry runs.
              </p>
              <p className="text-[17px] leading-[1.6] text-ink-2 m-0 mb-[18px]">
                The <strong className="text-ink font-semibold">drillstring</strong> couples a PDC bit through a
                length-matched shaft to a direct-drive BLDC, with a fluid jacket carrying drilling mud to clear cuttings.
                Hydraulic flow is sized for an optimal jet impact factor; weight-on-bit and rotary speed are co-controlled
                to keep the bit operating in its target torque envelope.
              </p>
              <p className="text-[17px] leading-[1.6] text-ink-2 m-0">
                Safety is structural, not bolted on. A plexiglass enclosure contains debris under failure modes,
                mechanical interlocks gate spin-up to a closed-and-latched door, and a hardware E-stop cuts power upstream
                of every motor driver.
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

          {/* wireframe placeholder strip */}
          <motion.div
            {...fadeUp(0.18)}
            className="mt-10 border border-rule-strong bg-white h-[140px] relative flex items-center justify-center overflow-hidden"
          >
            <span
              className="absolute inset-0"
              style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent 0 14px, #1a1a1a08 14px 15px)" }}
              aria-hidden="true"
            />
            <span className="absolute left-2 top-2 w-3.5 h-3.5 text-ink-4" aria-hidden="true">
              <span className="absolute left-0 right-0 top-1/2 h-px bg-current" />
              <span className="absolute top-0 bottom-0 left-1/2 w-px bg-current" />
            </span>
            <span className="absolute right-2 top-2 w-3.5 h-3.5 text-ink-4" aria-hidden="true">
              <span className="absolute left-0 right-0 top-1/2 h-px bg-current" />
              <span className="absolute top-0 bottom-0 left-1/2 w-px bg-current" />
            </span>
            <span className="absolute left-2 bottom-2 w-3.5 h-3.5 text-ink-4" aria-hidden="true">
              <span className="absolute left-0 right-0 top-1/2 h-px bg-current" />
              <span className="absolute top-0 bottom-0 left-1/2 w-px bg-current" />
            </span>
            <span className="absolute right-2 bottom-2 w-3.5 h-3.5 text-ink-4" aria-hidden="true">
              <span className="absolute left-0 right-0 top-1/2 h-px bg-current" />
              <span className="absolute top-0 bottom-0 left-1/2 w-px bg-current" />
            </span>
            <span className="relative z-[2] font-mono text-[10.5px] tracking-[.22em] uppercase text-ink-3 bg-white px-4 py-1.5 border border-rule-strong">
              <b className="text-ink font-medium">MECH-WF-01</b> &nbsp; · &nbsp; Structural wireframe · TBD
            </span>
          </motion.div>
        </div>
      </motion.section>

      {/* ════════ § 04 — ELECTRONICS ════════ */}
      <motion.section {...REVEAL}>
        <SectionBar num="04" label="ELECTRONICS" />

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
                Fourteen sensor channels feed a central electronics enclosure that converts physical reality into a 1 kHz
                stream of state estimates — and back into commanded torque.
              </p>
              <p className="text-[17px] leading-[1.6] text-ink-2 m-0 mb-[18px]">
                The <strong className="text-ink font-semibold">sensor stack</strong> spans pressure transducers on the mud
                line, strain gauges and torque sensors at the bit, hall-effect encoders for RPM, optical depth measurement
                at the feed, and a 6-axis IMU for vibration spectroscopy. Each is selected for sampling rate, noise floor,
                and bus compatibility — not just on a parts-shelf basis.
              </p>
              <p className="text-[17px] leading-[1.6] text-ink-2 m-0 mb-[18px]">
                Motor drivers sit on an isolated 48-volt rail with independent fuses per channel. Logic-level signals are
                opto-isolated before crossing into the high-current domain; every driver carries its own current sense,
                fed back to the controller for closed-loop torque.
              </p>
              <p className="text-[17px] leading-[1.6] text-ink-2 m-0">
                The central <strong className="text-ink font-semibold">electronics enclosure</strong> houses the STM32H7
                controller, CAN transceiver, sensor breakout, and power conditioning on a 4-layer custom carrier —
                designed in-house, fabricated externally, hand-assembled in the lab.
              </p>
            </motion.div>

            <motion.div {...fadeUp(0.2)}>
              <table className="w-full border-separate border-spacing-0 border border-rule-strong bg-white font-mono">
                <thead>
                  <tr>
                    {["Sensor", "Type", "I/F", "Rate", "Purpose"].map((h) => (
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
                    <tr key={i} className={s.tbd ? "" : ""}>
                      <td
                        className={`px-3.5 py-[11px] border-b border-dashed border-rule-strong last:border-b-0 ${
                          s.tbd
                            ? "font-heading text-[13px] font-medium text-ink-3 tracking-[.22em] uppercase"
                            : "font-heading text-[13px] font-medium text-ink tracking-[.04em] uppercase"
                        }`}
                      >
                        {s.id}
                      </td>
                      <td className={`px-3.5 py-[11px] text-[11px] tracking-[.08em] uppercase border-b border-dashed border-rule-strong last:border-b-0 ${s.tbd ? "text-ink-4" : "text-ink-2"}`}>
                        {s.type}
                      </td>
                      <td className={`px-3.5 py-[11px] text-[11px] tracking-[.08em] uppercase border-b border-dashed border-rule-strong last:border-b-0 ${s.tbd ? "text-ink-4" : "text-ink-2"}`}>
                        {s.iface}
                      </td>
                      <td className={`px-3.5 py-[11px] text-[11px] tracking-[.08em] uppercase border-b border-dashed border-rule-strong last:border-b-0 ${s.tbd ? "text-ink-4" : "text-ink-2"}`}>
                        {s.rate}
                      </td>
                      <td className={`px-3.5 py-[11px] text-[11px] tracking-[.08em] uppercase border-b border-dashed border-rule-strong last:border-b-0 ${s.tbd ? "text-ink-4" : "text-ink-2"}`}>
                        {s.purpose}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ════════ § 05 — SOFTWARE ════════ */}
      <motion.section {...REVEAL}>
        <SectionBar num="05" label="SOFTWARE" />

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
                A real-time control loop closes around every revolution of the bit — embedded C on bare-metal STM32,
                deterministic to the microsecond.
              </p>
              <p className="text-[17px] leading-[1.6] text-ink-2 m-0 mb-[18px]">
                The firmware layer is built on FreeRTOS with priority-pinned tasks for sensor acquisition, control
                compute, and CAN dispatch. <strong className="text-ink font-semibold">PID controllers</strong> regulate
                three coupled axes: drill RPM, feed rate, and weight-on-bit — with cross-axis decoupling tuned during dry
                runs.
              </p>
              <p className="text-[17px] leading-[1.6] text-ink-2 m-0 mb-[18px]">
                An <strong className="text-ink font-semibold">ML interfacing layer</strong> pipes a downsampled sensor
                frame over high-speed serial to a co-processor running inference, then receives gain-trim and setpoint
                deltas back. The model never has direct authority — control authority always sits with the deterministic
                PID core, with the ML layer recommending, not commanding.
              </p>
              <p className="text-[17px] leading-[1.6] text-ink-2 m-0">
                Telemetry is broadcast over CAN to a host laptop running a Python dashboard; logs are written to a
                removable SD card at 1 kHz for offline analysis and model training.
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

      {/* ════════ § 06 — DATA ════════ */}
      <motion.section {...REVEAL}>
        <SectionBar num="06" label="DATA" />

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

      {/* ════════ § 08 — ROADMAP ════════ */}
      <motion.section {...REVEAL}>
        <SectionBar num="08" label="ROADMAP" />

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

      {/* ════════ § 09 — CTA ════════ */}
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
        <SectionBar num="09" label="NEXT STEPS" dark />

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
