---
version: alpha
name: Drillbotics Field Document
description: >-
  An engineering-document visual identity for a collegiate autonomous-drilling
  competition team. Blueprint grids, registration crosshairs, monospaced
  technical metadata, and Texas A&M maroon — a website that reads like a
  controlled engineering drawing.
colors:
  # Light theme — the "paper"
  bg: "#FAFAFA"
  surface-card: "#FFFFFF"
  grid-line: "#EBEBEB"
  rule: "#1A1A1A14"
  rule-strong: "#1A1A1A26"

  # Ink scale — text on light
  ink: "#1A1A1A"
  ink-2: "#3A3A3A"
  ink-3: "#6B6B6B"
  ink-4: "#A5A5A5"

  # Brand — Aggie maroon, the single load-bearing accent
  maroon: "#500000"
  maroon-ink: "#3A0000"

  # Secondary accent — amber/gold, only ever used on dark or maroon ground
  amber: "#C8963E"
  amber-bright: "#D4A14B"

  # Dark theme — the "inverted plate"
  surface-dark: "#1A1A1A"
  surface-darker: "#141414"
  surface-inset: "#111111"
  surface-darkest: "#0D0D0D"
  on-dark: "#FAFAFA"
  on-dark-2: "#FFFFFFD0"
  on-dark-3: "#FFFFFFA8"
  on-dark-4: "#FFFFFF8A"
  rule-on-dark: "#FFFFFF1F"
  rule-on-dark-faint: "#FFFFFF14"

  # On-maroon — warm parchment text used over maroon ground
  cream: "#F2E4CC"
  on-maroon: "#FAFAFA"
  rule-on-maroon: "#FFFFFF2E"

  # Functional
  status-green: "#4A9D6B"

  # Sponsor-tier metals (platinum is a gradient — see Components)
  metal-gold: "#C8963E"
  metal-silver: "#8B9097"
  metal-bronze: "#A0673C"
typography:
  display-hero:
    fontFamily: Chakra Petch
    fontSize: 148px
    fontWeight: "700"
    lineHeight: 127px
    letterSpacing: -0.025em
  display-xl:
    fontFamily: Chakra Petch
    fontSize: 128px
    fontWeight: "600"
    lineHeight: 125px
    letterSpacing: -0.02em
  display-lg:
    fontFamily: Chakra Petch
    fontSize: 104px
    fontWeight: "600"
    lineHeight: 94px
    letterSpacing: -0.025em
  display-md:
    fontFamily: Chakra Petch
    fontSize: 84px
    fontWeight: "600"
    lineHeight: 77px
    letterSpacing: -0.022em
  headline-xl:
    fontFamily: Chakra Petch
    fontSize: 72px
    fontWeight: "600"
    lineHeight: 68px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Chakra Petch
    fontSize: 48px
    fontWeight: "600"
    lineHeight: 50px
    letterSpacing: -0.012em
  headline-md:
    fontFamily: Chakra Petch
    fontSize: 40px
    fontWeight: "600"
    lineHeight: 42px
    letterSpacing: -0.012em
  headline-sm:
    fontFamily: Chakra Petch
    fontSize: 28px
    fontWeight: "600"
    lineHeight: 31px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Chakra Petch
    fontSize: 22px
    fontWeight: "600"
    lineHeight: 28px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Barlow
    fontSize: 19px
    fontWeight: "400"
    lineHeight: 30px
  body-md:
    fontFamily: Barlow
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 26px
  body-sm:
    fontFamily: Barlow
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 22px
  mono-eyebrow:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: "500"
    lineHeight: 16px
    letterSpacing: 0.18em
  mono-label:
    fontFamily: JetBrains Mono
    fontSize: 10.5px
    fontWeight: "400"
    lineHeight: 14px
    letterSpacing: 0.16em
  mono-meta:
    fontFamily: JetBrains Mono
    fontSize: 9.5px
    fontWeight: "400"
    lineHeight: 14px
    letterSpacing: 0.16em
  mono-data:
    fontFamily: JetBrains Mono
    fontSize: 13.5px
    fontWeight: "500"
    lineHeight: 23px
    letterSpacing: 0em
  button-label:
    fontFamily: Chakra Petch
    fontSize: 13px
    fontWeight: "600"
    lineHeight: 16px
    letterSpacing: 0.14em
rounded:
  none: 0px
  DEFAULT: 0px
  full: 9999px
spacing:
  unit: 8px
  grid-module: 80px
  container-max: 1440px
  container-padding: 56px
  column-gap: 64px
  section-y: 88px
  block-gap: 36px
  card-padding: 32px
  panel-padding: 22px
components:
  page-light:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
  page-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
  page-maroon:
    backgroundColor: "{colors.maroon}"
    textColor: "{colors.on-maroon}"
  nav-bar:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    height: 60px
    padding: 18px 56px
  section-header-bar:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink-3}"
    typography: "{typography.mono-eyebrow}"
    padding: 14px 56px
  button-primary:
    backgroundColor: "{colors.maroon}"
    textColor: "{colors.bg}"
    typography: "{typography.button-label}"
    rounded: "{rounded.none}"
    padding: 18px 28px
  button-primary-hover:
    backgroundColor: "{colors.maroon-ink}"
    textColor: "{colors.bg}"
  button-outline:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.button-label}"
    rounded: "{rounded.none}"
    padding: 12px 24px
  button-outline-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bg}"
  button-underline:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.button-label}"
    rounded: "{rounded.none}"
    padding: 18px 22px
  button-underline-hover:
    textColor: "{colors.maroon}"
  button-on-dark:
    backgroundColor: transparent
    textColor: "{colors.on-dark}"
    typography: "{typography.button-label}"
    rounded: "{rounded.none}"
    padding: 14px 22px
  button-on-dark-hover:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.ink}"
  chip:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink-2}"
    typography: "{typography.mono-meta}"
    rounded: "{rounded.none}"
    padding: 4px 9px
  cta-card-maroon:
    backgroundColor: "{colors.maroon}"
    textColor: "{colors.on-maroon}"
    rounded: "{rounded.none}"
    padding: "{spacing.card-padding}"
  cta-card-maroon-hover:
    backgroundColor: "{colors.maroon-ink}"
  cta-card-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.none}"
    padding: "{spacing.card-padding}"
  cta-card-dark-hover:
    backgroundColor: "{colors.surface-darkest}"
  status-panel:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: 24px 0 24px 32px
  benefit-card:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: 48px
  pillar-card:
    backgroundColor: "{colors.maroon}"
    textColor: "{colors.on-maroon}"
    rounded: "{rounded.none}"
    padding: "{spacing.card-padding}"
  light-card-on-dark:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "{spacing.panel-padding}"
  terminal:
    backgroundColor: "{colors.surface-darker}"
    textColor: "{colors.on-dark}"
    typography: "{typography.mono-data}"
    rounded: "{rounded.none}"
  terminal-titlebar:
    backgroundColor: "#1C1C1C"
    textColor: "#888888"
    typography: "{typography.mono-label}"
    padding: 10px 16px
  accent-dot:
    backgroundColor: "{colors.maroon}"
    size: 7px
    rounded: "{rounded.full}"
  status-dot:
    backgroundColor: "{colors.status-green}"
    size: 6px
    rounded: "{rounded.full}"
  crosshair-mark:
    textColor: "{colors.ink-4}"
    size: 14px
  footer:
    backgroundColor: "{colors.surface-darker}"
    textColor: "{colors.on-dark-3}"
    padding: 36px 56px
---

## Overview

This is the visual identity of an **engineering field document** rendered as a
website. The product belongs to a collegiate team that designs, builds, and
programs autonomous drilling rigs for an international competition — and the
interface is built to feel like the team's own engineering output: a controlled
technical drawing, a build-status report, a spec sheet pinned to a shop wall.

The personality is **precise, industrial, and quietly confident**. Nothing is
decorative for its own sake. Every label looks stamped; every panel looks
dimensioned; every divider looks like a keyline on a blueprint. The emotional
target is *credibility* — a visitor should believe these people ship real
hardware before they read a single sentence.

Three things carry the identity and must never be diluted:

1. **The blueprint grid.** An 80px square grid underlies every surface, drawn as
   faint hairlines. It is the substrate everything sits on.
2. **Registration crosshairs.** Tiny `+` marks (two 1px strokes) sit at the inner
   corners of major content blocks, like the registration marks on a printing
   plate or the corner ticks on a drawing.
3. **Monospaced metadata.** Section numbers (`§ 02`), document codes
   (`DOC-MSN / REV. 03`), coordinates (`30.6280°N 96.3344°W`), week counters,
   and status strings are everywhere — set in a monospace face, uppercase, with
   wide letter-spacing. They frame the "real" content like marginalia on an
   engineering print.

The site moves between three grounds: the **paper** (near-white, the default),
the **inverted plate** (near-black, for call-to-action and team sections), and
**maroon** (the recruitment surface). All three carry the same grid, the same
crosshairs, and the same monospace scaffolding — only the ink inverts.

## Colors

The palette is disciplined: a long neutral ink ramp, one brand color, one
secondary accent, and a set of inverted surfaces. Color is used to *classify*,
never to decorate.

- **Paper (`#FAFAFA`)** — the default canvas. A warm off-white, never pure
  white. Pure white (`#FFFFFF`) is reserved for raised elements: chips, sponsor
  logo plates, the small bordered tags.
- **Ink ramp (`#1A1A1A` → `#3A3A3A` → `#6B6B6B` → `#A5A5A5`)** — four steps of
  text emphasis on paper. `ink` for headlines and primary copy, `ink-2` for body
  prose, `ink-3` for active metadata, `ink-4` for the faintest labels and the
  crosshair strokes. Hierarchy is built almost entirely from this ramp plus
  weight — not from color.
- **Maroon (`#500000`)** — Texas A&M's maroon, and the single load-bearing
  accent. It is the brand. It appears as: the terminal punctuation after a
  heading (the maroon period in "Drillbotics**.**"), primary buttons, the
  recruitment ground, status indicators, and section numbers. `maroon-ink`
  (`#3A0000`) is its pressed/hover partner. Maroon is rationed — a little, in
  exact places, so it always reads as intentional.
- **Amber (`#C8963E`)** — the secondary accent, a muted brushed-gold. It is
  **only** used on dark or maroon grounds, where maroon would disappear. On the
  inverted plate it takes maroon's structural role: the punctuation period, the
  active-nav underline, the accent dots, button hovers. `amber-bright`
  (`#D4A14B`) is its terminal-prompt variant.
- **Inverted surfaces (`#1A1A1A`, `#141414`, `#111111`, `#0D0D0D`)** — a short
  near-black ramp for the dark plate, the footer, inset panels, and hover
  states. Text on dark uses white at descending alpha
  (`#FAFAFA` → `#FFFFFFD0` → `#FFFFFFA8` → `#FFFFFF8A`).
- **Cream (`#F2E4CC`)** — a warm parchment tint used for secondary text *on the
  maroon ground only*. It keeps maroon sections from feeling cold.
- **Hairline rules (`#1A1A1A14`, `#1A1A1A26`)** — black at 8% and 15% alpha.
  These are the workhorses of the layout: nearly every division between blocks
  is a 1px hairline, not a shadow or a gap. On dark, the equivalents are white
  at ~6–15% alpha.
- **Status green (`#4A9D6B`)** — the only "functional" hue, used exclusively for
  the live "Active / Connected" indicator dot with a soft glow.

## Typography

Three families, each with one job. The pairing is the identity — a technical
display face, a clean workhorse for prose, and a monospace for everything that
should look machine-generated.

- **Chakra Petch** — the display and heading face. Slightly squared,
  semi-condensed, technical. Used for the wordmark, every heading, and the large
  numerals (pillar numbers, build-phase counters). Headings run **600 weight**
  with **tight negative tracking** (−0.012em to −0.025em) and **sub-1.0 line
  height** at display sizes — they should feel set solid, almost stacked.
- **Barlow** — the body face. Neutral, even-textured, comfortable at 14–19px.
  Used for all running prose and paragraphs. Default weight 400; 600 for inline
  emphasis (which is also given a 1px ink underline).
- **JetBrains Mono** — the metadata face, and it is *load-bearing*. Every
  eyebrow, section marker, document code, coordinate, chip, status string, and
  table label is monospace, **UPPERCASE**, with **wide positive tracking**
  (0.14em–0.24em). This is the single biggest driver of the "engineering
  document" feel. If a label could plausibly appear in the margin of a drawing,
  it is monospace.

The type scale is **dramatic**. Display sizes go very large (up to ~148px for
the hero wordmark) and collapse fast to a dense 9.5–13px monospace floor. There
is deliberately little in the mid-range — the page is either a big confident
statement or fine technical print, rarely in between.

Headings frequently end with a **colored punctuation mark** — a period, ellipsis,
or question mark in maroon (on light) or amber (on dark). It is a signature
detail: the sentence is structural ink, the mark is brand.

## Layout

Everything is built on the **80px blueprint grid**. It is literally drawn on the
background as faint crossing hairlines, and content dimensions echo it.

- **Container.** Content is capped at **1440px** and centered, with **56px**
  horizontal padding on every section.
- **Vertical rhythm.** Sections carry generous vertical padding (~80–96px).
  Major sections are separated by a full-width 1px hairline rule, never by empty
  space alone.
- **The section header bar.** Most sections open with a horizontal strip:
  `§ NN  LABEL  —————  middle descriptor  —————  DOC-CODE / REV. NN`. A
  monospace tag on the left, a centered descriptor, a revision code on the
  right, with animated hairline rules drawn between them. This bar is a
  recurring structural device — it frames sections like title blocks frame
  drawing sheets.
- **Columns.** Two-column asymmetric splits are the norm: a large heading column
  beside a narrower prose or status column, with **64px** gutters. Grids of 2×2
  and 3-up cards divide with **dashed** hairlines between cells.
- **Crosshair registration marks.** Every major padded content block carries
  four small `+` crosshairs inset ~42px from its corners. They are the visual
  signature of the layout system and should be applied to any new large block.
- **Marginalia.** Coordinates, "EST. 2015", week counters, and aspect ratios are
  pinned into thin strips at the edges of sections — treat the page edges as the
  margin of a technical print.

## Elevation & Depth

The system is **deliberately flat**. Depth comes from *line*, not *shadow* —
hairline rules, dashed dividers, and the layered grid do the work that drop
shadows would do elsewhere. This keeps the whole product reading like printed
matter rather than stacked glass.

There are three sanctioned exceptions, all intentional:

1. **Light cards floating on a dark/maroon ground.** When a near-white panel
   (the application form, the recruitment timeline) sits on the maroon plate, it
   gets a deep, soft drop shadow
   (`0 30px 60px -20px rgba(0,0,0,0.45)`, `0 8px 20px -8px rgba(0,0,0,0.3)`) so
   it reads as a physical sheet laid on top.
2. **The terminal.** The team-explorer terminal uses a *stacked hard shadow*
   (`0 2px 0 #111`, `0 6px 0 #0D0D0D`, then soft ambient layers) — it looks like
   a thick object resting on the page, not a floating card.
3. **Indicator glows.** Status dots carry a tight colored glow
   (`box-shadow` rings in the dot's own hue), and accent dots sit inside a soft
   3px translucent ring. These are the only "lit" elements in the system.

Hover depth is expressed as a **flat color shift** (a darker ground, an inverted
fill), never as a lift or a shadow change.

## Shapes

The shape language is **hard-edged and rectilinear**. This is non-negotiable and
is half the identity.

- **Radius is zero.** Cards, buttons, inputs, chips, panels, the terminal — every
  rectangle has square corners. The *only* rounded elements in the entire system
  are small circular indicator dots (status, accent, the terminal's traffic-light
  dots), which use full radius.
- **Borders are 1px hairlines.** Edges are defined by thin rules at low alpha,
  not by fills or shadows. Dashed 1px borders are used specifically for
  *subdivision* (rows in a list, cells in a grid) versus solid for *enclosure*.
- **Corner ticks and crosshairs.** Instead of rounding or shadowing, blocks are
  "finished" with right-angle corner brackets and `+` crosshair marks — drafting
  conventions, not UI chrome.
- **Arrows are constructed, not glyphs.** The "→" on buttons is built from a 1px
  line plus a small rotated chevron of two 1px borders. Iconography, where it
  exists, is line-based with thin strokes.
- **Progress and weight bars** are plain hard-edged rectangles that animate their
  width or scale — no rounding, no gloss.

## Components

**Buttons.** Four variants, all square, all using the monospace-adjacent display
label (uppercase, 0.14em tracking). *Primary*: solid maroon, paper text, hovers
to `maroon-ink`. *Outline*: transparent with a 1px ink border, hovers to a fully
inverted ink fill. *Underline*: text-only with a 1px bottom border, hovers to
maroon. *On-dark*: 1px white border on dark/maroon grounds, hovers to a solid
amber fill with ink text — often with a white panel that slides in from the left
edge on hover.

**Section header bar.** The recurring section title block: `§ NN LABEL` tag,
centered descriptor, `DOC-CODE / REV. NN` on the right, hairline rules drawn
between. Comes in a light variant and a dark variant.

**Status panel.** A bordered, left-ruled column reporting build progress —
phase counter, segmented progress bar, a scrollable subsystem list with
dashed-rule rows, hard-edged progress bars, and a footer with mechanical
flip-counter numerals. The archetypal "this is a real engineering project"
component.

**CTA cards.** Large square link-cards, paired two-up inside a 1px frame. One is
maroon ground, one is dark ground; both carry an index number, a category label,
a heading with a colored punctuation mark, body copy, and a pinned bottom button.
Hover darkens the whole card ground.

**Chips / tags.** Small white rectangles with a 1px `rule-strong` border, holding
an uppercase monospace label — used for disciplines, skill tags, categories.

**Pillar / benefit cards.** Maroon cards (pillars) and paper cards (benefits)
divided by dashed hairlines, each carrying a large index numeral and a
punctuation-marked heading.

**Terminal.** A faux macOS terminal (dark, traffic-light dots, "CONNECTED"
status, blinking amber block cursor) used as an interactive team explorer. All
content inside is monospace; the amber prompt is `amber-bright`.

**Sponsor tiers.** Four tiers with escalating treatment — Platinum gets a
metallic gradient sweep (`#1A1A1A → #5E5E5E → #D8D8D8 → #5E5E5E → #1A1A1A`) on
both its name and weight bar; Gold uses `metal-gold`, Silver `metal-silver`,
Bronze `metal-bronze`. Logos sit on white plates with corner ticks.

**Nav & footer.** A sticky nav that adapts its ground to the page theme
(paper / maroon / ink), with a square brand mark built from a filled square, an
inset border, and a center cut line. The footer is the darkest surface
(`#141414`), all-monospace in its lower row, carrying trademark and location
marginalia.

**Indicator dots.** Small full-radius dots: maroon/amber accent dots in a soft
translucent ring; the green status dot with a pulsing glow.

## Do's and Don'ts

**Do**

- Keep the 80px grid visible on every ground — it is the substrate, not an
  optional texture.
- Apply corner crosshairs to every major content block.
- Set all metadata, labels, eyebrows, and codes in uppercase monospace with wide
  tracking. When in doubt whether a label is "content" or "marginalia," make it
  monospace marginalia.
- End headings with a single brand-colored punctuation mark (maroon on light,
  amber on dark).
- Divide with 1px hairlines — solid to enclose, dashed to subdivide.
- Ration maroon. It should always feel placed, never spread.
- Invent plausible engineering metadata (revision codes, week counters, document
  IDs, coordinates) — it is core to the voice.

**Don't**

- Don't round corners on anything except small indicator dots.
- Don't use drop shadows for ordinary elevation — only the three sanctioned
  exceptions (light card on dark, the terminal, indicator glows).
- Don't use amber on light grounds, or maroon as the accent on dark grounds —
  the accents are ground-specific.
- Don't use pure white (`#FFFFFF`) as a page background; the paper is `#FAFAFA`.
  Reserve pure white for raised plates and chips.
- Don't build hierarchy from many colors — use the ink ramp plus weight and
  size.
- Don't introduce gradients except the sponsor-tier metals.
- Don't soften the type: headings stay tightly tracked and set solid; labels stay
  wide-tracked and uppercase.
- Don't add decorative illustration. Structure (rules, ticks, grids, crosshairs)
  is the ornament.
