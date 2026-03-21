import React, { useState } from 'react';
import { Sparkles, Send, X } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore, paperFilterSnapshot } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { countActiveFilterSelections } from '../utils/paperFilters';

export const QueryBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const {
    submitQuery,
    isQuerying,
    queryResult,
    searchMode,
    setSearchMode,
    setSearchQuery,
    viewMode,
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
  } = useAppStore(
    useShallow((s) => ({
      submitQuery: s.submitQuery,
      isQuerying: s.isQuerying,
      queryResult: s.queryResult,
      searchMode: s.searchMode,
      setSearchMode: s.setSearchMode,
      setSearchQuery: s.setSearchQuery,
      viewMode: s.viewMode,
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
    }))
  );

  const snap = useAppStore(useShallow(paperFilterSnapshot));
  const activeChips = countActiveFilterSelections(snap) > 0;

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

  return (
    <div
      className={clsx(
        'w-full px-4 z-20',
        viewMode === 'graph' ? 'absolute bottom-8 left-1/2 -translate-x-1/2 max-w-2xl' : 'absolute top-4 left-4 max-w-xl'
      )}
    >
      <motion.form
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onSubmit={handleSubmit}
        className="relative group"
      >
        {searchMode === 'ai' && (
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-2xl blur-md opacity-40 group-hover:opacity-60 transition duration-500" />
        )}

        <div className="relative flex items-center bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="flex items-center bg-slate-100 rounded-xl p-0.5 ml-3 gap-0.5 shrink-0">
            <button
              id="search-mode-keyword"
              type="button"
              onClick={() => setSearchMode('keyword')}
              className={clsx(
                'px-2.5 py-1 rounded-[9px] text-[11px] font-bold transition-all',
                searchMode === 'keyword' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              )}
            >
              Keyword
            </button>
            <button
              id="search-mode-ai"
              type="button"
              onClick={() => setSearchMode('ai')}
              className={clsx(
                'px-2.5 py-1 rounded-[9px] text-[11px] font-bold transition-all',
                searchMode === 'ai' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              )}
            >
              Ask AI
            </button>
          </div>

          <div className="pl-3 pr-2 py-4 flex items-center justify-center text-blue-500 shrink-0">
            <Sparkles size={20} className={isQuerying ? 'animate-pulse' : ''} />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchMode === 'keyword' ? 'Filter by keyword…' : 'Ask anything about cryobiology…'}
            className="flex-1 bg-transparent border-none text-slate-800 placeholder-slate-400 py-4 px-2 focus:outline-none text-base font-medium"
            disabled={isQuerying}
          />

          <button
            type="submit"
            disabled={!query.trim() || isQuerying}
            className="p-4 mr-1 text-slate-400 hover:text-blue-500 disabled:opacity-50 disabled:hover:text-slate-400 transition-colors"
          >
            <div className="bg-slate-100 hover:bg-blue-50 p-2 rounded-xl transition-colors">
              <Send size={18} className={isQuerying ? 'animate-bounce text-blue-500' : ''} />
            </div>
          </button>
        </div>
      </motion.form>

      <AnimatePresence>
        {activeChips && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex flex-wrap gap-1.5 mt-2 px-1"
          >
            {researchTypeFilters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => toggleResearchTypeFilter(f)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-[11px] font-semibold hover:bg-sky-500/25 transition-colors"
              >
                {f} <X size={10} />
              </button>
            ))}
            {fundingFilters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => toggleFundingFilter(f)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-[11px] font-semibold hover:bg-teal-500/25 transition-colors"
              >
                {f} <X size={10} />
              </button>
            ))}
            {techniqueFilters.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => toggleTechniqueFilter(t)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold hover:bg-cyan-500/25 transition-colors"
              >
                {t} <X size={10} />
              </button>
            ))}
            {outcomeFilters.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => toggleOutcomeFilter(o)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold hover:bg-emerald-500/25 transition-colors"
              >
                {o} <X size={10} />
              </button>
            ))}
            {modelLeafFilters.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => toggleModelLeafFilter(m)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-fuchsia-500/15 border border-fuchsia-500/30 text-fuchsia-300 text-[11px] font-semibold hover:bg-fuchsia-500/25 transition-colors"
              >
                {m} <X size={10} />
              </button>
            ))}
            {publicationFilters.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => togglePublicationFilter(p)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-[11px] font-semibold hover:bg-violet-500/25 transition-colors"
              >
                {p} <X size={10} />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {viewMode === 'graph' && !queryResult && (
        <p className="text-center text-[11px] text-slate-500 mt-2 font-medium tracking-wide pointer-events-none">
          Click a node to explore · Switch to <span className="text-slate-400">Ask AI</span> for synthesis
        </p>
      )}

      <AnimatePresence>
        {isQuerying && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-blue-600 font-mono font-bold tracking-widest uppercase bg-white/80 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-blue-100 whitespace-nowrap"
          >
            Synthesizing literature…
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
