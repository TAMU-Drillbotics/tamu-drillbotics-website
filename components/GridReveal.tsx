import { useEffect, useRef } from "react";

// Matches the site-wide background grid (globals.css `body`, and the per-page
// root grids): 80px cells, lines offset by -1px.
const SIZE = 80;
const OFFSET = -1;

/**
 * Cursor-tracked grid reveal — a brighter copy of the page's faint background
 * grid, shown only within a soft radius of the pointer via a radial mask.
 *
 * The layer is viewport-fixed (so the mask can use raw cursor coords), and its
 * vertical background-position tracks scroll so its lines stay registered with
 * the page's scrolling base grid.
 *
 * Usage: the parent that carries the base grid must have `isolate` (creates a
 * stacking context); drop <GridReveal /> inside it. The layer sits at -z-10:
 * above the base grid, behind all page content.
 *
 * `lineColor` should contrast the page: a translucent white on dark pages, a
 * translucent near-black on light pages.
 */
export default function GridReveal({
  lineColor = "rgba(255,255,255,0.14)",
  radius = 220,
}: {
  lineColor?: string;
  radius?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let x = -1000;
    let y = -1000;
    const apply = () => {
      raf = 0;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
      // Keep the fixed layer's grid registered with the scrolling base grid.
      el.style.backgroundPositionY = `${OFFSET - window.scrollY}px`;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      schedule();
    };
    const onLeave = () => {
      x = -1000;
      y = -1000;
      schedule();
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", schedule, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", schedule);
      document.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const mask = `radial-gradient(circle ${radius}px at var(--mx, -1000px) var(--my, -1000px), #000 0%, rgba(0,0,0,0.5) 48%, transparent 80%)`;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        backgroundImage: `linear-gradient(to right, ${lineColor} 1px, transparent 1px), linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)`,
        backgroundSize: `${SIZE}px ${SIZE}px`,
        backgroundPosition: `${OFFSET}px ${OFFSET}px`,
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    />
  );
}
