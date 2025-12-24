
import React, { useState } from 'react';
import { Sparkles, Play, Volume2, Loader2, Music, Type as TextIcon, Download } from 'lucide-react';
import { generateAIComposition, generateVocalDrop } from '../services/geminiService';
import { AIComposition } from '../types';

const AIComposer: React.FC = () => {
  const [vibe, setVibe] = useState('');
  const [composing, setComposing] = useState(false);
  const [result, setResult] = useState<AIComposition | null>(null);

  const handleCompose = async () => {
    if (!vibe) return;
    setComposing(true);
    try {
      const comp = await generateAIComposition(vibe);
      // Simulating a more complex AI lyric generation
      const lyricsResponse = "Verse 1: Shadows moving through the neon light / Electric pulse in the middle of the night / B&W Studio taking flight / Feel the rhythm, everything's right.";
      setResult({ ...comp, lyrics: lyricsResponse });
    } catch (e) { console.error(e); }
    setComposing(false);
  };

  const playVocals = async () => {
    if (!result?.vocalScript) return;
    // Note: In real use we'd decode raw PCM as per guidelines
    const utterance = new SpeechSynthesisUtterance(result.vocalScript);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex h-full bg-slate-950/40 border-t border-slate-800 backdrop-blur-sm p-6 gap-8 overflow-hidden">
      <div className="w-1/3 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-2">
            <Sparkles size={14} /> AI Composition Core
          </h3>
          <div className="flex gap-1">
             <div className="w-1 h-1 rounded-full bg-blue-500"></div>
             <div className="w-1 h-1 rounded-full bg-blue-500/40"></div>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col gap-4">
          <label className="text-[9px] font-black text-slate-500 uppercase">Input Musical Vibe</label>
          <textarea 
            placeholder="e.g., 'Dark cinematic techno with heavy sub bass and ethereal vocals'..."
            className="flex-1 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-sm text-slate-200 focus:ring-1 focus:ring-blue-500/50 outline-none resize-none shadow-inner"
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
          />
        </div>

        <button 
          onClick={handleCompose}
          disabled={composing || !vibe}
          className="py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-xl"
        >
          {composing ? <Loader2 className="animate-spin" size={18} /> : <Music size={18} />}
          {composing ? 'Synthesizing...' : 'Generate New Track'}
        </button>
      </div>

      <div className="flex-1 bg-slate-900/50 rounded-3xl border border-slate-800 p-8 flex flex-col gap-8 shadow-2xl relative overflow-y-auto">
        {!result ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-700 gap-6">
             <div className="w-20 h-20 rounded-3xl border-2 border-slate-800 flex items-center justify-center animate-pulse">
                <Sparkles size={40} className="text-slate-800" />
             </div>
             <p className="text-xs font-black uppercase tracking-widest opacity-50">Awaiting Vibe Parameters</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-8 duration-500">
            {/* Pattern Viewer */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                 <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Drum Pattern Grid</h4>
                 <div className="flex gap-2">
                    <span className="text-[9px] font-bold text-slate-500">BPM: 124</span>
                    <span className="text-[9px] font-bold text-slate-500">KEY: Cm</span>
                 </div>
              </div>
              <div className="grid grid-cols-8 gap-3">
                 {result.drums.map((d, i) => (
                   <div key={i} className="flex flex-col gap-2">
                      <div className={`h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-[9px] font-black ${d ? 'opacity-100 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'opacity-10'}`}>
                        {d || 'X'}
                      </div>
                      <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                         <div className={`h-full bg-blue-500 ${d ? 'animate-pulse' : ''}`} style={{ width: d ? '100%' : '0%' }}></div>
                      </div>
                   </div>
                 ))}
              </div>
            </div>

            {/* AI Lyrics & Vocals */}
            <div className="grid grid-cols-2 gap-6">
               <div className="bg-slate-950/80 p-6 rounded-3xl border border-slate-800 shadow-xl group hover:border-blue-500/30 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] text-blue-500 uppercase font-black tracking-widest flex items-center gap-2">
                      <TextIcon size={12} /> AI Lyricist
                    </span>
                    <Download size={12} className="text-slate-700 cursor-pointer hover:text-white" />
                  </div>
                  <p className="text-slate-300 italic text-[11px] leading-relaxed select-text">
                    {result.lyrics}
                  </p>
               </div>

               <div className="bg-slate-950/80 p-6 rounded-3xl border border-slate-800 shadow-xl group hover:border-emerald-500/30 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] text-emerald-500 uppercase font-black tracking-widest flex items-center gap-2">
                      <Volume2 size={12} /> AI Vocalist
                    </span>
                    <button onClick={playVocals} className="text-[9px] font-black text-white bg-emerald-600/20 hover:bg-emerald-600/40 px-3 py-1 rounded-lg transition-all">
                      PREVIEW
                    </button>
                  </div>
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">SCRIPT</span>
                    <p className="text-slate-200 font-black text-xs">"{result.vocalScript}"</p>
                    <div className="flex gap-2 mt-2">
                       {['REVERB', 'AUTOTUNE', 'DELAY'].map(fx => (
                         <span key={fx} className="text-[8px] font-black px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-600 rounded-md">{fx}</span>
                       ))}
                    </div>
                  </div>
               </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 border-t border-slate-800 pt-8">
               <button className="flex-1 bg-slate-800 hover:bg-slate-700 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 transition-all shadow-lg">Load Stems A</button>
               <button className="flex-1 bg-slate-800 hover:bg-slate-700 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 transition-all shadow-lg">Load Stems B</button>
               <button className="px-6 bg-blue-600 hover:bg-blue-500 py-3 rounded-2xl text-white transition-all shadow-xl">
                 <Download size={16} />
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIComposer;
