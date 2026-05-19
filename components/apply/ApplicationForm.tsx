import { useEffect } from "react";
import { motion } from "framer-motion";

export function ApplicationForm() {
  const formId = process.env.NEXT_PUBLIC_TALLY_FORM_ID;

  useEffect(() => {
    if (!formId) {
      console.warn(
        "NEXT_PUBLIC_TALLY_FORM_ID not set — Tally embed will not load real form",
      );
    }
  }, [formId]);

  const src = `https://tally.so/embed/${formId ?? "placeholder"}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`;

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
          <span className="text-amber font-medium">&sect; 02</span>
          <span>&middot; APPLICATION</span>
        </span>
        <span className="flex-1 h-px bg-white/[0.18]" />
      </div>

      <section
        id="apply-form"
        tabIndex={-1}
        className="relative max-w-[1440px] mx-auto px-14 pt-[88px] pb-24 scroll-mt-24 outline-none"
      >
        {/* Intro */}
        <div className="grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-x-16 items-end mb-12">
          <div>
            <div className="inline-flex items-center gap-3 font-mono text-[11px] tracking-[.2em] uppercase text-[#FAFAFA]/70 mb-5">
              <span className="inline-block w-[18px] h-px bg-amber align-middle" />
              FORM
            </div>
            <h2
              className="font-heading font-semibold text-[56px] leading-[.98] tracking-[-.02em] m-0 text-white"
              style={{ textWrap: "balance" }}
            >
              Tell us about yourself<span className="text-amber">.</span>
            </h2>
          </div>
          <div className="max-w-[520px] pb-2">
            <p className="text-[16px] leading-[1.6] text-[#FAFAFA]/70 m-0">
              The form below is hosted on Tally &mdash; short, structured, and
              routed straight to the review pool. Plan on ~10 minutes.
            </p>
          </div>
        </div>

        {/* Light form card */}
        <div
          className="relative bg-[#fafafa] text-ink border border-[rgba(0,0,0,0.08)]"
          style={{
            boxShadow:
              "0 30px 60px -20px rgba(0,0,0,0.45), 0 8px 20px -8px rgba(0,0,0,0.3)",
          }}
        >
          {/* Top-left + bottom-right maroon corner crosses */}
          <span
            aria-hidden="true"
            className="absolute -top-2 -left-2 w-4 h-4 text-maroon pointer-events-none"
          >
            <span
              className="absolute left-0 right-0 top-1/2 bg-current"
              style={{ height: "1.5px" }}
            />
            <span
              className="absolute top-0 bottom-0 left-1/2 bg-current"
              style={{ width: "1.5px" }}
            />
          </span>
          <span
            aria-hidden="true"
            className="absolute -bottom-2 -right-2 w-4 h-4 text-maroon pointer-events-none"
          >
            <span
              className="absolute left-0 right-0 top-1/2 bg-current"
              style={{ height: "1.5px" }}
            />
            <span
              className="absolute top-0 bottom-0 left-1/2 bg-current"
              style={{ width: "1.5px" }}
            />
          </span>

          {/* Card top */}
          <div className="flex items-center justify-between px-[22px] py-3.5 border-b border-rule font-mono text-[11px] tracking-[.18em] uppercase text-ink-3">
            <span className="text-ink font-medium">
              TALLY EMBED <span className="text-ink-4 mx-2">&middot;</span> APP-2026-27
            </span>
            <span className="text-maroon font-medium inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="inline-block w-2 h-2 rounded-full bg-maroon"
                style={{
                  boxShadow:
                    "0 0 0 2px rgba(80,0,0,0.14), 0 0 6px rgba(80,0,0,0.5)",
                  animation: "amber-pulse 1.8s ease-in-out infinite",
                }}
              />
              ACTIVE
            </span>
          </div>

          {/* Tally iframe */}
          <iframe
            src={src}
            width="100%"
            height={600}
            loading="lazy"
            title="TAMU Drillbotics Application"
            className="block w-full border-0"
          />

          {/* Card foot */}
          <div className="flex justify-between gap-6 px-[22px] py-3.5 border-t border-rule font-mono text-[10.5px] tracking-[.18em] uppercase">
            <span className="text-ink-2">
              FIELDS &middot; NAME &middot; UIN &middot; MAJOR &middot; YEAR &middot; INTEREST &middot; AVAILABILITY
            </span>
            <span className="text-ink-4">EST &middot; 10 MIN</span>
          </div>
        </div>

        {/* Foot note */}
        <div className="mt-[18px] flex gap-3.5 items-center font-mono text-[11px] tracking-[.18em] uppercase text-[#FAFAFA]/70">
          <span>DATA &middot; TALLY &rarr; REVIEW POOL &middot; ENCRYPTED IN TRANSIT</span>
          <span className="relative inline-block w-3.5 h-px bg-current">
            <span
              aria-hidden="true"
              className="absolute right-0 -top-[3px] w-1.5 h-1.5 border-t border-r border-current"
              style={{ transform: "rotate(45deg)" }}
            />
          </span>
        </div>

      </section>
    </motion.div>
  );
}
