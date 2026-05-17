export function Hero() {
  return (
    <>
      {/* Section header bar */}
      <div className="bg-[rgba(58,0,0,0.4)]">
        <div className="max-w-[1440px] mx-auto px-14 py-3.5 flex items-center gap-[18px] font-mono text-[11px] tracking-[.18em] uppercase text-white/75">
          <span className="inline-flex items-baseline gap-2.5 text-white font-medium">
            <span className="text-amber font-medium">&sect; 01</span>
            <span>&middot; APPLY</span>
          </span>
          <span className="flex-1 h-px bg-white/[0.18]" />
        </div>
      </div>

      <section
        id="hero"
        className="relative max-w-[1440px] mx-auto px-14 py-[120px]"
      >
        <div className="grid grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-x-16 items-end">
          <div>
            <div className="inline-flex items-center gap-3 font-mono text-[11px] tracking-[.2em] uppercase text-[#f2e4cc] mb-5">
              <span className="inline-block w-[18px] h-px bg-amber align-middle" />
              JOIN THE TEAM
            </div>
            <h1
              className="font-heading font-semibold text-[128px] leading-[.98] tracking-[-.02em] m-0 text-white"
              style={{ textWrap: "balance" }}
            >
              Build something real<span className="text-amber">.</span>
            </h1>
          </div>
          <div className="max-w-[440px] pb-3.5">
            <p className="text-[18px] leading-[1.6] text-white font-medium m-0 mb-[18px]">
              Drillbotics gives you the project that proves you can build. Real
              hardware, real deadlines, real systems that break.
            </p>
            <p className="text-[17px] leading-[1.6] text-[#f2e4cc] m-0">
              Applications open each fall. No prior engineering experience
              required for most roles.
            </p>
          </div>
        </div>

        <div className="mt-[88px] pt-6 border-t border-white/[0.18] flex items-center gap-4 font-mono text-[11px] tracking-[.24em] uppercase text-amber">
          <span>SCROLL &darr;</span>
          <span
            className="flex-1 h-px"
            style={{
              background:
                "linear-gradient(to right, rgba(200,150,62,0.5), transparent)",
            }}
          />
        </div>

      </section>
    </>
  );
}
