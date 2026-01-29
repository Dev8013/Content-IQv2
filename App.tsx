
import React, { useState, useEffect, useCallback } from 'react';
import { AnalysisType, HistoryItem, User } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import Analyzer from './components/Analyzer';
import Footer from './components/Footer';
import { PuterStorageService } from './services/puterStorageService';

declare const puter: any;

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('ciq_theme');
    return saved ? saved === 'dark' : true;
  });

  const [user, setUser] = useState<User>({
    username: '',
    isLoggedIn: false
  });
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [resetCounter, setResetCounter] = useState(0);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('ciq_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  useEffect(() => {
    const body = document.body;
    if (isDarkMode) {
      body.classList.add('dark');
      body.classList.remove('light', 'bg-slate-50', 'text-slate-900');
      body.classList.add('bg-slate-950', 'text-slate-200');
    } else {
      body.classList.add('light');
      body.classList.remove('dark', 'bg-slate-950', 'text-slate-200');
      body.classList.add('bg-slate-50', 'text-slate-900');
    }
  }, [isDarkMode]);

  const syncFromPuter = async () => {
    setIsSyncing(true);
    try {
      const data = await PuterStorageService.getHistory();
      setHistory(data);
    } catch (e) {
      console.warn("Puter Cloud sync error:", e);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (await puter.auth.isSignedIn()) {
        const pUser = await puter.auth.getUser();
        setUser({
          username: pUser.username,
          isLoggedIn: true,
          avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${pUser.username}`
        });
        syncFromPuter();
      }
    };
    initAuth();
  }, []);

  const saveToHistory = async (item: HistoryItem) => {
    const newHistory = [item, ...history].slice(0, 50);
    setHistory(newHistory);
    
    if (user.isLoggedIn) {
      setIsSyncing(true);
      await PuterStorageService.saveHistory(newHistory);
      setIsSyncing(false);
    }
  };

  const handleLogin = async () => {
    try {
      const pUser = await puter.auth.signIn();
      setUser({
        username: pUser.username,
        isLoggedIn: true,
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${pUser.username}`
      });
      syncFromPuter();
    } catch (e) {
      console.error("Login failed:", e);
    }
  };

  const handleLogout = useCallback(async () => {
    puter.auth.signOut();
    setUser({ username: '', isLoggedIn: false });
    setHistory([]);
    setResetCounter(c => c + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleHomeClick = () => {
    setResetCounter(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen flex flex-col relative transition-colors duration-500`}>
      <Header 
        user={user} 
        onLogin={handleLogin} 
        onLogout={handleLogout} 
        isSyncing={isSyncing}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onNavigate={(id) => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onHomeClick={handleHomeClick}
      />
      
      <main className="flex-grow">
        {!user.isLoggedIn ? (
          <Hero onStartClick={handleLogin} />
        ) : (
          <section id="workspace-section" className="py-32 px-6 max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-6">
              <div className="animate-in fade-in slide-in-from-left-4 duration-700">
                <h2 className="text-5xl md:text-6xl font-heading font-extrabold tracking-tight dark:text-white text-slate-900">
                  Neural <span className="text-violet-500">Suite</span>
                </h2>
                <div className="flex items-center gap-3 mt-4">
                  <div className={`w-2.5 h-2.5 rounded-full ${isSyncing ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]'}`}></div>
                  <span className="text-xs font-semibold dark:text-slate-400 text-slate-500 uppercase tracking-widest">
                    {isSyncing ? 'Synchronizing Cloud Buffer...' : 'Puter Cloud Link: Secure'}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-4 animate-in fade-in slide-in-from-right-4 duration-700">
                 <div className="px-8 py-4 glass rounded-[2rem] flex flex-col items-center min-w-[140px]">
                    <span className="text-[10px] font-bold dark:text-slate-500 text-slate-400 uppercase tracking-widest mb-1">Cache Utilization</span>
                    <span className="text-2xl font-heading font-extrabold dark:text-white text-slate-900">{history.length} <span className="text-sm text-slate-400 font-medium">/ 50</span></span>
                 </div>
              </div>
            </div>

            <Analyzer 
              key={`analyzer-${resetCounter}`}
              onResultSaved={saveToHistory} 
              history={history} 
              onClearHistory={async () => {
                if (confirm('Are you sure you want to purge the neural archive?')) {
                  setHistory([]);
                  await PuterStorageService.clearHistory();
                }
              }}
            />
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
