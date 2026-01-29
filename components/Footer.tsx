
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-20 px-6 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white font-bold">IQ</div>
            <span className="text-xl font-black">Content IQ</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            AI-powered content analysis for YouTube videos and PDFs. Get insights, scores, and actionable suggestions to grow your reach.
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-lg">Product</h4>
          <ul className="space-y-4 text-slate-400">
            <li><a href="#" className="hover:text-violet-500 transition-colors">Pricing</a></li>
            <li><a href="#" className="hover:text-violet-500 transition-colors">Analyze Content</a></li>
            <li><a href="#" className="hover:text-violet-500 transition-colors">Features</a></li>
            <li><a href="#" className="hover:text-violet-500 transition-colors">Tools</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-lg">Company</h4>
          <ul className="space-y-4 text-slate-400">
            <li><a href="#" className="hover:text-violet-500 transition-colors">Contact</a></li>
            <li><a href="#" className="hover:text-violet-500 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-violet-500 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-violet-500 transition-colors">Blog</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-lg">Social</h4>
          <div className="flex gap-4">
            <SocialIcon icon={<TwitterIcon />} />
            <SocialIcon icon={<LinkedinIcon />} />
            <SocialIcon icon={<GithubIcon />} />
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/10 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} Content IQ. All rights reserved.
      </div>
    </footer>
  );
};

const SocialIcon: React.FC<{ icon: React.ReactNode }> = ({ icon }) => (
  <a href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-violet-600 transition-all text-slate-300 hover:text-white">
    {icon}
  </a>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

export default Footer;
