export const APPLY_TIMELINE = {
  eyebrow:         { at: 0 },
  headline:        { at: 250 },
  description:     { at: 700 },
  timelineHeader:  { at: 1050 },
  timelinePhases:  { at: 1250 },
  scrollHint:      { at: 1900 },
} as const;

export type ApplyBeatId = keyof typeof APPLY_TIMELINE;
