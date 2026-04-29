
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
    <header className="fixed top-0 left-0 right-0 z-50 glass h-20 px-6 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={onHomeClick}
        >
          <div className="w-10 h-10 social-gradient rounded-full flex items-center justify-center text-white font-black group-hover:rotate-12 transition-all shadow-xl shadow-social-brand/20">IQ</div>
          <span className="text-2xl font-heading font-black tracking-tighter dark:text-white text-slate-900 italic">Content<span className="text-social-brand">IQ</span></span>
        </div>

        <nav className="hidden lg:flex items-center gap-12 font-bold text-xs uppercase tracking-tight dark:text-slate-400 text-slate-500">
          <button 
            onClick={() => onNavigate('workspace-section')} 
            className="hover:text-social-brand transition-colors py-2 relative group"
          >
            Studio
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-social-brand transition-all group-hover:w-full"></span>
          </button>
          <button 
            onClick={() => onNavigate('history-section')} 
            className="hover:text-social-brand transition-colors py-2 relative group"
          >
            Archive
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-social-brand transition-all group-hover:w-full"></span>
          </button>
        </nav>

        <div className="flex items-center gap-6">
          <button 
            onClick={onToggleTheme}
            className="w-11 h-11 rounded-full flex items-center justify-center dark:bg-white/5 bg-slate-100 hover:scale-105 transition-all border dark:border-white/10"
            title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-amber-400"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-700"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            )}
          </button>

          {user.isLoggedIn ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <div className="flex items-center gap-2">
                   {isSyncing && <div className="w-1.5 h-1.5 bg-social-ig-orange rounded-full animate-pulse"></div>}
                   <span className="text-sm font-bold dark:text-white text-slate-800">{user.username}</span>
                </div>
                <span className="text-[10px] font-black bg-clip-text text-transparent social-gradient uppercase tracking-widest leading-none">CONNECTED</span>
              </div>
              
              <div 
                className="relative" 
                onMouseEnter={() => setShowProfileMenu(true)} 
                onMouseLeave={() => setShowProfileMenu(false)}
              >
                <div className="p-0.5 rounded-full social-gradient">
                  <img 
                    src={user.avatar} 
                    className={`w-10 h-10 rounded-full border-2 border-white dark:border-black transition-all cursor-pointer ${showProfileMenu ? 'scale-105' : ''}`} 
                    alt="Profile"
                  />
                </div>
                
                {showProfileMenu && (
                  <div className="absolute top-full right-0 pt-3 animate-in fade-in zoom-in-95 duration-200">
                    <div className="glass p-1.5 rounded-3xl border shadow-2xl min-w-[240px] overflow-hidden">
                      <div className="px-5 py-4 border-b dark:border-white/5 border-slate-100">
                        <p className="text-sm font-bold dark:text-white text-slate-800 truncate">{user.username}</p>
                        <p className="text-[10px] uppercase font-black text-slate-400 mt-1 tracking-tighter">Verified Creator</p>
                      </div>
                      <button 
                        onClick={onLogout}
                        className="w-full text-left px-5 py-3.5 text-xs font-bold text-red-500 hover:bg-red-500/5 rounded-2xl transition-all flex items-center justify-between group/btn mt-1"
                      >
                        Sign Out
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover/btn:translate-x-1 transition-transform">
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
              className="px-8 py-3 social-gradient hover:opacity-90 text-white font-black text-xs rounded-full transition-all shadow-xl shadow-social-brand/20 uppercase tracking-widest active:scale-95"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
