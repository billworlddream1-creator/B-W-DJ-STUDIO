
import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, SkipBack, SkipForward, Info } from 'lucide-react';
import { Track, Side } from '../types';
import Waveform from './Waveform';

interface DeckProps {
  side: Side;
  track: Track | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  playbackRate: number;
  onRateChange: (rate: number) => void;
  volume: number;
}

const Deck: React.FC<DeckProps> = ({ 
  side, 
  track, 
  isPlaying, 
  onTogglePlay, 
  playbackRate, 
  onRateChange,
  volume 
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, track]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    let frameId: number;
    const animate = () => {
      if (isPlaying) {
        setRotation(prev => (prev + (playbackRate * 2)) % 360);
      }
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, playbackRate]);

  return (
    <div className={`flex flex-col gap-4 p-6 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-md shadow-2xl transition-all ${isPlaying ? 'ring-2 ring-blue-500/30' : ''}`}>
      {/* Header Info */}
      <div className="flex justify-between items-start h-12">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Deck {side}</span>
          <h2 className="text-lg font-bold text-slate-100 truncate w-48">
            {track ? track.title : 'No Track Loaded'}
          </h2>
          <p className="text-xs text-slate-400">
            {track ? track.artist : '---'}
          </p>
        </div>
        {track && (
          <div className="flex gap-2">
            <div className="px-2 py-1 bg-slate-800 rounded text-[10px] font-mono text-blue-400">
              {track.bpm} BPM
            </div>
            <div className="px-2 py-1 bg-slate-800 rounded text-[10px] font-mono text-purple-400">
              {track.key}
            </div>
          </div>
        )}
      </div>

      {/* Turntable Visualizer */}
      <div className="relative flex justify-center items-center py-4">
        <div 
          className="relative w-48 h-48 rounded-full border-4 border-slate-800 bg-slate-950 flex justify-center items-center overflow-hidden group shadow-inner"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Record Grooves */}
          <div className="absolute inset-0 border-[20px] border-slate-900/20 rounded-full"></div>
          <div className="absolute inset-0 border-[40px] border-slate-900/20 rounded-full"></div>
          
          {/* Label */}
          {track ? (
             <img src={track.cover} className="w-16 h-16 rounded-full border-2 border-slate-700 object-cover" alt="Label" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-700"></div>
          )}
          
          {/* Center Hole */}
          <div className="absolute w-2 h-2 bg-slate-400 rounded-full z-10"></div>
        </div>
        
        {/* Tone Arm (Fake) */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/4 h-1 bg-slate-700 origin-right -rotate-[30deg] pointer-events-none"></div>
      </div>

      {/* Waveform Visualization */}
      <div className="h-16 w-full bg-slate-950/80 rounded-lg overflow-hidden border border-slate-800 relative">
        <Waveform isPlaying={isPlaying} color={side === Side.LEFT ? '#3b82f6' : '#a855f7'} />
        {track && audioRef.current && (
           <audio 
             ref={audioRef} 
             src={track.url} 
             loop 
             onEnded={() => onTogglePlay()}
           />
        )}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-3 gap-4 items-center">
        <div className="flex flex-col gap-1 items-center">
           <label className="text-[9px] uppercase font-bold text-slate-500">Tempo</label>
           <input 
             type="range" 
             min="0.5" 
             max="1.5" 
             step="0.01" 
             value={playbackRate} 
             onChange={(e) => onRateChange(parseFloat(e.target.value))}
             className="w-full accent-blue-500"
           />
           <span className="text-[10px] font-mono text-slate-300">{(playbackRate * 100).toFixed(1)}%</span>
        </div>

        <div className="flex justify-center gap-2">
          <button 
            onClick={onTogglePlay}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-red-500 shadow-red-500/20 hover:bg-red-400' : 'bg-green-500 shadow-green-500/20 hover:bg-green-400'} text-white shadow-lg`}
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>
        </div>

        <div className="flex justify-end gap-2">
           <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
              <RotateCcw size={18} />
           </button>
           <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
              <Info size={18} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default Deck;
