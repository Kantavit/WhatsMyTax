"use client";

import { Lightbulb } from "lucide-react";

export function HelpCard() {
  return (
    <div className="bg-help-card-bg rounded-xl p-8 md:p-9 relative overflow-hidden group shadow-lg shadow-help-card-bg/20 border border-black/5 dark:border-white/5">
      <div className="relative z-10">
        <h4 className="text-help-card-text text-[24px] font-bold mb-3 ">
          ความรู้เรื่องภาษี
        </h4>
        <p className="text-help-card-text/80 text-[16px] mb-8 leading-relaxed max-w-[360px]">
          การที่รู้ว่าเรามี &quot;รายได้&quot; ประเภทไหน หัก
          &quot;ค่าใช้จ่ายและค่าลดหย่อน&quot; ได้เท่าไหร่ เพื่อคำนวณ
          &quot;เงินได้สุทธิ&quot; มาคิดภาษีตามอัตราขั้นบันได รวมถึง
          &quot;หน้าที่ในการยื่นแบบ&quot; ให้ถูกต้องตามกำหนดเวลานั้น
          เพื่อสิทธิประโยชน์ในการลดหย่อนและการขอคืนภาษีที่จ่ายเกินกับสรรพากร
        </p>
        <button
          onClick={() =>
            window.open("https://www.rd.go.th/62337.html", "_blank")
          }
          className="cursor-pointer bg-help-card-btn-bg text-help-card-btn-text px-8 py-3.5 rounded-2xl text-[16px] font-bold shadow-md transition-all hover:scale-[1.02] hover:brightness-110 active:scale-95"
        >
          ศึกษาเพิ่มเติม
        </button>
      </div>
      <div className="absolute -bottom-12 -right-12 w-48 h-48 text-help-card-icon -rotate-12 group-hover:scale-110 transition-transform duration-1000 ease-out">
        <Lightbulb className="w-full h-full" />
      </div>
    </div>
  );
}
