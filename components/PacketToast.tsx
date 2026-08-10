import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* ═══════════════════════════════════════════════════════
   PACKET TOAST — TEMPORARY
   ═══════════════════════════════════════════════════════

   Stands in for the sponsorship packet download while the PDF is still being
   written. Clicking "Download Packet" on /sponsors raises this instead of
   handing over a file that does not exist yet.

   TO REMOVE once the packet ships: delete this file, then in pages/sponsors.tsx
   turn the packet <button> back into an <a href="/sponsorship-packet.pdf"
   download> and drop the toast state alongside it. Nothing else imports this.

   The treatment is lifted from the advisory toast in components/RigStage.tsx —
   amber top rule, mono status label, countdown rule — so the site keeps one
   toast vocabulary rather than two. The pulsing amber dot is the same
   "planned, not yet live" signal used by RoadmapChip on the engineering page
   and the closed-applications notice on /apply. */

const TOAST_MS = 7000;

export default function PacketToast({ onDismiss }: { onDismiss: () => void }) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const id = setTimeout(onDismiss, TOAST_MS);
    return () => clearTimeout(id);
  }, [onDismiss]);

  return (
    <motion.div
      role="status"
      className="fixed bottom-6 right-6 z-50 w-[min(380px,calc(100vw-3rem))] border border-rule-strong bg-white shadow-[0_18px_40px_-24px_rgba(26,26,26,.5)]"
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      transition={{ duration: reducedMotion ? 0 : 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Amber rule across the top — the site's advisory accent. */}
      <div aria-hidden="true" className="h-[2px] bg-amber" />

      <div className="px-4 py-3.5">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[.18em] uppercase text-ink-3">
            <span
              aria-hidden="true"
              className="inline-block w-1.5 h-1.5 rounded-full bg-amber shrink-0"
              style={{
                boxShadow:
                  "0 0 0 2px rgba(200,150,62,0.18), 0 0 6px rgba(200,150,62,0.55)",
                animation: reducedMotion
                  ? undefined
                  : "amber-pulse 2.4s ease-in-out infinite",
              }}
            />
            In progress
          </span>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            className="font-mono text-[11px] leading-none text-ink-4 hover:text-ink transition-colors cursor-pointer -mt-0.5"
          >
            &#10005;
          </button>
        </div>

        {/* title-md — the smallest heading step on the DESIGN.md ramp. */}
        <p className="font-heading font-semibold text-[22px] leading-[28px] tracking-[-.005em] m-0 mt-2.5 text-ink">
          The packet isn&apos;t ready yet<span className="text-maroon">.</span>
        </p>
        <p className="text-[13.5px] leading-[1.5] text-ink-2 m-0 mt-1.5">
          We&apos;re putting the 2026 sponsorship packet together right now. In
          the meantime, use{" "}
          <span className="font-mono text-[11.5px] tracking-[.12em] uppercase text-ink">
            Email
          </span>{" "}
          and we&apos;ll walk you through the tiers directly.
        </p>
      </div>

      {/* Countdown rule — a plain scaleX transform, so the toast costs the
          compositor a single layer and the main thread nothing. */}
      {!reducedMotion && (
        <motion.div
          aria-hidden="true"
          className="h-[1px] bg-amber/40 origin-left"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: TOAST_MS / 1000, ease: "linear" }}
        />
      )}
    </motion.div>
  );
}
