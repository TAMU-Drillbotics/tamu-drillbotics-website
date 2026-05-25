export const HERO_TIMELINE = {
  gridDraw:           { at: 0 },
  metadataRect:       { at: 150 },
  metadataExpand:     { at: 300 },
  headlineReveal:     { at: 400 },
  statusCircleFill:   { at: 400 },
  statusNumberFlip:   { at: 400 },
  buildPhaseBar:      { at: 400 },
  universityLabel:    { at: 650 },
  elevatorPitch:      { at: 900 },
  ctas:               { at: 1100 },
  subsystemCascade:   { at: 1300 },
  navBar:             { at: 1500 },
  bottomMetadata:     { at: 1500 },
  cornerCrosses:      { at: 1500 },
} as const;

export type HeroBeatId = keyof typeof HERO_TIMELINE;
