
import React, { useState } from 'react';
import { 
  Users, TrendingUp, DollarSign, Activity, Search, Cpu, Globe, 
  Zap, Clock, ShieldAlert, UserPlus, Mail, Trash2, Send, 
  CheckCircle2, AlertCircle, XCircle 
} from 'lucide-react';
import { UserProfile, AdminMessage } from '../types';

const INITIAL_USERS: UserProfile[] = [
  { id: '1', username: 'MixMaster_Z', tier: 'PRO', referralCode: 'DJ-Z-01', referralCount: 12, joinedAt: '2024-01-10', status: 'ACTIVE', lastActive: '2 mins ago', themeColor: 'blue' },
  { id: '2', username: 'BeatLord', tier: 'FREE', referralCode: 'DJ-BEAT-02', referralCount: 3, joinedAt: '2024-02-15', status: 'ACTIVE', lastActive: '14 mins ago', themeColor: 'emerald' },
  { id: '3', username: 'SynthWave_Girl', tier: 'PRO', referralCode: 'DJ-SW-03', referralCount: 45, joinedAt: '2023-12-01', status: 'ACTIVE', lastActive: '1 hour ago', themeColor: 'purple' },
  { id: '4', username: 'Suspect_DJ', tier: 'FREE', referralCode: 'DJ-SUS-04', referralCount: 0, joinedAt: '2024-05-20', status: 'SUSPENDED', lastActive: '2 days ago', themeColor: 'rose' },
];

const AdminPortal: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [messageTarget, setMessageTarget] = useState<string | 'ALL'>('ALL');
  const [messageContent, setMessageContent] = useState('');
  const [newUserName, setNewUserName] = useState('');

  const stats = [
    { label: 'Total Users', val: users.length.toString(), change: '+12.5%', icon: Users, color: 'text-blue-500', trend: 'up' },
    { label: 'Pro Revenue', val: `$${(users.filter(u => u.tier === 'PRO').length * 29).toFixed(0)}k`, change: '+8.2%', icon: DollarSign, color: 'text-green-500', trend: 'up' },
    { label: 'Security Alerts', val: users.filter(u => u.status !== 'ACTIVE').length.toString(), change: 'Check Logs', icon: ShieldAlert, color: 'text-rose-500', trend: 'neutral' },
    { label: 'Daily Active', val: '542', change: '+22.1%', icon: Zap, color: 'text-amber-500', trend: 'up' },
  ];

  const handleRemoveUser = (id: string) => {
    if (confirm("Are you sure you want to PERMANENTLY revoke access for this user? This action is logged for security compliance.")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleAddUser = () => {
    if (!newUserName) return;
    const newUser: UserProfile = {
      id: Math.random().toString(36).substr(2, 9),
      username: newUserName,
      tier: 'FREE',
      referralCode: `DJ-${newUserName.toUpperCase()}-01`,
      referralCount: 0,
      joinedAt: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
      lastActive: 'Just now',
      themeColor: 'blue'
    };
    setUsers([...users, newUser]);
    setNewUserName('');
    setShowAddModal(false);
  };

  const handleSendMessage = () => {
    if (!messageContent) return;
    const newMessage: AdminMessage = {
      id: Date.now().toString(),
      targetUserId: messageTarget,
      content: messageContent,
      timestamp: new Date().toLocaleTimeString(),
      sender: 'System Admin'
    };
    setMessages([newMessage, ...messages]);
    setMessageContent('');
    alert(`Message dispatched to: ${messageTarget === 'ALL' ? 'Global Broadcast' : messageTarget}`);
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 bg-slate-950 p-8 overflow-y-auto">
      {/* Admin Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <h2 className="text-2xl font-black text-white tracking-tight uppercase">Mission Control</h2>
           </div>
           <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em]">B&W DJ STUDIO GLOBAL INSTANCE: #BW-X092</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => setShowAddModal(true)}
             className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20"
           >
             <UserPlus size={16} /> New User
           </button>
           <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Cpu size={14} className="text-blue-500" />
                <span className="text-[10px] font-mono text-slate-300 uppercase">CPU: 14%</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe size={14} className="text-emerald-500" />
                <span className="text-[10px] font-mono text-slate-300 uppercase">UPTIME: 99.9%</span>
              </div>
           </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        {stats.map((s, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl group hover:border-blue-500/30 transition-all shadow-xl">
             <div className="flex justify-between items-start mb-6">
                <div className={`p-3 bg-slate-950 rounded-2xl ${s.color} border border-slate-800`}>
                   <s.icon size={20} />
                </div>
                <div className="text-[9px] font-black text-slate-500">{s.change}</div>
             </div>
             <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{s.label}</span>
             <h3 className="text-3xl font-black text-white mt-2 group-hover:scale-105 transition-transform origin-left">{s.val}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* User Management Section */}
        <div className="col-span-8 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Users size={16} className="text-blue-500" /> User Command Center
            </h4>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input 
                type="text" 
                placeholder="Search database..." 
                className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 w-64 shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 border-b border-slate-800">
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest">Username</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest">Tier</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest">Status</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest">Last Active</th>
                  <th className="pb-4 text-right text-[10px] font-black uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="group hover:bg-slate-900/30 transition-colors">
                    <td className="py-5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400">
                        {user.username[0]}
                      </div>
                      <span className="text-sm font-bold text-slate-200">{user.username}</span>
                    </td>
                    <td className="py-5">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${user.tier === 'PRO' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-700/20 text-slate-500'}`}>
                        {user.tier}
                      </span>
                    </td>
                    <td className="py-5">
                      <div className="flex items-center gap-1.5">
                        {user.status === 'ACTIVE' ? <CheckCircle2 size={12} className="text-emerald-500" /> : <XCircle size={12} className="text-rose-500" />}
                        <span className={`text-[9px] font-black uppercase ${user.status === 'ACTIVE' ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 text-xs text-slate-500 font-mono">{user.lastActive}</td>
                    <td className="py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setMessageTarget(user.username)}
                          className="p-2 bg-slate-800 hover:bg-blue-600/20 text-blue-400 rounded-lg transition-colors"
                          title="Message User"
                        >
                          <Send size={14} />
                        </button>
                        <button 
                          onClick={() => handleRemoveUser(user.id)}
                          className="p-2 bg-slate-800 hover:bg-rose-600/20 text-rose-400 rounded-lg transition-colors"
                          title="Revoke Access"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Communication & Logs */}
        <div className="col-span-4 flex flex-col gap-8">
          {/* Signal Dispatcher (Messaging) */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-2xl">
             <h4 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <Mail size={16} className="text-blue-500" /> Signal Dispatcher
             </h4>
             <div className="space-y-4">
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase block mb-1.5">Recipient</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:ring-1 focus:ring-blue-500 outline-none"
                    value={messageTarget}
                    onChange={(e) => setMessageTarget(e.target.value)}
                  >
                    <option value="ALL">GLOBAL BROADCAST</option>
                    {users.map(u => <option key={u.id} value={u.username}>{u.username}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase block mb-1.5">Payload</label>
                  <textarea 
                    placeholder="Enter message for user/network..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-300 focus:ring-1 focus:ring-blue-500 outline-none h-32 resize-none shadow-inner"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                  />
                </div>
                <button 
                  onClick={handleSendMessage}
                  disabled={!messageContent}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-3 rounded-xl text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 disabled:opacity-50"
                >
                  Dispatch Signal
                </button>
             </div>
          </div>

          {/* System Logs */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex-1 shadow-2xl">
             <div className="flex items-center justify-between mb-6">
                <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                   <Clock size={16} className="text-amber-500" /> Session History
                </h4>
                <div className="px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded text-[8px] font-black">AUDIT ON</div>
             </div>
             <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle size={24} className="text-slate-800 mx-auto mb-2" />
                    <p className="text-[10px] text-slate-600 font-bold uppercase">No Signals Dispatched</p>
                  </div>
                ) : (
                  messages.map(m => (
                    <div key={m.id} className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl border-l-2 border-l-blue-500">
                       <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">TO: {m.targetUserId}</span>
                          <span className="text-[8px] font-mono text-slate-600">{m.timestamp}</span>
                       </div>
                       <p className="text-[10px] text-slate-500 leading-tight truncate">{m.content}</p>
                    </div>
                  ))
                )}
             </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[150] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
              <h3 className="text-lg font-black text-white uppercase tracking-widest mb-6">Onboard New DJ</h3>
              <div className="space-y-4">
                 <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase block mb-1.5">Signal Identifier (Username)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. TechnoViking"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 focus:ring-1 focus:ring-blue-500 outline-none"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setShowAddModal(false)}
                      className="py-3 bg-slate-800 text-slate-400 font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleAddUser}
                      className="py-3 bg-blue-600 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40"
                    >
                      Create DJ
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPortal;
