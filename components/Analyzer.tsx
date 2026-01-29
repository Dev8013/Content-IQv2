
import React, { useState, useRef } from 'react';
import { AnalysisType, AnalysisResult, HistoryItem } from '../types';
import { analyzeContent } from '../services/aiService';
import AnalysisResultView from './AnalysisResultView';

interface AnalyzerProps {
  onResultSaved: (item: HistoryItem) => void;
  history: HistoryItem[];
  onClearHistory: () => void;
}

const Analyzer: React.FC<AnalyzerProps> = ({ 
  onResultSaved, history, onClearHistory
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
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      <div className="xl:col-span-8 space-y-6">
        <div className="glass p-1.5 rounded-2xl flex border border-white/5 overflow-x-auto scrollbar-hide">
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
              className={`flex-1 min-w-[130px] py-4 rounded-xl font-black uppercase text-[9px] tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                type === tab.id 
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20 scale-[1.02]' 
                  : 'hover:bg-white/5 text-slate-500'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="glass p-8 md:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden transition-all duration-500">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
             <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
          </div>

          <div className="flex items-center gap-4 mb-10">
             <div className="flex flex-col">
               <h3 className="text-2xl font-black uppercase tracking-tighter">Command <span className="text-violet-500">Center</span></h3>
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Status: Operational</span>
             </div>
             <div className="h-px flex-grow bg-gradient-to-r from-white/10 to-transparent"></div>
          </div>

          <div className="space-y-8">
            {(type === AnalysisType.YOUTUBE || type === AnalysisType.IMAGE_GEN) ? (
              <div className="relative group animate-in fade-in duration-500">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3 ml-1">Sequence Input</label>
                <div className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={type === AnalysisType.YOUTUBE ? "PASTE YOUTUBE URL (HTTPS://...)" : "DESCRIBE THE IMAGE... (PROMPT)"}
                    className="w-full bg-slate-900/60 border border-white/10 rounded-2xl px-7 py-6 focus:outline-none focus:border-violet-500/50 font-mono text-sm transition-all focus:bg-slate-900 shadow-inner"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21 21-4.3-4.3"/><circle cx="10" cy="10" r="7"/></svg>
                  </div>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-[2.5rem] p-12 text-center cursor-pointer transition-all hover:border-violet-500/50 group animate-in fade-in duration-500 ${
                  file ? 'border-violet-500 bg-violet-500/5 shadow-inner' : 'border-white/5 bg-black/20'
                }`}
              >
                <input type="file" ref={fileInputRef} onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
                <div className="w-16 h-16 bg-violet-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-violet-500 group-hover:scale-110 transition-transform">
                   <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                </div>
                <p className="font-black text-[11px] uppercase tracking-widest text-slate-300">{file ? file.name : 'Click to Ingest Source File'}</p>
                <p className="text-[9px] text-slate-600 uppercase mt-2 font-bold tracking-[0.2em]">BUFFER: PDF / DOCX / TXT</p>
              </div>
            )}

            {type === AnalysisType.PDF_REFINE && (
              <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Refinement Protocol Instructions</label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="EX: TRANSLATE THIS TO SPANISH, REWRITE IN A PROFESSIONAL TONE, OR SUMMARIZE INTO 5 BULLETS..."
                  className="w-full bg-slate-900/60 border border-white/10 rounded-2xl px-7 py-6 focus:outline-none focus:border-violet-500/50 font-mono text-sm h-32 resize-none shadow-inner"
                />
              </div>
            )}
          </div>

          {error && (
            <div className={`mt-8 p-5 border rounded-2xl flex flex-col gap-4 animate-in fade-in duration-300 bg-red-500/10 border-red-500/20 text-red-400`}>
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                <div className={`w-2 h-2 rounded-full shadow-lg bg-red-500 shadow-red-500/50`}></div>
                {error}
              </div>
            </div>
          )}

          <button 
            onClick={startAnalysis}
            disabled={isAnalyzing || (type === AnalysisType.YOUTUBE || type === AnalysisType.IMAGE_GEN ? !input : !file)}
            className="w-full mt-10 py-6 bg-violet-600 hover:bg-violet-700 disabled:opacity-20 text-white font-black rounded-2xl transition-all shadow-xl shadow-violet-600/20 active:scale-95 flex items-center justify-center gap-5 uppercase tracking-[0.25em] text-[10px]"
          >
            {isAnalyzing ? (
              <div className="flex items-center gap-3">
                 <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                 PROCESSING NEURAL DATA...
              </div>
            ) : 'Initiate Neural Analysis'}
          </button>
        </div>

        {result && <AnalysisResultView result={result} type={type} />}
      </div>

      <div id="history-section" className="xl:col-span-4 sticky top-24">
        <div className="glass p-8 rounded-[2.5rem] border border-white/5 flex flex-col max-h-[calc(100vh-140px)] shadow-2xl">
           <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-violet-400 flex items-center gap-3">
                 <div className="w-1.5 h-1.5 bg-violet-500 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.6)]"></div>
                 Archive
              </h3>
              <button 
                onClick={onClearHistory}
                className="text-[9px] font-black text-slate-600 hover:text-red-500 uppercase tracking-widest transition-colors"
              >
                Clear Buffer
              </button>
           </div>

           <div className="space-y-4 overflow-y-auto pr-2 scrollbar-hide flex-grow">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 opacity-10 text-center grayscale">
                  <span className="text-5xl mb-4">🗄️</span>
                  <p className="text-[10px] font-black uppercase tracking-widest">Cache is Empty</p>
                </div>
              ) : history.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => handleHistorySelect(item)}
                  className="glass p-4 rounded-2xl border border-white/5 hover:border-violet-500/30 cursor-pointer group transition-all hover:translate-x-1 flex items-center gap-4"
                >
                  <div className="w-12 h-12 flex-shrink-0 bg-slate-900 rounded-xl overflow-hidden border border-white/5 flex items-center justify-center group-hover:border-violet-500/30">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                    ) : (
                      <span className="text-xl opacity-40 group-hover:opacity-100 transition-opacity">
                        {item.type === AnalysisType.YOUTUBE ? '📺' : '📄'}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-white uppercase truncate mb-1 group-hover:text-violet-400 transition-colors">{item.title}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[7px] bg-white/5 px-2 py-0.5 rounded text-slate-500 uppercase font-bold">{item.type.replace('_', ' ')}</span>
                      <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">
                         {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
           </div>
           
           <div className="mt-10 pt-6 border-t border-white/5 flex flex-col items-center gap-2">
              <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Puter Cloud Mirror</p>
              <div className="flex items-center gap-2 text-violet-500/60 font-black text-[9px] uppercase tracking-widest">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2v8"/><path d="m16 6-4 4-4-4"/><rect width="20" height="8" x="2" y="14" rx="2"/></svg>
                content_iq_archive
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Analyzer;
