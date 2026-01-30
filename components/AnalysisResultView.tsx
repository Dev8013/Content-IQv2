
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
    <div className="mt-20 space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-1000 pb-20">
      <div className="flex items-center gap-6">
        <h2 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight dark:text-white text-slate-900">
          Analysis <span className="text-violet-500">Insights</span>
        </h2>
        <div className="h-[2px] flex-grow bg-gradient-to-r from-violet-600/30 via-slate-500/10 to-transparent"></div>
        <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold dark:text-slate-500 text-slate-400 uppercase tracking-widest glass px-5 py-2.5 rounded-full">
          <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse"></div>
          Neural Engine: Active
        </div>
      </div>

      {type === AnalysisType.IMAGE_GEN ? (
        <div className="glass p-5 rounded-[3rem] border shadow-2xl relative group max-w-5xl mx-auto transition-transform hover:scale-[1.01]">
          {result.generatedImageUrl ? (
            <img src={result.generatedImageUrl} className="w-full rounded-[2.2rem] shadow-2xl" alt="AI Generated Asset" />
          ) : (
            <div className="w-full aspect-video dark:bg-slate-900 bg-slate-100 rounded-[2.2rem] flex items-center justify-center">
              <span className="text-slate-400 font-bold uppercase tracking-widest">Image Generation Interface Failure</span>
            </div>
          )}
          <div className="absolute top-12 left-12 flex items-center gap-3 px-6 py-3 bg-white/10 dark:bg-black/80 backdrop-blur-2xl rounded-2xl text-xs font-bold uppercase tracking-widest border dark:border-white/10 border-slate-200">
            <span className="w-2.5 h-2.5 bg-violet-500 rounded-full animate-pulse"></span>
            Neural Asset Finalized
          </div>
          <button 
            onClick={() => {
              if (result.generatedImageUrl) {
                const link = document.createElement('a');
                link.href = result.generatedImageUrl;
                link.download = `content-iq-art-${Date.now()}.png`;
                link.click();
              }
            }}
            className="absolute bottom-12 right-12 bg-violet-600 hover:bg-violet-700 text-white p-6 rounded-3xl shadow-2xl transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>
            </svg>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-12">
            
            {/* METADATA SECTION */}
            {(type === AnalysisType.YOUTUBE || type === AnalysisType.RESUME) && (
              <div className="glass rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-violet-500/5 blur-[100px] rounded-full pointer-events-none"></div>
                
                {type === AnalysisType.YOUTUBE && result.thumbnailUrl && (
                  <div className="mb-12 relative group overflow-hidden rounded-[2.2rem] shadow-2xl">
                    <img src={result.thumbnailUrl} className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105" alt="Video Feed" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                    <div className="absolute bottom-8 left-8 flex items-center gap-3 px-5 py-2.5 bg-black/40 backdrop-blur-xl rounded-2xl text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">
                       <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                       Video Stream Buffer
                    </div>
                  </div>
                )}

                <div className="space-y-10">
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                    <span className="text-xs font-bold text-violet-500 uppercase tracking-[0.2em] mb-3 block">
                      {type === AnalysisType.RESUME ? 'Neural Candidate Identification' : 'Neural Title Extraction'}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight dark:text-white text-slate-900 leading-tight">
                      {result.title}
                    </h1>
                  </div>

                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-xs font-bold text-violet-500 uppercase tracking-[0.2em] block">
                        {type === AnalysisType.RESUME ? 'Target Skill Keywords' : 'Optimization Tags'}
                      </span>
                      <button 
                        onClick={handleCopyTags}
                        className={`text-[10px] font-bold uppercase tracking-widest px-5 py-2 rounded-xl border transition-all ${
                          copyStatus === 'copied' 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                          : 'dark:bg-white/5 bg-slate-100 dark:border-white/10 border-slate-200 dark:text-slate-400 text-slate-500 hover:text-violet-500 hover:border-violet-500/30'
                        }`}
                      >
                        {copyStatus === 'copied' ? 'Copied to Neural Cache' : 'Copy All'}
                      </button>
                    </div>
                    {result.tags && result.tags.length > 0 && (
                      <div className="flex flex-wrap gap-3">
                        {result.tags.map((tag, i) => (
                          <span key={i} className="px-4 py-2 dark:bg-white/5 bg-slate-100 border dark:border-white/5 border-slate-200 rounded-xl text-[11px] font-bold dark:text-slate-400 text-slate-600 uppercase tracking-wider hover:border-violet-500/30 transition-all">
                            {type === AnalysisType.RESUME ? tag : `#${tag.trim().replace(/\s+/g, '')}`}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {type === AnalysisType.YOUTUBE && (
                    <div className="p-10 dark:bg-black/30 bg-slate-50 rounded-[2.2rem] border dark:border-white/5 border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 shadow-inner">
                      <span className="text-xs font-bold dark:text-slate-500 text-slate-400 uppercase tracking-[0.2em] mb-5 block">Optimized SEO Description</span>
                      <div className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">
                        {result.description}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* THUMBNAIL AUDIT SECTION */}
            {type === AnalysisType.YOUTUBE && result.thumbnailReview && (
              <div className="glass p-12 rounded-[3rem] border border-cyan-500/20 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-5 text-cyan-500 transition-opacity group-hover:opacity-10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/></svg>
                </div>
                <h3 className="text-2xl font-heading font-extrabold mb-8 flex items-center gap-4 uppercase tracking-tight text-cyan-500">
                  <span className="w-1.5 h-8 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.4)]"></span>
                  Visual Impact Audit
                </h3>
                <div className="dark:bg-cyan-500/5 bg-cyan-50/50 p-10 rounded-[2rem] border border-cyan-500/10">
                   <div className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-mono whitespace-pre-wrap pl-2">
                      {result.thumbnailReview}
                   </div>
                </div>
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
                   <div className="px-8 py-5 dark:bg-white/5 bg-slate-50 border dark:border-white/5 border-slate-200 rounded-2xl">
                      <span className="text-[10px] font-bold uppercase text-cyan-500 tracking-widest block mb-1">Neural Color Grading</span>
                      <p className="text-sm font-bold dark:text-slate-400 text-slate-600">Optimal Contrast Distribution</p>
                   </div>
                   <div className="px-8 py-5 dark:bg-white/5 bg-slate-50 border dark:border-white/5 border-slate-200 rounded-2xl">
                      <span className="text-[10px] font-bold uppercase text-cyan-500 tracking-widest block mb-1">Retention Index</span>
                      <p className="text-sm font-bold dark:text-slate-400 text-slate-600">High Engagement Probability</p>
                   </div>
                </div>
              </div>
            )}

            {/* SUMMARY / STRATEGY SECTION */}
            <div className="glass p-12 rounded-[3rem] shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-heading font-extrabold flex items-center gap-4 uppercase tracking-tight dark:text-white text-slate-900">
                  <span className="w-1.5 h-8 bg-violet-500 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.3)]"></span>
                  {type === AnalysisType.PDF_REFINE ? 'Neural Modification Data' : 
                   type === AnalysisType.RESUME ? 'ATS Optimization Strategy' : 'Core Strategic Synopsis'}
                </h3>
                {type === AnalysisType.PDF_REFINE && (
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(result.summary);
                      alert('Data packet copied to clipboard.');
                    }}
                    className="px-6 py-2.5 bg-violet-600 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-violet-700 shadow-lg shadow-violet-500/20"
                  >
                    Copy Packet
                  </button>
                )}
              </div>
              <div className="text-lg text-slate-600 dark:text-slate-200 leading-relaxed font-mono dark:bg-black/30 bg-slate-50 p-10 rounded-[2.2rem] border dark:border-white/5 border-slate-200 shadow-inner whitespace-pre-wrap">
                {result.summary || "System link stable, but no packet data detected."}
              </div>
            </div>
            
            {/* ACTION POINTS / IMPROVEMENTS */}
            {result.improvements && result.improvements.length > 0 && (
              <div className="glass p-12 rounded-[3rem] shadow-xl">
                <h3 className="text-2xl font-heading font-extrabold mb-10 flex items-center gap-4 uppercase tracking-tight text-emerald-500">
                  <span className="w-1.5 h-8 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]"></span>
                  {type === AnalysisType.RESUME ? 'Resume Action Buffer' : 'Strategic Action Points'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {result.improvements.map((imp, i) => (
                    <div key={i} className="flex gap-5 p-7 dark:bg-white/5 bg-slate-50 rounded-2xl border dark:border-white/5 border-slate-200 hover:scale-[1.02] transition-all group shadow-sm">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-extrabold text-xs">✓</div>
                      <p className="dark:text-slate-300 text-slate-600 text-sm font-semibold leading-relaxed font-mono">{imp}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NEURAL SOURCES (Mandatory Google Search Display) */}
            {result.sources && result.sources.length > 0 && (
              <div className="glass p-12 rounded-[3rem] shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-heading font-extrabold mb-10 flex items-center gap-4 uppercase tracking-tight text-blue-500">
                  <span className="w-1.5 h-8 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]"></span>
                  Neural Grounding Sources
                </h3>
                <div className="space-y-4">
                  {result.sources.map((src, i) => (
                    <a 
                      key={i} 
                      href={src.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-6 dark:bg-white/5 bg-slate-50 rounded-2xl border dark:border-white/5 border-slate-200 hover:border-blue-500/30 transition-all group shadow-sm"
                    >
                      <div className="flex items-center gap-4 overflow-hidden">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                        </div>
                        <span className="text-sm font-bold dark:text-slate-300 text-slate-600 truncate">{src.title}</span>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-400 group-hover:text-blue-500 transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-10">
            <div className="grid grid-cols-2 gap-5 animate-in fade-in slide-in-from-right-4 duration-700">
              <ScoreBadge label={type === AnalysisType.RESUME ? "Match" : "Logic"} score={result.scores?.clarity ?? 0} color="cyan" />
              <ScoreBadge label={type === AnalysisType.RESUME ? "ATS" : "Impact"} score={result.scores?.engagement ?? 0} color="emerald" />
              <ScoreBadge label={type === AnalysisType.RESUME ? "Skills" : "Flow"} score={result.scores?.structure ?? 0} color="purple" />
              <ScoreBadge label="Neural IQ" score={result.scores?.overall ?? 0} color="violet" />
            </div>

            <div className="glass p-10 rounded-[3rem] border dark:border-violet-500/10 border-violet-500/5 dark:bg-violet-600/5 bg-violet-50 sticky top-28 shadow-xl">
              <h4 className="text-xs font-bold text-violet-500 uppercase tracking-[0.3em] mb-10 text-center">Neural Optimization Archive</h4>
              <div className="space-y-10">
                {Object.entries(result.tips || {}).map(([key, value]) => (
                  value && (
                    <div key={key} className="relative pl-6 border-l-2 border-violet-500/20 hover:border-violet-500 transition-colors">
                      <h5 className="text-[10px] font-extrabold uppercase tracking-widest text-violet-500 mb-2">{key} Protocol</h5>
                      <p className="text-sm dark:text-slate-400 text-slate-600 font-semibold leading-relaxed font-mono">{value}</p>
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

const ScoreBadge = ({ label, score, color }: { label: string; score: number; color: string }) => {
  const colorMap: any = {
    violet: 'text-violet-500',
    cyan: 'text-cyan-500',
    emerald: 'text-emerald-500',
    purple: 'text-purple-500'
  };
  const barMap: any = {
    violet: 'bg-violet-500',
    cyan: 'bg-cyan-500',
    emerald: 'bg-emerald-500',
    purple: 'bg-purple-500'
  };
  return (
    <div className="glass p-7 rounded-[2rem] border flex flex-col items-center justify-center text-center group hover:scale-105 transition-all shadow-sm">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] dark:text-slate-500 text-slate-400 mb-4">{label}</span>
      <div className={`text-4xl font-heading font-extrabold ${colorMap[color]} mb-3 font-mono`}>{score}</div>
      <div className="w-12 h-1.5 dark:bg-white/10 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${barMap[color]} shadow-[0_0_8px_rgba(0,0,0,0.2)]`} 
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
};

export default AnalysisResultView;
