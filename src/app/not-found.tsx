import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col bg-background text-on-background antialiased">
      <div className="placeholder-page flex-grow">
        <AlertTriangle className="w-16 h-16 text-primary opacity-30" />
        <h1>404 — Page Not Found</h1>
        <p>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="btn-primary mt-4 no-underline">
          <ArrowLeft className="w-4 h-4" /> Back to Calculator
        </Link>
      </div>
    </div>
  );
}
