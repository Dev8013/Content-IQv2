
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

  const isChannelView = type === AnalysisType.CHANNEL_DEEP_DIVE && result.channelMetadata;

  if (isChannelView) {
    return (
      <div className="mt-20 animate-in fade-in duration-1000 pb-32">
        {/* YOUTUBE STYLE BANNER */}
        <div className="relative w-full aspect-[6/1] rounded-[3rem] overflow-hidden border shadow-2xl mb-10 max-w-[1400px] mx-auto group">
           {result.channelMetadata?.bannerUrl ? (
             <img src={result.channelMetadata.bannerUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Banner" />
           ) : (
             <div className="w-full h-full social-gradient opacity-10"></div>
           )}
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>

        {/* CHANNEL HEADER */}
        <div className="max-w-6xl mx-auto px-6 mb-16">
           <div className="flex flex-col md:flex-row items-center md:items-end gap-10 -mt-20 md:-mt-24 relative z-10 text-center md:text-left">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-8 border-white dark:border-black overflow-hidden shadow-2xl bg-white dark:bg-black">
                 {result.channelMetadata?.avatarUrl ? (
                   <img src={result.channelMetadata.avatarUrl} className="w-full h-full object-cover" alt="Avatar" />
                 ) : (
                   <div className="w-full h-full social-gradient"></div>
                 )}
              </div>
              <div className="flex-grow pb-4 space-y-4">
                 <h1 className="text-4xl md:text-6xl font-black tracking-tighter dark:text-white text-slate-900 italic">
                    {result.title || result.channelMetadata?.handle}
                 </h1>
                 <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-black dark:text-slate-400 text-slate-500 uppercase tracking-widest">
                    <span>{result.channelMetadata?.handle}</span>
                    <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                    <span>{result.channelMetadata?.subscriberCount} Subscribers</span>
                    <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                    <span>{result.channelMetadata?.videoCount} Videos</span>
                 </div>
                 <button className="px-10 py-4 bg-social-brand text-white font-black rounded-full shadow-lg shadow-social-brand/20 hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest">
                    Synchronize Neural Feed
                 </button>
              </div>
           </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="max-w-6xl mx-auto px-6 mb-12 border-b dark:border-white/10 border-slate-200">
           <div className="flex gap-10">
              {['home', 'videos', 'analytics'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${
                    activeTab === tab ? 'text-social-brand' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-social-brand rounded-full"></div>}
                </button>
              ))}
           </div>
        </div>

        <div className="max-w-6xl mx-auto px-6">
           {activeTab === 'home' && (
             <div className="space-y-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
                {/* TOP STATS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                   {result.stats?.map((stat, i) => (
                     <div key={i} className="glass p-8 rounded-[2.5rem] border shadow-xl flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</span>
                        <div className="text-2xl font-black text-social-brand italic tracking-tighter">{stat.value}</div>
                     </div>
                   ))}
                </div>

                {/* FEATURED VIDEOS GRID */}
                <div>
                   <h3 className="text-2xl font-black mb-10 italic uppercase tracking-tighter dark:text-white text-slate-900 border-l-4 border-social-brand pl-6">
                      Neural <span className="text-social-brand">Feed</span>
                   </h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                      {result.channelVideos?.map((video) => (
                        <div 
                          key={video.id} 
                          onClick={() => onVideoClick?.(video.id)}
                          className="group cursor-pointer space-y-4"
                        >
                           <div className="relative aspect-video rounded-[2rem] overflow-hidden border shadow-xl group-hover:scale-[1.02] transition-transform duration-500">
                              <img src={video.thumbnail} className="w-full h-full object-cover" alt={video.title} />
                              <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 backdrop-blur-md rounded-md text-[10px] font-black text-white">
                                 {video.duration}
                              </div>
                              <div className="absolute inset-0 bg-social-brand/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                 <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-transform">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="m7 4 12 8-12 8V4z"/></svg>
                                 </div>
                              </div>
                           </div>
                           <div className="space-y-2">
                              <h4 className="text-sm font-black dark:text-white text-slate-800 leading-snug line-clamp-2 group-hover:text-social-brand transition-colors italic uppercase tracking-tight">
                                 {video.title}
                              </h4>
                              <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                 <span>{video.views} Views</span>
                                 <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                                 <span>{video.publishedAt}</span>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'videos' && (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 animate-in fade-in duration-700">
                {result.channelVideos?.map((video) => (
                   <div key={video.id} onClick={() => onVideoClick?.(video.id)} className="group cursor-pointer space-y-4">
                      {/* Similar card structure */}
                      <div className="relative aspect-video rounded-[2rem] overflow-hidden border shadow-xl group-hover:scale-[1.02] transition-all">
                         <img src={video.thumbnail} className="w-full h-full object-cover" alt={video.title} />
                         <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 backdrop-blur-md rounded-md text-[10px] font-black text-white">{video.duration}</div>
                      </div>
                      <div className="space-y-2">
                         <h4 className="text-sm font-black dark:text-white text-slate-800 leading-snug line-clamp-2 italic uppercase tracking-tight group-hover:text-social-brand transition-colors">{video.title}</h4>
                         <div className="flex items-center gap-3 text-[10px] font-black text-slate-500">{video.views} • {video.publishedAt}</div>
                      </div>
                   </div>
                ))}
             </div>
           )}

           {activeTab === 'analytics' && (
             <div className="space-y-16 animate-in fade-in duration-700">
                {/* ANALYTICS VIEW - Recharts & Summary */}
                {result.chartData && (
                  <div className="glass p-12 rounded-[4rem] border shadow-2xl">
                     <h3 className="text-2xl font-black mb-10 dark:text-white text-slate-900 uppercase italic">Algorithmic <span className="text-social-brand">Velocity</span></h3>
                     <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={result.chartData}>
                            <defs>
                              <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#FF0050" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#FF0050" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                            <YAxis hide />
                            <Tooltip contentStyle={{ backgroundColor: 'black', border: 'none', borderRadius: '20px' }} />
                            <Area type="monotone" dataKey="value" stroke="#FF0050" strokeWidth={4} fill="url(#velocityGrad)" />
                          </AreaChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                   <div className="glass p-10 rounded-[3rem] border">
                      <h4 className="text-xl font-black mb-6 text-social-brand uppercase italic">Channel Synopsis</h4>
                      <div className="text-lg text-slate-400 font-medium italic whitespace-pre-wrap">{result.summary}</div>
                   </div>
                   <div className="glass p-10 rounded-[3rem] border">
                      <h4 className="text-xl font-black mb-6 text-emerald-500 uppercase italic">Growth Protocol</h4>
                      <div className="space-y-4">
                         {result.improvements.map((imp, i) => (
                           <div key={i} className="flex gap-4 items-start text-sm font-bold dark:text-slate-200 text-slate-700 italic">
                              <span className="text-emerald-500 text-lg">✓</span>
                              {imp}
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
             <div className="glass p-12 rounded-[4rem] shadow-2xl border">
                <h3 className="text-3xl font-heading font-black mb-10 uppercase text-social-brand italic border-b border-social-brand/10 pb-6">Executive Summary</h3>
                <div className="text-xl text-slate-400 font-bold italic whitespace-pre-wrap">{result.summary}</div>
             </div>
             {result.description && (
               <div className="glass p-12 rounded-[4rem] shadow-2xl border">
                  <h3 className="text-3xl font-heading font-black mb-10 uppercase text-emerald-500 italic border-b border-emerald-500/10 pb-6">Content Insight</h3>
                  <div className="text-xl text-slate-400 font-bold italic whitespace-pre-wrap">{result.description}</div>
               </div>
             )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <ScoreCard label="Strategy IQ" score={result.scores?.clarity ?? 0} color="brand" description="Algorithm consistency" />
          <ScoreCard label="Engagement" score={result.scores?.engagement ?? 0} color="emerald" description="Retention factor" />
          <ScoreCard label="Overall Link" score={result.scores?.overall ?? 0} color="brand" gradient description="Finalized outcome" />
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
