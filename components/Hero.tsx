
import React from 'react';

interface HeroProps {
  onStartClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartClick }) => {
  return (
    <section className="relative overflow-hidden pt-40 pb-32 px-6">
      {/* Background Blooms */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] social-gradient opacity-10 blur-[120px] pointer-events-none -mr-48 -mt-24"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -ml-40 -mb-20"></div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full glass border dark:border-white/10 text-xs font-black text-slate-500 mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-social-brand opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-social-brand"></span>
          </span>
          <span className="tracking-[0.1em] uppercase font-mono">Creator Protocol v4.0</span>
        </div>

        <h1 className="text-6xl md:text-9xl font-heading font-black mb-10 leading-[0.95] tracking-tighter dark:text-white text-slate-900 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
          Empowering the <span className="bg-clip-text text-transparent social-gradient italic">Algorithm.</span>
        </h1>
        
        <p className="text-xl md:text-2xl dark:text-slate-400 text-slate-500 max-w-4xl mx-auto mb-16 leading-tight font-medium animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
          The ultimate creator suite for viral analysis, competitor intelligence, and trend-driven strategy. 
          Built for creators who demand high-fidelity insights and cloud-based asset archival.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
          <button 
            onClick={onStartClick}
            className="group relative px-12 py-6 social-gradient rounded-full font-heading font-black text-2xl text-white shadow-2xl shadow-social-brand/20 active:scale-95 transition-all overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-4">
              Enter Studio
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1.5 transition-transform"><path d="m9 18 6-6-6-6"/></svg>
            </span>
          </button>
          
          <button className="px-12 py-6 glass rounded-full font-heading font-black text-2xl dark:text-white text-slate-900 hover:scale-105 transition-all border">
            View Features
          </button>
        </div>

        <div className="mt-32 relative animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
          <div className="absolute inset-0 bg-gradient-to-t dark:from-dark-bg from-light-bg via-transparent to-transparent z-10"></div>
          <div className="glass rounded-[4rem] p-6 border shadow-2xl">
             <img 
               src="https://images.unsplash.com/photo-1626379953822-baec19c3bbcd?auto=format&fit=crop&w=1600&q=80" 
               alt="Digital Workspace" 
               className="rounded-[3rem] w-full dark:opacity-60 opacity-90 transition-opacity duration-1000 object-cover h-[500px]"
             />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
