import { useEffect, useRef } from "react";

// ─── Tunables ─────────────────────────────────────────────────────────────
const VIEWBOX_W = 600;
const VIEWBOX_H = 800;
const RIG_X = 300;
const RIG_Y = 350;
const RIG_R = 26;                       // central node radius
const RIG_GLOW_R_BASE = 58;             // outer glow base radius
const RIG_GLOW_PERIOD_S = 4.5;          // central breath period
const NODE_R = 3.6;
const NODE_HALO_R = 9;
const NODE_FILL = "#0A0A0A";            // matches dark slot background
const NODE_STROKE = "#FAFAFA";
const NODE_STROKE_WIDTH = 1;
const HALO_STROKE = "#FAFAFA";
const HALO_STROKE_WIDTH = 0.6;
const HALO_OPACITY_MIN = 0.18;
const HALO_OPACITY_MAX = 0.7;
const HALO_PULSE_S = 3.6;
const LABEL_FONT_SIZE = 9;
const LABEL_DY = 16;
const LABEL_COLOR = "#a0a0a0";
const LABEL_LETTER_SPACING = 0.7;
const PRIMARY_LINE_COLOR = "#FAFAFA";
const PRIMARY_LINE_OPACITY = 0.22;
const PRIMARY_LINE_WIDTH = 0.8;
const SECONDARY_LINE_COLOR = "#FAFAFA";
const SECONDARY_LINE_OPACITY = 0.12;
const SECONDARY_LINE_WIDTH = 0.5;
const SHIMMER_PERIOD_S = 14;
const SHIMMER_PEAK_OPACITY = 0.42;
const CENTRAL_COLOR = "#500000";
const CENTRAL_LABEL_COLOR = "#FAFAFA";
const FLOW_DOT_COLOR = "#C8963E";
const FLOW_DOT_R = 2.4;
const FLOW_TRAVEL_S = 1.6;
const FLOW_INTERVAL_MIN_S = 0.5;
const FLOW_INTERVAL_MAX_S = 1.6;
const MAX_FLOW_DOTS = 12;
const DRIFT_AMP_MIN = 4;
const DRIFT_AMP_MAX = 10;
const DRIFT_PERIOD_MIN_S = 11;
const DRIFT_PERIOD_MAX_S = 19;

// ─── Nodes ────────────────────────────────────────────────────────────────
type Cluster = "mech" | "elec" | "embed" | "sw" | "ml" | "ops";

type Node = {
  id: string;
  label: string;
  cluster: Cluster;
  x: number;
  y: number;
};

const NODES: Node[] = [
  // ── Mechanical (top-left)
  { id: "cad",        label: "CAD",            cluster: "mech",  x: 95,  y: 80 },
  { id: "machining",  label: "MACHINING",      cluster: "mech",  x: 215, y: 65 },
  { id: "structural", label: "STRUCTURAL",     cluster: "mech",  x: 135, y: 135 },
  { id: "materials",  label: "MATERIALS",      cluster: "mech",  x: 60,  y: 175 },
  { id: "hydraulics", label: "HYDRAULICS",     cluster: "mech",  x: 230, y: 150 },
  { id: "perf",       label: "PERF MODEL",     cluster: "mech",  x: 175, y: 215 },
  // ── Electrical (top-right)
  { id: "pcb",        label: "PCB LAYOUT",     cluster: "elec",  x: 385, y: 70 },
  { id: "circuit",    label: "CIRCUIT DESIGN", cluster: "elec",  x: 505, y: 85 },
  { id: "signal",     label: "SIGNAL COND",    cluster: "elec",  x: 440, y: 140 },
  { id: "sensor",     label: "SENSOR INTEG",   cluster: "elec",  x: 535, y: 165 },
  { id: "hvpower",    label: "HV POWER",       cluster: "elec",  x: 370, y: 175 },
  { id: "motor",      label: "MOTOR CTRL",     cluster: "elec",  x: 470, y: 215 },
  // ── Embedded (middle-left)
  { id: "embedc",     label: "EMBEDDED C",     cluster: "embed", x: 130, y: 295 },
  { id: "embed",      label: "EMBEDDED SYS",   cluster: "embed", x: 55,  y: 320 },
  { id: "stm32",      label: "STM32",          cluster: "embed", x: 145, y: 360 },
  { id: "rtos",       label: "RT SYSTEMS",     cluster: "embed", x: 65,  y: 395 },
  { id: "firmware",   label: "FIRMWARE ARCH",  cluster: "embed", x: 105, y: 450 },
  // ── Software (middle-right)
  { id: "control",    label: "CONTROL THEORY", cluster: "sw",    x: 550, y: 295 },
  { id: "cpp",        label: "C++",            cluster: "sw",    x: 460, y: 300 },
  { id: "python",     label: "PYTHON",         cluster: "sw",    x: 535, y: 345 },
  { id: "pid",        label: "PID CONTROL",    cluster: "sw",    x: 450, y: 385 },
  { id: "fsm",        label: "STATE MACHINES", cluster: "sw",    x: 555, y: 410 },
  { id: "sysint",     label: "SYS INTEG",      cluster: "sw",    x: 480, y: 460 },
  // ── Data / ML (bottom-left)
  { id: "ml",         label: "MACHINE LEARN",  cluster: "ml",    x: 200, y: 525 },
  { id: "fusion",     label: "SENSOR FUSION",  cluster: "ml",    x: 90,  y: 535 },
  { id: "pytorch",    label: "PYTORCH / TF",   cluster: "ml",    x: 245, y: 585 },
  { id: "cuda",       label: "CUDA / GPU",     cluster: "ml",    x: 115, y: 605 },
  { id: "pipeline",   label: "DATA PIPELINES", cluster: "ml",    x: 65,  y: 670 },
  { id: "deploy",     label: "MODEL DEPLOY",   cluster: "ml",    x: 215, y: 700 },
  // ── Safety / Ops (bottom-right)
  { id: "safety",     label: "SAFETY ENG",     cluster: "ops",   x: 435, y: 525 },
  { id: "risk",       label: "RISK ANALYSIS",  cluster: "ops",   x: 535, y: 545 },
  { id: "fmea",       label: "FMEA",           cluster: "ops",   x: 385, y: 600 },
  { id: "docs",       label: "DOCUMENTATION",  cluster: "ops",   x: 495, y: 650 },
  { id: "pm",         label: "PROJECT MGMT",   cluster: "ops",   x: 405, y: 705 },
];

// ─── Connections ──────────────────────────────────────────────────────────
// every peripheral node connects to the central rig (hub & spoke)
const PRIMARY_EDGES: string[] = NODES.map((n) => n.id);

// curated cross-cluster overlaps — disciplines that actually share work
const SECONDARY_EDGES: Array<[string, string]> = [
  // Software ↔ ML
  ["python", "ml"],
  ["python", "pipeline"],
  ["python", "fusion"],
  ["cpp", "cuda"],
  ["cpp", "embedc"],
  // Control bridges
  ["control", "pid"],
  ["pid", "motor"],
  ["control", "fsm"],
  ["fsm", "rtos"],
  // Sensor chain
  ["sensor", "fusion"],
  ["sensor", "signal"],
  ["signal", "pcb"],
  // ML internal
  ["ml", "pytorch"],
  ["ml", "deploy"],
  ["pytorch", "cuda"],
  ["pipeline", "deploy"],
  // Embedded chain
  ["embed", "stm32"],
  ["embed", "embedc"],
  ["embed", "firmware"],
  ["firmware", "rtos"],
  // Electrical internal
  ["circuit", "pcb"],
  ["pcb", "hvpower"],
  ["motor", "hvpower"],
  // Mech internal
  ["cad", "machining"],
  ["cad", "structural"],
  ["materials", "structural"],
  ["hydraulics", "perf"],
  ["perf", "ml"],
  // Ops internal
  ["safety", "risk"],
  ["safety", "fmea"],
  ["risk", "fmea"],
  ["fmea", "docs"],
  ["pm", "docs"],
  // System integration bridges
  ["sysint", "embed"],
  ["sysint", "deploy"],
];

// ─── Per-node runtime (drift parameters) ─────────────────────────────────
type NodeRuntime = {
  ampX: number; ampY: number;
  freqX: number; freqY: number;
  phaseX: number; phaseY: number;
};
const RUNTIME: Record<string, NodeRuntime> = {};
const HALO_DELAYS: Record<string, number> = {};
NODES.forEach((n, i) => {
  // deterministic pseudo-random based on index (SSR-stable)
  const rand = (k: number) => {
    const s = Math.sin(i * 137.3 + k * 31.7) * 10000;
    return s - Math.floor(s);
  };
  const ampX = DRIFT_AMP_MIN + rand(0) * (DRIFT_AMP_MAX - DRIFT_AMP_MIN);
  const ampY = DRIFT_AMP_MIN + rand(1) * (DRIFT_AMP_MAX - DRIFT_AMP_MIN);
  const perX = DRIFT_PERIOD_MIN_S + rand(2) * (DRIFT_PERIOD_MAX_S - DRIFT_PERIOD_MIN_S);
  const perY = DRIFT_PERIOD_MIN_S + rand(3) * (DRIFT_PERIOD_MAX_S - DRIFT_PERIOD_MIN_S);
  RUNTIME[n.id] = {
    ampX, ampY,
    freqX: (2 * Math.PI) / perX,
    freqY: (2 * Math.PI) / perY,
    phaseX: rand(4) * Math.PI * 2,
    phaseY: rand(5) * Math.PI * 2,
  };
  HALO_DELAYS[n.id] = -((i * 0.41) % HALO_PULSE_S);
});

// ─── Component ────────────────────────────────────────────────────────────
export default function DisciplineConstellation() {
  const nodeRefs = useRef<Record<string, SVGGElement | null>>({});
  const primaryLineRefs = useRef<Record<string, SVGLineElement | null>>({});
  const secondaryLineRefs = useRef<Record<string, SVGLineElement | null>>({});
  const flowDotRefs = useRef<Array<SVGCircleElement | null>>([]);
  const rigGlowOuterRef = useRef<SVGCircleElement | null>(null);
  const rigGlowMidRef = useRef<SVGCircleElement | null>(null);

  useEffect(() => {
    let rafId = 0;
    const start = performance.now();
    const positions: Record<string, [number, number]> = { rig: [RIG_X, RIG_Y] };

    type Dot = { sourceId: string; start: number } | null;
    const dots: Dot[] = Array(MAX_FLOW_DOTS).fill(null);
    let lastLaunch = 0;
    let nextInterval =
      FLOW_INTERVAL_MIN_S + Math.random() * (FLOW_INTERVAL_MAX_S - FLOW_INTERVAL_MIN_S);

    const launchDot = (t: number) => {
      const slot = dots.findIndex((d) => d === null);
      if (slot < 0) return;
      const node = NODES[Math.floor(Math.random() * NODES.length)];
      dots[slot] = { sourceId: node.id, start: t };
    };

    const tick = (now: number) => {
      const t = (now - start) / 1000;

      // 1) compute drifted positions and update node group transforms
      for (const n of NODES) {
        const rt = RUNTIME[n.id];
        const dx = rt.ampX * Math.sin(t * rt.freqX + rt.phaseX);
        const dy = rt.ampY * Math.cos(t * rt.freqY + rt.phaseY);
        positions[n.id] = [n.x + dx, n.y + dy];
        const g = nodeRefs.current[n.id];
        if (g) g.setAttribute("transform", `translate(${dx.toFixed(2)} ${dy.toFixed(2)})`);
      }

      // 2) primary edges follow their peripheral endpoint
      for (const id of PRIMARY_EDGES) {
        const line = primaryLineRefs.current[id];
        if (!line) continue;
        const [x, y] = positions[id];
        line.setAttribute("x1", x.toFixed(2));
        line.setAttribute("y1", y.toFixed(2));
      }

      // 3) secondary edges follow both endpoints
      for (const [a, b] of SECONDARY_EDGES) {
        const line = secondaryLineRefs.current[`${a}-${b}`];
        if (!line) continue;
        const [x1, y1] = positions[a];
        const [x2, y2] = positions[b];
        line.setAttribute("x1", x1.toFixed(2));
        line.setAttribute("y1", y1.toFixed(2));
        line.setAttribute("x2", x2.toFixed(2));
        line.setAttribute("y2", y2.toFixed(2));
      }

      // 4) central rig glow breathing (1.00 → 1.10 → 1.00)
      const breath = 1 + (Math.sin((t / RIG_GLOW_PERIOD_S) * Math.PI * 2) + 1) * 0.05;
      if (rigGlowOuterRef.current)
        rigGlowOuterRef.current.setAttribute("r", (RIG_GLOW_R_BASE * breath).toFixed(2));
      if (rigGlowMidRef.current)
        rigGlowMidRef.current.setAttribute("r", (RIG_GLOW_R_BASE * 0.66 * breath).toFixed(2));

      // 5) data-flow dots
      if (t - lastLaunch > nextInterval) {
        launchDot(t);
        lastLaunch = t;
        nextInterval =
          FLOW_INTERVAL_MIN_S + Math.random() * (FLOW_INTERVAL_MAX_S - FLOW_INTERVAL_MIN_S);
      }
      for (let i = 0; i < MAX_FLOW_DOTS; i++) {
        const dot = dots[i];
        const ref = flowDotRefs.current[i];
        if (!ref) continue;
        if (!dot) {
          ref.setAttribute("opacity", "0");
          continue;
        }
        const progress = (t - dot.start) / FLOW_TRAVEL_S;
        if (progress >= 1) {
          dots[i] = null;
          ref.setAttribute("opacity", "0");
          continue;
        }
        const eased = progress * progress; // accelerate toward the core
        const [sx, sy] = positions[dot.sourceId];
        const [rx, ry] = positions.rig;
        const x = sx + (rx - sx) * eased;
        const y = sy + (ry - sy) * eased;
        // fade in fast, fade out as we hit the core
        const op =
          progress < 0.85 ? Math.min(1, progress * 5) : 1 - (progress - 0.85) / 0.15;
        ref.setAttribute("cx", x.toFixed(2));
        ref.setAttribute("cy", y.toFixed(2));
        ref.setAttribute("opacity", op.toFixed(3));
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <style>{`
        @keyframes constellation-halo {
          0%, 100% { opacity: ${HALO_OPACITY_MIN}; }
          50%      { opacity: ${HALO_OPACITY_MAX}; }
        }
        @keyframes constellation-shimmer {
          0%, 78%, 100% { opacity: ${SECONDARY_LINE_OPACITY}; }
          86%           { opacity: ${SHIMMER_PEAK_OPACITY}; }
          94%           { opacity: ${SECONDARY_LINE_OPACITY}; }
        }
      `}</style>

      {/* Secondary cross-cluster edges (bottom layer) */}
      <g shapeRendering="geometricPrecision">
        {SECONDARY_EDGES.map(([a, b], i) => {
          const na = NODES.find((n) => n.id === a)!;
          const nb = NODES.find((n) => n.id === b)!;
          const delay = -((i * 1.7) % SHIMMER_PERIOD_S);
          return (
            <line
              key={`sec-${a}-${b}`}
              ref={(el) => {
                secondaryLineRefs.current[`${a}-${b}`] = el;
              }}
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              stroke={SECONDARY_LINE_COLOR}
              strokeWidth={SECONDARY_LINE_WIDTH}
              opacity={SECONDARY_LINE_OPACITY}
              style={{
                animation: `constellation-shimmer ${SHIMMER_PERIOD_S}s ease-in-out infinite`,
                animationDelay: `${delay.toFixed(2)}s`,
              }}
            />
          );
        })}
      </g>

      {/* Primary hub-and-spoke edges */}
      <g shapeRendering="geometricPrecision">
        {NODES.map((n) => (
          <line
            key={`prim-${n.id}`}
            ref={(el) => {
              primaryLineRefs.current[n.id] = el;
            }}
            x1={n.x}
            y1={n.y}
            x2={RIG_X}
            y2={RIG_Y}
            stroke={PRIMARY_LINE_COLOR}
            strokeWidth={PRIMARY_LINE_WIDTH}
            opacity={PRIMARY_LINE_OPACITY}
          />
        ))}
      </g>

      {/* Data-flow dot pool */}
      <g>
        {Array.from({ length: MAX_FLOW_DOTS }).map((_, i) => (
          <circle
            key={`dot-${i}`}
            ref={(el) => {
              flowDotRefs.current[i] = el;
            }}
            cx={0}
            cy={0}
            r={FLOW_DOT_R}
            fill={FLOW_DOT_COLOR}
            opacity={0}
          />
        ))}
      </g>

      {/* Central RIG node + breathing glow */}
      <g>
        <circle
          ref={rigGlowOuterRef}
          cx={RIG_X}
          cy={RIG_Y}
          r={RIG_GLOW_R_BASE}
          fill={CENTRAL_COLOR}
          opacity={0.08}
        />
        <circle
          ref={rigGlowMidRef}
          cx={RIG_X}
          cy={RIG_Y}
          r={RIG_GLOW_R_BASE * 0.66}
          fill={CENTRAL_COLOR}
          opacity={0.18}
        />
        <circle
          cx={RIG_X}
          cy={RIG_Y}
          r={RIG_R}
          fill={CENTRAL_COLOR}
          stroke="#FAFAFA"
          strokeWidth={1.6}
        />
        <text
          x={RIG_X}
          y={RIG_Y + 3.5}
          textAnchor="middle"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fontSize={10}
          fontWeight={600}
          letterSpacing={1.6}
          fill={CENTRAL_LABEL_COLOR}
        >
          THE RIG
        </text>
      </g>

      {/* Peripheral nodes (each in its own translated group) */}
      <g shapeRendering="geometricPrecision">
        {NODES.map((n) => (
          <g
            key={`node-${n.id}`}
            ref={(el) => {
              nodeRefs.current[n.id] = el;
            }}
          >
            <circle
              cx={n.x}
              cy={n.y}
              r={NODE_HALO_R}
              fill="none"
              stroke={HALO_STROKE}
              strokeWidth={HALO_STROKE_WIDTH}
              opacity={HALO_OPACITY_MIN}
              style={{
                animation: `constellation-halo ${HALO_PULSE_S}s ease-in-out infinite`,
                animationDelay: `${HALO_DELAYS[n.id].toFixed(2)}s`,
              }}
            />
            <circle
              cx={n.x}
              cy={n.y}
              r={NODE_R}
              fill={NODE_FILL}
              stroke={NODE_STROKE}
              strokeWidth={NODE_STROKE_WIDTH}
            />
            <text
              x={n.x}
              y={n.y + LABEL_DY}
              textAnchor="middle"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              fontSize={LABEL_FONT_SIZE}
              fill={LABEL_COLOR}
              letterSpacing={LABEL_LETTER_SPACING}
            >
              {n.label}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
