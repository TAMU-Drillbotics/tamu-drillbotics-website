export type Tone =
  | 'prompt'
  | 'cmd'
  | 'dir'
  | 'leaf'
  | 'desc'
  | 'branch'
  | 'hl'
  | 'mute'
  | 'rule'
  | 'active'
  | 'pending'
  | 'err'
  | 'tag'
  | 'key'
  | 'val'
  | 'bright';

export type Segment = { text: string; tone?: Tone };

export type OutputLine = {
  segments: Segment[];
  spacer?: boolean;
};

export type ParentKey = 'MECH' | 'ELEC' | 'ALGO' | 'OPS';

export type Parent = {
  code: string;
  name: string;
  dir: string;
};

export type SubteamKey =
  | 'drillstring' | 'safety' | 'frame'
  | 'electronics' | 'software'
  | 'gpu' | 'data' | 'ml'
  | 'sponsorship' | 'marketing';

export type Subteam = {
  code: string;
  parent: ParentKey;
  name: string;
  short: string;
  focus: string;
  responsibilities: string[];
  stack: string[];
  status: 'ACTIVE' | 'PENDING';
};

export type HistoryEntry =
  | { kind: 'echo'; command: string }
  | { kind: 'output'; lines: OutputLine[] };
