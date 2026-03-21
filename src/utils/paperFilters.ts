import type { Paper, PaperFilterState } from '../types';

/** Must match initial values in `store.ts` for “any filter active” detection */
export const DEFAULT_FILTER_RANGES = {
  impactFactor: [0, 40] as [number, number],
  citationCount: [0, 800] as [number, number],
  cpaConc: [0, 45] as [number, number],
  coolingRate: [0.1, 120] as [number, number],
  warmingRate: [0.5, 200] as [number, number],
  storageDays: [1, 3650] as [number, number],
  storageTemp: [-200, 4] as [number, number],
  year: [1990, 2026] as [number, number],
};

function qMatch(query: string, value: string): boolean {
  if (!query.trim()) return true;
  return value.toLowerCase().includes(query.trim().toLowerCase());
}

export function paperMatchesFilters(paper: Paper, s: PaperFilterState): boolean {
  const q = s.searchQuery.toLowerCase();
  const matchesSearch =
    !q ||
    paper.title.toLowerCase().includes(q) ||
    paper.authors.some((a) => a.toLowerCase().includes(q)) ||
    paper.journalName.toLowerCase().includes(q);

  const matchesResearch =
    s.researchTypeFilters.length === 0 || s.researchTypeFilters.includes(paper.researchType);

  const matchesFunding =
    s.fundingFilters.length === 0 || s.fundingFilters.includes(paper.fundingSource);

  const matchesOA =
    s.openAccess === 'any' ||
    (s.openAccess === 'yes' && paper.openAccess) ||
    (s.openAccess === 'no' && !paper.openAccess);

  const matchesJournal = qMatch(s.journalQuery, paper.journalName);
  const matchesAuthor =
    !s.authorInstitutionQuery.trim() ||
    paper.authors.some((a) => qMatch(s.authorInstitutionQuery, a)) ||
    qMatch(s.authorInstitutionQuery, paper.authorInstitution);
  const matchesCountry = qMatch(s.countryQuery, paper.countryRegion);
  const matchesCpaType = qMatch(s.cpaTypeQuery, paper.cpaType);

  const matchesIF =
    paper.journalImpactFactor >= s.impactFactorRange[0] &&
    paper.journalImpactFactor <= s.impactFactorRange[1];

  const matchesCites =
    paper.citationCount >= s.citationCountRange[0] &&
    paper.citationCount <= s.citationCountRange[1];

  const matchesCpaConc =
    paper.cpaConcentrationPercent >= s.cpaConcRange[0] &&
    paper.cpaConcentrationPercent <= s.cpaConcRange[1];

  const ex = paper.experimental;
  const matchesCool =
    ex.coolingRateCPerMin >= s.coolingRateRange[0] &&
    ex.coolingRateCPerMin <= s.coolingRateRange[1];
  const matchesWarm =
    ex.warmingRateCPerMin >= s.warmingRateRange[0] &&
    ex.warmingRateCPerMin <= s.warmingRateRange[1];
  const matchesStorage =
    ex.storageDurationDays >= s.storageDaysRange[0] &&
    ex.storageDurationDays <= s.storageDaysRange[1];
  const matchesTemp =
    ex.storageTempC >= s.storageTempRange[0] && ex.storageTempC <= s.storageTempRange[1];

  const matchesYear = paper.year >= s.yearRange[0] && paper.year <= s.yearRange[1];

  const matchesTech =
    s.techniqueFilters.length === 0 ||
    s.techniqueFilters.some((t) => paper.techniqueTags.includes(t));

  const matchesOutcomes =
    s.outcomeFilters.length === 0 || s.outcomeFilters.some((o) => paper.outcomes.includes(o));

  const matchesModel =
    s.modelLeafFilters.length === 0 || s.modelLeafFilters.includes(paper.modelParam);

  const matchesPub =
    s.publicationFilters.length === 0 || s.publicationFilters.includes(paper.publicationType);

  return (
    matchesSearch &&
    matchesResearch &&
    matchesFunding &&
    matchesOA &&
    matchesJournal &&
    matchesAuthor &&
    matchesCountry &&
    matchesCpaType &&
    matchesIF &&
    matchesCites &&
    matchesCpaConc &&
    matchesCool &&
    matchesWarm &&
    matchesStorage &&
    matchesTemp &&
    matchesYear &&
    matchesTech &&
    matchesOutcomes &&
    matchesModel &&
    matchesPub
  );
}

export function hasActiveFilters(s: PaperFilterState): boolean {
  const d = DEFAULT_FILTER_RANGES;
  return (
    s.researchTypeFilters.length > 0 ||
    s.fundingFilters.length > 0 ||
    s.openAccess !== 'any' ||
    !!s.journalQuery.trim() ||
    !!s.authorInstitutionQuery.trim() ||
    !!s.countryQuery.trim() ||
    !!s.cpaTypeQuery.trim() ||
    s.impactFactorRange[0] > d.impactFactor[0] ||
    s.impactFactorRange[1] < d.impactFactor[1] ||
    s.citationCountRange[0] > d.citationCount[0] ||
    s.citationCountRange[1] < d.citationCount[1] ||
    s.cpaConcRange[0] > d.cpaConc[0] ||
    s.cpaConcRange[1] < d.cpaConc[1] ||
    s.coolingRateRange[0] > d.coolingRate[0] ||
    s.coolingRateRange[1] < d.coolingRate[1] ||
    s.warmingRateRange[0] > d.warmingRate[0] ||
    s.warmingRateRange[1] < d.warmingRate[1] ||
    s.storageDaysRange[0] > d.storageDays[0] ||
    s.storageDaysRange[1] < d.storageDays[1] ||
    s.storageTempRange[0] > d.storageTemp[0] ||
    s.storageTempRange[1] < d.storageTemp[1] ||
    s.yearRange[0] > d.year[0] ||
    s.yearRange[1] < d.year[1] ||
    s.techniqueFilters.length > 0 ||
    s.outcomeFilters.length > 0 ||
    s.modelLeafFilters.length > 0 ||
    s.publicationFilters.length > 0
  );
}

/** Badge count for filter toolbar (discrete selections + narrowed ranges + text queries). */
export function countActiveFilterSelections(s: PaperFilterState): number {
  let n =
    s.researchTypeFilters.length +
    s.fundingFilters.length +
    s.publicationFilters.length +
    s.techniqueFilters.length +
    s.outcomeFilters.length +
    s.modelLeafFilters.length;
  if (s.openAccess !== 'any') n++;
  if (s.journalQuery.trim()) n++;
  if (s.authorInstitutionQuery.trim()) n++;
  if (s.countryQuery.trim()) n++;
  if (s.cpaTypeQuery.trim()) n++;
  const d = DEFAULT_FILTER_RANGES;
  if (s.impactFactorRange[0] > d.impactFactor[0] || s.impactFactorRange[1] < d.impactFactor[1]) n++;
  if (s.citationCountRange[0] > d.citationCount[0] || s.citationCountRange[1] < d.citationCount[1]) n++;
  if (s.cpaConcRange[0] > d.cpaConc[0] || s.cpaConcRange[1] < d.cpaConc[1]) n++;
  if (s.coolingRateRange[0] > d.coolingRate[0] || s.coolingRateRange[1] < d.coolingRate[1]) n++;
  if (s.warmingRateRange[0] > d.warmingRate[0] || s.warmingRateRange[1] < d.warmingRate[1]) n++;
  if (s.storageDaysRange[0] > d.storageDays[0] || s.storageDaysRange[1] < d.storageDays[1]) n++;
  if (s.storageTempRange[0] > d.storageTemp[0] || s.storageTempRange[1] < d.storageTemp[1]) n++;
  if (s.yearRange[0] > d.year[0] || s.yearRange[1] < d.year[1]) n++;
  return n;
}
