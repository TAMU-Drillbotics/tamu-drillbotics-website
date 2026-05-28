import { useState } from 'react';
import { PARENTS, SUBTEAMS, PARENT_ORDER, PROMPT } from './data';
import { ParentKey, SubteamKey } from './types';

export function TeamExplorerMobile() {
  const [open, setOpen] = useState<Record<SubteamKey, boolean>>(
    {} as Record<SubteamKey, boolean>,
  );

  const toggle = (key: SubteamKey) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const parentKeys = Object.keys(PARENT_ORDER) as ParentKey[];

  return (
    <section className="w-full">
      {/* Intro */}
      <div className="mb-8">
        <div className="font-mono text-[10px] tracking-[0.18em] text-[#E0E0E0]/50 uppercase mb-3">
          HOW IT WORKS
        </div>
        <h2 className="font-display font-semibold text-[26px] leading-[1.1] tracking-[-0.01em] text-[#E0E0E0] mb-4">
          Browse the team like a filesystem<span className="text-[#c8963e]">.</span>
        </h2>
        <p className="text-[14px] leading-[1.55] text-[#E0E0E0]/70">
          Tap any subteam to see what they work on. Ten subteams across four
          parent groups.
        </p>
      </div>

      {/* Terminal frame */}
      <div className="border border-[#E0E0E0]/15 bg-[#0E0E0E]">
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-[#E0E0E0]/10 bg-[#181818]">
          <span className="w-2 h-2 rounded-full bg-[#E0E0E0]/30" />
          <span className="w-2 h-2 rounded-full bg-[#E0E0E0]/30" />
          <span className="w-2 h-2 rounded-full bg-[#E0E0E0]/30" />
          <span className="ml-2 font-mono text-[10px] tracking-[0.18em] uppercase text-[#E0E0E0]/40">
            team.tree
          </span>
        </div>

        {/* Tree body */}
        <div className="px-4 py-5 font-mono text-[12px] leading-[1.7] text-[#E0E0E0]/85">
          <div className="text-[#E0E0E0]/55 mb-3">
            <span className="text-[#c8963e]">{PROMPT}</span>{' '}
            <span className="text-[#E0E0E0]">tree</span>
          </div>

          <div className="text-[#E0E0E0]">drillbotics/</div>

          {parentKeys.map((pKey, pIdx) => {
            const parent = PARENTS[pKey];
            const subs = PARENT_ORDER[pKey];
            const isLastParent = pIdx === parentKeys.length - 1;
            return (
              <div key={pKey}>
                <div className="text-[#E0E0E0]/95">
                  <span className="text-[#E0E0E0]/40">
                    {isLastParent ? '└── ' : '├── '}
                  </span>
                  <span className="text-[#c8963e]">{parent.dir}/</span>
                  <span className="text-[#E0E0E0]/40 ml-2">
                    {parent.code} &middot; {parent.name}
                  </span>
                </div>

                {subs.map((sKey, sIdx) => {
                  const sub = SUBTEAMS[sKey];
                  const isLastSub = sIdx === subs.length - 1;
                  const expanded = !!open[sKey];
                  const treePrefix = isLastParent ? '    ' : '│   ';
                  const branch = isLastSub ? '└── ' : '├── ';
                  return (
                    <div key={sKey}>
                      <button
                        type="button"
                        onClick={() => toggle(sKey)}
                        aria-expanded={expanded}
                        className="block w-full text-left py-0.5 cursor-pointer bg-transparent border-0 outline-none"
                      >
                        <span className="text-[#E0E0E0]/40">
                          {treePrefix}
                          {branch}
                        </span>
                        <span className="text-[#E0E0E0]">{sub.name}</span>
                        <span className="text-[#500000] ml-1">/</span>
                        <span className="text-[#E0E0E0]/40 ml-2">{sub.code}</span>
                        <span className="text-[#E0E0E0]/30 ml-2">
                          {expanded ? '−' : '+'}
                        </span>
                      </button>

                      {expanded && (
                        <div className="pl-12 pb-2 pt-1 text-[#E0E0E0]/75">
                          <div className="mb-2">{sub.focus}</div>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {sub.stack.map((s) => (
                              <span
                                key={s}
                                className="font-mono text-[10px] tracking-[0.08em] px-[8px] py-[3px] border border-[#E0E0E0]/30 text-[#E0E0E0]/85"
                              >
                                {s.toLowerCase()}
                              </span>
                            ))}
                          </div>
                          <div className="text-[10px] tracking-[0.18em] uppercase text-[#c8963e]">
                            {sub.status}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}

          <div className="mt-4 text-[#E0E0E0]/40">
            10 subteams &middot; 4 parent groups
          </div>
        </div>
      </div>
    </section>
  );
}
