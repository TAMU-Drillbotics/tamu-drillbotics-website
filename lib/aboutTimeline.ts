export const ABOUT_TIMELINE = {
  eyebrow:      { at: 0 },
  headline:     { at: 250 },
  tocReveal:    { at: 650 },
  colHeaders:   { at: 950 },
  colTitles:    { at: 1100 },
  colBody:      { at: 1300 },
} as const;

export type AboutBeatId = keyof typeof ABOUT_TIMELINE;
