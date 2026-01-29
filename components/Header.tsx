
import React, { useState } from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  onLogin: () => void;
  onLogout: () => void;
  isSyncing: boolean;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onNavigate: (id: string) => void;
  onHomeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  user, onLogin, onLogout, isSyncing, isDarkMode, onToggleTheme, onNavigate, onHomeClick
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass h-20 px-6">
      <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={onHomeClick}
        >
          <div className="w-10 h-10 bg-violet-600 rounded-2xl flex items-center justify-center text-white font-extrabold group-hover:scale-110 transition-transform shadow-[0_0_25px_rgba(139,92,246,0.3)]">IQ</div>
          <span className="text-2xl font-heading font-extrabold tracking-tight dark:text-white text-slate-900">Content <span className="text-violet-500">IQ</span></span>
        </div>

        <nav className="hidden lg:flex items-center gap-12 font-semibold text-xs uppercase tracking-widest dark:text-slate-400 text-slate-500">
          <button 
            onClick={() => onNavigate('workspace-section')} 
            className="hover:text-violet-500 transition-colors py-2"
          >
            Workspace
          </button>
          <button 
            onClick={() => onNavigate('history-section')} 
            className="hover:text-violet-500 transition-colors py-2"
          >
            Archive
          </button>
        </nav>

        <div className="flex items-center gap-6">
          {/* Theme Toggle */}
          <button 
            onClick={onToggleTheme}
            className="w-10 h-10 rounded-xl flex items-center justify-center dark:bg-white/5 bg-slate-100 hover:scale-110 transition-all border border-transparent dark:hover:border-white/10 hover:border-slate-200"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            )}
          </button>

          {user.isLoggedIn ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <div className="flex items-center gap-2">
                   {isSyncing && <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>}
                   <span className="text-xs font-bold dark:text-white text-slate-800">{user.username}</span>
                </div>
                <span className="text-[10px] font-semibold text-violet-500 uppercase tracking-widest">PUTER CLOUD</span>
              </div>
              
              <div 
                className="relative" 
                onMouseEnter={() => setShowProfileMenu(true)} 
                onMouseLeave={() => setShowProfileMenu(false)}
              >
                <img 
                  src={user.avatar} 
                  className={`w-10 h-10 rounded-2xl border transition-all cursor-pointer ${showProfileMenu ? 'border-violet-500 scale-105 shadow-lg shadow-violet-500/20' : 'dark:border-white/10 border-slate-200'}`} 
                  alt="Profile"
                />
                
                {showProfileMenu && (
                  <div className="absolute top-full right-0 pt-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="glass p-2 rounded-3xl border dark:border-white/10 border-slate-200 shadow-2xl min-w-[220px] overflow-hidden">
                      <div className="px-5 py-4 border-b dark:border-white/5 border-slate-100 mb-1">
                        <p className="text-xs font-bold dark:text-white text-slate-800 truncate">{user.username}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Verified Puter User</p>
                      </div>
                      <button 
                        onClick={onLogout}
                        className="w-full text-left px-5 py-3 text-xs font-bold text-red-500 hover:bg-red-500/5 rounded-2xl transition-all flex items-center justify-between group/btn"
                      >
                        Disconnect Link
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover/btn:translate-x-1 transition-transform">
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
              className="px-8 py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-2xl transition-all shadow-lg shadow-violet-500/20 uppercase tracking-widest active:scale-95"
            >
              Secure Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
