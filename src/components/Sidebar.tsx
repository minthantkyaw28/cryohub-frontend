import React, { useState } from 'react';
import { Filter, Bookmark, Brain, Heart, Activity, Droplet, Zap, ThermometerSnowflake, ShieldAlert, Microscope, Stethoscope, Layers, ChevronDown, ChevronRight, Calendar } from 'lucide-react';
import { useAppStore } from '../store';
import { Category } from '../types';
import { clsx } from 'clsx';

const CATEGORY_COLORS: Record<Category, string> = {
  'Cryoprotectants': 'text-purple-500',
  'Vitrification': 'text-cyan-500',
  'Organ Preservation': 'text-blue-500',
  'Neural Preservation': 'text-emerald-500',
  'Cardiac Preservation': 'text-rose-500',
  'Ice Physics & Thermodynamics': 'text-amber-500',
  'Rewarming Techniques': 'text-orange-500',
  'Toxicity & Biocompatibility': 'text-red-500',
  'Nanotechnology Methods': 'text-indigo-500',
  'Clinical Applications': 'text-teal-500'
};

const CATEGORY_BG_COLORS: Record<Category, string> = {
  'Cryoprotectants': 'bg-purple-500',
  'Vitrification': 'bg-cyan-500',
  'Organ Preservation': 'bg-blue-500',
  'Neural Preservation': 'bg-emerald-500',
  'Cardiac Preservation': 'bg-rose-500',
  'Ice Physics & Thermodynamics': 'bg-amber-500',
  'Rewarming Techniques': 'bg-orange-500',
  'Toxicity & Biocompatibility': 'bg-red-500',
  'Nanotechnology Methods': 'bg-indigo-500',
  'Clinical Applications': 'bg-teal-500'
};

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  'Cryoprotectants': <Droplet size={16} />,
  'Vitrification': <Layers size={16} />,
  'Organ Preservation': <Activity size={16} />,
  'Neural Preservation': <Brain size={16} />,
  'Cardiac Preservation': <Heart size={16} />,
  'Ice Physics & Thermodynamics': <ThermometerSnowflake size={16} />,
  'Rewarming Techniques': <Zap size={16} />,
  'Toxicity & Biocompatibility': <ShieldAlert size={16} />,
  'Nanotechnology Methods': <Microscope size={16} />,
  'Clinical Applications': <Stethoscope size={16} />
};

const ORGAN_TYPES = ['Brain', 'Heart', 'Kidney', 'Liver', 'Whole Body', 'None'];
const TECHNIQUE_TYPES = ['Vitrification', 'Slow Freezing', 'Liquid Ventilation', 'Nanowarming', 'Perfusion'];
const PUBLICATION_TYPES = ['Research Paper', 'Journal', 'Preprint', 'Conference Proceeding', 'Technical Report', 'Grey Literature'];

export const Sidebar: React.FC = () => {
  const { 
    filters, toggleFilter,
    organFilters, toggleOrganFilter,
    techniqueFilters, toggleTechniqueFilter,
    publicationFilters, togglePublicationFilter,
    isSidebarOpen,
    yearRange, setYearRange,
  } = useAppStore();

  const [isClustersOpen, setIsClustersOpen] = useState(true);
  const [isOrgansOpen, setIsOrgansOpen] = useState(false);
  const [isTechniquesOpen, setIsTechniquesOpen] = useState(false);
  const [isPublicationsOpen, setIsPublicationsOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);

  return (
    <aside className={clsx(
      "absolute left-0 top-0 h-full w-72",
      "bg-[#0a0a0d]/97 backdrop-blur-2xl border-r border-slate-800/50",
      "flex flex-col p-4 text-slate-400",
      "shadow-[4px_0_24px_rgba(0,0,0,0.3)] z-20 overflow-y-auto overflow-x-hidden scrollbar-hide",
      "transition-transform duration-300 ease-in-out",
      (isSidebarOpen) ? 'translate-x-0' : '-translate-x-full'
    )}>

      <div className="flex-1 space-y-6">
        {/* Clusters / Research Fields */}
        <div>
          <button 
            onClick={() => setIsClustersOpen(!isClustersOpen)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 hover:text-slate-300 transition-colors"
          >
            <span className="flex items-center gap-2"><Filter size={14} /> Research Fields</span>
            {isClustersOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {isClustersOpen && (
            <div className="space-y-1.5 mt-3">
              {(Object.keys(CATEGORY_COLORS) as Category[]).map((category) => (
                <button
                  key={category}
                  onClick={() => toggleFilter(category)}
                  className={clsx(
                    "w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all font-medium border",
                    filters.includes(category) 
                      ? "bg-[#1a1a1e] border-slate-700 text-slate-200 shadow-sm" 
                      : "bg-transparent border-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200"
                  )}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className={`w-2.5 h-2.5 rounded-full ${CATEGORY_BG_COLORS[category]} shrink-0`} />
                    <span className={CATEGORY_COLORS[category]}>{CATEGORY_ICONS[category]}</span>
                    <span className="truncate">{category}</span>
                  </div>
                  {filters.includes(category) && <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Organ Type */}
        <div>
          <button 
            onClick={() => setIsOrgansOpen(!isOrgansOpen)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 hover:text-slate-300 transition-colors"
          >
            <span className="flex items-center gap-2"><Activity size={14} /> Organ Type</span>
            {isOrgansOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {isOrgansOpen && (
            <div className="space-y-1.5 mt-3">
              {ORGAN_TYPES.map((organ) => (
                <button
                  key={organ}
                  onClick={() => toggleOrganFilter(organ)}
                  className={clsx(
                    "w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all font-medium border",
                    organFilters.includes(organ) 
                      ? "bg-[#1a1a1e] border-slate-700 text-slate-200 shadow-sm" 
                      : "bg-transparent border-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200"
                  )}
                >
                  <span className="truncate">{organ}</span>
                  {organFilters.includes(organ) && <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Cryo/Stasis Techniques */}
        <div>
          <button 
            onClick={() => setIsTechniquesOpen(!isTechniquesOpen)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 hover:text-slate-300 transition-colors"
          >
            <span className="flex items-center gap-2"><ThermometerSnowflake size={14} /> Techniques</span>
            {isTechniquesOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {isTechniquesOpen && (
            <div className="space-y-1.5 mt-3">
              {TECHNIQUE_TYPES.map((tech) => (
                <button
                  key={tech}
                  onClick={() => toggleTechniqueFilter(tech)}
                  className={clsx(
                    "w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all font-medium border",
                    techniqueFilters.includes(tech) 
                      ? "bg-[#1a1a1e] border-slate-700 text-slate-200 shadow-sm" 
                      : "bg-transparent border-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200"
                  )}
                >
                  <span className="truncate">{tech}</span>
                  {techniqueFilters.includes(tech) && <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Publication Type */}
        <div>
          <button 
            onClick={() => setIsPublicationsOpen(!isPublicationsOpen)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 hover:text-slate-300 transition-colors"
          >
            <span className="flex items-center gap-2"><Bookmark size={14} /> Publication Type</span>
            {isPublicationsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {isPublicationsOpen && (
            <div className="space-y-1.5 mt-3">
              {PUBLICATION_TYPES.map((pub) => (
                <button
                  key={pub}
                  onClick={() => togglePublicationFilter(pub)}
                  className={clsx(
                    "w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all font-medium border",
                    publicationFilters.includes(pub) 
                      ? "bg-[#1a1a1e] border-slate-700 text-slate-200 shadow-sm" 
                      : "bg-transparent border-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200"
                  )}
                >
                  <span className="truncate">{pub}</span>
                  {publicationFilters.includes(pub) && <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Year Range */}
        <div>
          <button
            onClick={() => setIsYearOpen(!isYearOpen)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 hover:text-slate-300 transition-colors"
          >
            <span className="flex items-center gap-2"><Calendar size={14} /> Year Range</span>
            {isYearOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {isYearOpen && (
            <div className="mt-3 px-1 space-y-3">
              <div className="flex justify-between text-xs text-slate-400 font-medium">
                <span>{yearRange[0]}</span>
                <span>{yearRange[1]}</span>
              </div>
              <div className="space-y-2">
                <input
                  type="range"
                  min={1990}
                  max={2026}
                  value={yearRange[0]}
                  onChange={(e) => {
                    const val = +e.target.value;
                    if (val < yearRange[1]) setYearRange([val, yearRange[1]]);
                  }}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <input
                  type="range"
                  min={1990}
                  max={2026}
                  value={yearRange[1]}
                  onChange={(e) => {
                    const val = +e.target.value;
                    if (val > yearRange[0]) setYearRange([yearRange[0], val]);
                  }}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 shrink-0">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Bookmark size={14} /> Saved Queries
        </h2>
        <ul className="space-y-1.5 text-sm text-slate-400">
          {['Vitrification vs Slow Freezing', 'Toxicity of DMSO in neural tissue', 'Ice recrystallization inhibitors'].map((q, i) => (
            <li 
              key={i} 
              onClick={() => {
                useAppStore.getState().submitQuery(q);
              }}
              className="hover:text-slate-200 hover:bg-white/5 px-3 py-2 rounded-lg cursor-pointer truncate transition-all font-medium border border-transparent hover:border-slate-700/60"
            >
              "{q}"
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};
