import { useEffect } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import GridReveal from "@/components/GridReveal";
import { Hero } from "@/components/apply/Hero";
import { Candidates } from "@/components/apply/Candidates";
import { ApplicationForm } from "@/components/apply/ApplicationForm";
import { FAQ } from "@/components/apply/FAQ";
import { TimelineOrchestrator } from "@/components/TimelineOrchestrator";
import { APPLY_TIMELINE } from "@/lib/applyTimeline";

const APPLY_FORM_ID = "apply-form";

// Scrolls to the form and moves keyboard focus into it. Runs on mount (when
// arriving from another page with #apply-form) and on `hashchange` (when the
// user clicks the in-nav "Join the Team" button while already on /apply).
function useApplyFormScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const scrollToForm = () => {
      if (window.location.hash !== `#${APPLY_FORM_ID}`) return;
      // Slight delay so the Tally iframe has had a tick to render and the
      // section's measured top is correct.
      setTimeout(() => {
        const el = document.getElementById(APPLY_FORM_ID);
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        // The section is already tabIndex={-1}; just move focus.
        el.focus({ preventScroll: true });
      }, 100);
    };

    scrollToForm();
    window.addEventListener("hashchange", scrollToForm);
    return () => window.removeEventListener("hashchange", scrollToForm);
  }, []);
}

function OuterCross({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute w-3.5 h-3.5 text-[#FAFAFA]/30 pointer-events-none z-[2] ${className}`}
    >
      <span className="absolute left-0 right-0 top-1/2 h-px bg-current" />
      <span className="absolute top-0 bottom-0 left-1/2 w-px bg-current" />
    </span>
  );
}

export default function Apply() {
  useApplyFormScroll();

  return (
    <TimelineOrchestrator timeline={APPLY_TIMELINE}>
    <div className="flex flex-col">
      <Nav />

      <div
        className="isolate relative bg-[#1A1A1A] text-white overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          backgroundPosition: "-1px -1px",
        }}
      >
        <GridReveal />
        <OuterCross className="left-[42px] top-[42px]" />
        <OuterCross className="right-[42px] top-[42px]" />
        <OuterCross className="left-[42px] bottom-[42px]" />
        <OuterCross className="right-[42px] bottom-[42px]" />

        <Hero />
        <Candidates />
        <ApplicationForm />
        <FAQ />
      </div>

      <Footer />
    </div>
    </TimelineOrchestrator>
  );
}
