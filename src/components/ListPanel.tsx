import React from 'react';
import { FileText } from 'lucide-react';
import { useAppStore } from '../store';
import { Category } from '../types';

const CATEGORY_DOT_COLORS: Record<Category, string> = {
  'Cryoprotectants': 'bg-purple-500',
  'Vitrification': 'bg-cyan-500',
  'Organ Preservation': 'bg-blue-500',
  'Neural Preservation': 'bg-emerald-500',
  'Cardiac Preservation': 'bg-rose-500',
  'Ice Physics & Thermodynamics': 'bg-amber-500',
  'Rewarming Techniques': 'bg-orange-500',
  'Toxicity & Biocompatibility': 'bg-red-500',
  'Nanotechnology Methods': 'bg-indigo-500',
  'Clinical Applications': 'bg-teal-500',
};

export const ListPanel: React.FC = () => {
  const {
    papers,
    searchQuery,
    filters,
    organFilters,
    techniqueFilters,
    publicationFilters,
    yearRange,
    setSelectedPaper,
  } = useAppStore();

  const filtered = papers.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(q) ||
      p.authors.some((a) => a.toLowerCase().includes(q));
    const matchesCategory = filters.length === 0 || filters.includes(p.category);
    const matchesOrgan = organFilters.length === 0 || organFilters.includes(p.organType);
    const matchesTech = techniqueFilters.length === 0 || techniqueFilters.includes(p.techniqueType);
    const matchesPub = publicationFilters.length === 0 || publicationFilters.includes(p.publicationType);
    const matchesYear = p.year >= yearRange[0] && p.year <= yearRange[1];
    return matchesSearch && matchesCategory && matchesOrgan && matchesTech && matchesPub && matchesYear;
  });

  return (
    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
      {/* Header count */}
      <div className="flex items-center gap-2 mb-5">
        <FileText size={15} className="text-slate-500" />
        <span className="text-xs text-slate-500 font-medium">
          {filtered.length.toLocaleString()} papers
        </span>
      </div>

      {/* Paper rows */}
      <div className="space-y-2">
        {filtered.map((paper) => (
          <button
            key={paper.id}
            onClick={() => setSelectedPaper(paper)}
            className="w-full text-left p-4 rounded-2xl bg-[#0f0f11] border border-slate-800 hover:border-slate-600 hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-3">
              {/* Category dot */}
              <span
                className={`mt-1.5 shrink-0 w-2 h-2 rounded-full ${CATEGORY_DOT_COLORS[paper.category as Category] ?? 'bg-slate-500'}`}
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-200 group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                  {paper.title}
                </p>
                <p className="text-xs text-slate-500 mt-1.5 font-medium">
                  {paper.authors[0]}{paper.authors.length > 1 ? ' et al.' : ''} &middot; {paper.year} &middot;{' '}
                  <span className="text-slate-600">{paper.category}</span>
                </p>
              </div>
            </div>
          </button>
        ))}
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
