export type ResearchType = 'Basic' | 'Preclinical' | 'Clinical' | 'Computational';

export type FundingSource = 'Industry' | 'Academia' | 'Government';

export type ModelTypeMain = 'Cells' | 'Tissues & 3D Models' | 'Whole Organ Models' | 'Model Organisms';

export interface PaperExperimental {
  coolingRateCPerMin: number;
  warmingRateCPerMin: number;
  storageDurationDays: number;
  storageTempC: number;
}

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  keyFindings: string[];
  citations: string[];
  position: [number, number, number];

  researchType: ResearchType;
  journalName: string;
  journalImpactFactor: number;
  openAccess: boolean;
  authorInstitution: string;
  countryRegion: string;
  fundingSource: FundingSource;
  citationCount: number;

  publicationType: string;
  modelTypeMain: ModelTypeMain;
  modelTypeSub: string;
  modelParam: string;

  techniqueTags: string[];
  cpaType: string;
  cpaConcentrationPercent: number;

  outcomes: string[];
  experimental: PaperExperimental;
}

export interface QueryResult {
  answer: string;
  insights: {
    agreements: string[];
    contradictions: string[];
    trends: string[];
  };
  sources: string[];
  confidence: 'High' | 'Medium' | 'Low';
}

/** Zustand slice shape for filter matching (subset of AppState) */
export interface PaperFilterState {
  searchQuery: string;
  researchTypeFilters: ResearchType[];
  fundingFilters: FundingSource[];
  openAccess: 'any' | 'yes' | 'no';
  journalQuery: string;
  authorInstitutionQuery: string;
  countryQuery: string;
  cpaTypeQuery: string;
  impactFactorRange: [number, number];
  citationCountRange: [number, number];
  cpaConcRange: [number, number];
  coolingRateRange: [number, number];
  warmingRateRange: [number, number];
  storageDaysRange: [number, number];
  storageTempRange: [number, number];
  yearRange: [number, number];
  techniqueFilters: string[];
  outcomeFilters: string[];
  modelLeafFilters: string[];
  publicationFilters: string[];
}
