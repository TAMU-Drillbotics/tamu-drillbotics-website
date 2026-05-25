import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";

export type Timeline = Readonly<Record<string, { readonly at: number }>>;

type Ctx = {
  fired: ReadonlySet<string>;
  declared: ReadonlySet<string>;
  reducedMotion: boolean;
};

const TimelineContext = createContext<Ctx | null>(null);

export function TimelineOrchestrator({
  timeline,
  children,
}: {
  timeline: Timeline;
  children: React.ReactNode;
}) {
  const prefersReduced = useReducedMotion();
  const reducedMotion = !!prefersReduced;

  const beatIds = useMemo(() => Object.keys(timeline), [timeline]);
  const declared = useMemo(() => new Set(beatIds), [beatIds]);

  const [fired, setFired] = useState<Set<string>>(() => {
    return reducedMotion ? new Set(beatIds) : new Set();
  });

  useEffect(() => {
    if (reducedMotion) {
      setFired(new Set(beatIds));
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (const id of beatIds) {
      timers.push(
        setTimeout(() => {
          setFired((prev) => {
            if (prev.has(id)) return prev;
            const next = new Set(prev);
            next.add(id);
            return next;
          });
        }, timeline[id].at),
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [reducedMotion, beatIds, timeline]);

  return (
    <TimelineContext.Provider value={{ fired, declared, reducedMotion }}>
      {children}
    </TimelineContext.Provider>
  );
}

// Contract:
//   - No provider mounted → hasFired:true (consumer renders final state).
//   - Provider mounted but this beat is not in the timeline → hasFired:true
//     (the page hasn't opted into gating this beat; treat as already done).
//   - Provider mounted and beat is declared → hasFired flips at the beat's `at`.
export function useTimelineBeat(beatId: string) {
  const ctx = useContext(TimelineContext);
  if (!ctx) return { hasFired: true, reducedMotion: false };
  if (!ctx.declared.has(beatId)) return { hasFired: true, reducedMotion: ctx.reducedMotion };
  return { hasFired: ctx.fired.has(beatId), reducedMotion: ctx.reducedMotion };
}
