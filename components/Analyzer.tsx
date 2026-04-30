
import React, { useState, useRef, useEffect } from 'react';
import { AnalysisType, AnalysisResult, HistoryItem } from '../types';
import { analyzeContent } from '../services/aiService';
import AnalysisResultView from './AnalysisResultView';

interface AnalyzerProps {
  onResultSaved: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  history: HistoryItem[];
  onClearHistory: () => void;
}

const Analyzer: React.FC<AnalyzerProps> = ({ 
  onResultSaved, onDeleteItem, history, onClearHistory
}) => {
  const [type, setType] = useState<AnalysisType>(AnalysisType.CHANNEL_DEEP_DIVE);
  const [input, setInput] = useState('');
  const [instructions, setInstructions] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [apiKeySelected, setApiKeySelected] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore - aistudio is injected by platform
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        // @ts-ignore
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setApiKeySelected(hasKey);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    // @ts-ignore
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setApiKeySelected(true); // Assume success as per guidelines to mitigate race conditions
    }
  };

  const startAnalysis = async (overriddenInput?: string, overriddenType?: AnalysisType) => {
    setIsAnalyzing(true);
    setError('');
    setResult(null);

    const targetType = overriddenType || type;
    const targetInput = overriddenInput || input;

    if (!targetInput && ![AnalysisType.RESUME, AnalysisType.PDF_REFINE].includes(targetType)) {
      setError('INPUT REQUIRED: ENTER TARGET HANDLE OR URL');
      setIsAnalyzing(false);
      return;
    }

    try {
      let payload: any = targetInput;
      if (targetType === AnalysisType.PDF || targetType === AnalysisType.RESUME || targetType === AnalysisType.PDF_REFINE) {
        if (!file) throw new Error('SOURCE FILE MISSING: UPLOAD REQUIRED');
        
        const mimeType = file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream');
        
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        payload = { data: base64Data, mimeType };
      }

      const res = await analyzeContent(targetType, payload, instructions);
      setResult(res);

      onResultSaved({
        id: Math.random().toString(36).substring(7),
        type: targetType,
        timestamp: Date.now(),
        title: targetType === AnalysisType.IMAGE_GEN ? `Art: ${targetInput.substring(0, 15)}...` : 
               targetType === AnalysisType.RESUME ? `Resume Match: ${file?.name}` :
               res.channelMetadata?.handle || res.title || `Scan ${new Date().toLocaleTimeString()}`,
        thumbnail: res.thumbnailUrl || res.generatedImageUrl || res.channelMetadata?.avatarUrl,
        result: res
      });
    } catch (err: any) {
      setError(err.message || 'NEURAL LINK INTERRUPTED');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleVideoClick = (videoId: string) => {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    setInput(videoUrl);
    setType(AnalysisType.YOUTUBE);
    startAnalysis(videoUrl, AnalysisType.YOUTUBE);
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setResult(item.result);
    setType(item.type);
    setError('');
    setInput('');
    setInstructions('');
    setFile(null);
    window.scrollTo({ top: document.getElementById('workspace-section')?.offsetTop ?? 0, behavior: 'smooth' });
  };

  const tabs = [
    { id: AnalysisType.CHANNEL_DEEP_DIVE, label: 'Channel Audit', icon: '🕵️' },
    { id: AnalysisType.YOUTUBE, label: 'Video SEO', icon: '🎬' },
    { id: AnalysisType.TREND_STRATEGY, label: 'Trend Matrix', icon: '📈' },
    { id: AnalysisType.COMPETITIVE_AUDIT, label: 'Spy Node', icon: '🚀' },
    { id: AnalysisType.IMAGE_GEN, label: 'Neural Art', icon: '🎨' },
    { id: AnalysisType.RESUME, label: 'Career Sync', icon: '💼' },
    { id: AnalysisType.PDF_REFINE, label: 'Doc Refiner', icon: '🪄' },
  ];

  return (
    <div className="space-y-16">
      {!apiKeySelected && (
        <div className="max-w-5xl mx-auto glass p-8 rounded-[2.5rem] border border-amber-500/20 bg-amber-500/5 flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 21-4.3-4.3"/><circle cx="11" cy="11" r="8"/><path d="m15.8 4.2 1.4 1.4"/><path d="m19.8 8.2 1.4 1.4"/></svg>
            </div>
            <div>
              <h4 className="text-xl font-black italic uppercase text-amber-500 tracking-tight">AI Subsystem Offline</h4>
              <p className="text-[10px] font-black uppercase text-amber-500/60 tracking-widest italic">Neural link requires a valid API key for data processing</p>
            </div>
          </div>
          <button 
            onClick={handleOpenKeySelector}
            className="px-10 py-5 bg-amber-500 text-white font-black rounded-3xl shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-[10px] italic"
          >
            Connect AI Key
          </button>
        </div>
      )}

      {/* Search Header Area */}
      <div className="relative group max-w-5xl mx-auto w-full">
         <div className="absolute -inset-1 bg-gradient-to-r from-social-brand via-social-ig-purple to-social-brand rounded-[4rem] blur opacity-10 group-hover:opacity-25 transition-opacity"></div>
         <div className="relative glass p-4 md:p-8 rounded-[3.5rem] border border-white/5 shadow-2xl space-y-10">
            {/* TYPE SPRINT SELECTOR */}
            <div className="flex bg-slate-900/5 dark:bg-white/5 p-1.5 rounded-full overflow-x-auto scrollbar-hide border border-white/5 gap-1">
               {tabs.map((tab) => (
                 <button
                   key={tab.id}
                   onClick={() => {
                     setType(tab.id as AnalysisType);
                     setFile(null);
                     setInput('');
                     setInstructions('');
                     setResult(null);
                     setError('');
                   }}
                   className={`flex-1 min-w-[120px] px-6 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center justify-center gap-3 ${
                     type === tab.id 
                       ? 'social-gradient text-white shadow-xl shadow-social-brand/20 scale-[1.02] z-10' 
                       : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                   }`}
                 >
                   <span className="text-lg">{tab.icon}</span>
                   <span className="hidden md:block">{tab.label}</span>
                 </button>
               ))}
            </div>

            {/* MAIN INPUT AREA */}
            <div className="max-w-4xl mx-auto space-y-8 pb-4">
               <div className="relative">
                  <div className="absolute left-10 top-1/2 -translate-y-1/2 text-social-brand outline-none bg-transparent">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  </div>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && startAnalysis()}
                    placeholder={
                      type === AnalysisType.CHANNEL_DEEP_DIVE ? "Enter @ChannelHandle (e.g. @MrBeast)..." :
                      type === AnalysisType.YOUTUBE ? "Paste YouTube Video Link..." :
                      type === AnalysisType.IMAGE_GEN ? "Neural Art Prompt..." :
                      "Describe synchronization target..."
                    }
                    className="w-full bg-slate-900/5 dark:bg-white/5 border-2 border-transparent focus:border-social-brand/30 dark:text-white text-slate-900 px-20 py-8 rounded-[2.5rem] md:text-xl font-black italic tracking-tight outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-inner"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-4">
                     {(type === AnalysisType.PDF || type === AnalysisType.RESUME || type === AnalysisType.PDF_REFINE) && (
                       <button
                         onClick={() => fileInputRef.current?.click()}
                         className={`p-4 rounded-full transition-all ${file ? 'bg-emerald-500 text-white' : 'glass border border-white/10 dark:text-slate-400 text-slate-600 hover:text-social-brand'}`}
                         title="Upload PDF"
                       >
                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                       </button>
                     )}
                     <button
                       onClick={() => startAnalysis()}
                       disabled={isAnalyzing || (!input.trim() && ![AnalysisType.RESUME, AnalysisType.PDF_REFINE].includes(type))}
                       className="px-12 py-5 social-gradient text-white font-black rounded-3xl shadow-2xl shadow-social-brand/40 hover:scale-[1.03] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale uppercase tracking-[0.2em] text-[10px] italic"
                     >
                        {isAnalyzing ? (
                           <div className="flex items-center gap-3">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Accessing...
                           </div>
                        ) : 'Run Audit'}
                     </button>
                  </div>
               </div>

               {/* QUICK SELECT CHANNELS (YOUTUBE FEEL) */}
               {type === AnalysisType.CHANNEL_DEEP_DIVE && (
                 <div className="flex flex-wrap items-center justify-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <span className="text-[10px] font-black dark:text-slate-600 text-slate-400 uppercase tracking-widest italic">Popular Nodes</span>
                    {['@MrBeast', '@MarquesBrownlee', '@Veritasium', '@DudePerfect'].map((handle) => (
                      <button
                        key={handle}
                        onClick={() => { setInput(handle); startAnalysis(handle, AnalysisType.CHANNEL_DEEP_DIVE); }}
                        className="px-6 py-2 glass rounded-full text-[10px] font-black dark:text-slate-400 text-slate-600 hover:text-social-brand hover:border-social-brand/30 border border-white/5 transition-all uppercase tracking-widest italic"
                      >
                        {handle}
                      </button>
                    ))}
                 </div>
               )}

               {/* ADDITIONAL INSTRUCTIONS AREA */}
               {(type === AnalysisType.RESUME || type === AnalysisType.PDF_REFINE) && (
                  <div className="px-6 animate-in fade-in duration-500">
                    <textarea
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder={type === AnalysisType.RESUME ? "Paste target Job Description here..." : "Neural refinement parameters..."}
                      className="w-full bg-slate-900/5 dark:bg-white/5 border border-white/10 rounded-[2rem] px-8 py-6 text-sm font-bold dark:text-slate-400 text-slate-600 focus:outline-none focus:border-social-brand h-32 resize-none italic"
                    />
                  </div>
               )}
            </div>
         </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="hidden" 
        accept=".pdf"
      />

      {error && (
        <div className="max-w-2xl mx-auto p-10 glass border border-red-500/20 bg-red-500/5 rounded-[3rem] text-red-500 text-center animate-in zoom-in duration-500 shadow-2xl relative">
           <div className="absolute top-0 inset-x-0 h-1 bg-red-500 opacity-20"></div>
           <div className="text-3xl font-black mb-4 uppercase italic tracking-tighter">Neural Breakdown</div>
           <p className="text-sm font-bold opacity-80 uppercase tracking-widest">{error}</p>
        </div>
      )}

      {/* RESULT AND HISTORICAL DATA */}
      <div className="relative">
         {isAnalyzing ? (
           <div className="py-40 flex flex-col items-center justify-center space-y-10 animate-in fade-in duration-1000">
              <div className="relative w-40 h-40">
                 <div className="absolute inset-0 rounded-full border-4 border-social-brand/10"></div>
                 <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-social-brand animate-spin"></div>
                 <div className="absolute inset-4 rounded-full border-2 border-social-ig-purple/10 animate-pulse"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-social-brand/20 rounded-full flex items-center justify-center">
                       <svg className="text-social-brand animate-bounce" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>
                    </div>
                 </div>
              </div>
              <div className="text-center space-y-2">
                 <h2 className="text-3xl font-black italic dark:text-white text-slate-800 uppercase tracking-tighter">Synchronizing Neural Matrix</h2>
                 <p className="text-[10px] font-black dark:text-slate-500 text-slate-400 uppercase tracking-[0.3em] italic">Accessing Real-Time Global Metadata</p>
              </div>
           </div>
         ) : result ? (
           <div className="animate-neural">
             <div className="flex justify-start mb-8">
               <button onClick={() => setResult(null)} className="px-10 py-4 glass dark:text-slate-400 text-slate-500 text-[10px] uppercase font-black tracking-widest hover:text-social-brand border border-white/5 rounded-full transition-all">
                 ← Bridge Back to Core
               </button>
             </div>
             <AnalysisResultView 
               result={result} 
               type={type} 
               onVideoClick={(videoId) => handleVideoClick(videoId)}
             />
           </div>
         ) : (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* HISTORY ARCHIVE */}
              <div className="lg:col-span-8 space-y-10">
                 <div className="flex items-center justify-between">
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter dark:text-white text-slate-900 flex items-center gap-6">
                       <span className="w-2 h-10 bg-social-brand rounded-full shadow-lg shadow-social-brand/20"></span>
                       Neural <span className="text-social-brand">Archive</span>
                    </h3>
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {history.length > 0 ? history.map((item) => (
                      <div 
                        key={item.id} 
                        onClick={() => handleHistorySelect(item)}
                        className="group relative glass p-6 rounded-[2.5rem] border border-white/5 hover:border-social-brand/30 transition-all cursor-pointer flex items-center gap-6 shadow-xl hover:scale-[1.02]"
                      >
                         <div className="w-24 h-24 rounded-[2rem] overflow-hidden shadow-2xl bg-black/10 shrink-0 border border-white/5">
                            {item.thumbnail ? (
                              <img src={item.thumbnail} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000" alt="" />
                            ) : (
                              <div className="w-full h-full social-gradient opacity-20"></div>
                            )}
                         </div>
                         <div className="flex-grow min-w-0 pr-4">
                            <h4 className="text-[11px] font-black dark:text-white text-slate-800 uppercase italic tracking-tight truncate group-hover:text-social-brand transition-colors leading-tight mb-2">{item.title}</h4>
                            <div className="flex items-center gap-3">
                               <span className="text-[9px] font-black uppercase text-social-brand/80 italic tracking-widest">{item.type.replace(/_/g, ' ')}</span>
                               <span className="w-1.5 h-1.5 bg-white/10 rounded-full"></span>
                               <span className="text-[9px] font-black uppercase dark:text-slate-600 text-slate-400 italic font-medium">{new Date(item.timestamp).toLocaleDateString()}</span>
                            </div>
                         </div>
                         <button 
                          onClick={(e) => { e.stopPropagation(); onDeleteItem(item.id); }}
                          className="absolute top-4 right-4 w-8 h-8 rounded-full glass border border-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white shadow-2xl"
                         >
                           <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                         </button>
                      </div>
                    )) : (
                      <div className="col-span-full py-32 text-center glass rounded-[4rem] border border-white/5 opacity-40">
                         <div className="text-6xl mb-6 grayscale opacity-50">📁</div>
                         <p className="text-[10px] font-black dark:text-slate-600 text-slate-400 uppercase tracking-widest italic">Historical synchronization logs are empty</p>
                      </div>
                    )}
                 </div>
              </div>

              {/* ACTION RECOMMENDATIONS */}
              <div className="lg:col-span-4 space-y-10 sticky top-24">
                 <h3 className="text-3xl font-black italic uppercase tracking-tighter dark:text-white text-slate-900 flex items-center gap-6">
                    <span className="w-2 h-10 bg-emerald-500 rounded-full shadow-lg"></span>
                    Audit <span className="text-emerald-500">Tutorial</span>
                 </h3>
                 <div className="grid grid-cols-1 gap-6">
                    {[
                      { icon: '🎬', title: 'Viral Check', desc: 'Paste a video link to extract SEO triggers and titles.' },
                      { icon: '📊', title: 'Deep Audit', desc: 'Analyze entire channel nodes for velocity tracking.' },
                      { icon: '🎨', title: 'Neural Art', desc: 'Generate high-CTR thumbnail assets from text nodes.' },
                      { icon: '💼', title: 'Career Sync', desc: 'Sync your professional nodes with JD expectations.' }
                    ].map((step, i) => (
                      <div key={i} className="glass p-10 rounded-[3rem] border border-white/5 shadow-2xl group hover:scale-[1.02] transition-all relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-6 opacity-[0.03] text-emerald-500 group-hover:scale-150 transition-transform duration-700">
                           <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M2 12h20"/></svg>
                         </div>
                         <div className="flex flex-col gap-6">
                            <div className="text-4xl">{step.icon}</div>
                            <div>
                               <h4 className="text-[11px] font-black dark:text-white text-slate-800 uppercase italic tracking-widest mb-3">{step.title}</h4>
                               <p className="text-[10px] font-black dark:text-slate-500 text-slate-400 uppercase tracking-widest leading-loose italic">{step.desc}</p>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
         )}
      </div>
    </div>
  );
};

export default Analyzer;
