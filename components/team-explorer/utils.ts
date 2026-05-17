import { Tone, Segment } from './types';

export function pad(s: string, width: number): string {
  return s + ' '.repeat(Math.max(0, width - s.length));
}

export function rule(width: number, ch = '─'): string {
  return ch.repeat(width);
}

export function wrapText(text: string, width: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    if (!line) { line = w; continue; }
    if ((line + ' ' + w).length <= width) line += ' ' + w;
    else { lines.push(line); line = w; }
  }
  if (line) lines.push(line);
  return lines;
}

export const seg = (text: string, tone?: Tone): Segment => ({ text, tone });

export const TONE_CLASSES: Record<Tone, string> = {
  prompt:  'text-[#d4a14b]',
  cmd:     'text-white font-medium',
  dir:     'text-[#d4a14b] font-medium',
  leaf:    'text-white',
  desc:    'text-[#6a6a6a]',
  branch:  'text-[#3a3a3a]',
  hl:      'text-[#d4a14b] tracking-[0.12em] font-semibold',
  mute:    'text-[#6a6a6a]',
  rule:    'text-[#3a3a3a]',
  active:  'text-[#88b070]',
  pending: 'text-[#9a7530]',
  err:     'text-[#c87060]',
  tag:     'text-[#d4a14b] tracking-[0.12em]',
  key:     'text-[#d4a14b]',
  val:     'text-[#e8e8e8]',
  bright:  'text-white',
};
