
import React, { useState } from 'react';
import { Wand2, Sparkles, MessageSquare, Loader2 } from 'lucide-react';
import { Track, AISuggestion } from '../types';
import { getTransitionSuggestion } from '../services/geminiService';

interface AIAssistantProps {
  leftTrack: Track | null;
  rightTrack: Track | null;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ leftTrack, rightTrack }) => {
  const [suggestion, setSuggestion] = useState<AISuggestion | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAskGemini = async () => {
    if (!leftTrack || !rightTrack) return;
    setLoading(true);
    const result = await getTransitionSuggestion(leftTrack, rightTrack);
    setSuggestion(result);
    setLoading(false);
  };

  return (
    <div className="w-80 bg-slate-900/80 border-l border-slate-800 p-4 flex flex-col gap-4 overflow-y-auto">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg">
           <Wand2 size={16} className="text-white" />
        </div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-white">B&W AI Assistant</h3>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        Let Gemini analyze your current mix and suggest the perfect transition technique based on BPM, Key, and Genre.
      </p>

      {(!leftTrack || !rightTrack) ? (
        <div className="bg-slate-800/40 p-4 rounded-xl border border-dashed border-slate-700 flex flex-col items-center justify-center text-center gap-2">
          <Sparkles size={24} className="text-slate-600" />
          <span className="text-[10px] text-slate-500 font-medium">Load tracks into both decks to enable AI analysis</span>
        </div>
      ) : (
        <button 
          onClick={handleAskGemini}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? (
             <Loader2 size={16} className="animate-spin" />
          ) : (
             <MessageSquare size={16} />
          )}
          {loading ? 'Analyzing Tracks...' : 'Analyze Transition'}
        </button>
      )}

      {suggestion && (
        <div className="flex flex-col gap-4 mt-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
           <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block mb-1">Technique</span>
              <h4 className="text-sm font-bold text-white mb-3">{suggestion.transitionMethod}</h4>
              
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block mb-1">AI Logic</span>
              <p className="text-xs text-slate-300 leading-relaxed mb-4 italic">
                "{suggestion.description}"
              </p>

              <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/80 rounded-lg border border-slate-700">
                 <Sparkles size={12} className="text-yellow-500" />
                 <span className="text-[10px] text-slate-300 font-mono">{suggestion.timingHint}</span>
              </div>
           </div>

           <div className="text-[9px] text-slate-500 text-center uppercase tracking-widest font-bold mt-2">
              Powered by Gemini 3 Flash
           </div>
        </div>
      )}

      <div className="mt-auto pt-6 border-t border-slate-800">
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Live Analysis Feed</h4>
        <div className="flex flex-col gap-2">
           <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-1/3 animate-pulse"></div>
           </div>
           <div className="flex justify-between text-[8px] font-mono text-slate-600">
              <span>SPECTRAL ENERGY</span>
              <span>32%</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
