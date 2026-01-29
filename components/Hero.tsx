
import React from 'react';

interface HeroProps {
  onStartClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartClick }) => {
  return (
    <section className="relative overflow-hidden pt-40 pb-32 px-6">
      {/* Soothing Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] glow-violet pointer-events-none -mr-48 -mt-24 opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-600/5 blur-[120px] rounded-full pointer-events-none -ml-40 -mb-20"></div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-2xl glass border dark:border-violet-500/20 border-violet-500/10 text-xs font-bold text-violet-500 mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-500"></span>
          </span>
          <span className="tracking-[0.3em] uppercase">V3.1 Neural Release</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-heading font-extrabold mb-10 leading-[1.05] tracking-tight dark:text-white text-slate-900 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
          Supercharge Your Content with <span className="bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent">Neural Intelligence</span>
        </h1>
        
        <p className="text-xl md:text-2xl dark:text-slate-400 text-slate-500 max-w-4xl mx-auto mb-16 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
          Automated YouTube auditing, document refinement, and SEO synthesis. 
          Bridge the gap between raw data and high-impact metrics with Puter-powered cloud analytics.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
          <button 
            onClick={onStartClick}
            className="group relative px-12 py-6 bg-violet-600 rounded-[2rem] font-heading font-extrabold text-2xl text-white shadow-2xl shadow-violet-500/40 overflow-hidden active:scale-95 transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative z-10 flex items-center gap-4">
              Access Workspace
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1.5 transition-transform"><path d="m9 18 6-6-6-6"/></svg>
            </span>
          </button>
          
          <button className="px-12 py-6 glass rounded-[2rem] font-heading font-extrabold text-2xl dark:text-white text-slate-900 hover:scale-105 transition-all shadow-sm">
            View Analytics Protocol
          </button>
        </div>

        <div className="mt-32 relative animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
          <div className="absolute inset-0 bg-gradient-to-t dark:from-slate-950 from-slate-50 via-transparent to-transparent z-10"></div>
          <div className="glass rounded-[3.5rem] p-5 border dark:border-white/10 border-slate-200 overflow-hidden shadow-2xl">
             <img 
               src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1600&q=80" 
               alt="Neural Dashboard" 
               className="rounded-[2.5rem] w-full dark:opacity-40 opacity-90 transition-opacity duration-1000"
             />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
