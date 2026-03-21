import React, { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { useAppStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';

export const QueryBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const { submitQuery, isQuerying } = useAppStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isQuerying) {
      submitQuery(query);
      setQuery('');
    }
  };

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-20">
      <motion.form 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onSubmit={handleSubmit}
        className="relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-2xl blur-md opacity-40 group-hover:opacity-60 transition duration-500"></div>
        <div className="relative flex items-center bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="pl-5 pr-3 py-4 flex items-center justify-center text-blue-500">
            <Sparkles size={22} className={isQuerying ? "animate-pulse" : ""} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything about cryobiology..."
            className="flex-1 bg-transparent border-none text-slate-800 placeholder-slate-400 py-4 px-2 focus:outline-none text-lg font-medium"
            disabled={isQuerying}
          />
          <button
            type="submit"
            disabled={!query.trim() || isQuerying}
            className="p-4 mr-1 text-slate-400 hover:text-blue-500 disabled:opacity-50 disabled:hover:text-slate-400 transition-colors"
          >
            <div className="bg-slate-100 hover:bg-blue-50 p-2 rounded-xl transition-colors">
              <Send size={20} className={isQuerying ? "animate-bounce text-blue-500" : ""} />
            </div>
          </button>
        </div>
      </motion.form>
      
      <AnimatePresence>
        {isQuerying && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-blue-600 font-mono font-bold tracking-widest uppercase bg-white/80 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-blue-100"
          >
            Synthesizing literature...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
