"use client";

import { useState, useCallback } from "react";
import {
  Calculator,
  ArrowRight,
  FileText,
  Plus,
  Trash2,
} from "lucide-react";
import type { TaxResult } from "../types";
import { parseAmount, calculateTax, formatAmountInput } from "../lib/tax";
import { useDarkMode } from "../hooks/useDarkMode";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { TaxResultsPanel } from "./TaxResultsPanel";

export function TaxCalculator() {
  const { isDarkMode, toggleDarkMode, mounted } = useDarkMode();

  /* ── Form state ── */
  const [salary, setSalary] = useState("");
  const [bonus, setBonus] = useState("");
  const [otherIncome, setOtherIncome] = useState("");
  const [withholding, setWithholding] = useState("");

  /* ── Deductions toggle chips ── */
  const [personalAllowance, setPersonalAllowance] = useState(true);
  const [standardDeduction, setStandardDeduction] = useState(true);

  /* ── Custom deductions ── */
  interface CustomDeduction {
    id: string;
    name: string;
    amount: number;
    enabled: boolean;
  }
  const [customDeductions, setCustomDeductions] = useState<CustomDeduction[]>(
    [],
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDeductionName, setNewDeductionName] = useState("");
  const [newDeductionAmount, setNewDeductionAmount] = useState("");

  const handleAddDeduction = () => {
    const amount = parseAmount(newDeductionAmount);
    const name = newDeductionName.trim();
    if (!name || amount <= 0) return;
    setCustomDeductions((prev) => [
      ...prev,
      { id: `custom-${Date.now()}`, name, amount, enabled: true },
    ]);
    setNewDeductionName("");
    setNewDeductionAmount("");
    setShowAddForm(false);
  };

  const toggleCustomDeduction = (id: string) => {
    setCustomDeductions((prev) =>
      prev.map((d) => (d.id === id ? { ...d, enabled: !d.enabled } : d)),
    );
  };

  const removeCustomDeduction = (id: string) => {
    setCustomDeductions((prev) => prev.filter((d) => d.id !== id));
  };

  const [result, setResult] = useState<TaxResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCardGlowing, setIsCardGlowing] = useState(false);

  const handleAmountChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string,
  ) => {
    setter(formatAmountInput(value));
  };

  const handleCalculate = useCallback(() => {
    const grossIncome =
      parseAmount(salary) + parseAmount(bonus) + parseAmount(otherIncome);

    let totalDeductions = 0;
    if (personalAllowance) totalDeductions += 60000;
    if (standardDeduction) totalDeductions += 100000;
    totalDeductions += customDeductions
      .filter((d) => d.enabled)
      .reduce((sum, d) => sum + d.amount, 0);

    const totalWithholding = parseAmount(withholding);

    if (grossIncome <= 0) return;

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
  }, [
    salary,
    bonus,
    otherIncome,
    withholding,
    personalAllowance,
    standardDeduction,
    customDeductions,
  ]);

  const scrollToCalculator = () => {
    document
      .getElementById("calculator-section")
      ?.scrollIntoView({ behavior: "smooth" });
    setIsCardGlowing(true);
    setTimeout(() => setIsCardGlowing(false), 1500);
  };

  return (
    <div className="min-h-dvh flex flex-col bg-background text-on-background antialiased">
      {/* ── Header ── */}
      <Header
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        mounted={mounted}
      />

      {/* ── Main ── */}
      <main className="flex-grow">
        {/* ── Hero Section ── */}
        <section className="pt-16 pb-12 px-4 md:px-8 max-w-5xl mx-auto">
          <h1 className="hero-title mb-4">
            คำนวณภาษีเงินได้บุคคลธรรมดา
            <br />
            <span className="highlight">ถูกต้องแม่นยำในทุกรายละเอียด</span>
          </h1>
          <p className="text-on-surface-variant text-base md:text-lg max-w-xl mb-8 leading-relaxed">
            คำนวณภาษีเงินได้บุคคลธรรมดาในประเทศไทย อ้างอิงจากกรมสรรพากร
            <br />
            วางแผนภาษีได้อย่างสะดวก ปลอดภัย และใช้งานง่าย
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={scrollToCalculator}
              className="btn-primary cursor-pointer"
            >
              เริ่มคำนวณภาษี <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="https://www.rd.go.th/62337.html"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <FileText className="w-4 h-4" /> ความรู้เรื่องภาษีบุคคลธรรมดา
            </a>
          </div>
        </section>

        {/* ── Calculator Section ── */}
        <section
          id="calculator-section"
          className="pb-16 px-4 md:px-8 max-w-5xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
            {/* ── Calculator Card (left) ── */}
            <div
              className={`calc-card transition-all duration-500 ease-in-out ${showResult && result ? "lg:col-span-3" : "lg:col-span-5"} ${isCardGlowing ? "card-glow" : ""}`}
              id="calculator-card"
            >
              <div className="calc-card-header">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary" />
                  <h2 className="text-base font-bold text-on-surface">
                    ข้อมูลรายได้และค่าลดหย่อน
                  </h2>
                </div>
              </div>

              <div className="calc-card-body space-y-7">
                {/* Annual Salary */}
                <div>
                  <label htmlFor="salary" className="form-label">
                    รายได้ต่อปี (บาท)
                  </label>
                  <div className="form-input-wrapper">
                    <span className="form-input-prefix">฿</span>
                    <input
                      id="salary"
                      type="text"
                      inputMode="decimal"
                      className="form-input"
                      placeholder="0.00"
                      value={salary}
                      onChange={(e) =>
                        handleAmountChange(setSalary, e.target.value)
                      }
                    />
                  </div>
                </div>
                {/* Bonus + Other Income */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bonus" className="form-label">
                      โบนัส (บาท)
                    </label>
                    <div className="form-input-wrapper">
                      <span className="form-input-prefix">฿</span>
                      <input
                        id="bonus"
                        type="text"
                        inputMode="decimal"
                        className="form-input"
                        placeholder="0.00"
                        value={bonus}
                        onChange={(e) =>
                          handleAmountChange(setBonus, e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="other-income" className="form-label">
                      รายได้อื่นๆ (บาท)
                    </label>
                    <div className="form-input-wrapper">
                      <span className="form-input-prefix">฿</span>
                      <input
                        id="other-income"
                        type="text"
                        inputMode="decimal"
                        className="form-input"
                        placeholder="0.00"
                        value={otherIncome}
                        onChange={(e) =>
                          handleAmountChange(setOtherIncome, e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
                {/* หัก ณ ที่จ่าย */}
                <div>
                  <label htmlFor="withholding" className="form-label">
                    ภาษีหัก ณ ที่จ่าย (บาท)
                  </label>
                  <div className="form-input-wrapper">
                    <span className="form-input-prefix">฿</span>
                    <input
                      id="withholding"
                      type="text"
                      inputMode="decimal"
                      className="form-input"
                      placeholder="0.00"
                      value={withholding}
                      onChange={(e) =>
                        handleAmountChange(setWithholding, e.target.value)
                      }
                    />
                  </div>
                </div>
                {/* Common Deductions */}
                <div>
                  <p className="form-label">รายการลดหย่อน</p>
                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      className={`deduction-chip ${personalAllowance ? "deduction-chip-active" : ""}`}
                      onClick={() => setPersonalAllowance((v) => !v)}
                    >
                      <span className="deduction-chip-indicator" />
                      ค่าลดหย่อนส่วนตัว (฿60,000)
                    </button>
                    <button
                      type="button"
                      className={`deduction-chip ${standardDeduction ? "deduction-chip-active" : ""}`}
                      onClick={() => setStandardDeduction((v) => !v)}
                    >
                      <span className="deduction-chip-indicator" />
                      ค่าใช้จ่ายแบบเหมา (฿100,000)
                    </button>

                    {/* Custom deductions */}
                    {customDeductions.map((d) => (
                      <div
                        key={d.id}
                        className={`deduction-chip !w-full !justify-between !pr-2 ${d.enabled ? "deduction-chip-active" : ""}`}
                      >
                        <button
                          type="button"
                          className="flex items-center gap-2 flex-1 cursor-pointer text-left"
                          onClick={() => toggleCustomDeduction(d.id)}
                        >
                          <span className="deduction-chip-indicator" />
                          {d.name} (฿{d.amount.toLocaleString("en-US")})
                        </button>
                        <button
                          type="button"
                          className="p-1 rounded-full text-on-surface-variant hover:text-error transition-colors cursor-pointer flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeCustomDeduction(d.id);
                          }}
                          aria-label={`Remove ${d.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    {/* Add deduction button / form */}
                    {showAddForm ? (
                      <div className="w-full mt-1 space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-on-surface-variant mb-1 block form-label">
                              ชื่อรายการ
                            </label>
                            <input
                              type="text"
                              className="form-input !pl-3 !text-sm w-full"
                              placeholder="เช่น ประกันสังคม"
                              value={newDeductionName}
                              onChange={(e) =>
                                setNewDeductionName(e.target.value)
                              }
                              autoFocus
                            />
                          </div>
                          <div>
                            <label className="text-xs text-on-surface-variant mb-1 block form-label">
                              จำนวนเงิน (บาท)
                            </label>
                            <input
                              type="text"
                              inputMode="decimal"
                              className="form-input !pl-3 !text-sm w-full"
                              placeholder="0"
                              value={newDeductionAmount}
                              onChange={(e) =>
                                setNewDeductionAmount(
                                  formatAmountInput(e.target.value),
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="flex flex-row-reverse gap-2 pt-1">
                          <button
                            type="button"
                            className="btn-primary !py-2 !px-6 !text-sm !rounded-lg cursor-pointer"
                            onClick={handleAddDeduction}
                          >
                            เพิ่มรายการลดหย่อน
                          </button>
                          <button
                            type="button"
                            className="p-2 text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                            onClick={() => {
                              setShowAddForm(false);
                              setNewDeductionName("");
                              setNewDeductionAmount("");
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="deduction-chip !border-dashed !text-primary cursor-pointer"
                        onClick={() => setShowAddForm(true)}
                      >
                        <Plus className="w-4 h-4" />
                        เพิ่มรายการลดหย่อน
                      </button>
                    )}
                  </div>
                </div>
                {/* Calculate Button */}
                <button
                  id="calculate-btn"
                  className="btn-calculate cursor-pointer"
                  onClick={handleCalculate}
                >
                  <Calculator className="w-5 h-5" />
                  คำนวณภาษี
                </button>
              </div>
            </div>

            {/* ── Results Sidebar (right) ── */}
            {showResult && result && (
              <div className="lg:col-span-2 space-y-4 animate-fade-in">
                <TaxResultsPanel result={result} showResult={showResult} />
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}
