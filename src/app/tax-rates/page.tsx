"use client";

import Link from "next/link";
import {
  TrendingUp,
  ArrowLeft,
  Lightbulb,
  CalendarCheck,
  Receipt,
  ShieldCheck,
  BadgePercent,
  ExternalLink,
} from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

/* ── Thailand 2025 Progressive Tax Brackets ── */
const TAX_BRACKETS = [
  { min: 0, max: 150_000, rate: 0 },
  { min: 150_001, max: 300_000, rate: 5 },
  { min: 300_001, max: 500_000, rate: 10 },
  { min: 500_001, max: 750_000, rate: 15 },
  { min: 750_001, max: 1_000_000, rate: 20 },
  { min: 1_000_001, max: 2_000_000, rate: 25 },
  { min: 2_000_001, max: 5_000_000, rate: 30 },
  { min: 5_000_001, max: Infinity, rate: 35 },
];

function fmtBaht(n: number): string {
  return `฿${n.toLocaleString("en-US")}`;
}

function maxTaxForBracket(bracket: (typeof TAX_BRACKETS)[number]): string {
  if (bracket.max === Infinity) return "—";
  const width = bracket.max - bracket.min + 1;
  const tax = width * (bracket.rate / 100);
  return fmtBaht(tax);
}

const TIPS = [
  {
    icon: CalendarCheck,
    title: "ยื่นภาษีตรงเวลา",
    text: "กำหนดยื่นภาษีเงินได้บุคคลธรรมดา (ภ.ง.ด.90/91) ภายในวันที่ 31 มีนาคม ของทุกปี หรือหากยื่นออนไลน์จะได้รับเวลาขยายถึง 8 เมษายน",
  },
  {
    icon: Receipt,
    title: "เก็บหลักฐานค่าลดหย่อน",
    text: "รวบรวมใบเสร็จรับเงิน หนังสือรับรองจากนายจ้าง และเอกสารค่าลดหย่อนต่าง ๆ ไว้ล่วงหน้า เพื่อใช้ประกอบการยื่นภาษี",
  },
  {
    icon: ShieldCheck,
    title: "ใช้สิทธิลดหย่อนให้ครบ",
    text: "อย่าลืมใช้สิทธิลดหย่อนส่วนตัว (60,000 บาท), ค่าใช้จ่ายแบบเหมา (สูงสุด 100,000 บาท), ประกันสังคม, กองทุน SSF/RMF และอื่น ๆ",
  },
  {
    icon: BadgePercent,
    title: "วางแผนภาษีล่วงหน้า",
    text: "การลงทุนในกองทุน SSF, RMF, ประกันชีวิต หรือเงินบริจาค สามารถช่วยลดภาระภาษีได้อย่างมาก ควรวางแผนตั้งแต่ต้นปี",
  },
];

export default function TaxRatesPage() {
  const { isDarkMode, toggleDarkMode, mounted } = useDarkMode();

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
        {/* Hero */}
        <section className="pt-16 pb-8 px-4 md:px-8 max-w-5xl mx-auto animate-fade-in">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors mb-6 no-underline"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับสู่หน้าคำนวณ
          </Link>

          <div className="flex items-center gap-3 mb-3">
            <div
              className="p-2.5 rounded-xl flex-shrink-0"
              style={{
                background:
                  "color-mix(in srgb, var(--color-primary), transparent 88%)",
              }}
            >
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-on-surface">
              อัตราภาษีเงินได้บุคคลธรรมดา{" "}
              <span className="text-primary">2568</span>
            </h1>
          </div>
          <p className="text-on-surface-variant text-base max-w-2xl leading-relaxed">
            ระบบภาษีเงินได้ของประเทศไทยใช้อัตราก้าวหน้า (Progressive Tax)
            โดยแบ่งเงินได้สุทธิเป็นขั้นบันได
            แต่ละขั้นจะถูกเก็บภาษีในอัตราที่แตกต่างกัน
          </p>
        </section>

        {/* ── Tax Brackets Table ── */}
        <section className="pb-12 px-4 md:px-8 max-w-5xl mx-auto">
          <div className="calc-card animate-fade-in" style={{ animationDelay: "0.1s" }}>
            {/* Desktop table */}
            <div className="hidden md:block">
              <table
                className="w-full text-sm"
                id="tax-brackets-table"
                style={{ borderCollapse: "collapse" }}
              >
                <thead>
                  <tr
                    style={{
                      background: "var(--color-surface-container-high)",
                    }}
                  >
                    <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-on-surface-variant border-b border-outline-variant">
                      ขั้นที่
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-on-surface-variant border-b border-outline-variant">
                      เงินได้สุทธิ (บาท)
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-on-surface-variant border-b border-outline-variant">
                      อัตราภาษี
                    </th>
                    <th className="px-5 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-on-surface-variant border-b border-outline-variant">
                      ภาษีสูงสุดในขั้น
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {TAX_BRACKETS.map((bracket, i) => {
                    const isExempt = bracket.rate === 0;
                    const isLast = i === TAX_BRACKETS.length - 1;
                    return (
                      <tr
                        key={i}
                        className="transition-colors duration-150"
                        style={{
                          cursor: "default",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLTableRowElement).style.background =
                            "color-mix(in srgb, var(--color-primary), transparent 94%)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLTableRowElement).style.background =
                            "";
                        }}
                      >
                        <td
                          className={`px-5 py-3.5 text-center font-semibold text-on-surface-variant ${isLast ? "" : "border-b border-outline-variant"}`}
                        >
                          {i + 1}
                        </td>
                        <td
                          className={`px-5 py-3.5 ${isExempt ? "text-on-surface-variant" : "text-on-surface"} ${isLast ? "" : "border-b border-outline-variant"}`}
                        >
                          {bracket.max === Infinity
                            ? `${fmtBaht(bracket.min)} ขึ้นไป`
                            : `${fmtBaht(bracket.min)} – ${fmtBaht(bracket.max)}`}
                        </td>
                        <td
                          className={`px-5 py-3.5 ${isLast ? "" : "border-b border-outline-variant"}`}
                        >
                          <span
                            className="inline-flex items-center justify-center px-3 py-0.5 rounded-full text-sm font-bold"
                            style={
                              isExempt
                                ? {
                                    background:
                                      "color-mix(in srgb, var(--color-on-surface-variant), transparent 88%)",
                                    color: "var(--color-on-surface-variant)",
                                  }
                                : {
                                    background:
                                      "color-mix(in srgb, var(--color-primary), transparent 85%)",
                                    color: "var(--color-primary)",
                                  }
                            }
                          >
                            {isExempt ? "ยกเว้น" : `${bracket.rate}%`}
                          </span>
                        </td>
                        <td
                          className={`px-5 py-3.5 text-right font-mono ${isExempt ? "text-on-surface-variant" : "text-on-surface"} ${isLast ? "" : "border-b border-outline-variant"}`}
                        >
                          {isExempt ? "—" : maxTaxForBracket(bracket)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden p-4 space-y-3">
              {TAX_BRACKETS.map((bracket, i) => {
                const isExempt = bracket.rate === 0;
                return (
                  <div
                    key={i}
                    className="rounded-xl border border-outline-variant p-4 transition-colors duration-150"
                    style={{
                      background: "var(--color-surface-container-low)",
                      opacity: isExempt ? 0.7 : 1,
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                        ขั้นที่ {i + 1}
                      </span>
                      <span
                        className="inline-flex items-center justify-center px-3 py-0.5 rounded-full text-xs font-bold"
                        style={
                          isExempt
                            ? {
                                background:
                                  "color-mix(in srgb, var(--color-on-surface-variant), transparent 88%)",
                                color: "var(--color-on-surface-variant)",
                              }
                            : {
                                background:
                                  "color-mix(in srgb, var(--color-primary), transparent 85%)",
                                color: "var(--color-primary)",
                              }
                        }
                      >
                        {isExempt ? "ยกเว้น" : `${bracket.rate}%`}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-on-surface mb-1">
                      {bracket.max === Infinity
                        ? `${fmtBaht(bracket.min)} ขึ้นไป`
                        : `${fmtBaht(bracket.min)} – ${fmtBaht(bracket.max)}`}
                    </p>
                    {!isExempt && (
                      <p className="text-xs text-on-surface-variant">
                        ภาษีสูงสุดในขั้น:{" "}
                        <span className="font-mono font-medium text-on-surface">
                          {maxTaxForBracket(bracket)}
                        </span>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Source reference */}
          <p className="text-xs text-on-surface-variant mt-4 flex items-center gap-1">
            อ้างอิง:{" "}
            <a
              href="https://www.rd.go.th/59670.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-0.5"
            >
              กรมสรรพากร <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </section>

        {/* ── Tips Section ── */}
        <section
          className="pb-16 px-4 md:px-8 max-w-5xl mx-auto animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-on-surface">
              เกร็ดความรู้เรื่องภาษี
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TIPS.map((tip, i) => (
              <div key={i} className="tip-card group">
                <div className="flex items-start gap-3">
                  <div
                    className="p-2 rounded-lg flex-shrink-0 transition-colors"
                    style={{
                      background:
                        "color-mix(in srgb, var(--color-primary), transparent 88%)",
                    }}
                  >
                    <tip.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-tip-card-text mb-1">
                      {tip.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-on-surface-variant">
                      {tip.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <Link href="/" className="btn-primary no-underline">
              <ArrowLeft className="w-4 h-4" />
              กลับไปคำนวณภาษี
            </Link>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}
