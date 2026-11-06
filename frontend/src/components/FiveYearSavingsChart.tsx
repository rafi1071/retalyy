import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  BarChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { CalculatorInputs } from '../types';
import { calculateTaxes, formatCurrency } from '../utils/taxCalculator';
import { RetalyyIconMark } from './RetalyyLogo';

interface FiveYearSavingsChartProps {
  inputs: CalculatorInputs;
  onOpenBooking: () => void;
  onProceedToVault: () => void;
}

export const FiveYearSavingsChart: React.FC<FiveYearSavingsChartProps> = ({
  inputs,
  onOpenBooking,
  onProceedToVault
}) => {
  const [viewMode, setViewMode] = useState<'cumulative' | 'annual' | 'compounded'>('cumulative');
  const [growthRate, setGrowthRate] = useState<0 | 0.05 | 0.10>(0.05);
  const [investmentYield, setInvestmentYield] = useState<0.045 | 0.07>(0.07);

  // Compute 5-year projection dataset
  const projectionData = useMemo(() => {
    const data = [];
    let cumulativeScheduleC = 0;
    let cumulativeSCorp = 0;
    let cumulativeSavings = 0;
    let compoundedWealth = 0;

    const baseYear = new Date().getFullYear();

    for (let i = 0; i < 5; i++) {
      const yearIndex = i + 1;
      const calendarYear = baseYear + i;
      // Projected net income compounded by selected growth rate
      const yearNetIncome = Math.round(inputs.netIncome * Math.pow(1 + growthRate, i));
      
      // Calculate taxes for this year's income
      const yearResults = calculateTaxes({
        ...inputs,
        netIncome: yearNetIncome
      });

      cumulativeScheduleC += yearResults.currentTotalTax;
      cumulativeSCorp += yearResults.optimizedTotalTax;
      cumulativeSavings += yearResults.netAnnualSavings;

      // Compounded wealth calculation: previous wealth grows, plus new year's savings
      compoundedWealth = Math.round((compoundedWealth + yearResults.netAnnualSavings) * (1 + investmentYield));

      data.push({
        yearLabel: `Year ${yearIndex} (${calendarYear})`,
        yearShort: `Y${yearIndex}`,
        calendarYear,
        projectedNet: yearNetIncome,
        
        // Annual metrics
        scheduleCAnnualTax: yearResults.currentTotalTax,
        sCorpAnnualTax: yearResults.optimizedTotalTax,
        annualSavings: yearResults.netAnnualSavings,
        sCorpPayrollSavings: yearResults.sCorpSavings,

        // Cumulative metrics
        cumulativeScheduleC,
        cumulativeSCorp,
        cumulativeSavings,

        // Reinvestment metrics
        compoundedWealth,
        effectiveRateC: Number(((yearResults.currentTotalTax / yearNetIncome) * 100).toFixed(1)),
        effectiveRateSCorp: Number(((yearResults.optimizedTotalTax / yearNetIncome) * 100).toFixed(1)),
      });
    }

    return data;
  }, [inputs, growthRate, investmentYield]);

  // Summary headline metrics
  const total5YrSavings = projectionData[4]?.cumulativeSavings || 0;
  const total5YrCompounded = projectionData[4]?.compoundedWealth || 0;
  const avgAnnualSavings = Math.round(total5YrSavings / 5);
  const total5YrScheduleCTax = projectionData[4]?.cumulativeScheduleC || 0;
  const total5YrSCorpTax = projectionData[4]?.cumulativeSCorp || 0;
  const effectiveRateDrop = (
    (projectionData[0]?.effectiveRateC || 0) - (projectionData[0]?.effectiveRateSCorp || 0)
  ).toFixed(1);

  // Custom Glassmorphism Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const yearData = projectionData.find(d => d.yearLabel === label || d.yearShort === label) || payload[0]?.payload;
    if (!yearData) return null;

    return (
      <div className="bg-[#0C2B1C]/95 text-white p-4 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-md min-w-[260px] text-xs space-y-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-white/15 pb-2">
          <div className="font-display font-bold text-sm text-white">
            {yearData.yearLabel}
          </div>
          <span className="font-mono text-[11px] text-[#8EDDA6] font-bold">
            Revenue: {formatCurrency(yearData.projectedNet)}
          </span>
        </div>

        {viewMode === 'cumulative' && (
          <div className="space-y-1.5 font-mono">
            <div className="flex justify-between items-center text-rose-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Schedule C Total Tax:
              </span>
              <span className="font-bold">{formatCurrency(yearData.cumulativeScheduleC)}</span>
            </div>
            <div className="flex justify-between items-center text-[#8EDDA6]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#27B665]" />
                Retalyy S-Corp Tax:
              </span>
              <span className="font-bold">{formatCurrency(yearData.cumulativeSCorp)}</span>
            </div>
            <div className="pt-2 mt-2 border-t border-white/10 flex justify-between items-center text-white font-bold">
              <span>Cumulative Retained:</span>
              <span className="text-[#46D279] text-sm">+{formatCurrency(yearData.cumulativeSavings)}</span>
            </div>
          </div>
        )}

        {viewMode === 'annual' && (
          <div className="space-y-1.5 font-mono">
            <div className="flex justify-between items-center text-rose-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Schedule C Tax:
              </span>
              <span className="font-bold">{formatCurrency(yearData.scheduleCAnnualTax)} ({yearData.effectiveRateC}%)</span>
            </div>
            <div className="flex justify-between items-center text-[#8EDDA6]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#27B665]" />
                Retalyy S-Corp Tax:
              </span>
              <span className="font-bold">{formatCurrency(yearData.sCorpAnnualTax)} ({yearData.effectiveRateSCorp}%)</span>
            </div>
            <div className="pt-2 mt-2 border-t border-white/10 flex justify-between items-center text-white font-bold">
              <span>Annual Net Savings:</span>
              <span className="text-[#46D279] text-sm">+{formatCurrency(yearData.annualSavings)}</span>
            </div>
          </div>
        )}

        {viewMode === 'compounded' && (
          <div className="space-y-1.5 font-mono">
            <div className="flex justify-between items-center text-emerald-200">
              <span>Annual Tax Savings:</span>
              <span className="font-bold">+{formatCurrency(yearData.annualSavings)}</span>
            </div>
            <div className="flex justify-between items-center text-white/80">
              <span>Uninvested Cash:</span>
              <span className="font-bold">{formatCurrency(yearData.cumulativeSavings)}</span>
            </div>
            <div className="pt-2 mt-2 border-t border-white/10 flex justify-between items-center text-[#46D279] font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#46D279]" />
                Compounded ({investmentYield * 100}% yield):
              </span>
              <span className="text-sm">+{formatCurrency(yearData.compoundedWealth)}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-[32px] border border-[#D9F0E2] shadow-xl overflow-hidden p-6 sm:p-10 space-y-8">
      
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#EEF6F1] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <RetalyyIconMark size={22} />
            <div className="ret-pill">
              <i />
              <span>5-Year Wealth Trajectory</span>
            </div>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#0C2B1C] tracking-tight">
            5-Year S-Corporation vs Schedule C Projection
          </h2>
          <p className="text-xs sm:text-sm text-[#52705F] mt-1 max-w-2xl">
            Comparing total tax liability under a traditional Sole Proprietorship (Schedule C) against an optimized S-Corporation electing Form 2553 with reasonable wage modeling.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2 bg-[#EDF9F1] p-1.5 rounded-2xl border border-[#D9F0E2]">
          <button
            onClick={() => setViewMode('cumulative')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'cumulative'
                ? 'bg-[#0C2B1C] text-white shadow-sm'
                : 'text-[#52705F] hover:text-[#0C2B1C]'
            }`}
          >
            Cumulative Gap
          </button>
          <button
            onClick={() => setViewMode('annual')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'annual'
                ? 'bg-[#0C2B1C] text-white shadow-sm'
                : 'text-[#52705F] hover:text-[#0C2B1C]'
            }`}
          >
            Annual Comparison
          </button>
          <button
            onClick={() => setViewMode('compounded')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'compounded'
                ? 'bg-[#0C2B1C] text-white shadow-sm'
                : 'text-[#52705F] hover:text-[#0C2B1C]'
            }`}
          >
            Reinvested Wealth
          </button>
        </div>
      </div>

      {/* 4 Core 5-Year Horizon KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#EDF9F1] border border-[#D9F0E2] p-5 rounded-2xl">
          <div className="text-[#52705F] text-[11px] font-mono uppercase font-bold tracking-wider">
            5-Year Tax Drag Avoided
          </div>
          <div className="font-display font-extrabold text-2xl sm:text-3xl text-[#0F7A41] mt-1 tabular-nums">
            +{formatCurrency(total5YrSavings)}
          </div>
          <div className="text-[11px] text-[#52705F] mt-1">
            Avg +{formatCurrency(avgAnnualSavings)} / yr retained
          </div>
        </div>

        <div className="bg-[#0C2B1C] text-white border border-[#0C2B1C] p-5 rounded-2xl shadow-md">
          <div className="text-[#8EDDA6] text-[11px] font-mono uppercase font-bold tracking-wider">
            Compounded Value ({investmentYield * 100}%)
          </div>
          <div className="font-display font-extrabold text-2xl sm:text-3xl text-[#46D279] mt-1 tabular-nums">
            +{formatCurrency(total5YrCompounded)}
          </div>
          <div className="text-[11px] text-white/70 mt-1">
            Invested in broad-market index
          </div>
        </div>

        <div className="bg-white border border-[#D9F0E2] p-5 rounded-2xl">
          <div className="text-[#52705F] text-[11px] font-mono uppercase font-bold tracking-wider">
            5-Year Schedule C Burden
          </div>
          <div className="font-display font-extrabold text-2xl sm:text-3xl text-rose-600 mt-1 tabular-nums">
            {formatCurrency(total5YrScheduleCTax)}
          </div>
          <div className="text-[11px] text-[#52705F] mt-1">
            vs {formatCurrency(total5YrSCorpTax)} with Retalyy
          </div>
        </div>

        <div className="bg-white border border-[#D9F0E2] p-5 rounded-2xl">
          <div className="text-[#52705F] text-[11px] font-mono uppercase font-bold tracking-wider">
            Effective Tax Rate Drop
          </div>
          <div className="font-display font-extrabold text-2xl sm:text-3xl text-[#0C2B1C] mt-1 tabular-nums">
            -{effectiveRateDrop}%
          </div>
          <div className="text-[11px] text-[#52705F] mt-1">
            FICA + §199A + Accountable Plan
          </div>
        </div>

      </div>

      {/* Scenario Controls Bar (Growth Rate & Compounding) */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#F8FCF9] border border-[#EEF6F1] text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-bold text-[#0C2B1C]">Annual Business Growth:</span>
          <div className="inline-flex rounded-xl bg-white border border-[#D9F0E2] p-1 gap-1">
            <button
              onClick={() => setGrowthRate(0)}
              className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-colors cursor-pointer ${
                growthRate === 0 ? 'bg-[#27B665] text-white' : 'text-[#52705F] hover:text-[#0C2B1C]'
              }`}
            >
              0% (Flat)
            </button>
            <button
              onClick={() => setGrowthRate(0.05)}
              className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-colors cursor-pointer ${
                growthRate === 0.05 ? 'bg-[#27B665] text-white' : 'text-[#52705F] hover:text-[#0C2B1C]'
              }`}
            >
              +5% (Typical)
            </button>
            <button
              onClick={() => setGrowthRate(0.10)}
              className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-colors cursor-pointer ${
                growthRate === 0.10 ? 'bg-[#27B665] text-white' : 'text-[#52705F] hover:text-[#0C2B1C]'
              }`}
            >
              +10% (Fast Scale)
            </button>
          </div>
        </div>

        {viewMode === 'compounded' && (
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#0C2B1C]">Reinvestment Benchmark:</span>
            <div className="inline-flex rounded-xl bg-white border border-[#D9F0E2] p-1 gap-1">
              <button
                onClick={() => setInvestmentYield(0.045)}
                className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-colors cursor-pointer ${
                  investmentYield === 0.045 ? 'bg-[#0C2B1C] text-white' : 'text-[#52705F] hover:text-[#0C2B1C]'
                }`}
              >
                4.5% (T-Bills)
              </button>
              <button
                onClick={() => setInvestmentYield(0.07)}
                className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-colors cursor-pointer ${
                  investmentYield === 0.07 ? 'bg-[#0C2B1C] text-white' : 'text-[#52705F] hover:text-[#0C2B1C]'
                }`}
              >
                7.0% (S&P Index)
              </button>
            </div>
          </div>
        )}

        <div className="font-mono text-[11px] text-[#52705F]">
          Entity: Single-Member LLC → Form 2553 S-Corp Election
        </div>
      </div>

      {/* RECHARTS VISUALIZATION CONTAINER */}
      <div className="h-[380px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'cumulative' ? (
            <AreaChart data={projectionData} margin={{ top: 15, right: 20, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="scheduleCGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="sCorpGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#27B665" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#27B665" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF6F1" vertical={false} />
              <XAxis 
                dataKey="yearShort" 
                tick={{ fill: '#52705F', fontSize: 12, fontWeight: 600 }}
                tickLine={false}
                axisLine={{ stroke: '#D9F0E2' }}
              />
              <YAxis 
                tick={{ fill: '#52705F', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                tickFormatter={(val) => `$${Math.round(val / 1000)}k`}
                tickLine={false}
                axisLine={false}
                width={55}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '20px', fontSize: '12px', fontWeight: 600 }}
              />
              <Area
                type="monotone"
                name="Schedule C Cumulative Tax Paid"
                dataKey="cumulativeScheduleC"
                stroke="#EF4444"
                strokeWidth={3}
                fill="url(#scheduleCGradient)"
                activeDot={{ r: 6, fill: '#EF4444', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                name="Retalyy S-Corp Cumulative Tax Paid"
                dataKey="cumulativeSCorp"
                stroke="#27B665"
                strokeWidth={3}
                fill="url(#sCorpGradient)"
                activeDot={{ r: 6, fill: '#27B665', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            </AreaChart>
          ) : viewMode === 'annual' ? (
            <BarChart data={projectionData} margin={{ top: 15, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF6F1" vertical={false} />
              <XAxis 
                dataKey="yearShort" 
                tick={{ fill: '#52705F', fontSize: 12, fontWeight: 600 }}
                tickLine={false}
                axisLine={{ stroke: '#D9F0E2' }}
              />
              <YAxis 
                tick={{ fill: '#52705F', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                tickFormatter={(val) => `$${Math.round(val / 1000)}k`}
                tickLine={false}
                axisLine={false}
                width={55}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '20px', fontSize: '12px', fontWeight: 600 }}
              />
              <Bar 
                name="Schedule C Tax" 
                dataKey="scheduleCAnnualTax" 
                fill="#F87171" 
                radius={[8, 8, 0, 0]} 
                maxBarSize={48} 
              />
              <Bar 
                name="Retalyy S-Corp Tax" 
                dataKey="sCorpAnnualTax" 
                fill="#27B665" 
                radius={[8, 8, 0, 0]} 
                maxBarSize={48} 
              />
            </BarChart>
          ) : (
            <ComposedChart data={projectionData} margin={{ top: 15, right: 20, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="compoundedWealthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#46D279" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#46D279" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF6F1" vertical={false} />
              <XAxis 
                dataKey="yearShort" 
                tick={{ fill: '#52705F', fontSize: 12, fontWeight: 600 }}
                tickLine={false}
                axisLine={{ stroke: '#D9F0E2' }}
              />
              <YAxis 
                tick={{ fill: '#52705F', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                tickFormatter={(val) => `$${Math.round(val / 1000)}k`}
                tickLine={false}
                axisLine={false}
                width={55}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '20px', fontSize: '12px', fontWeight: 600 }}
              />
              <Bar 
                name="Annual Tax Saved" 
                dataKey="annualSavings" 
                fill="#8EDDA6" 
                radius={[6, 6, 0, 0]} 
                maxBarSize={40} 
              />
              <Area
                type="monotone"
                name={`Compounded Wealth (${investmentYield * 100}%)`}
                dataKey="compoundedWealth"
                stroke="#0F7A41"
                strokeWidth={3}
                fill="url(#compoundedWealthGrad)"
                activeDot={{ r: 6, fill: '#0F7A41', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                name="Cumulative Uninvested Cash"
                dataKey="cumulativeSavings"
                stroke="#0C2B1C"
                strokeDasharray="4 4"
                strokeWidth={2}
                dot={{ r: 4, fill: '#0C2B1C' }}
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Explanatory Architecture & Regulatory Guardrails */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#EEF6F1] text-xs">
        
        <div className="space-y-1.5">
          <div className="font-bold text-[#0C2B1C] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#27B665]" />
            <span>FICA Self-Employment Shield</span>
          </div>
          <p className="text-[#52705F] leading-relaxed">
            By bifurcating profits into defensible W-2 compensation and non-wage K-1 distributions, 100% of the distributions bypass the 15.3% self-employment tax.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="font-bold text-[#0C2B1C] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#27B665]" />
            <span>Solo 401(k) Employer Match</span>
          </div>
          <p className="text-[#52705F] leading-relaxed">
            S-Corp sponsors allow up to 25% of W-2 salary in pre-tax employer profit sharing, expanding annual retirement shelter capacity up to $70,000.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="font-bold text-[#0C2B1C] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#27B665]" />
            <span>Audit-Defensible BLS Salary</span>
          </div>
          <p className="text-[#52705F] leading-relaxed">
            Retalyy anchors reasonable compensation studies to Bureau of Labor Statistics data, satisfying IRS Revenue Ruling 74-44.
          </p>
        </div>

      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#EDF9F1] border border-[#D9F0E2]">
        <div className="flex items-center gap-3 text-xs text-[#0C2B1C]">
          <div className="w-8 h-8 rounded-full bg-[#27B665] text-white flex items-center justify-center font-bold shrink-0">
            ✓
          </div>
          <div>
            <strong>Ready to optimize this 5-year operational trajectory?</strong>
            <div className="text-[#52705F] text-[11px]">Upload prior-year financial records for instant OCR ledger extraction or schedule an operations consultation.</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
          <button
            onClick={onProceedToVault}
            className="ret-btn sm w-full sm:w-auto text-center"
          >
            Upload Financial Documents →
          </button>
          <button
            onClick={onOpenBooking}
            className="ret-btn sm secondary w-full sm:w-auto text-center"
          >
            Schedule Consultation
          </button>
        </div>
      </div>

    </div>
  );
};
