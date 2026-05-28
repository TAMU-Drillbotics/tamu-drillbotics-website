import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import GridReveal from "@/components/GridReveal";
import ProjectStatusDial from "@/components/ProjectStatusDial";
import { TimelineOrchestrator, useTimelineBeat } from "@/components/TimelineOrchestrator";
import { HERO_TIMELINE } from "@/lib/heroTimeline";

function CrossMark({ className, light }: { className: string; light?: boolean }) {
  const color = light ? "bg-[#ffffff6e]" : "bg-ink-4";
  return (
    <span className={`absolute w-3.5 h-3.5 ${className}`} aria-hidden="true">
      <span className={`absolute left-0 right-0 top-1/2 h-px ${color}`} />
      <span className={`absolute top-0 bottom-0 left-1/2 w-px ${color}`} />
    </span>
  );
}

function HeroCrossMark({ className, index }: { className: string; index: number }) {
  const { hasFired } = useTimelineBeat("cornerCrosses");
  // 100ms stagger between the four corners, preserving the original feel.
  const baseDelay = index * 0.1;
  return (
    <span className={`absolute w-3.5 h-3.5 ${className}`} aria-hidden="true">
      <motion.span
        className="absolute left-0 right-0 top-1/2 h-px bg-ink-4 origin-left"
        initial={{ scaleX: 0 }}
        animate={hasFired ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.15, delay: baseDelay, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.span
        className="absolute top-0 bottom-0 left-1/2 w-px bg-ink-4 origin-top"
        initial={{ scaleY: 0 }}
        animate={hasFired ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 0.15, delay: baseDelay + 0.1, ease: [0.16, 1, 0.3, 1] }}
      />
    </span>
  );
}

function HeroGrid() {
  const { hasFired } = useTimelineBeat("gridDraw");
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {Array.from({ length: 36 }, (_, i) => (
        <motion.span
          key={`v-${i}`}
          className="absolute top-0 bottom-0 w-px origin-top"
          style={{ left: 80 * (i + 1) - 1, backgroundColor: "#EBEBEB" }}
          initial={{ scaleY: 0 }}
          animate={hasFired ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.4, delay: i * 0.015, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
      {Array.from({ length: 20 }, (_, i) => (
        <motion.span
          key={`h-${i}`}
          className="absolute left-0 right-0 h-px origin-left"
          style={{ top: 80 * (i + 1) - 1, backgroundColor: "#EBEBEB" }}
          initial={{ scaleX: 0 }}
          animate={hasFired ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.5, delay: 0.08 + i * 0.02, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </div>
  );
}

const pillars = [
  {
    num: "01",
    vector: " /Education",
    heading: "Build full-stack engineers",
    body: "Students who understand mechanical design, embedded systems, edge computing, and machine learning not as separate disciplines, but as complementing fields that the industry increasingly demands together.",
    tagLabel: "Disciplines",
    tags: ["MECHANICAL","PETROLEUM", "ELECTRICAL", "CS"],
  },
  {
    num: "02",
    vector: " /Industry",
    heading: "Bring autonomy to oil & gas",
    body: "The industry runs on some of the most complex and dangerous operations on earth. We’re building the next generation of engineers who automate them.",
    tagLabel: "Domain",
    tags: ["UPSTREAM", "DOWNSTREAM", "DRILLING"],
  },
  {
    num: "03",
    vector: " /Engineering",
    heading: "Start small, think at scale",
    body: "Our rig is scaled-down, but the control systems, sensor fusion, and ML pipelines we develop mirror what’s being deployed in industry today.",
    tagLabel: "Stack",
    tags: ["STM32", "PyTorch", "CUDA"],
  },
];

// Paste each company homepage below (include https://). Leave "" until you have a link — the logo stays visible but not clickable.
const sponsors = [
  { name: "Diamondback Energy", logo: "/sponsors/diamondback-energy-logo.jpg", url: "https://ir.diamondbackenergy.com/" },
  { name: "Nabors", logo: "/sponsors/nabors-logo.png", url: "https://www.nabors.com/" },
  { name: "Sabine Oil & Gas", logo: "/sponsors/sabine-logo.jpeg", url: "https://www.sabineenergy.com/" },
  { name: "Scandrill", logo: "/sponsors/scandrill-logo.png", url: "https://www.scandrill.com/" },
  { name: "Patterson-UTI", logo: "/sponsors/patterson-uti-logo.png", url: "https://patenergy.com/" },
  { name: "Hibernia Resources", logo: "/sponsors/hibernia-logo.jpg", url: "https://www.hiberniaresources.com/" },
];

const subsystems = [
  { name: "Hoist / Elevator", progress: 100, status: "OPERATIONAL" },
  { name: "Drillstring", progress: 35, status: "IN BUILD" },
  { name: "Sensor Array", progress: 20, status: "IN DESIGN" },
  { name: "Control System", progress: 25, status: "PROTOTYPING" },
  { name: "Autonomy / ML", progress: 10, status: "RESEARCH" },
  { name: "Mud System", progress: 0, status: "NOT STARTED" },
  { name: "Bit Cooling", progress: 0, status: "NOT STARTED" },
  { name: "Telemetry", progress: 0, status: "NOT STARTED" },
  { name: "Safety Interlock", progress: 5, status: "PLANNING" },
];

const STATUS_DATE = { month: 5, day: 10, year: 26 };

const BUILD_BAR_DELAY = 0;
const BUILD_BAR_STAGGER = 0.2;
const BUILD_BAR_DURATION = 0.32;
const SUB_START = 0.65;
const SUB_STAGGER = 0.16;
const SUB_DURATION = 0.38;
const STATUS_WEEK = 14;
const DATE_DELAY_MS = (SUB_START + subsystems.length * SUB_STAGGER + SUB_DURATION) * 1000;

function FlipCounter({ target, delayMs, active }: { target: number; delayMs: number; active: boolean }) {
  const [value, setValue] = useState(1);
  const started = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    if (!active || started.current) return;
    const timeout = setTimeout(() => {
      started.current = true;
      let v = 1;
      intervalRef.current = setInterval(() => {
        v++;
        setValue(v);
        if (v >= target) clearInterval(intervalRef.current);
      }, 65);
    }, delayMs);
    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, delayMs, target]);

  const display = String(value).padStart(2, "0");

  return (
    <span className="inline-block overflow-hidden relative align-baseline" style={{ height: "1.2em", width: "2.4ch" }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          className="block"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-110%" }}
          transition={{ duration: 0.065, ease: [0.16, 1, 0.3, 1] }}
        >
          {display}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function StatusPanel() {
  const panelRef = useRef<HTMLElement>(null);
  const inView = useInView(panelRef, { once: true, margin: "-100px" });

  return (
    <aside ref={panelRef} className="flex flex-col border-l border-rule-strong py-6 pl-8" aria-label="Project status">
      {/* Panel header */}
      <div className="flex items-center justify-between font-mono text-[11px] tracking-[.18em] uppercase text-ink-3 pb-3.5 border-b border-rule-strong">
        <span className="text-ink font-medium">Project Status &middot; 2026</span>
      </div>

      {/* Build phase */}
      <div className="py-[18px] border-b border-rule-strong">
        <div className="flex items-baseline justify-between font-mono text-[10.5px] tracking-[.16em] uppercase text-ink-3">
          <span className="text-ink-2">Build Phase</span>
          <span className="font-heading text-[22px] font-semibold text-ink tracking-[.02em]">02 / 04</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 my-3.5">
          <motion.span
            className="h-1.5 bg-ink origin-left"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: BUILD_BAR_DURATION, delay: BUILD_BAR_DELAY, ease: "easeOut" }}
          />
          <motion.span
            className="h-1.5 bg-maroon relative origin-left"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: BUILD_BAR_DURATION, delay: BUILD_BAR_DELAY + BUILD_BAR_STAGGER, ease: "easeOut" }}
          >
            <span className="absolute right-0 -top-0.5 -bottom-0.5 w-0.5 bg-maroon" />
          </motion.span>
          <span className="h-1.5 bg-[#1a1a1a12]" />
          <span className="h-1.5 bg-[#1a1a1a12]" />
        </div>
        <div className="flex items-baseline justify-between font-mono text-[10px] tracking-[.16em] uppercase text-ink-2">
          <span>Subsystem Integration</span>
          <span className="text-ink-3">Next &middot; Drivetrain </span>
        </div>
      </div>

      {/* Subsystems header — pinned */}
      <div className="flex justify-between pt-[18px] pb-2.5 font-mono text-[10px] tracking-[.18em] uppercase text-ink-4 border-b border-rule-strong">
        <span>Subsystems</span>
        <span>Progress</span>
      </div>

      {/* Subsystems list — scrollable */}
      <ul className="list-none m-0 p-0 overflow-y-auto subs-scroll" style={{ maxHeight: "230px" }}>
        {subsystems.map((sub, i) => {
          const isOperational = sub.status === "OPERATIONAL";
          const isDimmed = sub.status === "NOT STARTED" || sub.status === "PLANNING";
          return (
            <motion.li
              key={sub.name}
              className="grid grid-cols-[1fr_64px_auto] items-center gap-3.5 py-[13px] border-b border-dashed border-rule-strong"
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.22,
                delay: SUB_START + i * SUB_STAGGER,
                ease: "easeOut",
              }}
            >
              <span className={`font-heading font-medium text-sm tracking-[.01em] ${isDimmed ? "text-ink-4" : "text-ink"}`}>
                {sub.name}
              </span>
              <span className="h-1 bg-[#1a1a1a14] relative overflow-hidden">
                {sub.progress > 0 && (
                  <motion.span
                    className={`absolute left-0 top-0 bottom-0 ${isOperational ? "bg-maroon" : "bg-ink"}`}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${sub.progress}%` } : {}}
                    transition={{
                      duration: SUB_DURATION,
                      delay: SUB_START + i * SUB_STAGGER + 0.15,
                      ease: "easeOut",
                    }}
                  />
                )}
              </span>
              <span
                className={`font-mono text-[10px] tracking-[.14em] uppercase min-w-[88px] text-right ${
                  isOperational ? "text-maroon" : isDimmed ? "text-ink-4" : "text-ink-3"
                }`}
              >
                {sub.status}
              </span>
            </motion.li>
          );
        })}
      </ul>

      {/* Panel footer */}
      <div className="mt-auto pt-[18px] border-t border-rule-strong flex items-center justify-between font-mono text-[10.5px] tracking-[.14em] uppercase text-ink-3">
        <span>
          Last update &middot;{" "}
          <span className="text-ink">
            <FlipCounter target={STATUS_DATE.month} delayMs={DATE_DELAY_MS} active={inView} />
            {" / "}
            <FlipCounter target={STATUS_DATE.day} delayMs={DATE_DELAY_MS} active={inView} />
            {" / "}
            {STATUS_DATE.year}
          </span>
        </span>
        <span>
          Wk <FlipCounter target={STATUS_WEEK} delayMs={DATE_DELAY_MS} active={inView} /> / 32
        </span>
      </div>
    </aside>
  );
}

/* ════════ hero beat-gated pieces ════════ */

const FADE_UP_8 = { hidden: { opacity: 0, y: 8 }, shown: { opacity: 1, y: 0 } };
const CLIP_WIPE = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  shown: { clipPath: "inset(0 0 0 0)" },
};

function Eyebrow() {
  const rect = useTimelineBeat("metadataRect");
  const expand = useTimelineBeat("metadataExpand");
  return (
    <div className="flex items-center gap-3.5 font-mono text-[11.5px] tracking-[.18em] uppercase text-ink-2 mb-10">
      <motion.span
        className="inline-flex items-center gap-3.5"
        initial="hidden"
        animate={rect.hasFired ? "shown" : "hidden"}
        variants={FADE_UP_8}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <span className="inline-flex items-center gap-2 border border-rule-strong px-2.5 py-[5px] bg-white">
          <span className="w-[7px] h-[7px] rounded-full bg-maroon shadow-[0_0_0_3px_#50000020]" />
          RIG-02 &middot; BUILD CYCLE 1
        </span>
        <span className="text-ink-4">/</span>
      </motion.span>
      <motion.span
        className="inline-block"
        style={{ clipPath: "inset(0 100% 0 0)" }}
        initial="hidden"
        animate={expand.hasFired ? "shown" : "hidden"}
        variants={CLIP_WIPE}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        SPE Drillbotics&reg;
      </motion.span>
    </div>
  );
}

function Wordmark() {
  const headline = useTimelineBeat("headlineReveal");
  const label = useTimelineBeat("universityLabel");
  const headlineState = headline.hasFired ? "shown" : "hidden";
  const headlineTransition = { duration: 0.5, ease: "easeOut" } as const;
  return (
    <h1 className="font-heading font-bold text-[56px] md:text-[148px] leading-[.86] tracking-[-.025em] uppercase m-0 text-ink">
      <span className="flex items-baseline gap-[18px]">
        <motion.span
          className="inline-block"
          style={{ clipPath: "inset(0 100% 0 0)" }}
          initial="hidden"
          animate={headlineState}
          variants={CLIP_WIPE}
          transition={headlineTransition}
        >
          Tamu
        </motion.span>
        <motion.span
          className="font-mono text-[11px] md:text-[13px] font-normal tracking-[.12em] text-ink-3 uppercase -translate-y-[32px] md:-translate-y-[90px] border-l border-rule-strong pl-2 md:pl-3.5 leading-normal whitespace-nowrap inline-block"
          style={{ clipPath: "inset(0 100% 0 0)" }}
          initial="hidden"
          animate={label.hasFired ? "shown" : "hidden"}
          variants={CLIP_WIPE}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          Texas A&amp;M University
          <span className="text-ink font-medium block">College Station, TX</span>
        </motion.span>
      </span>
      <motion.span
        className="inline-flex items-baseline pr-[0.08em]"
        style={{ clipPath: "inset(0 100% 0 0)" }}
        initial="hidden"
        animate={headlineState}
        variants={CLIP_WIPE}
        transition={headlineTransition}
      >
        <span>Drillbotics</span>
        <span className="text-maroon">.</span>
      </motion.span>
    </h1>
  );
}

function Lede() {
  const { hasFired } = useTimelineBeat("elevatorPitch");
  return (
    <motion.p
      className="mt-6 md:mt-12 max-w-[580px] text-[16px] md:text-[19px] leading-relaxed text-ink-2"
      initial="hidden"
      animate={hasFired ? "shown" : "hidden"}
      variants={FADE_UP_8}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      We{" "}
      <strong className="text-[#500000] font-semibold">design</strong>,{" "}
      <strong className="text-[#500000] font-semibold">build</strong>, and{" "}
      <strong className="text-[#500000] font-semibold">program</strong> autonomous drilling rigs.
      Steel, sensors, and machine learning — backed by industry.
    </motion.p>
  );
}

function Ctas() {
  const { hasFired } = useTimelineBeat("ctas");
  return (
    <motion.div
      className="mt-8 md:mt-12 flex flex-wrap items-center gap-3.5"
      initial="hidden"
      animate={hasFired ? "shown" : "hidden"}
      variants={FADE_UP_8}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Link
        href="/engineering"
        className="hero-btn hero-btn--maroon font-heading tracking-[.14em] uppercase"
      >
        <span className="hero-btn-outer">
          <span className="hero-btn-inner">
            <span>The Engineering</span>
          </span>
        </span>
      </Link>
      <Link
        href="/about#team"
        className="hero-btn font-heading tracking-[.14em] uppercase"
      >
        <span className="hero-btn-outer">
          <span className="hero-btn-inner">
            <span>The Team</span>
          </span>
        </span>
      </Link>
    </motion.div>
  );
}

function BottomMetadataInner() {
  const { hasFired } = useTimelineBeat("bottomMetadata");
  return (
    <motion.div
      className="max-w-[1440px] mx-auto px-5 md:px-14 py-2 flex items-center gap-6 font-mono text-[9.5px] tracking-[.16em] uppercase text-ink-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: hasFired ? 1 : 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <span>
        EST.{" "}
        <span className="text-ink-2 font-medium tracking-[.12em]">2015</span>
      </span>
      <div className="ml-auto flex items-center gap-6">
        <span className="inline-flex items-center gap-2 text-ink-3">
          <span>Scroll</span>
          <span className="w-[22px] h-px bg-ink-4" />
        </span>
      </div>
    </motion.div>
  );
}

const missionFade = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, delay, ease: "easeOut" as const },
  }),
};

function MissionSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  const bodyRef = useRef<HTMLDivElement>(null);
  const bodyInView = useInView(bodyRef, { once: true, margin: "-80px" });

  const [workBounce, setWorkBounce] = useState(false);
  useEffect(() => {
    if (!bodyInView || workBounce) return;
    const t = setTimeout(() => setWorkBounce(true), 400);
    return () => clearTimeout(t);
  }, [bodyInView, workBounce]);

  const pillar0Ref = useRef<HTMLLIElement>(null);
  const pillar1Ref = useRef<HTMLLIElement>(null);
  const pillar2Ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress: pp0 } = useScroll({ target: pillar0Ref, offset: ["start center", "end center"] });
  const { scrollYProgress: pp1 } = useScroll({ target: pillar1Ref, offset: ["start center", "end center"] });
  const { scrollYProgress: pp2 } = useScroll({ target: pillar2Ref, offset: ["start center", "end center"] });
  const numColor0 = useTransform(pp0, [0, 0.4, 0.6, 1], ["#1A1A1A", "#500000", "#500000", "#1A1A1A"]);
  const numColor1 = useTransform(pp1, [0, 0.4, 0.6, 1], ["#1A1A1A", "#500000", "#500000", "#1A1A1A"]);
  const numColor2 = useTransform(pp2, [0, 0.4, 0.6, 1], ["#1A1A1A", "#500000", "#500000", "#1A1A1A"]);
  const pillarRefs = [pillar0Ref, pillar1Ref, pillar2Ref];
  const pillarNumColors = [numColor0, numColor1, numColor2];

  const lineDelay = 0;
  const lineDuration = 0.32;
  const textDelay = lineDuration + 0.2;

  return (
    <section className="relative">
      {/* Section header bar */}
      <div ref={headerRef} className="bg-bg/85 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-5 md:px-14 py-3.5 flex items-center gap-[18px] font-mono text-[11px] tracking-[.18em] uppercase text-ink-3">
          <motion.span
            className="inline-flex items-baseline gap-2.5 text-ink font-medium"
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.26, delay: textDelay }}
          >
            <span className="text-maroon font-medium">&sect; 01</span> Our Mission
          </motion.span>
          <motion.span
            className="flex-1 h-px bg-rule-strong origin-center"
            initial={{ scaleX: 0 }}
            animate={headerInView ? { scaleX: 1 } : {}}
            transition={{ duration: lineDuration, delay: lineDelay, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      <div ref={bodyRef} className="max-w-[1440px] mx-auto px-5 md:px-14 py-12 md:py-20 pb-10 relative">
        <CrossMark className="hidden md:block left-[42px] top-8" />
        <CrossMark className="hidden md:block right-[42px] top-8" />
        <CrossMark className="hidden md:block left-[42px] bottom-8" />
        <CrossMark className="hidden md:block right-[42px] bottom-8" />

        {/* Intro block */}
        <header className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 md:gap-x-16 items-end pb-8 md:pb-12 border-b border-rule-strong">
          <div>
            <motion.h2
              className="font-heading font-semibold text-[40px] md:text-[72px] leading-[.94] tracking-[-.02em] m-0 text-ink"
              variants={missionFade}
              initial="hidden"
              animate={bodyInView ? "visible" : "hidden"}
              custom={0.1}
            >
              The <span className={`text-maroon ${workBounce ? "bounce-active" : "inline-block"}`}>work</span> behind the work<span className="text-maroon">&hellip;</span>
            </motion.h2>
          </div>
          <motion.p
            className="text-[17px] leading-relaxed text-ink-2 max-w-[460px] ml-auto mb-2"
            variants={missionFade}
            initial="hidden"
            animate={bodyInView ? "visible" : "hidden"}
            custom={0.22}
          >
          </motion.p>
        </header>

        {/* Pillars */}
        <ol className="list-none m-0 p-0">
          {pillars.map((pillar, i) => (
            <motion.li
              ref={pillarRefs[i]}
              key={pillar.num}
              className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-y-4 gap-x-8 md:gap-x-16 py-10 md:py-14 relative"
              variants={missionFade}
              initial="hidden"
              animate={bodyInView ? "visible" : "hidden"}
              custom={0.35 + i * 0.13}
            >
              {/* Left rail */}
              <div className="flex flex-col items-start gap-3.5">
                <motion.span
                  style={{ color: pillarNumColors[i] }}
                  className="font-heading font-semibold text-[44px] md:text-[84px] leading-[.85] tracking-[-.02em]"
                >
                  {pillar.num}
                </motion.span>
                <span
                  className={`block w-9 h-0.5 mt-1.5 ${i === 1 ? "bg-maroon" : "bg-ink"}`}
                />
                <span className="font-mono text-[11px] tracking-[.18em] uppercase text-ink-3">
                  {pillar.vector}
                </span>
              </div>

              {/* Right content */}
              <div className="max-w-[760px] pt-1.5">
                <h3 className="font-heading font-semibold text-[40px] leading-[1.05] tracking-[-.012em] m-0 mb-[22px] text-ink">
                  {pillar.heading}
                  <span className="text-maroon">.</span>
                </h3>
                <p className="text-[19px] leading-relaxed text-ink-2 m-0 max-w-[680px]">
                  {pillar.body}
                </p>
                <div className="mt-7 flex items-center gap-[18px] font-mono text-[10.5px] tracking-[.18em] uppercase text-ink-4">
                  <span>{pillar.tagLabel}</span>
                  <div className="flex gap-2 flex-wrap">
                    {pillar.tags.map((tag) => (
                      <span
                        key={tag}
                        className="oct-clip-xs border border-rule-strong px-[9px] py-1 text-ink-2 bg-white tracking-[.16em]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["end end", "end start"],
  });
  const heroContentY = useTransform(heroProgress, [0, 1], [0, -30]);
  const heroContentOpacity = useTransform(heroProgress, [0, 0.35], [1, 0]);
  const heroStripOpacity = useTransform(heroProgress, [0, 0.2], [1, 0]);

  return (
    <TimelineOrchestrator timeline={HERO_TIMELINE}>
      <div className="isolate flex flex-col">
        <GridReveal lineColor="rgba(26,26,26,0.16)" />
        <Nav />
        {/* ══════════ HERO — 100vh minus nav ══════════ */}
        <div ref={heroRef} className="h-[calc(100vh-57px)] flex flex-col relative bg-bg">
        <HeroGrid />

        <motion.main
          className="flex-1 max-w-[1440px] mx-auto w-full px-5 md:px-14 pt-14 pb-10 md:py-10 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_360px] gap-x-8 md:gap-x-16 items-start md:items-center relative"
          style={{ y: heroContentY, opacity: heroContentOpacity }}
        >
          <HeroCrossMark className="hidden md:block left-[42px] top-[42px]" index={0} />
          <HeroCrossMark className="hidden md:block right-[42px] top-[42px]" index={1} />

          {/* ── Left column ── */}
          <section className="flex flex-col justify-center">
            {/* Eyebrow */}
            <Eyebrow />

            {/* Wordmark */}
            <Wordmark />

            {/* Lede */}
            <Lede />

            {/* CTAs */}
            <Ctas />
          </section>

          {/* ── Right column: Status panel — hidden on mobile ── */}
          <div className="hidden md:block">
            <ProjectStatusDial />
          </div>

        </motion.main>

        {/* Bottom metadata strip */}
        <motion.footer
          className="absolute bottom-8 left-0 right-0 border-t border-rule bg-bg/70"
          style={{ opacity: heroStripOpacity }}
        >
          <BottomMetadataInner />
        </motion.footer>
      </div>

      {/* ══════════ MISSION ══════════ */}
      <MissionSection />

      {/* ══════════ SPONSORS ══════════ */}
      <section className="relative">
        <div className="max-w-[1440px] mx-auto pt-2 pb-11">
          {/* Intro — bridges the mission section to the marquee */}
          <div className="px-5 md:px-14 pb-9">
            <h2 className="font-heading font-semibold text-[36px] md:text-[72px] leading-[.94] tracking-[-.02em] text-ink m-0">
              <span className="text-maroon">&hellip;</span>and the companies that back our work
              <span
                className="relative inline-block align-baseline"
                style={{ width: 0, height: 0 }}
                aria-hidden="true"
              >
                <svg
                  className="absolute left-[8px] -top-[20px] w-10 h-[55px] md:left-[14px] md:-top-[38px] md:w-20 md:h-[110px] overflow-visible"
                  viewBox="0 0 80 110"
                >
                  <motion.path
                    d="M 0,18 L 14,18 Q 30,18 30,34 L 30,76"
                    stroke="#500000"
                    strokeWidth="7"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true, amount: 0 }}
                    transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                  />
                  <motion.path
                    d="M 21,72 L 30,84 L 39,72"
                    stroke="#500000"
                    strokeWidth="7"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0 }}
                    transition={{
                      pathLength: { duration: 0.22, ease: "easeOut", delay: 0.85 },
                      opacity: { duration: 0.01, delay: 0.85 },
                    }}
                  />
                </svg>
              </span>
            </h2>
          </div>

          {/* Marquee */}
          <div className="overflow-hidden group/marquee">
            <div
              className="flex w-max"
              style={{ animation: "marquee 35s linear infinite" }}
              onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = "paused")}
              onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = "running")}
            >
              {[0, 1].map((set) =>
                sponsors.map((sponsor) => {
                  const href = sponsor.url.trim();
                  const cardClass =
                    "flex flex-col items-center justify-center gap-4 py-11 px-12 no-underline group transition-[background] duration-150 hover:bg-white shrink-0";
                  const inner = (
                    <>
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        className="h-[52px] w-auto max-w-[180px] object-contain grayscale opacity-60 transition-all duration-150 group-hover:grayscale-0 group-hover:opacity-100"
                      />
                      <span className="font-mono text-[10.5px] tracking-[.16em] uppercase text-ink-4 text-center whitespace-nowrap transition-colors duration-150 group-hover:text-ink">
                        {sponsor.name}
                      </span>
                    </>
                  );
                  return href ? (
                    <a
                      key={`${set}-${sponsor.name}`}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${sponsor.name} website (opens in new tab)`}
                      className={cardClass}
                    >
                      {inner}
                    </a>
                  ) : (
                    <div key={`${set}-${sponsor.name}`} className={cardClass} aria-label={sponsor.name}>
                      {inner}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Footer row */}
          <div className="px-5 md:px-14 mt-9 flex items-center justify-center">
            <Link
              href="/sponsors"
              className="jtt-btn font-heading text-[12.5px] tracking-[.16em] uppercase font-semibold no-underline text-ink"
            >
              Become a Sponsor
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="relative bg-bg">
        {/* Section header bar */}
        <div className="max-w-[1440px] mx-auto px-5 md:px-14 py-3.5 flex items-center gap-[18px] font-mono text-[11px] tracking-[.18em] uppercase text-ink-3">
          <span className="inline-flex items-baseline gap-2.5 text-ink font-medium">
            <span className="text-maroon font-medium">&sect; 04</span> CTA
          </span>
          <span className="flex-1 h-px bg-rule-strong" />
        </div>

        <div className="max-w-[1440px] mx-auto px-5 md:px-14 pt-8 pb-16 md:pb-24">
          {/* Heading */}
          <div className="mb-10 grid grid-cols-1 md:grid-cols-[1.35fr_minmax(0,560px)] items-end gap-y-4 gap-x-8 md:gap-x-12">
            <h2 className="font-heading font-semibold text-[36px] md:text-[72px] leading-[1] tracking-[-.025em] m-0 text-ink">
              Two ways in<span className="text-maroon">.</span>
            </h2>
          </div>

          {/* Two CTA buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Left — See the rig (maroon) */}
            <Link href="/engineering" className="cta-btn cta-btn--maroon">
              <div className="cta-btn-outer">
                <div className="cta-btn-inner">
                  <div className="flex items-baseline justify-between font-mono text-[12px] tracking-[.22em] uppercase text-[#f2d8d8b8]">
                    <span className="font-medium text-[#FAFAFA]">
                      01<span className="mx-1.5 text-[#ffffff59]">/</span>The Rig
                    </span>
                    <span className="text-amber">Technical</span>
                  </div>

                  <h3 className="font-heading font-semibold text-[32px] md:text-[44px] leading-none tracking-[-.015em] m-0 text-[#FAFAFA]">
                    See the rig<span className="text-amber">.</span>
                  </h3>

                  <ul className="list-none m-0 p-0 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3.5">
                    {["System Architecture", "Sensor Stack", "Controls", "3D build render"].map((item) => (
                      <li
                        key={item}
                        className="pb-3 border-b border-dashed border-[#ffffff33] font-mono text-[12px] tracking-[.18em] uppercase text-[#F2E4CC]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Link>

            {/* Right — Join the team (deeper grey) */}
            <Link href="/apply#apply-form" className="cta-btn cta-btn--grey">
              <div className="cta-btn-outer">
                <div className="cta-btn-inner">
                  <div className="flex items-baseline justify-between font-mono text-[12px] tracking-[.22em] uppercase text-[#1a1a1a99]">
                    <span className="font-medium text-ink">
                      02<span className="mx-1.5 text-[#1a1a1a66]">/</span>The Team
                    </span>
                    <span className="text-[#7a5810]">Recruiting</span>
                  </div>

                  <h3 className="font-heading font-semibold text-[32px] md:text-[44px] leading-none tracking-[-.015em] m-0 text-ink">
                    Join the team<span className="text-maroon">.</span>
                  </h3>

                  <ul className="list-none m-0 p-0 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3.5">
                    {["No prior experience needed", "Open to all majors", "hands-on", "2026 – 27 cycle"].map((item) => (
                      <li
                        key={item}
                        className="pb-3 border-b border-dashed border-[#1a1a1a40] font-mono text-[12px] tracking-[.18em] uppercase text-ink-2"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </TimelineOrchestrator>
  );
}
