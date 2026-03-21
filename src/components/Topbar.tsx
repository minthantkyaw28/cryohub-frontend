import React, { useState } from 'react';
import { SlidersHorizontal, Sparkles, Search, ArrowRight, X, BrainCircuit } from 'lucide-react';
import { clsx } from 'clsx';
import { useAppStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Active filter chips ──────────────────────────────────────────────────────
const FilterChips: React.FC = () => {
  const {
    filters, toggleFilter,
    organFilters, toggleOrganFilter,
    techniqueFilters, toggleTechniqueFilter,
  } = useAppStore();

  const total = filters.length + organFilters.length + techniqueFilters.length;
  if (total === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5 px-5 pb-2">
      <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider shrink-0">Active:</span>
      {filters.map((f) => (
        <button key={f} type="button" onClick={() => toggleFilter(f)}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-[11px] font-semibold hover:bg-blue-500/30 transition-colors">
          {f} <X size={9} />
        </button>
      ))}
      {organFilters.map((o) => (
        <button key={o} type="button" onClick={() => toggleOrganFilter(o)}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold hover:bg-emerald-500/30 transition-colors">
          {o} <X size={9} />
        </button>
      ))}
      {techniqueFilters.map((t) => (
        <button key={t} type="button" onClick={() => toggleTechniqueFilter(t)}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-semibold hover:bg-amber-500/30 transition-colors">
          {t} <X size={9} />
        </button>
      ))}
    </div>
  );
};

// ─── Unified search bar ───────────────────────────────────────────────────────
const UnifiedSearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const {
    searchMode, setSearchMode,
    submitQuery, setSearchQuery,
    isQuerying,
  } = useAppStore();

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
        {/* Mode icon buttons */}
        <div className="flex items-center shrink-0 border-r border-white/10">
          <button
            id="mode-keyword"
            type="button"
            title="Keyword search — filter the paper list"
            onClick={() => switchMode('keyword')}
            className={clsx(
              'flex items-center justify-center w-9 h-9 transition-all',
              !isAI
                ? 'text-white bg-white/10'
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
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
              isAI
                ? 'text-blue-400 bg-blue-500/10'
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
            )}
          >
            <Sparkles size={15} className={isQuerying ? 'animate-pulse' : ''} />
          </button>
        </div>

        {/* Text input */}
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

        {/* Send icon */}
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

      {/* Querying status pill */}
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

// ─── Filters button ───────────────────────────────────────────────────────────
const FiltersButton: React.FC = () => {
  const {
    isSidebarOpen, toggleSidebar,
    filters, organFilters, techniqueFilters, publicationFilters,
  } = useAppStore();

  const activeCount =
    filters.length + organFilters.length + techniqueFilters.length + publicationFilters.length;

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
        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-[10px] text-white font-bold leading-none">
          {activeCount}
        </span>
      )}
    </button>
  );
};

// ─── AI Synthesis panel toggle — subtle icon button, right edge ───────────────
const AISynthesisToggle: React.FC = () => {
  const { queryResult, isResultsPanelOpen, toggleResultsPanel, searchMode } = useAppStore();

  // Only visible in AI mode when a result exists
  if (searchMode !== 'ai' || !queryResult) return null;

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

// ─── Topbar ───────────────────────────────────────────────────────────────────
export const Topbar: React.FC = () => {
  const { filters, organFilters, techniqueFilters } = useAppStore();
  const hasChips = filters.length + organFilters.length + techniqueFilters.length > 0;

  return (
    <header className="shrink-0 w-full bg-[#0a0a0d]/95 backdrop-blur-xl border-b border-slate-800/60 z-30 relative">
      {/* Main row — taller at h-16 */}
      <div className="flex items-center gap-3 px-5 h-16">

        {/* Logo — bigger */}
        <div className="flex items-center gap-2.5 shrink-0 mr-2">
          <span className="text-blue-400 text-2xl leading-none select-none">❄</span>
          <span className="text-xl font-display font-bold text-slate-100 tracking-tight">
            CryoHUB
          </span>
        </div>

        {/* Left spacer — pushes bar to center */}
        <div className="flex-1" />

        {/* Filters button */}
        <FiltersButton />

        {/* Unified search bar */}
        <div className="w-full max-w-lg">
          <UnifiedSearchBar />
        </div>

        {/* Right spacer */}
        <div className="flex-1" />

        {/* AI Synthesis toggle — appears only after a query */}
        <AISynthesisToggle />

      </div>

      {/* Active filter chips row */}
      {hasChips && <FilterChips />}
    </header>
  );
};
