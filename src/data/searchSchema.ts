import type { FundingSource, ModelTypeMain, ResearchType } from '../types';

/**
 * Per-leaf hex colors — 21 distinct colors mapped to each model param.
 * Groups share a hue family so the graph has clear cluster identity while
 * leaves within each cluster remain individually distinguishable.
 */
export const LEAF_HEX_COLORS: Record<string, string> = {
  // Cells — rose → fuchsia → violet spectrum
  'Cell lines':              '#f43f5e',
  'Primary cells':           '#fb7185',
  'Reproductive cells':      '#f472b6',
  'Stem cells':              '#e879f9',
  'Immune cells':            '#c084fc',
  'Cancer cells':            '#818cf8',

  // Tissues & 3D Models — cyan → teal → emerald
  'Tissue slices & Biopsies': '#22d3ee',
  'Organoids':               '#2dd4bf',
  'Engineered tissues':      '#4ade80',

  // Whole Organ Models — amber → orange → red (warm)
  'Kidneys':                 '#fbbf24',
  'Livers':                  '#fb923c',
  'Hearts':                  '#f87171',
  'Lungs':                   '#38bdf8',   // sky-blue contrast

  // Model Organisms — spread across sky → lime → yellow
  'Extremophiles':           '#34d399',
  'Invertebrates':           '#a3e635',
  'Fish':                    '#67e8f9',
  'Amphibians':              '#86efac',
  'Rodents':                 '#fcd34d',
  'Livestock':               '#fdba74',
  'Non-human primates':      '#a5b4fc',
  'Humans':                  '#7dd3fc',
};

/** Fallback if a leaf key is not found */
export const LEAF_HEX_FALLBACK = '#94a3b8';

/** Main-category color (brightest leaf per group) */
export const MODEL_MAIN_HEX: Record<ModelTypeMain, string> = {
  Cells: '#f43f5e',
  'Tissues & 3D Models': '#22d3ee',
  'Whole Organ Models': '#fb923c',
  'Model Organisms': '#34d399',
};

export const MODEL_MAIN_TAILWIND: Record<ModelTypeMain, { text: string; bg: string; border: string }> = {
  Cells:                { text: 'text-rose-400',   bg: 'bg-rose-500',   border: 'border-rose-500/30'   },
  'Tissues & 3D Models':{ text: 'text-cyan-400',   bg: 'bg-cyan-500',   border: 'border-cyan-500/30'   },
  'Whole Organ Models': { text: 'text-orange-400', bg: 'bg-orange-500', border: 'border-orange-500/30' },
  'Model Organisms':    { text: 'text-emerald-400',bg: 'bg-emerald-500',border: 'border-emerald-500/30'},
};

export const RESEARCH_TYPES: ResearchType[] = ['Basic', 'Preclinical', 'Clinical', 'Computational'];

export const FUNDING_SOURCES: FundingSource[] = ['Industry', 'Academia', 'Government'];

export const PUBLICATION_TYPES = [
  'Research Papers',
  'Methods Papers',
  'Review Papers',
  'Meta Analyses',
  'Protocols',
  'Guidelines',
  'Academic Theses',
  'Patents',
  'Preprints',
  'Conference Proceedings',
  'Technical Reports',
  'Grey Literature',
] as const;

export const OUTCOME_METRICS = [
  'Post-thaw viability',
  'Functional recovery',
  'Structural integrity',
  'Long-term survival',
  'Fertilization success',
] as const;

export const TECHNIQUE_GROUPS: { id: string; label: string; items: string[] }[] = [
  {
    id: 'freezing',
    label: 'Freezing',
    items: ['Vitrification', 'Slow Freezing', 'Rapid Freezing', 'Directional Freezing', 'Ice-seeding'],
  },
  {
    id: 'rewarming',
    label: 'Rewarming',
    items: ['Convective warming', 'Laser warming', 'Nanowarming', 'Microwave warming'],
  },
  {
    id: 'delivery',
    label: 'Delivery',
    items: [
      'Bulk perfusion',
      'Vascular perfusion',
      'Machine perfusion',
      'Stepwise CPA loading',
      'Single-step CPA loading',
    ],
  },
  {
    id: 'preservation',
    label: 'Preservation',
    items: ['Ice-based', 'Ice-free', 'Supercooling', 'Isochoric preservation'],
  },
];

/** All technique tags (for mock / validation) */
export const ALL_TECHNIQUE_TAGS: string[] = TECHNIQUE_GROUPS.flatMap((g) => g.items);

export const MODEL_TYPE_TREE: {
  main: ModelTypeMain;
  subs: { sub: string; params: string[] }[];
}[] = [
  {
    main: 'Cells',
    subs: [
      {
        sub: 'Cells',
        params: [
          'Cell lines',
          'Primary cells',
          'Reproductive cells',
          'Stem cells',
          'Immune cells',
          'Cancer cells',
        ],
      },
    ],
  },
  {
    main: 'Tissues & 3D Models',
    subs: [
      {
        sub: 'Tissues & 3D Models',
        params: ['Tissue slices & Biopsies', 'Organoids', 'Engineered tissues'],
      },
    ],
  },
  {
    main: 'Whole Organ Models',
    subs: [
      {
        sub: 'Whole Organ Models',
        params: ['Kidneys', 'Livers', 'Hearts', 'Lungs'],
      },
    ],
  },
  {
    main: 'Model Organisms',
    subs: [
      {
        sub: 'Model Organisms',
        params: [
          'Extremophiles',
          'Invertebrates',
          'Fish',
          'Amphibians',
          'Rodents',
          'Livestock',
          'Non-human primates',
          'Humans',
        ],
      },
    ],
  },
];

export const ALL_MODEL_LEAVES: string[] = MODEL_TYPE_TREE.flatMap((b) =>
  b.subs.flatMap((s) => s.params)
);

/** Section accent (sidebar top-level groups) */
export const SECTION_ACCENTS = {
  search: { bar: 'bg-sky-500', text: 'text-sky-400', ring: 'ring-sky-500/20' },
  techniques: { bar: 'bg-cyan-500', text: 'text-cyan-400', ring: 'ring-cyan-500/20' },
  outcomes: { bar: 'bg-emerald-500', text: 'text-emerald-400', ring: 'ring-emerald-500/20' },
  experimental: { bar: 'bg-amber-500', text: 'text-amber-400', ring: 'ring-amber-500/20' },
  publication: { bar: 'bg-violet-500', text: 'text-violet-400', ring: 'ring-violet-500/20' },
  model: { bar: 'bg-fuchsia-500', text: 'text-fuchsia-400', ring: 'ring-fuchsia-500/20' },
} as const;
