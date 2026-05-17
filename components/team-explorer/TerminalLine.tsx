import { OutputLine } from './types';
import { TONE_CLASSES } from './utils';

type Props = { line: OutputLine };

export function TerminalLine({ line }: Props) {
  if (line.spacer) {
    return <div className="h-[0.6em]" aria-hidden />;
  }

  return (
    <div className="font-mono text-[13.5px] leading-[1.7] whitespace-pre">
      {line.segments.map((s, i) => (
        <span key={i} className={s.tone ? TONE_CLASSES[s.tone] : undefined}>
          {s.text}
        </span>
      ))}
    </div>
  );
}
