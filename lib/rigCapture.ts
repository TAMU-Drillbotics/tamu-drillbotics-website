/**
 * Constants shared between the live rig viewer, the baked turntable video's
 * capture script, and the video panel that plays it back.
 *
 * These live in their own module rather than in RigViewer because RigStage
 * needs them on the default (video-only) path — importing them from
 * RigViewer would pull three.js, drei and the Draco decoder into the initial
 * bundle and undo the whole point of loading the viewer on demand.
 */

/** Backdrop grid pitch in CSS px, as drawn by RigViewer. */
export const GRID_PX = 48;

/**
 * Side length of the square capture viewport used by
 * scripts/render-rig-video.mjs. Must stay equal to its WIDTH / HEIGHT.
 *
 * The turntable video is a screen capture of RigViewer, so RigViewer's grid
 * is burned into the footage at GRID_PX per CAPTURE_PX of frame. Letterboxing
 * that square video into a wider panel scales the baked grid down by
 * displayedSize / CAPTURE_PX — so the panel's own CSS grid has to be scaled by
 * the same factor, or the two grids visibly disagree either side of the seam.
 */
export const CAPTURE_PX = 1080;

/** Grid cells across one edge of the capture — 22.5 at 48px / 1080px. */
export const GRID_CELLS = CAPTURE_PX / GRID_PX;
