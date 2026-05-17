import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Guide",
  description: "Thai income tax filing guide and tips.",
};

export default function GuidePage() {
  return (
    <div className="min-h-dvh flex flex-col bg-background text-on-background antialiased">
      <div className="placeholder-page flex-grow">
        <BookOpen className="w-16 h-16 text-primary opacity-30" />
        <h1>Guide</h1>
        <p>
          A step-by-step guide to understanding and filing your Thai income tax
          will be available here soon.
        </p>
        <Link href="/" className="btn-primary mt-4 no-underline">
          <ArrowLeft className="w-4 h-4" /> Back to Calculator
        </Link>
      </div>
    </div>
  );
}
