/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sidebar } from './components/Sidebar';
import { GraphView } from './components/GraphView';
import { QueryBar } from './components/QueryBar';
import { ResultsPanel } from './components/ResultsPanel';
import { PaperModal } from './components/PaperModal';

export default function App() {
  return (
    <div className="flex h-screen w-full overflow-hidden font-sans text-slate-300 bg-[#0a0a0a] relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,20,20,1),rgba(0,0,0,1))] pointer-events-none" />
      <Sidebar />
      
      <main className="flex-1 relative flex flex-col z-10">
        <div className="flex-1 relative">
          <GraphView />
          <QueryBar />
          <PaperModal />
        </div>
      </main>
      
      <ResultsPanel />
    </div>
  );
}
