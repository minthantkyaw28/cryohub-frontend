import React, { useState } from 'react';
import { SlidersHorizontal, Sparkles, Search, ArrowRight, X, BrainCircuit } from 'lucide-react';
import { clsx } from 'clsx';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore, paperFilterSnapshot } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { countActiveFilterSelections } from '../utils/paperFilters';

const FilterChips: React.FC = () => {
  const snap = useAppStore(useShallow(paperFilterSnapshot));
  const {
    researchTypeFilters,
    toggleResearchTypeFilter,
    fundingFilters,
    toggleFundingFilter,
    techniqueFilters,
    toggleTechniqueFilter,
    modelLeafFilters,
    toggleModelLeafFilter,
    outcomeFilters,
    toggleOutcomeFilter,
    publicationFilters,
    togglePublicationFilter,
    openAccess,
    setOpenAccess,
    journalQuery,
    setJournalQuery,
    authorInstitutionQuery,
    setAuthorInstitutionQuery,
    countryQuery,
    setCountryQuery,
    cpaTypeQuery,
    setCpaTypeQuery,
  } = useAppStore(
    useShallow((s) => ({
      researchTypeFilters: s.researchTypeFilters,
      toggleResearchTypeFilter: s.toggleResearchTypeFilter,
      fundingFilters: s.fundingFilters,
      toggleFundingFilter: s.toggleFundingFilter,
      techniqueFilters: s.techniqueFilters,
      toggleTechniqueFilter: s.toggleTechniqueFilter,
      modelLeafFilters: s.modelLeafFilters,
      toggleModelLeafFilter: s.toggleModelLeafFilter,
      outcomeFilters: s.outcomeFilters,
      toggleOutcomeFilter: s.toggleOutcomeFilter,
      publicationFilters: s.publicationFilters,
      togglePublicationFilter: s.togglePublicationFilter,
      openAccess: s.openAccess,
      setOpenAccess: s.setOpenAccess,
      journalQuery: s.journalQuery,
      setJournalQuery: s.setJournalQuery,
      authorInstitutionQuery: s.authorInstitutionQuery,
      setAuthorInstitutionQuery: s.setAuthorInstitutionQuery,
      countryQuery: s.countryQuery,
      setCountryQuery: s.setCountryQuery,
      cpaTypeQuery: s.cpaTypeQuery,
      setCpaTypeQuery: s.setCpaTypeQuery,
    }))
  );

  const n = countActiveFilterSelections(snap);
  if (n === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5 px-5 pb-2">
      <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider shrink-0">Active:</span>
      {researchTypeFilters.map((f) => (
        <button
          key={f}
          type="button"
          onClick={() => toggleResearchTypeFilter(f)}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300 text-[11px] font-semibold hover:bg-sky-500/30 transition-colors"
        >
          {f} <X size={9} />
        </button>
      ))}
      {fundingFilters.map((f) => (
        <button
          key={f}
          type="button"
          onClick={() => toggleFundingFilter(f)}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-[11px] font-semibold hover:bg-teal-500/30 transition-colors"
        >
          {f} <X size={9} />
        </button>
      ))}
      {techniqueFilters.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => toggleTechniqueFilter(t)}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[11px] font-semibold hover:bg-cyan-500/30 transition-colors"
        >
          {t} <X size={9} />
        </button>
      ))}
      {outcomeFilters.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => toggleOutcomeFilter(o)}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold hover:bg-emerald-500/30 transition-colors"
        >
          {o} <X size={9} />
        </button>
      ))}
      {modelLeafFilters.map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => toggleModelLeafFilter(m)}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-300 text-[11px] font-semibold hover:bg-fuchsia-500/30 transition-colors"
        >
          {m} <X size={9} />
        </button>
      ))}
      {publicationFilters.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => togglePublicationFilter(p)}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/40 text-violet-300 text-[11px] font-semibold hover:bg-violet-500/30 transition-colors"
        >
          {p} <X size={9} />
        </button>
      ))}
      {openAccess !== 'any' && (
        <button
          type="button"
          onClick={() => setOpenAccess('any')}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-500/20 border border-slate-500/40 text-slate-300 text-[11px] font-semibold hover:bg-slate-500/30 transition-colors"
        >
          OA: {openAccess === 'yes' ? 'Yes' : 'No'} <X size={9} />
        </button>
      )}
      {journalQuery.trim() && (
        <button
          type="button"
          onClick={() => setJournalQuery('')}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/35 text-blue-300 text-[11px] font-semibold max-w-[200px] truncate"
        >
          Journal: {journalQuery} <X size={9} />
        </button>
      )}
      {authorInstitutionQuery.trim() && (
        <button
          type="button"
          onClick={() => setAuthorInstitutionQuery('')}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/35 text-blue-300 text-[11px] font-semibold max-w-[200px] truncate"
        >
          Author: {authorInstitutionQuery} <X size={9} />
        </button>
      )}
      {countryQuery.trim() && (
        <button
          type="button"
          onClick={() => setCountryQuery('')}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/35 text-blue-300 text-[11px] font-semibold max-w-[200px] truncate"
        >
          Region: {countryQuery} <X size={9} />
        </button>
      )}
      {cpaTypeQuery.trim() && (
        <button
          type="button"
          onClick={() => setCpaTypeQuery('')}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/35 text-cyan-300 text-[11px] font-semibold max-w-[200px] truncate"
        >
          CPA: {cpaTypeQuery} <X size={9} />
        </button>
      )}
    </div>
  );
};

const UnifiedSearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const { searchMode, setSearchMode, submitQuery, setSearchQuery, isQuerying } = useAppStore();

  const isAI = searchMode === 'ai';

  const switchMode = (mode: 'keyword' | 'ai') => {
    setSearchMode(mode);
    setQuery('');
    setSearchQuery('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isQuerying) return;
    if (isAI) {
      submitQuery(query);
    } else {
      setSearchQuery(query);
    }
    setQuery('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (!isAI) setSearchQuery(e.target.value);
  };

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className={clsx(
          'flex items-center h-9 rounded-xl border overflow-hidden transition-all duration-300',
          isAI
            ? 'bg-white/[0.06] border-blue-500/30 shadow-[0_0_16px_rgba(59,130,246,0.12)]'
            : 'bg-white/[0.06] border-slate-700/60'
        )}
      >
        <div className="flex items-center shrink-0 border-r border-white/10">
          <button
            id="mode-keyword"
            type="button"
            title="Keyword search — filter the paper list"
            onClick={() => switchMode('keyword')}
            className={clsx(
              'flex items-center justify-center w-9 h-9 transition-all',
              !isAI ? 'text-white bg-white/10' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
            )}
          >
            <Search size={15} />
          </button>
          <span className="w-px h-4 bg-white/10 shrink-0" />
          <button
            id="mode-ai"
            type="button"
            title="AI synthesis — ask the knowledge base"
            onClick={() => switchMode('ai')}
            className={clsx(
              'flex items-center justify-center w-9 h-9 transition-all',
              isAI ? 'text-blue-400 bg-blue-500/10' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
            )}
          >
            <Sparkles size={15} className={isQuerying ? 'animate-pulse' : ''} />
          </button>
        </div>

        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={isAI ? 'Ask anything about cryobiology…' : 'Filter by keyword or author…'}
          disabled={isQuerying}
          className={clsx(
            'flex-1 min-w-0 bg-transparent border-none text-slate-100 placeholder-slate-600',
            'px-3 py-0 text-sm font-medium focus:outline-none transition-all',
            'disabled:opacity-50'
          )}
        />

        <button
          type="submit"
          disabled={!query.trim() || isQuerying}
          title={isAI ? 'Run AI synthesis' : 'Apply filter'}
          className={clsx(
            'shrink-0 flex items-center justify-center w-9 h-9 border-l border-white/10 transition-all',
            'text-slate-500 hover:text-white hover:bg-white/5',
            'disabled:opacity-25 disabled:cursor-not-allowed'
          )}
        >
          <ArrowRight size={15} className={isQuerying ? 'animate-pulse text-blue-400' : ''} />
        </button>
      </form>

      <AnimatePresence>
        {isQuerying && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 pointer-events-none"
          >
            <span className="whitespace-nowrap text-[11px] text-blue-400 font-mono font-bold tracking-widest uppercase bg-[#0a0a0d]/90 backdrop-blur-md px-3 py-1 rounded-full border border-blue-500/30">
              Synthesizing literature…
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FiltersButton: React.FC = () => {
  const { isSidebarOpen, toggleSidebar } = useAppStore(
    useShallow((s) => ({ isSidebarOpen: s.isSidebarOpen, toggleSidebar: s.toggleSidebar }))
  );
  const snap = useAppStore(useShallow(paperFilterSnapshot));
  const activeCount = countActiveFilterSelections(snap);

  return (
    <button
      id="filters-toggle-btn"
      type="button"
      onClick={toggleSidebar}
      className={clsx(
        'shrink-0 flex items-center gap-1.5 px-3 h-9 rounded-xl text-xs font-semibold border transition-all',
        isSidebarOpen
          ? 'bg-blue-500/15 border-blue-500/40 text-blue-300'
          : 'bg-white/5 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-white/8'
      )}
    >
      <SlidersHorizontal size={13} />
      <span>Filters</span>
      {activeCount > 0 && (
        <span className="flex items-center justify-center min-w-[1rem] h-4 px-1 rounded-full bg-blue-500 text-[10px] text-white font-bold leading-none">
          {activeCount > 99 ? '99+' : activeCount}
        </span>
      )}
    </button>
  );
};

const AISynthesisToggle: React.FC = () => {
  const { isResultsPanelOpen, toggleResultsPanel, searchMode } = useAppStore();

  if (searchMode !== 'ai') return null;

  return (
    <button
      id="ai-synthesis-toggle"
      type="button"
      title={isResultsPanelOpen ? 'Hide AI Synthesis' : 'Show AI Synthesis'}
      onClick={toggleResultsPanel}
      className={clsx(
        'shrink-0 flex items-center justify-center w-9 h-9 rounded-xl border transition-all',
        isResultsPanelOpen
          ? 'bg-blue-500/15 border-blue-500/40 text-blue-400'
          : 'bg-white/5 border-slate-700/60 text-slate-500 hover:text-blue-400 hover:border-blue-500/30'
      )}
    >
      <BrainCircuit size={15} />
    </button>
  );
};

export const Topbar: React.FC = () => {
  const snap = useAppStore(useShallow(paperFilterSnapshot));
  const activeCount = countActiveFilterSelections(snap);

  return (
    <header className="shrink-0 w-full bg-[#0a0a0d]/95 backdrop-blur-xl border-b border-slate-800/60 z-30 relative">
      <div className="flex items-center gap-3 px-5 h-16">
        <div className="flex items-center gap-2.5 shrink-0 mr-2">
          <span className="text-blue-400 text-2xl leading-none select-none">❄</span>
          <span className="text-xl font-display font-bold text-slate-100 tracking-tight">CryoHUB</span>
        </div>

        <div className="flex-1" />

        <FiltersButton />

        <div className="w-full max-w-lg">
          <UnifiedSearchBar />
        </div>

        <div className="flex-1" />

        <AISynthesisToggle />
      </div>

      {activeCount > 0 && <FilterChips />}
    </header>
  );
};
