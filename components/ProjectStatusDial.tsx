import { useRef } from "react";
import { motion, useInView } from "framer-motion";

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

export default function ProjectStatusDial() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const dashoffset = RING_LENGTH * (1 - buildStatus.percentComplete / 100);
  const phaseStr = pad2(buildStatus.phase);
  const totalStr = pad2(buildStatus.totalPhases);

  const phaseLabels = [
    { num: 1, label: "01", x: 90, y: -2 },
    { num: 2, label: "02", x: 182, y: 90 },
    { num: 3, label: "03", x: 90, y: 182 },
    { num: 4, label: "04", x: -2, y: 90 },
  ];

  return (
    <aside
      ref={ref}
      className="flex flex-col py-6 pl-8"
      aria-label="Project status"
    >
      {/* 1. Status row */}
      <div className="flex items-center justify-end gap-1.5 font-heading text-[11px] tracking-[0.1em] uppercase text-[#1A1A1A]">
        <motion.span
          className="inline-block w-1.5 h-1.5 rounded-full bg-[#500000]"
          animate={inView ? { opacity: [1, 0.35, 1] } : { opacity: 1 }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <span>IN BUILD</span>
      </div>

      {/* 2. Radial dial */}
      <div className="mt-5 mb-6 flex justify-center">
        <svg width={216} height={216} viewBox="-12 -12 204 204" aria-hidden="true">
          {/* Track ring */}
          <circle
            cx={90}
            cy={90}
            r={74}
            fill="none"
            stroke="#E8E8E8"
            strokeWidth={6}
          />

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
            animate={
              inView
                ? { strokeDashoffset: dashoffset }
                : { strokeDashoffset: RING_LENGTH }
            }
            transition={{ duration: 1, ease: "easeOut" }}
          />

          {/* Phase ticks at 12 / 3 / 6 / 9 */}
          <line x1={90}  y1={11}  x2={90}  y2={21}  stroke="#1A1A1A" strokeWidth={1} />
          <line x1={159} y1={90}  x2={169} y2={90}  stroke="#1A1A1A" strokeWidth={1} />
          <line x1={90}  y1={159} x2={90}  y2={169} stroke="#1A1A1A" strokeWidth={1} />
          <line x1={11}  y1={90}  x2={21}  y2={90}  stroke="#1A1A1A" strokeWidth={1} />

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
                fontSize={8}
                letterSpacing={1.5}
                fill={active ? "#500000" : "#B0B0B0"}
              >
                {p.label}
              </text>
            );
          })}

          {/* Center text */}
          <motion.g
            initial={{ opacity: 0, scale: 0.95 }}
            animate={
              inView
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.95 }
            }
            transition={{ duration: 0.3, delay: 0.4, ease: "easeOut" }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <text
              x={90}
              y={76}
              textAnchor="middle"
              fontFamily="var(--font-chakra-petch), sans-serif"
              fontSize={11}
              letterSpacing={2}
              fill="#888"
            >
              BUILD PHASE
            </text>
            <text
              x={90}
              y={106}
              textAnchor="middle"
              fontFamily="var(--font-chakra-petch), sans-serif"
              fontSize={34}
              fontWeight={500}
              fill="#1A1A1A"
            >
              {phaseStr}
              <tspan fill="#B0B0B0">{`/${totalStr}`}</tspan>
            </text>
            <text
              x={90}
              y={125}
              textAnchor="middle"
              fontFamily="var(--font-chakra-petch), sans-serif"
              fontSize={10}
              letterSpacing={2}
              fill="#500000"
            >
              {`${buildStatus.percentComplete}% COMPLETE`}
            </text>
          </motion.g>
        </svg>
      </div>

      {/* 3. Subsystem list */}
      <ul className="list-none m-0 p-0">
        {subsystems.map((sub, i) => {
          const rowDelay = 1.4 + i * 0.08;
          const barDelay = rowDelay + 0.15;
          return (
            <motion.li
              key={sub.name}
              className="grid grid-cols-[1fr_60px_auto] items-center gap-3 py-[7px]"
              style={{
                borderTop:
                  i === 0
                    ? "1px solid #D8D8D8"
                    : "1px dotted #D8D8D8",
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{
                duration: 0.28,
                delay: rowDelay,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span className="font-body text-[12px] text-[#1A1A1A]">
                {sub.name}
              </span>
              <span className="block h-1 w-[60px] bg-[#E8E8E8] relative overflow-hidden">
                <motion.span
                  className="absolute left-0 top-0 bottom-0 bg-[#500000]"
                  initial={{ width: 0 }}
                  animate={
                    inView ? { width: `${sub.progress}%` } : { width: 0 }
                  }
                  transition={{
                    duration: 0.5,
                    delay: barDelay,
                    ease: "easeOut",
                  }}
                />
              </span>
              <span
                className="font-heading text-[9px] tracking-[0.08em] uppercase text-right"
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
