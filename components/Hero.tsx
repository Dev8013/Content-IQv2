
import React from 'react';

interface HeroProps {
  onStartClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartClick }) => {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 px-6">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/20 blur-[120px] rounded-full pointer-events-none -mr-48 -mt-24"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none -ml-40 -mb-20"></div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-violet-500/20 text-sm font-bold text-violet-500 mb-8 animate-float">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
          </span>
          V3.0 IS NOW LIVE
        </div>

        <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight">
          Transform Your Content with <span className="bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">AI Intelligence</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
          Analyze YouTube videos, PDFs, and Resumes instantly. Get quality scores, 
          improvement suggestions, and level up your metrics with gaming-grade analytics.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            onClick={onStartClick}
            className="group relative px-10 py-5 bg-violet-600 rounded-2xl font-black text-xl text-white shadow-2xl shadow-violet-500/40 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative z-10 flex items-center gap-3">
              Start Analyzing For Free
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="m9 18 6-6-6-6"/></svg>
            </span>
          </button>
          
          <button className="px-10 py-5 glass border border-white/10 rounded-2xl font-black text-xl hover:bg-white/5 transition-all">
            View Pricing
          </button>
        </div>

        <div className="mt-24 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent z-10"></div>
          <div className="glass rounded-[2rem] p-4 border border-white/10 neon-border overflow-hidden">
             <img 
               src="https://picsum.photos/1200/600?grayscale" 
               alt="Dashboard Preview" 
               className="rounded-2xl w-full opacity-60"
             />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
