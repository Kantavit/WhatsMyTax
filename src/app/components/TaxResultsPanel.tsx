"use client";

import { BarChart3, Lightbulb } from "lucide-react";
import type { TaxResult } from "../types";
import { fmtCurrency, fmtPercent } from "../lib/tax";

interface TaxResultsPanelProps {
  result: TaxResult | null;
  showResult: boolean;
}

export function TaxResultsPanel({ result, showResult }: TaxResultsPanelProps) {
  if (!result || !showResult) {
    return (
      <div className="results-card flex items-center justify-center min-h-[320px]">
        <div className="text-center text-on-surface-variant">
          <BarChart3 className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">
            Enter your income and click
            <br />
            &quot;Calculate Tax&quot;
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── Results Card ── */}
      <div className="results-card animate-fade-in" id="results-panel">
        {/* Estimated Tax Due */}
        <div className="mb-5">
          <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">
            {result.totalWithholding > 0
              ? "ภาษีที่ต้องชำระเพิ่มเติม"
              : "ภาษีที่ต้องชำระ"}
          </p>
          <p className="text-4xl font-extrabold text-on-surface tabular-nums">
            ฿{" "}
            {fmtCurrency(
              result.totalWithholding > 0
                ? result.taxAfterWithholding
                : result.totalTax,
            ).replace("฿", "")}
          </p>
          {/* <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary mt-1">
            → {fmtPercent(result.effectiveRate)} อัตราภาษีเฉลี่ย
          </span> */}
          {result.refund > 0 && (
            <div className="mt-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-sm font-semibold text-primary">
                💰 เงินคืนภาษี ฿ {fmtCurrency(result.refund).replace("฿", "")}
              </p>
            </div>
          )}
        </div>

        <div className="h-px bg-outline-variant w-full mb-4" />

        {/* Breakdown */}
        <div className="space-y-2.5 mb-4">
          <div className="flex justify-between items-baseline text-sm">
            <span className="text-on-surface-variant">รายได้รวม</span>
            <span className="font-semibold text-on-surface tabular-nums">
              ฿ {fmtCurrency(result.grossIncome).replace("฿", "")}
            </span>
          </div>
          <div className="flex justify-between items-baseline text-sm">
            <span className="text-on-surface-variant">ค่าลดหย่อนรวม</span>
            <span className="font-semibold text-on-surface tabular-nums">
              ฿ {fmtCurrency(result.totalDeductions).replace("฿", "")}
            </span>
          </div>
          <div className="h-px bg-outline-variant w-full" />
          <div className="flex justify-between items-baseline text-sm">
            <span className="font-bold text-on-surface">เงินได้สุทธิ</span>
            <span className="font-bold text-on-surface tabular-nums">
              ฿ {fmtCurrency(result.netIncome).replace("฿", "")}
            </span>
          </div>
          {result.totalWithholding > 0 && (
            <>
              <div className="h-px bg-outline-variant w-full" />
              <div className="flex justify-between items-baseline text-sm">
                <span className="text-on-surface-variant">ภาษีคำนวณได้</span>
                <span className="font-semibold text-on-surface tabular-nums">
                  ฿ {fmtCurrency(result.totalTax).replace("฿", "")}
                </span>
              </div>
              <div className="flex justify-between items-baseline text-sm">
                <span className="text-on-surface-variant">หัก ณ ที่จ่าย</span>
                <span className="font-semibold text-on-surface tabular-nums">
                  ฿ {fmtCurrency(result.totalWithholding).replace("฿", "")}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Tax Brackets */}
        {result.netIncome > 0 && (
          <div className="mb-4">
            <h4 className="text-sm uppercase tracking-wider text-on-surface-variant font-bold mb-2">
              อัตราภาษีตามขั้นบันได
            </h4>
            {result.brackets.map((b, i) => (
              <div
                key={i}
                className="bracket-row text-sm"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="text-on-surface-variant">{b.label}</span>
                <div className="flex gap-3 items-baseline">
                  <span className="text-on-surface-variant text-xs w-12 text-right">
                    {b.rate === 0 ? "ยกเว้น" : fmtPercent(b.rate)}
                  </span>
                  <span className="font-medium text-on-surface min-w-[100px] text-right tabular-nums">
                    {b.tax === 0 ? "฿0.00" : fmtCurrency(b.tax)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Export Button */}
        {/* <button
          className="btn-export cursor-pointer"
          onClick={() => window.print()}
        >
          <Download className="w-4 h-4" />
          Export PDF Summary
        </button> */}
      </div>

      {/* ── Optimization Tip Card ── */}
      <div
        className="tip-card animate-fade-in"
        style={{ animationDelay: "150ms" }}
      >
        <h4 className="text-md font-bold text-tip-card-text mb-2">
          คำแนะนำในการประหยัดภาษี
        </h4>
        <p className="text-sm text-on-surface-variant leading-relaxed pr-10">
          {result.totalTax > 0
            ? `เหลืออีก ฿${fmtCurrency(
                Math.max(
                  0,
                  result.netIncome - getNextBracketThreshold(result.netIncome),
                ),
              ).replace(
                "฿",
                "",
              )} จากการเลื่อนลงสู่ขั้นภาษีที่ต่ำกว่า พิจารณาลงทุนใน SSF หรือ RMF เพื่อลดภาระภาษีของคุณ`
            : "รายได้ของคุณอยู่ในเกณฑ์ได้รับการยกเว้นภาษี คุณบริหารการเงินได้ดีมาก!"}
        </p>
        <div className="absolute -bottom-2 -right-1 w-16 h-16 text-primary opacity-15">
          <Lightbulb className="w-full h-full" />
        </div>
      </div>
    </>
  );
}

/** Helper to find the upper threshold of the previous bracket */
function getNextBracketThreshold(netIncome: number): number {
  const thresholds = [
    150_000, 300_000, 500_000, 750_000, 1_000_000, 2_000_000, 5_000_000,
  ];
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (netIncome > thresholds[i]) return thresholds[i];
  }
  return 0;
}
