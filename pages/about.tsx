import Link from "next/link";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import GridReveal from "@/components/GridReveal";
import { TeamExplorer } from "@/components/team-explorer";
import { TimelineOrchestrator, useTimelineBeat } from "@/components/TimelineOrchestrator";
import { ABOUT_TIMELINE } from "@/lib/aboutTimeline";

const FADE_UP_8 = { hidden: { opacity: 0, y: 8 }, shown: { opacity: 1, y: 0 } };
const CLIP_WIPE = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  shown: { clipPath: "inset(0 0 0 0)" },
};

const REVEAL = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

/* ═══════════════════════════════════════════════════════
   CONFIG ARRAYS — edit data here, not layout code
   ═══════════════════════════════════════════════════════ */

const teams = [
  {
    name: "Mechanical",
    subteams: [
      { name: "Drillstring", focus: "Hydraulics, bit manufacturing" },
      { name: "Safety", focus: "Plexiglass enclosure, safety report, activation light, hydraulic systems, E-stop" },
      { name: "Frame", focus: "Dolly frame, structural assembly" },
    ],
  },
  {
    name: "Electrical",
    subteams: [
      { name: "Electronics", focus: "Sensors, motors/drivers, electronics box" },
      { name: "Software", focus: "Embedded C firmware (STM32), ML interfacing, PID control algorithms" },
    ],
  },
  {
    name: "Algorithm",
    subteams: [
      { name: "GPU", focus: "Dedicated ML compute hardware, CUDA pipeline" },
      { name: "Data", focus: "Sensor fusion, analytics" },
      { name: "ML", focus: "Model development (PyTorch, TensorFlow)" },
    ],
  },
  {
    name: "Operations",
    subteams: [
      { name: "Sponsorship", focus: "Sponsor outreach and retention, industry relationships, and team finance" },
      { name: "Marketing", focus: "Brand identity, social media, content production, and outreach campaigns" },
    ],
  },
];

const president = {
  name: "Jacob Pekala",
  role: "President & Mechanical Lead",
  bio:
    "As a senior petroleum engineering student and president of the Texas A&M Drillbotics team, I oversee both the technical and business development efforts that keep our team moving forward. Currently, we are focused on manufacturing components for our drilling rig, expanding our sponsor network, and broadening our reach through outreach activities.",
};

const teamLeads: Array<{ name: string; role: string; tbd?: boolean; photo?: string }> = [
  { name: "Shivam Sharma",   role: "Algorithm Lead",              photo: "/people/shivam.jpg" },
  { name: "Andres Gumucio",  role: "Embedded Software Lead",      photo: "/people/andres-gumucio.jpg" },
  { name: "Tej Nagasamudra", role: "Electronics Lead" },
  { name: "Ayden Alvarez",   role: "Hydraulics Lead",             photo: "/people/ayden-alvarez.jpg" },
  { name: "Samuel Ortega",           role: "Business Development Lead" },
  { name: "TBD",             role: "Marketing Lead",              tbd: true },
];

/* ═══════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════ */


function CrossMark({ className, light }: { className: string; light?: boolean }) {
  const bar = light ? "bg-[#ffffff30]" : "bg-ink-4";
  return (
    <span className={`absolute w-3.5 h-3.5 ${className}`} aria-hidden="true">
      <span className={`absolute left-0 right-0 top-1/2 h-px ${bar}`} />
      <span className={`absolute top-0 bottom-0 left-1/2 w-px ${bar}`} />
    </span>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════ */

/* ════════ about-page beat-gated pieces ════════ */

function AboutHeader() {
  const eyebrow = useTimelineBeat("eyebrow");
  const headline = useTimelineBeat("headline");
  const toc = useTimelineBeat("tocReveal");
  const tocItems = [
    { idx: "01", label: "The Competition", href: "#competition" },
    { idx: "02", label: "What We Do", href: "#what-we-do" },
    { idx: "03", label: "The Team", href: "#team" },
    { idx: "04", label: "Our Team", href: "#our-team" },
  ];
  return (
    <header className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-8 md:gap-x-16 items-end pb-8 md:pb-10 border-b border-[#FAFAFA]/20">
      <div>
        <motion.div
          className="inline-flex items-center gap-3 font-mono text-[11px] tracking-[.18em] uppercase text-[#FAFAFA]/70 mb-6"
          initial="hidden"
          animate={eyebrow.hasFired ? "shown" : "hidden"}
          variants={FADE_UP_8}
          transition={{ duration: eyebrow.reducedMotion ? 0 : 0.3, ease: "easeOut" }}
        >
          <span className="inline-block w-[18px] h-px bg-amber align-middle" />
          <span>What we do</span>
        </motion.div>
        <h1 className="font-heading font-semibold text-[44px] md:text-[96px] leading-[.9] tracking-[-.025em] m-0 text-[#FAFAFA]">
          <motion.span
            className="inline-block"
            style={{ clipPath: "inset(0 100% 0 0)" }}
            initial="hidden"
            animate={headline.hasFired ? "shown" : "hidden"}
            variants={CLIP_WIPE}
            transition={{ duration: headline.reducedMotion ? 0 : 0.5, ease: "easeOut" }}
          >
            The competition,
          </motion.span>
          <br />
          <motion.span
            className="inline-block"
            style={{ clipPath: "inset(0 100% 0 0)" }}
            initial="hidden"
            animate={headline.hasFired ? "shown" : "hidden"}
            variants={CLIP_WIPE}
            transition={{ duration: headline.reducedMotion ? 0 : 0.5, ease: "easeOut" }}
          >
            and our role in it<span className="text-amber">.</span>
          </motion.span>
        </h1>
      </div>
      <ul className="list-none m-0 p-0 ml-auto max-w-[420px] mb-1.5" aria-label="About sections">
        {tocItems.map((item, i) => (
          <motion.li
            key={item.idx}
            className={`flex items-baseline justify-between gap-3.5 py-2.5 border-t border-dashed border-[#FAFAFA]/15 font-mono text-[11px] tracking-[.16em] uppercase text-[#FAFAFA]/55 ${
              i === 3 ? "border-b" : ""
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={toc.hasFired ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{
              duration: toc.reducedMotion ? 0 : 0.22,
              delay: toc.reducedMotion ? 0 : i * 0.16,
              ease: "easeOut",
            }}
          >
            <span className="text-[#FAFAFA]/30">{item.idx}</span>
            <a
              href={item.href}
              className={`no-underline font-medium tracking-[.14em] ${
                i === 0 ? "text-amber hover:text-amber" : "text-[#FAFAFA] hover:text-maroon"
              }`}
            >
              {item.label}
            </a>
          </motion.li>
        ))}
      </ul>
    </header>
  );
}

function ColumnHeader({ children }: { children: React.ReactNode }) {
  const { hasFired, reducedMotion } = useTimelineBeat("colHeaders");
  return (
    <motion.div
      initial="hidden"
      animate={hasFired ? "shown" : "hidden"}
      variants={FADE_UP_8}
      transition={{ duration: reducedMotion ? 0 : 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function ColumnTitle({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  const { hasFired, reducedMotion } = useTimelineBeat("colTitles");
  return (
    <h2 className={className}>
      <motion.span
        className="inline-block"
        style={{ clipPath: "inset(0 100% 0 0)" }}
        initial="hidden"
        animate={hasFired ? "shown" : "hidden"}
        variants={CLIP_WIPE}
        transition={{ duration: reducedMotion ? 0 : 0.4, ease: "easeOut" }}
      >
        {children}
      </motion.span>
    </h2>
  );
}

function ColumnBody({ children }: { children: React.ReactNode }) {
  const { hasFired, reducedMotion } = useTimelineBeat("colBody");
  return (
    <motion.div
      initial="hidden"
      animate={hasFired ? "shown" : "hidden"}
      variants={FADE_UP_8}
      transition={{ duration: reducedMotion ? 0 : 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function About() {
  return (
    <TimelineOrchestrator timeline={ABOUT_TIMELINE}>
    <div
      className="isolate flex flex-col bg-[#1A1A1A]"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
        backgroundPosition: "-1px -1px",
      }}
    >
      <GridReveal />
      <Nav />

      {/* ══════════ § 01 — ABOUT ══════════ */}
      <section className="relative">
        <div className="max-w-[1440px] mx-auto px-5 md:px-14 pt-10 md:pt-16 pb-16 md:pb-24 relative">
          <CrossMark className="hidden md:block left-[42px] top-6" light />
          <CrossMark className="hidden md:block right-[42px] top-6" light />
          <CrossMark className="hidden md:block left-[42px] bottom-8" light />
          <CrossMark className="hidden md:block right-[42px] bottom-8" light />

          {/* About top: title + TOC */}
          <AboutHeader />

          {/* Two-column body */}
          <div className="mt-10 md:mt-16 grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-y-10">
            {/* ── LEFT: The Competition ── */}
            <article className="md:pr-12 scroll-mt-20" id="competition">
              <ColumnHeader>
                <div className="flex items-baseline justify-between gap-3.5 pb-3.5 border-b border-[#FAFAFA]/20 mb-7">
                  <span className="font-mono text-[11px] tracking-[.18em] uppercase text-[#FAFAFA] font-medium">
                    <span className="text-amber">01</span>
                    <span className="text-[#FAFAFA]/30 mx-1.5">/</span>
                    The Competition
                  </span>
                  <span className="font-mono text-[10.5px] tracking-[.16em] uppercase text-[#FAFAFA]/35">
                    External
                  </span>
                </div>
              </ColumnHeader>

              <ColumnTitle className="font-heading font-semibold text-[28px] md:text-[44px] leading-[1.02] tracking-[-.012em] m-0 mb-3.5 text-[#FAFAFA]">
                An international student drilling-rig competition<span className="text-amber">.</span>
              </ColumnTitle>
              <ColumnBody>
              <p className="text-[18px] leading-[1.55] text-[#FAFAFA]/80 m-0 mb-7">
                <strong className="text-[#FAFAFA] font-semibold">SPE Drillbotics</strong>, run by the Society of Petroleum
                Engineers&apos; DSATS committee, challenges university teams to design,
                build, and operate a miniature autonomous drilling rig from scratch.
              </p>

              <div className="text-[15.5px] leading-[1.65] text-[#FAFAFA]/80">
                <p className="m-0 mb-4">
                  Teams must drill a{" "}
                  <em className="not-italic text-[#FAFAFA] font-semibold" style={{ boxShadow: "inset 0 -2px 0 rgba(255,255,255,0.25)", paddingBottom: 1 }}>
                    directional well
                  </em>{" "}
                  through a sealed rock sample with no human intervention. The rig is required to interpret surface
                  and downhole measurements in real time and use them to make trajectory
                  and weight-on-bit decisions on the fly.
                </p>
                <a
                  href="https://drillbotics.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 mt-1.5 font-heading text-[12.5px] tracking-[.14em] uppercase font-medium text-[#FAFAFA] no-underline border-b border-[#FAFAFA]/30 pb-1 hover:text-maroon hover:border-[#f2e4cc]"
                >
                  View the full competition
                  <span className="inline-block w-3.5 h-px bg-current relative">
                    <span className="absolute right-0 -top-[3px] w-1.5 h-1.5 border-t border-r border-current rotate-45" />
                  </span>
                </a>
              </div>

              {/* Keyline: Competition format */}
              <div className="mt-9 pt-[18px] border-t border-[#FAFAFA]/15">
                <div className="flex items-baseline justify-between font-mono text-[10.5px] tracking-[.18em] uppercase text-[#FAFAFA]/35 mb-2">
                  <span>Competition Guidelines</span>
                </div>
                <ul className="list-none m-0 p-0">
                  {[
                    { n: "01", k: "Autonomous Operation", sub: "No human input from spud to TD.", v: "Required" },
                    { n: "02", k: "Directional Well", sub: "Pre-set target, scored on path accuracy.", v: "Scored" },
                    { n: "03", k: "Real-Time Sensing", sub: "Surface + downhole feedback into control loop.", v: "Required" },
                    { n: "04", k: "Multidisciplinary Team", sub: "PETE · MECH · ELEN · CSCE · DATA.", v: "Encouraged" },
                  ].map((item) => (
                    <li key={item.n} className="grid grid-cols-[22px_1fr_auto] items-baseline gap-3.5 py-[13px] border-b border-dashed border-[#FAFAFA]/15">
                      <span className="font-mono text-[10.5px] tracking-[.16em] text-[#FAFAFA]/35">{item.n}</span>
                      <span className="font-heading font-medium text-[15px] text-[#FAFAFA] tracking-[.01em]">
                        {item.k}
                        <small className="block font-body font-normal text-[13px] text-[#FAFAFA]/55 mt-[3px] tracking-normal normal-case">
                          {item.sub}
                        </small>
                      </span>
                      <span className="font-mono text-[10.5px] tracking-[.16em] uppercase text-[#FAFAFA]/50 text-right">{item.v}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Timeline placeholder */}
              <div className="mt-9 border border-[#FAFAFA]/15 bg-[#111111] p-[22px] pb-5 relative" role="note" aria-label="Competition timeline placeholder">
                <div className="flex items-baseline justify-between font-mono text-[10.5px] tracking-[.18em] uppercase text-[#FAFAFA]/55 mb-3.5">
                  <span>2026 &ndash; 27 Timeline</span>
                  <span className="inline-flex items-center gap-1.5 text-[#FAFAFA]/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber inline-block" />
                    Awaiting Schedule
                  </span>
                </div>
                <div
                  className="h-1.5 relative"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    backgroundImage: "repeating-linear-gradient(to right, transparent 0, transparent 7px, rgba(255,255,255,0.12) 7px, rgba(255,255,255,0.12) 8px)",
                  }}
                >
                  <span className="absolute left-[6%] top-[-4px] bottom-[-4px] w-0.5 bg-amber" />
                </div>
                <div className="mt-3 flex items-baseline justify-between font-mono text-[10px] tracking-[.16em] uppercase text-[#FAFAFA]/35">
                  <span className="font-heading text-[13px] font-semibold text-[#FAFAFA] tracking-[.04em]">
                    TBD <span className="text-[#FAFAFA]/50 font-normal ml-1.5">/ confirmed in fall semester</span>
                  </span>
                  <span>Kickoff &middot; Design Review &middot; Build &middot; Competition</span>
                </div>
                <p className="mt-3.5 pt-3 border-t border-dashed border-[#FAFAFA]/15 text-[13.5px] leading-[1.55] text-[#FAFAFA]/55 m-0">
                  Phase dates, design-review deadlines, and the on-site competition
                  window are published by SPE / DSATS each fall. This block will be
                  populated once the official 2026&ndash;27 schedule is released.
                </p>
              </div>
              </ColumnBody>
            </article>

            {/* ── CENTER DIVIDER ── */}
            <div className="relative bg-[#FAFAFA]/15" aria-hidden="true">
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-[9px] h-[9px] bg-ink z-[1]">
                <span className="absolute left-0 right-0 top-1/2 h-px bg-[#FAFAFA]/30" />
                <span className="absolute top-0 bottom-0 left-1/2 w-px bg-[#FAFAFA]/30" />
              </span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[9px] h-[9px] bg-ink z-[1]">
                <span className="absolute left-0 right-0 top-1/2 h-px bg-[#FAFAFA]/30" />
                <span className="absolute top-0 bottom-0 left-1/2 w-px bg-[#FAFAFA]/30" />
              </span>
            </div>

            {/* ── RIGHT: What We Do ── */}
            <article className="md:pl-12 scroll-mt-20" id="what-we-do">
              <ColumnHeader>
                <div className="flex items-baseline justify-between gap-3.5 pb-3.5 border-b border-[#FAFAFA]/20 mb-7">
                  <span className="font-mono text-[11px] tracking-[.18em] uppercase text-[#FAFAFA] font-medium">
                    <span className="text-amber">02</span>
                    <span className="text-[#FAFAFA]/30 mx-1.5">/</span>
                    What We Do
                  </span>
                  <span className="font-mono text-[10.5px] tracking-[.16em] uppercase text-[#FAFAFA]/35">
                    Internal
                  </span>
                </div>
              </ColumnHeader>

              <ColumnTitle className="font-heading font-semibold text-[28px] md:text-[44px] leading-[1.02] tracking-[-.012em] m-0 mb-3.5 text-[#FAFAFA]">
                We build the rig end to end<span className="text-amber">.</span>
              </ColumnTitle>
              <ColumnBody>
              <p className="text-[18px] leading-[1.55] text-[#FAFAFA]/80 m-0 mb-7">
                We outsource the machining and components while the research, assembly, and testing happen right here at A&amp;M.
              </p>

              <div className="text-[15.5px] leading-[1.65] text-[#FAFAFA]/80">
                <p className="m-0 mb-4">
                  Our team is built to be interdisciplinary. Mechanical engineers handle the frame, drillstring, and hydraulics. The electrical team manages the sensor stack and firmware. Our algorithms team runs the machine learning and control systems that tie the whole rig together.
                </p>
                <p className="m-0 mb-4">
                  Keeping the core work on campus means we can iterate quickly. We troubleshoot issues together in person, which helps us refine the hardware and software in real time.
                </p>
                <p className="m-0 mb-4">
                  We are training a new group of engineers who understand how autonomy, data, and hardware work together in the oil and gas industry. Our members graduate with hands-on experience across all three fields.
                </p>
              </div>

              {/* Keyline: Subsystems */}
              <div className="mt-9 pt-[18px] border-t border-[#FAFAFA]/15">
                <div className="flex items-baseline justify-between font-mono text-[10.5px] tracking-[.18em] uppercase text-[#FAFAFA]/35 mb-2">
                  <span>Build &middot; Subsystems</span>
                  
                </div>
                <ul className="list-none m-0 p-0">
                  {teams.map((group, i) => (
                    <li key={group.name} className="grid grid-cols-[22px_1fr_auto] items-baseline gap-3.5 py-[13px] border-b border-dashed border-[#FAFAFA]/15">
                      <span className="font-mono text-[10.5px] tracking-[.16em] text-[#FAFAFA]/35">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="font-heading font-medium text-[15px] text-[#FAFAFA] tracking-[.01em]">
                        {group.name}
                        <small className="block font-body font-normal text-[13px] text-[#FAFAFA]/55 mt-[3px] tracking-normal normal-case">
                          {group.subteams.map((s) => s.focus).join(". ")}.
                        </small>
                      </span>
                      <span className="font-mono text-[10.5px] tracking-[.16em] uppercase text-[#FAFAFA]/50 text-right">
                        {group.subteams.length} sub-team{group.subteams.length !== 1 ? "s" : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Posture block */}
              <div className="mt-9 border border-[#FAFAFA]/15 bg-[#111111] p-[22px] pb-5">
                <div className="flex items-baseline justify-between font-mono text-[10.5px] tracking-[.18em] uppercase text-[#FAFAFA]/55 mb-3.5">
                  <span>Posture &middot; 2026 Season</span>
                  <span className="inline-flex items-center gap-1.5 text-amber">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber inline-block" />
                    In Build
                  </span>
                </div>
                <p className="text-[13.5px] leading-[1.55] text-[#FAFAFA]/55 m-0 pt-3 border-t border-dashed border-[#FAFAFA]/15">
                  The rig is mid-cycle. The hoist / elevator subsystem is operational;
                  drivetrain bring-up is next. Sensor array, control software, and the
                  autonomy stack are tracking against the 2026&ndash;27 competition window.
                </p>
              </div>
              </ColumnBody>
            </article>
          </div>
        </div>
      </section>

      {/* ══════════ § 02 — TEAM EXPLORER ══════════ */}
      <motion.section {...REVEAL} className="relative scroll-mt-20" id="team">
        <div className="max-w-[1440px] mx-auto px-5 md:px-14 py-16 md:py-24">
          <TeamExplorer />
        </div>
      </motion.section>

      {/* ══════════ § 03 — OUR TEAM ══════════ */}
      <motion.section {...REVEAL} className="relative scroll-mt-20" id="our-team">
        <div className="max-w-[1440px] mx-auto px-5 md:px-14 pt-10 md:pt-16 pb-20 md:pb-[120px] relative">
          <CrossMark className="hidden md:block left-14 top-6" light />
          <CrossMark className="hidden md:block right-14 top-6" light />

          {/* Section bar */}
          <div className="flex items-center gap-[18px] pb-[14px] font-mono text-[10px] tracking-[.18em] uppercase mb-14">
            <span className="text-[#E0E0E0]">&sect; <span className="text-amber">02</span> &middot; OUR TEAM</span>
            <span className="flex-1 h-px bg-[#E0E0E0]/15" />
          </div>

          {/* Pitch */}
          <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1.5fr] gap-8 md:gap-16 mb-12 md:mb-20 items-start">
            <div>
              <div
                className="text-[10px] tracking-[.18em] uppercase mb-3.5"
                style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 300, letterSpacing: "0.15em", color: "rgba(224,224,224,0.5)" }}
              >
                LEADERSHIP
              </div>
              <h3
                className="text-[28px] md:text-[48px] leading-[1.05] tracking-[-0.01em] m-0"
                style={{ fontFamily: "var(--font-outfit)", fontWeight: 700, color: "#E0E0E0" }}
              >
                The people behind the rig<span className="text-amber">.</span>
              </h3>
            </div>
            <div className="pt-1">
              <p
                className="m-0"
                style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 400, fontSize: "15px", lineHeight: 1.65, color: "rgba(224,224,224,0.7)" }}
              >
                Meet the leads driving design, fabrication, software, and operations for the 2025&ndash;26 competition season.
              </p>
            </div>
          </div>

          {/* ── President spotlight ── */}
          <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-12 md:gap-16 items-start mb-[88px]">
            {/* Portrait frame */}
            <div className="relative w-full max-w-[340px] mx-auto md:mx-0">
              <div
                className="relative aspect-[3/4] flex items-center justify-center"
                style={{ backgroundColor: "#222222" }}
              >
                <span
                  className="uppercase"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    fontWeight: 400,
                    fontSize: "11px",
                    letterSpacing: "0.18em",
                    color: "rgba(224,224,224,0.3)",
                  }}
                >
                  Photo
                </span>
              </div>
            </div>

            {/* Text block */}
            <div className="max-w-[550px]">
              <div
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  fontWeight: 600,
                  fontSize: "1.65rem",
                  lineHeight: 1.15,
                  letterSpacing: "-0.01em",
                  color: "#E0E0E0",
                }}
              >
                {president.name}
              </div>
              <div
                className="mt-2"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontWeight: 400,
                  fontSize: "0.95rem",
                  letterSpacing: "0.01em",
                  color: "#C8963E",
                }}
              >
                {president.role}
              </div>
              <span
                className="block mt-5 mb-6"
                style={{ width: 40, height: 2, backgroundColor: "#C8963E" }}
                aria-hidden="true"
              />
              <p
                className="m-0"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontWeight: 400,
                  fontSize: "0.975rem",
                  lineHeight: 1.6,
                  color: "rgba(224,224,224,0.7)",
                }}
              >
                {president.bio}
              </p>
            </div>
          </div>

          {/* ── Team leads grid ── */}
          <div
            className="mb-7"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontWeight: 300,
              fontSize: "11px",
              letterSpacing: "0.15em",
              color: "rgba(224,224,224,0.5)",
              textTransform: "uppercase",
            }}
          >
            Team Leads
          </div>

          <ul className="list-none m-0 p-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {teamLeads.map(({ name, role, tbd, photo }, i) => {
              const isTbd = !!tbd;
              return (
                <li key={`${name}-${role}-${i}`} className="group">
                  {/* Portrait frame — smaller + centered on mobile */}
                  <div className="relative w-full max-w-[200px] mx-auto md:max-w-none md:mx-0">
                    <div
                      className="relative aspect-[3/4] flex items-center justify-center overflow-hidden"
                      style={{ backgroundColor: "#222222" }}
                    >
                      {photo ? (
                        <img
                          src={photo}
                          alt={name}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <span
                          className="uppercase"
                          style={{
                            fontFamily: "var(--font-space-grotesk)",
                            fontWeight: 400,
                            fontSize: "10.5px",
                            letterSpacing: "0.18em",
                            color: "rgba(224,224,224,0.3)",
                          }}
                        >
                          Photo
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Name + role */}
                  <div className="mt-5 text-center md:text-left">
                    <div
                      className="transition-colors duration-300"
                      style={{
                        fontFamily: "var(--font-space-grotesk)",
                        fontWeight: 600,
                        fontSize: "1.05rem",
                        lineHeight: 1.2,
                        letterSpacing: "-0.005em",
                        color: isTbd ? "rgba(224,224,224,0.4)" : "#E0E0E0",
                      }}
                    >
                      <span className={isTbd ? "" : "group-hover:text-amber"}>{name}</span>
                    </div>
                    <div
                      className="mt-1.5"
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontWeight: 400,
                        fontSize: "0.85rem",
                        lineHeight: 1.45,
                        color: "rgba(224,224,224,0.6)",
                      }}
                    >
                      {role}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Total member count */}
          <div className="mt-14 pt-6 border-t border-[#E0E0E0]/15 flex items-baseline justify-between">
            <span
              className="uppercase"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontWeight: 300,
                fontSize: "11px",
                letterSpacing: "0.15em",
                color: "rgba(224,224,224,0.6)",
              }}
            >
              Total Members
            </span>
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontWeight: 700,
                fontSize: "28px",
                lineHeight: 1,
                letterSpacing: "-0.01em",
                color: "#E0E0E0",
              }}
            >
              17
              <span className="text-amber">.</span>
            </span>
          </div>
        </div>
      </motion.section>

      {/* ══════════ § 04 — CTA ══════════ */}
      <motion.section
        {...REVEAL}
        className="bg-[#1A1A1A]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          backgroundPosition: "-1px -1px",
        }}
      >
        <div className="max-w-[1440px] mx-auto px-5 md:px-14 pt-8 pb-16 md:pb-[104px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Card 1 — maroon */}
            <Link href="/engineering" className="cta-btn cta-btn--maroon">
              <div className="cta-btn-outer">
                <div className="cta-btn-inner">
                  <div className="flex items-baseline justify-between font-mono text-[12px] tracking-[.22em] uppercase text-[#f2d8d8b8]">
                    <span className="font-medium text-[#FAFAFA]">
                      01<span className="mx-1.5 text-[#ffffff59]">/</span>The Rig
                    </span>
                    <span className="text-amber">Technical</span>
                  </div>

                  <h3 className="font-heading font-semibold text-[28px] md:text-[40px] leading-[1.05] tracking-[-.015em] m-0 text-[#FAFAFA]">
                    See what we&apos;re building<span className="text-amber">.</span>
                  </h3>

                  <p className="text-[15px] leading-[1.55] text-[#f2e4ccd0] m-0 max-w-[400px]">
                    Full system breakdown. Mechanical, electrical, software, and ML &mdash; every subsystem documented.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 2 — grey */}
            <Link href="/apply#apply-form" className="cta-btn cta-btn--grey">
              <div className="cta-btn-outer">
                <div className="cta-btn-inner">
                  <div className="flex items-baseline justify-between font-mono text-[12px] tracking-[.22em] uppercase text-[#1a1a1a99]">
                    <span className="font-medium text-ink">
                      02<span className="mx-1.5 text-[#1a1a1a66]">/</span>The Team
                    </span>
                    <span className="text-[#7a5810]">Recruiting</span>
                  </div>

                  <h3 className="font-heading font-semibold text-[28px] md:text-[40px] leading-[1.05] tracking-[-.015em] m-0 text-ink">
                    Ready to build<span className="text-maroon">?</span>
                  </h3>

                  <p className="text-[15px] leading-[1.55] text-ink-2 m-0 max-w-[400px]">
                    Applications for the 2026&ndash;27 cycle are open. Find your sub-team and start contributing.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
    </TimelineOrchestrator>
  );
}
