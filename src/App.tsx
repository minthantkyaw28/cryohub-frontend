/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Topbar } from './components/Topbar';
import { Sidebar } from './components/Sidebar';
import { GraphView } from './components/GraphView';
import { ResultsPanel } from './components/ResultsPanel';
import { PaperModal } from './components/PaperModal';
import { ListPanel } from './components/ListPanel';
import { useAppStore } from './store';

export default function App() {
  const { searchMode, initStore } = useAppStore();

  useEffect(() => {
    initStore();
  }, [initStore]);

  // keyword mode = list view; ai mode = graph view
  const showGraph = searchMode === 'ai';

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden font-sans text-slate-300 bg-[#0a0a0a] relative">
      {/* Existing background gradient — untouched */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,20,20,1),rgba(0,0,0,1))] pointer-events-none" />

      {/* Topbar — contains the unified search bar */}
      <Topbar />

      {/* Body row */}
      <div className="flex flex-1 overflow-hidden relative z-10">

        {/* Sidebar — absolute overlay, slides in from left */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 relative flex flex-col overflow-hidden">

          {/* Graph view — CSS hidden so canvas never unmounts */}
          <div className={showGraph ? 'flex-1 relative' : 'hidden'}>
            <GraphView />
            <PaperModal />
          </div>

          {/* List view — shown in keyword mode */}
          <div className={!showGraph ? 'flex-1 relative overflow-hidden flex flex-col' : 'hidden'}>
            <ListPanel />
          </div>

        </main>

        {/* Results panel — only meaningful in AI mode */}
        <ResultsPanel />
      </div>
    </div>
  );
}
