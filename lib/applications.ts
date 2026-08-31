// ── THE ONLY SWITCH ──────────────────────────────────────────────────────
// Set to `true` to reopen applications. Nothing else needs editing: the Tally
// embed on /apply, its env var, the scroll-to-form behaviour, and the "The
// Team" CTA cards on / and /about all read this flag and switch together.
//
// This lives in lib/ rather than beside the form because the CTA cards on the
// home and about pages make a claim about the cycle ("open" vs "not yet
// open") that has to stay true at the same time the form does — when the two
// disagreed, the cards invited people to a form that wasn't accepting
// responses.
//
// While false, the /apply <iframe> is NOT rendered at all rather than covered
// with an overlay. A hidden-but-present iframe still fetches from tally.so on
// every page load, still counts as a live form, and — most importantly — is
// still reachable by Tab and by screen readers, so a visitor could fill in and
// submit a form nobody is reading. Swapping the element out avoids all three.
export const APPLICATIONS_OPEN = false;

// Shown in the /apply card header on both paths, so the cycle stays
// identifiable whether or not the form is live.
export const CYCLE_LABEL = "APP-2026-27";

// Bare cycle years, for prose that reads "the 2026-27 cycle".
export const CYCLE_YEARS = CYCLE_LABEL.replace("APP-", "");
// ─────────────────────────────────────────────────────────────────────────
