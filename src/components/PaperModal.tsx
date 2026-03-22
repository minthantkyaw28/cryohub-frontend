import React from 'react';
import { useAppStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Users, Calendar, Link as LinkIcon, ExternalLink } from 'lucide-react';

export const PaperModal: React.FC = () => {
  const { selectedPaper, setSelectedPaper, papers } = useAppStore();

  if (!selectedPaper) return null;

  const relatedPapers = selectedPaper.internal_citations
    .map((id: number) => papers.find(p => p.id === id))
    .filter(Boolean)
    .slice(0, 3);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        className="absolute bottom-6 right-6 z-40 w-full max-w-md max-h-[70vh] flex flex-col bg-[#1a1a1e]/95 backdrop-blur-2xl border border-slate-700/60 rounded-3xl shadow-[0_24px_48px_rgba(0,0,0,0.4)] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-800 bg-[#1a1a1e]/50">
          <div className="pr-4">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-pink-500/15 text-pink-300 border border-pink-500/30 shadow-sm">
                {selectedPaper.model_type?.[0] || 'Unknown'}
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 shadow-sm">
                {selectedPaper.research_type?.[0] || 'Unknown'}
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
                <Calendar size={12} /> {selectedPaper.publication_year}
              </span>
            </div>
            <h2 className="text-lg font-display font-bold text-slate-100 leading-tight">
              {selectedPaper.title}
            </h2>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-slate-400">
              <Users size={14} />
              <p className="truncate">{selectedPaper.authors.join(', ')}</p>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              {selectedPaper.journal} · IF {selectedPaper.journal_impact_factor?.toFixed(1) || 'N/A'} ·{' '}
              {selectedPaper.open_access ? 'Open access' : 'Closed access'} · {selectedPaper.publication_type?.[0] || 'Unknown'} ·{' '}
              {selectedPaper.citations || 0} citations
            </p>
            <p className="text-[11px] text-slate-600 mt-1">
              {selectedPaper.author_institution?.[0] || 'Unknown'} · {selectedPaper.country_region?.[0] || 'Unknown'} · Funding: {selectedPaper.funding_source?.[0] || 'Unknown'}
            </p>
          </div>
          <button 
            onClick={() => setSelectedPaper(null)}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6 text-slate-400 bg-[#0f0f11]/50">
          
          <section>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-2">
              Techniques & CPA
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {selectedPaper.techniques?.map((t: string) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                >
                  {t}
                </span>
              ))}
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-violet-500/10 text-violet-300 border border-violet-500/20">
                {selectedPaper.cpa_type?.[0] || 'Unknown'} ({selectedPaper.cpa_concentration_min || 0}%)
              </span>
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-2">
              Outcomes
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {selectedPaper.outcomes_metrics?.map((o: string) => (
                <span
                  key={o}
                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                >
                  {o}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Experimental</h3>
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-medium">
              <div className="bg-[#1a1a1e] p-2 rounded-lg border border-slate-800">
                Cooling {selectedPaper.cooling_rate ?? 'N/A'} °C/min
              </div>
              <div className="bg-[#1a1a1e] p-2 rounded-lg border border-slate-800">
                Warming {selectedPaper.warming_rate ?? 'N/A'} °C/min
              </div>
              <div className="bg-[#1a1a1e] p-2 rounded-lg border border-slate-800">
                Storage {selectedPaper.storage_duration ?? 'N/A'} d
              </div>
              <div className="bg-[#1a1a1e] p-2 rounded-lg border border-slate-800">
                Temp {selectedPaper.storage_temperature ?? 'N/A'} °C
              </div>
            </div>
          </section>

          {/* Abstract */}
          <section>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-2">
              <FileText size={12} /> Abstract
            </h3>
            <p className="text-xs leading-relaxed text-slate-300 bg-[#1a1a1e] p-4 rounded-2xl border border-slate-800 shadow-sm font-medium">
              {selectedPaper.abstract}
            </p>
          </section>



          {/* Related Papers */}
          {relatedPapers.length > 0 && (
            <section>
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                <LinkIcon size={12} /> Related Papers
              </h3>
              <div className="grid gap-2">
                {relatedPapers.map((paper, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPaper(paper as any)}
                    className="text-left p-3 rounded-xl bg-[#1a1a1e] border border-slate-700 hover:border-blue-500/50 hover:shadow-md transition-all group flex items-start justify-between gap-3 shadow-sm"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 transition-colors line-clamp-1">
                        {paper?.title}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1 font-medium">
                        {paper?.authors[0]} et al. • {paper?.publication_year}
                      </p>
                    </div>
                    <ExternalLink size={14} className="text-slate-600 group-hover:text-blue-400 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const SparklesIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/>
    <path d="M19 17v4"/>
    <path d="M3 5h4"/>
    <path d="M17 19h4"/>
  </svg>
);
