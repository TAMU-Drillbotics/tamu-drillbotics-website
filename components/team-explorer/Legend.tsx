import { Fragment } from 'react';
import { Chip } from './Chip';
import { PARENTS, PARENT_ORDER, CHIP_COMMANDS } from './data';
import { ParentKey } from './types';

type Props = {
  onRun: (cmd: string) => void;
};

export function Legend({ onRun }: Props) {
  const groups = (Object.keys(PARENTS) as ParentKey[])
    .filter(pk => PARENT_ORDER[pk].length > 0);

  return (
    <div className="relative border border-[#1a1a1a] bg-[#fafafa] px-7 py-6 mb-4">
      {/* Corner cross decorations */}
      <span className="absolute -top-[5px] -left-[5px] w-[10px] h-[10px] border border-[#1a1a1a] border-r-0 border-b-0" aria-hidden />
      <span className="absolute -bottom-[5px] -right-[5px] w-[10px] h-[10px] border border-[#1a1a1a] border-l-0 border-t-0" aria-hidden />

      {/* Header strip */}
      <div className="flex justify-between items-center font-mono text-[9.5px] tracking-[0.18em] text-[#6a6a6a] uppercase pb-3 border-b border-[#d0d0d0] mb-[18px]">
        <span className="text-[#1a1a1a] font-semibold">CLICK A CHIP TO EXPLORE</span>
        <span>10 SUBTEAMS</span>
      </div>

      {/* Row 1: command chips */}
      <div className="grid grid-cols-[100px_1fr] gap-6 items-center py-[7px]">
        <span className="font-mono text-[10px] tracking-[0.18em] text-[#6a6a6a] uppercase">
          START
        </span>
        <div className="flex flex-wrap gap-[6px]">
          {CHIP_COMMANDS.map(c => (
            <Chip key={c} label={c} kind="cmd" onRun={() => onRun(c)} />
          ))}
        </div>
      </div>

      {/* Row 2: subteam chips */}
      <div className="grid grid-cols-[100px_1fr] gap-6 items-center py-[7px] border-t border-dashed border-[#e6e6e6]">
        <span className="font-mono text-[10px] tracking-[0.18em] text-[#6a6a6a] uppercase">
          SUBTEAMS
        </span>
        <div className="flex flex-wrap gap-[6px] items-center">
          {groups.map((pk, gi) => (
            <Fragment key={pk}>
              {PARENT_ORDER[pk].map(sk => (
                <Chip key={sk} label={sk} kind="sub" onRun={() => onRun(sk)} />
              ))}
              {gi < groups.length - 1 && (
                <span
                  className="font-mono text-[14px] text-[#9a9a9a] px-1 select-none pointer-events-none"
                  aria-hidden
                >
                  &middot;
                </span>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
