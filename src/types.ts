export type ResearchType = 'Basic' | 'Preclinical' | 'Clinical' | 'Computational';

export type FundingSource = 'Industry' | 'Academia' | 'Government';

export type ModelTypeMain = 'Cells' | 'Tissues & 3D Models' | 'Whole Organ Models' | 'Model Organisms';

export interface Paper {
  id: number;
  title: string;
  abstract: string;
  authors: string[];
  publication_year: number;
  journal: string;
  open_access: boolean;
  url_or_doi: string;

  publication_type: string[];
  model_type: string[];
  research_type: string[];
  journal_impact_factor: number | null;
  author_institution: string[];
  country_region: string[];
  funding_source: string[];
  citations: number | null;
  techniques: string[];

  cpa_type: string[];
  cpa_concentration_min: number | null;
  cpa_concentration_max: number | null;
  delivery_method: string[];
  preservation_method: string[];
  outcomes_metrics: string[];
  cooling_rate: number | null;
  warming_rate: number | null;
  storage_duration: number | null;
  storage_temperature: number | null;

  extracted_references: string[];
  internal_citations: number[];

  // Purely procedural frontend layout variables
  position: [number, number, number];
}

export interface QueryResult {
  data: {
    summary: string;
    key_findings: string[];
    limitations: string[];
    source_titles: string[];
  };
  sources: Paper[];
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
