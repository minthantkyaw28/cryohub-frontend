import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
  ThermometerSnowflake,
  Target,
  FlaskConical,
  BookMarked,
  Microscope,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAppStore } from '../store';
import {
  FUNDING_SOURCES,
  LEAF_HEX_COLORS,
  MODEL_TYPE_TREE,
  OUTCOME_METRICS,
  PUBLICATION_TYPES,
  RESEARCH_TYPES,
  SECTION_ACCENTS,
  TECHNIQUE_GROUPS,
} from '../data/searchSchema';
import { DEFAULT_FILTER_RANGES } from '../utils/paperFilters';

type SectionKey = 'search' | 'techniques' | 'outcomes' | 'experimental' | 'publication' | 'model';

function DualRange({
  label,
  min,
  max,
  step,
  low,
  high,
  onLow,
  onHigh,
  format = (n: number) => String(n),
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  low: number;
  high: number;
  onLow: (v: number) => void;
  onHigh: (v: number) => void;
  format?: (n: number) => string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
        <span>{label}</span>
        <span className="text-slate-400 font-mono normal-case">
          {format(low)} – {format(high)}
        </span>
      </div>
      <div className="relative h-4 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={low}
          onChange={(e) => {
            const v = +e.target.value;
            if (v <= high) onLow(v);
          }}
          className="absolute w-full h-1 bg-slate-800 rounded appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-sky-500 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:bg-sky-400"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={high}
          onChange={(e) => {
            const v = +e.target.value;
            if (v >= low) onHigh(v);
          }}
          className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-sky-500 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:bg-sky-400"
        />
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  active,
  onClick,
  dotClass,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  dotClass: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all font-medium border',
        active
          ? 'bg-[#1a1a1e] border-slate-600 text-slate-100'
          : 'bg-transparent border-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200'
      )}
    >
      <span className="flex items-center gap-2 min-w-0">
        <span className={clsx('w-2 h-2 rounded-full shrink-0', dotClass)} />
        <span className="truncate text-left">{label}</span>
      </span>
      {active && <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.7)] shrink-0" />}
    </button>
  );
}

function SectionHeader({
  title,
  icon,
  accent,
  open,
  onToggle,
}: {
  title: string;
  icon: React.ReactNode;
  accent: (typeof SECTION_ACCENTS)[SectionKey];
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={clsx(
        'w-full flex items-center gap-2 px-1 py-1 rounded-lg -mx-1 hover:bg-white/[0.04] transition-colors text-left'
      )}
    >
      <span className={clsx('w-1 self-stretch min-h-[18px] rounded-full shrink-0', accent.bar)} />
      <span className={accent.text}>{icon}</span>
      <span className={clsx('flex-1 text-[11px] font-bold uppercase tracking-wider', accent.text)}>{title}</span>
      {open ? <ChevronDown size={14} className="text-slate-500 shrink-0" /> : <ChevronRight size={14} className="text-slate-500 shrink-0" />}
    </button>
  );
}

export const Sidebar: React.FC = () => {
  const {
    isSidebarOpen,
    toggleSidebar,
    researchTypeFilters,
    toggleResearchTypeFilter,
    fundingFilters,
    toggleFundingFilter,
    openAccess,
    setOpenAccess,
    journalQuery,
    setJournalQuery,
    authorInstitutionQuery,
    setAuthorInstitutionQuery,
    countryQuery,
    setCountryQuery,
    cpaTypeQuery,
    setCpaTypeQuery,
    impactFactorRange,
    setImpactFactorRange,
    citationCountRange,
    setCitationCountRange,
    cpaConcRange,
    setCpaConcRange,
    coolingRateRange,
    setCoolingRateRange,
    warmingRateRange,
    setWarmingRateRange,
    storageDaysRange,
    setStorageDaysRange,
    storageTempRange,
    setStorageTempRange,
    yearRange,
    setYearRange,
    techniqueFilters,
    toggleTechniqueFilter,
    outcomeFilters,
    toggleOutcomeFilter,
    modelLeafFilters,
    toggleModelLeafFilter,
    publicationFilters,
    togglePublicationFilter,
  } = useAppStore();

  const [sec, setSec] = useState<Record<SectionKey, boolean>>({
    search: true,
    techniques: true,
    outcomes: false,
    experimental: false,
    publication: false,
    model: true,
  });

  const [techOpen, setTechOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(TECHNIQUE_GROUPS.map((g) => [g.id, false]))
  );

  const [modelMainOpen, setModelMainOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(MODEL_TYPE_TREE.map((b) => [b.main, true]))
  );

  const d = DEFAULT_FILTER_RANGES;

  const researchDots = ['bg-sky-500', 'bg-indigo-500', 'bg-violet-500', 'bg-fuchsia-500'];
  const fundingDots = ['bg-amber-500', 'bg-teal-500', 'bg-emerald-500'];

  return (
    <>
      <aside
      className={clsx(
        'absolute left-0 top-0 h-full w-80',
        'bg-[#0a0a0d]/97 backdrop-blur-2xl border-r border-slate-800/50',
        'flex flex-col p-3 text-slate-400',
        'shadow-[4px_0_24px_rgba(0,0,0,0.3)] z-20 overflow-y-auto overflow-x-hidden scrollbar-hide',
        'transition-transform duration-300 ease-in-out',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="flex-1 space-y-5 pb-6">
        {/* Search config */}
        <div className="space-y-2">
          <SectionHeader
            title="Search config"
            icon={<SlidersHorizontal size={14} />}
            accent={SECTION_ACCENTS.search}
            open={sec.search}
            onToggle={() => setSec((s) => ({ ...s, search: !s.search }))}
          />
          {sec.search && (
            <div className="mt-2 ml-2 pl-2 border-l border-sky-500/25 space-y-3">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Research type</p>
              <div className="space-y-0.5">
                {RESEARCH_TYPES.map((t, i) => (
                  <ToggleRow
                    key={t}
                    label={t}
                    active={researchTypeFilters.includes(t)}
                    onClick={() => toggleResearchTypeFilter(t)}
                    dotClass={researchDots[i % researchDots.length]}
                  />
                ))}
              </div>

              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pt-1">Publication year</p>
              <DualRange
                label="Range"
                min={d.year[0]}
                max={d.year[1]}
                step={1}
                low={yearRange[0]}
                high={yearRange[1]}
                onLow={(v) => setYearRange([v, yearRange[1]])}
                onHigh={(v) => setYearRange([yearRange[0], v])}
              />

              <label className="block space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Journal name</span>
                <input
                  value={journalQuery}
                  onChange={(e) => setJournalQuery(e.target.value)}
                  placeholder="Enter name"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#121216] border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500/40"
                />
              </label>

              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Journal impact factor</p>
              <DualRange
                label="IF range"
                min={d.impactFactor[0]}
                max={d.impactFactor[1]}
                step={0.5}
                low={impactFactorRange[0]}
                high={impactFactorRange[1]}
                onLow={(v) => setImpactFactorRange([v, impactFactorRange[1]])}
                onHigh={(v) => setImpactFactorRange([impactFactorRange[0], v])}
                format={(n) => n.toFixed(1)}
              />

              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Open access</p>
              <div className="flex gap-1">
                {(['any', 'yes', 'no'] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setOpenAccess(k)}
                    className={clsx(
                      'flex-1 py-1.5 rounded-lg text-[11px] font-semibold border transition-all',
                      openAccess === k
                        ? 'bg-sky-500/20 border-sky-500/50 text-sky-200'
                        : 'border-slate-800 text-slate-500 hover:border-slate-600'
                    )}
                  >
                    {k === 'any' ? 'All' : k === 'yes' ? 'Yes' : 'No'}
                  </button>
                ))}
              </div>

              <label className="block space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Author / Institution</span>
                <input
                  value={authorInstitutionQuery}
                  onChange={(e) => setAuthorInstitutionQuery(e.target.value)}
                  placeholder="Enter name"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#121216] border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500/40"
                />
              </label>

              <label className="block space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Country / Region</span>
                <input
                  value={countryQuery}
                  onChange={(e) => setCountryQuery(e.target.value)}
                  placeholder="Enter name"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#121216] border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500/40"
                />
              </label>

              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Funding source</p>
              <div className="space-y-0.5">
                {FUNDING_SOURCES.map((f, i) => (
                  <ToggleRow
                    key={f}
                    label={f}
                    active={fundingFilters.includes(f)}
                    onClick={() => toggleFundingFilter(f)}
                    dotClass={fundingDots[i % fundingDots.length]}
                  />
                ))}
              </div>

              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Citations</p>
              <DualRange
                label="Citation count"
                min={d.citationCount[0]}
                max={d.citationCount[1]}
                step={5}
                low={citationCountRange[0]}
                high={citationCountRange[1]}
                onLow={(v) => setCitationCountRange([v, citationCountRange[1]])}
                onHigh={(v) => setCitationCountRange([citationCountRange[0], v])}
              />
            </div>
          )}
        </div>

        {/* Techniques */}
        <div className="space-y-2">
          <SectionHeader
            title="Techniques"
            icon={<ThermometerSnowflake size={14} />}
            accent={SECTION_ACCENTS.techniques}
            open={sec.techniques}
            onToggle={() => setSec((s) => ({ ...s, techniques: !s.techniques }))}
          />
          {sec.techniques && (
            <div className="mt-2 ml-2 pl-2 border-l border-cyan-500/25 space-y-2">
              <label className="block space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Cryoprotectant — CPA type</span>
                <input
                  value={cpaTypeQuery}
                  onChange={(e) => setCpaTypeQuery(e.target.value)}
                  placeholder="e.g. DMSO, trehalose"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#121216] border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
                />
              </label>

              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">CPA concentration (% v/v)</p>
              <DualRange
                label="Range"
                min={d.cpaConc[0]}
                max={d.cpaConc[1]}
                step={0.5}
                low={cpaConcRange[0]}
                high={cpaConcRange[1]}
                onLow={(v) => setCpaConcRange([v, cpaConcRange[1]])}
                onHigh={(v) => setCpaConcRange([cpaConcRange[0], v])}
                format={(n) => `${n}%`}
              />

              {TECHNIQUE_GROUPS.map((group, gi) => {
                const palette = ['bg-cyan-500', 'bg-blue-500', 'bg-teal-500', 'bg-emerald-500'];
                const dot = palette[gi % palette.length];
                const isOpen = techOpen[group.id];
                return (
                  <div key={group.id} className="rounded-lg border border-slate-800/80 overflow-hidden bg-[#0c0c10]/80">
                    <button
                      type="button"
                      onClick={() => setTechOpen((o) => ({ ...o, [group.id]: !isOpen }))}
                      className="w-full flex items-center justify-between px-2 py-1.5 text-[11px] font-bold text-cyan-300/90 uppercase tracking-wide hover:bg-white/5"
                    >
                      <span className="flex items-center gap-2">
                        <span className={clsx('w-1.5 h-1.5 rounded-full', dot)} />
                        {group.label}
                      </span>
                      {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                    {isOpen && (
                      <div className="px-1.5 pb-1.5 space-y-0.5 border-t border-slate-800/60 pt-1">
                        {group.items.map((item) => (
                          <ToggleRow
                            key={item}
                            label={item}
                            active={techniqueFilters.includes(item)}
                            onClick={() => toggleTechniqueFilter(item)}
                            dotClass={dot}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Outcomes */}
        <div className="space-y-2">
          <SectionHeader
            title="Outcomes & metrics"
            icon={<Target size={14} />}
            accent={SECTION_ACCENTS.outcomes}
            open={sec.outcomes}
            onToggle={() => setSec((s) => ({ ...s, outcomes: !s.outcomes }))}
          />
          {sec.outcomes && (
            <div className="mt-2 ml-2 pl-2 border-l border-emerald-500/25 space-y-0.5">
              {OUTCOME_METRICS.map((o, i) => (
                <ToggleRow
                  key={o}
                  label={o}
                  active={outcomeFilters.includes(o)}
                  onClick={() => toggleOutcomeFilter(o)}
                  dotClass={['bg-emerald-500', 'bg-green-500', 'bg-lime-500', 'bg-teal-500', 'bg-cyan-500'][i % 5]}
                />
              ))}
            </div>
          )}
        </div>

        {/* Experimental */}
        <div className="space-y-2">
          <SectionHeader
            title="Experimental conditions"
            icon={<FlaskConical size={14} />}
            accent={SECTION_ACCENTS.experimental}
            open={sec.experimental}
            onToggle={() => setSec((s) => ({ ...s, experimental: !s.experimental }))}
          />
          {sec.experimental && (
            <div className="mt-2 ml-2 pl-2 border-l border-amber-500/25 space-y-3">
              <DualRange
                label="Cooling rate (°C/min)"
                min={d.coolingRate[0]}
                max={d.coolingRate[1]}
                step={0.5}
                low={coolingRateRange[0]}
                high={coolingRateRange[1]}
                onLow={(v) => setCoolingRateRange([v, coolingRateRange[1]])}
                onHigh={(v) => setCoolingRateRange([coolingRateRange[0], v])}
              />
              <DualRange
                label="Warming rate (°C/min)"
                min={d.warmingRate[0]}
                max={d.warmingRate[1]}
                step={0.5}
                low={warmingRateRange[0]}
                high={warmingRateRange[1]}
                onLow={(v) => setWarmingRateRange([v, warmingRateRange[1]])}
                onHigh={(v) => setWarmingRateRange([warmingRateRange[0], v])}
              />
              <DualRange
                label="Storage duration (days)"
                min={d.storageDays[0]}
                max={d.storageDays[1]}
                step={10}
                low={storageDaysRange[0]}
                high={storageDaysRange[1]}
                onLow={(v) => setStorageDaysRange([v, storageDaysRange[1]])}
                onHigh={(v) => setStorageDaysRange([storageDaysRange[0], v])}
              />
              <DualRange
                label="Storage temp (°C)"
                min={d.storageTemp[0]}
                max={d.storageTemp[1]}
                step={1}
                low={storageTempRange[0]}
                high={storageTempRange[1]}
                onLow={(v) => setStorageTempRange([v, storageTempRange[1]])}
                onHigh={(v) => setStorageTempRange([storageTempRange[0], v])}
              />
            </div>
          )}
        </div>

        {/* Publication type */}
        <div className="space-y-2">
          <SectionHeader
            title="Publication type"
            icon={<BookMarked size={14} />}
            accent={SECTION_ACCENTS.publication}
            open={sec.publication}
            onToggle={() => setSec((s) => ({ ...s, publication: !s.publication }))}
          />
          {sec.publication && (
            <div className="mt-2 ml-2 pl-2 border-l border-violet-500/25 space-y-0.5">
              {PUBLICATION_TYPES.map((p, i) => (
                <ToggleRow
                  key={p}
                  label={p}
                  active={publicationFilters.includes(p)}
                  onClick={() => togglePublicationFilter(p)}
                  dotClass={['bg-violet-500', 'bg-purple-500', 'bg-indigo-500', 'bg-fuchsia-500'][i % 4]}
                />
              ))}
            </div>
          )}
        </div>

        {/* Model type — two levels: main → leaf params (sub-level skipped, same name) */}
        <div className="space-y-2">
          <SectionHeader
            title="Model type"
            icon={<Microscope size={14} />}
            accent={SECTION_ACCENTS.model}
            open={sec.model}
            onToggle={() => setSec((s) => ({ ...s, model: !s.model }))}
          />
          {sec.model && (
            <div className="mt-2 ml-2 pl-2 border-l border-fuchsia-500/25 space-y-1.5">
              {MODEL_TYPE_TREE.map((block) => {
                const tw = {
                  Cells:                { text: 'text-rose-400',    border: 'border-rose-500/25'    },
                  'Tissues & 3D Models':{ text: 'text-cyan-400',    border: 'border-cyan-500/25'    },
                  'Whole Organ Models': { text: 'text-orange-400',  border: 'border-orange-500/25'  },
                  'Model Organisms':    { text: 'text-emerald-400', border: 'border-emerald-500/25' },
                }[block.main];
                const mainOpen = modelMainOpen[block.main];
                // Collect all params directly (skip the redundant single-sub layer)
                const allParams = block.subs.flatMap((s) => s.params);
                return (
                  <div key={block.main} className={clsx('rounded-lg border overflow-hidden bg-[#0c0c10]/80', tw.border)}>
                    <button
                      type="button"
                      onClick={() => setModelMainOpen((o) => ({ ...o, [block.main]: !mainOpen }))}
                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/5"
                    >
                      <span className={clsx('text-[11px] font-bold uppercase tracking-wide', tw.text)}>
                        {block.main}
                      </span>
                      {mainOpen
                        ? <ChevronDown size={13} className="text-slate-500" />
                        : <ChevronRight size={13} className="text-slate-500" />}
                    </button>
                    {mainOpen && (
                      <div className="px-1.5 pb-1.5 space-y-0.5 border-t border-slate-800/60 pt-1">
                        {allParams.map((param) => (
                          <button
                            key={param}
                            type="button"
                            onClick={() => toggleModelLeafFilter(param)}
                            className={clsx(
                              'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all font-medium border',
                              modelLeafFilters.includes(param)
                                ? 'bg-[#1a1a1e] border-slate-600 text-slate-100'
                                : 'bg-transparent border-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200'
                            )}
                          >
                            <span className="flex items-center gap-2 min-w-0 truncate">
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: LEAF_HEX_COLORS[param] ?? '#94a3b8' }}
                              />
                              <span className="truncate text-left">{param}</span>
                            </span>
                            {modelLeafFilters.includes(param) && (
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.7)] shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
      <button
        onClick={toggleSidebar}
        className={clsx(
          'absolute top-1/2 -translate-y-1/2 z-30 flex items-center justify-center',
          'w-6 h-12 bg-blue-500/10 border border-blue-500/20 border-l-0 rounded-r-lg shadow-[4px_0_12px_rgba(56,189,248,0.15)] cursor-pointer',
          'text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 transition-all duration-300 ease-in-out',
          isSidebarOpen ? 'left-80' : 'left-0'
        )}
        title="Toggle Filters"
      >
        {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>
    </>
  );
};
