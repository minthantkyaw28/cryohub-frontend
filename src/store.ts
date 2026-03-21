import { create } from 'zustand';
import type { Paper, QueryResult, ResearchType, FundingSource, PaperFilterState } from './types';
import { MOCK_PAPERS, IMPACT_CHAINS } from './data/mockData';
import { DEFAULT_FILTER_RANGES, hasActiveFilters, paperMatchesFilters } from './utils/paperFilters';

export interface QueryHistoryEntry {
  id: string;
  query: string;
  result: QueryResult;
  timestamp: number;
}

const SEED_ENTRIES: QueryHistoryEntry[] = [
  {
    id: 'seed-3',
    query: 'Ice recrystallization inhibitors',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3,
    result: {
      answer:
        'Ice recrystallization inhibitors (IRIs) are compounds that prevent the growth of ice crystals during warming, which is a major cause of cellular damage. Research has identified antifreeze proteins and small-molecule mimics as effective IRIs.',
      insights: {
        agreements: [
          'IRIs significantly improve post-thaw cell viability.',
          'PVA-based IRIs are effective at micromolar concentrations.',
        ],
        contradictions: ['Mechanism of action differs between protein-based and synthetic IRIs.'],
        trends: [
          'Growing interest in biocompatible synthetic IRI compounds.',
          'Application in blood banking and red blood cell preservation.',
        ],
      },
      sources: MOCK_PAPERS.slice(0, 4).map((p) => p.id),
      confidence: 'High',
    },
  },
  {
    id: 'seed-2',
    query: 'Toxicity of DMSO in neural tissue',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5,
    result: {
      answer:
        'Dimethyl sulfoxide (DMSO) is a widely used cryoprotectant but exhibits dose-dependent toxicity in neural tissue. Studies show mitochondrial dysfunction and apoptosis at concentrations above 5% v/v.',
      insights: {
        agreements: [
          'DMSO toxicity is concentration and temperature dependent.',
          'Brief exposure at low temperature is relatively well-tolerated.',
        ],
        contradictions: ['Neuroprotective vs. neurotoxic roles of DMSO are debated at sub-toxic doses.'],
        trends: [
          'Move towards DMSO-free protocols for neural organoids.',
          'Trehalose and glycerol being explored as safer alternatives.',
        ],
      },
      sources: MOCK_PAPERS.slice(5, 9).map((p) => p.id),
      confidence: 'Medium',
    },
  },
  {
    id: 'seed-1',
    query: 'Vitrification vs Slow Freezing',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 7,
    result: {
      answer:
        'Vitrification achieves a glass-like state by avoiding ice crystal formation entirely, whereas slow freezing uses controlled cooling rates to limit intracellular ice. Vitrification shows superior outcomes for complex tissues and oocytes.',
      insights: {
        agreements: [
          'Vitrification is superior for oocytes and embryos.',
          'Slow freezing is more practical at scale for blood products.',
        ],
        contradictions: [
          'Optimal CPA cocktail composition varies considerably across labs.',
          'Warming rate dependency is disputed for large organs.',
        ],
        trends: [
          'Ultrafast laser warming paired with vitrification.',
          'Microfluidic platforms for vitrification of single cells.',
        ],
      },
      sources: MOCK_PAPERS.slice(10, 14).map((p) => p.id),
      confidence: 'High',
    },
  },
];

export interface AppState {
  papers: Paper[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  researchTypeFilters: ResearchType[];
  toggleResearchTypeFilter: (t: ResearchType) => void;
  fundingFilters: FundingSource[];
  toggleFundingFilter: (f: FundingSource) => void;
  openAccess: 'any' | 'yes' | 'no';
  setOpenAccess: (v: 'any' | 'yes' | 'no') => void;
  journalQuery: string;
  setJournalQuery: (v: string) => void;
  authorInstitutionQuery: string;
  setAuthorInstitutionQuery: (v: string) => void;
  countryQuery: string;
  setCountryQuery: (v: string) => void;
  cpaTypeQuery: string;
  setCpaTypeQuery: (v: string) => void;

  impactFactorRange: [number, number];
  setImpactFactorRange: (r: [number, number]) => void;
  citationCountRange: [number, number];
  setCitationCountRange: (r: [number, number]) => void;
  cpaConcRange: [number, number];
  setCpaConcRange: (r: [number, number]) => void;
  coolingRateRange: [number, number];
  setCoolingRateRange: (r: [number, number]) => void;
  warmingRateRange: [number, number];
  setWarmingRateRange: (r: [number, number]) => void;
  storageDaysRange: [number, number];
  setStorageDaysRange: (r: [number, number]) => void;
  storageTempRange: [number, number];
  setStorageTempRange: (r: [number, number]) => void;

  yearRange: [number, number];
  setYearRange: (range: [number, number]) => void;

  techniqueFilters: string[];
  toggleTechniqueFilter: (technique: string) => void;
  outcomeFilters: string[];
  toggleOutcomeFilter: (o: string) => void;
  modelLeafFilters: string[];
  toggleModelLeafFilter: (leaf: string) => void;
  publicationFilters: string[];
  togglePublicationFilter: (pubType: string) => void;

  selectedPaper: Paper | null;
  setSelectedPaper: (paper: Paper | null) => void;
  hoveredPaper: Paper | null;
  setHoveredPaper: (paper: Paper | null) => void;
  queryResult: QueryResult | null;
  isQuerying: boolean;
  submitQuery: (query: string) => Promise<void>;
  highlightedNodes: string[];

  viewMode: 'graph' | 'list';
  setViewMode: (mode: 'graph' | 'list') => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  isResultsPanelOpen: boolean;
  toggleResultsPanel: () => void;

  searchMode: 'keyword' | 'ai';
  setSearchMode: (mode: 'keyword' | 'ai') => void;

  queryHistory: QueryHistoryEntry[];
  activeHistoryId: string | null;
  setActiveHistoryId: (id: string | null) => void;
}

export function paperFilterSnapshot(s: AppState): PaperFilterState {
  return {
    searchQuery: s.searchQuery,
    researchTypeFilters: s.researchTypeFilters,
    fundingFilters: s.fundingFilters,
    openAccess: s.openAccess,
    journalQuery: s.journalQuery,
    authorInstitutionQuery: s.authorInstitutionQuery,
    countryQuery: s.countryQuery,
    cpaTypeQuery: s.cpaTypeQuery,
    impactFactorRange: s.impactFactorRange,
    citationCountRange: s.citationCountRange,
    cpaConcRange: s.cpaConcRange,
    coolingRateRange: s.coolingRateRange,
    warmingRateRange: s.warmingRateRange,
    storageDaysRange: s.storageDaysRange,
    storageTempRange: s.storageTempRange,
    yearRange: s.yearRange,
    techniqueFilters: s.techniqueFilters,
    outcomeFilters: s.outcomeFilters,
    modelLeafFilters: s.modelLeafFilters,
    publicationFilters: s.publicationFilters,
  };
}

const d = DEFAULT_FILTER_RANGES;

export const useAppStore = create<AppState>((set, get) => ({
  papers: MOCK_PAPERS,
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  researchTypeFilters: [],
  toggleResearchTypeFilter: (t) =>
    set((state) => ({
      researchTypeFilters: state.researchTypeFilters.includes(t)
        ? state.researchTypeFilters.filter((x) => x !== t)
        : [...state.researchTypeFilters, t],
    })),
  fundingFilters: [],
  toggleFundingFilter: (f) =>
    set((state) => ({
      fundingFilters: state.fundingFilters.includes(f)
        ? state.fundingFilters.filter((x) => x !== f)
        : [...state.fundingFilters, f],
    })),
  openAccess: 'any',
  setOpenAccess: (v) => set({ openAccess: v }),
  journalQuery: '',
  setJournalQuery: (v) => set({ journalQuery: v }),
  authorInstitutionQuery: '',
  setAuthorInstitutionQuery: (v) => set({ authorInstitutionQuery: v }),
  countryQuery: '',
  setCountryQuery: (v) => set({ countryQuery: v }),
  cpaTypeQuery: '',
  setCpaTypeQuery: (v) => set({ cpaTypeQuery: v }),

  impactFactorRange: [...d.impactFactor] as [number, number],
  setImpactFactorRange: (r) => set({ impactFactorRange: r }),
  citationCountRange: [...d.citationCount] as [number, number],
  setCitationCountRange: (r) => set({ citationCountRange: r }),
  cpaConcRange: [...d.cpaConc] as [number, number],
  setCpaConcRange: (r) => set({ cpaConcRange: r }),
  coolingRateRange: [...d.coolingRate] as [number, number],
  setCoolingRateRange: (r) => set({ coolingRateRange: r }),
  warmingRateRange: [...d.warmingRate] as [number, number],
  setWarmingRateRange: (r) => set({ warmingRateRange: r }),
  storageDaysRange: [...d.storageDays] as [number, number],
  setStorageDaysRange: (r) => set({ storageDaysRange: r }),
  storageTempRange: [...d.storageTemp] as [number, number],
  setStorageTempRange: (r) => set({ storageTempRange: r }),

  yearRange: [...d.year] as [number, number],
  setYearRange: (range) => set({ yearRange: range }),

  techniqueFilters: [],
  toggleTechniqueFilter: (technique) =>
    set((state) => ({
      techniqueFilters: state.techniqueFilters.includes(technique)
        ? state.techniqueFilters.filter((t) => t !== technique)
        : [...state.techniqueFilters, technique],
    })),
  outcomeFilters: [],
  toggleOutcomeFilter: (o) =>
    set((state) => ({
      outcomeFilters: state.outcomeFilters.includes(o)
        ? state.outcomeFilters.filter((x) => x !== o)
        : [...state.outcomeFilters, o],
    })),
  modelLeafFilters: [],
  toggleModelLeafFilter: (leaf) =>
    set((state) => ({
      modelLeafFilters: state.modelLeafFilters.includes(leaf)
        ? state.modelLeafFilters.filter((x) => x !== leaf)
        : [...state.modelLeafFilters, leaf],
    })),
  publicationFilters: [],
  togglePublicationFilter: (pubType) =>
    set((state) => ({
      publicationFilters: state.publicationFilters.includes(pubType)
        ? state.publicationFilters.filter((p) => p !== pubType)
        : [...state.publicationFilters, pubType],
    })),

  selectedPaper: null,
  setSelectedPaper: (paper) =>
    set((state) => {
      if (!paper) {
        return {
          selectedPaper: null,
          highlightedNodes: state.queryResult ? state.queryResult.sources : [],
        };
      }
      const connected = [paper.id, ...paper.citations];
      state.papers.forEach((p) => {
        if (p.citations.includes(paper.id)) {
          connected.push(p.id);
        }
      });
      return { selectedPaper: paper, highlightedNodes: Array.from(new Set(connected)) };
    }),
  hoveredPaper: null,
  setHoveredPaper: (paper) => set({ hoveredPaper: paper }),
  queryResult: null,
  isQuerying: false,
  highlightedNodes: IMPACT_CHAINS.flat(),

  viewMode: 'graph',
  setViewMode: (mode) => set({ viewMode: mode }),
  isSidebarOpen: false,
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  isResultsPanelOpen: true,
  toggleResultsPanel: () => set((state) => ({ isResultsPanelOpen: !state.isResultsPanelOpen })),

  searchMode: 'ai',
  setSearchMode: (mode) => set({ searchMode: mode }),

  queryHistory: SEED_ENTRIES,
  activeHistoryId: null,
  setActiveHistoryId: (id) => set({ activeHistoryId: id }),

  submitQuery: async (query) => {
    if (!query.trim()) return;
    set({ isQuerying: true, queryResult: null, highlightedNodes: [] });

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const numSources = Math.floor(Math.random() * 3) + 3;
    const allPapers = get().papers;
    const fs = paperFilterSnapshot(get());

    let pool = [...allPapers];
    if (hasActiveFilters(fs)) {
      const filteredPool = allPapers.filter((p) => paperMatchesFilters(p, fs));
      if (filteredPool.length > 0) {
        pool = [...filteredPool, ...filteredPool, ...allPapers];
      }
    }

    const shuffled = pool.sort(() => 0.5 - Math.random());
    const sources = Array.from(new Set(shuffled.map((p) => p.id))).slice(0, numSources);

    const mockResult: QueryResult = {
      answer: `Based on the literature, cryobiology has seen significant advancements in vitrification and ice recrystallization inhibition. Recent studies highlight the efficacy of novel cryoprotectants in minimizing cellular damage during the cooling phase. Specifically, research into ${query} suggests promising avenues for large-scale organ preservation.`,
      insights: {
        agreements: [
          'Vitrification is superior to slow freezing for complex tissues.',
          'Toxicity of CPAs remains a primary limiting factor.',
        ],
        contradictions: [
          'Optimal warming rates vary significantly between cardiac and neural tissues.',
          'The role of ice binding proteins is debated in mammalian systems.',
        ],
        trends: [
          'Shift towards nanoparticle-mediated rapid warming.',
          'Increased focus on non-toxic, sugar-based cryoprotectants.',
        ],
      },
      sources,
      confidence: Math.random() > 0.5 ? 'High' : 'Medium',
    };

    const newEntry: QueryHistoryEntry = {
      id: `q-${Date.now()}`,
      query,
      result: mockResult,
      timestamp: Date.now(),
    };

    set((state) => ({
      isQuerying: false,
      queryResult: mockResult,
      highlightedNodes: sources,
      queryHistory: [newEntry, ...state.queryHistory],
      activeHistoryId: newEntry.id,
      isResultsPanelOpen: true,
    }));
  },
}));
