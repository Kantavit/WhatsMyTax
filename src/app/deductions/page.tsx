import type { Metadata } from "next";
import Link from "next/link";
import { PiggyBank, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Deductions",
  description: "Thailand tax deductions and allowances guide.",
};

export default function DeductionsPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-background text-on-background antialiased">
      <div className="placeholder-page flex-grow">
        <PiggyBank className="w-16 h-16 text-primary opacity-30" />
        <h1>Deductions</h1>
        <p>
          A comprehensive guide to Thai tax deductions and allowances
          will be available here soon.
        </p>
        <Link href="/" className="btn-primary mt-4 no-underline">
          <ArrowLeft className="w-4 h-4" /> Back to Calculator
        </Link>
      </div>
    </div>
  );
}
