"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-dvh flex flex-col bg-background text-on-background antialiased">
      <div className="placeholder-page flex-grow">
        <AlertTriangle className="w-16 h-16 text-error opacity-50" />
        <h1 className="text-2xl font-bold mt-4">เกิดข้อผิดพลาด</h1>
        <p className="text-on-surface-variant mt-2 text-center max-w-md">
          ขออภัย เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง
        </p>
        <button onClick={reset} className="btn-primary mt-6 cursor-pointer">
          <RotateCcw className="w-4 h-4" /> ลองใหม่อีกครั้ง
        </button>
      </div>
    </div>
  );
}
