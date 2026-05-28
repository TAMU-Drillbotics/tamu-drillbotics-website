import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/router';
import Link from "next/link";
import { AnimatePresence, motion } from 'framer-motion';
import { useTimelineBeat } from '@/components/TimelineOrchestrator';

export const NAV_HEIGHT_PX = 57;

const BRAND = 'TAMU DRILLBOTICS';

const PAGE_LABELS: Record<string, string> = {
  '/': '',
  '/about': 'about',
  '/engineering': 'engineering',
  '/apply': 'apply',
  '/sponsors': 'sponsors',
};

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/engineering", label: "Engineering" },
  { href: "/apply", label: "Apply" },
  { href: "/sponsors", label: "Sponsors" },
];

const REVEAL_HOLD_MS = 2400;

type NavTheme = 'light' | 'maroon' | 'ink';

function themeForPath(pathname: string): NavTheme {
  if (pathname === '/apply') return 'ink';
  if (pathname === '/about') return 'ink';
  return 'light';
}

export default function Nav() {
  const { pathname } = useRouter();
  const [hovered, setHovered] = useState(false);
  const [autoReveal, setAutoReveal] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navBeat = useTimelineBeat('navBar');

  useEffect(() => {
    setMounted(true);
  }, []);

  const subdir = PAGE_LABELS[pathname] ?? '';
  const theme = themeForPath(pathname);
  const isDark = theme !== 'light';

  // On sub-pages, reveal brand on entry then auto-collapse with the same animation as hover-out.
  useEffect(() => {
    if (subdir === '') return;
    setAutoReveal(true);
    const t = setTimeout(() => setAutoReveal(false), REVEAL_HOLD_MS);
    return () => clearTimeout(t);
  }, [pathname, subdir]);

  // Close the mobile sheet on route change so navigation feels natural.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // No body-overflow:hidden scroll lock here: setting overflow on <body>
  // turns it into a scroll container, which yanks the sticky nav's containing
  // block out from under it — once you'd scrolled before opening the menu,
  // the nav would jump back to the top of the document (off-screen). The
  // sheet covers the viewport below the nav anyway, so accidental scroll-
  // through is a minor cost compared to losing the nav.

  // On '/' the brand is always visible; on sub-pages it reveals on hover or via the auto-reveal timer.
  const showBrand = subdir === '' || hovered || autoReveal;

  const headerClass =
    theme === 'maroon'
      ? 'sticky top-0 z-50 bg-[rgba(58,0,0,0.92)] backdrop-blur-sm border-b border-white/[0.18]'
      : theme === 'ink'
      ? 'sticky top-0 z-50 bg-[rgba(26,26,26,0.92)] backdrop-blur-sm border-b border-white/[0.18]'
      : 'sticky top-0 z-50 bg-[#FAFAFA]/85 backdrop-blur-md border-b border-[#E6E6E6]';

  // Brand mark cut color (the slot color inside the white square) matches the page's dark tone
  const markCutBorder = theme === 'maroon' ? 'border-maroon' : theme === 'ink' ? 'border-ink' : 'border-bg';
  const markCutFill = theme === 'maroon' ? 'bg-maroon' : theme === 'ink' ? 'bg-ink' : 'bg-bg';
  const markSquare = isDark ? 'bg-white' : 'bg-maroon';

  const hamburgerBarColor = isDark ? 'bg-white' : 'bg-ink';

  const header = (
    <motion.header
      className={headerClass}
      initial={{ opacity: 0, y: -8 }}
      animate={{
        opacity: navBeat.hasFired ? 1 : 0,
        y: navBeat.hasFired ? 0 : -8,
      }}
      transition={{ duration: navBeat.reducedMotion ? 0 : 0.3, ease: 'easeOut' }}
    >
      <div className="max-w-[1440px] mx-auto px-5 md:px-14 py-[18px] flex items-center gap-4 md:gap-12">
        {/* Brand */}
        <Link
          href="/"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`flex items-center gap-3 font-heading font-semibold tracking-[.04em] text-sm uppercase no-underline shrink-0 md:min-w-[300px] ${
            isDark ? 'text-white' : 'text-ink'
          }`}
        >
          <span
            className={`w-[22px] h-[22px] relative shrink-0 ${markSquare}`}
            aria-hidden="true"
          >
            <span className={`absolute inset-[5px] border-[1.5px] ${markCutBorder}`} />
            <span className={`absolute left-1/2 top-0 bottom-0 w-[1.5px] -translate-x-1/2 ${markCutFill}`} />
          </span>
          <span className="inline-flex items-baseline">
            <span
              className={`overflow-hidden whitespace-nowrap inline-block align-baseline ${isDark ? 'text-white' : 'text-ink'}`}
              style={{
                maxWidth: showBrand ? '200px' : '0px',
                opacity: showBrand ? 1 : 0,
                transition: 'max-width 300ms ease, opacity 250ms ease',
              }}
            >
              {BRAND}
            </span>
            <span className={`font-normal mx-0.5 ${isDark ? 'text-white/45' : 'text-ink-4'}`}>&nbsp;/&nbsp;</span>
            <span className={`font-normal tracking-[.08em] ${isDark ? 'text-white/70' : 'text-ink-3'}`}>{subdir}</span>
          </span>
        </Link>

        {/* Nav links — desktop only */}
        <nav className="hidden md:flex gap-8 ml-6 font-heading text-[12.5px] tracking-[.14em] uppercase font-medium">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            const linkClass = isDark
              ? `relative py-1.5 no-underline transition-colors ${active ? 'text-white' : 'text-white/75 hover:text-white'}`
              : `relative py-1.5 no-underline transition-colors ${active ? 'text-ink' : 'text-ink-2 hover:text-maroon'}`;
            const barClass = isDark
              ? 'absolute left-0 right-0 -bottom-[19px] h-0.5 bg-amber'
              : 'absolute left-0 right-0 -bottom-[19px] h-0.5 bg-maroon';
            return (
              <Link
                key={href}
                href={href}
                onClick={() => {
                  if (active) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    window.scrollTo({ top: 0 });
                  }
                }}
                className={linkClass}
              >
                {label}
                {active && <span className={barClass} />}
              </Link>
            );
          })}
        </nav>

        {/* Right side — desktop only */}
        <div className="ml-auto hidden md:flex items-center gap-6">
          <span className={`font-mono text-[11px] tracking-[.04em] ${isDark ? 'text-white/70' : 'text-ink-3'}`}>
            <span
              className="inline-block w-1.5 h-1.5 rounded-full bg-[#4A9D6B] mr-1.5 -translate-y-px"
              style={{ animation: 'status-dot 2s ease-in-out infinite' }}
            />
            2026 Season &middot; Active
          </span>
          <Link
            href="/apply#apply-form"
            className="hero-btn font-heading text-[12.5px] tracking-[.14em] uppercase no-underline"
          >
            <span className="hero-btn-outer">
              <span className="hero-btn-inner">
                <span>Join the Team</span>
              </span>
            </span>
          </Link>
        </div>

        {/* Hamburger — mobile only */}
        <button
          type="button"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="ml-auto md:hidden inline-flex flex-col justify-center items-center gap-[5px] w-10 h-10 -mr-2 cursor-pointer"
        >
          <span
            className={`block w-6 h-[2px] ${hamburgerBarColor} transition-transform duration-200`}
            style={{ transform: mobileOpen ? 'translateY(7px) rotate(45deg)' : 'none' }}
          />
          <span
            className={`block w-6 h-[2px] ${hamburgerBarColor} transition-opacity duration-200`}
            style={{ opacity: mobileOpen ? 0 : 1 }}
          />
          <span
            className={`block w-6 h-[2px] ${hamburgerBarColor} transition-transform duration-200`}
            style={{ transform: mobileOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }}
          />
        </button>
      </div>

    </motion.header>
  );

  const mobileSheet = (
    <AnimatePresence>
      {mobileOpen && (
        <motion.div
          key="mobile-sheet"
          className={`md:hidden fixed inset-x-0 top-[57px] bottom-0 z-[60] px-6 py-8 flex flex-col backdrop-blur-2xl ${
            isDark ? 'bg-black/40' : 'bg-white/40'
          }`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <nav className="flex flex-col gap-1 font-heading text-2xl tracking-[.06em] uppercase font-medium">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href;
              const linkClass = isDark
                ? `relative py-3 no-underline transition-colors border-b border-white/10 ${active ? 'text-amber' : 'text-white/85'}`
                : `relative py-3 no-underline transition-colors border-b border-ink/10 ${active ? 'text-maroon' : 'text-ink-2'}`;
              return (
                <Link key={href} href={href} className={linkClass}>
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-col items-start gap-5 pt-8">
            <span className={`font-mono text-[11px] tracking-[.04em] ${isDark ? 'text-white/70' : 'text-ink-3'}`}>
              <span
                className="inline-block w-1.5 h-1.5 rounded-full bg-[#4A9D6B] mr-1.5 -translate-y-px"
                style={{ animation: 'status-dot 2s ease-in-out infinite' }}
              />
              2026 Season &middot; Active
            </span>
            <Link
              href="/apply#apply-form"
              className="hero-btn font-heading text-[13px] tracking-[.14em] uppercase no-underline"
            >
              <span className="hero-btn-outer">
                <span className="hero-btn-inner">
                  <span>Join the Team</span>
                </span>
              </span>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {header}
      {mounted ? createPortal(mobileSheet, document.body) : null}
    </>
  );
}
