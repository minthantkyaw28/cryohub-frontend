import { create } from 'zustand';
import { Paper, QueryResult, Category } from './types';
import { MOCK_PAPERS, IMPACT_CHAINS } from './data/mockData';

interface AppState {
  papers: Paper[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: Category[];
  toggleFilter: (category: Category) => void;
  organFilters: string[];
  toggleOrganFilter: (organ: string) => void;
  techniqueFilters: string[];
  toggleTechniqueFilter: (technique: string) => void;
  publicationFilters: string[];
  togglePublicationFilter: (pubType: string) => void;
  selectedPaper: Paper | null;
  setSelectedPaper: (paper: Paper | null) => void;
  hoveredPaper: Paper | null;
  setHoveredPaper: (paper: Paper | null) => void;
  queryResult: QueryResult | null;
  isQuerying: boolean;
  submitQuery: (query: string) => Promise<void>;
  highlightedNodes: string[]; // array of paper ids

  // View & layout state
  viewMode: 'graph' | 'list';
  setViewMode: (mode: 'graph' | 'list') => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Search bar mode
  searchMode: 'keyword' | 'ai';
  setSearchMode: (mode: 'keyword' | 'ai') => void;

  // Year range filter
  yearRange: [number, number];
  setYearRange: (range: [number, number]) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  papers: MOCK_PAPERS,
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  filters: [],
  toggleFilter: (category) => set((state) => {
    const filters = state.filters.includes(category)
      ? state.filters.filter(c => c !== category)
      : [...state.filters, category];
    return { filters };
  }),
  organFilters: [],
  toggleOrganFilter: (organ) => set((state) => {
    const organFilters = state.organFilters.includes(organ)
      ? state.organFilters.filter(o => o !== organ)
      : [...state.organFilters, organ];
    return { organFilters };
  }),
  techniqueFilters: [],
  toggleTechniqueFilter: (technique) => set((state) => {
    const techniqueFilters = state.techniqueFilters.includes(technique)
      ? state.techniqueFilters.filter(t => t !== technique)
      : [...state.techniqueFilters, technique];
    return { techniqueFilters };
  }),
  publicationFilters: [],
  togglePublicationFilter: (pubType) => set((state) => {
    const publicationFilters = state.publicationFilters.includes(pubType)
      ? state.publicationFilters.filter(p => p !== pubType)
      : [...state.publicationFilters, pubType];
    return { publicationFilters };
  }),
  selectedPaper: null,
  setSelectedPaper: (paper) => set((state) => {
    if (!paper) {
      return { 
        selectedPaper: null, 
        highlightedNodes: state.queryResult ? state.queryResult.sources : [] 
      };
    }
    // Highlight the selected paper and its citations
    const connected = [paper.id, ...paper.citations];
    // Also find papers that cite this paper
    state.papers.forEach(p => {
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

  searchMode: 'keyword',
  setSearchMode: (mode) => set({ searchMode: mode }),

  yearRange: [1990, 2026],
  setYearRange: (range) => set({ yearRange: range }),
  submitQuery: async (query) => {
    if (!query.trim()) return;
    set({ isQuerying: true, queryResult: null, highlightedNodes: [] });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock logic: pick 3-5 random papers, biased towards selected filters
    const numSources = Math.floor(Math.random() * 3) + 3;
    const allPapers = get().papers;
    const activeFilters = get().filters;
    
    let pool = [...allPapers];
    if (activeFilters.length > 0) {
      // 80% chance to pick from filtered categories if they exist
      const filteredPool = allPapers.filter(p => activeFilters.includes(p.category));
      if (filteredPool.length > 0) {
        pool = [...filteredPool, ...filteredPool, ...allPapers]; // Bias the pool
      }
    }

    const shuffled = pool.sort(() => 0.5 - Math.random());
    const sources = Array.from(new Set(shuffled.map(p => p.id))).slice(0, numSources);
    
    const mockResult: QueryResult = {
      answer: `Based on the literature, cryobiology has seen significant advancements in vitrification and ice recrystallization inhibition. Recent studies highlight the efficacy of novel cryoprotectants in minimizing cellular damage during the cooling phase. Specifically, research into ${query} suggests promising avenues for large-scale organ preservation.`,
      insights: {
        agreements: [
          'Vitrification is superior to slow freezing for complex tissues.',
          'Toxicity of CPAs remains a primary limiting factor.'
        ],
        contradictions: [
          'Optimal warming rates vary significantly between cardiac and neural tissues.',
          'The role of ice binding proteins is debated in mammalian systems.'
        ],
        trends: [
          'Shift towards nanoparticle-mediated rapid warming.',
          'Increased focus on non-toxic, sugar-based cryoprotectants.'
        ]
      },
      sources,
      confidence: Math.random() > 0.5 ? 'High' : 'Medium'
    };
    
    set({
      isQuerying: false,
      queryResult: mockResult,
      highlightedNodes: sources
    });
  }
}));
