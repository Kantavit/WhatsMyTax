export function Footer() {
  return (
    <footer className="w-full py-8 px-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-container border-t border-outline-variant mt-auto">
      {/* <div className="text-lg font-bold text-on-surface">
        What&apos;s My Tax
      </div> */}
      <div className="flex flex-wrap justify-center gap-6">
        <span className="text-sm font-body text-on-surface-variant">
          อ้างอิงอัตราภาษีเงินได้บุคคลธรรมดาในประเทศไทย ปี 2568 ·
          เป็นการคำนวณภาษีเบื้องต้นเท่านั้น
          ควรศึกษาข้อมูลเพิ่มเติมเพื่อความถูกต้อง
        </span>
      </div>
      <div className="text-sm font-body text-outline">
        © 2026 What&apos;s My Tax. All rights reserved.
      </div>
    </footer>
  );
}
