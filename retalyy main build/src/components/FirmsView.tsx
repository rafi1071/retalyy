import React, { useState, useMemo } from 'react';
import { FirmProfile, NavigationTab } from '../types';
import { RetalyyIconMark } from './RetalyyLogo';
import { PILOT_OFFER_DETAILS, PITCH_RULES } from '../data/briefData';

interface FirmsViewProps {
  setActiveTab: (tab: NavigationTab) => void;
  onOpenBooking: () => void;
}

export const FirmsView: React.FC<FirmsViewProps> = ({ setActiveTab, onOpenBooking }) => {
  const [firm, setFirm] = useState<FirmProfile>({
    firmName: 'Cascade Accounting & Advisory LLP',
    contactName: 'Brian Miller, CPA',
    email: 'brian@cascadecpas.com',
    phone: '(503) 555-0182',
    size: '6-20',
    credentials: ['CPA Firm Permit', 'IRS EFIN Active', 'AICPA CAS Section'],
    hasPtinEfin: true,
    primaryBrandColor: '#27B665'
  });

  // Pilot Application State
  const [contractorCount, setContractorCount] = useState<number>(22);
  const [hoursPerClose, setHoursPerClose] = useState<number>(14);
  const [billingRate, setBillingRate] = useState<number>(175);
  const [accountingSystem, setAccountingSystem] = useState<'quickbooks' | 'xero' | 'both'>('quickbooks');
  const [pilotSubmitted, setPilotSubmitted] = useState<boolean>(false);
  const [simulationRunning, setSimulationRunning] = useState<boolean>(false);
  const [simulationDone, setSimulationDone] = useState<boolean>(false);

  // Capacity calculations
  const capacityMetrics = useMemo(() => {
    const totalMonthlyHours = contractorCount * hoursPerClose;
    const hoursSavedPerMonth = Math.round(totalMonthlyHours * 0.45); // 45% reduction from first-pass books
    const monthlyCapacityValue = hoursSavedPerMonth * billingRate;
    const postPilotEstimatedCost = contractorCount * 75; // average $75/mo per client
    const netMonthlyRoi = monthlyCapacityValue - postPilotEstimatedCost;

    return {
      totalMonthlyHours,
      hoursSavedPerMonth,
      monthlyCapacityValue,
      postPilotEstimatedCost,
      netMonthlyRoi
    };
  }, [contractorCount, hoursPerClose, billingRate]);

  const handleApplyPilot = (e: React.FormEvent) => {
    e.preventDefault();
    setPilotSubmitted(true);
  };

  const runSimulation = () => {
    setSimulationRunning(true);
    setSimulationDone(false);
    setTimeout(() => {
      setSimulationRunning(false);
      setSimulationDone(true);
    }, 1200);
  };

  return (
    <div className="wrap py-12 space-y-16">
      
      {/* SECTION 1: HERO & PITCH POSITIONING */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center border-b border-[#D9F0E2] pb-14">
        <div className="lg:col-span-7 space-y-5">
          <div className="ret-pill">
            <i />
            <span>Partnership · Why Partner With Us</span>
          </div>

          <h1 className="text-[clamp(34px,4.8vw,62px)] font-extrabold text-[#0C2B1C] tracking-[-0.035em] leading-[1.05]">
            Why Partner With Us: Faster Month-End for Your Clients.
          </h1>

          <p className="text-lg text-[#52705F] leading-relaxed max-w-xl">
            Job-cost coding and missing receipts eat the first week of every month. Retalyy prepares the first pass and sends your team only the exceptions.
          </p>

          {/* Core Outreach Truths */}
          <div className="p-4 rounded-2xl bg-[#EDF9F1] border border-[#D9F0E2] text-xs font-mono text-[#0F7A41] space-y-2">
            <div className="font-bold uppercase tracking-wider text-[#0C2B1C]">Channel Guarantee</div>
            <p className="text-[#52705F] font-sans text-sm">
              We handle setup and data migration. Your firm's name stays on everything, and your team maintains complete review control through our dedicated firm dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="#apply-pilot"
              className="ret-btn"
            >
              Claim Free Partnership Pilot
            </a>
            <a
              href="#roi-calculator"
              className="ret-btn secondary"
            >
              Calculate Capacity ROI ↓
            </a>
          </div>
        </div>

        {/* Right Hero Card: The 60-Day Commercial Offer */}
        <div className="lg:col-span-5 bg-[#0C2B1C] text-white rounded-[32px] p-8 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#27B665]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-wider text-[#8EDDA6] font-bold">
              Channel Pilot Terms
            </span>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/10 text-[#8EDDA6] border border-white/20">
              Risk-Free Pilot
            </span>
          </div>

          <div>
            <h3 className="font-display font-extrabold text-3xl text-white">
              Live Client Accounts. Zero Upfront Fee.
            </h3>
            <p className="text-sm text-white/75 mt-1">
              Test first-pass books and ready review queues on your actual client engagements with no fixed day or client lock-in.
            </p>
          </div>

          <ul className="space-y-3.5 text-sm text-white/90 border-t border-white/10 pt-4">
            <li className="flex items-start gap-3">
              <span className="text-[#8EDDA6] font-bold text-base">✓</span>
              <span><strong>1-Click QBO/Xero replacement:</strong> We import QuickBooks or Xero chart of accounts, bank feeds, and historical ledgers to transition your firm seamlessly.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#8EDDA6] font-bold text-base">✓</span>
              <span><strong>Firm of record:</strong> Your brand, logo, and engagement letter stay visible to the client.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#8EDDA6] font-bold text-base">✓</span>
              <span><strong>Controlled sign-off:</strong> Nothing is finalized without your reviewer's approval in the review queue.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#8EDDA6] font-bold text-base">✓</span>
              <span><strong>Decision gate:</strong> Pay $30–$120/mo per client only after your pilot if close time falls ≥40%. No fixed time lock-in.</span>
            </li>
          </ul>

          <div className="pt-2">
            <div className="text-[11px] font-mono text-[#8EDDA6] bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              Target Channel ICP: 3–25 staff · 15+ contractor clients · Replacing QuickBooks or Xero
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: CHANNEL ICP QUALIFICATION CRITERIA */}
      <section className="space-y-6">
        <div>
          <div className="ret-pill mb-2">
            <i />
            <span>Firm ICP Qualification</span>
          </div>
          <h2 className="text-[clamp(28px,3.5vw,44px)] font-extrabold tracking-[-0.035em] text-[#0C2B1C]">
            Engineered exclusively for accounting firms serving trades.
          </h2>
          <p className="text-base text-[#52705F] mt-1 max-w-2xl leading-relaxed">
            General accounting AI fails because it lacks vertical rules. Retalyy focuses entirely on the trades & construction niche where job-costing and progress billing pain is acute.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-3xl bg-[#FAFDFB] border border-[#D9F0E2] space-y-3">
            <div className="text-xs font-mono font-bold uppercase text-[#0F7A41]">Firm Size Band</div>
            <h3 className="font-display font-bold text-lg text-[#0C2B1C]">3 to 25 Staff</h3>
            <p className="text-xs text-[#52705F] leading-relaxed">
              Managing partner or operations lead handles client accounting services (CAS) with reviewer capacity bottlenecks.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#FAFDFB] border border-[#D9F0E2] space-y-3">
            <div className="text-xs font-mono font-bold uppercase text-[#0F7A41]">Vertical Concentration</div>
            <h3 className="font-display font-bold text-lg text-[#0C2B1C]">30%+ Contractors</h3>
            <p className="text-xs text-[#52705F] leading-relaxed">
              At least 15 active clients in general contracting, plumbing, electrical, HVAC, or remodeling.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#FAFDFB] border border-[#D9F0E2] space-y-3">
            <div className="text-xs font-mono font-bold uppercase text-[#0F7A41]">Legacy Replacements</div>
            <h3 className="font-display font-bold text-lg text-[#0C2B1C]">QuickBooks or Xero</h3>
            <p className="text-xs text-[#52705F] leading-relaxed">
              Seamless 1-click migration. Retalyy imports full ledger history, chart of accounts, and bank feeds to replace legacy QBO/Xero software.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#FAFDFB] border border-[#D9F0E2] space-y-3">
            <div className="text-xs font-mono font-bold uppercase text-[#0F7A41]">Trigger Events</div>
            <h3 className="font-display font-bold text-lg text-[#0C2B1C]">Month-End Backlog</h3>
            <p className="text-xs text-[#52705F] leading-relaxed">
              Hiring freeze, failed bookkeeper hire, or clients demanding live job profit numbers and tax set-aside advice.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: INTERACTIVE CAPACITY & ROI CALCULATOR */}
      <section id="roi-calculator" className="bg-[#EDF9F1] border border-[#D9F0E2] rounded-[36px] p-8 sm:p-12 space-y-8">
        <div className="max-w-2xl">
          <div className="ret-pill mb-2">
            <i />
            <span>Capacity Modeling</span>
          </div>
          <h2 className="text-[clamp(28px,3.5vw,44px)] font-extrabold tracking-[-0.035em] text-[#0C2B1C]">
            Model hours saved per close for your contractor roster.
          </h2>
          <p className="text-base text-[#52705F] mt-1 leading-relaxed">
            Price below the cost of the capacity it creates. Adjust your firm's numbers to project time returned to senior reviewers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Sliders */}
          <div className="lg:col-span-7 bg-white p-7 rounded-3xl border border-[#D9F0E2] space-y-6">
            
            {/* Contractor Clients Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono font-bold uppercase text-[#52705F]">Active Contractor Clients</label>
                <span className="font-display font-extrabold text-xl text-[#0C2B1C]">{contractorCount} clients</span>
              </div>
              <input
                type="range"
                min={5}
                max={80}
                step={1}
                value={contractorCount}
                onChange={(e) => setContractorCount(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-[11px] text-[#52705F] mt-1 font-mono">
                <span>5 clients</span>
                <span>80 clients</span>
              </div>
            </div>

            {/* Hours per Close Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono font-bold uppercase text-[#52705F]">Staff Hours Spent per Close / Client</label>
                <span className="font-display font-extrabold text-xl text-[#0C2B1C]">{hoursPerClose} hrs / mo</span>
              </div>
              <input
                type="range"
                min={6}
                max={30}
                step={1}
                value={hoursPerClose}
                onChange={(e) => setHoursPerClose(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-[11px] text-[#52705F] mt-1 font-mono">
                <span>6 hrs (Simple)</span>
                <span>30 hrs (Complex Job Costing)</span>
              </div>
            </div>

            {/* Blended Billing Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono font-bold uppercase text-[#52705F]">Reviewer / Staff Blended Hourly Value</label>
                <span className="font-display font-extrabold text-xl text-[#0C2B1C]">${billingRate} / hr</span>
              </div>
              <input
                type="range"
                min={100}
                max={350}
                step={25}
                value={billingRate}
                onChange={(e) => setBillingRate(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-[11px] text-[#52705F] mt-1 font-mono">
                <span>$100 / hr</span>
                <span>$350 / hr (Senior CPA)</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-[#52705F] font-mono border-t border-[#EEF6F1]">
              <span>Assumes 45% reduction in close time</span>
              <span className="text-[#0F7A41] font-bold">Tested in Partnership Pilot</span>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-5 bg-[#0C2B1C] text-white p-8 rounded-3xl space-y-6 shadow-xl">
            <div className="text-xs font-mono uppercase tracking-wider text-[#8EDDA6] font-bold">
              Projected Capacity Unlocked
            </div>

            <div className="space-y-4">
              <div className="border-b border-white/10 pb-4">
                <span className="text-xs text-white/70 block">Reviewer Hours Saved / Month</span>
                <span className="font-display font-extrabold text-3xl sm:text-4xl text-white">
                  {capacityMetrics.hoursSavedPerMonth.toLocaleString()} hrs
                </span>
                <span className="text-xs text-[#8EDDA6] block mt-1">
                  ≈ {(capacityMetrics.hoursSavedPerMonth / 160).toFixed(1)} Full-Time Staff Equivalent
                </span>
              </div>

              <div className="border-b border-white/10 pb-4">
                <span className="text-xs text-white/70 block">Monthly Advisory Capacity Value</span>
                <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#8EDDA6]">
                  ${capacityMetrics.monthlyCapacityValue.toLocaleString()}
                </span>
                <span className="text-xs text-white/60 block mt-1">
                  At ${billingRate}/hr recovered reviewer time
                </span>
              </div>

              <div>
                <span className="text-xs text-white/70 block">Post-Pilot Cost Assumption</span>
                <span className="font-display font-extrabold text-xl text-white">
                  ${capacityMetrics.postPilotEstimatedCost.toLocaleString()} / mo
                </span>
                <span className="text-xs text-white/60 block mt-0.5">
                  ($0 during your free partnership pilot)
                </span>
              </div>
            </div>

            <a
              href="#apply-pilot"
              className="ret-btn w-full text-center bg-[#27B665] text-white hover:bg-[#8EDDA6]"
            >
              Apply for 3-Client Pilot →
            </a>
          </div>

        </div>
      </section>

      {/* SECTION 4: SIMULATION OF FIRST-PASS BATCH REVIEW QUEUE */}
      <section className="bg-white rounded-[32px] border border-[#D9F0E2] p-8 sm:p-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="ret-pill mb-2">
              <i />
              <span>Review Queue Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0C2B1C]">
              What your reviewers actually see: exceptions only.
            </h2>
            <p className="text-sm text-[#52705F] mt-1">
              Test how Retalyy pre-codes transactions and flags only the 6% of items that require human professional judgment.
            </p>
          </div>

          <button
            onClick={runSimulation}
            disabled={simulationRunning}
            className="ret-btn sm secondary self-start md:self-auto shrink-0"
          >
            {simulationRunning ? 'Running Ingestion Stream...' : 'Simulate First-Pass Batch Scan'}
          </button>
        </div>

        {/* Batch Queue Table */}
        <div className="rounded-2xl border border-[#D9F0E2] overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAFDFB] text-xs font-mono uppercase text-[#52705F] border-b border-[#D9F0E2]">
              <tr>
                <th className="py-3 px-4">Transaction / Feed</th>
                <th className="py-3 px-4">Client & Job Code</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">First-Pass Match</th>
                <th className="py-3 px-4">Action Required</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF6F1] font-sans">
              <tr className="bg-white hover:bg-[#FAFDFB]">
                <td className="py-3.5 px-4 font-medium text-[#0C2B1C]">
                  <div>Fergus Supply Co. · Invoice #8921</div>
                  <div className="text-[11px] font-mono text-[#52705F]">Mercury Card feed · Matched to SMS photo</div>
                </td>
                <td className="py-3.5 px-4 font-mono text-xs text-[#0F7A41]">
                  Highland Crest Commercial (JOB-101)
                </td>
                <td className="py-3.5 px-4 font-display font-bold text-[#0C2B1C]">$4,850.00</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#EDF9F1] text-[#0F7A41]">
                    <span>✓</span> Auto-Coded (99.8%)
                  </span>
                </td>
                <td className="py-3.5 px-4 text-xs text-[#52705F]">
                  Zero action required
                </td>
              </tr>

              <tr className="bg-white hover:bg-[#FAFDFB]">
                <td className="py-3.5 px-4 font-medium text-[#0C2B1C]">
                  <div>Progress Draw Release · City Bank Wire</div>
                  <div className="text-[11px] font-mono text-[#52705F]">Direct Bank Feed · Retalyy Core</div>
                </td>
                <td className="py-3.5 px-4 font-mono text-xs text-[#0F7A41]">
                  Presidio Estates Remodel (JOB-102)
                </td>
                <td className="py-3.5 px-4 font-display font-bold text-[#0C2B1C]">$38,000.00</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#EDF9F1] text-[#0F7A41]">
                    <span>✓</span> AIA G702 Matched
                  </span>
                </td>
                <td className="py-3.5 px-4 text-xs text-[#52705F]">
                  Tax set-aside auto-reserved ($3,800)
                </td>
              </tr>

              <tr className="bg-[#FFFDF7] hover:bg-[#FFF9EC]">
                <td className="py-3.5 px-4 font-medium text-[#0C2B1C]">
                  <div>Cashier Check to "Jose Morales"</div>
                  <div className="text-[11px] font-mono text-[#52705F]">Check deposit scan · No W-9 on file</div>
                </td>
                <td className="py-3.5 px-4 font-mono text-xs text-[#C0392B]">
                  Unassigned Labor Cost
                </td>
                <td className="py-3.5 px-4 font-display font-bold text-[#0C2B1C]">$2,400.00</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#FFF2D6] text-[#B7791F]">
                    <span>⚠</span> Exception Flagged
                  </span>
                </td>
                <td className="py-3.5 px-4 text-xs text-[#C0392B] font-bold">
                  Reviewer decision: Request W-9 before 1099 close
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#52705F] font-mono pt-2 gap-2">
          <span>Acceptance Rate: 94% without human manual input</span>
          <span>Only 1 exception sent to Brian Miller, CPA for judgment</span>
        </div>
      </section>

      {/* SECTION 5: PILOT APPLICATION FORM */}
      <section id="apply-pilot" className="bg-[#FAFDFB] border-2 border-[#27B665]/40 rounded-[36px] p-8 sm:p-12 space-y-8">
        <div className="max-w-2xl">
          <div className="ret-pill mb-2">
            <i />
            <span>Pilot Agreement Application</span>
          </div>
          <h2 className="text-[clamp(28px,3.5vw,44px)] font-extrabold tracking-[-0.035em] text-[#0C2B1C]">
            Apply for your risk-free partnership pilot.
          </h2>
          <p className="text-base text-[#52705F] mt-1 leading-relaxed">
            We onboard select firms per cohort to ensure white-glove setup and data migration. Confirm your firm profile below to reserve a pilot slot.
          </p>
        </div>

        {pilotSubmitted ? (
          <div className="p-8 rounded-3xl bg-[#EDF9F1] border border-[#27B665] text-center space-y-4 max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-[#27B665] text-white flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <h3 className="font-display font-bold text-2xl text-[#0C2B1C]">
              Pilot Application Received for {firm.firmName}
            </h3>
            <p className="text-sm text-[#52705F] leading-relaxed">
              We have scheduled your 15-minute alignment call with our founding team. We will review your 3 selected contractor clients and initiate QuickBooks/Xero migration sandbox access.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setPilotSubmitted(false)}
                className="text-xs font-mono font-bold text-[#0F7A41] underline cursor-pointer"
              >
                Edit Application Details
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleApplyPilot} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[#52705F] mb-1">
                Firm Name
              </label>
              <input
                type="text"
                required
                value={firm.firmName}
                onChange={(e) => setFirm({ ...firm, firmName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#D9F0E2] bg-white text-sm focus:outline-none focus:border-[#27B665]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[#52705F] mb-1">
                Managing Partner / Lead Contact
              </label>
              <input
                type="text"
                required
                value={firm.contactName}
                onChange={(e) => setFirm({ ...firm, contactName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#D9F0E2] bg-white text-sm focus:outline-none focus:border-[#27B665]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[#52705F] mb-1">
                Firm Email (for Pilot DPA Agreement)
              </label>
              <input
                type="email"
                required
                value={firm.email}
                onChange={(e) => setFirm({ ...firm, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#D9F0E2] bg-white text-sm focus:outline-none focus:border-[#27B665]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[#52705F] mb-1">
                Direct Phone
              </label>
              <input
                type="tel"
                required
                value={firm.phone}
                onChange={(e) => setFirm({ ...firm, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#D9F0E2] bg-white text-sm focus:outline-none focus:border-[#27B665]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[#52705F] mb-1">
                Contractor / Trades Clients in Practice
              </label>
              <select
                value={contractorCount}
                onChange={(e) => setContractorCount(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-[#D9F0E2] bg-white text-sm focus:outline-none focus:border-[#27B665]"
              >
                <option value={15}>15 to 25 Contractor Clients</option>
                <option value={35}>26 to 50 Contractor Clients</option>
                <option value={60}>50+ Contractor Clients</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[#52705F] mb-1">
                Primary Ledger Software
              </label>
              <select
                value={accountingSystem}
                onChange={(e) => setAccountingSystem(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl border border-[#D9F0E2] bg-white text-sm focus:outline-none focus:border-[#27B665]"
              >
                <option value="quickbooks">QuickBooks Online</option>
                <option value="xero">Xero</option>
                <option value="both">Both QuickBooks & Xero</option>
              </select>
            </div>

            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                className="ret-btn w-full text-base font-bold"
              >
                Submit Pilot Application (Risk-Free Partnership Pilot) →
              </button>
              <p className="text-[11px] font-mono text-[#52705F] text-center mt-2">
                No credit card required · Zero exclusivity · Setup and migration handled by Retalyy
              </p>
            </div>
          </form>
        )}
      </section>

    </div>
  );
};
