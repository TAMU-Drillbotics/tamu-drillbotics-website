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
    'text-[#500000] border-[rgba(80,0,0,0.3)] bg-transparent ' +
    'hover:bg-[#500000] hover:text-[#fafafa] hover:border-[#500000]',
  sub:
    'text-[#1a1a1a] border-[#d0d0d0] bg-transparent ' +
    'hover:bg-[#1a1a1a] hover:text-[#fafafa] hover:border-[#1a1a1a]',
};

export function Chip({ label, kind = 'sub', onRun }: Props) {
  return (
    <button type="button" onClick={onRun} className={`${base} ${styles[kind]}`}>
      {label}
    </button>
  );
}
