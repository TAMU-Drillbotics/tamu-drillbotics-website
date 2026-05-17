import { motion } from "framer-motion";

const phases = [
  { name: "Applications Open", date: "TBD" },
  { name: "Interviews", date: "TBD" },
  { name: "Decisions", date: "TBD" },
  { name: "Onboarding", date: "TBD" },
];

const steps = [
  { n: "01", label: "APPLY", desc: "Short Tally form, takes ~10 minutes.", tag: "FORM · TALLY" },
  { n: "02", label: "INTERVIEW", desc: "20 – 30 minute conversation with subteam leads.", tag: "IN-PERSON / ZOOM" },
  { n: "03", label: "OFFER", desc: "Rolling decisions during the cycle.", tag: "ROLLING" },
  { n: "04", label: "ONBOARD", desc: "Meet your subteam, start building.", tag: "SHOP · ON-CAMPUS" },
];

export function Timeline() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Section header bar */}
      <div className="bg-[rgba(58,0,0,0.4)]">
        <div className="max-w-[1440px] mx-auto px-14 py-3.5 flex items-center gap-[18px] font-mono text-[11px] tracking-[.18em] uppercase text-white/75">
          <span className="inline-flex items-baseline gap-2.5 text-white font-medium">
            <span className="text-amber font-medium">&sect; 03</span>
            <span>&middot; TIMELINE</span>
          </span>
          <span className="flex-1 h-px bg-white/[0.18]" />
        </div>
      </div>

      <section
        id="timeline"
        className="relative max-w-[1440px] mx-auto px-14 pt-[88px] pb-24"
      >
        <div className="inline-flex items-center gap-3 font-mono text-[11px] tracking-[.2em] uppercase text-[#f2e4cc] mb-5">
          <span className="inline-block w-[18px] h-px bg-amber align-middle" />
          RECRUITMENT CYCLE &middot; 2026 &ndash; 27
        </div>
        <h2
          className="font-heading font-semibold text-[48px] leading-[.98] tracking-[-.02em] text-white m-0 mb-9"
          style={{ textWrap: "balance" }}
        >
          A short cycle, a real conversation<span className="text-amber">.</span>
        </h2>

        {/* Light timeline card */}
        <div
          className="relative bg-[#fafafa] text-ink border border-[rgba(0,0,0,0.08)] px-7 pt-6 pb-[22px]"
          style={{
            boxShadow:
              "0 24px 48px -20px rgba(0,0,0,0.4), 0 6px 16px -8px rgba(0,0,0,0.25)",
          }}
        >
          {/* Top row */}
          <div className="flex items-baseline justify-between font-mono text-[11px] tracking-[.18em] uppercase text-ink-3 mb-[18px]">
            <span className="text-ink font-medium">2026 &ndash; 27 Timeline</span>
            <span className="text-maroon font-medium inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="inline-block w-[7px] h-[7px] rounded-full bg-amber"
                style={{
                  boxShadow:
                    "0 0 0 2px rgba(200,150,62,0.18), 0 0 8px rgba(200,150,62,0.55)",
                  animation: "amber-pulse 1.8s ease-in-out infinite",
                }}
              />
              Awaiting Dates
            </span>
          </div>

          {/* Track */}
          <div
            className="h-2 relative"
            aria-hidden="true"
            style={{
              background: "rgba(26,26,26,0.06)",
              backgroundImage:
                "repeating-linear-gradient(to right, transparent 0, transparent 7px, rgba(26,26,26,0.18) 7px, rgba(26,26,26,0.18) 8px)",
            }}
          />

          {/* Segments */}
          <div className="grid grid-cols-4 mt-[18px] pt-3.5 border-t border-dashed border-rule-strong">
            {phases.map((p, i) => (
              <div
                key={p.name}
                className={`px-1.5 ${i < phases.length - 1 ? "border-r border-dashed border-rule-strong" : ""}`}
              >
                <div className="font-mono text-[10.5px] tracking-[.2em] uppercase text-ink font-medium mb-1.5">
                  {p.name}
                </div>
                <div className="font-mono text-[11px] tracking-[.16em] text-maroon">
                  {p.date}
                </div>
              </div>
            ))}
          </div>

          {/* Foot */}
          <div className="mt-[18px] pt-3.5 border-t border-dashed border-rule-strong">
            <div className="font-mono text-[11.5px] tracking-[.18em] uppercase text-ink font-medium mb-1.5">
              TBD <span className="text-ink-3 font-normal">/ confirmed in fall semester</span>
            </div>
            <p className="text-[14.5px] leading-[1.6] text-ink-2 m-0 max-w-[720px]">
              Phase dates are published once each fall when the 2026 &ndash; 27
              cycle is announced. This block will populate when applications open.
            </p>
          </div>
        </div>

        {/* Process steps */}
        <div className="mt-16 pt-8 border-t border-dashed border-white/[0.18]">
          <div className="flex items-baseline justify-between font-mono text-[11px] tracking-[.18em] uppercase text-white/75 mb-3.5">
            <span className="text-white font-medium" />
            <span>04 STEPS &middot; ~3 &ndash; 4 WEEKS</span>
          </div>
          <ul className="list-none m-0 p-0">
            {steps.map((s, i) => (
              <li
                key={s.n}
                className={`grid grid-cols-[40px_160px_1fr_auto] items-baseline gap-x-6 py-[18px] ${
                  i < steps.length - 1 ? "border-b border-white/[0.18]" : ""
                }`}
              >
                <span className="font-mono text-[13px] tracking-[.16em] text-amber font-medium">
                  {s.n}
                </span>
                <span className="font-mono text-[12.5px] tracking-[.2em] uppercase text-white font-medium">
                  {s.label}
                </span>
                <span className="text-[15.5px] leading-[1.55] text-[#f2e4cc]">
                  {s.desc}
                </span>
                <span className="font-mono text-[10.5px] tracking-[.18em] uppercase text-white/75">
                  {s.tag}
                </span>
              </li>
            ))}
          </ul>
        </div>

      </section>
    </motion.div>
  );
}
