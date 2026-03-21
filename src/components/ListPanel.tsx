import React, { useMemo } from 'react';
import { FileText } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore, paperFilterSnapshot } from '../store';
import { paperMatchesFilters } from '../utils/paperFilters';
import { LEAF_HEX_COLORS, LEAF_HEX_FALLBACK } from '../data/searchSchema';

export const ListPanel: React.FC = () => {
  const setSelectedPaper = useAppStore((s) => s.setSelectedPaper);
  const papers = useAppStore((s) => s.papers);
  // Shallow equality so we only re-filter when an actual filter value changes
  const filterSnap = useAppStore(useShallow(paperFilterSnapshot));

  const filtered = useMemo(
    () => papers.filter((p) => paperMatchesFilters(p, filterSnap)),
    [papers, filterSnap]
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
      <div className="flex items-center gap-2 mb-5">
        <FileText size={15} className="text-slate-500" />
        <span className="text-xs text-slate-500 font-medium">{filtered.length.toLocaleString()} papers</span>
      </div>

      <div className="space-y-2">
        {filtered.map((paper) => {
          return (
            <button
              key={paper.id}
              onClick={() => setSelectedPaper(paper)}
              className="w-full text-left p-4 rounded-2xl bg-[#0f0f11] border border-slate-800 hover:border-slate-600 hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-3">
                <span
                  className="mt-1.5 shrink-0 w-2 h-2 rounded-full"
                  style={{ backgroundColor: LEAF_HEX_COLORS[paper.modelParam] ?? LEAF_HEX_FALLBACK }}
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-200 group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                    {paper.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-1.5 font-medium">
                    {paper.authors[0]}
                    {paper.authors.length > 1 ? ' et al.' : ''} &middot; {paper.year} &middot;{' '}
                    <span className="text-slate-600">
                      {paper.modelTypeMain} › {paper.modelParam}
                    </span>
                  </p>
                  <p className="text-[10px] text-slate-600 mt-1 font-medium">
                    {paper.researchType} · {paper.publicationType} · IF {paper.journalImpactFactor.toFixed(1)}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-slate-600">
          <FileText size={36} className="mb-3 opacity-40" />
          <p className="text-sm font-medium">No papers match the current filters</p>
        </div>
      )}
    </div>
  );
};
