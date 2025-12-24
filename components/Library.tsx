
import React, { useState } from 'react';
import { Search, Music, Plus, Play, MoreVertical } from 'lucide-react';
import { Track } from '../types';
import { SAMPLE_TRACKS } from '../constants';

interface LibraryProps {
  onLoadToDeck: (track: Track, side: 'LEFT' | 'RIGHT') => void;
}

const Library: React.FC<LibraryProps> = ({ onLoadToDeck }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTracks = SAMPLE_TRACKS.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-950/40 border-t border-slate-800 backdrop-blur-sm">
      <div className="p-4 border-b border-slate-800/50 flex items-center justify-between">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text" 
            placeholder="Search tracks, artists, genres..." 
            className="w-full bg-slate-900/80 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4 items-center">
           <button className="text-xs font-bold text-slate-400 hover:text-white uppercase tracking-widest">My Collection</button>
           <button className="text-xs font-bold text-slate-400 hover:text-white uppercase tracking-widest">History</button>
           <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors">
              <Plus size={14} /> Import Track
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-500 sticky top-0 bg-slate-950/90 backdrop-blur-md z-10 border-b border-slate-800/50">
            <tr>
              <th className="px-6 py-3 font-medium uppercase tracking-tighter text-[10px]">Track</th>
              <th className="px-6 py-3 font-medium uppercase tracking-tighter text-[10px]">Artist</th>
              <th className="px-6 py-3 font-medium uppercase tracking-tighter text-[10px]">BPM</th>
              <th className="px-6 py-3 font-medium uppercase tracking-tighter text-[10px]">Key</th>
              <th className="px-6 py-3 font-medium uppercase tracking-tighter text-[10px]">Genre</th>
              <th className="px-6 py-3 font-medium uppercase tracking-tighter text-[10px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/30">
            {filteredTracks.map(track => (
              <tr key={track.id} className="group hover:bg-slate-900/50 transition-colors">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <img src={track.cover} className="w-10 h-10 rounded shadow-lg object-cover" alt="" />
                    <span className="font-medium text-slate-200">{track.title}</span>
                  </div>
                </td>
                <td className="px-6 py-3 text-slate-400">{track.artist}</td>
                <td className="px-6 py-3 font-mono text-blue-400/80">{track.bpm}</td>
                <td className="px-6 py-3 font-mono text-purple-400/80">{track.key}</td>
                <td className="px-6 py-3">
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full text-[10px]">
                    {track.genre}
                  </span>
                </td>
                <td className="px-6 py-3 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onLoadToDeck(track, 'LEFT')}
                      className="bg-blue-900/40 hover:bg-blue-800/60 text-blue-300 px-3 py-1 rounded text-[10px] font-bold uppercase"
                    >
                      Deck A
                    </button>
                    <button 
                      onClick={() => onLoadToDeck(track, 'RIGHT')}
                      className="bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 px-3 py-1 rounded text-[10px] font-bold uppercase"
                    >
                      Deck B
                    </button>
                    <button className="p-1 hover:bg-slate-700 rounded text-slate-400">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Library;
