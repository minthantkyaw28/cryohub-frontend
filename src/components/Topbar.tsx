import React, { useState } from 'react';
import { SlidersHorizontal, Sparkles, Search, Send, X } from 'lucide-react';
import { clsx } from 'clsx';
import { useAppStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Filter chips row ───────────────────────────────────────────────────────
const FilterChips: React.FC = () => {
  const {
    filters, toggleFilter,
    organFilters, toggleOrganFilter,
    techniqueFilters, toggleTechniqueFilter,
  } = useAppStore();

  const hasChips = filters.length + organFilters.length + techniqueFilters.length > 0;
  if (!hasChips) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {filters.map((f) => (
        <button
          key={f}
          type="button"
          onClick={() => toggleFilter(f)}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-[11px] font-semibold hover:bg-blue-500/30 transition-colors"
        >
          {f} <X size={9} />
        </button>
      ))}
      {organFilters.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => toggleOrganFilter(o)}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold hover:bg-emerald-500/30 transition-colors"
        >
          {o} <X size={9} />
        </button>
      ))}
      {techniqueFilters.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => toggleTechniqueFilter(t)}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-semibold hover:bg-amber-500/30 transition-colors"
        >
          {t} <X size={9} />
        </button>
      ))}
    </div>
  );
};

// ─── Unified search bar ─────────────────────────────────────────────────────
const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const {
    searchMode, setSearchMode,
    submitQuery, setSearchQuery,
    isQuerying,
  } = useAppStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isQuerying) return;
    if (searchMode === 'keyword') {
      setSearchQuery(query);
      setQuery('');
    } else {
      submitQuery(query);
      setQuery('');
    }
  };

  const switchMode = (mode: 'keyword' | 'ai') => {
    setSearchMode(mode);
    setQuery('');
    setSearchQuery(''); // clear any existing keyword filter when switching mode
  };

  const isAI = searchMode === 'ai';

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-0 flex-1 min-w-0">

      {/* Mode toggle — pill at left edge of bar */}
      <div className="flex items-center shrink-0 bg-white/10 rounded-l-xl border border-r-0 border-white/20 overflow-hidden">
        <button
          id="mode-keyword"
          type="button"
          onClick={() => switchMode('keyword')}
          className={clsx(
            'flex items-center gap-1.5 px-3 py-2 text-xs font-bold transition-all whitespace-nowrap',
            !isAI
              ? 'bg-white text-slate-900'
              : 'text-slate-400 hover:text-slate-200'
          )}
        >
          <Search size={12} />
          Keyword
        </button>
        <button
          id="mode-ai"
          type="button"
          onClick={() => switchMode('ai')}
          className={clsx(
            'flex items-center gap-1.5 px-3 py-2 text-xs font-bold transition-all whitespace-nowrap',
            isAI
              ? 'bg-white text-slate-900'
              : 'text-slate-400 hover:text-slate-200'
          )}
        >
          <Sparkles size={12} className={isQuerying ? 'animate-pulse' : ''} />
          Ask AI
        </button>
      </div>

      {/* Text input */}
      <div className="flex-1 min-w-0 relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            // keyword mode: filter live as you type
            if (searchMode === 'keyword') {
              setSearchQuery(e.target.value);
            }
          }}
          placeholder={
            isAI
              ? 'Ask anything about cryobiology…'
              : 'Filter papers by keyword, author…'
          }
          disabled={isQuerying}
          className={clsx(
            'w-full bg-white/10 border-y border-white/20 text-slate-100 placeholder-slate-500',
            'py-2 px-4 text-sm font-medium focus:outline-none focus:bg-white/15 focus:placeholder-slate-400 transition-all',
            'disabled:opacity-60'
          )}
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={!query.trim() || isQuerying}
        className={clsx(
          'shrink-0 flex items-center justify-center px-3 py-2 rounded-r-xl border border-l-0 border-white/20',
          'bg-white/10 text-slate-400 hover:text-white hover:bg-white/20 transition-all',
          'disabled:opacity-40 disabled:cursor-not-allowed'
        )}
      >
        <Send size={14} className={isQuerying ? 'animate-bounce text-blue-400' : ''} />
      </button>
    </form>
  );
};

// ─── Filters button ──────────────────────────────────────────────────────────
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
        'shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap',
        isSidebarOpen
          ? 'bg-blue-500/15 border-blue-500/50 text-blue-300'
          : 'bg-white/5 border-white/15 text-slate-400 hover:text-slate-200 hover:bg-white/10'
      )}
    >
      <SlidersHorizontal size={13} />
      Filters
      {activeCount > 0 && (
        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-[10px] text-white font-bold leading-none">
          {activeCount}
        </span>
      )}
    </button>
  );
};

// ─── Querying status indicator ───────────────────────────────────────────────
const QueryingIndicator: React.FC = () => {
  const { isQuerying } = useAppStore();
  return (
    <AnimatePresence>
      {isQuerying && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full pt-1 z-50 pointer-events-none"
        >
          <span className="text-[11px] text-blue-400 font-mono font-bold tracking-widest uppercase bg-[#0a0a0d]/90 backdrop-blur-md px-3 py-1 rounded-full border border-blue-500/30">
            Synthesizing literature…
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── Topbar ──────────────────────────────────────────────────────────────────
export const Topbar: React.FC = () => {
  const { filters, organFilters, techniqueFilters } = useAppStore();
  const hasChips = filters.length + organFilters.length + techniqueFilters.length > 0;

  return (
    <header className="shrink-0 w-full bg-[#0a0a0d]/95 backdrop-blur-xl border-b border-slate-800/60 z-30 relative">
      {/* Main bar row */}
      <div className="flex items-center gap-4 px-5 h-[52px]">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-blue-400 text-lg leading-none">❄</span>
          <span className="text-base font-display font-bold text-slate-100 tracking-tight">
            CryoHUB
          </span>
        </div>

        {/* Mode-aware search bar — takes remaining width */}
        <div className="flex-1 min-w-0 relative">
          <SearchBar />
          <QueryingIndicator />
        </div>

        {/* Filters toggle */}
        <FiltersButton />
      </div>

      {/* Active filter chips row — appears below main bar when chips exist */}
      {hasChips && (
        <div className="px-5 pb-2 flex items-center gap-2">
          <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider shrink-0">Active:</span>
          <FilterChips />
        </div>
      )}
    </header>
  );
};
