type Props = {
  label: string;
  kind?: 'cmd' | 'sub';
  onRun: () => void;
};

const base =
  'font-mono text-[11px] tracking-[0.08em] px-[11px] py-[5px] border ' +
  'cursor-pointer transition-colors duration-150 lowercase select-none';

const styles = {
  cmd:
    'text-[#E0E0E0] border-[#C8963E]/40 bg-[#C8963E]/20 ' +
    'hover:bg-[#C8963E] hover:text-[#1A1A1A] hover:border-[#C8963E]',
  sub:
    'text-[#E0E0E0] border-[#E0E0E0]/30 bg-transparent ' +
    'hover:bg-[#500000] hover:text-[#fafafa] hover:border-[#500000]',
};

export function Chip({ label, kind = 'sub', onRun }: Props) {
  return (
    <button type="button" onClick={onRun} className={`${base} ${styles[kind]}`}>
      {label}
    </button>
  );
}
