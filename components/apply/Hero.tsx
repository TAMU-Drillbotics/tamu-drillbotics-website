export function Hero() {
  return (
    <section
      id="hero"
      className="relative max-w-[1440px] mx-auto px-14 pt-[120px] pb-8 flex flex-col min-h-[calc(100svh-58px)]"
    >
        <div className="grid grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-x-16 items-end">
          <div>
            <div className="inline-flex items-center gap-3 font-mono text-[11px] tracking-[.2em] uppercase text-[#FAFAFA]/70 mb-5">
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
            <p className="text-[17px] leading-[1.6] text-[#FAFAFA]/70 m-0">
              Applications open each fall. No prior engineering experience
              required for most roles.
            </p>
          </div>
        </div>

        <div
          className="mt-12 pt-5 border-t border-white/[0.18]"
          aria-label="2026–27 recruitment timeline"
        >
          <div className="flex items-baseline justify-between font-mono text-[10.5px] tracking-[.2em] uppercase text-[#FAFAFA]/70 mb-[18px]">
            <span className="text-white font-medium">
              2026 &ndash; 27 Timeline
              <span className="text-white/[0.32] mx-2">/</span>
              Phases confirmed each fall
            </span>
            <span className="inline-flex items-center gap-2 text-amber font-medium">
              <span
                aria-hidden="true"
                className="inline-block w-1.5 h-1.5 rounded-full bg-amber"
                style={{
                  boxShadow:
                    "0 0 0 2px rgba(200,150,62,0.18), 0 0 8px rgba(200,150,62,0.55)",
                  animation: "amber-pulse 2.4s ease-in-out infinite",
                }}
              />
              Awaiting Dates
            </span>
          </div>
          <div className="grid grid-cols-4">
            {[
              { n: "01", name: "Applications", date: "TBD" },
              { n: "02", name: "Interviews", date: "TBD" },
              { n: "03", name: "Decisions", date: "TBD" },
              { n: "04", name: "Onboarding", date: "TBD" },
            ].map((p, i) => (
              <div
                key={p.n}
                className={`relative pt-1.5 pb-1 px-[18px] border-l ${i === 0 ? "border-amber" : "border-white/[0.18]"}`}
              >
                <div className="font-mono text-[10px] text-amber tracking-[.22em] font-medium mb-2">
                  {p.n}
                </div>
                <div className="font-mono text-[10.5px] tracking-[.18em] uppercase text-white font-medium mb-1.5 leading-[1.35]">
                  {p.name}
                </div>
                <div className="font-mono text-[11px] text-[#FAFAFA]/70 tracking-[.16em]">
                  {p.date}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto flex items-center gap-4 font-mono text-[11px] tracking-[.24em] uppercase text-amber">
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
  );
}
