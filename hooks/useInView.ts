import { useEffect, useRef, useState, type RefObject } from 'react';

/**
 * Tracks whether an element is on (or near) the screen.
 *
 * Exists to gate work that the browser will otherwise happily run forever
 * regardless of visibility — a WebGL render loop, or a CSS animation on a
 * non-compositable property. Neither is paused when scrolled out of view,
 * and both bill the main thread / GPU on every frame the user is scrolling.
 *
 * Starts `true` so the element is never blank on first paint: the observer
 * fires asynchronously, and a false start would flash an unrendered frame
 * for anything already above the fold.
 */
export function useInView<T extends HTMLElement>({
  rootMargin = '200px',
  threshold = 0,
}: { rootMargin?: string; threshold?: number } = {}): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin,
      threshold,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, threshold]);

  return [ref, inView];
}
