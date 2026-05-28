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
      <div className="max-w-[1440px] mx-auto px-5 md:px-14 py-3.5 flex items-center gap-[18px] font-mono text-[11px] tracking-[.18em] uppercase text-white/75">
        <span className="inline-flex items-baseline gap-2.5 text-white font-medium">
          <span className="text-amber font-medium">&sect; 02</span>
          <span>&middot; APPLICATION</span>
        </span>
        <span className="flex-1 h-px bg-white/[0.18]" />
      </div>

      <section
        id="apply-form"
        tabIndex={-1}
        className="relative max-w-[1440px] mx-auto px-5 md:px-14 pt-14 md:pt-[88px] pb-16 md:pb-24 scroll-mt-24 outline-none"
      >
        {/* Intro */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-y-6 gap-x-8 md:gap-x-16 items-end mb-10 md:mb-12">
          <div>
            <h2
              className="font-heading font-semibold text-[32px] md:text-[56px] leading-[.98] tracking-[-.02em] m-0 text-white"
              style={{ textWrap: "balance" }}
            >
              Tell us about yourself<span className="text-amber">.</span>
            </h2>
          </div>
          <div className="max-w-[520px] pb-2">
            <p className="text-[16px] leading-[1.6] text-[#FAFAFA]/70 m-0">
              The form below is hosted on Tally. Short, structured, and
              routed straight to the review pool. Plan on ~20 minutes. <span className="text-amber">Tip: fill this out on a computer.</span>
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

        </div>

      </section>
    </motion.div>
  );
}
