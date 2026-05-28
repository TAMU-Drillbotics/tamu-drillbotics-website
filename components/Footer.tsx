import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#141414] text-[#ffffffa8] border-t border-[#ffffff14]">
      {/* Top row */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-14 pt-9 pb-7 grid grid-cols-1 md:grid-cols-[1fr_auto_auto] items-start md:items-center gap-y-6 md:gap-x-12">
        {/* Brand */}
        <div className="flex items-center gap-3 font-heading font-semibold tracking-[.04em] text-sm uppercase text-[#FAFAFA]">
          <span className="w-[18px] h-[18px] bg-maroon relative shrink-0" aria-hidden="true">
            <span className="absolute inset-1 border-[1.5px] border-[#141414]" />
            <span className="absolute left-1/2 top-0 bottom-0 w-[1.5px] bg-[#141414] -translate-x-1/2" />
          </span>
          <span>TAMU Drillbotics</span>
          <span className="text-[#ffffff52] font-normal mx-0.5">/</span>
          <span className="text-[#ffffff7a] font-normal tracking-[.08em]">Engineering</span>
        </div>

        {/* Nav */}
        <nav className="flex flex-wrap gap-5 md:gap-7 font-heading text-xs tracking-[.16em] uppercase font-medium" aria-label="Footer">
          <Link href="/" className="text-[#ffffffc4] no-underline hover:text-[#FAFAFA] transition-colors">Home</Link>
          <Link href="/about" className="text-[#ffffffc4] no-underline hover:text-[#FAFAFA] transition-colors">About</Link>
          <Link href="/engineering" className="text-[#ffffffc4] no-underline hover:text-[#FAFAFA] transition-colors">The Rig</Link>
          <Link href="/apply#apply-form" className="text-[#ffffffc4] no-underline hover:text-[#FAFAFA] transition-colors">Apply</Link>
          <Link href="/sponsors" className="text-[#ffffffc4] no-underline hover:text-[#FAFAFA] transition-colors">Sponsors</Link>
        </nav>

        {/* Social */}
        <div className="flex gap-2">
          <a
            href="#"
            aria-label="LinkedIn"
            className="w-[34px] h-[34px] inline-flex items-center justify-center text-amber border border-amber/40 hover:text-amber hover:border-amber hover:bg-amber/10 transition-all"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
              <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5.001 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.76-2.05 4.02 0 4.76 2.65 4.76 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.86V21h-3.99V9z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-[1440px] mx-auto h-px bg-[#ffffff14]" />

      {/* Bottom row */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-14 py-[22px] pb-7 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-start gap-y-4 md:gap-12 font-mono text-[10.5px] tracking-[.14em] uppercase text-[#ffffff7a] leading-relaxed">
        <span className="max-w-[560px]">
          <strong className="text-[#ffffffbf] font-medium tracking-[.12em]">Drillbotics&reg;</strong> is a registered trademark of Rig Operations, LLC.
          <span className="block mt-1.5 text-[#ffffff5a] tracking-[.14em]">
            [ Texas A&amp;M University trademark disclaimer &middot; TBD ]
          </span>
        </span>
        <span className="text-right text-[#ffffff5a]">
          College Station &middot; TX
        </span>
      </div>
    </footer>
  );
}
