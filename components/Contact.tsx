
import React from 'react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24 px-6 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-5xl md:text-6xl font-black mb-4">
          Get in <span className="text-violet-500">Touch</span>
        </h2>
        <p className="text-slate-400 text-lg">Have questions? We'd love to hear from you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="glass p-8 rounded-3xl flex items-center gap-6 border border-white/5">
          <div className="w-14 h-14 bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-500">
             <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          </div>
          <div>
            <h4 className="font-bold">Email Us</h4>
            <p className="text-slate-400">support@contentiq.ai</p>
          </div>
        </div>
        <div className="glass p-8 rounded-3xl flex items-center gap-6 border border-white/5">
          <div className="w-14 h-14 bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-500">
             <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
          </div>
          <div>
            <h4 className="font-bold">Live Chat</h4>
            <p className="text-slate-400">Available 9am - 6pm EST</p>
          </div>
        </div>
      </div>

      <div className="glass p-12 rounded-[2.5rem] border border-white/5">
        <h3 className="text-2xl font-bold mb-8">Send us a message</h3>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400">Name</label>
              <input 
                type="text" 
                placeholder="Your name" 
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400">Email</label>
              <input 
                type="email" 
                placeholder="you@mail.com" 
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400">Message</label>
            <textarea 
              rows={4} 
              placeholder="How can we help you?" 
              className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all resize-none"
            ></textarea>
          </div>
          <button className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white font-black text-lg rounded-xl transition-all shadow-xl shadow-violet-500/20 active:scale-[0.98] flex items-center justify-center gap-3">
            Send Message
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4"/><path d="M12 16V8"/></svg>
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
