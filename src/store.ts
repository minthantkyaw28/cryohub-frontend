import { create } from 'zustand';
import type { Paper, QueryResult, ResearchType, FundingSource, PaperFilterState } from './types';
import { DEFAULT_FILTER_RANGES, hasActiveFilters, paperMatchesFilters } from './utils/paperFilters';

export interface QueryHistoryEntry {
  id: string;
  query: string;
  result: QueryResult;
  timestamp: number;
}

export interface AppState {
  initStore: () => Promise<void>;
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
  highlightedNodes: number[];

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
  initStore: async () => {
    try {
      const res = await fetch('http://localhost:8000/filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}'
      });
      const data = await res.json();
      const mapped = data.papers.map((p: any) => {
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 15 + Math.random() * 25;
        return {
          ...p,
          position: [
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            (Math.random() - 0.5) * 5
          ]
        };
      });
      set({ papers: mapped });
    } catch (e) {
      console.error('Failed to initialize internal SQLite mapped graph store', e);
    }
  },
  papers: [],
  searchQuery: '',
  setSearchQuery: async (query) => {
    set({ searchQuery: query });
    try {
      const res = await fetch('http://localhost:8000/filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword_search: query || null })
      });
      const data = await res.json();
      const ids = data.papers.map((p: any) => p.id);
      set({ highlightedNodes: ids });
    } catch (e) {
      console.error('Keyword trace failed', e);
    }
  },

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
          highlightedNodes: state.queryResult ? state.queryResult.sources.map(p => p.id) : [],
        };
      }
      const connected = [paper.id, ...paper.internal_citations];
      state.papers.forEach((p) => {
        if (p.internal_citations && p.internal_citations.includes(paper.id)) {
          connected.push(p.id);
        }
      });
      return { selectedPaper: paper, highlightedNodes: Array.from(new Set(connected)) };
    }),
  hoveredPaper: null,
  setHoveredPaper: (paper) => set({ hoveredPaper: paper }),
  queryResult: null,
  isQuerying: false,
  highlightedNodes: [],

  viewMode: 'graph',
  setViewMode: (mode) => set({ viewMode: mode }),
  isSidebarOpen: false,
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  isResultsPanelOpen: true,
  toggleResultsPanel: () => set((state) => ({ isResultsPanelOpen: !state.isResultsPanelOpen })),

  searchMode: 'ai',
  setSearchMode: (mode) => set({ searchMode: mode }),

  queryHistory: [],
  activeHistoryId: null,
  setActiveHistoryId: (id) => set({ activeHistoryId: id }),

  submitQuery: async (query) => {
    if (!query.trim()) return;
    set({ isQuerying: true, queryResult: null, highlightedNodes: [] });

    try {
      const res = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query })
      });
      const data = await res.json();
      
      const newEntry: QueryHistoryEntry = {
        id: `q-${Date.now()}`,
        query,
        result: {
          data: data.data,
          sources: data.sources
        },
        timestamp: Date.now(),
      };

      const sourceIds = data.sources.map((s: any) => s.id);

      set((state) => ({
        isQuerying: false,
        queryResult: newEntry.result,
        highlightedNodes: sourceIds, 
        queryHistory: [newEntry, ...state.queryHistory],
        activeHistoryId: newEntry.id,
        isResultsPanelOpen: true,
      }));
    } catch (e) {
      console.error('Failed to fetch AI synthesis', e);
      set({ isQuerying: false });
    }
  },
}));
