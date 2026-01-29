
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
        title: type === AnalysisType.IMAGE_GEN ? `Art: ${input.substring(0, 15)}...` : res.title || `Scan ${new Date().toLocaleTimeString()}`,
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
    { id: AnalysisType.IMAGE_GEN, label: 'Neural Art', icon: '🎨' },
    { id: AnalysisType.PDF_REFINE, label: 'Doc Refiner', icon: '🪄' },
    { id: AnalysisType.PDF, label: 'Analysis', icon: '📄' }
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
      <div className="xl:col-span-8 space-y-8">
        <div className="glass p-2 rounded-3xl flex dark:border-white/5 border-slate-200 overflow-x-auto scrollbar-hide shadow-lg">
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
              className={`flex-1 min-w-[150px] py-4 rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                type === tab.id 
                  ? 'bg-violet-600 text-white shadow-xl shadow-violet-600/30 scale-[1.02]' 
                  : 'hover:bg-slate-500/5 dark:text-slate-500 text-slate-400'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="glass p-10 md:p-12 rounded-[3.5rem] border dark:border-white/10 border-slate-200 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-6 mb-12">
             <div className="flex flex-col">
               <h3 className="text-3xl font-heading font-extrabold tracking-tight dark:text-white text-slate-900">Command <span className="text-violet-500">Center</span></h3>
               <span className="text-[10px] font-bold dark:text-slate-500 text-slate-400 uppercase tracking-widest mt-2">Active Module: {tabs.find(t => t.id === type)?.label}</span>
             </div>
             <div className="h-px flex-grow bg-gradient-to-r dark:from-white/10 from-slate-200 to-transparent"></div>
          </div>

          <div className="space-y-10">
            {(type === AnalysisType.YOUTUBE || type === AnalysisType.IMAGE_GEN) ? (
              <div className="animate-in fade-in duration-500">
                <label className="text-xs font-bold dark:text-slate-500 text-slate-400 uppercase tracking-widest block mb-4 ml-1">Sequence Input Buffer</label>
                <div className="relative group">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={type === AnalysisType.YOUTUBE ? "Paste Video URL (https://...)" : "Describe visual concepts for neural generation..."}
                    className="w-full dark:bg-black/30 bg-slate-50 border dark:border-white/10 border-slate-200 rounded-[2rem] px-8 py-7 focus:outline-none focus:border-violet-500/50 font-mono text-sm transition-all focus:bg-white dark:focus:bg-slate-900 shadow-inner group-hover:border-violet-500/30"
                  />
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 dark:text-slate-700 text-slate-300 pointer-events-none group-hover:text-violet-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m21 21-4.3-4.3"/><circle cx="10" cy="10" r="7"/></svg>
                  </div>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-[3rem] p-16 text-center cursor-pointer transition-all hover:border-violet-500/50 group animate-in fade-in duration-500 ${
                  file ? 'border-violet-500 bg-violet-500/5 shadow-inner' : 'dark:border-white/10 border-slate-200 dark:bg-black/20 bg-slate-50'
                }`}
              >
                <input type="file" ref={fileInputRef} onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
                <div className="w-20 h-20 bg-violet-600/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-violet-500 group-hover:scale-110 transition-transform shadow-sm">
                   <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                </div>
                <p className="font-heading font-extrabold text-xl dark:text-white text-slate-900">{file ? file.name : 'Ingest Source Document'}</p>
                <p className="text-[10px] dark:text-slate-500 text-slate-400 uppercase mt-4 font-bold tracking-[0.25em]">Buffer: PDF / DOCX / TXT</p>
              </div>
            )}

            {type === AnalysisType.PDF_REFINE && (
              <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                <label className="text-xs font-bold dark:text-slate-500 text-slate-400 uppercase tracking-widest block ml-1">Neural Refinement Instructions</label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="EX: Rewrite in a formal technical tone, summarize into key strategic bullets, or translate to another dialect..."
                  className="w-full dark:bg-black/30 bg-slate-50 border dark:border-white/10 border-slate-200 rounded-[2rem] px-8 py-7 focus:outline-none focus:border-violet-500/50 font-mono text-sm h-40 resize-none shadow-inner transition-all hover:border-violet-500/30"
                />
              </div>
            )}
          </div>

          {error && (
            <div className={`mt-10 p-6 border rounded-2xl flex flex-col gap-4 animate-in shake duration-500 bg-red-500/10 border-red-500/20 text-red-500 shadow-lg`}>
              <div className="flex items-center gap-4 text-xs font-extrabold uppercase tracking-widest">
                <div className={`w-3 h-3 rounded-full shadow-lg bg-red-500 animate-pulse`}></div>
                {error}
              </div>
            </div>
          )}

          <button 
            onClick={startAnalysis}
            disabled={isAnalyzing || (type === AnalysisType.YOUTUBE || type === AnalysisType.IMAGE_GEN ? !input : !file)}
            className="w-full mt-12 py-7 bg-violet-600 hover:bg-violet-700 disabled:opacity-20 text-white font-extrabold rounded-[2rem] transition-all shadow-2xl shadow-violet-600/30 active:scale-95 flex items-center justify-center gap-6 uppercase tracking-[0.3em] text-xs"
          >
            {isAnalyzing ? (
              <div className="flex items-center gap-4">
                 <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                 Processing Neural Matrix...
              </div>
            ) : 'Initiate Analysis'}
          </button>
        </div>

        {result && <AnalysisResultView result={result} type={type} />}
      </div>

      <div id="history-section" className="xl:col-span-4 sticky top-28">
        <div className="glass p-10 rounded-[3.5rem] border flex flex-col max-h-[calc(100vh-160px)] shadow-2xl overflow-hidden relative">
           <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-violet-500/20 to-transparent"></div>
           
           <div className="flex items-center justify-between mb-10 pb-4">
              <h3 className="text-xs font-extrabold uppercase tracking-[0.3em] text-violet-500 flex items-center gap-4">
                 <div className="w-2 h-2 bg-violet-500 rounded-full shadow-[0_0_12px_rgba(139,92,246,0.6)]"></div>
                 My Archive
              </h3>
              <button 
                onClick={onClearHistory}
                className="text-[10px] font-bold dark:text-slate-600 text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors"
              >
                Purge All
              </button>
           </div>

           <div className="space-y-5 overflow-y-auto pr-3 scrollbar-hide flex-grow">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 dark:opacity-10 opacity-20 text-center grayscale transition-opacity">
                  <span className="text-6xl mb-6">🗄️</span>
                  <p className="text-xs font-bold uppercase tracking-widest">Personal Cloud is Empty</p>
                </div>
              ) : history.map((item) => (
                <div 
                  key={item.id} 
                  className="glass p-5 rounded-[1.8rem] border dark:border-white/5 border-slate-200 hover:border-violet-500/30 group transition-all flex items-center gap-5 shadow-sm hover:shadow-lg relative"
                >
                  <div 
                    onClick={() => handleHistorySelect(item)}
                    className="flex flex-1 items-center gap-5 cursor-pointer min-w-0"
                  >
                    <div className="w-14 h-14 flex-shrink-0 dark:bg-slate-900 bg-slate-100 rounded-2xl overflow-hidden border dark:border-white/5 border-slate-200 flex items-center justify-center group-hover:border-violet-500/30 transition-all shadow-inner">
                      {item.thumbnail ? (
                        <img src={item.thumbnail} className="w-full h-full object-cover dark:opacity-60 opacity-80 group-hover:opacity-100 transition-opacity" />
                      ) : (
                        <span className="text-2xl dark:opacity-40 opacity-60 group-hover:opacity-100 transition-opacity">
                          {item.type === AnalysisType.YOUTUBE ? '📺' : '📄'}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold dark:text-white text-slate-800 uppercase truncate mb-1 group-hover:text-violet-500 transition-colors">{item.title}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-[8px] dark:bg-white/5 bg-slate-100 px-2.5 py-1 rounded-lg dark:text-slate-500 text-slate-400 uppercase font-extrabold tracking-widest">{item.type.replace('_', ' ')}</span>
                        <p className="text-[9px] font-bold dark:text-slate-600 text-slate-400 uppercase tracking-widest font-mono">
                           {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Individual Delete Action */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Erase this specific record from your cloud storage?')) {
                        onDeleteItem(item.id);
                      }
                    }}
                    className="p-3 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-all active:scale-90"
                    title="Delete record from cloud"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                  </button>
                </div>
              ))}
           </div>
           
           <div className="mt-12 pt-8 border-t dark:border-white/5 border-slate-100 flex flex-col items-center gap-3">
              <p className="text-[10px] font-bold dark:text-slate-600 text-slate-400 uppercase tracking-[0.2em]">Puter Secure KV Storage</p>
              <div className="flex items-center gap-2.5 text-violet-500/60 font-extrabold text-[10px] uppercase tracking-widest bg-violet-500/5 px-4 py-2 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2v8"/><path d="m16 6-4 4-4-4"/><rect width="20" height="8" x="2" y="14" rx="2"/></svg>
                user_private_kv
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Analyzer;
