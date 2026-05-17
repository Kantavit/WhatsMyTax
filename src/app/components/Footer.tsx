import Link from "next/link";
import { Slash, UserRoundX } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full py-8 px-6 bg-surface-container border-t border-outline-variant mt-auto">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col items-center md:items-start gap-1">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-bold text-primary no-underline"
          >
            <Slash className="w-4 h-4" />
            WhatsMyTax
          </Link>
          <span className="text-xs text-on-surface-variant">
            © 2026 WhatsMyTax. Calculate Your tax made easy.
          </span>
        </div>
        <div className="flex flex-wrap justify-end gap-4 w-[60%]">
          {/* <span className="footer-link cursor-default">Privacy Policy</span>
          <span className="footer-link cursor-default">Terms of Service</span>
          <span className="footer-link cursor-default">Contact Support</span> */}
          <span className="badge-privacy">
            <UserRoundX className="w-4 h-4" />
            เว็บไซต์นี้ไม่เก็บข้อมูลส่วนบุคคล
          </span>
          <span className="footer-link cursor-default">
            หมายเหตุ : เว็บไซต์นี้ไม่สามารถใช้เป็นหลักฐานในการยื่นภาษีได้
            ข้อมูลนี้ใช้เพื่อเป็นแนวทางเท่านั้น
            กรุณาตรวจสอบข้อมูลล่าสุดจากกรมสรรพากร
          </span>
          {/* <a
            href="https://www.rd.go.th"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Revenue Department ↗
          </a> */}
        </div>
      </div>
    </footer>
  );
}
