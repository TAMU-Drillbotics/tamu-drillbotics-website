import { useRef } from "react";
import { motion, useInView } from "framer-motion";

function SketchedUnderline() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <svg
      ref={ref}
      className="absolute left-0 right-0 -bottom-[6px] w-full h-[14px] pointer-events-none overflow-visible text-amber"
      viewBox="0 0 720 16"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        className="sketched-underline"
        d="M 2 9 C 80 5, 160 11, 240 7 C 320 10, 400 6, 480 10 C 560 7, 640 11, 718 6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeDasharray={820}
        strokeDashoffset={inView ? 0 : 820}
      />
    </svg>
  );
}

const majors = [
  { code: "MECH", name: "Mechanical Engineering", desc: "Frame, drillstring, hydraulics, bit manufacturing." },
  { code: "PETE", name: "Petroleum Engineering", desc: "Drilling fluids, well design, downhole sensing." },
  { code: "CS",   name: "Computer Science",      desc: "Control software, ML pipeline, autonomy stack." },
  { code: "CPEN", name: "Computer Engineering",  desc: "Embedded firmware, real-time systems, drivers." },
  { code: "EE",   name: "Electrical Engineering", desc: "Sensor stack, power, signal conditioning, PCBs." },
  { code: "DATA", name: "Data Science",          desc: "Sensor fusion, analytics, model development." },
];

export function Candidates() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Section header bar */}
      <div className="max-w-[1440px] mx-auto px-14 py-3.5 flex items-center gap-[18px] font-mono text-[11px] tracking-[.18em] uppercase text-white/75">
        <span className="inline-flex items-baseline gap-2.5 text-white font-medium">
          <span className="text-amber font-medium">&sect; 01</span>
          <span>&middot; CANDIDATES</span>
        </span>
        <span className="flex-1 h-px bg-white/[0.18]" />
      </div>

      <section
        id="candidates"
        className="relative max-w-[1440px] mx-auto px-14 pt-[88px] pb-24"
      >
        {/* Intro */}
        <div className="grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-x-16 items-start mb-16">
          <div>
            <div className="inline-flex items-center gap-3 font-mono text-[11px] tracking-[.2em] uppercase text-[#FAFAFA]/70 mb-5">
              <span className="inline-block w-[18px] h-px bg-amber align-middle" />
              WHO WE WANT
            </div>
            <h2
              className="font-heading font-semibold text-[56px] leading-[.98] tracking-[-.02em] m-0 text-white"
              style={{ textWrap: "balance" }}
            >
              Curious students<span className="text-amber">.</span>
              <br />
              Any major<span className="text-amber">.</span>
            </h2>
          </div>
          <div className="max-w-[540px] pt-[22px]">
            <p className="text-[18px] leading-[1.6] text-[#FAFAFA]/70 m-0">
              The team pulls from across the College of Engineering and beyond.
              Each subteam has roles that match different disciplines, and most
              don&rsquo;t require prior experience.
            </p>
          </div>
        </div>

        {/* Major chips */}
        <div className="grid grid-cols-6 gap-3.5 mb-14" role="list">
          {majors.map((m, i) => (
            <div
              key={m.code}
              role="listitem"
              className="ripple-block border px-[18px] pt-[22px] pb-[26px] bg-white/[0.02] min-h-[180px] flex flex-col"
              style={{ animationDelay: `-${i * 0.8}s` }}
            >
              <span className="font-mono text-[10.5px] tracking-[.2em] uppercase text-amber mb-[18px]">
                {m.code}
              </span>
              <h3 className="font-heading font-semibold text-[22px] leading-[1.1] tracking-[-.01em] text-white m-0 mb-2.5">
                {m.name}
              </h3>
              <p className="text-[13.5px] leading-[1.5] text-white/75 m-0 mt-auto">
                {m.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Amber callout */}
        <div className="relative px-9 py-8 grid grid-cols-[auto_1fr] gap-x-12 items-center">
          {/* Top-left + bottom-right corner crosses */}
          <span
            aria-hidden="true"
            className="absolute -top-[7px] -left-[7px] w-3.5 h-3.5 text-[#FAFAFA]/70 pointer-events-none"
          >
            <span className="absolute left-0 right-0 top-1/2 h-px bg-current" />
            <span className="absolute top-0 bottom-0 left-1/2 w-px bg-current" />
          </span>
          <span
            aria-hidden="true"
            className="absolute -bottom-[7px] -right-[7px] w-3.5 h-3.5 text-[#FAFAFA]/70 pointer-events-none"
          >
            <span className="absolute left-0 right-0 top-1/2 h-px bg-current" />
            <span className="absolute top-0 bottom-0 left-1/2 w-px bg-current" />
          </span>

          <div className="font-heading font-semibold text-[26px] leading-[1.1] tracking-[-.005em] text-white">
            <span className="relative inline-block">
              No prior experience required
              <SketchedUnderline />
            </span>
            <span className="text-amber">.</span>
          </div>
          <p className="text-[15.5px] leading-[1.6] text-[#FAFAFA]/70 m-0 max-w-[560px]">
            Most subteams take on first-year students. Bring curiosity and
            willingness to learn &mdash; we&rsquo;ll teach the rest.
          </p>
        </div>

      </section>
    </motion.div>
  );
}
