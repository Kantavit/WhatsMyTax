"use client";

import { useState, useCallback, useEffect } from "react";

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

/* ── Types ── */
interface IncomeItem {
  id: string;
  name: string;
  amount: string;
  withholding: string; // หัก ณ ที่จ่าย per income item
  enabled: boolean;    // toggle switch
}

interface DeductionItem {
  id: string;
  name: string;
  amount: string;
  enabled: boolean;    // toggle switch
}

interface BracketResult {
  label: string;
  rate: number;
  taxableInBracket: number;
  tax: number;
}

interface TaxResult {
  grossIncome: number;
  totalDeductions: number;
  totalWithholding: number;
  netIncome: number;
  brackets: BracketResult[];
  totalTax: number;
  taxAfterWithholding: number;
  refund: number;
  effectiveRate: number;
}

/* ── Tax Calculation ── */
function calculateTax(
  grossIncome: number,
  totalDeductions: number,
  totalWithholding: number
): TaxResult {
  const netIncome = Math.max(0, grossIncome - totalDeductions);

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

  let taxAfterWithholding = 0;
  let refund = 0;

  if (netIncome === 0) {
    taxAfterWithholding = 0;
    refund = totalWithholding;
  } else {
    taxAfterWithholding = Math.max(0, totalTax - totalWithholding);
    refund = Math.max(0, totalWithholding - totalTax);
  }

  const effectiveRate = grossIncome > 0 ? totalTax / grossIncome : 0;

  return {
    grossIncome,
    totalDeductions,
    totalWithholding,
    netIncome,
    brackets,
    totalTax,
    taxAfterWithholding,
    refund,
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

/* ── Helpers ── */
let idCounter = 0;
function newId(): string {
  return `item-${++idCounter}-${Date.now()}`;
}

/** Parse a formatted number string (with commas and optional decimals) to a number */
function parseAmount(formatted: string): number {
  const raw = formatted.replace(/[^0-9.]/g, "");
  if (raw === "" || raw === ".") return 0;
  const num = parseFloat(raw);
  return isNaN(num) ? 0 : Math.round(num * 100) / 100;
}

/** Format amount input to allow commas and up to 2 decimal places */
function formatAmountInput(value: string): string {
  // Remove everything except digits, dots, and commas
  let raw = value.replace(/[^0-9.]/g, "");

  // Handle multiple dots — keep only the first one
  const dotIndex = raw.indexOf(".");
  if (dotIndex !== -1) {
    const intPart = raw.substring(0, dotIndex);
    let decPart = raw.substring(dotIndex + 1).replace(/\./g, "");
    // Limit decimal to 2 places
    decPart = decPart.substring(0, 2);
    // Format integer part with commas
    const formattedInt = intPart === "" ? "0" : Number(intPart).toLocaleString("en-US");
    return `${formattedInt}.${decPart}`;
  }

  if (raw === "") return "";
  return Number(raw).toLocaleString("en-US");
}

function createEmptyIncomeItem(): IncomeItem {
  return { id: newId(), name: "", amount: "", withholding: "", enabled: true };
}

function createEmptyDeductionItem(): DeductionItem {
  return { id: newId(), name: "", amount: "", enabled: true };
}

/* ── Toggle Switch Component ── */
function ToggleSwitch({
  checked,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      className={`toggle-switch ${checked ? "toggle-on" : "toggle-off"}`}
      onClick={() => onChange(!checked)}
    >
      <span className="toggle-knob" />
    </button>
  );
}

/* ── Income Item List Section ── */
function IncomeListSection({
  title,
  items,
  setItems,
  addLabel,
}: {
  title: string;
  items: IncomeItem[];
  setItems: React.Dispatch<React.SetStateAction<IncomeItem[]>>;
  addLabel: string;
}) {
  const handleNameChange = (id: string, value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name: value } : item))
    );
  };

  const handleAmountChange = (id: string, value: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, amount: formatAmountInput(value) } : item
      )
    );
  };

  const handleWithholdingChange = (id: string, value: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, withholding: formatAmountInput(value) } : item
      )
    );
  };

  const handleToggle = (id: string, checked: boolean) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: checked } : item
      )
    );
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAdd = () => {
    setItems((prev) => [...prev, createEmptyIncomeItem()]);
  };

  return (
    <div id="income-section" className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="material-symbols-outlined text-primary">payments</span>
        <h2 className="text-xl font-bold text-on-surface">{title}</h2>
      </div>
      <div className="items-list space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`${!item.enabled ? "item-disabled" : ""}`}
          >
            <div className="item-row">
              <ToggleSwitch
                checked={item.enabled}
                onChange={(checked) => handleToggle(item.id, checked)}
                ariaLabel={`เปิด/ปิดรายการ ${item.name || "เงินได้"}`}
              />
              <input
                type="text"
                className="input-name"
                placeholder="รายการเงินได้"
                value={item.name}
                onChange={(e) => handleNameChange(item.id, e.target.value)}
              />
              <input
                type="text"
                inputMode="decimal"
                className="input-amount"
                placeholder="จำนวนเงิน"
                value={item.amount}
                onChange={(e) => handleAmountChange(item.id, e.target.value)}
              />
              <input
                type="text"
                inputMode="decimal"
                className="input-amount"
                placeholder="หัก ณ ที่จ่าย"
                value={item.withholding}
                onChange={(e) => handleWithholdingChange(item.id, e.target.value)}
              />
              <button
                className="btn-remove"
                onClick={() => handleRemove(item.id)}
                aria-label="ลบรายการ"
              >
                ×
              </button>
            </div>
          </div>
        ))}
        <button className="btn-add" onClick={handleAdd}>
          <span className="icon-plus">+</span> {addLabel}
        </button>
      </div>
    </div>
  );
}

/* ── Deduction Item List Section ── */
function DeductionListSection({
  title,
  items,
  setItems,
  addLabel,
}: {
  title: string;
  items: DeductionItem[];
  setItems: React.Dispatch<React.SetStateAction<DeductionItem[]>>;
  addLabel: string;
}) {
  const handleNameChange = (id: string, value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name: value } : item))
    );
  };

  const handleAmountChange = (id: string, value: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, amount: formatAmountInput(value) } : item
      )
    );
  };

  const handleToggle = (id: string, checked: boolean) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: checked } : item
      )
    );
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAdd = () => {
    setItems((prev) => [...prev, createEmptyDeductionItem()]);
  };

  return (
    <div id="deduction-section" className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="material-symbols-outlined text-primary">savings</span>
        <h2 className="text-xl font-bold text-on-surface">{title}</h2>
      </div>
      <div className="items-list space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`${!item.enabled ? "item-disabled" : ""}`}
          >
            <div className="item-row">
            <ToggleSwitch
              checked={item.enabled}
              onChange={(checked) => handleToggle(item.id, checked)}
              ariaLabel={`เปิด/ปิดรายการ ${item.name || "ค่าลดหย่อน"}`}
            />
            <input
              type="text"
              className="input-name"
              placeholder="รายการลดหย่อน"
              value={item.name}
              onChange={(e) => handleNameChange(item.id, e.target.value)}
            />
            <input
              type="text"
              inputMode="decimal"
              className="input-amount"
              placeholder="จำนวนเงิน"
              value={item.amount}
              onChange={(e) => handleAmountChange(item.id, e.target.value)}
            />
            <button
              className="btn-remove"
              onClick={() => handleRemove(item.id)}
              aria-label="ลบรายการ"
            >
              ×
            </button>
            </div>
          </div>
        ))}
        <button className="btn-add" onClick={handleAdd}>
          <span className="icon-plus">+</span> {addLabel}
        </button>
      </div>
    </div>
  );
}

/* ── Main Page Component ── */
export default function Home() {
  const [incomeItems, setIncomeItems] = useState<IncomeItem[]>([createEmptyIncomeItem()]);
  const [deductionItems, setDeductionItems] = useState<DeductionItem[]>([]);
  const [result, setResult] = useState<TaxResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle system preference on mount and live-updates
  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set initial state based on what the script added or media query
    const isSystemDark = document.documentElement.classList.contains('dark') || mediaQuery.matches;
    setIsDarkMode(isSystemDark);

    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Synchronize the 'dark' class with the isDarkMode state
  useEffect(() => {
    if (!mounted) return;
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode, mounted]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const handleCalculate = useCallback(() => {
    // Only sum enabled items
    const grossIncome = incomeItems
      .filter((item) => item.enabled)
      .reduce((sum, item) => sum + parseAmount(item.amount), 0);

    const totalDeductions = deductionItems
      .filter((item) => item.enabled)
      .reduce((sum, item) => sum + parseAmount(item.amount), 0);

    // Sum withholding from each enabled income item
    const totalWithholding = incomeItems
      .filter((item) => item.enabled)
      .reduce((sum, item) => sum + parseAmount(item.withholding), 0);

    if (grossIncome <= 0 && totalDeductions <= 0 && totalWithholding <= 0) return;

    const taxResult = calculateTax(grossIncome, totalDeductions, totalWithholding);
    setResult(taxResult);
    setShowResult(false);
    requestAnimationFrame(() => {
      setShowResult(true);
    });
  }, [incomeItems, deductionItems]);

  return (
    <div className={`min-h-dvh flex flex-col bg-background text-on-background antialiased ${isDarkMode ? 'dark' : ''}`}>
      {/* ── Header ── */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-surface-container-lowest border-b border-outline-variant shadow-sm font-inter antialiased">
        <div className="text-xl font-bold text-primary">What&apos;s My Tax</div>
        <div className="flex items-center gap-4">
          {mounted && (
            <button 
              type="button"
              onClick={toggleDarkMode}
              className="relative z-[60] p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all active:scale-90 duration-150 flex items-center justify-center rounded-full"
              aria-label="Toggle dark mode"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                {isDarkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          )}
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-grow pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface mb-4 tracking-tight">
            คำนวณภาษีเงินได้
          </h1>
          <p className="text-lg text-outline max-w-4xl mx-auto">
            กรอกรายได้และค่าลดหย่อน เพื่อคำนวณภาษีเงินได้บุคคลธรรมดา ตามอัตราก้าวหน้าของกรมสรรพากร ปี 2568
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Calculator Card */}
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl shadow-xl shadow-surface-container/20 border border-outline-variant overflow-hidden" id="calculator-card">
            <div className="p-6 md:p-8 grid grid-cols-1 gap-10">
              <IncomeListSection
                title="เงินได้ (Income Details)"
                items={incomeItems}
                setItems={setIncomeItems}
                addLabel="เพิ่มรายได้"
              />

              <hr className="border-outline-variant" />

              <DeductionListSection
                title="ค่าลดหย่อน (Deductions & Allowances)"
                items={deductionItems}
                setItems={setDeductionItems}
                addLabel="เพิ่มลดหย่อน"
              />
            </div>

            <div className="bg-surface-container p-6 md:p-8 border-t border-outline-variant flex justify-center">
              <button
                id="calculate-btn"
                className="bg-primary text-on-primary hover:bg-opacity-90 px-12 py-4 rounded-full font-bold text-lg shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center gap-2"
                onClick={handleCalculate}
              >
                คำนวณภาษี
                <span className="material-symbols-outlined" data-icon="calculate">calculate</span>
              </button>
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {result && showResult ? (
              <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant animate-fade-in" id="results-panel">
                <h3 className="text-sm font-bold text-secondary uppercase tracking-widest mb-6">สรุปภาษี (Tax Summary)</h3>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-on-surface-variant text-sm mb-1">เงินได้สุทธิ (Net Income)</p>
                    <p className="text-3xl font-extrabold text-on-surface">{fmtCurrency(result.netIncome).replace('฿', '')} <span className="text-sm font-normal text-outline">THB</span></p>
                  </div>
                  
                  <div className="h-px bg-outline-variant w-full"></div>
                  
                  <div>
                    <p className="text-on-surface-variant text-sm mb-1">ภาษีที่ต้องชำระ (Estimated Tax)</p>
                    <p className="text-4xl font-extrabold text-primary">{fmtCurrency(result.totalTax).replace('฿', '')} <span className="text-base font-normal text-primary/80">THB</span></p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/50 p-3 rounded-lg border border-white/80">
                      <p className="text-xs text-outline uppercase font-bold">อัตราภาษีเฉลี่ย</p>
                      <p className="text-xl font-bold text-on-surface">{fmtPercent(result.effectiveRate)}</p>
                    </div>
                    <div className="bg-white/50 p-3 rounded-lg border border-white/80">
                      <p className="text-xs text-outline uppercase font-bold">หัก ณ ที่จ่าย</p>
                      <p className="text-xl font-bold text-on-surface text-ellipsis overflow-hidden truncate">{fmtCurrency(result.totalWithholding).replace('฿', '')}</p>
                    </div>
                  </div>

                  {result.netIncome > 0 && (
                    <div className="mt-4 space-y-2">
                       <h4 className="text-xs uppercase tracking-wider text-outline font-bold">รายละเอียดตามขั้นบันได</h4>
                       {result.brackets.map((b, i) => (
                         <div key={i} className="bracket-row text-sm" style={{ animationDelay: `${i * 60}ms` }}>
                             <span className="text-on-surface-variant">{b.label}</span>
                             <div className="flex gap-2">
                               <span className="text-right text-outline text-xs">{b.rate === 0 ? "ยกเว้น" : fmtPercent(b.rate)}</span>
                               <span className="text-right font-medium text-on-surface max-w-[80px] truncate">{b.tax === 0 ? "-" : fmtCurrency(b.tax)}</span>
                             </div>
                         </div>
                       ))}
                    </div>
                  )}

                  {result.taxAfterWithholding > 0 ? (
                    <div className="pay-card mt-6">
                      <p className="text-error/80 text-xs uppercase tracking-wider mb-1 font-bold">ชำระเพิ่ม</p>
                      <p className="pay-text">{fmtCurrency(result.taxAfterWithholding)}</p>
                    </div>
                  ) : (
                    <div className="refund-card mt-6">
                      <p className="text-success/80 text-xs uppercase tracking-wider mb-1 font-bold">{result.refund > 0 ? "ขอคืนภาษี" : "ภาษีที่ต้องชำระ"}</p>
                      <p className="refund-text">{result.refund > 0 ? fmtCurrency(result.refund) : fmtCurrency(0)}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant flex items-center justify-center min-h-[400px]">
                <div className="text-center text-outline">
                  <span className="material-symbols-outlined text-4xl mb-2">analytics</span>
                  <p>กรอกข้อมูลและคลิก "คำนวณภาษี"</p>
                </div>
              </div>
            )}

            {/* Help Card */}
            <div className="bg-tertiary-fixed rounded-xl p-6 border border-tertiary-fixed-dim relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="text-on-tertiary-fixed font-bold mb-2">Need tax planning?</h4>
                <p className="text-on-tertiary-fixed-variant text-sm mb-4">Discover ways to reduce your tax liability with an optimized allowance guide.</p>
                <button className="bg-on-tertiary-fixed text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm">Explore Guides</button>
              </div>
              <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-8xl text-on-tertiary-fixed/10 rotate-12 group-hover:scale-110 transition-transform">lightbulb</span>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full py-8 px-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-container border-t border-outline-variant mt-auto">
        <div className="text-lg font-bold text-on-surface">What&apos;s My Tax</div>
        <div className="flex flex-wrap justify-center gap-6">
          <span className="text-sm font-body text-on-surface-variant">อ้างอิงอัตราภาษีเงินได้บุคคลธรรมดา ปี 2568</span>
        </div>
        <div className="text-sm font-body text-outline">
          © 2025 What&apos;s My Tax. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
