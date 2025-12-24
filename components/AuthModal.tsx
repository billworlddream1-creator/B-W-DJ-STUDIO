
import React from 'react';
import { User, Mail, Lock, LogIn, Sparkles } from 'lucide-react';

interface AuthModalProps {
  onAuth: (username: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onAuth }) => {
  const [username, setUsername] = React.useState('');

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-300">
        <div className="flex flex-col items-center text-center gap-4 mb-8">
           <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/40">
              <Sparkles className="text-white" size={32} />
           </div>
           <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">B&W DJ STUDIO</h2>
              <p className="text-sm text-slate-500">The world's first AI-powered DJ ecosystem</p>
           </div>
        </div>

        <div className="space-y-4">
           <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input 
                type="text" 
                placeholder="Username" 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-4 text-slate-200 outline-none focus:ring-1 focus:ring-blue-500" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
           </div>
           <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input type="email" placeholder="Email Address" className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-4 text-slate-200 outline-none focus:ring-1 focus:ring-blue-500" />
           </div>
           <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input type="password" placeholder="Password" className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-4 text-slate-200 outline-none focus:ring-1 focus:ring-blue-500" />
           </div>

           <button 
             onClick={() => onAuth(username || 'DJ_Guest')}
             className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"
           >
              <LogIn size={20} /> START MIXING
           </button>
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
           By joining, you agree to our <span className="text-blue-500 cursor-pointer">Terms of Service</span> and <span className="text-blue-500 cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
