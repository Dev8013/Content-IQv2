
import React, { useState, useEffect, useCallback } from 'react';
import { AnalysisType, HistoryItem, User } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import Analyzer from './components/Analyzer';
import Footer from './components/Footer';
import { PuterStorageService } from './services/puterStorageService';

declare const puter: any;

const App: React.FC = () => {
  const [user, setUser] = useState<User>({
    username: '',
    isLoggedIn: false
  });
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [resetCounter, setResetCounter] = useState(0);

  const syncFromPuter = async () => {
    setIsSyncing(true);
    try {
      const driveData = await PuterStorageService.getHistory();
      setHistory(driveData);
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
    <div className="min-h-screen flex flex-col relative">
      <Header 
        user={user} 
        onLogin={handleLogin} 
        onLogout={handleLogout} 
        isSyncing={isSyncing}
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
          <section id="workspace-section" className="py-24 px-6 max-w-[1440px] mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
              <div>
                <h2 className="text-5xl font-black uppercase tracking-tighter">Neural <span className="text-violet-500">Suite</span></h2>
                <div className="flex items-center gap-3 mt-2">
                  <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`}></div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {isSyncing ? 'Syncing Puter Buffer...' : 'Puter Cloud Status: Online'}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-4">
                 <div className="px-6 py-3 glass rounded-2xl border border-white/5 flex flex-col items-center min-w-[120px]">
                    <span className="text-[9px] font-black text-slate-500 uppercase mb-1">Archive Size</span>
                    <span className="text-xl font-black">{history.length} <span className="text-xs text-slate-600">/ 50</span></span>
                 </div>
              </div>
            </div>

            <Analyzer 
              key={`analyzer-${resetCounter}`}
              onResultSaved={saveToHistory} 
              history={history} 
              onClearHistory={async () => {
                setHistory([]);
                await PuterStorageService.clearHistory();
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
