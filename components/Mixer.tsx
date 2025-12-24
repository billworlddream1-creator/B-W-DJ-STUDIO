
import React from 'react';
import { Sliders, Zap, Activity } from 'lucide-react';

interface MixerProps {
  crossfader: number;
  onCrossfaderChange: (val: number) => void;
  masterVolume: number;
  onMasterVolumeChange: (val: number) => void;
  eq: {
    left: { low: number; mid: number; high: number };
    right: { low: number; mid: number; high: number };
  };
  onEqChange: (side: 'left' | 'right', band: 'low' | 'mid' | 'high', val: number) => void;
}

const Mixer: React.FC<MixerProps> = ({ 
  crossfader, 
  onCrossfaderChange, 
  masterVolume, 
  onMasterVolumeChange,
  eq,
  onEqChange
}) => {
  return (
    <div className="flex flex-col w-72 bg-slate-900 border-x border-slate-800 h-full p-4 gap-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-[10px] font-bold tracking-widest text-slate-500 uppercase flex items-center gap-2">
          <Activity size={12} className="text-blue-500" />
          Mixer Section
        </h3>
        <Zap size={14} className="text-yellow-500 animate-pulse" />
      </div>

      {/* EQs */}
      <div className="grid grid-cols-2 gap-4 flex-1">
        {/* Left Deck EQ */}
        <div className="flex flex-col gap-6 items-center py-2 bg-slate-800/30 rounded-xl">
          <EQKnob label="HI" value={eq.left.high} onChange={(v) => onEqChange('left', 'high', v)} />
          <EQKnob label="MID" value={eq.left.mid} onChange={(v) => onEqChange('left', 'mid', v)} />
          <EQKnob label="LOW" value={eq.left.low} onChange={(v) => onEqChange('left', 'low', v)} />
          <div className="mt-auto h-32 w-4 bg-slate-950 rounded-full relative overflow-hidden flex flex-col-reverse">
            <div 
               className="w-full bg-blue-500 transition-all duration-75"
               style={{ height: `${(1 - crossfader) * 100}%` }}
            ></div>
          </div>
          <span className="text-[8px] font-bold text-slate-600">VOL L</span>
        </div>

        {/* Right Deck EQ */}
        <div className="flex flex-col gap-6 items-center py-2 bg-slate-800/30 rounded-xl">
          <EQKnob label="HI" value={eq.right.high} onChange={(v) => onEqChange('right', 'high', v)} />
          <EQKnob label="MID" value={eq.right.mid} onChange={(v) => onEqChange('right', 'mid', v)} />
          <EQKnob label="LOW" value={eq.right.low} onChange={(v) => onEqChange('right', 'low', v)} />
          <div className="mt-auto h-32 w-4 bg-slate-950 rounded-full relative overflow-hidden flex flex-col-reverse">
             <div 
               className="w-full bg-purple-500 transition-all duration-75"
               style={{ height: `${crossfader * 100}%` }}
            ></div>
          </div>
          <span className="text-[8px] font-bold text-slate-600">VOL R</span>
        </div>
      </div>

      {/* Master Section */}
      <div className="flex flex-col gap-4 mt-auto pt-6 border-t border-slate-800">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>MASTER GAIN</span>
            <span>{Math.round(masterVolume * 100)}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={masterVolume} 
            onChange={(e) => onMasterVolumeChange(parseFloat(e.target.value))}
            className="w-full accent-white" 
          />
        </div>

        {/* Crossfader */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>CROSSFADER</span>
            <Sliders size={12} />
          </div>
          <div className="relative h-8 bg-slate-950 rounded-lg flex items-center px-1 border border-slate-800 shadow-inner">
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={crossfader} 
              onChange={(e) => onCrossfaderChange(parseFloat(e.target.value))}
              className="absolute inset-x-2 opacity-0 cursor-pointer z-10"
            />
            <div 
              className="absolute w-12 h-6 bg-slate-300 rounded shadow-md border-b-2 border-slate-400 flex items-center justify-center transition-all duration-75"
              style={{ left: `calc(${crossfader * 100}% - ${crossfader * 48}px)` }}
            >
              <div className="w-0.5 h-4 bg-slate-500"></div>
            </div>
            <div className="flex w-full justify-between px-2 pointer-events-none">
              <span className="text-[10px] font-bold text-slate-700">A</span>
              <span className="text-[10px] font-bold text-slate-700">B</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EQKnob: React.FC<{ label: string; value: number; onChange: (v: number) => void }> = ({ label, value, onChange }) => (
  <div className="flex flex-col items-center gap-1 group">
    <div className="relative w-10 h-10 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center cursor-pointer shadow-lg active:ring-2 active:ring-blue-500/50 transition-all">
       <div 
         className="absolute w-1 h-3 bg-blue-500 top-1 rounded-full origin-bottom"
         style={{ transform: `rotate(${(value - 0.5) * 240}deg)` }}
       ></div>
       <input 
         type="range" 
         min="0" 
         max="1" 
         step="0.01" 
         value={value} 
         onChange={(e) => onChange(parseFloat(e.target.value))}
         className="absolute inset-0 opacity-0 cursor-pointer"
       />
    </div>
    <span className="text-[9px] font-bold text-slate-500 group-hover:text-slate-300 transition-colors uppercase tracking-tight">{label}</span>
  </div>
);

export default Mixer;
