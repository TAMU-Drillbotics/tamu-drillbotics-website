import { motion } from "framer-motion";
import { useTimelineBeat } from "@/components/TimelineOrchestrator";

const FADE_UP_8 = { hidden: { opacity: 0, y: 8 }, shown: { opacity: 1, y: 0 } };
const CLIP_WIPE = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  shown: { clipPath: "inset(0 0 0 0)" },
};

const PHASES = [
  { n: "01", name: "Applications", date: "August 31st" },
  { n: "02", name: "Interviews", date: "rolling basis" },
  { n: "03", name: "Decisions", date: "rolling basis" },
  { n: "04", name: "Onboarding", date: "September 21st" },
];

export function Hero() {
  const eyebrow = useTimelineBeat("eyebrow");
  const headline = useTimelineBeat("headline");
  const description = useTimelineBeat("description");
  const timelineHeader = useTimelineBeat("timelineHeader");
  const timelinePhases = useTimelineBeat("timelinePhases");
  const scrollHint = useTimelineBeat("scrollHint");

  return (
    <section
      id="hero"
      className="relative max-w-[1440px] mx-auto px-5 md:px-14 pt-16 md:pt-[120px] pb-8 flex flex-col min-h-[calc(100svh-58px)]"
    >
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-y-8 gap-x-8 md:gap-x-16 items-end">
          <div>
            <motion.div
              className="inline-flex items-center gap-3 font-mono text-[11px] tracking-[.2em] uppercase text-[#FAFAFA]/70 mb-5"
              initial="hidden"
              animate={eyebrow.hasFired ? "shown" : "hidden"}
              variants={FADE_UP_8}
              transition={{ duration: eyebrow.reducedMotion ? 0 : 0.3, ease: "easeOut" }}
            >
              <span className="inline-block w-[18px] h-px bg-amber align-middle" />
              JOIN THE TEAM
            </motion.div>
            <h1
              className="font-heading font-semibold text-[48px] md:text-[128px] leading-[.98] tracking-[-.02em] m-0 text-white"
              style={{ textWrap: "balance" }}
            >
              <motion.span
                className="inline-block"
                style={{ clipPath: "inset(0 100% 0 0)" }}
                initial="hidden"
                animate={headline.hasFired ? "shown" : "hidden"}
                variants={CLIP_WIPE}
                transition={{ duration: headline.reducedMotion ? 0 : 0.5, ease: "easeOut" }}
              >
                Build something real<span className="text-amber">.</span>
              </motion.span>
            </h1>
          </div>
          <motion.div
            className="max-w-[440px] pb-3.5"
            initial="hidden"
            animate={description.hasFired ? "shown" : "hidden"}
            variants={FADE_UP_8}
            transition={{ duration: description.reducedMotion ? 0 : 0.35, ease: "easeOut" }}
          >
            <p className="text-[18px] leading-[1.6] text-white font-medium m-0 mb-[18px]">
              Drillbotics gives you the project that proves you can build. Real
              hardware, real deadlines, real systems that break.
            </p>
            <p className="text-[17px] leading-[1.6] text-[#FAFAFA]/70 m-0">
              Applications open each fall. No prior engineering experience
              required for most roles.
            </p>
          </motion.div>
        </div>

        <div
          className="mt-12 pt-5 border-t border-white/[0.18]"
          aria-label="2026–27 recruitment timeline"
        >
          <motion.div
            className="flex items-baseline justify-between font-mono text-[10.5px] tracking-[.2em] uppercase text-[#FAFAFA]/70 mb-[18px]"
            initial="hidden"
            animate={timelineHeader.hasFired ? "shown" : "hidden"}
            variants={FADE_UP_8}
            transition={{ duration: timelineHeader.reducedMotion ? 0 : 0.3, ease: "easeOut" }}
          >
            <span className="text-white font-medium">
              2026 &ndash; 27 Timeline
              <span className="text-white/[0.32] mx-2">/</span>
              Phases confirmed each fall
            </span>
            <span className="inline-flex items-center gap-2 text-amber font-medium">
              <span
                aria-hidden="true"
                className="inline-block w-1.5 h-1.5 rounded-full bg-amber"
                style={{
                  boxShadow:
                    "0 0 0 2px rgba(200,150,62,0.18), 0 0 8px rgba(200,150,62,0.55)",
                  animation: "amber-pulse 2.4s ease-in-out infinite",
                }}
              />
              In Progress
            </span>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-4 md:gap-x-0">
            {PHASES.map((p, i) => (
              <motion.div
                key={p.n}
                className={`relative pt-1.5 pb-1 px-[18px] border-l ${i === 0 ? "border-amber" : "border-white/[0.18]"}`}
                initial={{ opacity: 0, x: -16 }}
                animate={
                  timelinePhases.hasFired
                    ? { opacity: 1, x: 0 }
                    : { opacity: 0, x: -16 }
                }
                transition={{
                  duration: timelinePhases.reducedMotion ? 0 : 0.4,
                  delay: timelinePhases.reducedMotion ? 0 : i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="font-mono text-[10px] text-amber tracking-[.22em] font-medium mb-2">
                  {p.n}
                </div>
                <div className="font-mono text-[10.5px] tracking-[.18em] uppercase text-white font-medium mb-1.5 leading-[1.35]">
                  {p.name}
                </div>
                <div className="font-mono text-[11px] text-[#FAFAFA]/70 tracking-[.16em]">
                  {p.date}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="hidden md:flex mt-auto items-center gap-4 font-mono text-[11px] tracking-[.24em] uppercase text-amber"
          initial="hidden"
          animate={scrollHint.hasFired ? "shown" : "hidden"}
          variants={FADE_UP_8}
          transition={{ duration: scrollHint.reducedMotion ? 0 : 0.3, ease: "easeOut" }}
        >
          <span>SCROLL &darr;</span>
          <span
            className="flex-1 h-px"
            style={{
              background:
                "linear-gradient(to right, rgba(200,150,62,0.5), transparent)",
            }}
          />
        </motion.div>

    </section>
  );
}
