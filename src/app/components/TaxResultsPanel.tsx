"use client";

import { BarChart3 } from "lucide-react";
import type { TaxResult, DeductionItem } from "../types";
import { fmtCurrency, fmtPercent, parseAmount } from "../lib/tax";

interface TaxResultsPanelProps {
  result: TaxResult | null;
  showResult: boolean;
  deductionItems: DeductionItem[];
}

export function TaxResultsPanel({
  result,
  showResult,
  deductionItems,
}: TaxResultsPanelProps) {
  if (!result || !showResult) {
    return (
      <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant flex items-center justify-center min-h-[400px]">
        <div className="text-center text-outline">
          <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>กรอกข้อมูลและคลิก &quot;คำนวณภาษี&quot;</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-surface-container-high rounded-xl p-6 border border-outline-variant animate-fade-in"
      id="results-panel"
    >
      <h3 className="text-[24px] font-bold  text-secondary uppercase mb-6">
        สรุปภาษี (Tax Summary)
      </h3>

      <div className="space-y-6">
        {/* Net Income Breakdown */}
        <div className="space-y-1.5">
          {/* รวมเงินได้ */}
          <div className="flex justify-between items-baseline text-sm">
            <span className="text-on-surface-variant">เงินได้</span>
            <span className="font-semibold text-on-surface tabular-nums">
              {fmtCurrency(result.grossIncome)}
            </span>
          </div>

          {/* หักค่าลดหย่อนทีละรายการ */}
          {deductionItems
            .filter(
              (item) => item.enabled && parseAmount(item.amount) > 0,
            )
            .map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-baseline text-sm"
              >
                <span className="text-on-surface-variant truncate max-w-[55%]">
                  − {item.name || "ค่าลดหย่อน"}
                </span>
                <span className="text-outline tabular-nums">
                  {fmtCurrency(parseAmount(item.amount))}
                </span>
              </div>
            ))}

          {/* divider */}
          <div className="border-t border-dashed border-outline-variant pt-1.5 mt-1">
            <div className="flex justify-between items-baseline">
              <p className="text-on-surface-variant text-sm pt-4">
                เงินได้สุทธิ (Net Income)
              </p>
              <p className="text-2xl font-extrabold text-on-surface tabular-nums">
                {fmtCurrency(result.netIncome).replace("฿", "")}{" "}
                <span className="text-xs font-normal text-outline">
                  THB
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="h-px bg-outline-variant w-full"></div>

        {/* ภาษีที่ต้องชำระ */}
        <div>
          <p className="text-on-surface-variant text-md font-bold mb-1">
            ภาษีที่ต้องชำระ (Estimated Tax)
          </p>
          <p className="text-4xl font-extrabold text-primary">
            {fmtCurrency(result.totalTax).replace("฿", "")}{" "}
            <span className="text-base font-normal text-primary/80">
              THB
            </span>
          </p>
        </div>

        {/* เงินภาษีที่ขอคืนได้ */}
        <div>
          <p className="text-on-surface-variant text-md font-bold mb-1">
            เงินภาษีที่ขอคืนได้ (Tax Refund)
          </p>
          <p className="text-4xl font-extrabold text-emerald-500 dark:text-emerald-400">
            {fmtCurrency(result.refund).replace("฿", "")}{" "}
            <span className="text-base font-normal text-emerald-500/70 dark:text-emerald-400/70">
              THB
            </span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-sm">
            <p className="text-[12px] text-on-surface-variant uppercase font-bold tracking-wider mb-1">
              หัก ณ ที่จ่าย
            </p>
            <p className="text-2xl font-extrabold text-on-surface truncate">
              {fmtCurrency(result.totalWithholding).replace("฿", "")}
            </p>
          </div> */}
        </div>

        {result.netIncome > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-xs uppercase tracking-wider text-outline font-bold">
              รายละเอียดตามขั้นบันได
            </h4>
            {result.brackets.map((b, i) => (
              <div
                key={i}
                className="bracket-row text-sm"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="text-on-surface-variant">
                  {b.label}
                </span>
                <div className="flex gap-2">
                  <span className="text-right text-outline text-xs">
                    {b.rate === 0 ? "ยกเว้นภาษี" : fmtPercent(b.rate)}
                  </span>
                  <span className="text-right font-medium text-on-surface max-w-[80px] truncate">
                    {b.tax === 0 ? "" : fmtCurrency(b.tax)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
