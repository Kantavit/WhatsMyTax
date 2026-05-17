import type { BracketResult, TaxResult, IncomeItem, DeductionItem } from "../types";
import { TAX_BRACKETS } from "../types";

/* ── Formatting helpers ── */
export function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

export function fmtCurrency(n: number): string {
  return `฿${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function fmtPercent(n: number): string {
  return `${(n * 100).toFixed(2)}%`;
}

/* ── ID generation ── */
let idCounter = 0;
export function newId(): string {
  return `item-${++idCounter}-${Date.now()}`;
}

/* ── Parse & format amount inputs ── */

/** Parse a formatted number string (with commas and optional decimals) to a number */
export function parseAmount(formatted: string): number {
  const raw = formatted.replace(/[^0-9.]/g, "");
  if (raw === "" || raw === ".") return 0;
  const num = parseFloat(raw);
  return isNaN(num) ? 0 : Math.round(num * 100) / 100;
}

/** Format amount input to allow commas and up to 2 decimal places */
export function formatAmountInput(value: string): string {
  // Remove everything except digits, dots, and commas
  const raw = value.replace(/[^0-9.]/g, "");

  // Handle multiple dots — keep only the first one
  const dotIndex = raw.indexOf(".");
  if (dotIndex !== -1) {
    const intPart = raw.substring(0, dotIndex);
    let decPart = raw.substring(dotIndex + 1).replace(/\./g, "");
    // Limit decimal to 2 places
    decPart = decPart.substring(0, 2);
    // Format integer part with commas
    const formattedInt =
      intPart === "" ? "0" : Number(intPart).toLocaleString("en-US");
    return `${formattedInt}.${decPart}`;
  }

  if (raw === "") return "";
  return Number(raw).toLocaleString("en-US");
}

/* ── Factory functions ── */

export function createEmptyIncomeItem(): IncomeItem {
  return { id: newId(), name: "", amount: "", withholding: "", enabled: true };
}

export function createEmptyDeductionItem(): DeductionItem {
  return { id: newId(), name: "", amount: "", enabled: true };
}

/* ── Tax Calculation ── */
export function calculateTax(
  grossIncome: number,
  totalDeductions: number,
  totalWithholding: number,
): TaxResult {
  const netIncome = Math.max(0, grossIncome - totalDeductions);

  const brackets: BracketResult[] = [];
  let remaining = netIncome;
  let totalTax = 0;

  for (const bracket of TAX_BRACKETS) {
    if (remaining <= 0) break;

    const bracketWidth =
      bracket.max === Infinity ? remaining : bracket.max - bracket.min + 1;

    const taxableInBracket = Math.min(remaining, bracketWidth);
    const tax = taxableInBracket * bracket.rate;

    const label =
      bracket.max === Infinity
        ? `${fmt(bracket.min)} ขึ้นไป`
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
