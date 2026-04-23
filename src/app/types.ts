/* ── Thailand 2025 Progressive Tax Brackets ── */
export const TAX_BRACKETS = [
  { min: 0, max: 150_000, rate: 0 },
  { min: 150_001, max: 300_000, rate: 0.05 },
  { min: 300_001, max: 500_000, rate: 0.1 },
  { min: 500_001, max: 750_000, rate: 0.15 },
  { min: 750_001, max: 1_000_000, rate: 0.2 },
  { min: 1_000_001, max: 2_000_000, rate: 0.25 },
  { min: 2_000_001, max: 5_000_000, rate: 0.3 },
  { min: 5_000_001, max: Infinity, rate: 0.35 },
] as const;

/* ── Types ── */
export interface IncomeItem {
  id: string;
  name: string;
  amount: string;
  withholding: string; // หัก ณ ที่จ่าย per income item
  enabled: boolean; // toggle switch
}

export interface DeductionItem {
  id: string;
  name: string;
  amount: string;
  enabled: boolean; // toggle switch
}

export interface BracketResult {
  label: string;
  rate: number;
  taxableInBracket: number;
  tax: number;
}

export interface TaxResult {
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
