import { useState, useCallback } from 'react';
import { Legend } from './Legend';
import { Terminal } from './Terminal';
import { dispatch, welcome, cmdTree } from './commands';
import { HistoryEntry } from './types';

const initialEntries: HistoryEntry[] = [
  { kind: 'output', lines: welcome() },
  { kind: 'echo', command: 'tree' },
  { kind: 'output', lines: cmdTree() },
];

export function TeamExplorer() {
  const [entries, setEntries] = useState<HistoryEntry[]>(initialEntries);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);

  const run = useCallback((raw: string) => {
    const result = dispatch(raw);

    if (!Array.isArray(result)) {
      if (result.kind === 'clear') setEntries([]);
      return;
    }

    const echo: HistoryEntry = { kind: 'echo', command: raw };
    const output: HistoryEntry = { kind: 'output', lines: result };
    setEntries(prev => [...prev, echo, output]);

    if (raw.trim()) {
      setCmdHistory(prev => [...prev, raw]);
    }
  }, []);

  return (
    <section className="w-full">
      {/* Two-column intro */}
      <div className="grid grid-cols-[1.2fr_2fr] gap-12 mb-14">
        <div>
          <div className="font-mono text-[10px] tracking-[0.18em] text-[#E0E0E0]/50 uppercase mb-3">
            HOW IT WORKS
          </div>
          <h2 className="font-display font-semibold text-[40px] leading-[1.05] tracking-[-0.01em] text-[#E0E0E0]">
            Browse the team like a filesystem<span className="text-[#c8963e]">.</span>
          </h2>
        </div>
        <div>
          <p className="text-[15px] leading-[1.65] text-[#E0E0E0]/70 max-w-[560px]">
            Tap any subteam below to see what they work on. The terminal also takes
            commands &mdash;{' '}
            <code className="font-mono text-[13px] bg-[#C8963E]/30 text-[#E0E0E0] px-[6px] py-[1px]">tree</code>{' '}
            shows the whole team at once,{' '}
            <code className="font-mono text-[13px] bg-[#C8963E]/30 text-[#E0E0E0] px-[6px] py-[1px]">help</code>{' '}
            lists what else you can type.{' '}
            <code className="font-mono text-[13px] bg-[#500000]/30 text-[#E0E0E0] px-[6px] py-[1px]">&uarr; / &darr;</code>{' '}
            for history.
          </p>
        </div>
      </div>

      <Legend onRun={run} />
      <Terminal entries={entries} onRun={run} cmdHistory={cmdHistory} />
    </section>
  );
}
