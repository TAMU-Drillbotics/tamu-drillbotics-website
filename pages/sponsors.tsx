import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import GridReveal from "@/components/GridReveal";
import PacketToast from "@/components/PacketToast";

/* ═══════════════════════════════════════════════════════
   CONFIG — edit data here, not layout code
   ═══════════════════════════════════════════════════════ */

type TierKey = "PLATINUM" | "GOLD" | "SILVER" | "BRONZE";
type Company = { name: string; logo?: string };

const sponsorTiers: { tier: TierKey; companies: Company[] }[] = [
  {
    tier: "PLATINUM",
    companies: [
      { name: "Sabine Oil & Gas", logo: "/sponsors/sabine-logo.jpeg" },
      { name: "Diamondback Energy", logo: "/sponsors/diamondback-energy-logo.jpg" },
    ],
  },
  {
    tier: "GOLD",
    companies: [
      { name: "Scandrill", logo: "/sponsors/scandrill-logo.png" },
      { name: "Nabors", logo: "/sponsors/nabors-logo.png" },
    ],
  },
  {
    tier: "SILVER",
    companies: [
      { name: "Patterson-UTI", logo: "/sponsors/patterson-uti-logo.png" },
    ],
  },
  {
    tier: "BRONZE",
    companies: [
      { name: "Hibernia Resources", logo: "/sponsors/hibernia-logo.jpg" },
    ],
  },
];

const benefits = [
  {
    label: "VISIBILITY",
    title: "Logos!",
    description:
      "Logo placement on team materials, website, competition deliverables, and future O&G conferences.",
    chips: ["WEB", "RIG"],
  },
  {
    label: "TALENT PIPELINE",
    title: "Direct access to top Engineering Students at Texas A&M.",
    description:
      "Commonly considered the #1 ranked Petroleum Engineering program in the US, we attract the best and brightest students from across the College of Engineering.",
    chips: ["MECH", "EE", "CSCE", "DATA"],
  },
  {
    label: "R&D EXPOSURE",
    title: "See how students approach autonomous drilling.",
    description:
      "Students build a scaled-down autonomous drilling rig, and develop the control systems, sensor fusion, and machine learning pipelines to make it work.",
    chips: ["CONTROL", "SENSOR FUSION", "ML"],
  },
  {
    label: "STEM IMPACT",
    title: "Tax-deductible contribution to STEM at Texas A&M.",
    description:
      "Companies can make tax‑deductible contributions to STEM at Texas A&M through the Texas A&M Foundation; we can work with you and the university to structure this correctly.",
    chips: ["501(C)(3)", "TAMU FOUNDATION"],
  },
];

const SPONSOR_EMAIL = "Reach out to us";

/* ═══════════════════════════════════════════════════════
   ANIMATION HELPERS
   ═══════════════════════════════════════════════════════ */

const REVEAL = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.45, delay, ease: "easeOut" as const },
});

function SectionHeader({
  num,
  numColor,
  label,
  dark,
}: {
  num: string;
  numColor: string;
  label: string;
  dark?: boolean;
}) {
  const wrap = dark ? "" : "bg-bg/85";
  const baseText = dark ? "text-[#ffffffa8]" : "text-ink-3";
  const tag = dark ? "text-[#FAFAFA]" : "text-ink";
  const rule = dark ? "bg-[#ffffff26]" : "bg-rule-strong";

  return (
    <div className={wrap}>
      <div
        className={`max-w-[1440px] mx-auto px-5 md:px-14 py-3.5 flex items-center gap-[18px] font-mono text-[11px] tracking-[.18em] uppercase ${baseText}`}
      >
        <motion.span
          className={`inline-flex items-baseline gap-2.5 font-medium ${tag}`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <span className={`font-medium ${numColor}`}>&sect; {num}</span> {label}
        </motion.span>
        <motion.span
          className={`flex-1 h-px origin-center ${rule}`}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

function CrossMark({ className, light }: { className: string; light?: boolean }) {
  const color = light ? "bg-[#ffffff6e]" : "bg-ink-4";
  return (
    <span className={`absolute w-3.5 h-3.5 ${className}`} aria-hidden="true">
      <span className={`absolute left-0 right-0 top-1/2 h-px ${color}`} />
      <span className={`absolute top-0 bottom-0 left-1/2 w-px ${color}`} />
    </span>
  );
}

/* ═══════════════════════════════════════════════════════
   TIER STYLING — each metal gets its own treatment
   ═══════════════════════════════════════════════════════ */

type TierSpec = {
  nameSize: string;
  nameClass: string;        // applied to the tier name text
  weightW: string;
  weightH: string;
  weightStyle: React.CSSProperties; // bar fill — supports gradients
  logoW: number;
  logoH: number;
  logoNameSize: string;
  logoNameColor: string;
  subColor: string;         // tier label under each logo
  rankColor: string;        // "Tier · 0X / 04"
};

const tierSpec: Record<TierKey, TierSpec> = {
  // PLATINUM — metallic sheen, most prominent
  PLATINUM: {
    nameSize: "text-[36px] md:text-[56px]",
    nameClass:
      "font-extrabold bg-clip-text text-transparent bg-[linear-gradient(120deg,#1A1A1A_0%,#5e5e5e_38%,#cfcfcf_50%,#5e5e5e_62%,#1A1A1A_100%)] drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]",
    weightW: "w-[140px]",
    weightH: "h-2.5",
    weightStyle: {
      backgroundImage:
        "linear-gradient(120deg, #1A1A1A 0%, #5e5e5e 35%, #d8d8d8 50%, #5e5e5e 65%, #1A1A1A 100%)",
    },
    logoW: 300,
    logoH: 120,
    logoNameSize: "text-[11px]",
    logoNameColor: "text-ink",
    subColor: "text-ink-2",
    rankColor: "text-ink-3",
  },
  // GOLD — amber brand color
  GOLD: {
    nameSize: "text-[28px] md:text-[40px]",
    nameClass: "font-semibold text-[#C8963E]",
    weightW: "w-24",
    weightH: "h-1.5",
    weightStyle: { background: "#C8963E" },
    logoW: 240,
    logoH: 96,
    logoNameSize: "text-[11px]",
    logoNameColor: "text-ink",
    subColor: "text-[#C8963E]",
    rankColor: "text-ink-4",
  },
  // SILVER — cool steel
  SILVER: {
    nameSize: "text-[24px] md:text-[32px]",
    nameClass: "font-semibold text-[#8B9097]",
    weightW: "w-[72px]",
    weightH: "h-1",
    weightStyle: { background: "#8B9097" },
    logoW: 200,
    logoH: 78,
    logoNameSize: "text-[11px]",
    logoNameColor: "text-ink",
    subColor: "text-[#8B9097]",
    rankColor: "text-ink-4",
  },
  // BRONZE — warm copper
  BRONZE: {
    nameSize: "text-[26px]",
    nameClass: "font-semibold text-[#A0673C]",
    weightW: "w-14",
    weightH: "h-[3px]",
    weightStyle: { background: "#A0673C" },
    logoW: 170,
    logoH: 64,
    logoNameSize: "text-[10.5px]",
    logoNameColor: "text-ink-2",
    subColor: "text-[#A0673C]",
    rankColor: "text-ink-4",
  },
};

function LogoBox({
  width,
  height,
  logo,
  name,
}: {
  width: number;
  height: number;
  logo?: string;
  name: string;
}) {
  return (
    <span
      className="bg-white relative shrink-0 block border border-rule-strong overflow-hidden"
      style={{ width, height }}
    >
      <span className="absolute -left-[3px] -top-[3px] w-[5px] h-[5px] border-t border-l border-[#1a1a1a1f]" aria-hidden="true" />
      <span className="absolute -right-[3px] -bottom-[3px] w-[5px] h-[5px] border-b border-r border-[#1a1a1a1f]" aria-hidden="true" />
      {logo ? (
        <img
          src={logo}
          alt={`${name} logo`}
          className="absolute inset-0 w-full h-full object-contain p-4"
        />
      ) : (
        <>
          <span className="absolute left-3.5 top-3 w-2.5 h-2.5 text-[#1a1a1a3a]" aria-hidden="true">
            <span className="absolute left-0 right-0 top-1/2 h-px bg-current" />
            <span className="absolute top-0 bottom-0 left-1/2 w-px bg-current" />
          </span>
          <span className="absolute left-3.5 bottom-2.5 font-mono text-[9.5px] tracking-[.22em] uppercase text-[#1a1a1a52]">
            LOGO / TBD
          </span>
        </>
      )}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════ */

export default function Sponsors() {
  // TEMPORARY — the sponsorship packet PDF is still being written, so the
  // download button raises an advisory toast instead of 404-ing on a file that
  // does not exist. Remove this state (and components/PacketToast.tsx) when the
  // packet ships; see the note in that file.
  //
  // The counter is the toast's key rather than a boolean: re-clicking while the
  // toast is already up remounts it, which restarts both the dismiss timer and
  // the countdown rule. A plain boolean would leave a half-elapsed toast that
  // vanishes mid-read.
  const [packetToast, setPacketToast] = useState(0);
  const dismissPacketToast = useCallback(() => setPacketToast(0), []);

  return (
    <div className="isolate flex flex-col">
      <GridReveal lineColor="rgba(26,26,26,0.16)" />
      <Nav />

      {/* ══════════ § 01 — TIERS ══════════ */}
      <section className="relative">
        <div className="max-w-[1440px] mx-auto px-5 md:px-14 py-12 md:py-20 pb-16 md:pb-24 relative">
          <CrossMark className="hidden md:block left-[42px] top-[42px]" />
          <CrossMark className="hidden md:block right-[42px] top-[42px]" />
          <CrossMark className="hidden md:block left-[42px] bottom-[42px]" />
          <CrossMark className="hidden md:block right-[42px] bottom-[42px]" />

          {/* Intro */}
          <header className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 md:gap-x-16 items-end pb-10 md:pb-14 border-b border-rule-strong">
            <div>
              <motion.h1
                {...fadeUp(0.1)}
                className="font-heading font-semibold text-[40px] md:text-[84px] leading-[.92] tracking-[-.022em] m-0 text-ink"
              >
                Backed by<br />industry<span className="text-maroon">.</span>
              </motion.h1>
            </div>
            <motion.p
              {...fadeUp(0.2)}
              className="text-[17px] leading-relaxed text-ink-2 max-w-[460px] ml-auto mb-2"
            >
              Our partners provide funding, mentorship, and real-world engineering context. Their support makes this program possible.
            </motion.p>
          </header>

          {/* Tier rows */}
          <ol className="list-none m-0 p-0">
            {sponsorTiers.map((tier, i) => {
              const spec = tierSpec[tier.tier];
              const last = i === sponsorTiers.length - 1;
              return (
                <motion.li
                  key={tier.tier}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.55, delay: i * 0.1, ease: "easeOut" }}
                  className={`grid grid-cols-1 md:grid-cols-[260px_1fr] gap-y-8 gap-x-8 md:gap-x-16 py-10 md:py-14 ${
                    last ? "" : "border-b border-dashed border-rule-strong"
                  }`}
                >
                  {/* Left rail */}
                  <div className="flex flex-col items-start gap-3.5">
                    <span className={`font-mono text-[10.5px] tracking-[.22em] uppercase ${spec.rankColor}`}>
                      Tier &middot; 0{i + 1} / 04
                    </span>
                    <span
                      className={`font-heading tracking-[.02em] uppercase leading-[.9] ${spec.nameSize} ${spec.nameClass}`}
                    >
                      {tier.tier.charAt(0) + tier.tier.slice(1).toLowerCase()}
                    </span>
                    <motion.span
                      className={`block mt-1 ${spec.weightW} ${spec.weightH} origin-left`}
                      style={spec.weightStyle}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.5, delay: i * 0.1 + 0.25, ease: [0.16, 1, 0.3, 1] }}
                      aria-hidden="true"
                    />
                    <span className="font-mono text-[10.5px] tracking-[.18em] uppercase text-ink-3 leading-[1.7]">
                      <span className="text-ink font-medium tracking-[.04em]">
                        {tier.companies.length}
                      </span>{" "}
                      {tier.companies.length === 1 ? "Partner" : "Partners"}
                    </span>
                  </div>

                  {/* Right — logos */}
                  <div className="flex flex-wrap gap-6 items-end">
                    {tier.companies.map((company, j) => (
                      <motion.div
                        key={company.name}
                        className="flex flex-col items-start gap-3.5"
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{
                          duration: 0.45,
                          delay: i * 0.1 + 0.18 + j * 0.08,
                          ease: "easeOut",
                        }}
                      >
                        <LogoBox
                          width={spec.logoW}
                          height={spec.logoH}
                          logo={company.logo}
                          name={company.name}
                        />
                        <span className="flex flex-col gap-0.5">
                          <span
                            className={`font-mono tracking-[.16em] uppercase ${spec.logoNameSize} ${spec.logoNameColor}`}
                          >
                            {company.name}
                          </span>
                          <span className={`font-mono text-[9.5px] tracking-[.18em] uppercase ${spec.subColor}`}>
                            {tier.tier}
                          </span>
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ══════════ § 01 — VALUE ══════════ */}
      <section className="relative">
        <SectionHeader
          num="01"
          numColor="text-maroon"
          label="Value"
        />

        <div className="max-w-[1440px] mx-auto px-5 md:px-14 py-12 md:py-20 pb-16 md:pb-24 relative">
          <CrossMark className="hidden md:block left-[42px] top-[42px]" />
          <CrossMark className="hidden md:block right-[42px] top-[42px]" />
          <CrossMark className="hidden md:block left-[42px] bottom-[42px]" />
          <CrossMark className="hidden md:block right-[42px] bottom-[42px]" />

          {/* Intro */}
          <header className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 md:gap-x-16 items-end pb-8 md:pb-12 border-b border-rule-strong">
            <div>
              <motion.h2
                {...fadeUp(0.1)}
                className="font-heading font-semibold text-[36px] md:text-[64px] leading-[.94] tracking-[-.02em] m-0 text-ink"
              >
                Why partner<br />with us<span className="text-maroon">?</span>
              </motion.h2>
            </div>
            <motion.p
              {...fadeUp(0.2)}
              className="text-[17px] leading-relaxed text-ink-2 max-w-[460px] ml-auto mb-2"
            >
              Sponsors gain visibility, recruitment access, and a direct line into student R&amp;D &mdash; and support a working STEM program at Texas A&amp;M.
            </motion.p>
          </header>

          {/* 2x2 grid */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            {benefits.map((b, i) => {
              const isRightCol = i % 2 === 1;
              const isBottomRow = i >= benefits.length - 2;
              return (
                <motion.article
                  key={b.label}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                  className={`p-7 md:p-12 md:pt-12 md:pb-10 flex flex-col gap-[18px] min-h-[200px] md:min-h-[260px] ${
                    isRightCol ? "" : "md:border-r border-dashed border-rule-strong"
                  } ${isBottomRow ? "" : "border-b border-dashed border-rule-strong"}`}
                >
                  <div className="flex items-center justify-between font-mono text-[10.5px] tracking-[.18em] uppercase text-ink-3">
                    <span className="font-heading text-sm font-semibold text-ink tracking-[.04em]">
                      0{i + 1}
                    </span>
                    <span className="text-maroon font-medium">{b.label}</span>
                  </div>
                  <h3 className="font-heading font-semibold text-[28px] leading-[1.1] tracking-[-.01em] m-0 mt-2 text-ink max-w-[440px]">
                    {b.title.endsWith(".") ? b.title.slice(0, -1) : b.title}
                  </h3>
                  <p className="text-[16px] leading-[1.55] text-ink-2 m-0 max-w-[480px]">
                    {b.description}
                  </p>
                  <div className="mt-auto pt-[18px] flex items-center gap-2 flex-wrap font-mono text-[10px] tracking-[.16em] uppercase text-ink-4">
                    {b.chips.map((chip) => (
                      <span
                        key={chip}
                        className="border border-rule-strong px-[9px] py-1 text-ink-2 bg-white tracking-[.16em]"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ § 02 — CONTACT CTA ══════════ */}
      <motion.section
        {...REVEAL}
        className="relative bg-[#1A1A1A] text-[#FAFAFA]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff0a 1px, transparent 1px), linear-gradient(to bottom, #ffffff0a 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          backgroundPosition: "-1px -1px",
        }}
      >
        <SectionHeader
          dark
          num="02"
          numColor="text-amber"
          label="Contact"
        />

        <div className="max-w-[1440px] mx-auto px-5 md:px-14 py-12 md:py-16 pb-12 md:pb-16 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-8 md:gap-x-16 items-center relative">
          <CrossMark className="hidden md:block left-8 top-6" light />
          <CrossMark className="hidden md:block right-8 top-6" light />
          <CrossMark className="hidden md:block left-8 bottom-6" light />
          <CrossMark className="hidden md:block right-8 bottom-6" light />

          {/* Left */}
          <div>
            <motion.h2
              {...fadeUp(0.1)}
              className="font-heading font-semibold text-[36px] md:text-[60px] leading-[.96] tracking-[-.02em] m-0 text-[#FAFAFA] max-w-[540px]"
            >
              Interested in partnering<span className="text-amber">?</span>
            </motion.h2>
            <motion.p
              {...fadeUp(0.2)}
              className="mt-[22px] max-w-[520px] text-[17px] leading-[1.55] text-[#ffffffc8]"
            >
              Reach out to discuss sponsorship tiers, in-kind contributions, or custom partnership structures.
            </motion.p>
          </div>

          {/* Right — two CTA cards */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: 0.15, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-2 border border-[#ffffff1f]"
          >
            <a
              className="group p-7 pt-[30px] flex flex-col text-[#FAFAFA] no-underline min-h-[240px]"
              href={`mailto:${SPONSOR_EMAIL}`}
            >
              <div className="flex items-center justify-between font-mono text-[10.5px] tracking-[.18em] uppercase text-[#ffffff8a] mb-[30px]">
                <span className="font-heading text-sm text-[#FAFAFA] tracking-[.04em] font-medium">01</span>
                <span className="text-amber">Email</span>
              </div>
              <h3 className="font-heading font-semibold text-[26px] leading-[1.05] tracking-[-.01em] m-0 mb-2.5 text-[#FAFAFA] break-words">
                {SPONSOR_EMAIL}
              </h3>
              <p className="text-[14.5px] leading-[1.5] text-[#ffffffb0] m-0 max-w-[280px]">
                Direct line to the sponsorship lead. Response within two business days.
              </p>
              <span className="oct-clip mt-auto self-start font-heading text-[13px] tracking-[.16em] uppercase font-semibold px-[22px] py-3.5 border border-[#FAFAFA] text-[#FAFAFA] bg-transparent inline-flex items-center gap-3.5 transition-all duration-150 group-hover:bg-amber group-hover:border-amber group-hover:text-ink">
                Email Us
                <span className="inline-block w-[22px] h-px bg-current relative">
                  <span className="absolute right-0 -top-[3px] w-[7px] h-[7px] border-t border-r border-current rotate-45" />
                </span>
              </span>
            </a>

            {/* TEMPORARY — a <button> rather than an <a> while the packet is
                still being written: there is no file to point at, and an
                href="#" would yank the reader to the top of the page. Restore
                the anchor when the PDF ships. */}
            <button
              type="button"
              onClick={() => setPacketToast((n) => n + 1)}
              className="group p-7 pt-[30px] flex flex-col text-left text-[#FAFAFA] no-underline min-h-[240px] border-l border-[#ffffff1f] cursor-pointer"
            >
              <div className="flex items-center justify-between font-mono text-[10.5px] tracking-[.18em] uppercase text-[#ffffff8a] mb-[30px]">
                <span className="font-heading text-sm text-[#FAFAFA] tracking-[.04em] font-medium">02</span>
                <span className="text-amber">PDF &middot; 2026</span>
              </div>
              <h3 className="font-heading font-semibold text-[26px] leading-[1.05] tracking-[-.01em] m-0 mb-2.5 text-[#FAFAFA]">
                Sponsorship Packet
              </h3>
              <p className="text-[14.5px] leading-[1.5] text-[#ffffffb0] m-0 max-w-[280px]">
                Tier breakdown, deliverables, prior-year report, and contribution instructions.
              </p>
              <span className="oct-clip mt-auto self-start font-heading text-[13px] tracking-[.16em] uppercase font-semibold px-[22px] py-3.5 border border-amber bg-amber text-ink inline-flex items-center gap-3.5 transition-all duration-150 group-hover:bg-[#FAFAFA] group-hover:border-[#FAFAFA] group-hover:text-ink">
                Download Packet
                <span className="inline-block w-[22px] h-px bg-current relative">
                  <span className="absolute right-0 -top-[3px] w-[7px] h-[7px] border-t border-r border-current rotate-45" />
                </span>
              </span>
            </button>
          </motion.div>
        </div>
      </motion.section>

      <Footer />

      {/* TEMPORARY — see the note on `packetToast` above. */}
      <AnimatePresence>
        {packetToast > 0 && (
          <PacketToast key={packetToast} onDismiss={dismissPacketToast} />
        )}
      </AnimatePresence>
    </div>
  );
}
