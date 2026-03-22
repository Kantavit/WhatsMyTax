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

/* ── Types ── */
interface LineItem {
  id: string;
  name: string;
  amount: string; // formatted display value
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

  // If net income is 0 → tax = 0, refund = all withholding
  // Otherwise → subtract withholding from computed tax
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

function parseAmount(formatted: string): number {
  const raw = formatted.replace(/[^0-9]/g, "");
  return raw === "" ? 0 : Number(raw);
}

function formatAmountInput(value: string): string {
  const raw = value.replace(/[^0-9]/g, "");
  if (raw === "") return "";
  return Number(raw).toLocaleString("en-US");
}

function createEmptyItem(): LineItem {
  return { id: newId(), name: "", amount: "" };
}

/* ── Reusable Item List Section Component ── */
function ItemListSection({
  title,
  items,
  setItems,
  addLabel,
  namePlaceholder,
  amountPlaceholder,
  sectionId,
}: {
  title: string;
  items: LineItem[];
  setItems: React.Dispatch<React.SetStateAction<LineItem[]>>;
  addLabel: string;
  namePlaceholder: string;
  amountPlaceholder: string;
  sectionId: string;
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

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAdd = () => {
    setItems((prev) => [...prev, createEmptyItem()]);
  };

  return (
    <div id={sectionId}>
      <div className="section-label">
        <h3>{title}</h3>
      </div>
      <div className="items-list">
        {items.map((item) => (
          <div key={item.id} className="item-row">
            <input
              type="text"
              className="input-name"
              placeholder={namePlaceholder}
              value={item.name}
              onChange={(e) => handleNameChange(item.id, e.target.value)}
            />
            <input
              type="text"
              inputMode="numeric"
              className="input-amount"
              placeholder={amountPlaceholder}
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
  const [incomeItems, setIncomeItems] = useState<LineItem[]>([createEmptyItem()]);
  const [deductionItems, setDeductionItems] = useState<LineItem[]>([]);
  const [withholdingItems, setWithholdingItems] = useState<LineItem[]>([]);
  const [result, setResult] = useState<TaxResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleCalculate = useCallback(() => {
    const grossIncome = incomeItems.reduce(
      (sum, item) => sum + parseAmount(item.amount),
      0
    );
    const totalDeductions = deductionItems.reduce(
      (sum, item) => sum + parseAmount(item.amount),
      0
    );
    const totalWithholding = withholdingItems.reduce(
      (sum, item) => sum + parseAmount(item.amount),
      0
    );

    if (grossIncome <= 0 && totalDeductions <= 0 && totalWithholding <= 0) return;

    const taxResult = calculateTax(grossIncome, totalDeductions, totalWithholding);
    setResult(taxResult);
    setShowResult(false);
    requestAnimationFrame(() => {
      setShowResult(true);
    });
  }, [incomeItems, deductionItems, withholdingItems]);

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
              คำนวณภาษีเงินได้
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-md mx-auto">
              กรอกรายได้ ลดหย่อน และหัก ณ ที่จ่าย เพื่อคำนวณภาษีเงินได้บุคคลธรรมดา
              ตามอัตราก้าวหน้าของกรมสรรพากร ปี 2568
            </p>
          </div>

          {/* Calculator Card */}
          <div className="glass-card p-5 sm:p-7 space-y-5" id="calculator-card">
            {/* Income Items */}
            <ItemListSection
              title="เงินได้"
              items={incomeItems}
              setItems={setIncomeItems}
              addLabel="เพิ่มรายได้"
              namePlaceholder="ชื่อรายได้"
              amountPlaceholder="จำนวนเงิน"
              sectionId="income-section"
            />

            <hr className="section-divider" />

            {/* Deduction Items */}
            <ItemListSection
              title="ค่าลดหย่อน"
              items={deductionItems}
              setItems={setDeductionItems}
              addLabel="เพิ่มลดหย่อน"
              namePlaceholder="ชื่อรายการลดหย่อน"
              amountPlaceholder="จำนวนเงิน"
              sectionId="deduction-section"
            />

            <hr className="section-divider" />

            {/* Withholding Tax Items */}
            <ItemListSection
              title="หัก ณ ที่จ่าย"
              items={withholdingItems}
              setItems={setWithholdingItems}
              addLabel="เพิ่มหัก ณ ที่จ่าย"
              namePlaceholder="ชื่อรายการหัก ณ ที่จ่าย"
              amountPlaceholder="จำนวนเงิน"
              sectionId="withholding-section"
            />

            {/* Calculate Button */}
            <button
              id="calculate-btn"
              className="btn-primary"
              onClick={handleCalculate}
            >
              คำนวณภาษี
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
                    รายได้รวม
                  </p>
                  <p className="text-[var(--text-primary)] font-bold text-sm sm:text-base">
                    {fmtCurrency(result.grossIncome)}
                  </p>
                </div>
                <div className="stat-card">
                  <p className="text-[var(--text-muted)] text-[0.65rem] uppercase tracking-wider mb-1">
                    ลดหย่อนรวม
                  </p>
                  <p className="text-[var(--text-primary)] font-bold text-sm sm:text-base">
                    {fmtCurrency(result.totalDeductions)}
                  </p>
                </div>
                <div className="stat-card">
                  <p className="text-[var(--text-muted)] text-[0.65rem] uppercase tracking-wider mb-1">
                    เงินได้สุทธิ
                  </p>
                  <p className="text-[var(--text-primary)] font-bold text-sm sm:text-base">
                    {fmtCurrency(result.netIncome)}
                  </p>
                </div>
                <div className="stat-card">
                  <p className="text-[var(--text-muted)] text-[0.65rem] uppercase tracking-wider mb-1">
                    อัตราภาษีเฉลี่ย
                  </p>
                  <p className="text-[var(--success)] font-bold text-sm sm:text-base">
                    {fmtPercent(result.effectiveRate)}
                  </p>
                </div>
              </div>

              {/* Calculation Summary */}
              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                  สรุปการคำนวณ
                </h3>
                <div className="flex justify-between text-sm py-1">
                  <span className="text-[var(--text-secondary)]">
                    เงินได้รวม
                  </span>
                  <span className="text-[var(--text-primary)] font-medium">
                    {fmtCurrency(result.grossIncome)}
                  </span>
                </div>
                <div className="flex justify-between text-sm py-1">
                  <span className="text-[var(--text-secondary)]">
                    หัก ค่าลดหย่อนรวม
                  </span>
                  <span className="text-[var(--text-primary)] font-medium">
                    −{fmtCurrency(result.totalDeductions)}
                  </span>
                </div>
                <div className="flex justify-between text-sm py-1 border-t border-[var(--border-glass)] pt-2">
                  <span className="text-[var(--text-primary)] font-semibold">
                    เงินได้สุทธิ
                  </span>
                  <span className="text-[var(--text-primary)] font-bold">
                    {fmtCurrency(result.netIncome)}
                  </span>
                </div>
              </div>

              {/* Bracket Breakdown — only show if net income > 0 */}
              {result.netIncome > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                    คำนวณภาษีตามขั้นบันได
                  </h3>

                  {/* Header row */}
                  <div className="bracket-row text-[0.7rem] uppercase tracking-wider text-[var(--text-muted)] font-semibold border-b-0 pb-0">
                    <span>ขั้นเงินได้ (บาท)</span>
                    <span className="text-right">อัตรา</span>
                    <span className="text-right">ภาษี</span>
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
                        {b.rate === 0 ? "ยกเว้น" : fmtPercent(b.rate)}
                      </span>
                      <span className="text-right font-medium text-[var(--text-primary)]">
                        {b.tax === 0 ? "" : fmtCurrency(b.tax)}
                      </span>
                    </div>
                  ))}

                  {/* Total tax from brackets */}
                  <div className="flex justify-between pt-3 border-t border-[var(--border-glass)]">
                    <span className="font-bold text-[var(--text-primary)] text-sm">
                      ภาษีจากขั้นบันได
                    </span>
                    <span className="font-bold text-[var(--text-primary)] text-sm">
                      {fmtCurrency(result.totalTax)}
                    </span>
                  </div>
                </div>
              )}

              {/* Withholding & Final Result */}
              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                  สรุปภาษี
                </h3>
                <div className="flex justify-between text-sm py-1">
                  <span className="text-[var(--text-secondary)]">
                    ภาษีที่คำนวณได้
                  </span>
                  <span className="text-[var(--text-primary)] font-medium">
                    {fmtCurrency(result.totalTax)}
                  </span>
                </div>
                <div className="flex justify-between text-sm py-1">
                  <span className="text-[var(--text-secondary)]">
                    หัก ณ ที่จ่ายรวม
                  </span>
                  <span className="text-[var(--text-primary)] font-medium">
                    −{fmtCurrency(result.totalWithholding)}
                  </span>
                </div>

                {/* Final outcome: pay or refund */}
                {result.taxAfterWithholding > 0 ? (
                  <div className="pay-card mt-3">
                    <p className="text-[var(--text-muted)] text-xs uppercase tracking-wider mb-1">
                      ภาษีที่ต้องชำระเพิ่ม
                    </p>
                    <p className="pay-text">
                      {fmtCurrency(result.taxAfterWithholding)}
                    </p>
                  </div>
                ) : (
                  <div className="refund-card mt-3">
                    <p className="text-[var(--text-muted)] text-xs uppercase tracking-wider mb-1">
                      {result.refund > 0
                        ? "เงินที่สามารถขอคืนภาษี"
                        : "ภาษีที่ต้องชำระ"}
                    </p>
                    <p className="refund-text">
                      {result.refund > 0
                        ? fmtCurrency(result.refund)
                        : fmtCurrency(0)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full py-5 px-4 sm:px-6 border-t border-[var(--border-glass)]">
        <div className="max-w-4xl mx-auto text-center text-xs text-[var(--text-muted)] space-y-1">
          <p>
            อ้างอิงอัตราภาษีเงินได้บุคคลธรรมดาจากกรมสรรพากร ปี 2568
          </p>
          <p>เพื่อการคำนวณเบื้องต้นเท่านั้น ไม่ใช่คำแนะนำด้านภาษีจากผู้เชี่ยวชาญ</p>
        </div>
      </footer>
    </div>
  );
}
