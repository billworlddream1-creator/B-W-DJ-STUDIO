
import React, { useEffect, useRef, useState } from 'react';
import { Drum, Music2, Power, Layers } from 'lucide-react';

const Instruments: React.FC = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playDrum = (type: 'kick' | 'snare' | 'hihat' | 'clap') => {
    initAudio();
    const ctx = audioCtxRef.current!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'kick') {
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } else if (type === 'snare') {
      const node = ctx.createBufferSource();
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      node.buffer = buffer;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(1, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      node.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      node.start();
    } else if (type === 'hihat') {
      const node = ctx.createBufferSource();
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      node.buffer = buffer;
      const highPass = ctx.createBiquadFilter();
      highPass.type = 'highpass';
      highPass.frequency.value = 7000;
      const hhGain = ctx.createGain();
      hhGain.gain.setValueAtTime(0.3, ctx.currentTime);
      hhGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      node.connect(highPass);
      highPass.connect(hhGain);
      hhGain.connect(ctx.destination);
      node.start();
    } else if (type === 'clap') {
      const node = ctx.createBufferSource();
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      node.buffer = buffer;
      const clapGain = ctx.createGain();
      clapGain.gain.setValueAtTime(0.7, ctx.currentTime);
      clapGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      node.connect(clapGain);
      clapGain.connect(ctx.destination);
      node.start();
    }
  };

  const playNote = (freq: number, noteName: string) => {
    initAudio();
    const ctx = audioCtxRef.current!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.8);
    setActiveKey(noteName);
    setTimeout(() => setActiveKey(null), 200);
  };

  const drumPads = [
    { label: 'KICK', type: 'kick' as const, color: 'bg-blue-600' },
    { label: 'SNARE', type: 'snare' as const, color: 'bg-purple-600' },
    { label: 'HI-HAT', type: 'hihat' as const, color: 'bg-emerald-600' },
    { label: 'CLAP', type: 'clap' as const, color: 'bg-amber-600' },
    { label: 'TOM 1', type: 'kick' as const, color: 'bg-blue-700' },
    { label: 'TOM 2', type: 'kick' as const, color: 'bg-blue-800' },
    { label: 'CRASH', type: 'hihat' as const, color: 'bg-emerald-700' },
    { label: 'RIDE', type: 'hihat' as const, color: 'bg-emerald-800' },
  ];

  const synthKeys = [
    { note: 'C4', freq: 261.63 },
    { note: 'D4', freq: 293.66 },
    { note: 'E4', freq: 329.63 },
    { note: 'F4', freq: 349.23 },
    { note: 'G4', freq: 392.00 },
    { note: 'A4', freq: 440.00 },
    { note: 'B4', freq: 493.88 },
    { note: 'C5', freq: 523.25 },
  ];

  return (
    <div className="flex h-full bg-slate-950/40 border-t border-slate-800 backdrop-blur-sm p-6 gap-8 overflow-hidden">
      {/* Drum Pad Section */}
      <div className="flex flex-col gap-4 w-1/3">
        <div className="flex items-center justify-between">
           <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
             <Drum size={14} /> Drum Machine
           </h3>
           <div className="flex gap-1">
             <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
           </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {drumPads.map((pad, idx) => (
            <button
              key={idx}
              onMouseDown={() => {
                setActivePad(idx);
                playDrum(pad.type);
                setTimeout(() => setActivePad(null), 100);
              }}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-2 transition-all transform active:scale-95 shadow-lg border border-slate-700/50 ${
                activePad === idx ? 'bg-white text-slate-900 ring-4 ring-blue-400/50 scale-105' : `${pad.color} text-white hover:brightness-110`
              }`}
            >
              <span className="text-[10px] font-bold tracking-tighter opacity-80">{pad.label}</span>
              <Layers size={14} className="opacity-50" />
            </button>
          ))}
        </div>
      </div>

      {/* Synth Section */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center justify-between">
           <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
             <Music2 size={14} /> Polyphonic Lead Synth
           </h3>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-mono">CUTOFF</span>
                <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-2/3 h-full bg-blue-500"></div>
                </div>
              </div>
              <Power size={14} className="text-blue-500" />
           </div>
        </div>
        <div className="flex-1 flex gap-1 bg-slate-900/50 p-2 rounded-2xl border border-slate-800 shadow-inner">
           {synthKeys.map((key) => (
             <button
               key={key.note}
               onMouseDown={() => playNote(key.freq, key.note)}
               className={`flex-1 rounded-lg flex flex-col items-center justify-end pb-4 transition-all transform active:translate-y-1 ${
                 activeKey === key.note 
                   ? 'bg-gradient-to-t from-blue-500 to-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)] border-blue-300' 
                   : 'bg-gradient-to-t from-slate-800 to-slate-700 border border-slate-600 hover:from-slate-700 hover:to-slate-600'
               }`}
             >
               <span className={`text-[10px] font-mono font-bold ${activeKey === key.note ? 'text-white' : 'text-slate-500'}`}>
                 {key.note}
               </span>
             </button>
           ))}
        </div>
      </div>

      {/* FX Section */}
      <div className="w-64 flex flex-col gap-4">
         <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Master FX</h3>
         <div className="grid grid-cols-2 gap-4 flex-1">
            <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-3 flex flex-col items-center justify-center gap-2">
               <div className="w-12 h-12 rounded-full border-2 border-slate-700 flex items-center justify-center">
                  <div className="w-1 h-4 bg-blue-500 -rotate-45 origin-bottom"></div>
               </div>
               <span className="text-[8px] font-bold text-slate-500 uppercase">Reverb</span>
            </div>
            <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-3 flex flex-col items-center justify-center gap-2">
               <div className="w-12 h-12 rounded-full border-2 border-slate-700 flex items-center justify-center">
                  <div className="w-1 h-4 bg-purple-500 rotate-12 origin-bottom"></div>
               </div>
               <span className="text-[8px] font-bold text-slate-500 uppercase">Delay</span>
            </div>
            <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-3 flex flex-col items-center justify-center gap-2">
               <div className="w-12 h-12 rounded-full border-2 border-slate-700 flex items-center justify-center">
                  <div className="w-1 h-4 bg-emerald-500 -rotate-90 origin-bottom"></div>
               </div>
               <span className="text-[8px] font-bold text-slate-500 uppercase">Distort</span>
            </div>
            <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-3 flex flex-col items-center justify-center gap-2">
               <div className="w-12 h-12 rounded-full border-2 border-slate-700 flex items-center justify-center">
                  <div className="w-1 h-4 bg-amber-500 rotate-45 origin-bottom"></div>
               </div>
               <span className="text-[8px] font-bold text-slate-500 uppercase">Phase</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Instruments;
