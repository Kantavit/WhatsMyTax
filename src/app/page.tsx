"use client";

import { useState, useCallback } from "react";

/* ── Thailand 2025 Progressive Tax Brackets ── */
const TAX_BRACKETS = [
  { min: 0, max: 150_000, rate: 0 },
  { min: 150_001, max: 300_000, rate: 0.05 },
  { min: 300_001, max: 500_000, rate: 0.10 },
  { min: 500_001, max: 750_000, rate: 0.15 },
  { min: 750_001, max: 1_000_000, rate: 0.20 },
  { min: 1_000_001, max: 2_000_000, rate: 0.25 },
  { min: 2_000_001, max: 5_000_000, rate: 0.30 },
  { min: 5_000_001, max: Infinity, rate: 0.35 },
] as const;

const PERSONAL_ALLOWANCE = 60_000;
const MAX_EXPENSE_DEDUCTION = 100_000;
const EXPENSE_DEDUCTION_RATE = 0.5; // 50% of income

interface BracketResult {
  label: string;
  rate: number;
  taxableInBracket: number;
  tax: number;
}

interface TaxResult {
  grossIncome: number;
  expenseDeduction: number;
  personalAllowance: number;
  netIncome: number;
  brackets: BracketResult[];
  totalTax: number;
  effectiveRate: number;
}

function calculateTax(grossIncome: number): TaxResult {
  const expenseDeduction = Math.min(
    grossIncome * EXPENSE_DEDUCTION_RATE,
    MAX_EXPENSE_DEDUCTION
  );
  const netIncome = Math.max(
    0,
    grossIncome - expenseDeduction - PERSONAL_ALLOWANCE
  );

  const brackets: BracketResult[] = [];
  let remaining = netIncome;
  let totalTax = 0;

  for (const bracket of TAX_BRACKETS) {
    if (remaining <= 0) break;

    const bracketWidth =
      bracket.max === Infinity
        ? remaining
        : bracket.max - bracket.min + 1;

    const taxableInBracket = Math.min(remaining, bracketWidth);
    const tax = taxableInBracket * bracket.rate;

    const label =
      bracket.max === Infinity
        ? `${fmt(bracket.min)}+`
        : `${fmt(bracket.min)} – ${fmt(bracket.max)}`;

    brackets.push({ label, rate: bracket.rate, taxableInBracket, tax });
    totalTax += tax;
    remaining -= taxableInBracket;
  }

  const effectiveRate = grossIncome > 0 ? totalTax / grossIncome : 0;

  return {
    grossIncome,
    expenseDeduction,
    personalAllowance: PERSONAL_ALLOWANCE,
    netIncome,
    brackets,
    totalTax,
    effectiveRate,
  };
}

/* ── Formatting helpers ── */
function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

function fmtCurrency(n: number): string {
  return `฿${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtPercent(n: number): string {
  return `${(n * 100).toFixed(2)}%`;
}

/* ── Main Page Component ── */
export default function Home() {
  const [incomeInput, setIncomeInput] = useState("");
  const [result, setResult] = useState<TaxResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleCalculate = useCallback(() => {
    const income = parseFloat(incomeInput.replace(/,/g, ""));
    if (isNaN(income) || income < 0) return;

    const taxResult = calculateTax(income);
    setResult(taxResult);
    setShowResult(false);
    // Trigger animation
    requestAnimationFrame(() => {
      setShowResult(true);
    });
  }, [incomeInput]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCalculate();
  };

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and commas
    const raw = e.target.value.replace(/[^0-9]/g, "");
    if (raw === "") {
      setIncomeInput("");
      return;
    }
    setIncomeInput(Number(raw).toLocaleString("en-US"));
  };

  return (
    <div className="min-h-dvh flex flex-col">
      {/* ── Header ── */}
      <header className="w-full py-5 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] flex items-center justify-center text-white font-bold text-sm shadow-lg">
              ฿
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
              What&apos;s My Tax
            </h1>
          </div>
          <span className="text-xs text-[var(--text-muted)] hidden sm:block">
            Thailand Individual Income Tax • 2025
          </span>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 flex items-start justify-center px-4 sm:px-6 py-6 sm:py-10">
        <div className="w-full max-w-xl space-y-6">
          {/* Hero */}
          <div className="text-center space-y-2 mb-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold gradient-text leading-tight">
              Calculate Your Thai Tax
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-md mx-auto">
              Enter your annual gross income to instantly see your income tax
              breakdown using Thailand&apos;s 2025 progressive brackets.
            </p>
          </div>

          {/* Calculator Card */}
          <div className="glass-card p-5 sm:p-7 space-y-5" id="calculator-card">
            {/* Income Input */}
            <div>
              <label htmlFor="income-input" className="field-label">
                Annual Gross Income (THB)
              </label>
              <input
                id="income-input"
                type="text"
                inputMode="numeric"
                className="input-field text-lg"
                placeholder="e.g. 1,200,000"
                value={incomeInput}
                onChange={handleIncomeChange}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </div>

            {/* Deductions Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="stat-card">
                <p className="text-[var(--text-muted)] text-xs uppercase tracking-wider mb-1">
                  Expense Deduction
                </p>
                <p className="text-[var(--text-primary)] font-semibold">
                  50% (max ฿100,000)
                </p>
              </div>
              <div className="stat-card">
                <p className="text-[var(--text-muted)] text-xs uppercase tracking-wider mb-1">
                  Personal Allowance
                </p>
                <p className="text-[var(--text-primary)] font-semibold">
                  ฿60,000
                </p>
              </div>
            </div>

            {/* Calculate Button */}
            <button
              id="calculate-btn"
              className="btn-primary"
              onClick={handleCalculate}
            >
              Calculate Tax
            </button>
          </div>

          {/* Results */}
          {result && showResult && (
            <div
              className="glass-card p-5 sm:p-7 space-y-5 animate-fade-in"
              id="results-panel"
            >
              {/* Summary Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="stat-card">
                  <p className="text-[var(--text-muted)] text-[0.65rem] uppercase tracking-wider mb-1">
                    Gross Income
                  </p>
                  <p className="text-[var(--text-primary)] font-bold text-sm sm:text-base">
                    {fmtCurrency(result.grossIncome)}
                  </p>
                </div>
                <div className="stat-card">
                  <p className="text-[var(--text-muted)] text-[0.65rem] uppercase tracking-wider mb-1">
                    Net Taxable
                  </p>
                  <p className="text-[var(--text-primary)] font-bold text-sm sm:text-base">
                    {fmtCurrency(result.netIncome)}
                  </p>
                </div>
                <div className="stat-card border-[var(--accent-from)]">
                  <p className="text-[var(--text-muted)] text-[0.65rem] uppercase tracking-wider mb-1">
                    Total Tax
                  </p>
                  <p className="gradient-text font-bold text-sm sm:text-base">
                    {fmtCurrency(result.totalTax)}
                  </p>
                </div>
                <div className="stat-card">
                  <p className="text-[var(--text-muted)] text-[0.65rem] uppercase tracking-wider mb-1">
                    Effective Rate
                  </p>
                  <p className="text-[var(--success)] font-bold text-sm sm:text-base">
                    {fmtPercent(result.effectiveRate)}
                  </p>
                </div>
              </div>

              {/* Deductions Summary */}
              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                  Deductions Applied
                </h3>
                <div className="flex justify-between text-sm py-1">
                  <span className="text-[var(--text-secondary)]">
                    Expense deduction (50%, max ฿100,000)
                  </span>
                  <span className="text-[var(--text-primary)] font-medium">
                    −{fmtCurrency(result.expenseDeduction)}
                  </span>
                </div>
                <div className="flex justify-between text-sm py-1">
                  <span className="text-[var(--text-secondary)]">
                    Personal allowance
                  </span>
                  <span className="text-[var(--text-primary)] font-medium">
                    −{fmtCurrency(result.personalAllowance)}
                  </span>
                </div>
                <div className="flex justify-between text-sm py-1 border-t border-[var(--border-glass)] pt-2">
                  <span className="text-[var(--text-primary)] font-semibold">
                    Net taxable income
                  </span>
                  <span className="text-[var(--text-primary)] font-bold">
                    {fmtCurrency(result.netIncome)}
                  </span>
                </div>
              </div>

              {/* Bracket Breakdown */}
              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                  Tax Bracket Breakdown
                </h3>

                {/* Header row */}
                <div className="bracket-row text-[0.7rem] uppercase tracking-wider text-[var(--text-muted)] font-semibold border-b-0 pb-0">
                  <span>Bracket (THB)</span>
                  <span className="text-right">Rate</span>
                  <span className="text-right">Tax</span>
                </div>

                {/* Data rows */}
                {result.brackets.map((b, i) => (
                  <div
                    key={i}
                    className="bracket-row"
                    style={{
                      animationDelay: `${i * 60}ms`,
                    }}
                  >
                    <span className="text-[var(--text-secondary)]">
                      {b.label}
                    </span>
                    <span className="text-right text-[var(--text-secondary)]">
                      {b.rate === 0 ? "Exempt" : fmtPercent(b.rate)}
                    </span>
                    <span className="text-right font-medium text-[var(--text-primary)]">
                      {b.tax === 0 ? "—" : fmtCurrency(b.tax)}
                    </span>
                  </div>
                ))}

                {/* Total row */}
                <div className="flex justify-between pt-3 border-t border-[var(--border-glass)]">
                  <span className="font-bold gradient-text text-base">
                    Total Tax Payable
                  </span>
                  <span className="font-bold gradient-text text-base">
                    {fmtCurrency(result.totalTax)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full py-5 px-4 sm:px-6 border-t border-[var(--border-glass)]">
        <div className="max-w-4xl mx-auto text-center text-xs text-[var(--text-muted)] space-y-1">
          <p>
            Based on Thailand Revenue Department 2025 progressive tax brackets.
          </p>
          <p>For informational purposes only. Not professional tax advice.</p>
        </div>
      </footer>
    </div>
  );
}
