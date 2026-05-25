export const ENGINEERING_HERO_TIMELINE = {
  gridLines:      { at: 0 },
  metadataLabel:  { at: 150 },
  headlineReveal: { at: 300 },
  renderFrame:    { at: 500 },
  activateHint:   { at: 750 },
} as const;

export type EngineeringHeroBeatId = keyof typeof ENGINEERING_HERO_TIMELINE;
