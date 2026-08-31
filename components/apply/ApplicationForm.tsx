import { motion } from "framer-motion";
import Script from "next/script";
import { APPLICATIONS_OPEN, CYCLE_LABEL, CYCLE_YEARS } from "@/lib/applications";

const TALLY_FORM_URL =
  "https://tally.so/embed/44zJyO?hideTitle=1&dynamicHeight=1";

type TallyWindow = Window & {
  Tally?: { loadEmbeds: () => void };
};

function FormNotOpenNotice() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(26,26,26,0.045) 0px, rgba(26,26,26,0.045) 1px, transparent 1px, transparent 11px)",
        }}
      />

      <div className="relative flex flex-col items-center text-center px-6 py-16 md:py-24">
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

        <p className="text-[15.5px] leading-[1.6] text-ink-2 m-0 mt-4 max-w-[46ch]">
          The {CYCLE_YEARS} application will appear here when the next recruiting
          cycle begins.
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
                The {CYCLE_YEARS} form is open. Set aside about 30 minutes, and
                please complete it without AI assistance. Check your email for
                application updates. <span className="text-amber">Tip: fill this out on a computer.</span>
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
            <>
              <iframe
                data-tally-src={TALLY_FORM_URL}
                loading="lazy"
                width="100%"
                height="2138"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
                title="Member App."
                className="block w-full border-0"
              />
              <Script
                src="https://tally.so/widgets/embed.js"
                strategy="afterInteractive"
                onReady={() => (window as TallyWindow).Tally?.loadEmbeds()}
              />
            </>
          ) : (
            <FormNotOpenNotice />
          )}

        </div>

      </section>
    </motion.div>
  );
}
