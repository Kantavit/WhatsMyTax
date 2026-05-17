import type { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Tax Rates",
  description: "Thailand 2025 progressive tax rate brackets.",
};

export default function TaxRatesPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-background text-on-background antialiased">
      <div className="placeholder-page flex-grow">
        <TrendingUp className="w-16 h-16 text-primary opacity-30" />
        <h1>Tax Rates</h1>
        <p>
          Thailand 2025 progressive tax rate brackets and detailed information
          will be available here soon.
        </p>
        <Link href="/" className="btn-primary mt-4 no-underline">
          <ArrowLeft className="w-4 h-4" /> Back to Calculator
        </Link>
      </div>
    </div>
  );
}
