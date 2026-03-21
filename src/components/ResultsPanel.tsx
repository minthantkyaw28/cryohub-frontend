import React from 'react';
import { useAppStore, QueryHistoryEntry } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BrainCircuit, CheckCircle2, AlertTriangle, TrendingUp,
  BookOpen, ShieldCheck, ArrowLeft, Clock, MessageSquare
} from 'lucide-react';
import { clsx } from 'clsx';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getConfidenceColor = (level: string) => {
  switch (level) {
    case 'High':   return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    case 'Medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    case 'Low':    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    default:       return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
  }
};

const timeAgo = (ts: number) => {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

// ─── View 1: History list ─────────────────────────────────────────────────────
const HistoryList: React.FC = () => {
  const { queryHistory, setActiveHistoryId } = useAppStore();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-slate-800/50 shrink-0">
        <h2 className="text-base font-display font-bold text-slate-100 flex items-center gap-2">
          <MessageSquare className="text-blue-400" size={16} />
          Your Queries
        </h2>
        <p className="text-[11px] text-slate-600 mt-0.5">Click a query to view its AI synthesis</p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {queryHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-600 text-sm gap-2 py-12">
            <BrainCircuit size={28} className="opacity-40" />
            <p>No queries yet</p>
            <p className="text-xs text-center">Ask something in the search bar above</p>
          </div>
        )}
        {queryHistory.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => setActiveHistoryId(entry.id)}
            className="w-full text-left px-3.5 py-3 rounded-xl bg-white/[0.03] border border-slate-800/60 hover:bg-white/[0.06] hover:border-slate-700 transition-all group"
          >
            <p className="text-sm font-medium text-slate-300 group-hover:text-slate-100 transition-colors leading-snug line-clamp-2">
              {entry.query}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={clsx('text-[10px] font-bold px-1.5 py-0.5 rounded border', getConfidenceColor(entry.result.confidence))}>
                {entry.result.confidence}
              </span>
              <span className="text-[10px] text-slate-600 flex items-center gap-1">
                <Clock size={9} />
                {timeAgo(entry.timestamp)}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── View 2: AI Synthesis detail ─────────────────────────────────────────────
const SynthesisDetail: React.FC<{ entry: QueryHistoryEntry }> = ({ entry }) => {
  const { papers, setSelectedPaper, setActiveHistoryId } = useAppStore();
  const sources = entry.result.sources.map(id => papers.find(p => p.id === id)).filter(Boolean);

  return (
    <div className="flex flex-col h-full">
      {/* Header with back button */}
      <div className="p-5 border-b border-slate-800/50 shrink-0 sticky top-0 bg-[#0f0f11]/90 backdrop-blur-xl z-10">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveHistoryId(null)}
              title="Back to Your Queries"
              className="flex items-center justify-center w-6 h-6 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/10 transition-all"
            >
              <ArrowLeft size={14} />
            </button>
            <h2 className="text-base font-display font-bold text-slate-100 flex items-center gap-2">
              <BrainCircuit className="text-blue-500" size={16} />
              AI Synthesis
            </h2>
          </div>
          <div className={clsx('px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1', getConfidenceColor(entry.result.confidence))}>
            <ShieldCheck size={10} />
            {entry.result.confidence}
          </div>
        </div>
        <p className="text-[11px] text-slate-500 mt-1 ml-8 line-clamp-2 italic">"{entry.query}"</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-7">

        {/* Answer */}
        <section>
          <p className="text-sm leading-relaxed text-slate-300 font-medium">
            {entry.result.answer}
          </p>
        </section>

        {/* Key Insights */}
        <section className="space-y-3">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">
            Key Insights
          </h3>
          <div className="space-y-2.5">
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 shadow-sm">
              <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                <CheckCircle2 size={12} /> Agreements
              </h4>
              <ul className="list-disc list-inside text-xs space-y-1 text-slate-400 font-medium">
                {entry.result.insights.agreements.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-3 shadow-sm">
              <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5 mb-2">
                <AlertTriangle size={12} /> Contradictions
              </h4>
              <ul className="list-disc list-inside text-xs space-y-1 text-slate-400 font-medium">
                {entry.result.insights.contradictions.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-3 shadow-sm">
              <h4 className="text-xs font-bold text-blue-400 flex items-center gap-1.5 mb-2">
                <TrendingUp size={12} /> Emerging Trends
              </h4>
              <ul className="list-disc list-inside text-xs space-y-1 text-slate-400 font-medium">
                {entry.result.insights.trends.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>
        </section>

        {/* Sources */}
        <section>
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2 mb-3 flex items-center gap-1.5">
            <BookOpen size={11} /> Sources ({sources.length})
          </h3>
          <div className="space-y-2">
            {sources.map((paper, i) => (
              <button
                key={i}
                onClick={() => setSelectedPaper(paper as any)}
                className="w-full text-left p-3 rounded-xl bg-[#1a1a1e] border border-slate-700 hover:border-blue-500/50 transition-all group shadow-sm"
              >
                <p className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 transition-colors line-clamp-2">
                  {paper?.title}
                </p>
                <p className="text-[10px] text-slate-500 mt-1 font-medium">
                  {paper?.authors[0]} et al. · {paper?.year}
                </p>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// ─── Root panel ───────────────────────────────────────────────────────────────
export const ResultsPanel: React.FC = () => {
  const { searchMode, isResultsPanelOpen, queryHistory, activeHistoryId } = useAppStore();

  // Only render in AI mode when panel is toggled open
  if (searchMode !== 'ai' || !isResultsPanelOpen) return null;

  const activeEntry = activeHistoryId
    ? queryHistory.find(e => e.id === activeHistoryId) ?? null
    : null;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-80 h-full bg-[#0f0f11]/90 backdrop-blur-2xl border-l border-slate-800/50 flex flex-col overflow-hidden text-slate-400 shadow-[-8px_0_32px_rgba(0,0,0,0.2)] z-20"
      >
        <AnimatePresence mode="wait">
          {activeEntry ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col h-full overflow-hidden"
            >
              <SynthesisDetail entry={activeEntry} />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col h-full overflow-hidden"
            >
              <HistoryList />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>
    </AnimatePresence>
  );
};
