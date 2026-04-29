
import React, { useState, useRef } from 'react';
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
  const [type, setType] = useState<AnalysisType>(AnalysisType.YOUTUBE);
  const [input, setInput] = useState('');
  const [instructions, setInstructions] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    setError('');
    setResult(null);

    try {
      let payload: any = input;
      if (type === AnalysisType.PDF || type === AnalysisType.RESUME || type === AnalysisType.PDF_REFINE) {
        if (!file) throw new Error('SOURCE FILE MISSING: UPLOAD REQUIRED');
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        payload = { data: base64Data, mimeType: file.type };
      }

      const res = await analyzeContent(type, payload, instructions);
      setResult(res);

      onResultSaved({
        id: Math.random().toString(36).substring(7),
        type,
        timestamp: Date.now(),
        title: type === AnalysisType.IMAGE_GEN ? `Art: ${input.substring(0, 15)}...` : 
               type === AnalysisType.RESUME ? `Resume Match: ${file?.name}` :
               res.title || `Scan ${new Date().toLocaleTimeString()}`,
        thumbnail: res.thumbnailUrl || res.generatedImageUrl,
        result: res
      });
    } catch (err: any) {
      setError(err.message || 'NEURAL LINK INTERRUPTED');
    } finally {
      setIsAnalyzing(false);
    }
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
    { id: AnalysisType.YOUTUBE, label: 'YouTube Audit', icon: '📺' },
    { id: AnalysisType.RESUME, label: 'Resume Match', icon: '💼' },
    { id: AnalysisType.IMAGE_GEN, label: 'Neural Art', icon: '🎨' },
    { id: AnalysisType.PDF_REFINE, label: 'Doc Refiner', icon: '🪄' },
    { id: AnalysisType.PDF, label: 'General Analysis', icon: '📄' }
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
      <div className="xl:col-span-8 space-y-10">
        {/* Tab Section */}
        <div className="relative">
          <div className="glass p-1.5 rounded-full flex dark:bg-black/20 bg-white/40 border dark:border-white/5 border-slate-200 overflow-x-auto scrollbar-hide shadow-xl relative z-10">
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
                className={`flex-1 min-w-[140px] md:min-w-[170px] py-4 rounded-full font-black uppercase text-[10px] tracking-tight transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden ${
                  type === tab.id 
                    ? 'text-white shadow-lg z-20' 
                    : 'dark:text-slate-500 text-slate-400 hover:text-slate-300'
                }`}
              >
                {type === tab.id && (
                  <div className="absolute inset-0 social-gradient opacity-100 transition-opacity duration-500"></div>
                )}
                <span className={`text-xl relative z-10 ${type === tab.id ? 'scale-110' : ''} transition-transform duration-300`}>
                  {tab.icon}
                </span>
                <span className="relative z-10 whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="glass p-10 md:p-14 rounded-[4rem] border shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-6 mb-14">
             <div className="flex flex-col">
               <h3 className="text-4xl font-heading font-black tracking-tighter dark:text-white text-slate-900 italic">Creator <span className="text-social-brand">Hub</span></h3>
               <span className="text-[10px] font-black dark:text-slate-500 text-slate-400 uppercase tracking-widest mt-2 px-3 py-1 bg-slate-500/5 rounded-full w-fit">Module: {tabs.find(t => t.id === type)?.label}</span>
             </div>
             <div className="h-px flex-grow bg-gradient-to-r dark:from-white/10 from-slate-200 to-transparent"></div>
          </div>

          <div className="space-y-12">
            {(type === AnalysisType.YOUTUBE || type === AnalysisType.IMAGE_GEN) ? (
              <div className="animate-in fade-in duration-500">
                <label className="text-xs font-black dark:text-slate-500 text-slate-400 uppercase tracking-widest block mb-4 ml-2">Interaction Buffer</label>
                <div className="relative group">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={type === AnalysisType.YOUTUBE ? "Paste YouTube Video Link..." : "Describe the vibe for neural generation..."}
                    className="w-full dark:bg-black/30 bg-slate-50 border dark:border-white/10 border-slate-200 rounded-full px-10 py-8 focus:outline-none focus:border-social-brand/50 font-bold text-lg transition-all focus:bg-white dark:focus:bg-black/50 shadow-inner group-hover:border-social-brand/20"
                  />
                  <div className="absolute right-10 top-1/2 -translate-y-1/2 dark:text-slate-700 text-slate-300 pointer-events-none group-hover:text-social-brand transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m21 21-4.3-4.3"/><circle cx="10" cy="10" r="7"/></svg>
                  </div>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-4 border-dashed rounded-[3.5rem] p-20 text-center cursor-pointer transition-all hover:border-social-brand/30 group animate-in fade-in duration-500 ${
                  file ? 'border-social-brand bg-social-brand/5 shadow-inner' : 'dark:border-white/10 border-slate-200 dark:bg-black/20 bg-slate-50'
                }`}
              >
                <input type="file" ref={fileInputRef} onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
                <div className="w-24 h-24 social-gradient rounded-full flex items-center justify-center mx-auto mb-8 text-white group-hover:scale-110 transition-all shadow-xl shadow-social-brand/30">
                   <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                </div>
                <p className="font-heading font-black text-2xl dark:text-white text-slate-900">{file ? file.name : `Drop ${type === AnalysisType.RESUME ? 'Resume' : 'Document'}`}</p>
                <p className="text-[10px] dark:text-slate-500 text-slate-400 uppercase mt-4 font-black tracking-widest bg-slate-500/5 px-4 py-1.5 rounded-full w-fit mx-auto">Source Protocol: PDF / DOCX / TXT</p>
              </div>
            )}

            {(type === AnalysisType.PDF_REFINE || type === AnalysisType.RESUME) && (
              <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                <label className="text-xs font-black dark:text-slate-500 text-slate-400 uppercase tracking-widest block ml-2">
                  {type === AnalysisType.RESUME ? 'Growth Target (Job Description)' : 'Refinement Parameters'}
                </label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder={type === AnalysisType.RESUME 
                    ? "Paste the requirements here for precision alignment..."
                    : "EX: Viral synthesis, technical summarization, or strategic rewrite..."}
                  className="w-full dark:bg-black/30 bg-slate-50 border dark:border-white/10 border-slate-200 rounded-[3rem] px-10 py-8 focus:outline-none focus:border-social-brand/50 font-bold text-lg h-44 resize-none shadow-inner transition-all hover:border-social-brand/20"
                />
              </div>
            )}
          </div>

          {error && (
            <div className={`mt-10 p-6 border rounded-3xl flex flex-col gap-4 animate-in shake duration-500 bg-red-500/5 border-red-500/10 text-red-500 shadow-xl`}>
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                <div className={`w-3 h-3 rounded-full shadow-lg bg-red-500 animate-pulse`}></div>
                {error}
              </div>
            </div>
          )}

          <button 
            onClick={startAnalysis}
            disabled={isAnalyzing || (type === AnalysisType.YOUTUBE || type === AnalysisType.IMAGE_GEN ? !input : !file)}
            className="w-full mt-14 py-8 social-gradient hover:opacity-90 disabled:opacity-20 text-white font-black rounded-full transition-all shadow-2xl shadow-social-brand/30 active:scale-95 flex items-center justify-center gap-6 uppercase tracking-widest text-sm"
          >
            {isAnalyzing ? (
              <div className="flex items-center gap-4">
                 <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                 Syncing Algorithm...
              </div>
            ) : type === AnalysisType.RESUME ? 'Audit Profile' : 'Start Processing'}
          </button>
        </div>

        {result && <AnalysisResultView result={result} type={type} />}
      </div>

      <div id="history-section" className="xl:col-span-4 sticky top-28">
        <div className="glass p-10 rounded-[4rem] border flex flex-col max-h-[calc(100vh-160px)] shadow-2xl overflow-hidden relative">
           <div className="absolute inset-x-0 top-0 h-1 social-gradient opacity-20"></div>
           
           <div className="flex items-center justify-between mb-10 pb-4 border-b border-slate-500/5">
              <h3 className="text-xs font-black uppercase tracking-widest text-social-brand flex items-center gap-4">
                 <div className="w-2.5 h-2.5 bg-social-brand rounded-full shadow-lg shadow-social-brand/50"></div>
                 Archive
              </h3>
              <button 
                onClick={onClearHistory}
                className="text-[10px] font-black dark:text-slate-600 text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors"
              >
                Clear
              </button>
           </div>

           <div className="space-y-6 overflow-y-auto pr-3 scrollbar-hide flex-grow">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 dark:opacity-10 opacity-20 text-center grayscale transition-opacity">
                  <span className="text-7xl mb-6">📸</span>
                  <p className="text-[10px] font-black uppercase tracking-widest">No Assets Captured</p>
                </div>
              ) : history.map((item) => (
                <div 
                  key={item.id} 
                  className="glass p-6 rounded-[2.5rem] border hover:border-social-brand/20 group transition-all flex items-center gap-5 shadow-sm hover:shadow-xl relative"
                >
                  <div 
                    onClick={() => handleHistorySelect(item)}
                    className="flex flex-1 items-center gap-5 cursor-pointer min-w-0"
                  >
                    <div className="w-16 h-16 flex-shrink-0 dark:bg-black/50 bg-slate-100 rounded-full overflow-hidden border dark:border-white/5 border-slate-200 flex items-center justify-center group-hover:scale-105 transition-all shadow-inner">
                      {item.thumbnail ? (
                        <img src={item.thumbnail} className={`w-full h-full object-cover ${type === AnalysisType.IMAGE_GEN ? 'opacity-100' : 'dark:opacity-60 opacity-80 group-hover:opacity-100'} transition-opacity`} />
                      ) : (
                        <span className="text-3xl dark:opacity-40 opacity-60 group-hover:opacity-100 transition-opacity">
                          {item.type === AnalysisType.YOUTUBE ? '📺' : item.type === AnalysisType.RESUME ? '💼' : '📄'}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-grow">
                      <p className="text-sm font-black dark:text-white text-slate-800 uppercase truncate mb-1 group-hover:text-social-brand transition-colors tracking-tight">{item.title}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-[8px] bg-social-brand/10 text-social-brand px-2 py-0.5 rounded-full border border-social-brand/10 uppercase font-black tracking-widest">LIVE</span>
                        <p className="text-[9px] font-black dark:text-slate-600 text-slate-400 uppercase tracking-widest">
                           {new Date(item.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Permanently remove this asset?')) {
                        onDeleteItem(item.id);
                      }
                    }}
                    className="p-3 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-all active:scale-90"
                    title="Delete record"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              ))}
           </div>
           
           <div className="mt-8 pt-6 border-t dark:border-white/5 border-slate-100 flex flex-col items-center gap-3">
              <div className="flex items-center gap-2.5 bg-clip-text text-transparent social-gradient font-black text-[10px] uppercase tracking-widest w-full justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="social-brand" strokeWidth="4" className="text-social-brand"><path d="M12 2v8"/><path d="m16 6-4 4-4-4"/><rect width="20" height="8" x="2" y="14" rx="2"/></svg>
                Secure Cloud Protocol
              </div>
              <p className="text-[8px] font-black dark:text-slate-700 text-slate-400 uppercase tracking-widest">v2.4 Algorithm Alignment</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Analyzer;
