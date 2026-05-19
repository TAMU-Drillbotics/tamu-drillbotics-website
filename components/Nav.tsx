import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from "next/link";

export const NAV_HEIGHT_PX = 57;

const BRAND = 'TAMU DRILLBOTICS';

const PAGE_LABELS: Record<string, string> = {
  '/': '',
  '/about': 'about',
  '/engineering': 'engineering',
  '/apply': 'apply',
  '/sponsors': 'sponsors',
};

const REVEAL_HOLD_MS = 550;

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

  return (
    <header className={headerClass}>
      <div className="max-w-[1440px] mx-auto px-14 py-[18px] flex items-center gap-12">
        {/* Brand */}
        <Link
          href="/"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`flex items-center gap-3 font-heading font-semibold tracking-[.04em] text-sm uppercase no-underline shrink-0 min-w-[300px] ${
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

        {/* Nav links */}
        <nav className="flex gap-8 ml-6 font-heading text-[12.5px] tracking-[.14em] uppercase font-medium">
          {[
            { href: "/", label: "Home" },
            { href: "/about", label: "About" },
            { href: "/engineering", label: "Engineering" },
            { href: "/apply", label: "Apply" },
            { href: "/sponsors", label: "Sponsors" },
          ].map(({ href, label }) => {
            const active = pathname === href;
            const linkClass = isDark
              ? `relative py-1.5 no-underline transition-colors ${active ? 'text-white' : 'text-white/75 hover:text-white'}`
              : `relative py-1.5 no-underline transition-colors ${active ? 'text-ink' : 'text-ink-2 hover:text-maroon'}`;
            const barClass = isDark
              ? 'absolute left-0 right-0 -bottom-[19px] h-0.5 bg-amber'
              : 'absolute left-0 right-0 -bottom-[19px] h-0.5 bg-maroon';
            return (
              <Link key={href} href={href} className={linkClass}>
                {label}
                {active && <span className={barClass} />}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-6">
          <span className={`font-mono text-[11px] tracking-[.04em] ${isDark ? 'text-white/70' : 'text-ink-3'}`}>
            <span
              className="inline-block w-1.5 h-1.5 rounded-full bg-[#4A9D6B] mr-1.5 -translate-y-px"
              style={{ animation: 'status-dot 2s ease-in-out infinite' }}
            />
            2026 Season &middot; Active
          </span>
          <Link href="/apply#apply-form" className={`sb-btn${isDark ? ' sb-btn--on-dark' : ''}`}>
            <span className="sb-fill" />
            <span className="sb-content">
              <span className="sb-text-black">Join the Team<span className="sb-arrow">&rarr;</span></span>
              <span className="sb-text-white">Join the Team<span className="sb-arrow">&rarr;</span></span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
