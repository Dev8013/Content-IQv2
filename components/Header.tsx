
import React, { useState } from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  onLogin: () => void;
  onLogout: () => void;
  isSyncing: boolean;
  onNavigate: (id: string) => void;
  onHomeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  user, onLogin, onLogout, isSyncing, onNavigate, onHomeClick
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 h-20 px-6">
      <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={onHomeClick}
        >
          <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white font-black group-hover:rotate-12 transition-transform shadow-[0_0_20px_rgba(139,92,246,0.3)]">IQ</div>
          <span className="text-2xl font-black tracking-tighter uppercase italic">Content <span className="text-violet-500">IQ</span></span>
        </div>

        <nav className="hidden lg:flex items-center gap-10 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">
          <button 
            onClick={() => onNavigate('workspace-section')} 
            className="hover:text-white transition-colors py-2 border-b-2 border-transparent hover:border-violet-500/50"
          >
            Workspace
          </button>
          <button 
            onClick={() => onNavigate('history-section')} 
            className="hover:text-white transition-colors py-2 border-b-2 border-transparent hover:border-violet-500/50"
          >
            Archive
          </button>
        </nav>

        <div className="flex items-center gap-6">
          {user.isLoggedIn ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2">
                   {isSyncing && <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>}
                   <span className="text-[10px] font-black text-white uppercase">{user.username}</span>
                </div>
                <span className="text-[8px] font-bold text-violet-500 uppercase tracking-widest">PUTER NEURAL LINK</span>
              </div>
              
              <div 
                className="relative" 
                onMouseEnter={() => setShowProfileMenu(true)} 
                onMouseLeave={() => setShowProfileMenu(false)}
              >
                <img 
                  src={user.avatar} 
                  className={`w-10 h-10 rounded-xl border transition-all cursor-pointer ${showProfileMenu ? 'border-violet-500 scale-105 shadow-lg shadow-violet-500/20' : 'border-white/10'}`} 
                  alt="Profile"
                />
                
                {showProfileMenu && (
                  <div className="absolute top-full right-0 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="glass p-2 rounded-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] min-w-[200px] overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/5 mb-1 bg-white/5 text-center">
                        <p className="text-[10px] font-bold text-white truncate">{user.username}</p>
                      </div>
                      <button 
                        onClick={onLogout}
                        className="w-full text-left px-4 py-3 text-[10px] font-black text-red-400 hover:bg-red-400/10 rounded-xl transition-all flex items-center justify-between group/btn"
                      >
                        DISCONNECT
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover/btn:translate-x-1 transition-transform">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button 
              onClick={onLogin}
              className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-black text-[10px] rounded-xl transition-all shadow-[0_5px_20px_rgba(139,92,246,0.3)] uppercase tracking-widest flex items-center gap-3 active:scale-95"
            >
              Neural Connect
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
