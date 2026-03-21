import type { ModelTypeMain, Paper, ResearchType } from '../types';
import {
  ALL_MODEL_LEAVES,
  ALL_TECHNIQUE_TAGS,
  FUNDING_SOURCES,
  MODEL_TYPE_TREE,
  OUTCOME_METRICS,
  PUBLICATION_TYPES,
  RESEARCH_TYPES,
} from './searchSchema';

const MODEL_CENTERS: Record<ModelTypeMain, [number, number, number]> = {
  Cells: [48, 22, 0],
  'Tissues & 3D Models': [-42, 28, 0],
  'Whole Organ Models': [-38, -36, 0],
  'Model Organisms': [44, -40, 0],
};

const JOURNALS = [
  'Cryobiology',
  'Biopreservation & Biobanking',
  'Nature Communications',
  'Cell Preservation Technology',
  'PLoS ONE',
  'Transplantation',
  'Fertility & Sterility',
  'CryoLetters',
  'Scientific Reports',
  'Tissue Engineering Part C',
];

const COUNTRIES = ['USA', 'UK', 'Germany', 'Japan', 'Canada', 'Australia', 'South Korea', 'China', 'France', 'Brazil'];

const INSTITUTIONS = [
  'CryoLab Institute',
  'University Medical Center',
  'National Cryo Consortium',
  'Dept. of Transplant Biology',
  'Reproductive Science Unit',
];

const CPA_TYPES = ['DMSO', 'Glycerol', 'Trehalose', 'EG / DMSO mix', 'Propylene glycol', 'Formamide blend'];

function leafToMain(param: string): ModelTypeMain {
  for (const block of MODEL_TYPE_TREE) {
    for (const sub of block.subs) {
      if (sub.params.includes(param)) return block.main;
    }
  }
  return 'Cells';
}

function randomGaussian(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function generatePosition(main: ModelTypeMain): [number, number, number] {
  const center = MODEL_CENTERS[main];
  return [center[0] + randomGaussian() * 9, center[1] + randomGaussian() * 9, 0];
}

function generateAuthors(): string[] {
  const firstNames = [
    'James', 'Sarah', 'Michael', 'Elena', 'David', 'Anna', 'Robert', 'Maria', 'William', 'Linda',
    'Chen', 'Yuki', 'Aisha', 'Omar', 'Li', 'Wei', 'Sofia', 'Lucas',
  ];
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez',
    'Martinez', 'Wang', 'Tanaka', 'Patel', 'Kim', 'Silva', 'Muller', 'Ivanov', 'Ali',
  ];
  const n = Math.floor(Math.random() * 5) + 1;
  const authors: string[] = [];
  for (let i = 0; i < n; i++) {
    authors.push(
      `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`
    );
  }
  return authors;
}

function pickOutcomes(): string[] {
  const k = Math.floor(Math.random() * 3) + 1;
  const shuffled = [...OUTCOME_METRICS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, k);
}

function pickTechniques(): string[] {
  const k = Math.floor(Math.random() * 4) + 2;
  const shuffled = [...ALL_TECHNIQUE_TAGS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, k);
}

function generatePaper(id: number): Paper {
  // Cycle evenly through all 21 leaves so each subcategory is well-represented
  const modelParam = ALL_MODEL_LEAVES[(id - 1) % ALL_MODEL_LEAVES.length];
  const modelTypeMain = leafToMain(modelParam);
  const block = MODEL_TYPE_TREE.find((b) => b.main === modelTypeMain)!;
  const sub = block.subs[0];

  const year = Math.floor(Math.random() * 37) + 1990;
  const researchType = RESEARCH_TYPES[Math.floor(Math.random() * RESEARCH_TYPES.length)] as ResearchType;
  const titles: Record<ResearchType, string[]> = {
    Basic: ['Ice nucleation kinetics', 'Glass transition in CPA matrices', 'Thermal conductivity at cryogenic temps'],
    Preclinical: ['Porcine renal vitrification', 'Rodent liver nanowarming', 'Organoid cryo-banking'],
    Clinical: ['Oocyte vitrification outcomes', 'Hematopoietic stem cell banking', 'Islet transplant preservation'],
    Computational: ['Finite-element rewarming models', 'Machine learning for CPA design', 'Pareto optimization of cooling protocols'],
  };
  const prefix = titles[researchType][Math.floor(Math.random() * titles[researchType].length)];
  const title = `${prefix}: ${modelParam} focus (${year})`;

  return {
    id: `paper-${id}`,
    title,
    authors: generateAuthors(),
    year,
    abstract: `We evaluate cryopreservation protocols for ${modelParam} under ${researchType.toLowerCase()} conditions, emphasizing technique tags ${pickTechniques().slice(0, 2).join(', ')}. Findings inform CPA loading, warming strategy, and outcome metrics relevant to translational cryobiology.`,
    keyFindings: [
      `Outcome emphasis: ${pickOutcomes()[0] ?? 'viability'}.`,
      `CPA window centered near ${5 + Math.floor(Math.random() * 25)}% v/v.`,
      `Storage and warming rates aligned with ${modelTypeMain.toLowerCase()} best practices.`,
    ],
    citations: [],
    position: generatePosition(modelTypeMain),
    researchType,
    journalName: JOURNALS[Math.floor(Math.random() * JOURNALS.length)],
    journalImpactFactor: Math.round((Math.random() * 18 + 1.5) * 10) / 10,
    openAccess: Math.random() > 0.55,
    authorInstitution: INSTITUTIONS[Math.floor(Math.random() * INSTITUTIONS.length)],
    countryRegion: COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)],
    fundingSource: FUNDING_SOURCES[Math.floor(Math.random() * FUNDING_SOURCES.length)],
    citationCount: Math.floor(Math.random() * 780) + 2,
    publicationType: PUBLICATION_TYPES[Math.floor(Math.random() * PUBLICATION_TYPES.length)] as string,
    modelTypeMain,
    modelTypeSub: sub.sub,
    modelParam,
    techniqueTags: pickTechniques(),
    cpaType: CPA_TYPES[Math.floor(Math.random() * CPA_TYPES.length)],
    cpaConcentrationPercent: Math.round((5 + Math.random() * 32) * 10) / 10,
    outcomes: pickOutcomes(),
    experimental: {
      coolingRateCPerMin: Math.round((0.5 + Math.random() * 95) * 10) / 10,
      warmingRateCPerMin: Math.round((2 + Math.random() * 140) * 10) / 10,
      storageDurationDays: Math.floor(Math.random() * 3200) + 14,
      storageTempC: [-196, -80, -20, -4][Math.floor(Math.random() * 4)],
    },
  };
}

export const MOCK_PAPERS: Paper[] = [];

// 2000 papers, ~95 per leaf so every subcategory is well-represented
const TOTAL_PAPERS = 2000;
for (let i = 1; i <= TOTAL_PAPERS; i++) {
  MOCK_PAPERS.push(generatePaper(i));
}

MOCK_PAPERS.forEach((paper) => {
  const numCitations = Math.floor(Math.random() * 6) + 3;
  for (let i = 0; i < numCitations; i++) {
    const citeSameCluster = Math.random() < 0.85;
    let targetPool = citeSameCluster
      ? MOCK_PAPERS.filter((p) => p.modelTypeMain === paper.modelTypeMain)
      : MOCK_PAPERS.filter((p) => p.modelTypeMain !== paper.modelTypeMain);
    if (targetPool.length === 0) targetPool = MOCK_PAPERS;
    const target = targetPool[Math.floor(Math.random() * targetPool.length)];
    if (target.id !== paper.id && !paper.citations.includes(target.id)) {
      paper.citations.push(target.id);
    }
  }
});

export const IMPACT_CHAINS: string[][] = [];

function generateChain(startMain: ModelTypeMain, length: number): string[] {
  const chain: string[] = [];
  let current = MOCK_PAPERS.find((p) => p.modelTypeMain === startMain);
  if (!current) return [];
  chain.push(current.id);
  for (let i = 1; i < length; i++) {
    let nextId = current.citations.find((id) => !chain.includes(id));
    if (!nextId) {
      const pool = MOCK_PAPERS.filter((p) => p.modelTypeMain === current!.modelTypeMain && !chain.includes(p.id));
      if (pool.length > 0) {
        nextId = pool[Math.floor(Math.random() * pool.length)].id;
        current!.citations.push(nextId);
      }
    }
    if (nextId) {
      chain.push(nextId);
      current = MOCK_PAPERS.find((p) => p.id === nextId);
      if (!current) break;
    } else break;
  }
  return chain;
}

IMPACT_CHAINS.push(generateChain('Cells', 5));
IMPACT_CHAINS.push(generateChain('Tissues & 3D Models', 6));
IMPACT_CHAINS.push(generateChain('Whole Organ Models', 5));
IMPACT_CHAINS.push(generateChain('Model Organisms', 4));
IMPACT_CHAINS.push(generateChain('Cells', 6));
