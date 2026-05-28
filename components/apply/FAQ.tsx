import { useState } from "react";
import { motion } from "framer-motion";
import { faqs } from "./faqs";

export function FAQ() {
  const [open, setOpen] = useState<Record<string, boolean>>({
    q1: true,
    q3: true,
  });
  const toggle = (id: string) =>
    setOpen((p) => ({ ...p, [id]: !p[id] }));

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
          <span className="text-amber font-medium">&sect; 03</span>
          <span>&middot; FAQ</span>
        </span>
        <span className="flex-1 h-px bg-white/[0.18]" />
      </div>

      <section
        id="faq"
        className="relative max-w-[1440px] mx-auto px-5 md:px-14 pt-14 md:pt-[88px] pb-16 md:pb-24"
      >
        {/* Intro */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-y-6 gap-x-8 md:gap-x-16 items-end mb-10 md:mb-12">
          <div>
            <h2
              className="font-heading font-semibold text-[32px] md:text-[56px] leading-[.98] tracking-[-.02em] m-0 text-white"
              style={{ textWrap: "balance" }}
            >
              Before you apply<span className="text-amber">.</span>
            </h2>
          </div>
          <div className="max-w-[520px] pb-2">
            <p className="text-[16px] leading-[1.6] text-[#FAFAFA]/70 m-0">
              Most common questions from prospective members.
            </p>
          </div>
        </div>

        {/* Accordion */}
        <div className="border-t border-white/[0.18]" role="list">
          {faqs.map((faq) => {
            const isOpen = !!open[faq.id];
            return (
              <div
                key={faq.id}
                role="listitem"
                className="border-b border-white/[0.18]"
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full grid grid-cols-[40px_1fr_24px] md:grid-cols-[60px_1fr_32px] items-baseline gap-x-3 md:gap-x-6 py-5 md:py-6 text-left cursor-pointer bg-transparent border-0 outline-none"
                >
                  <span className="font-mono text-[12px] tracking-[.2em] uppercase text-amber font-medium">
                    {faq.ref}
                  </span>
                  <h3 className="font-heading font-semibold text-[17px] md:text-[22px] leading-[1.25] tracking-[-.005em] text-white m-0">
                    {faq.question}
                  </h3>
                  <span
                    aria-hidden="true"
                    className={`font-mono text-[22px] leading-none text-right inline-block self-center transition-[transform,color] duration-200 ease-out ${
                      isOpen ? "rotate-45 text-amber" : "text-[#FAFAFA]/70"
                    }`}
                    style={{ transformOrigin: "center" }}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="grid grid-cols-[40px_1fr_24px] md:grid-cols-[60px_1fr_32px] gap-x-3 md:gap-x-6 pb-5 md:pb-6">
                      <span className="font-mono text-[10.5px] tracking-[.2em] uppercase text-white/75 pt-1">
                        {faq.ref.replace("Q", "A")}
                      </span>
                      <p className="text-[16px] leading-[1.6] text-[#FAFAFA]/70 max-w-[760px] m-0">
                        {faq.answer}
                      </p>
                      <span />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </section>
    </motion.div>
  );
}
