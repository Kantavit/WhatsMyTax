"use client";

import { useState, useCallback } from "react";
import { Calculator } from "lucide-react";
import type { IncomeItem, DeductionItem, TaxResult } from "../types";
import { parseAmount, calculateTax } from "../lib/tax";
import { useDarkMode } from "../hooks/useDarkMode";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { IncomeListSection } from "./IncomeListSection";
import { DeductionListSection } from "./DeductionListSection";
import { TaxResultsPanel } from "./TaxResultsPanel";
import { HelpCard } from "./HelpCard";

export function TaxCalculator() {
  const { isDarkMode, toggleDarkMode, mounted } = useDarkMode();

  const [incomeItems, setIncomeItems] = useState<IncomeItem[]>([
    {
      id: "1",
      name: "เงินเดือน",
      amount: "",
      withholding: "",
      enabled: true,
    },
    {
      id: "2",
      name: "เงินปันผล",
      amount: "",
      withholding: "",
      enabled: true,
    },
    {
      id: "3",
      name: "ดอกเบี้ยเงินฝาก",
      amount: "",
      withholding: "",
      enabled: true,
    },
  ]);
  const [deductionItems, setDeductionItems] = useState<DeductionItem[]>([
    {
      id: "1",
      name: "ค่าลดหย่อนส่วนตัว",
      amount: "60000",
      enabled: true,
    },
    {
      id: "2",
      name: "ค่าใช้จ่าย (เหมา)",
      amount: "100000",
      enabled: true,
    },
    {
      id: "3",
      name: "ประกันสังคม",
      amount: "",
      enabled: true,
    },
    {
      id: "4",
      name: "เงินบริจาค",
      amount: "",
      enabled: true,
    },
  ]);
  const [result, setResult] = useState<TaxResult | null>(null);
  const [showResult, setShowResult] = useState(false);

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

    if (grossIncome <= 0 && totalDeductions <= 0 && totalWithholding <= 0)
      return;

    const taxResult = calculateTax(
      grossIncome,
      totalDeductions,
      totalWithholding,
    );
    setResult(taxResult);
    setShowResult(false);
    requestAnimationFrame(() => {
      setShowResult(true);
    });
  }, [incomeItems, deductionItems]);

  return (
    <div
      className={`min-h-dvh flex flex-col bg-background text-on-background antialiased ${isDarkMode ? "dark" : ""}`}
    >
      {/* ── Header ── */}
      <Header
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        mounted={mounted}
      />

      {/* ── Main ── */}
      <main className="flex-grow pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface mb-4 tracking-tight">
            คำนวณภาษีเงินได้บุคคลธรรมดา
          </h1>
          <p className="text-lg text-outline max-w-4xl mx-auto">
            กรอกรายได้และค่าลดหย่อน เพื่อคำนวณภาษีเงินได้บุคคลธรรมดาในประเทศไทย
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Calculator Card */}
          <div
            className="lg:col-span-8 bg-surface-container-lowest rounded-xl shadow-xl shadow-surface-container/20 border border-outline-variant overflow-hidden"
            id="calculator-card"
          >
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
                <Calculator className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <TaxResultsPanel
              result={result}
              showResult={showResult}
              deductionItems={deductionItems}
            />

            {/* Help Card */}
            <HelpCard />
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}
