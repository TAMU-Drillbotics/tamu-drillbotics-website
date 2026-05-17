import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import DisciplineConstellation from "@/components/DisciplineConstellation";

function CrossMark({ className, light }: { className: string; light?: boolean }) {
  const color = light ? "bg-[#ffffff6e]" : "bg-ink-4";
  return (
    <span className={`absolute w-3.5 h-3.5 ${className}`} aria-hidden="true">
      <span className={`absolute left-0 right-0 top-1/2 h-px ${color}`} />
      <span className={`absolute top-0 bottom-0 left-1/2 w-px ${color}`} />
    </span>
  );
}

function HeroCrossMark({ className, delay }: { className: string; delay: number }) {
  return (
    <span className={`absolute w-3.5 h-3.5 ${className}`} aria-hidden="true">
      <motion.span
        className="absolute left-0 right-0 top-1/2 h-px bg-ink-4 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.15, delay, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.span
        className="absolute top-0 bottom-0 left-1/2 w-px bg-ink-4 origin-top"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.15, delay: delay + 0.1, ease: [0.16, 1, 0.3, 1] }}
      />
    </span>
  );
}

function HeroGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {Array.from({ length: 36 }, (_, i) => (
        <motion.span
          key={`v-${i}`}
          className="absolute top-0 bottom-0 w-px origin-top"
          style={{ left: 80 * (i + 1) - 1, backgroundColor: "#EBEBEB" }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.4, delay: i * 0.015, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
      {Array.from({ length: 20 }, (_, i) => (
        <motion.span
          key={`h-${i}`}
          className="absolute left-0 right-0 h-px origin-left"
          style={{ top: 80 * (i + 1) - 1, backgroundColor: "#EBEBEB" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
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
    tags: ["MECH", "EMBEDDED", "EDGE", "ML"],
  },
  {
    num: "02",
    vector: " /Industry",
    heading: "Bring autonomy to oil & gas",
    body: "The industry runs on some of the most complex and dangerous operations on earth. We’re building the next generation of engineers who automate them.",
    tagLabel: "Domain",
    tags: ["UPSTREAM", "DRILLING", "SAFETY-CRITICAL"],
  },
  {
    num: "03",
    vector: " /Engineering",
    heading: "Start small, think at scale",
    body: "Our rig is scaled-down, but the control systems, sensor fusion, and ML pipelines we develop mirror what’s being deployed in the field today.",
    tagLabel: "Stack",
    tags: ["CONTROL", "SENSOR FUSION", "ML PIPELINES"],
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
  { name: "Drivetrain", progress: 35, status: "IN BUILD" },
  { name: "Sensor Array", progress: 20, status: "IN DESIGN" },
  { name: "Control S/W", progress: 25, status: "PROTOTYPING" },
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
        <span className="inline-flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full bg-maroon"
            style={{ animation: inView ? "pulse-dot 1.3s ease-in-out infinite" : "none" }}
          />
          In Build
        </span>
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
        <div className="max-w-[1440px] mx-auto px-14 py-3.5 flex items-center gap-[18px] font-mono text-[11px] tracking-[.18em] uppercase text-ink-3">
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

      <div ref={bodyRef} className="max-w-[1440px] mx-auto px-14 py-20 pb-10 relative">
        <CrossMark className="left-[42px] top-8" />
        <CrossMark className="right-[42px] top-8" />
        <CrossMark className="left-[42px] bottom-8" />
        <CrossMark className="right-[42px] bottom-8" />

        {/* Intro block */}
        <header className="grid grid-cols-2 gap-x-16 items-end pb-12 border-b border-rule-strong">
          <div>
            <motion.div
              className="inline-flex items-center gap-3 font-mono text-[11px] tracking-[.18em] uppercase text-ink-2 mb-6"
              variants={missionFade}
              initial="hidden"
              animate={bodyInView ? "visible" : "hidden"}
              custom={0}
            >
              <span className="w-[7px] h-[7px] rounded-full bg-maroon shadow-[0_0_0_3px_#50000020]" />
              <span>What we are building toward:</span>
            </motion.div>
            <motion.h2
              className="font-heading font-semibold text-[72px] leading-[.94] tracking-[-.02em] m-0 text-ink"
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
            A year-long engineering effort, three commitments. These shape every decision we make on the rig and in the lab.
          </motion.p>
        </header>

        {/* Pillars */}
        <ol className="list-none m-0 p-0">
          {pillars.map((pillar, i) => (
            <motion.li
              ref={pillarRefs[i]}
              key={pillar.num}
              className="grid grid-cols-[220px_1fr] gap-x-16 py-14 relative"
              variants={missionFade}
              initial="hidden"
              animate={bodyInView ? "visible" : "hidden"}
              custom={0.35 + i * 0.13}
            >
              {/* Left rail */}
              <div className="flex flex-col items-start gap-3.5">
                <motion.span
                  style={{ color: pillarNumColors[i] }}
                  className="font-heading font-semibold text-[84px] leading-[.85] tracking-[-.02em]"
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
    <div className="flex flex-col">
      <Nav />
      {/* ══════════ HERO — 100vh minus nav ══════════ */}
      <div ref={heroRef} className="h-[calc(100vh-57px)] flex flex-col relative bg-bg">
        <HeroGrid />

        <motion.main
          className="flex-1 max-w-[1440px] mx-auto w-full px-14 py-10 grid grid-cols-[minmax(0,1fr)_360px] gap-x-16 items-center relative"
          style={{ y: heroContentY, opacity: heroContentOpacity }}
        >
          <HeroCrossMark className="left-[42px] top-[42px]" delay={0.1} />
          <HeroCrossMark className="right-[42px] top-[42px]" delay={0.2} />
          <HeroCrossMark className="left-[42px] bottom-[42px]" delay={0.3} />
          <HeroCrossMark className="right-[42px] bottom-[42px]" delay={0.4} />

          {/* ── Left column ── */}
          <section className="flex flex-col justify-center">
            {/* Eyebrow */}
            <div className="flex items-center gap-3.5 font-mono text-[11.5px] tracking-[.18em] uppercase text-ink-2 mb-10">
              <span className="inline-flex items-center gap-2 border border-rule-strong px-2.5 py-[5px] bg-white">
                <span className="w-[7px] h-[7px] rounded-full bg-maroon shadow-[0_0_0_3px_#50000020]" />
                RIG-02 &middot; BUILD CYCLE 1
              </span>
              <span className="text-ink-4">/</span>
              <span>SPE Drillbotics&reg; Competition 2026</span>
            </div>

            {/* Wordmark */}
            <h1 className="font-heading font-bold text-[148px] leading-[.86] tracking-[-.025em] uppercase m-0 text-ink">
              <span className="flex items-baseline gap-[18px]">
                <span>Tamu</span>
                <span className="font-mono text-[13px] font-normal tracking-[.12em] text-ink-3 uppercase -translate-y-[90px] border-l border-rule-strong pl-3.5 leading-normal whitespace-nowrap">
                  Texas A&amp;M University
                  <span className="text-ink font-medium block">College Station, TX</span>
                </span>
              </span>
              <span className="flex items-baseline">
                <span>Drillbotics</span>
                <span className="text-maroon">.</span>
              </span>
            </h1>

            {/* Lede */}
            <p className="mt-12 max-w-[580px] text-[19px] leading-relaxed text-ink-2">
              We <strong className="text-ink font-semibold">design, build, and program</strong> autonomous drilling rigs.
              Steel, sensors, and machine learning — backed by industry.
            </p>

            {/* CTAs */}
            <div className="mt-12 flex items-center gap-3.5">
              <Link
                href="/engineering"
                className="oct-clip font-heading text-sm tracking-[.14em] uppercase font-semibold px-7 py-[18px] bg-maroon text-[#FAFAFA] border border-maroon no-underline inline-flex items-center gap-3.5 hover:bg-maroon-ink hover:border-maroon-ink transition-all duration-150"
              >
                See the Rig
                <span className="inline-block w-[22px] h-px bg-[#FAFAFA] relative">
                  <span className="absolute right-0 -top-[3px] w-[7px] h-[7px] border-t border-r border-[#FAFAFA] rotate-45" />
                </span>
              </Link>
              <Link
                href="/apply#apply-form"
                className="oct-outline-ink font-heading text-sm tracking-[.14em] uppercase font-semibold px-[22px] py-[18px] text-ink no-underline inline-flex items-center gap-2.5 hover:text-maroon transition-all duration-150"
              >
                Join the Team
              </Link>
            </div>
          </section>

          {/* ── Right column: Status panel ── */}
          <StatusPanel />

        </motion.main>

        {/* Bottom metadata strip */}
        <motion.footer className="border-t border-rule bg-bg/70" style={{ opacity: heroStripOpacity }}>
          <div className="max-w-[1440px] mx-auto px-14 py-2 flex items-center gap-6 font-mono text-[9.5px] tracking-[.16em] uppercase text-ink-4">
            <span className="inline-flex items-center gap-1.5">
              <span className="text-ink-2 font-medium tracking-[.12em]">30.6280&deg;N</span>{" "}
              96.3344&deg;W
            </span>
            <span className="w-px h-[9px] bg-rule" />
            <span>College Station &middot; TX</span>
            <span className="w-px h-[9px] bg-rule" />
            <span>
              EST.{" "}
              <span className="text-ink-2 font-medium tracking-[.12em]">2015</span>
            </span>
            <div className="ml-auto flex items-center gap-6">
              <span>Industry-Backed Research Program</span>
              <span className="w-px h-[9px] bg-rule" />
              <span className="inline-flex items-center gap-2 text-ink-3">
                <span>Scroll</span>
                <span className="w-[22px] h-px bg-ink-4" />
              </span>
            </div>
          </div>
        </motion.footer>
      </div>

      {/* ══════════ MISSION ══════════ */}
      <MissionSection />

      {/* ══════════ SPONSORS ══════════ */}
      <section className="relative">
        <div className="max-w-[1440px] mx-auto pt-2 pb-11">
          {/* Intro — bridges the mission section to the marquee */}
          <div className="px-14 pb-9">
            <h2 className="font-heading font-semibold text-[72px] leading-[.94] tracking-[-.02em] text-ink m-0">
              <span className="text-maroon">&hellip;</span>and the companies that back our work
              <span
                className="relative inline-block align-baseline"
                style={{ width: 0, height: 0 }}
                aria-hidden="true"
              >
                <svg
                  width="80"
                  height="110"
                  viewBox="0 0 80 110"
                  style={{ position: 'absolute', left: 14, top: -38, overflow: 'visible' }}
                >
                  <motion.path
                    d="M 0,18 L 14,18 Q 30,18 30,34 L 30,76"
                    stroke="#500000"
                    strokeWidth="7"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
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
                    viewport={{ once: true, margin: "-80px" }}
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
          <div className="px-14 mt-9 flex items-center justify-center">
            <Link href="/sponsors" className="sb-btn">
              <span className="sb-fill" />
              <span className="sb-content">
                <span className="sb-text-black">Become a Sponsor<span className="sb-arrow">&rarr;</span></span>
                <span className="sb-text-white">Become a Sponsor<span className="sb-arrow">&rarr;</span></span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section
        className="relative bg-maroon"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff12 1px, transparent 1px), linear-gradient(to bottom, #ffffff12 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          backgroundPosition: "-1px -1px",
        }}
      >
        {/* Section header bar */}
        <div className="max-w-[1440px] mx-auto px-14 py-3.5 flex items-center gap-[18px] font-mono text-[11px] tracking-[.18em] uppercase text-[#ffffffa8]">
          <span className="inline-flex items-baseline gap-2.5 text-[#FAFAFA] font-medium">
            <span className="text-amber font-medium">&sect; 04</span> CTA
          </span>
          <span className="flex-1 h-px bg-[#ffffff26]" />
        </div>

        <div className="max-w-[1440px] mx-auto px-14 py-[88px] pb-48 grid grid-cols-[1.45fr_1fr] gap-x-16 relative">
          <CrossMark className="left-[42px] top-[42px]" light />
          <CrossMark className="right-[42px] top-[42px]" light />
          <CrossMark className="left-[42px] bottom-[42px]" light />
          <CrossMark className="right-[42px] bottom-[42px]" light />

          {/* Left column */}
          <div className="min-w-0">
            <div className="inline-flex items-center gap-3 font-mono text-[11px] tracking-[.18em] uppercase text-[#ffffffc4] mb-7">
              <span className="w-[7px] h-[7px] rounded-full bg-amber shadow-[0_0_0_3px_#C8963E30]" />
              <span>What&rsquo;s next</span>
            </div>

            <h2 className="font-heading font-semibold text-[104px] leading-[.9] tracking-[-.025em] m-0 text-[#FAFAFA]">
              Two ways<br />in<span className="text-amber">.</span>
            </h2>

            <p className="mt-7 max-w-[520px] text-[18px] leading-relaxed text-[#ffffffd0]">
              Look under the hood, or pick up a torque wrench. Either route starts here.
            </p>

            {/* CTA cards */}
            <div className="mt-16 grid grid-cols-2 border border-[#ffffff1f]">
              {/* Card 1 — maroon */}
              <Link
                href="/engineering"
                className="p-8 flex flex-col text-[#FAFAFA] no-underline min-h-[280px] group"
              >
                <div className="flex items-center justify-between font-mono text-[10.5px] tracking-[.18em] uppercase text-[#ffffff8a] mb-9">
                  <span className="font-heading text-sm text-[#FAFAFA] tracking-[.04em] font-medium">01</span>
                  <span>The Rig</span>
                </div>
                <h3 className="font-heading font-semibold text-[38px] leading-[1.02] tracking-[-.012em] m-0 mb-3.5 text-[#FAFAFA]">
                  See the rig<span className="text-amber">.</span>
                </h3>
                <p className="text-[15.5px] leading-normal text-[#ffffffbf] m-0 mb-7 max-w-[340px]">
                  Technical deep-dive: system architecture, sensor stack, control loop, and the rig itself.
                </p>
                <span className="oct-clip mt-auto self-start font-heading text-[13px] tracking-[.16em] uppercase font-semibold px-[22px] py-3.5 bg-[#FAFAFA] text-maroon border border-[#FAFAFA] inline-flex items-center gap-3.5 group-hover:bg-amber group-hover:border-amber group-hover:text-ink transition-all duration-150">
                  See the Rig
                  <span className="inline-block w-[22px] h-px bg-current relative">
                    <span className="absolute right-0 -top-[3px] w-[7px] h-[7px] border-t border-r border-current rotate-45" />
                  </span>
                </span>
              </Link>

              {/* Card 2 — dark */}
              <Link
                href="/apply#apply-form"
                className="p-8 flex flex-col text-[#FAFAFA] no-underline min-h-[280px] border-l border-[#ffffff1f] bg-ink group"
              >
                <div className="flex items-center justify-between font-mono text-[10.5px] tracking-[.18em] uppercase text-[#ffffff8a] mb-9">
                  <span className="font-heading text-sm text-[#FAFAFA] tracking-[.04em] font-medium">02</span>
                  <span>The Team</span>
                </div>
                <h3 className="font-heading font-semibold text-[38px] leading-[1.02] tracking-[-.012em] m-0 mb-3.5 text-[#FAFAFA]">
                  Join the team<span className="text-amber">.</span>
                </h3>
                <p className="text-[15.5px] leading-normal text-[#ffffffbf] m-0 mb-7 max-w-[340px]">
                  Open roles for the 2026–27 cycle across mech, embedded, controls, and ML. Build something real.
                </p>
                <span className="oct-outline-light mt-auto self-start font-heading text-[13px] tracking-[.16em] uppercase font-semibold px-[22px] py-3.5 text-[#FAFAFA] inline-flex items-center gap-3.5 group-hover:text-ink transition-all duration-150">
                  Join the Team
                  <span className="inline-block w-[22px] h-px bg-current relative">
                    <span className="absolute right-0 -top-[3px] w-[7px] h-[7px] border-t border-r border-current rotate-45" />
                  </span>
                </span>
              </Link>
            </div>
          </div>

          {/* Right column — visual placeholder */}
          <aside className="bg-ink border border-[#ffffff1f] flex flex-col min-h-[560px] overflow-hidden">
            {/* Slot header */}
            <div className="px-[18px] py-3.5 flex items-center justify-between border-b border-[#ffffff1a] font-mono text-[10.5px] tracking-[.18em] uppercase text-[#ffffff8a]">
              <span className="text-[#FAFAFA]">A Network of Skills</span>
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-amber"
                  style={{ animation: "pulse-dot 1.6s ease-in-out infinite" }}
                />
                Live
              </span>
            </div>

            {/* Stage */}
            <div
              className="flex-1 relative flex items-center justify-center overflow-hidden"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #ffffff0f 1px, transparent 1px), linear-gradient(to bottom, #ffffff0f 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            >
              {/* Dashed frame */}
              <span className="absolute inset-6 border border-dashed border-[#ffffff33]" />

              {/* Corner marks */}
              <CrossMark className="left-2.5 top-2.5" light />
              <CrossMark className="right-2.5 top-2.5" light />
              <CrossMark className="left-2.5 bottom-2.5" light />
              <CrossMark className="right-2.5 bottom-2.5" light />

              {/* Discipline constellation */}
              <div className="absolute inset-6 z-[2]">
                <DisciplineConstellation />
              </div>
            </div>

            {/* Slot footer */}
            <div className="px-[18px] py-3 flex items-center justify-between border-t border-[#ffffff1a] font-mono text-[10px] tracking-[.18em] uppercase text-[#ffffff6e]">
              <span>Nodes <span className="text-[#ffffffbf]">34</span> &middot; Links <span className="text-[#ffffffbf]">69</span></span>
              <span>Domains &middot; 6</span>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  );
}
