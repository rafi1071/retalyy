import React, { useState, useEffect } from 'react';
import { NavigationTab } from '../types';
import { RetalyyLogo } from './RetalyyLogo';

interface HeaderProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  onOpenBooking: () => void;
}

const NAV_ITEMS: { label: string; tab: NavigationTab; href: string }[] = [
  { label: 'Platform', tab: 'home', href: '/' },
  { label: 'Solutions', tab: 'solutions', href: '/solutions' },
  { label: 'For firms', tab: 'firms', href: '/firms' },
  { label: 'For trades', tab: 'trades', href: '/trades' },
  { label: 'Mission', tab: 'mission', href: '/mission' },
  { label: 'Research', tab: 'findings', href: '/findings' },
  { label: 'Security', tab: 'legal', href: '/legal' }
];

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenBooking }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const go = (tab: NavigationTab, href: string, e?: React.MouseEvent) => {
    if (e) {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
    }
    setActiveTab(tab);
    setMobileOpen(false);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-500 ${
        scrolled || mobileOpen
          ? 'bg-[#FBFBF9]/80 backdrop-blur-2xl backdrop-saturate-150 border-b border-[#E4E7E1] shadow-[0_8px_30px_-18px_rgba(11,18,16,0.25)]'
          : 'bg-[#FBFBF9]/0 border-b border-transparent'
      }`}
    >
      <div className={`rt-wrap flex items-center justify-between transition-[height] duration-300 ${scrolled ? 'h-14' : 'h-16'}`}>
        <div className="flex items-center gap-10">
          <a
            href="/"
            onClick={(e) => go('home', '/', e)}
            className="flex items-center cursor-pointer shrink-0 transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
            aria-label="Retalyy home"
          >
            <RetalyyLogo size="md" variant="dark" />
          </a>

          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.tab}
                href={item.href}
                onClick={(e) => go(item.tab, item.href, e)}
                data-active={activeTab === item.tab}
                className="rt-nav-link"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/portal"
            onClick={(e) => go('portal', '/portal', e)}
            className="hidden sm:inline-flex rt-nav-link"
            data-active={activeTab === 'portal'}
          >
            Sign in
          </a>
          <button
            type="button"
            onClick={onOpenBooking}
            className="rt-btn rt-btn-primary rt-btn-sm"
          >
            Book a demo
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2.5 6h7m0 0L6.5 3m3 3L6.5 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden ml-1 w-9 h-9 inline-flex items-center justify-center rounded-lg hover:bg-black/5"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              {mobileOpen ? (
                <path d="M4 4l10 10M14 4L4 14" stroke="#0B1210" strokeWidth="1.5" strokeLinecap="round" />
              ) : (
                <path d="M3 6h12M3 12h12" stroke="#0B1210" strokeWidth="1.5" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="rt-menu-in lg:hidden border-t border-[#E4E7E1] bg-[#FBFBF9]">
          <div className="rt-wrap py-4 flex flex-col">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.tab}
                href={item.href}
                onClick={(e) => go(item.tab, item.href, e)}
                className="text-left py-3 text-[17px] font-medium tracking-tight text-[#0B1210] border-b border-[#EDEFEA]"
              >
                {item.label}
              </a>
            ))}
            <a
              href="/portal"
              onClick={(e) => go('portal', '/portal', e)}
              className="text-left py-3 text-[17px] font-medium tracking-tight text-[#0B1210]"
            >
              Sign in
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
