import { Parent, ParentKey, Subteam, SubteamKey } from './types';

export const PARENTS: Record<ParentKey, Parent> = {
  MECH: { code: 'A', name: 'Mechanical', dir: 'mechanical' },
  ELEC: { code: 'B', name: 'Electrical', dir: 'electrical' },
  ALGO: { code: 'C', name: 'Algorithm',  dir: 'algorithm'  },
  OPS:  { code: 'D', name: 'Operations', dir: 'operations' },
};

export const SUBTEAMS: Record<SubteamKey, Subteam> = {
  drillstring: {
    code: 'A1', parent: 'MECH', name: 'Drillstring',
    short: 'hydraulics, bit manufacturing',
    focus: 'Hydraulics, bit manufacturing, and downhole assembly.',
    responsibilities: [
      'Drillstring design and assembly',
      'Bit manufacturing',
      'Hydraulic system integration',
    ],
    stack: ['SOLIDWORKS', 'CNC', 'MATERIALS'],
    status: 'ACTIVE',
  },
  safety: {
    code: 'A2', parent: 'MECH', name: 'Safety',
    short: 'enclosure, E-stop, hydraulic systems, safety report',
    focus: 'Rig safety systems and the annual safety report for SPE submission.',
    responsibilities: [
      'Plexiglass enclosure design',
      'E-stop system integration',
      'Hydraulic safety systems',
      'Activation light',
      'Annual safety report',
    ],
    stack: ['FUSION 360', 'ANSI / API'],
    status: 'ACTIVE',
  },
  frame: {
    code: 'A3', parent: 'MECH', name: 'Frame',
    short: 'dolly frame, structural assembly',
    focus: 'Dolly frame and the structural assembly that carries the rig.',
    responsibilities: [
      'Dolly frame design',
      'Structural assembly',
      'Load analysis',
    ],
    stack: ['FUSION 360', 'STEEL'],
    status: 'ACTIVE',
  },
  electronics: {
    code: 'B1', parent: 'ELEC', name: 'Electronics',
    short: 'sensors, motors / drivers, electronics box',
    focus: 'Sensor integration, motor drivers, and the central electronics box.',
    responsibilities: [
      'Sensor selection and integration',
      'Motor driver design',
      'Electronics box assembly',
      'PCB layout',
    ],
    stack: ['KICAD', 'STM32', 'OSCILLOSCOPE'],
    status: 'ACTIVE',
  },
  software: {
    code: 'B2', parent: 'ELEC', name: 'Software',
    short: 'embedded C firmware (STM32), ML interface, PID control',
    focus: 'Embedded C firmware on STM32, the ML inference interface, and PID control algorithms.',
    responsibilities: [
      'STM32 embedded firmware',
      'ML / inference interface',
      'PID control algorithms',
      'Real-time control loop',
    ],
    stack: ['C', 'CMSIS', 'RTOS'],
    status: 'ACTIVE',
  },
  gpu: {
    code: 'C1', parent: 'ALGO', name: 'GPU',
    short: 'dedicated ML compute hardware, CUDA pipeline',
    focus: 'Dedicated ML compute hardware and the CUDA pipeline that runs on it.',
    responsibilities: [
      'ML compute hardware spec',
      'CUDA pipeline development',
      'GPU optimization',
    ],
    stack: ['CUDA', 'NVIDIA', 'LINUX'],
    status: 'ACTIVE',
  },
  data: {
    code: 'C2', parent: 'ALGO', name: 'Data',
    short: 'sensor fusion, analytics',
    focus: 'Sensor fusion, telemetry analytics, and the data pipeline feeding the ML stack.',
    responsibilities: [
      'Sensor fusion',
      'Telemetry analytics',
      'Data pipeline architecture',
    ],
    stack: ['PYTHON', 'PANDAS', 'NUMPY'],
    status: 'ACTIVE',
  },
  ml: {
    code: 'C3', parent: 'ALGO', name: 'ML',
    short: 'model development (PyTorch, TensorFlow)',
    focus: 'Model development, training, and inference for autonomous control.',
    responsibilities: [
      'Model architecture',
      'Training pipeline',
      'Inference deployment',
    ],
    stack: ['PYTORCH', 'TENSORFLOW'],
    status: 'ACTIVE',
  },
  sponsorship: {
    code: 'D1', parent: 'OPS', name: 'Sponsorship',
    short: 'sponsor outreach, relations, finance, budget',
    focus: 'Sponsor outreach and retention, industry relationships, and team finance.',
    responsibilities: [
      'Sponsor outreach and pitch development',
      'Sponsor relationship management',
      'Budget tracking and reporting',
      'Expense management and reimbursements',
    ],
    stack: ['NOTION', 'SHEETS'],
    status: 'ACTIVE',
  },
  marketing: {
    code: 'D2', parent: 'OPS', name: 'Marketing',
    short: 'brand, social media, content, advertising',
    focus: 'Brand identity, social media, content production, and outreach campaigns.',
    responsibilities: [
      'Brand and visual identity',
      'Social media presence',
      'Photo / video content',
      'Marketing campaigns and advertising',
    ],
    stack: ['FIGMA', 'ADOBE CC'],
    status: 'ACTIVE',
  },
};

export const PARENT_ORDER: Record<ParentKey, SubteamKey[]> = {
  MECH: ['drillstring', 'safety', 'frame'],
  ELEC: ['electronics', 'software'],
  ALGO: ['gpu', 'data', 'ml'],
  OPS:  ['sponsorship', 'marketing'],
};

export const CHIP_COMMANDS = ['tree', 'help'] as const;
export const ALL_COMMANDS = ['tree', 'ls', 'cat', 'help', 'clear'] as const;

export const PROMPT = 'drillbotics@rig-02 ~$';
export const BOX_WIDTH = 58;
