import { OutputLine, Segment, SubteamKey, ParentKey } from './types';
import { SUBTEAMS, PARENTS, PARENT_ORDER, BOX_WIDTH } from './data';
import { pad, rule, wrapText, seg } from './utils';

const line = (...segments: Segment[]): OutputLine => ({ segments });
const spacer = (): OutputLine => ({ segments: [], spacer: true });

export function welcome(): OutputLine[] {
  return [
    line(seg('TAMU DRILLBOTICS® · TEAM EXPLORER · v0.2', 'hl')),
    line(seg(rule(BOX_WIDTH), 'rule')),
    line(seg('Browse the team like a filesystem. 10 subteams across 4 parent groups.', 'mute')),
    spacer(),
    line(
      seg('Try: ', 'mute'),
      seg('tree', 'cmd'),
      seg(' · ', 'mute'),
      seg('cat drillstring', 'cmd'),
      seg(' · ', 'mute'),
      seg('help', 'cmd'),
    ),
    spacer(),
  ];
}

export function cmdTree(): OutputLine[] {
  const out: OutputLine[] = [];
  out.push(line(seg('teams/', 'dir')));

  const parentKeys = Object.keys(PARENTS) as ParentKey[];
  parentKeys.forEach((pk, pi) => {
    const isLastParent = pi === parentKeys.length - 1;
    const parent = PARENTS[pk];
    const subs = PARENT_ORDER[pk];

    const parentConn = isLastParent ? '└── ' : '├── ';
    out.push(line(
      seg(parentConn, 'branch'),
      seg(`${parent.dir}/`, 'dir'),
    ));

    const subPrefix = isLastParent ? '    ' : '│   ';

    if (subs.length === 0) {
      out.push(line(
        seg(subPrefix + '└── ', 'branch'),
        seg(pad('[ tbd ]', 22), 'leaf'),
        seg('# scope in definition', 'desc'),
      ));
      return;
    }

    subs.forEach((sk, si) => {
      const isLastSub = si === subs.length - 1;
      const conn = isLastSub ? '└── ' : '├── ';
      const st = SUBTEAMS[sk];
      out.push(line(
        seg(subPrefix + conn, 'branch'),
        seg(pad(st.name.toLowerCase(), 22), 'leaf'),
        seg(`# ${st.short}`, 'desc'),
      ));
    });
  });

  out.push(spacer());
  return out;
}

export function cmdLs(): OutputLine[] {
  const out: OutputLine[] = [];
  out.push(line(seg('PARENT TEAMS · 4 DIRECTORIES', 'mute')));
  out.push(line(seg(rule(BOX_WIDTH), 'rule')));

  (Object.keys(PARENTS) as ParentKey[]).forEach(pk => {
    const p = PARENTS[pk];
    const subs = PARENT_ORDER[pk];
    const count = subs.length === 0 ? '0 (pending)' : `${subs.length} subteams`;
    out.push(line(
      seg(p.code, 'tag'),
      seg('  '),
      seg(pad(p.dir + '/', 18), 'dir'),
      seg(pad(p.name, 16), 'mute'),
      seg(count, 'desc'),
    ));
  });

  out.push(spacer());
  out.push(line(
    seg('Use ', 'mute'),
    seg('tree', 'cmd'),
    seg(' for the full taxonomy or ', 'mute'),
    seg('cat <subteam>', 'cmd'),
    seg(' for details.', 'mute'),
  ));
  out.push(spacer());
  return out;
}

export function cmdCat(name: string): OutputLine[] {
  const key = name.toLowerCase().trim();
  const out: OutputLine[] = [];

  if (!(key in SUBTEAMS)) {
    out.push(line(seg(`cat: ${key || '(no arg)'}: no such subteam`, 'err')));

    const available: Segment[] = [seg('Available: ', 'mute')];
    const keys = Object.keys(SUBTEAMS);
    keys.forEach((k, i) => {
      available.push(seg(k, 'cmd'));
      if (i < keys.length - 1) available.push(seg(' · ', 'mute'));
    });
    out.push(line(...available));
    out.push(spacer());
    return out;
  }

  const st = SUBTEAMS[key as SubteamKey];

  out.push(line(seg(rule(BOX_WIDTH), 'rule')));

  const titleLeft = `  ${st.name.toUpperCase()}`;
  const titleRight = `${st.code} · ${st.parent}  `;
  const titlePadLen = Math.max(2, BOX_WIDTH - titleLeft.length - titleRight.length);
  out.push(line(
    seg(titleLeft, 'hl'),
    seg(' '.repeat(titlePadLen)),
    seg(titleRight, 'tag'),
  ));

  out.push(line(seg(rule(BOX_WIDTH), 'rule')));
  out.push(spacer());

  out.push(line(seg('  FOCUS', 'key')));
  wrapText(st.focus, BOX_WIDTH - 6).forEach(l => {
    out.push(line(seg('    '), seg(l, 'val')));
  });
  out.push(spacer());

  out.push(line(seg('  RESPONSIBILITIES', 'key')));
  st.responsibilities.forEach(r => {
    const wrapped = wrapText(r, BOX_WIDTH - 8);
    wrapped.forEach((l, i) => {
      const prefix = i === 0 ? '· ' : '  ';
      out.push(line(
        seg('    ' + prefix, 'mute'),
        seg(l, 'val'),
      ));
    });
  });
  out.push(spacer());

  out.push(line(seg('  STACK', 'key')));
  out.push(line(
    seg('    '),
    seg(st.stack.join('  ·  '), 'tag'),
  ));
  out.push(spacer());

  const statusLeft = '  STATUS';
  const statusRight = st.status === 'ACTIVE' ? '● ACTIVE' : '○ PENDING';
  const statusPad = Math.max(2, BOX_WIDTH - statusLeft.length - statusRight.length - 2);
  out.push(line(
    seg(statusLeft, 'key'),
    seg(' '.repeat(statusPad)),
    seg(statusRight, st.status === 'ACTIVE' ? 'active' : 'pending'),
    seg('  '),
  ));

  out.push(spacer());
  out.push(line(seg(rule(BOX_WIDTH), 'rule')));
  out.push(spacer());

  return out;
}

export function cmdHelp(): OutputLine[] {
  const out: OutputLine[] = [];

  out.push(line(seg('COMMAND REFERENCE', 'hl')));
  out.push(line(seg(rule(BOX_WIDTH), 'rule')));
  out.push(spacer());

  const rows: Array<[string, string]> = [
    ['tree',          'show the full team taxonomy'],
    ['ls',            'list parent teams'],
    ['cat <subteam>', 'show details for a subteam'],
    ['<subteam>',     'shorthand for `cat <subteam>`'],
    ['clear',         'clear the screen'],
    ['help',          'this list'],
  ];
  rows.forEach(([c, d]) => {
    out.push(line(
      seg('  '),
      seg(pad(c, 18), 'cmd'),
      seg(d, 'desc'),
    ));
  });
  out.push(spacer());

  out.push(line(seg('SUBTEAMS', 'hl')));
  out.push(line(seg(rule(BOX_WIDTH), 'rule')));
  (Object.keys(PARENTS) as ParentKey[]).forEach(pk => {
    const subs = PARENT_ORDER[pk];
    const names = subs.length === 0 ? '[ tbd ]' : subs.join('  ·  ');
    out.push(line(
      seg('  '),
      seg(pad(`${PARENTS[pk].code} · ${pk}`, 12), 'tag'),
      seg(names, 'leaf'),
    ));
  });
  out.push(spacer());

  out.push(line(
    seg('Tip: use ', 'mute'),
    seg('↑ / ↓', 'cmd'),
    seg(' for command history.', 'mute'),
  ));
  out.push(spacer());

  return out;
}

export function cmdUnknown(raw: string): OutputLine[] {
  const first = raw.split(/\s+/)[0];
  return [
    line(
      seg(`zsh: command not found: ${first}`, 'err'),
      seg(' · try ', 'mute'),
      seg('help', 'cmd'),
    ),
    spacer(),
  ];
}

export type DispatchResult = OutputLine[] | { kind: 'clear' };

export function dispatch(raw: string): DispatchResult {
  const trimmed = raw.trim();
  if (!trimmed) return [];

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const arg = parts.slice(1).join(' ').toLowerCase();

  if (cmd in SUBTEAMS) return cmdCat(cmd);

  switch (cmd) {
    case 'tree':  return cmdTree();
    case 'ls':    return cmdLs();
    case 'cat':   return cmdCat(arg);
    case 'help':
    case 'h':
    case '?':     return cmdHelp();
    case 'clear':
    case 'cls':   return { kind: 'clear' };
    default:      return cmdUnknown(trimmed);
  }
}
