
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Settings, Bell, User, LayoutGrid, Disc, Music, Database, Sparkles, ShieldCheck, DollarSign, Users, MessageCircle, Volume2, TrendingUp } from 'lucide-react';
import Deck from './components/Deck';
import Mixer from './components/Mixer';
import Library from './components/Library';
import AIAssistant from './components/AIAssistant';
import Instruments from './components/Instruments';
import AIComposer from './components/AIComposer';
import AdminPortal from './components/AdminPortal';
import AuthModal from './components/AuthModal';
import SFXBoard from './components/SFXBoard';
import { Track, Side, BottomSection, AppView, UserProfile } from './types';

const THEMES = [
  { name: 'Classic Blue', primary: 'blue', hex: '#3b82f6' },
  { name: 'Emerald Forest', primary: 'emerald', hex: '#10b981' },
  { name: 'Vibrant Purple', primary: 'purple', hex: '#a855f7' },
  { name: 'Volcano Orange', primary: 'amber', hex: '#f59e0b' },
  { name: 'Deep Rose', primary: 'rose', hex: '#f43f5e' },
];

const PRO_MESSAGES = [
  "UNLOCK UNLIMITED AI COMPOSITIONS WITH PRO",
  "PRO PLAN: 48KHZ LOSSLESS AUDIO EXPORT",
  "JOIN 500+ DJ'S WHO UPGRADED THIS WEEK",
  "PRO EXCLUSIVE: REAL-TIME VOCAL SYNTHESIS",
  "UPGRADE TO PRO FOR AD-FREE PERFORMANCE",
  "GET 2X REFERRAL BONUSES ON PRO TIER",
  "PRO USERS GET PRIORITY AI PROCESSING",
  "UNLEASH THE FULL POWER OF GEMINI 3 PRO",
  "GO PRO: EXCLUSIVE SFX PACKS UNLOCKED",
  "ADVANCED MISSION CONTROL DASHBOARD IN PRO"
];

const PRO_WELCOME = [
  "PRO STATUS ACTIVE - ALL SYSTEMS GO",
  "WELCOME BACK, STUDIO MASTER",
  "GEMINI 3 PRO ENGINE: ONLINE",
  "ULTRA-LOW LATENCY MODE ENABLED",
  "PREMIUM CLOUD SYNC: CONNECTED"
];

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.STUDIO);
  const [theme, setTheme] = useState(THEMES[0]);
  const [promoText, setPromoText] = useState("");

  const [leftDeck, setLeftDeck] = useState({ track: null, isPlaying: false, rate: 1.0 });
  const [rightDeck, setRightDeck] = useState({ track: null, isPlaying: false, rate: 1.0 });
  const [mixer, setMixer] = useState({
    crossfader: 0.5,
    masterVolume: 0.8,
    eq: { left: { low: 0.5, mid: 0.5, high: 0.5 }, right: { low: 0.5, mid: 0.5, high: 0.5 } }
  });
  const [bottomSection, setBottomSection] = useState<BottomSection>(BottomSection.LIBRARY);

  // Dynamic Promo Logic
  useEffect(() => {
    const updatePromo = () => {
      const messages = user?.tier === 'PRO' ? PRO_WELCOME : PRO_MESSAGES;
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      setPromoText(randomMsg);
    };

    updatePromo(); // Initial set
    const interval = setInterval(updatePromo, 1000); // Update every second
    return () => clearInterval(interval);
  }, [user?.tier]);

  const handleAuth = (username: string) => {
    const randomTheme = THEMES[Math.floor(Math.random() * THEMES.length)];
    setTheme(randomTheme);
    setUser({
      id: Math.random().toString(36).substr(2, 9),
      username,
      tier: 'FREE',
      referralCode: `DJ-${username.toUpperCase()}-001`,
      referralCount: 0,
      joinedAt: new Date().toISOString(),
      themeColor: randomTheme.primary
    });
  };

  const handleLoadTrack = useCallback((track: Track, side: Side) => {
    if (side === Side.LEFT) setLeftDeck(p => ({ ...p, track }));
    else setRightDeck(p => ({ ...p, track }));
  }, []);

  const handleEqChange = (side: 'left' | 'right', band: 'low' | 'mid' | 'high', val: number) => {
    setMixer(prev => ({
      ...prev,
      eq: { ...prev.eq, [side]: { ...prev.eq[side], [band]: val } }
    }));
  };

  const leftVolume = mixer.masterVolume * (1 - mixer.crossfader);
  const rightVolume = mixer.masterVolume * mixer.crossfader;

  const handleWhatsAppShare = () => {
    if (!user) return;
    const message = encodeURIComponent(`Check out B&W DJ Studio! It's an awesome AI-powered DJ app. Use my referral code: ${user.referralCode} to join!`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  if (!user) return <AuthModal onAuth={handleAuth} />;

  return (
    <div className="flex flex-col h-screen select-none bg-slate-950 overflow-hidden text-slate-100">
      {/* Top Navigation */}
      <header className="h-14 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-6 z-20 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setCurrentView(AppView.STUDIO)}>
             <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-[20deg]`} style={{ backgroundColor: theme.hex }}>
               <Disc className="text-white animate-spin-slow" size={22} />
             </div>
             <div>
                <h1 className="text-sm font-black tracking-[0.2em] gradient-text uppercase">B&W DJ STUDIO</h1>
                <div className="flex gap-1 -mt-0.5">
                   <div className="h-[2px] w-4 bg-blue-500"></div>
                   <div className="h-[2px] w-2 bg-slate-700"></div>
                </div>
             </div>
          </div>
          <nav className="hidden md:flex gap-1 ml-4 bg-slate-900/50 p-1 rounded-xl border border-slate-800">
            <button onClick={() => setCurrentView(AppView.STUDIO)} className={`text-[9px] font-black px-4 py-1.5 rounded-lg uppercase tracking-widest transition-all ${currentView === AppView.STUDIO ? 'bg-slate-100 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}>Performance</button>
            <button onClick={() => setCurrentView(AppView.ADMIN)} className={`text-[9px] font-black px-4 py-1.5 rounded-lg uppercase tracking-widest transition-all ${currentView === AppView.ADMIN ? 'bg-slate-100 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}>Mission Control</button>
          </nav>
        </div>

        {/* PRO PROMOTION CENTER */}
        <div className="hidden lg:flex flex-1 justify-center px-10">
          <div className="relative group cursor-pointer">
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${user.tier === 'PRO' ? 'from-emerald-500 to-teal-500' : 'from-blue-600 to-purple-600'} rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse`}></div>
            <div className="relative px-6 py-1.5 bg-slate-950 border border-slate-800 rounded-full flex items-center gap-3">
              <TrendingUp size={14} className={user.tier === 'PRO' ? 'text-emerald-500' : 'text-blue-500'} />
              <span className="text-[10px] font-mono font-bold tracking-tight text-slate-300 w-[320px] overflow-hidden whitespace-nowrap">
                {promoText}
              </span>
              {user.tier === 'FREE' && (
                <button className="text-[8px] font-black bg-blue-600 hover:bg-blue-500 text-white px-2 py-0.5 rounded transition-colors uppercase">
                  UPGRADE
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 px-4 py-1.5 rounded-xl shadow-inner">
             <div className="flex items-center gap-1.5">
                <Users size={12} className="text-blue-500" />
                <span className="text-[9px] font-black text-slate-300">REF: {user.referralCount}</span>
             </div>
             <div className="w-px h-3 bg-slate-800"></div>
             <div className="flex items-center gap-1.5 cursor-pointer hover:text-blue-400 transition-colors">
                <DollarSign size={12} className={user.tier === 'PRO' ? 'text-emerald-500' : 'text-green-500'} />
                <span className="text-[9px] font-black text-slate-300 uppercase">{user.tier} TIER</span>
             </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all hover:border-slate-600"><Bell size={16} /></button>
            <button className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all hover:border-slate-600"><Settings size={16} /></button>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 cursor-pointer hover:bg-slate-700 transition-colors">
             <User size={18} />
          </div>
        </div>
      </header>

      {/* Main Content Router */}
      <main className="flex flex-1 overflow-hidden relative">
        {currentView === AppView.STUDIO ? (
          <div className="flex flex-1 overflow-hidden">
            <div className="flex flex-col flex-1 overflow-hidden">
              {/* Studio Decks & Mixer */}
              <div className="flex flex-1 items-stretch p-6 gap-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900/40 via-slate-950 to-slate-950">
                <div className="flex-1 flex flex-col justify-center">
                  <Deck 
                    side={Side.LEFT} track={leftDeck.track} isPlaying={leftDeck.isPlaying}
                    onTogglePlay={() => setLeftDeck(p => ({ ...p, isPlaying: !p.isPlaying }))}
                    playbackRate={leftDeck.rate} onRateChange={(r) => setLeftDeck(p => ({ ...p, rate: r }))}
                    volume={leftVolume}
                  />
                </div>
                <Mixer 
                  crossfader={mixer.crossfader} onCrossfaderChange={(val) => setMixer(p => ({ ...p, crossfader: val }))}
                  masterVolume={mixer.masterVolume} onMasterVolumeChange={(val) => setMixer(p => ({ ...p, masterVolume: val }))}
                  eq={mixer.eq} onEqChange={handleEqChange}
                />
                <div className="flex-1 flex flex-col justify-center">
                  <Deck 
                    side={Side.RIGHT} track={rightDeck.track} isPlaying={rightDeck.isPlaying}
                    onTogglePlay={() => setRightDeck(p => ({ ...p, isPlaying: !p.isPlaying }))}
                    playbackRate={rightDeck.rate} onRateChange={(r) => setRightDeck(p => ({ ...p, rate: r }))}
                    volume={rightVolume}
                  />
                </div>
              </div>

              {/* Bottom Nav Area */}
              <div className="h-2/5 shrink-0 relative">
                 {/* Integrated Navigation Tabs */}
                 <div className="absolute top-0 left-0 right-0 h-10 -translate-y-full flex justify-center z-10">
                    <div className="bg-slate-900/95 backdrop-blur border border-slate-800 border-b-0 rounded-t-2xl px-6 flex items-center gap-8 shadow-2xl">
                      <button onClick={() => setBottomSection(BottomSection.LIBRARY)} className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] py-2 transition-all relative ${bottomSection === BottomSection.LIBRARY ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}>
                        <Database size={12} /> Library
                        {bottomSection === BottomSection.LIBRARY && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 rounded-full"></div>}
                      </button>
                      <button onClick={() => setBottomSection(BottomSection.INSTRUMENTS)} className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] py-2 transition-all relative ${bottomSection === BottomSection.INSTRUMENTS ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}>
                        <Music size={12} /> Performance
                        {bottomSection === BottomSection.INSTRUMENTS && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 rounded-full"></div>}
                      </button>
                      <button onClick={() => setBottomSection(BottomSection.SFX)} className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] py-2 transition-all relative ${bottomSection === BottomSection.SFX ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}>
                        <Volume2 size={12} /> SFX Board
                        {bottomSection === BottomSection.SFX && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 rounded-full"></div>}
                      </button>
                      <button onClick={() => setBottomSection(BottomSection.COMPOSE)} className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] py-2 transition-all relative ${bottomSection === BottomSection.COMPOSE ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}>
                        <Sparkles size={12} /> AI Composition
                        {bottomSection === BottomSection.COMPOSE && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 rounded-full"></div>}
                      </button>
                    </div>
                 </div>
                 <div className="h-full relative overflow-hidden bg-slate-900/20">
                   {bottomSection === BottomSection.LIBRARY && <Library onLoadToDeck={handleLoadTrack} />}
                   {bottomSection === BottomSection.INSTRUMENTS && <Instruments />}
                   {bottomSection === BottomSection.SFX && <SFXBoard />}
                   {bottomSection === BottomSection.COMPOSE && <AIComposer />}
                 </div>
              </div>
            </div>
            <AIAssistant leftTrack={leftDeck.track} rightTrack={rightDeck.track} />
          </div>
        ) : (
          <AdminPortal />
        )}
      </main>

      {/* Modern Status Footer */}
      <footer className="h-10 bg-slate-950 border-t border-slate-800 flex items-center justify-between px-6 text-[9px] font-mono text-slate-500 uppercase tracking-widest z-20 shadow-inner">
        <div className="flex gap-6 items-center">
           <span className="flex items-center gap-1.5" style={{ color: theme.hex }}>
             <ShieldCheck size={12} /> 
             <span className="font-black">CORE: {theme.name}</span>
           </span>
           <span className="flex items-center gap-1.5">
             <LayoutGrid size={12} className="text-slate-700" /> 
             ACTIVE: {user.username}
           </span>
        </div>
        <div className="flex gap-8 items-center">
           <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <span className="text-blue-500 font-black">CODE: {user.referralCode}</span>
                <button 
                  onClick={handleWhatsAppShare}
                  className="flex items-center gap-1.5 bg-green-600/10 hover:bg-green-600/30 text-green-500 px-3 py-1 rounded-lg border border-green-500/20 transition-all group"
                  title="Share referral code via WhatsApp"
                >
                  <MessageCircle size={10} className="group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline font-black">WHATSAPP</span>
                </button>
             </div>
           </div>
           <div className="flex items-center gap-6">
             <span>L: 4.2ms</span>
             <span className="text-slate-300 font-black bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{new Date(user.joinedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
