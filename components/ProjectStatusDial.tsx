import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTimelineBeat } from "@/components/TimelineOrchestrator";

type Status =
  | "OPERATIONAL"
  | "IN BUILD"
  | "IN DESIGN"
  | "PROTOTYPING"
  | "RESEARCH";

type Subsystem = {
  name: string;
  progress: number;
  status: Status;
};

type BuildStatus = {
  phase: number;
  totalPhases: number;
  percentComplete: number;
};

const buildStatus: BuildStatus = {
  phase: 2,
  totalPhases: 4,
  percentComplete: 31,
};

const subsystems: Subsystem[] = [
  { name: "Hoist / Elevator", progress: 100, status: "OPERATIONAL" },
  { name: "Drivetrain",       progress: 35,  status: "IN BUILD" },
  { name: "Sensor Array",     progress: 20,  status: "IN DESIGN" },
  { name: "Control S/W",      progress: 25,  status: "PROTOTYPING" },
  { name: "Autonomy / ML",    progress: 10,  status: "RESEARCH" },
];

const RING_LENGTH = 465;
const pad2 = (n: number) => String(n).padStart(2, "0");

const statusColor = (s: Status): string => {
  if (s === "OPERATIONAL") return "#1A1A1A";
  if (s === "IN BUILD") return "#500000";
  return "#888";
};

// Count-up flip — increments from 0 to `target`, one tick every `tickMs`.
function usePhaseFlip(target: number, active: boolean, reducedMotion: boolean, tickMs = 90) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (reducedMotion) {
      setValue(target);
      return;
    }
    setValue(0);
    let v = 0;
    const id = setInterval(() => {
      v++;
      setValue(v);
      if (v >= target) clearInterval(id);
    }, tickMs);
    return () => clearInterval(id);
  }, [active, target, reducedMotion, tickMs]);
  return value;
}

export default function ProjectStatusDial() {
  const ring = useTimelineBeat("statusCircleFill");
  const flip = useTimelineBeat("statusNumberFlip");
  const phaseBar = useTimelineBeat("buildPhaseBar");
  const cascade = useTimelineBeat("subsystemCascade");

  const dashoffset = RING_LENGTH * (1 - buildStatus.percentComplete / 100);
  const phaseValue = usePhaseFlip(buildStatus.phase, flip.hasFired, flip.reducedMotion);
  const phaseStr = pad2(phaseValue);
  const totalStr = pad2(buildStatus.totalPhases);

  const phaseLabels = [
    { num: 1, label: "01", x: 90, y: -2 },
    { num: 2, label: "02", x: 182, y: 90 },
    { num: 3, label: "03", x: 90, y: 182 },
    { num: 4, label: "04", x: -2, y: 90 },
  ];

  return (
    <aside className="flex flex-col py-6 pl-8" aria-label="Project status">
      {/* Radial dial */}
      <div className="mb-4 flex justify-center">
        <svg width={216} height={216} viewBox="-12 -12 204 204" aria-hidden="true">
          {/* Track ring */}
          <circle cx={90} cy={90} r={74} fill="none" stroke="#E8E8E8" strokeWidth={6} />

          {/* Progress ring */}
          <motion.circle
            cx={90}
            cy={90}
            r={74}
            fill="none"
            stroke="#500000"
            strokeWidth={6}
            strokeDasharray={RING_LENGTH}
            strokeLinecap="butt"
            transform="rotate(-90 90 90)"
            initial={{ strokeDashoffset: RING_LENGTH }}
            animate={{ strokeDashoffset: ring.hasFired ? dashoffset : RING_LENGTH }}
            transition={{ duration: ring.reducedMotion ? 0 : 1, ease: "easeOut" }}
          />

          {/* Phase ticks at 12 / 3 / 6 / 9 */}
          <line x1={90}  y1={11}  x2={90}  y2={21}  stroke="#1A1A1A" strokeWidth={2} />
          <line x1={159} y1={90}  x2={169} y2={90}  stroke="#1A1A1A" strokeWidth={2} />
          <line x1={90}  y1={159} x2={90}  y2={169} stroke="#1A1A1A" strokeWidth={2} />
          <line x1={11}  y1={90}  x2={21}  y2={90}  stroke="#1A1A1A" strokeWidth={2} />

          {/* Phase labels */}
          {phaseLabels.map((p) => {
            const active = p.num === buildStatus.phase;
            return (
              <text
                key={p.label}
                x={p.x}
                y={p.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily="var(--font-chakra-petch), sans-serif"
                fontSize={10}
                fontWeight={600}
                letterSpacing={1.5}
                fill={active ? "#500000" : "#9A9A9A"}
              >
                {p.label}
              </text>
            );
          })}

          {/* Center text — fades in with the number flip */}
          <motion.g
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: flip.hasFired ? 1 : 0,
              scale: flip.hasFired ? 1 : 0.95,
            }}
            transition={{ duration: flip.reducedMotion ? 0 : 0.3, ease: "easeOut" }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <text x={90} y={76} textAnchor="middle" fontFamily="var(--font-chakra-petch), sans-serif" fontSize={11} letterSpacing={2} fill="#888">
              BUILD PHASE
            </text>
            <text x={90} y={106} textAnchor="middle" fontFamily="var(--font-chakra-petch), sans-serif" fontSize={34} fontWeight={500} fill="#1A1A1A">
              {phaseStr}
              <tspan fill="#B0B0B0">{`/${totalStr}`}</tspan>
            </text>
          </motion.g>
        </svg>
      </div>

      {/* 4-segment build phase bar */}
      <BuildPhaseBar hasFired={phaseBar.hasFired} reducedMotion={phaseBar.reducedMotion} />

      {/* Subsystem list */}
      <ul className="list-none m-0 p-0 mt-5">
        {subsystems.map((sub, i) => {
          // Re-anchor existing stagger to the cascade beat. Original delays
          // (rowDelay = 1.4 + i*0.08, barDelay = rowDelay + 0.15) were measured
          // from component mount; the orchestrator now fires this beat at
          // t=1300ms, so the local delays start from 0 here.
          const rowDelay = i * 0.08;
          const barDelay = rowDelay + 0.15;
          const showRow = cascade.hasFired;
          return (
            <motion.li
              key={sub.name}
              className="grid grid-cols-[1fr_76px_auto] items-center gap-3 py-[9px]"
              style={{ borderTop: i === 0 ? "1px solid #D8D8D8" : "1px dotted #D8D8D8" }}
              initial={{ opacity: 0, y: 8 }}
              animate={showRow ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{
                duration: cascade.reducedMotion ? 0 : 0.28,
                delay: cascade.reducedMotion ? 0 : rowDelay,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span className="font-body text-[13.5px] text-[#1A1A1A]">{sub.name}</span>
              <span className="block h-[5px] w-[76px] bg-[#E8E8E8] relative overflow-hidden">
                <motion.span
                  className="absolute left-0 top-0 bottom-0 bg-[#500000]"
                  initial={{ width: 0 }}
                  animate={showRow ? { width: `${sub.progress}%` } : { width: 0 }}
                  transition={{
                    duration: cascade.reducedMotion ? 0 : 0.5,
                    delay: cascade.reducedMotion ? 0 : barDelay,
                    ease: "easeOut",
                  }}
                />
              </span>
              <span
                className="font-heading text-[10.5px] tracking-[0.08em] uppercase text-right"
                style={{ color: statusColor(sub.status) }}
              >
                {sub.status}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </aside>
  );
}

/* ──────── 4-segment build phase bar ──────── */
function BuildPhaseBar({ hasFired, reducedMotion }: { hasFired: boolean; reducedMotion: boolean }) {
  // 2 of 4 filled (current phase = 02). Segment 0 = complete (ink), segment 1 = active (maroon),
  // segments 2 and 3 = empty. Fills sequentially when the beat fires.
  const segmentDuration = reducedMotion ? 0 : 0.32;
  const stagger = reducedMotion ? 0 : 0.2;
  return (
    <div>
      <div className="flex items-baseline justify-between font-mono text-[10.5px] tracking-[.16em] uppercase text-ink-3 mb-2">
        <span className="text-ink-2">Build Phase</span>
        <span className="font-heading text-[14px] font-semibold text-ink tracking-[.02em]">
          {pad2(buildStatus.phase)} / {pad2(buildStatus.totalPhases)}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        <motion.span
          className="h-1.5 bg-ink origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: hasFired ? 1 : 0 }}
          transition={{ duration: segmentDuration, delay: 0, ease: "easeOut" }}
        />
        <motion.span
          className="h-1.5 bg-maroon relative origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: hasFired ? 1 : 0 }}
          transition={{ duration: segmentDuration, delay: stagger, ease: "easeOut" }}
        >
          <span className="absolute right-0 -top-0.5 -bottom-0.5 w-0.5 bg-maroon" />
        </motion.span>
        <span className="h-1.5 bg-[#1a1a1a12]" />
        <span className="h-1.5 bg-[#1a1a1a12]" />
      </div>
    </div>
  );
}
