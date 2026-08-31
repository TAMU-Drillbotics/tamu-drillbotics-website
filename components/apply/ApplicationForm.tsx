import { useEffect } from "react";
import { motion } from "framer-motion";
import { APPLICATIONS_OPEN, CYCLE_LABEL, CYCLE_YEARS } from "@/lib/applications";

// Stands in for the embed while APPLICATIONS_OPEN is false.
//
// Occupies the same card the iframe would, so the page's rhythm is unchanged
// and the "Join the Team" links that deep-link to #apply-form still land on
// something that answers the question they were asking.
//
// The diagonal hatch is the drafting convention for a masked-off region,
// which is the same technical-drawing vocabulary the rest of the site uses
// (registration crosses, § numbering, dashed rules). The amber status chip is
// lifted from the engineering page's RoadmapChip — the site already says
// "planned, not yet live" that way, so this reads as the same idea.
function FormNotOpenNotice() {
  return (
    <div className="relative overflow-hidden">
      {/* Masked-off hatching. Sits behind the copy at low contrast so it reads
          as a surface treatment rather than as content. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(26,26,26,0.045) 0px, rgba(26,26,26,0.045) 1px, transparent 1px, transparent 11px)",
        }}
      />

      <div className="relative flex flex-col items-center text-center px-6 py-16 md:py-24">
        {/* Status chip — mirrors RoadmapChip on the engineering page. */}
        <div className="inline-flex items-center gap-2 border border-amber/60 px-2.5 py-1 font-mono text-[10px] tracking-[.22em] uppercase text-ink-2 mb-7">
          <span
            aria-hidden="true"
            className="inline-block w-1.5 h-1.5 rounded-full bg-amber"
            style={{
              boxShadow:
                "0 0 0 2px rgba(200,150,62,0.18), 0 0 6px rgba(200,150,62,0.55)",
              animation: "amber-pulse 2.4s ease-in-out infinite",
            }}
          />
          <span>Not yet open</span>
        </div>

        <p className="font-heading font-semibold text-[26px] md:text-[32px] leading-[1.05] tracking-[-.02em] m-0 text-ink max-w-[16ch]">
          Applications open each fall<span className="text-maroon">.</span>
        </p>

        {/* The {" "} is load-bearing: JSX trims the whitespace between an
            expression container and a following line break, which otherwise
            renders as "2026-27form". */}
        <p className="text-[15.5px] leading-[1.6] text-ink-2 m-0 mt-4 max-w-[46ch]">
          The {CYCLE_YEARS}{" "}
          form is finalized and open! This should take you arond 30 minutes to complete and no AI (please). Check your email every day or so for an update to your application status.
        </p>

        <div aria-hidden="true" className="w-full max-w-[320px] h-px bg-rule-strong mt-9 mb-4" />

        <span className="font-mono text-[10px] tracking-[.22em] uppercase text-ink-4">
          Form reserved &middot; {CYCLE_LABEL}
        </span>
      </div>
    </div>
  );
}

export function ApplicationForm() {
  const formId = process.env.NEXT_PUBLIC_TALLY_FORM_ID;

  useEffect(() => {
    // Only worth warning about when the embed is actually meant to render.
    if (APPLICATIONS_OPEN && !formId) {
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
            {APPLICATIONS_OPEN ? (
              <p className="text-[16px] leading-[1.6] text-[#FAFAFA]/70 m-0">
                The form below is hosted on Tally. Short, structured, and
                routed straight to the review pool. Plan on ~20 minutes. <span className="text-amber">Tip: fill this out on a computer.</span>
              </p>
            ) : (
              <p className="text-[16px] leading-[1.6] text-[#FAFAFA]/70 m-0">
                The application for the next cycle isn&apos;t open yet. When it
                is, it lands right here — short, structured, and routed straight
                to the review pool. <span className="text-amber">Nothing to do until then.</span>
              </p>
            )}
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
              {APPLICATIONS_OPEN ? "TALLY EMBED" : "APPLICATION"}{" "}
              <span className="text-ink-4 mx-2">&middot;</span> {CYCLE_LABEL}
            </span>
            {APPLICATIONS_OPEN ? (
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
            ) : (
              <span className="text-ink-3 font-medium inline-flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="inline-block w-2 h-2 rounded-full bg-ink-4"
                />
                Closed
              </span>
            )}
          </div>

          {APPLICATIONS_OPEN ? (
            /* Tally iframe */
            <iframe
              src={src}
              width="100%"
              height={600}
              loading="lazy"
              title="TAMU Drillbotics Application"
              className="block w-full border-0"
            />
          ) : (
            <FormNotOpenNotice />
          )}

        </div>

      </section>
    </motion.div>
  );
}
