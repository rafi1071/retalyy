import React from 'react';
import { NavigationTab } from '../types';
import { RetalyyLogo } from './RetalyyLogo';

interface FooterProps {
  setActiveTab: (tab: NavigationTab) => void;
  onOpenBooking: () => void;
  onTriggerLoading?: () => void;
}

const COLUMNS: { title: string; links: { label: string; tab: NavigationTab }[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'Platform', tab: 'home' },
      { label: 'Solutions', tab: 'solutions' },
      { label: 'Operations engine', tab: 'calculator' },
      { label: 'Client portal', tab: 'portal' }
    ]
  },
  {
    title: 'Partners',
    links: [
      { label: 'For accounting firms', tab: 'firms' },
      { label: 'Research', tab: 'findings' },
      { label: 'Learn', tab: 'education' }
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'Mission', tab: 'mission' },
      { label: 'Contact', tab: 'contact' },
      { label: 'Security & legal', tab: 'legal' }
    ]
  }
];

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenBooking }) => {
  const go = (tab: NavigationTab) => setActiveTab(tab);

  return (
    <footer className="bg-[#07100C] text-white relative overflow-hidden rt-grain rt-edge-light">
      <div className="absolute left-1/2 -translate-x-1/2 -top-48 w-[800px] h-[360px] rounded-full bg-[#1FAE5B]/10 blur-[130px] pointer-events-none" />
      <div className="rt-dark-grid opacity-60" />
      <div className="rt-wrap relative pt-20 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-8 gap-y-12">
          <div className="col-span-2 md:col-span-5">
            <RetalyyLogo size="md" variant="light" />
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/55 tracking-[-0.01em]">
              The autonomous accounting platform. Books closed by software, reviewed by people.
            </p>
            <button type="button" onClick={onOpenBooking} className="rt-btn rt-btn-light rt-btn-sm mt-7">
              Book a demo
            </button>
          </div>

          {COLUMNS.map((col, i) => (
            <div key={col.title} className={`md:col-span-2 ${i === 0 ? 'md:col-start-7' : ''}`}>
              <div className="rt-eyebrow !text-white/40 mb-5">{col.title}</div>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <button
                      type="button"
                      onClick={() => go(l.tab)}
                      className="text-[14.5px] text-white/70 hover:text-white hover:translate-x-1 transition-all duration-200 tracking-[-0.01em]"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-8 border-t border-white/10 grid md:grid-cols-12 gap-6 text-[12.5px] text-white/40 leading-relaxed">
          <p className="md:col-span-8 max-w-2xl">
            Retalyy Inc. is a financial management software and operational technology platform. Retalyy is not a certified public accounting firm or legal advisor; software calculations and projections are for managerial planning purposes only.
          </p>
          <div className="md:col-span-4 md:text-right space-y-1">
            <div>
              <a href="mailto:concierge@retalyy.com" className="text-white/70 hover:text-white transition-colors">
                concierge@retalyy.com
              </a>
            </div>
            <div>© {new Date().getFullYear()} Retalyy Inc. All rights reserved.</div>
          </div>
        </div>

        <div className="mt-16 select-none overflow-hidden" aria-hidden="true">
          <div
            className="rt-display text-[clamp(88px,22vw,300px)] leading-[0.8] tracking-[-0.06em] text-transparent bg-clip-text bg-gradient-to-b from-white/[0.16] to-white/0 transition-all duration-700 hover:from-[#46D279]/30"
          >
            retalyy
          </div>
        </div>
      </div>
    </footer>
  );
};
