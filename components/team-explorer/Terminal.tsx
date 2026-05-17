import { useEffect, useRef, useState, KeyboardEvent, Fragment } from 'react';
import { TerminalLine } from './TerminalLine';
import { HistoryEntry } from './types';
import { PROMPT } from './data';

type Props = {
  entries: HistoryEntry[];
  onRun: (cmd: string) => void;
  cmdHistory: string[];
};

export function Terminal({ entries, onRun, cmdHistory }: Props) {
  const [input, setInput] = useState('');
  const [historyIdx, setHistoryIdx] = useState(cmdHistory.length);
  const [draftBuffer, setDraftBuffer] = useState('');

  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHistoryIdx(cmdHistory.length);
  }, [cmdHistory.length]);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [entries]);

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      onRun(input);
      setInput('');
      setDraftBuffer('');
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      if (historyIdx === cmdHistory.length) setDraftBuffer(input);
      const next = Math.max(0, historyIdx - 1);
      setHistoryIdx(next);
      setInput(cmdHistory[next]);
      requestAnimationFrame(() => {
        inputRef.current?.setSelectionRange(
          inputRef.current.value.length,
          inputRef.current.value.length,
        );
      });
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const next = Math.min(cmdHistory.length, historyIdx + 1);
      setHistoryIdx(next);
      setInput(next === cmdHistory.length ? draftBuffer : cmdHistory[next]);
      requestAnimationFrame(() => {
        inputRef.current?.setSelectionRange(
          inputRef.current.value.length,
          inputRef.current.value.length,
        );
      });
      return;
    }

    if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onRun('clear');
      return;
    }
  }

  function handleTerminalClick() {
    if (window.getSelection()?.toString()) return;
    inputRef.current?.focus();
  }

  return (
    <div
      onClick={handleTerminalClick}
      className="bg-[#141414] border border-[#2a2a2a] overflow-hidden cursor-text"
      style={{
        boxShadow: '0 2px 0 #111, 0 6px 0 #0d0d0d, 0 12px 32px rgba(0,0,0,0.55), 0 32px 64px rgba(0,0,0,0.3)',
      }}
    >
      {/* Top bar */}
      <div className="bg-[#1c1c1c] border-b border-[#2a2a2a] px-4 py-[10px] flex items-center gap-3">
        <div className="flex gap-[6px]">
          <span className="w-[10px] h-[10px] rounded-full bg-[#FF5F57]" />
          <span className="w-[10px] h-[10px] rounded-full bg-[#FFBD2E]" />
          <span className="w-[10px] h-[10px] rounded-full bg-[#28C840]" />
        </div>
        <span className="flex-1 text-center font-mono text-[10.5px] tracking-[0.15em] text-[#888] uppercase">
          tamu-drillbotics &mdash; zsh &mdash; team-explorer
        </span>
        <span className="text-[#d4a14b] font-mono text-[10.5px] tracking-[0.15em] uppercase flex items-center gap-[6px]">
          <span className="w-[6px] h-[6px] rounded-full bg-[#d4a14b] shadow-[0_0_6px_#d4a14b] animate-pulse" />
          CONNECTED
        </span>
      </div>

      {/* Body */}
      <div
        ref={bodyRef}
        className="px-7 py-[18px] h-[540px] overflow-y-auto overflow-x-auto subs-scroll"
        style={{ scrollbarWidth: 'none' }}
      >
        {entries.map((entry, i) => {
          if (entry.kind === 'echo') {
            return (
              <div
                key={i}
                className="font-mono text-[13.5px] leading-[1.7] whitespace-pre"
              >
                <span className="text-[#d4a14b]">{PROMPT} </span>
                <span className="text-white font-medium">{entry.command}</span>
              </div>
            );
          }
          return (
            <Fragment key={i}>
              {entry.lines.map((ln, li) => (
                <TerminalLine key={li} line={ln} />
              ))}
            </Fragment>
          );
        })}

        {/* Active prompt + input */}
        <div className="flex items-center gap-[10px] py-[2px] font-mono text-[13.5px] leading-[1.7]">
          <span className="text-[#d4a14b] whitespace-nowrap">{PROMPT}</span>
          <div className="relative flex-1 flex items-center">
            {/* Mirrored visible text + blinking cursor */}
            <span className="text-white font-medium whitespace-pre">{input}</span>
            <span
              aria-hidden="true"
              className="inline-block w-[9px] h-[16px] bg-[#d4a14b] align-middle"
              style={{ animation: 'terminal-blink 1.05s steps(2, start) infinite' }}
            />
            {input === '' && (
              <span className="ml-[6px] text-[#444] italic pointer-events-none select-none">
                type a command, or click a chip above…
              </span>
            )}
            {/* Real input — transparent, overlaid, captures keystrokes */}
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className="absolute inset-0 w-full h-full bg-transparent border-none outline-none text-transparent caret-transparent font-mono text-[13.5px] leading-[1.7] p-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
