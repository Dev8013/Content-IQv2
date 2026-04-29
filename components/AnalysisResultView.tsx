
import React, { useState } from 'react';
import { AnalysisResult, AnalysisType } from '../types';

interface Props {
  result: AnalysisResult;
  type: AnalysisType;
}

const AnalysisResultView: React.FC<Props> = ({ result, type }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  if (!result) return null;

  const handleCopyTags = () => {
    if (result.tags && result.tags.length > 0) {
      const tagString = result.tags.join(', ');
      navigator.clipboard.writeText(tagString);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  return (
    <div className="mt-20 space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-1000 pb-24">
      <div className="flex items-center gap-6">
        <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tighter dark:text-white text-slate-900 italic">
          Channel <span className="text-social-brand">Pulse</span>
        </h2>
        <div className="h-[2px] flex-grow bg-gradient-to-r from-social-brand/30 via-slate-500/10 to-transparent"></div>
        <div className="hidden sm:flex items-center gap-2 text-[10px] font-black dark:text-slate-500 text-slate-400 uppercase tracking-widest glass px-5 py-3 rounded-full border">
          <div className="w-2 h-2 bg-social-brand rounded-full animate-pulse shadow-lg shadow-social-brand/50"></div>
          Sync: Real-time
        </div>
      </div>

      {type === AnalysisType.IMAGE_GEN ? (
        <div className="glass p-6 rounded-[4rem] border shadow-2xl relative group max-w-5xl mx-auto transition-all hover:shadow-social-brand/10">
          {result.generatedImageUrl ? (
            <img src={result.generatedImageUrl} className="w-full rounded-[3rem] shadow-2xl" alt="AI Asset" />
          ) : (
            <div className="w-full aspect-video dark:bg-black/50 bg-slate-100 rounded-[3rem] flex items-center justify-center">
              <span className="text-slate-400 font-black uppercase tracking-widest">Asset Render Failed</span>
            </div>
          )}
          <div className="absolute top-12 left-12 flex items-center gap-3 px-6 py-3 bg-white/20 dark:bg-black/80 backdrop-blur-3xl rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
            <span className="w-2.5 h-2.5 bg-social-brand rounded-full animate-pulse"></span>
            Verified Neural Asset
          </div>
          <button 
            onClick={() => {
              if (result.generatedImageUrl) {
                const link = document.createElement('a');
                link.href = result.generatedImageUrl;
                link.download = `content-iq-${Date.now()}.png`;
                link.click();
              }
            }}
            className="absolute bottom-12 right-12 social-gradient text-white p-6 rounded-full shadow-2xl transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>
            </svg>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            
            {/* CONTENT MODULE */}
            {(type === AnalysisType.YOUTUBE || type === AnalysisType.RESUME) && (
              <div className="glass rounded-[4rem] p-10 md:p-14 shadow-2xl relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-80 h-80 social-gradient opacity-10 blur-[120px] rounded-full pointer-events-none"></div>
                
                {type === AnalysisType.YOUTUBE && result.thumbnailUrl && (
                  <div className="mb-14 relative group overflow-hidden rounded-[3.5rem] shadow-2xl border-4 border-white dark:border-black/50">
                    <img src={result.thumbnailUrl} className="w-full aspect-video object-cover transition-transform duration-1000 group-hover:scale-110" alt="Preview" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
                    <div className="absolute bottom-10 left-10 flex items-center gap-3 px-6 py-3 bg-black/40 backdrop-blur-2xl rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
                       <span className="w-2.5 h-2.5 bg-social-brand rounded-full animate-pulse"></span>
                       LIVE FEED BUFFER
                    </div>
                  </div>
                )}

                <div className="space-y-12">
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                    <span className="text-[10px] font-black text-social-brand uppercase tracking-widest mb-4 block px-4 py-1.5 bg-social-brand/5 rounded-full w-fit">
                      {type === AnalysisType.RESUME ? 'Profile Analysis' : 'Algorithm Title'}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tighter dark:text-white text-slate-900 leading-[0.95] italic">
                      {result.title}
                    </h1>
                  </div>

                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                        {type === AnalysisType.RESUME ? 'Core Competencies' : 'Viral Tags'}
                      </span>
                      <button 
                        onClick={handleCopyTags}
                        className={`text-[9px] font-black uppercase tracking-widest px-6 py-2.5 rounded-full border transition-all ${
                          copyStatus === 'copied' 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                          : 'dark:bg-white/5 bg-slate-100 dark:border-white/10 border-slate-200 dark:text-slate-400 text-slate-500 hover:text-social-brand hover:border-social-brand/30'
                        }`}
                      >
                        {copyStatus === 'copied' ? 'Copied' : 'Copy All'}
                      </button>
                    </div>
                    {result.tags && result.tags.length > 0 && (
                      <div className="flex flex-wrap gap-3">
                        {result.tags.map((tag, i) => (
                          <span key={i} className="px-5 py-2.5 dark:bg-black/50 bg-slate-100 border dark:border-white/5 border-slate-200 rounded-full text-xs font-bold dark:text-slate-400 text-slate-600 transition-all hover:border-social-brand/30 cursor-default">
                            {type === AnalysisType.RESUME ? tag : `#${tag.trim().replace(/\s+/g, '')}`}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {type === AnalysisType.YOUTUBE && (
                    <div className="p-10 dark:bg-black/50 bg-slate-100 rounded-[3rem] border shadow-inner animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                      <span className="text-[10px] font-black dark:text-slate-500 text-slate-400 uppercase tracking-widest mb-6 block">Optimized Insight Description</span>
                      <div className="text-xl text-slate-600 dark:text-slate-300 leading-tight font-bold italic whitespace-pre-wrap">
                        {result.description}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VISUAL AUDIT */}
            {type === AnalysisType.YOUTUBE && result.thumbnailReview && (
              <div className="glass p-12 md:p-14 rounded-[4rem] border shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-12 opacity-5 text-social-brand group-hover:opacity-10 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/></svg>
                </div>
                <h3 className="text-3xl font-heading font-black mb-10 flex items-center gap-4 uppercase tracking-tighter text-social-brand italic">
                  <span className="w-2 h-10 social-gradient rounded-full"></span>
                  Visual Strategy
                </h3>
                <div className="dark:bg-black/50 bg-slate-100 p-10 rounded-[3rem] border">
                   <div className="text-xl text-slate-600 dark:text-slate-200 leading-tight font-bold italic whitespace-pre-wrap">
                      {result.thumbnailReview}
                   </div>
                </div>
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div className="px-10 py-6 glass rounded-[2.5rem] border">
                      <span className="text-[10px] font-black uppercase text-social-brand tracking-widest block mb-2">Color Alignment</span>
                      <p className="text-lg font-black dark:text-slate-300 text-slate-700 leading-none">Optimal Saturation</p>
                   </div>
                   <div className="px-10 py-6 glass rounded-[2.5rem] border">
                      <span className="text-[10px] font-black uppercase text-social-brand tracking-widest block mb-2">Impression Hit</span>
                      <p className="text-lg font-black dark:text-slate-300 text-slate-700 leading-none">High CTR Forecast</p>
                   </div>
                </div>
              </div>
            )}

            {/* SYNOPSIS MODULE */}
            <div className="glass p-12 md:p-14 rounded-[4rem] shadow-2xl relative overflow-hidden border">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-3xl font-heading font-black flex items-center gap-4 uppercase tracking-tighter dark:text-white text-slate-900 italic">
                  <span className="w-2 h-10 social-gradient rounded-full"></span>
                  {type === AnalysisType.PDF_REFINE ? 'Modified Payload' : 
                   type === AnalysisType.RESUME ? 'Alignment Strategy' : 'Viral Synopsis'}
                </h3>
                {type === AnalysisType.PDF_REFINE && (
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(result.summary);
                    }}
                    className="px-8 py-3 social-gradient text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:opacity-90 shadow-xl shadow-social-brand/20"
                  >
                    Copy Output
                  </button>
                )}
              </div>
              <div className="text-xl text-slate-600 dark:text-slate-100 leading-tight font-bold italic dark:bg-black/50 bg-slate-100 p-12 rounded-[3.5rem] border shadow-inner whitespace-pre-wrap">
                {result.summary || "Algorithm sync complete. No divergent data detected."}
              </div>
            </div>
            
            {/* ACTION POINTS */}
            {result.improvements && result.improvements.length > 0 && (
              <div className="glass p-12 md:p-14 rounded-[4rem] shadow-2xl border">
                <h3 className="text-3xl font-heading font-black mb-12 flex items-center gap-4 uppercase tracking-tighter text-emerald-500 italic">
                  <span className="w-2 h-10 bg-emerald-500 rounded-full"></span>
                  Growth Tactics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {result.improvements.map((imp, i) => (
                    <div key={i} className="flex gap-6 p-8 dark:bg-black/40 bg-slate-50 rounded-[2.5rem] border hover:scale-[1.03] transition-all group shadow-sm">
                      <div className="w-8 h-8 rounded-full social-gradient flex items-center justify-center text-white font-black text-xs">✓</div>
                      <p className="dark:text-slate-200 text-slate-700 text-base font-bold leading-tight italic">{imp}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-12">
            <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-right-4 duration-700">
              <ScoreBadge label={type === AnalysisType.RESUME ? "Match" : "Logic"} score={result.scores?.clarity ?? 0} color="brand" />
              <ScoreBadge label={type === AnalysisType.RESUME ? "ATS" : "Impact"} score={result.scores?.engagement ?? 0} color="emerald" />
              <ScoreBadge label={type === AnalysisType.RESUME ? "Skills" : "Flow"} score={result.scores?.structure ?? 0} color="purple" />
              <ScoreBadge label="OVERALL" score={result.scores?.overall ?? 0} color="brand" gradient />
            </div>

            <div className="glass p-10 rounded-[4rem] border sticky top-28 shadow-2xl">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-12 text-center px-4 py-2 bg-slate-500/5 rounded-full w-fit mx-auto">Neural Archive Protocol</h4>
              <div className="space-y-12">
                {Object.entries(result.tips || {}).map(([key, value]) => (
                  value && (
                    <div key={key} className="relative pl-8 border-l-4 border-social-brand/20 hover:border-social-brand transition-all group">
                      <h5 className="text-xs font-black uppercase tracking-tighter text-social-brand mb-3 italic transition-all group-hover:translate-x-1">{key}</h5>
                      <p className="text-base dark:text-slate-400 text-slate-600 font-bold leading-tight italic">{value}</p>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ScoreBadge = ({ label, score, color, gradient }: { label: string; score: number; color: string; gradient?: boolean }) => {
  const colorMap: any = {
    brand: 'text-social-brand',
    emerald: 'text-emerald-500',
    purple: 'text-social-ig-purple',
  };
  const barMap: any = {
    brand: 'bg-social-brand',
    emerald: 'bg-emerald-500',
    purple: 'bg-social-ig-purple',
  };
  return (
    <div className={`glass p-10 rounded-[3rem] border flex flex-col items-center justify-center text-center transition-all shadow-xl group hover:scale-[1.02] ${gradient ? 'relative overflow-hidden' : ''}`}>
      {gradient && <div className="absolute inset-0 social-gradient opacity-5"></div>}
      <span className="text-[10px] font-black uppercase tracking-widest dark:text-slate-500 text-slate-400 mb-6">{label}</span>
      <div className={`text-6xl font-heading font-black ${gradient ? 'bg-clip-text text-transparent social-gradient italic' : colorMap[color]} mb-6 transition-transform group-hover:scale-110 duration-500`}>{score}</div>
      <div className="w-20 h-2 dark:bg-white/10 bg-slate-100 rounded-full overflow-hidden border dark:border-white/5">
        <div 
          className={`h-full ${gradient ? 'social-gradient' : barMap[color]} shadow-lg`} 
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
};

export default AnalysisResultView;
