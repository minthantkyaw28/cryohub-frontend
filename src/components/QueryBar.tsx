import React, { useState } from 'react';
import { Sparkles, Send, X } from 'lucide-react';
import { useAppStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

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
    filters,
    organFilters,
    techniqueFilters,
    toggleFilter,
    toggleOrganFilter,
    toggleTechniqueFilter,
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

  const activeChips =
    filters.length + organFilters.length + techniqueFilters.length > 0;

  return (
    <div
      className={clsx(
        'w-full px-4 z-20',
        viewMode === 'graph'
          ? 'absolute bottom-8 left-1/2 -translate-x-1/2 max-w-2xl'
          : 'absolute top-4 left-4 max-w-xl'
      )}
    >
      <motion.form
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onSubmit={handleSubmit}
        className="relative group"
      >
        {/* Glow — only in AI mode */}
        {searchMode === 'ai' && (
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-2xl blur-md opacity-40 group-hover:opacity-60 transition duration-500" />
        )}

        <div className="relative flex items-center bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden">

          {/* Mode toggle pill */}
          <div className="flex items-center bg-slate-100 rounded-xl p-0.5 ml-3 gap-0.5 shrink-0">
            <button
              id="search-mode-keyword"
              type="button"
              onClick={() => setSearchMode('keyword')}
              className={clsx(
                'px-2.5 py-1 rounded-[9px] text-[11px] font-bold transition-all',
                searchMode === 'keyword'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
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
                searchMode === 'ai'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              )}
            >
              Ask AI
            </button>
          </div>

          {/* Sparkles icon */}
          <div className="pl-3 pr-2 py-4 flex items-center justify-center text-blue-500 shrink-0">
            <Sparkles size={20} className={isQuerying ? 'animate-pulse' : ''} />
          </div>

          {/* Text input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              searchMode === 'keyword'
                ? 'Filter by keyword…'
                : 'Ask anything about cryobiology…'
            }
            className="flex-1 bg-transparent border-none text-slate-800 placeholder-slate-400 py-4 px-2 focus:outline-none text-base font-medium"
            disabled={isQuerying}
          />

          {/* Submit button */}
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

      {/* Active filter chips */}
      <AnimatePresence>
        {activeChips && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex flex-wrap gap-1.5 mt-2 px-1"
          >
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => toggleFilter(f)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[11px] font-semibold hover:bg-blue-500/25 transition-colors"
              >
                {f} <X size={10} />
              </button>
            ))}
            {organFilters.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => toggleOrganFilter(o)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold hover:bg-emerald-500/25 transition-colors"
              >
                {o} <X size={10} />
              </button>
            ))}
            {techniqueFilters.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => toggleTechniqueFilter(t)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-semibold hover:bg-amber-500/25 transition-colors"
              >
                {t} <X size={10} />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Graph-mode hint */}
      {viewMode === 'graph' && !queryResult && (
        <p className="text-center text-[11px] text-slate-500 mt-2 font-medium tracking-wide pointer-events-none">
          Click a node to explore · Switch to{' '}
          <span className="text-slate-400">Ask AI</span> for synthesis
        </p>
      )}

      {/* AI querying indicator */}
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
