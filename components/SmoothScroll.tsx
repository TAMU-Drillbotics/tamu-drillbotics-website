import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

// Window-scoped reference so route-change handlers (and any other
// non-React caller) can drive Lenis directly. `window.scrollTo` does NOT
// sync Lenis's targetScroll/animatedScroll, so the page visually stays at
// the old position even though the actual scrollY is 0.
declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    window.__lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      if (window.__lenis === lenis) window.__lenis = undefined;
    };
  }, []);

  return <>{children}</>;
}
