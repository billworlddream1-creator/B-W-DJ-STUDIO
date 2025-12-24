
import React, { useState } from 'react';
import { Volume2, Zap, Wind, Radio, Waves } from 'lucide-react';

const SFX_GROUPS = [
  {
    name: 'Impacts',
    icon: Zap,
    items: [
      { name: 'Cymbal Smash', color: 'bg-red-500' },
      { name: 'Sub Drop', color: 'bg-red-600' },
      { name: 'Glass Break', color: 'bg-red-700' },
      { name: 'Explosion', color: 'bg-red-800' },
    ]
  },
  {
    name: 'Transitions',
    icon: Wind,
    items: [
      { name: 'White Noise Rise', color: 'bg-blue-500' },
      { name: 'Reverse Crash', color: 'bg-blue-600' },
      { name: 'Vinyl Scratch', color: 'bg-blue-700' },
      { name: 'Tape Stop', color: 'bg-blue-800' },
    ]
  },
  {
    name: 'Vox Drops',
    icon: Radio,
    items: [
      { name: "Let's Go!", color: 'bg-emerald-500' },
      { name: 'Drop It!', color: 'bg-emerald-600' },
      { name: 'B&W Exclusive', color: 'bg-emerald-700' },
      { name: 'Hands Up!', color: 'bg-emerald-800' },
    ]
  },
  {
    name: 'Atmospheric',
    icon: Waves,
    items: [
      { name: 'Rain Loop', color: 'bg-amber-500' },
      { name: 'Vinyl Crackle', color: 'bg-amber-600' },
      { name: 'Street Crowd', color: 'bg-amber-700' },
      { name: 'Wind Chime', color: 'bg-amber-800' },
    ]
  }
];

const SFXBoard: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const triggerSFX = (name: string) => {
    setActiveId(name);
    // Simulation of sound
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = name.includes('Sub') ? 'sine' : 'square';
    osc.frequency.setValueAtTime(name.includes('Sub') ? 60 : 440, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);

    setTimeout(() => setActiveId(null), 200);
  };

  return (
    <div className="flex h-full bg-slate-950/40 border-t border-slate-800 backdrop-blur-sm p-6 gap-6 overflow-hidden">
      {SFX_GROUPS.map((group) => (
        <div key={group.name} className="flex-1 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <group.icon size={14} className="text-slate-500" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{group.name}</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 flex-1">
            {group.items.map((sfx) => (
              <button
                key={sfx.name}
                onMouseDown={() => triggerSFX(sfx.name)}
                className={`relative overflow-hidden rounded-xl flex flex-col items-center justify-center p-2 transition-all transform active:scale-95 border border-slate-700/50 shadow-lg ${
                  activeId === sfx.name 
                    ? 'ring-4 ring-white/30 scale-105 brightness-125' 
                    : `${sfx.color} hover:brightness-110`
                }`}
              >
                <span className="text-[9px] font-black text-white uppercase text-center leading-tight drop-shadow-md">
                  {sfx.name}
                </span>
                <div className="absolute top-1 right-1">
                  <Volume2 size={8} className="text-white/40" />
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="w-48 bg-slate-900/50 rounded-2xl border border-slate-800 p-4 flex flex-col gap-4">
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global SFX FX</h4>
        <div className="flex-1 flex flex-col justify-around">
           {['REVERB', 'ECHO', 'PITCH'].map(label => (
             <div key={label} className="flex flex-col gap-1">
               <div className="flex justify-between text-[8px] text-slate-400 font-bold">
                 <span>{label}</span>
                 <span>50%</span>
               </div>
               <div className="h-1 bg-slate-800 rounded-full">
                 <div className="h-full bg-blue-500 w-1/2"></div>
               </div>
             </div>
           ))}
        </div>
        <button className="w-full py-2 bg-slate-800 rounded-lg text-[10px] font-bold uppercase hover:bg-slate-700 transition-colors">Kill All</button>
      </div>
    </div>
  );
};

export default SFXBoard;
