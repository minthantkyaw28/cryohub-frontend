import React from 'react';
import { useAppStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, CheckCircle2, AlertTriangle, TrendingUp, BookOpen, ShieldCheck } from 'lucide-react';
import { clsx } from 'clsx';

export const ResultsPanel: React.FC = () => {
  const { queryResult, papers, setSelectedPaper } = useAppStore();

  if (!queryResult) return null;

  const sources = queryResult.sources.map(id => papers.find(p => p.id === id)).filter(Boolean);

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Low': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <AnimatePresence>
      <motion.aside 
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-96 h-full bg-[#0f0f11]/90 backdrop-blur-2xl border-l border-slate-800/50 flex flex-col overflow-y-auto text-slate-400 shadow-[-8px_0_32px_rgba(0,0,0,0.2)] z-20"
      >
        <div className="p-6 border-b border-slate-800/50 sticky top-0 bg-[#0f0f11]/90 backdrop-blur-xl z-10">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-display font-bold text-slate-100 flex items-center gap-2">
              <BrainCircuit className="text-blue-500" size={20} />
              AI Synthesis
            </h2>
            <div className={clsx("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 shadow-sm", getConfidenceColor(queryResult.confidence))}>
              <ShieldCheck size={12} />
              {queryResult.confidence}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Answer Section */}
          <section>
            <p className="text-sm leading-relaxed text-slate-300 font-medium">
              {queryResult.answer}
            </p>
          </section>

          {/* Insights Section */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">
              Key Insights
            </h3>
            
            <div className="space-y-3">
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3.5 shadow-sm">
                <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-2 mb-2">
                  <CheckCircle2 size={14} /> Agreements
                </h4>
                <ul className="list-disc list-inside text-xs space-y-1.5 text-slate-400 font-medium">
                  {queryResult.insights.agreements.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>

              <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-3.5 shadow-sm">
                <h4 className="text-xs font-bold text-rose-400 flex items-center gap-2 mb-2">
                  <AlertTriangle size={14} /> Contradictions
                </h4>
                <ul className="list-disc list-inside text-xs space-y-1.5 text-slate-400 font-medium">
                  {queryResult.insights.contradictions.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>

              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-3.5 shadow-sm">
                <h4 className="text-xs font-bold text-blue-400 flex items-center gap-2 mb-2">
                  <TrendingUp size={14} /> Emerging Trends
                </h4>
                <ul className="list-disc list-inside text-xs space-y-1.5 text-slate-400 font-medium">
                  {queryResult.insights.trends.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            </div>
          </section>

          {/* Sources Section */}
          <section>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2 mb-4 flex items-center gap-2">
              <BookOpen size={14} /> Sources ({sources.length})
            </h3>
            <div className="space-y-2.5">
              {sources.map((paper, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedPaper(paper as any)}
                  className="w-full text-left p-3.5 rounded-xl bg-[#1a1a1e] border border-slate-700 hover:border-blue-500/50 hover:shadow-md transition-all group shadow-sm"
                >
                  <p className="text-sm font-semibold text-slate-200 group-hover:text-blue-400 transition-colors line-clamp-2">
                    {paper?.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-1.5 font-medium">
                    {paper?.authors[0]} et al. • {paper?.year}
                  </p>
                </button>
              ))}
            </div>
          </section>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
