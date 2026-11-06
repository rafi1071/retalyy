import React, { useState, useEffect } from 'react';
import { NavigationTab } from '../types';
import { Reveal, CountUp, SpotlightCard, Tilt, Magnetic, RotatingWord, Accordion } from './ui/Motion';

interface HomeViewProps {
  setActiveTab: (tab: NavigationTab) => void;
  onOpenBooking: () => void;
}

/* ───────────────────────── helpers ───────────────────────── */

const Arrow: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M2.5 6h7m0 0L6.5 3m3 3L6.5 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Check: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Icon: React.FC<{ d: string; className?: string }> = ({ d, className = '' }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

const ICONS = {
  scan: 'M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M4 12h16',
  tag: 'M3 12V4h8l10 10-8 8L3 12zM7.5 8.5h.01',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  chart: 'M4 20V10M10 20V4M16 20v-8M22 20H2',
  shield: 'M12 3l8 3v6c0 4.5-3.2 8.2-8 9-4.8-.8-8-4.5-8-9V6l8-3zM9 12l2 2 4-4',
  users: 'M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM21 20v-1a4 4 0 0 0-3-3.9M16 4.1a3.5 3.5 0 0 1 0 6.8'
};

/* ───────────────────────── hero product shot ───────────────────────── */

const TXNS: { vendor: string; category: string; amount: string; conf: string; review?: boolean }[] = [
  { vendor: 'Stripe payout', category: 'Revenue · Card sales', amount: '+$18,420.00', conf: '99%' },
  { vendor: 'AWS EMEA', category: 'Hosting & infrastructure', amount: '−$2,184.12', conf: '98%' },
  { vendor: 'Gusto payroll', category: 'Payroll & benefits', amount: '−$41,260.00', conf: '99%' },
  { vendor: 'Brex statement', category: 'Software & subscriptions', amount: '−$6,318.40', conf: '97%' },
  { vendor: 'Wire · J. Alvarez', category: 'Uncategorized', amount: '+$7,500.00', conf: '61%', review: true }
];

const HeroProduct: React.FC = () => {
  const [approved, setApproved] = useState(false);
  const [cursor, setCursor] = useState(false);

  useEffect(() => {
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    let alive = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(() => alive && fn(), ms));
    const loop = () => {
      at(3600, () => setCursor(true));
      at(4700, () => setApproved(true));
      at(5300, () => setCursor(false));
      at(10500, () => { setApproved(false); loop(); });
    };
    loop();
    return () => { alive = false; timers.forEach(clearTimeout); };
  }, []);

  return (
  <div className="rt-window text-left relative">
    {/* window chrome */}
    <div className="flex items-center gap-2 px-4 h-11 border-b border-[#EEF0EB] bg-[#FAFBF9]">
      <span className="rt-dot" />
      <span className="rt-dot" />
      <span className="rt-dot" />
      <div className="mx-auto hidden sm:flex items-center gap-2 px-3 h-6 rounded-md bg-[#F0F2EE] text-[11px] text-[#6B766F] font-mono">
        app.retalyy.com / close / march
      </div>
    </div>

    <div className="grid grid-cols-12">
      {/* sidebar */}
      <aside className="hidden md:block col-span-2 border-r border-[#EEF0EB] bg-[#FAFBF9] p-4 min-h-[460px]">
        <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#9AA39D] mb-3">Workspace</div>
        {['Close', 'Ledger', 'Reconciliation', 'Review queue', 'Reports'].map((item, i) => (
          <div
            key={item}
            className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-[13px] mb-0.5 ${
              i === 0 ? 'bg-white border border-[#E4E7E1] text-[#0B1210] font-medium shadow-[0_1px_2px_rgba(11,18,16,0.04)]' : 'text-[#6B766F]'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-[#1FAE5B]' : 'bg-[#D3D8D0]'}`} />
            {item}
          </div>
        ))}
      </aside>

      {/* main */}
      <div className="col-span-12 md:col-span-10 p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="rt-eyebrow">March close</div>
            <div className="rt-display text-[26px] sm:text-[30px] mt-1.5 text-[#0B1210]"><CountUp to={96} duration={2200} suffix="% complete" /></div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rt-tag rt-tag-green">
              <span className="rt-live" style={{ width: 6, height: 6 }} />
              Reconciling live
            </span>
            <span className="rt-tag rt-tag-gray">Day 2 of close</span>
          </div>
        </div>

        {/* progress */}
        <div className="mt-5 h-1.5 rounded-full bg-[#EEF0EB] overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-[#0B1210] to-[#1FAE5B] origin-left" style={{ width: '96%', animation: 'rtStepGrow 2.2s cubic-bezier(.16,1,.3,1) .3s both' }} />
        </div>

        {/* kpis */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { k: 'Cash on hand', v: <CountUp to={482910} prefix="$" duration={2200} />, d: '+4.2%' },
            { k: 'Revenue MTD', v: <CountUp to={214300} prefix="$" duration={2200} />, d: '+11.8%' },
            { k: 'Auto-coded', v: <CountUp to={approved ? 1205 : 1204} duration={approved ? 400 : 2200} from={approved ? 1204 : 0} />, d: 'of 1,267' },
            { k: 'Needs review', v: <span key={String(approved)} className="rt-pop inline-block">{approved ? 62 : 63}</span>, d: approved ? '4.9%' : '5.0%' }
          ].map((m, i) => (
            <div key={m.k} className="rt-row-in rounded-xl border border-[#E9ECE6] p-3.5 bg-white hover:border-[#C9D2C6] transition-colors" style={{ animationDelay: `${200 + i * 90}ms` }}>
              <div className="text-[12px] text-[#6B766F]">{m.k}</div>
              <div className="rt-display text-[22px] mt-1 text-[#0B1210] tabular-nums">{m.v}</div>
              <div className="text-[11.5px] text-[#1B8F4D] mt-0.5 font-medium">{m.d}</div>
            </div>
          ))}
        </div>

        {/* chart + table */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-2 rounded-xl border border-[#E9ECE6] p-4">
            <div className="flex items-center justify-between">
              <div className="text-[12px] text-[#6B766F]">Cash runway</div>
              <div className="text-[12px] font-medium text-[#0B1210]">14.2 months</div>
            </div>
            <svg viewBox="0 0 300 110" className="w-full mt-3" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="rtArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#1FAE5B" stopOpacity="0.22" />
                  <stop offset="1" stopColor="#1FAE5B" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 88 C30 82 50 70 80 66 C110 62 130 72 160 52 C190 34 220 40 250 22 C270 14 285 12 300 8 L300 110 L0 110 Z" fill="url(#rtArea)" />
              <path
                className="rt-draw"
                style={{ '--len': 520 } as React.CSSProperties}
                d="M0 88 C30 82 50 70 80 66 C110 62 130 72 160 52 C190 34 220 40 250 22 C270 14 285 12 300 8"
                stroke="#1FAE5B"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="300" cy="8" r="9" fill="#1FAE5B" opacity="0.18" className="rt-pulse-dot" />
              <circle cx="300" cy="8" r="3.5" fill="#1FAE5B" />
            </svg>
          </div>

          <div className="lg:col-span-3 rounded-xl border border-[#E9ECE6] overflow-hidden">
            <div className="grid grid-cols-12 px-4 py-2.5 text-[11px] font-mono uppercase tracking-[0.1em] text-[#9AA39D] bg-[#FAFBF9] border-b border-[#EEF0EB]">
              <div className="col-span-5">Transaction</div>
              <div className="col-span-3 hidden sm:block">Category</div>
              <div className="col-span-4 sm:col-span-2 text-right">Amount</div>
              <div className="col-span-3 sm:col-span-2 text-right">Match</div>
            </div>
            {TXNS.map((t, i) => {
              const isReview = !!t.review;
              const done = isReview && approved;
              return (
              <div
                key={t.vendor}
                className={`rt-row-in relative grid grid-cols-12 items-center px-4 py-2.5 text-[12.5px] border-b border-[#F2F4F0] last:border-0 transition-colors duration-500 ${isReview && !approved ? 'bg-[#FFFBEF]' : done ? 'bg-[#F0FAF4]' : ''}`}
                style={{ animationDelay: `${500 + i * 140}ms` }}
              >
                <div className="col-span-5 font-medium text-[#0B1210] truncate pr-2">{t.vendor}</div>
                <div className="col-span-3 hidden sm:block text-[#6B766F] truncate pr-2">{done ? 'Consulting revenue' : t.category}</div>
                <div className="col-span-4 sm:col-span-2 text-right tabular-nums text-[#28322D]">{t.amount}</div>
                <div className="col-span-3 sm:col-span-2 flex justify-end">
                  <span key={String(done)} className={`rt-tag rt-pop ${isReview && !approved ? 'rt-tag-amber' : 'rt-tag-green'}`}>{isReview ? (approved ? 'Approved' : 'Review') : t.conf}</span>
                </div>
                {isReview && cursor && !approved && (
                  <svg className="rt-cursor" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 3l14 7-6 2-2 6L5 3z" fill="#0B1210" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

/* ───────────────────────── how-it-works visuals ───────────────────────── */

const StepIngest: React.FC = () => (
  <div className="grid sm:grid-cols-2 gap-4 p-5 sm:p-7">
    <div className="rounded-xl bg-white/[0.04] border border-white/10 p-5">
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-white/50 font-mono">invoice_8841.pdf</span>
        <span className="rt-tag rt-tag-dark">Reading</span>
      </div>
      <div className="mt-5 space-y-2.5">
        {[78, 92, 64, 85, 48].map((w, i) => (
          <div key={i} className="h-2 rounded-full bg-white/10" style={{ width: `${w}%` }} />
        ))}
      </div>
      <div className="mt-6 flex items-end justify-between border-t border-white/10 pt-4">
        <span className="text-[12px] text-white/40">Total due</span>
        <span className="rt-display text-[22px] text-white tabular-nums">$4,820.00</span>
      </div>
    </div>
    <div className="rounded-xl bg-white/[0.04] border border-white/10 p-5">
      <div className="text-[12px] text-white/50 font-mono mb-4">Extracted</div>
      {[
        ['Vendor', 'Northwind Supply Co.'],
        ['Invoice date', 'Mar 14, 2026'],
        ['Due', 'Net 30'],
        ['Category', 'Cost of goods'],
        ['Entity', 'Retalyy Demo LLC']
      ].map(([k, v]) => (
        <div key={k} className="flex items-center justify-between py-2.5 border-b border-white/[0.07] last:border-0 text-[13px]">
          <span className="text-white/45">{k}</span>
          <span className="text-white/90 flex items-center gap-2">
            {v}
            <Check className="text-[#46D279]" />
          </span>
        </div>
      ))}
    </div>
  </div>
);

const StepClose: React.FC = () => (
  <div className="p-5 sm:p-7">
    <div className="flex items-center justify-between mb-5">
      <span className="text-[12px] text-white/50 font-mono">Bank feed ↔ Ledger</span>
      <span className="rt-tag rt-tag-dark">
        <span className="rt-live" style={{ width: 6, height: 6 }} />
        Matching
      </span>
    </div>
    <div className="space-y-2">
      {[
        ['Mercury · Stripe payout', 'Invoice #1042', '$18,420.00'],
        ['Mercury · AWS', 'Bill · Hosting', '$2,184.12'],
        ['Mercury · Gusto', 'Payroll run 03/15', '$41,260.00'],
        ['Brex · Figma', 'Bill · Software', '$480.00']
      ].map(([a, b, c], i) => (
        <div key={a} className="rt-row-in grid grid-cols-12 items-center gap-2 rounded-lg bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-[13px]" style={{ animationDelay: `${i * 120}ms` }}>
          <div className="col-span-5 text-white/85 truncate">{a}</div>
          <div className="col-span-1 text-[#46D279] flex justify-center">
            <Icon d={ICONS.link} className="w-4 h-4" />
          </div>
          <div className="col-span-4 text-white/55 truncate">{b}</div>
          <div className="col-span-2 text-right text-white/90 tabular-nums">{c}</div>
        </div>
      ))}
    </div>
    <div className="mt-5 flex items-center justify-between text-[12.5px] text-white/45">
      <span>1,204 of 1,267 matched automatically</span>
      <span className="text-[#46D279]">Balanced</span>
    </div>
  </div>
);

const StepReview: React.FC = () => (
  <div className="p-5 sm:p-7">
    <div className="flex items-center justify-between mb-5">
      <span className="text-[12px] text-white/50 font-mono">Review queue · 63 items</span>
      <span className="hidden sm:flex items-center gap-1.5 text-[11.5px] text-white/40">
        <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/70 font-mono">A</kbd> approve
        <kbd className="ml-2 px-1.5 py-0.5 rounded bg-white/10 text-white/70 font-mono">E</kbd> edit
      </span>
    </div>
    <div className="rounded-xl bg-white/[0.05] border border-white/10 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-white text-[15px] font-medium tracking-[-0.01em]">Wire · J. Alvarez</div>
          <div className="text-white/45 text-[13px] mt-1">Mar 19 · Mercury Checking</div>
        </div>
        <div className="rt-display text-[22px] text-white tabular-nums">$7,500.00</div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2 text-[12.5px]">
        {[
          ['Consulting revenue', '61%', true],
          ['Customer deposit', '27%', false],
          ['Owner contribution', '12%', false]
        ].map(([label, pct, top]) => (
          <div key={String(label)} className={`rounded-lg px-3 py-2.5 border ${top ? 'border-[#46D279]/50 bg-[#46D279]/10 text-white' : 'border-white/10 text-white/55'}`}>
            <div className="truncate">{label}</div>
            <div className="mt-0.5 tabular-nums text-[11.5px] opacity-70">{pct}</div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex gap-2">
        <span className="rt-btn rt-btn-green rt-btn-sm">Approve suggestion</span>
        <span className="rt-btn rt-btn-outline-dark rt-btn-sm">Request context</span>
      </div>
    </div>
    <div className="mt-4 text-[12.5px] text-white/40">Every decision is logged with the source document, the reviewer and the time.</div>
  </div>
);

const STEPS = [
  {
    n: '01',
    title: 'Ingest',
    body: 'Connect bank feeds, upload PDF statements, or simply forward invoices to email. Retalyy starts with whatever data you choose to provide.',
    visual: <StepIngest />
  },
  {
    n: '02',
    title: 'Reconcile',
    body: 'Transactions are coded, matched to supporting source files and reconciled against feeds, keeping records clean and organized.',
    visual: <StepClose />
  },
  {
    n: '03',
    title: 'Review',
    body: 'Your team and CPA partners review exceptions with source evidence attached. Adjust, confirm, and prepare for final sign-off.',
    visual: <StepReview />
  }
];

/* ───────────────────────── static content ───────────────────────── */

const FEATURES: { icon: string; title: string; body: string; wide?: boolean }[] = [
  {
    icon: ICONS.scan,
    title: 'Flexible document intake',
    body: 'Vision models read uploaded invoices, receipts, and statements—or extract items forwarded directly to your dedicated email address.',
    wide: true
  },
  { icon: ICONS.tag, title: 'Smart categorization', body: 'A chart of accounts that learns operational workflows and drafts consistent categorization for review.' },
  { icon: ICONS.link, title: 'Continuous reconciliation', body: 'Bank, card and payment feeds matched to the ledger in real time for clean visibility.' },
  {
    icon: ICONS.chart,
    title: 'Dynamic dashboards',
    body: 'A financial dashboard composed for each business and industry, delivering clear managerial visibility.',
    wide: true
  },
  { icon: ICONS.shield, title: 'Source-linked verification', body: 'A complete, source-cited inspection trail behind every number, ready for controller or CPA review.' },
  { icon: ICONS.users, title: 'CPA firm partnership', body: 'Multi-client workspaces, shared review queues and clean export binders designed for accounting firms.', wide: true }
];

const INTEGRATIONS = ['Plaid', 'Stripe', 'Gusto', 'Mercury', 'Brex', 'Ramp', 'Rippling', 'Chase', 'Silicon Valley Bank', 'ADP', 'DocuSign', 'ServiceTitan'];

const SECURITY = [
  ['Zero money-moving access', 'Strictly read-only connections with zero payment initiation, wire transfers, or custody of your funds.'],
  ['Permission transparency', 'Users can see connected accounts, what data is accessed, and revoke permissions at any time.'],
  ['Traceable AI processing', 'Every entry preserves underlying source documents, extracted values, and complete reviewer history.'],
  ['Accountant-controlled approvals', 'AI drafts entries and reconciliation suggestions; authorized human reviewers retain final approval.']
];


/* ───────────────────────── live close activity ───────────────────────── */

const EVENTS: { icon: string; title: string; meta: string; tag: string; tone: 'green' | 'gray' | 'amber' }[] = [
  { icon: ICONS.scan, title: 'Read invoice · Northwind Supply Co.', meta: '$4,820.00 · 7 fields extracted', tag: 'Ingested', tone: 'gray' },
  { icon: ICONS.tag, title: 'Coded Stripe payout to Card sales', meta: 'Revenue · matched to 14 invoices', tag: '99%', tone: 'green' },
  { icon: ICONS.link, title: 'Reconciled Mercury checking', meta: '212 of 212 lines matched', tag: 'Balanced', tone: 'green' },
  { icon: ICONS.users, title: 'Flagged wire · J. Alvarez for review', meta: '3 candidate accounts, evidence attached', tag: 'Review', tone: 'amber' },
  { icon: ICONS.shield, title: 'Advisor reviewed 41 entries', meta: 'Verified with source documentation', tag: 'Verified', tone: 'green' },
  { icon: ICONS.chart, title: 'Updated cash runway forecast', meta: '14.2 months · +0.3 vs last week', tag: 'Live', tone: 'green' },
  { icon: ICONS.scan, title: 'Read statement · Brex March', meta: '318 transactions imported', tag: 'Ingested', tone: 'gray' },
  { icon: ICONS.tag, title: 'Coded AWS EMEA to Hosting', meta: 'Learned from 6 prior months', tag: '98%', tone: 'green' }
];

const WEEKS = [58, 66, 72, 79, 85, 90, 94, 96];

const LiveClose: React.FC = () => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const t = setInterval(() => setTick((n) => n + 1), 2400);
    return () => clearInterval(t);
  }, []);

  const visible = Array.from({ length: 4 }, (_, i) => tick + (3 - i)); // newest first

  return (
    <section className="pb-24 sm:pb-36">
      <div className="rt-wrap">
        <Reveal>
          <div className="rt-eyebrow">Always closing</div>
          <h2 className="rt-display mt-5 max-w-[760px] text-[clamp(36px,5.2vw,64px)] text-[#0B1210]">
            The close is not an event. <span className="rt-serif text-[#5E6A63]">It is a stream.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid lg:grid-cols-12 gap-4">
          <Reveal className="lg:col-span-7">
            <SpotlightCard className="rt-card h-full p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-[14px] font-medium text-[#0B1210]">
                  <span className="rt-live" />
                  Activity
                </div>
                <span className="rt-tag rt-tag-gray">Illustrative</span>
              </div>
              <div className="rt-ticker mt-6 space-y-2.5 min-h-[330px]">
                {visible.map((n, i) => {
                  const e = EVENTS[n % EVENTS.length];
                  return (
                    <div
                      key={n}
                      className="rt-ticker-item flex items-center gap-4 rounded-xl border border-[#E9ECE6] bg-white px-4 py-3.5 transition-opacity duration-500"
                      style={{ opacity: 1 - i * 0.22 }}
                    >
                      <span className="shrink-0 w-9 h-9 rounded-lg bg-[#F1F4EF] border border-[#E4E7E1] flex items-center justify-center text-[#0B1210]">
                        <Icon d={e.icon} className="w-[18px] h-[18px]" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[14px] font-medium text-[#0B1210] truncate">{e.title}</div>
                        <div className="text-[12.5px] text-[#6B766F] truncate">{e.meta}</div>
                      </div>
                      <span className={`rt-tag ${e.tone === 'green' ? 'rt-tag-green' : e.tone === 'amber' ? 'rt-tag-amber' : 'rt-tag-gray'}`}>{e.tag}</span>
                    </div>
                  );
                })}
              </div>
            </SpotlightCard>
          </Reveal>

          <Reveal delay={100} className="lg:col-span-5">
            <SpotlightCard dark className="h-full rounded-[18px] bg-[#0B1210] text-white p-6 sm:p-8 flex flex-col rt-grain">
              <div className="flex items-center justify-between">
                <div className="text-[14px] font-medium">Auto-coded share</div>
                <span className="rt-tag rt-tag-dark">Last 8 weeks</span>
              </div>
              <div className="rt-display mt-5 text-[64px] tabular-nums leading-none">
                <CountUp to={96} suffix="%" duration={2000} />
              </div>
              <p className="mt-2 text-[14px] text-white/50">of entries coded without a human touch, and climbing as the model learns the business.</p>
              <div className="mt-auto pt-10 flex items-end gap-2 h-[170px]">
                {WEEKS.map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end h-full">
                    <div
                      className={`rt-bar rounded-md ${i === WEEKS.length - 1 ? 'bg-[#46D279]' : 'bg-white/15'}`}
                      style={{ height: `${h}%`, '--delay': `${i * 90}ms` } as React.CSSProperties}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between text-[11px] font-mono text-white/35">
                <span>W1</span>
                <span>W8</span>
              </div>
            </SpotlightCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

const FAQ_ITEMS = [
  {
    q: 'Is Retalyy a complete standalone financial ledger?',
    a: 'Yes. Retalyy is built as a complete, modern system of record with continuous bank sync, automated transaction drafting, and real-time reconciliation—eliminating the need for fragmented legacy accounting software.'
  },
  {
    q: 'How does Retalyy collaborate with my CPA or accounting firm?',
    a: 'Retalyy is built to empower your relationship with your CPA. We automate repetitive data entry, document extraction, and feed matching, delivering organized, source-cited records so your CPA can focus on tax strategy, advisory, and official sign-off.'
  },
  {
    q: 'How does Retalyy protect financial data and privacy?',
    a: 'Your financial data is protected by AES-256 encryption at rest and in transit, strict role-based access controls, and SOC 2-aligned security standards. We never sell your data or use private financial records to train public AI models.'
  },
  {
    q: 'Does Retalyy move funds or provide tax and audit opinions?',
    a: 'No. Retalyy is an operational financial software platform. We track bills and schedule payment reminders through your existing commercial bank rails, and we prepare structured records for your licensed CPA or tax professional to review and file.'
  },
  {
    q: 'Do I have to connect a bank account to start using Retalyy?',
    a: 'No. Retalyy is optional-first. You can get started immediately without connecting a bank account or uploading a single document. Provide data however works best for you—via read-only bank feeds, statement uploads, spreadsheet imports, or email forwarding.'
  }
];

/* ───────────────────────── page ───────────────────────── */

export const HomeView: React.FC<HomeViewProps> = ({ setActiveTab, onOpenBooking }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setStep((s) => (s + 1) % STEPS.length), 7000);
    return () => clearTimeout(t);
  }, [step]);

  const scrollToPlatform = () => {
    const el = document.getElementById('platform');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="rt-page overflow-x-clip">
      {/* ── HERO ── */}
      <section
        className="rt-hero relative overflow-hidden"
        style={{ paddingTop: 'clamp(48px, 6vw, 80px)', paddingBottom: 0 }}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty('--hx', `${e.clientX - r.left}px`);
          e.currentTarget.style.setProperty('--hy', `${e.clientY - r.top}px`);
        }}
      >
        {/* Background layers */}
        <div className="rt-hero-spot" aria-hidden="true" />
        <div className="rt-aurora" aria-hidden="true"><i /><i /><i /></div>
        <div className="rt-gridlines" />
        {/* Strong green radial glow — the hero's signature */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(900px ellipse at 50% -120px, rgba(31,174,91,0.13) 0%, transparent 65%)' }}
          aria-hidden="true"
        />

        <div className="rt-wrap relative">

          {/* ══ TEXT BLOCK ══ */}
          <div className="max-w-[820px] mx-auto text-center">

            {/* Pill */}
            <div className="rt-fade-up" style={{ '--delay': '0ms' } as React.CSSProperties}>
              <button
                type="button"
                onClick={scrollToPlatform}
                className="rt-hero-pill group"
              >
                <span className="rt-hero-pill-badge">
                  <span className="rt-live" style={{ width: 5, height: 5 }} />
                  New
                </span>
                <span>The autonomous accounting platform</span>
                <svg className="w-3 h-3 opacity-50 group-hover:opacity-80 transition-all duration-200 group-hover:translate-x-0.5" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2.5 6h7M7 3.5 9.5 6 7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Headline — large, editorial, gradient accent */}
            <h1 className="rt-display mt-6 text-[#0B1210]" style={{ fontSize: 'clamp(42px,7vw,88px)', lineHeight: 0.97, letterSpacing: '-0.048em' }}>
              <span className="rt-line" style={{ '--delay': '50ms' } as React.CSSProperties}>
                <span>The monthly close,</span>
              </span>
              <span className="rt-line" style={{ '--delay': '160ms' } as React.CSSProperties}>
                <span className="rt-serif rt-hero-gradient font-normal tracking-[-0.03em] pr-[0.06em]" style={{ fontSize: '1.04em' }}>on autopilot.</span>
              </span>
            </h1>

            {/* Sub-headline */}
            <p
              className="rt-fade-up mx-auto mt-5 max-w-[520px] text-[16.5px] leading-[1.62] tracking-[-0.01em] text-[#52615A]"
              style={{ '--delay': '180ms' } as React.CSSProperties}
            >
              Retalyy reads every document, codes every transaction and reconciles every account. Your team reviews the 5% that needs a human.
            </p>

            {/* CTAs */}
            <div
              className="rt-fade-up mt-7 flex flex-wrap items-center justify-center gap-2.5"
              style={{ '--delay': '220ms' } as React.CSSProperties}
            >
              <Magnetic>
                <button type="button" onClick={onOpenBooking} className="rt-btn rt-btn-primary rt-hero-cta-primary">
                  Book a demo
                  <Arrow />
                </button>
              </Magnetic>
              <Magnetic>
                <button type="button" onClick={scrollToPlatform} className="rt-btn rt-btn-ghost rt-hero-cta-ghost">
                  See how it works
                </button>
              </Magnetic>
            </div>

            {/* Trust row — checks + separator + social proof */}
            <div
              className="rt-fade-up mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12.5px] text-[#6B766F]"
              style={{ '--delay': '280ms' } as React.CSSProperties}
            >
              {['Read-only connections', 'Flexible document imports', 'Manage permissions anytime', 'CPA-ready records'].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <Check className="text-[#1FAE5B]" />
                  {t}
                </span>
              ))}
              <span className="hidden sm:block w-px h-3.5 bg-[#D4D9D1] mx-1" />
              <span className="text-[11.5px] text-[#9AA39D] tracking-[0.02em] italic">Engineered for modern founders, startups & CPA partners</span>
            </div>
          </div>

          {/* ══ PRODUCT SHOT — bleeds to bottom, no bottom padding on section ══ */}
          <div
            className="rt-fade-up relative mt-10 sm:mt-12 max-w-[1100px] mx-auto"
            style={{ '--delay': '340ms' } as React.CSSProperties}
          >
            {/* Soft page-color fade at very bottom */}
            <div className="absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-t from-[#FBFBF9] to-transparent z-10 pointer-events-none rounded-b-2xl" />

            {/* Floating chips */}
            <div className="rt-float hidden md:block -left-5 lg:-left-14 top-[14%]" style={{ '--fd': '0s' } as React.CSSProperties}>
              <div className="rt-glass rt-chip">
                <span className="rt-chip-icon bg-[#E7F7EE] text-[#0F7A41]"><Icon d={ICONS.scan} className="w-4 h-4" /></span>
                <div>
                  <div className="rt-chip-title">invoice_8841.pdf</div>
                  <div className="rt-chip-sub">Extracted 1.8 s · <span className="text-[#1FAE5B]">99%</span> confidence</div>
                </div>
              </div>
            </div>

            <div className="rt-float hidden md:block -right-4 lg:-right-14 top-[38%]" style={{ '--fd': '1.6s' } as React.CSSProperties}>
              <div className="rt-glass rt-chip">
                <span className="rt-chip-icon bg-[#0B1210] text-[#46D279]"><Icon d={ICONS.link} className="w-4 h-4" /></span>
                <div>
                  <div className="rt-chip-title">1,204 matched</div>
                  <div className="rt-chip-sub">Bank feed ↔ ledger · <span className="text-[#1FAE5B]">reconciled</span></div>
                </div>
              </div>
            </div>

            <div className="rt-float hidden lg:block -left-10 bottom-[20%]" style={{ '--fd': '3.2s' } as React.CSSProperties}>
              <div className="rt-glass rt-chip">
                <span className="rt-chip-icon bg-[#E7F7EE] text-[#0F7A41]"><Icon d={ICONS.shield} className="w-4 h-4" /></span>
                <div>
                  <div className="rt-chip-title">Source trail</div>
                  <div className="rt-chip-sub">Fully <span className="text-[#1FAE5B]">evidence-linked</span> records</div>
                </div>
              </div>
            </div>

            <div className="rt-float hidden lg:block -right-10 top-[12%]" style={{ '--fd': '2.4s' } as React.CSSProperties}>
              <div className="rt-glass rt-chip">
                <span className="rt-chip-icon bg-[#F1F4EF] text-[#0B1210]"><Icon d={ICONS.chart} className="w-4 h-4" /></span>
                <div>
                  <div className="rt-chip-title">96% auto-coded</div>
                  <div className="rt-chip-sub text-[#1FAE5B] font-medium">↑ 4 pts this month</div>
                </div>
              </div>
            </div>

            <Tilt>
              <HeroProduct />
            </Tilt>
            <div className="relative z-20 pb-2 text-center text-[11px] text-[#A8B2AC] tracking-[0.03em] mt-2">Illustrative interface · Prepares managerial records for professional review</div>
          </div>
        </div>
      </section>

      {/* ── INTEGRATIONS ── */}
      <section className="py-14 border-y border-[#E4E7E1] bg-[#FBFBF9]">
        <div className="rt-wrap">
          <div className="rt-eyebrow text-center mb-8">Connects to the systems you already run</div>
        </div>
        <div className="rt-marquee-wrap overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
          <div className="rt-marquee">
            {[...INTEGRATIONS, ...INTEGRATIONS].map((name, i) => (
              <span key={`${name}-${i}`} className="rt-marquee-item rt-display text-[22px] text-[#9AA39D] whitespace-nowrap tracking-[-0.03em] cursor-default">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── THESIS ── */}
      <section className="py-24 sm:py-36">
        <div className="rt-wrap">
          <Reveal>
            <p className="rt-display max-w-[1000px] text-[clamp(30px,4.6vw,58px)] leading-[1.08] text-[#0B1210]">
              Most of the close is repetitive data entry.{' '}
              <span className="text-[#9AA39D]">
                We automate the manual 95% so your team and CPA partners focus on the <span className="rt-serif">5%</span> that takes strategic judgment.
              </span>
            </p>
          </Reveal>

          <div className="mt-16 sm:mt-24 grid sm:grid-cols-3 border-t border-[#E4E7E1]">
            {[
              [<><span className="text-[#9AA39D]">~</span><CountUp to={5} suffix="%" /></>, 'of entries flagged for review, enabling high-leverage collaboration with advisors.'],
              [<CountUp to={100} suffix="%" />, 'of entries linked to the source document behind them.'],
              [<CountUp to={0} />, 'month-end chaos. Continuous reconciliation keeps your books review-ready.']
            ].map(([big, small], i) => (
              <Reveal key={i} delay={i * 90}>
                <div className={`pt-8 pb-4 sm:pr-10 ${i > 0 ? 'sm:pl-10 sm:border-l border-[#E4E7E1]' : ''}`}>
                  <div className="rt-display text-[clamp(52px,6vw,84px)] text-[#0B1210] tabular-nums">{big}</div>
                  <p className="mt-3 text-[15.5px] leading-relaxed text-[#5E6A63] max-w-[300px]">{small}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS (dark) ── */}
      <section id="platform" className="relative bg-[#07100C] text-white py-24 sm:py-32 overflow-hidden rt-grain rt-edge-light">
        <div className="rt-dark-grid" />
        <div className="absolute left-1/2 -translate-x-1/2 -top-40 w-[900px] h-[500px] rounded-full bg-[#1FAE5B]/10 blur-[140px] pointer-events-none" />
        <div className="rt-wrap relative">
          <Reveal>
            <div className="rt-eyebrow !text-[#46D279]">How it works</div>
            <h2 className="rt-display mt-5 max-w-[760px] text-[clamp(36px,5.2vw,64px)] text-white">
              From raw documents to a closed book, <span className="rt-serif">without the busywork.</span>
            </h2>
          </Reveal>

          <div className="mt-14 sm:mt-20 grid lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            <div className="lg:col-span-5 space-y-2">
              {STEPS.map((s, i) => (
                <button
                  key={s.n}
                  type="button"
                  onClick={() => setStep(i)}
                  className={`w-full text-left rounded-2xl p-6 border transition-all duration-300 ${
                    step === i ? 'bg-white/[0.06] border-white/15' : 'bg-transparent border-transparent hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`font-mono text-[12px] ${step === i ? 'text-[#46D279]' : 'text-white/30'}`}>{s.n}</span>
                    <span className={`rt-display text-[26px] ${step === i ? 'text-white' : 'text-white/45'}`}>{s.title}</span>
                  </div>
                  <div className={`grid transition-all duration-500 ${step === i ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'}`}>
                    <p className="overflow-hidden text-[15.5px] leading-relaxed text-white/60 pl-9 max-w-[420px]">{s.body}</p>
                  </div>
                  {step === i && (
                    <div className="mt-5 ml-9 h-px bg-white/10 overflow-hidden relative">
                      <div key={step} className="absolute inset-y-0 left-0 bg-[#46D279] rt-step-bar" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="lg:col-span-7">
              <div className="rt-window-dark">
                <div className="flex items-center gap-2 px-4 h-11 border-b border-white/[0.07]">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                  <span className="ml-3 text-[12px] text-white/40 font-mono">{STEPS[step].title.toLowerCase()}</span>
                </div>
                <div key={step} className="rt-fade-up min-h-[340px]">
                  {STEPS[step].visual}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 sm:py-36">
        <div className="rt-wrap">
          <Reveal>
            <div className="rt-eyebrow">The platform</div>
            <h2 className="rt-display mt-5 max-w-[720px] text-[clamp(36px,5.2vw,64px)] text-[#0B1210]">
              One system of record. <span className="rt-serif text-[#5E6A63]">Run by software.</span>
            </h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-6 gap-4">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 80} className={f.wide ? 'md:col-span-4' : 'md:col-span-2'}>
                <SpotlightCard className="rt-card h-full p-7 sm:p-8 flex flex-col justify-between min-h-[250px]">
                  <div className="rt-icon-tile w-10 h-10 rounded-xl bg-[#F1F4EF] border border-[#E4E7E1] flex items-center justify-center text-[#0B1210]">
                    <Icon d={f.icon} />
                  </div>
                  <div className="mt-12">
                    <h3 className="rt-display text-[22px] text-[#0B1210]">{f.title}</h3>
                    <p className="mt-2.5 text-[15px] leading-relaxed text-[#5E6A63] max-w-[420px]">{f.body}</p>
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <LiveClose />

      {/* ── AUDIENCES ── */}
      <section className="pb-24 sm:pb-36">
        <div className="rt-wrap grid md:grid-cols-2 gap-4">
          <Reveal>
            <SpotlightCard dark className="h-full rounded-[22px] bg-[#0B1210] text-white p-9 sm:p-12 flex flex-col justify-between min-h-[380px] relative overflow-hidden rt-grain">
              <div className="rt-dark-grid opacity-70" />
              <div className="relative">
                <div className="rt-eyebrow !text-[#46D279]">For accounting firms</div>
                <h3 className="rt-display mt-5 text-[clamp(30px,3.6vw,44px)] text-white">Scale your practice with intelligent automation.</h3>
                <p className="mt-4 text-[16px] leading-relaxed text-white/60 max-w-[440px]">
                  Partner with Retalyy to manage multi-client workflows, accelerate monthly reviews, and deliver high-value advisory with review-ready records.
                </p>
              </div>
              <button type="button" onClick={() => setActiveTab('firms')} className="rt-link relative mt-10 text-white self-start">
                Explore the firm platform <span><Arrow /></span>
              </button>
            </SpotlightCard>
          </Reveal>
          <Reveal delay={100}>
            <SpotlightCard className="h-full rounded-[22px] bg-[#F1F4EF] border border-[#E4E7E1] p-9 sm:p-12 flex flex-col justify-between min-h-[380px]">
              <div>
                <div className="rt-eyebrow">For growing businesses</div>
                <h3 className="rt-display mt-5 text-[clamp(30px,3.6vw,44px)] text-[#0B1210]">Clarity and control over your operations.</h3>
                <p className="mt-4 text-[16px] leading-relaxed text-[#5E6A63] max-w-[440px]">
                  Live cash runway, organized payables, and review-ready financials you can confidently share with your board and CPA.
                </p>
              </div>
              <button type="button" onClick={() => setActiveTab('solutions')} className="rt-link mt-10 text-[#0B1210] self-start">
                See solutions <span><Arrow /></span>
              </button>
            </SpotlightCard>
          </Reveal>
        </div>
      </section>

      {/* ── SECURITY ── */}
      <section className="pb-24 sm:pb-36">
        <div className="rt-wrap">
          <Reveal>
            <div className="grid lg:grid-cols-12 gap-10 pt-16 border-t border-[#E4E7E1]">
              <div className="lg:col-span-5">
                <div className="rt-eyebrow">Trust</div>
                <h2 className="rt-display mt-5 text-[clamp(32px,4vw,50px)] text-[#0B1210]">Transparency you can trust.</h2>
                <button type="button" onClick={() => setActiveTab('legal')} className="rt-link mt-7 text-[#0B1210]">
                  Security &amp; legal <span><Arrow /></span>
                </button>
              </div>
              <div className="lg:col-span-7 grid sm:grid-cols-2 gap-x-10 gap-y-9">
                {SECURITY.map(([t, d]) => (
                  <div key={t}>
                    <div className="flex items-center gap-2.5 text-[#0B1210] font-medium tracking-[-0.015em] text-[17px]">
                      <Check className="text-[#1FAE5B]" />
                      {t}
                    </div>
                    <p className="mt-2 pl-[26px] text-[15px] leading-relaxed text-[#5E6A63]">{d}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="pb-24 sm:pb-36">
        <div className="rt-wrap">
          <Reveal>
            <div className="max-w-[640px]">
              <div className="rt-eyebrow">Pricing</div>
              <h2 className="rt-display mt-5 text-[clamp(36px,5vw,60px)] text-[#0B1210]">
                Simple, <span className="rt-serif">transparent</span> pricing.
              </h2>
            </div>
          </Reveal>

          <div className="mt-12 grid md:grid-cols-2 gap-4">
            <Reveal>
              <div className="rt-card h-full p-9 sm:p-10 flex flex-col">
                <div className="text-[15px] font-medium text-[#0B1210]">Starter</div>
                <div className="rt-display mt-4 text-[64px] text-[#0B1210] tabular-nums">$0</div>
                <p className="mt-2 text-[14.5px] text-[#5E6A63]">Continuous ledger sync and expense categorization.</p>
                <ul className="mt-8 space-y-3.5 text-[15px] text-[#28322D]">
                  {[
                    'Line-item categorization across the general ledger',
                    'Real-time budget vs. actual variance',
                    'Client portal with role-based access'
                  ].map((x) => (
                    <li key={x} className="flex items-start gap-3">
                      <Check className="text-[#1FAE5B] mt-0.5 shrink-0" />
                      {x}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-10">
                  <button type="button" onClick={() => setActiveTab('portal')} className="rt-btn rt-btn-ghost w-full">
                    Get started
                  </button>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="rt-glow-border h-full rounded-[18px] p-9 sm:p-10 flex flex-col bg-[#0B1210] text-white relative overflow-hidden rt-grain">
                <div className="rt-dark-grid opacity-60" />
                <div className="relative flex flex-col h-full">
                  <div className="flex items-center justify-between">
                    <div className="text-[15px] font-medium">Pro</div>
                    <span className="rt-tag rt-tag-dark">Recommended</span>
                  </div>
                  <div className="rt-display mt-4 text-[64px] tabular-nums">
                    from $79<span className="text-[18px] font-normal text-white/50 tracking-normal"> /mo</span>
                  </div>
                  <p className="mt-2 text-[14.5px] text-white/55">Billed annually. Complete autonomous operations.</p>
                  <ul className="mt-8 space-y-3.5 text-[15px] text-white/85">
                    {[
                      'Continuous Gusto and Mercury bank sync',
                      'Automated cash reserve and runway tracking',
                      'Live chat with a finance operations team',
                      'Year-end reporting package with source-linked documentation for your CPA'
                    ].map((x) => (
                      <li key={x} className="flex items-start gap-3">
                        <Check className="text-[#46D279] mt-0.5 shrink-0" />
                        {x}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-10">
                    <button type="button" onClick={() => setActiveTab('portal')} className="rt-btn rt-btn-green w-full">
                      Start with Pro
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="pb-24 sm:pb-36">
        <div className="rt-wrap grid lg:grid-cols-12 gap-10 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <div className="rt-eyebrow">FAQ</div>
            <h2 className="rt-display mt-5 text-[clamp(32px,4vw,50px)] text-[#0B1210]">
              Questions, <span className="rt-serif">answered.</span>
            </h2>
            <button type="button" onClick={() => setActiveTab('contact')} className="rt-link mt-7 text-[#0B1210]">
              Ask us anything <span><Arrow /></span>
            </button>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-8">
            <Accordion items={FAQ_ITEMS} />
          </Reveal>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="px-3 sm:px-5 pb-5">
        <div className="relative rounded-[28px] bg-[#07100C] text-white overflow-hidden py-24 sm:py-36 rt-grain rt-edge-light">
          <div className="rt-dark-grid" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[-260px] w-[900px] h-[460px] rounded-full bg-[#1FAE5B]/25 blur-[140px] pointer-events-none" />
          <div className="rt-wrap relative text-center">
            <Reveal>
              <h2 className="rt-display mx-auto max-w-[900px] text-[clamp(40px,6.4vw,84px)] text-white">
                Close the books, <span className="rt-serif rt-shimmer-dark pr-[0.06em]">not your calendar.</span>
              </h2>
              <p className="mx-auto mt-6 max-w-[520px] text-[18px] leading-relaxed text-white/60">
                See Retalyy run a real close on your data in a 30-minute walkthrough.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Magnetic>
                  <button type="button" onClick={onOpenBooking} className="rt-btn rt-btn-green">
                    Book a demo
                    <Arrow />
                  </button>
                </Magnetic>
                <button type="button" onClick={() => setActiveTab('contact')} className="rt-btn rt-btn-outline-dark">
                  Talk to us
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
};
