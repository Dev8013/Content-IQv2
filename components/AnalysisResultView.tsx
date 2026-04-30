
import React, { useState } from 'react';
import { AnalysisResult, AnalysisType, AnalysisVideo } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface Props {
  result: AnalysisResult;
  type: AnalysisType;
  onVideoClick?: (videoId: string) => void;
}

const AnalysisResultView: React.FC<Props> = ({ result, type, onVideoClick }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [activeTab, setActiveTab] = useState<'home' | 'videos' | 'analytics'>('home');

  if (!result) return null;

  const handleCopyTags = () => {
    if (result.tags && result.tags.length > 0) {
      const tagString = result.tags.join(', ');
      navigator.clipboard.writeText(tagString);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  const isChannelView = type === AnalysisType.CHANNEL_DEEP_DIVE && (result.channelMetadata || result.channelVideos);

  if (isChannelView) {
    return (
      <div className="mt-16 animate-neural pb-32">
        {/* YOUTUBE STYLE BANNER */}
        <div className="relative w-full aspect-[6/1] rounded-3xl md:rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl mb-12 max-w-[1400px] mx-auto group ring-1 ring-white/10">
           {result.channelMetadata?.bannerUrl ? (
             <img src={result.channelMetadata.bannerUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Banner" />
           ) : (
             <div className="w-full h-full social-gradient opacity-10"></div>
           )}
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        </div>

        {/* CHANNEL HEADER */}
        <div className="max-w-6xl mx-auto px-6 mb-16">
           <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 -mt-16 md:-mt-20 relative z-10 text-center md:text-left pt-1">
              <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-white dark:border-black overflow-hidden shadow-2xl bg-black/20 ring-4 ring-black/40">
                 {result.channelMetadata?.avatarUrl ? (
                   <img src={result.channelMetadata.avatarUrl} className="w-full h-full object-cover" alt="Avatar" />
                 ) : (
                   <div className="w-full h-full social-gradient"></div>
                 )}
              </div>
              <div className="flex-grow pt-4 md:pt-14 space-y-4">
                 <h1 className="text-3xl md:text-5xl font-black tracking-tight dark:text-white text-slate-900 leading-none">
                    {result.channelMetadata?.handle || result.title}
                 </h1>
                 <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-black dark:text-slate-500 text-slate-400 uppercase tracking-widest italic pt-1">
                    <span>{result.channelMetadata?.handle}</span>
                    <span className="w-1.5 h-1.5 bg-social-brand rounded-full"></span>
                    <span>{result.channelMetadata?.subscriberCount || 'Private'} Subscribers</span>
                    <span className="w-1.5 h-1.5 bg-social-brand rounded-full"></span>
                    <span>{result.channelMetadata?.videoCount || 'N/A'} Videos</span>
                 </div>
                 <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
                    <button className="px-10 py-4 bg-social-brand text-white font-black rounded-full shadow-xl shadow-social-brand/30 hover:scale-105 active:scale-95 transition-all text-[10px] uppercase tracking-widest">
                       Synchronize Neural Feed
                    </button>
                    <button className="px-10 py-4 glass dark:bg-white/5 border border-white/10 dark:text-white text-slate-900 font-black rounded-full hover:bg-white/10 transition-all text-[10px] uppercase tracking-widest">
                       Joint Matrix Scan
                    </button>
                 </div>
              </div>
           </div>

           {result.channelMetadata?.description && (
             <div className="mt-10 p-8 glass rounded-[2.5rem] border border-white/5 dark:text-slate-400 text-slate-600 text-sm italic font-bold leading-relaxed max-w-4xl mx-auto md:mx-0">
               {result.channelMetadata.description}
             </div>
           )}
        </div>

        {/* NAVIGATION TABS */}
        <div className="max-w-6xl mx-auto px-6 mb-12 border-b dark:border-white/5 border-slate-200">
           <div className="flex gap-12 overflow-x-auto scrollbar-hide py-1">
              {['home', 'videos', 'analytics'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`pb-4 text-[10px] font-black uppercase tracking-[0.25em] transition-all relative whitespace-nowrap ${
                    activeTab === tab ? 'text-social-brand' : 'dark:text-slate-500 text-slate-400 hover:text-social-brand'
                  }`}
                >
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-social-brand rounded-full animate-in slide-in-from-left-full"></div>}
                </button>
              ))}
           </div>
        </div>

        <div className="max-w-6xl mx-auto px-6">
           {activeTab === 'home' && (
             <div className="space-y-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                {/* FEATURED VIDEOS GRID */}
                <div>
                   <div className="flex items-center justify-between mb-12">
                      <h3 className="text-2xl font-black italic uppercase tracking-tighter dark:text-white text-slate-900 flex items-center gap-6">
                         <span className="w-1.5 h-10 bg-social-brand rounded-full shadow-lg shadow-social-brand/20"></span>
                         Neural <span className="text-social-brand">Active Feed</span>
                      </h3>
                      <div className="text-[10px] font-black dark:text-slate-600 text-slate-400 uppercase tracking-widest px-6 py-2 glass rounded-full border border-white/5">
                        Latest Synchronization Points
                      </div>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-14">
                      {result.channelVideos?.map((video, idx) => (
                        <div 
                          key={video.id + idx} 
                          onClick={() => onVideoClick?.(video.id)}
                          className="group cursor-pointer space-y-6"
                        >
                           <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl group-hover:scale-[1.03] transition-all duration-700 ring-1 ring-white/10">
                              <img src={video.thumbnail} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" alt={video.title} />
                              <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/90 backdrop-blur-xl rounded-lg text-[10px] font-black text-white border border-white/10 shadow-2xl">
                                 {video.duration}
                              </div>
                              <div className="absolute inset-0 bg-social-brand/20 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                                 <div className="w-16 h-16 bg-white/20 backdrop-blur-2xl rounded-full flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-all shadow-2xl border border-white/30">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="m7 4 12 8-12 8V4z"/></svg>
                                 </div>
                              </div>
                           </div>
                           <div className="space-y-3 px-2">
                              <h4 className="text-sm font-black dark:text-white text-slate-800 leading-tight line-clamp-2 italic uppercase tracking-tight group-hover:text-social-brand transition-colors">
                                 {video.title}
                              </h4>
                              <div className="flex items-center gap-3 text-[10px] font-black dark:text-slate-500 text-slate-400 uppercase tracking-widest italic">
                                 <span className="text-social-brand/80">{video.views}</span>
                                 <span className="w-1.5 h-1.5 bg-white/5 rounded-full"></span>
                                 <span>{video.publishedAt}</span>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* KPI INDICATORS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                   {result.stats?.map((stat, i) => (
                     <div key={i} className="glass p-10 rounded-[3.5rem] border border-white/5 shadow-2xl flex flex-col items-center justify-center text-center group hover:scale-105 transition-all">
                        <span className="text-[10px] font-black dark:text-slate-500 text-slate-400 uppercase tracking-widest mb-4 italic">{stat.label}</span>
                        <div className="text-3xl font-black text-social-brand italic tracking-tighter mb-2 group-hover:scale-110 transition-transform">{stat.value}</div>
                        {stat.trend && (
                           <div className={`text-[9px] font-black uppercase px-4 py-1.5 rounded-full ${
                              stat.trend === 'up' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400'
                           }`}>
                              {stat.trend === 'up' ? '↑ Velocity Peak' : '↓ Stability Check'}
                           </div>
                        )}
                     </div>
                   ))}
                </div>
             </div>
           )}

           {activeTab === 'videos' && (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-14 animate-in fade-in duration-700">
                {result.channelVideos?.map((video, idx) => (
                   <div key={video.id + idx} onClick={() => onVideoClick?.(video.id)} className="group cursor-pointer space-y-6">
                      <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group-hover:scale-[1.03] transition-all duration-700">
                         <img src={video.thumbnail} className="w-full h-full object-cover" alt={video.title} />
                         <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/90 backdrop-blur-xl rounded-lg text-[10px] font-black text-white border border-white/10">{video.duration}</div>
                      </div>
                      <div className="space-y-3 px-2">
                         <h4 className="text-sm font-black dark:text-white text-slate-800 leading-tight line-clamp-2 italic uppercase tracking-tight group-hover:text-social-brand transition-colors">{video.title}</h4>
                         <div className="flex items-center gap-3 text-[10px] font-black dark:text-slate-500 text-slate-400 uppercase tracking-widest">
                           <span className="text-social-brand">{video.views} Views</span>
                           <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                           <span>{video.publishedAt}</span>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
           )}

           {activeTab === 'analytics' && (
             <div className="space-y-20 animate-in fade-in duration-700">
                {result.chartData && (
                  <div className="glass p-12 md:p-16 rounded-[4.5rem] border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-none">
                     <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-social-brand">
                        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M2 12h20"/></svg>
                     </div>
                     <h3 className="text-3xl font-black mb-14 dark:text-white text-slate-900 uppercase italic flex items-center gap-6 tracking-tighter">
                        <span className="w-2 h-14 bg-social-brand rounded-full"></span>
                        Algorithmic <span className="text-social-brand">Velocity Map</span>
                     </h3>
                     <div className="h-[450px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={result.chartData}>
                            <defs>
                              <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#FF0050" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#FF0050" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.03} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} />
                            <YAxis hide />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '16px' }} 
                              itemStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '12px' }}
                            />
                            <Area type="monotone" dataKey="value" stroke="#FF0050" strokeWidth={6} fill="url(#velocityGrad)" />
                          </AreaChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                   <div className="glass p-14 rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 h-1 w-full bg-social-brand opacity-20"></div>
                      <h4 className="text-2xl font-black mb-10 text-social-brand uppercase italic tracking-tighter">Channel Strategic Synopsis</h4>
                      <div className="text-lg text-slate-400 font-bold italic leading-relaxed whitespace-pre-wrap">{result.summary}</div>
                   </div>
                   <div className="glass p-14 rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 h-1 w-full bg-emerald-500 opacity-20"></div>
                      <h4 className="text-2xl font-black mb-10 text-emerald-500 uppercase italic tracking-tighter">Milestone Growth Protocol</h4>
                      <div className="space-y-6">
                         {result.improvements?.map((imp, i) => (
                           <div key={i} className="flex gap-6 items-start text-base font-black dark:text-slate-100 text-slate-800 italic group translate-x-0 hover:translate-x-2 transition-transform">
                              <span className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-black text-xs shrink-0">✓</span>
                              <p className="pt-1">{imp}</p>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>
    );
  }

  // DEFAULT DETAILED VIEW (ORIGINAL STYLE BUT REFINED)
  return (
    <div className="mt-24 space-y-20 animate-in fade-in slide-in-from-bottom-10 duration-1000 pb-32">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-4">
          <h2 className="text-5xl md:text-7xl font-heading font-black tracking-tighter dark:text-white text-slate-900 italic leading-none">
            {type === AnalysisType.CHANNEL_DEEP_DIVE ? 'Channel' : 
             type === AnalysisType.TREND_STRATEGY ? 'Trend' : 
             type === AnalysisType.COMPETITIVE_AUDIT ? 'Intelligence' : 'Neural'} <span className="text-social-brand">Audit</span>
          </h2>
          <div className="flex items-center gap-4">
            <div className="h-0.5 w-20 bg-social-brand"></div>
            <p className="text-[10px] font-black dark:text-slate-500 text-slate-400 uppercase tracking-widest">Protocol: Live Mainnet Syncing</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-[10px] font-black dark:text-slate-500 text-slate-400 uppercase tracking-widest glass px-8 py-4 rounded-full border shadow-xl">
          <div className="w-2.5 h-2.5 bg-social-brand rounded-full animate-pulse shadow-lg shadow-social-brand/50"></div>
          Status: Synchronized
        </div>
      </div>

      {/* STATS STRIP */}
      {result.stats && result.stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-in fade-in zoom-in duration-700">
          {result.stats.map((stat, i) => (
            <div key={i} className="glass p-8 rounded-[3rem] border shadow-xl flex flex-col items-center justify-center text-center group hover:scale-105 transition-all">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</span>
              <div className="text-3xl font-heading font-black dark:text-white text-slate-900 italic tracking-tighter mb-2 group-hover:text-social-brand transition-colors">
                {stat.value}
              </div>
              {stat.trend && (
                <div className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                  stat.trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 
                  stat.trend === 'down' ? 'bg-red-500/10 text-red-500' : 'bg-slate-500/10 text-slate-500'
                }`}>
                  {stat.trend === 'up' ? '↑ Increasing' : stat.trend === 'down' ? '↓ Decreasing' : '→ Stable'}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* MAIN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <div className="glass rounded-[4rem] p-10 md:p-14 shadow-2xl relative overflow-hidden border">
            {result.thumbnailUrl && (
              <div className="mb-14 relative group overflow-hidden rounded-[4rem] shadow-2xl border-4 border-white dark:border-black/50">
                <img src={result.thumbnailUrl} className="w-full aspect-video object-cover transition-transform duration-1000 group-hover:scale-110" alt="Preview" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
                <div className="absolute bottom-10 left-10 flex items-center gap-3 px-6 py-3 bg-black/40 backdrop-blur-2xl rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
                   <span className="w-2.5 h-2.5 bg-social-brand rounded-full animate-pulse"></span>
                   NEURAL FEED ACTIVE
                </div>
              </div>
            )}
            <div className="space-y-12">
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <span className="text-[10px] font-black text-social-brand uppercase tracking-widest mb-6 block px-6 py-2 bg-social-brand/5 rounded-full w-fit">
                   Optimization Target
                </span>
                <h1 className="text-4xl md:text-7xl font-heading font-black tracking-tighter dark:text-white text-slate-900 leading-[0.9] italic">
                  {result.title}
                </h1>
              </div>

              {result.chartData && (
                <div className="h-[350px] w-full dark:bg-black/40 bg-slate-50 rounded-[4rem] p-10 border shadow-inner">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={result.chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} />
                      <YAxis hide />
                      <Tooltip contentStyle={{ backgroundColor: 'black', border: 'none', borderRadius: '20px' }} />
                      <Area type="monotone" dataKey="value" stroke="var(--color-social-brand)" strokeWidth={4} fill="var(--color-social-brand)" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block italic">Viral Metadata Tags</span>
                  <button onClick={handleCopyTags} className="text-[9px] font-black uppercase tracking-widest px-8 py-3 rounded-full border border-social-brand/20 text-social-brand">
                    {copyStatus === 'copied' ? 'Copied' : 'Export Tags'}
                  </button>
                </div>
                {result.tags && (
                  <div className="flex flex-wrap gap-4">
                    {result.tags.map((tag, i) => (
                      <span key={i} className="px-6 py-3 dark:bg-black/60 bg-slate-100 border dark:border-white/5 border-slate-200 rounded-full text-xs font-black dark:text-slate-300 italic">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="glass p-12 rounded-[4rem] shadow-2xl border relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-social-brand group-hover:scale-125 transition-transform">
                      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M2 12h20"/></svg>
                    </div>
                    <h3 className="text-3xl font-heading font-black mb-10 uppercase text-social-brand italic border-b border-social-brand/10 pb-6">Executive Summary</h3>
                    <div className="text-xl text-slate-400 font-bold italic whitespace-pre-wrap leading-relaxed">{result.summary}</div>
                 </div>
                 {result.description && (
                   <div className="glass p-12 rounded-[4rem] shadow-2xl border relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-emerald-500 group-hover:scale-125 transition-transform">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                      </div>
                      <h3 className="text-3xl font-heading font-black mb-10 uppercase text-emerald-500 italic border-b border-emerald-500/10 pb-6">Neural Roadmap</h3>
                      <div className="text-xl text-slate-400 font-bold italic whitespace-pre-wrap leading-relaxed">{result.description}</div>
                   </div>
                 )}
              </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <ScoreCard label="Strategy IQ" score={result.scores?.clarity ?? 0} color="brand" description="Algorithm consistency" />
          <ScoreCard label="Engagement" score={result.scores?.engagement ?? 0} color="emerald" description="Retention factor" />
          <ScoreCard label="Overall Link" score={result.scores?.overall ?? 0} color="brand" gradient description="Finalized outcome" />
          
          <div className="glass p-10 rounded-[3.5rem] border shadow-2xl space-y-8">
             <h4 className="text-xs font-black uppercase tracking-widest text-emerald-500 italic flex items-center gap-4">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Action Checklist
             </h4>
             <div className="space-y-4">
                {result.improvements?.map((item, i) => (
                  <div key={i} className="flex gap-4 items-start group">
                    <div className="w-6 h-6 rounded-full border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 transition-all group-hover:scale-110">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="text-emerald-500 group-hover:text-white"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <p className="text-[10px] font-black uppercase text-slate-500 italic tracking-widest pt-1 leading-tight">{item.replace(/^- /, '')}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScoreCard = ({ label, score, color, gradient, description }: { label: string; score: number; color: string; gradient?: boolean; description: string }) => (
  <div className={`glass p-10 rounded-[3.5rem] border flex flex-col items-center justify-center text-center shadow-2xl group hover:scale-[1.02] transition-all relative overflow-hidden`}>
    {gradient && <div className="absolute inset-0 social-gradient opacity-[0.03]"></div>}
    <span className="text-[10px] font-black uppercase text-slate-500 mb-6 italic tracking-widest">{label}</span>
    <div className={`text-6xl font-black ${gradient ? 'bg-clip-text text-transparent social-gradient' : color === 'brand' ? 'text-social-brand' : 'text-emerald-500'} italic mb-4 tracking-tighter`}>{score}</div>
    <p className="text-[9px] font-black text-slate-500 uppercase mb-8">{description}</p>
    <div className="w-32 h-1.5 dark:bg-white/10 bg-slate-100 rounded-full overflow-hidden border dark:border-white/5">
      <div className={`h-full rounded-full ${gradient || color === 'brand' ? 'bg-social-brand' : 'bg-emerald-500'}`} style={{ width: `${score}%` }}></div>
    </div>
  </div>
);

export default AnalysisResultView;
