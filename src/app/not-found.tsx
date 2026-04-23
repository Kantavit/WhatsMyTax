import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-background text-on-background antialiased px-6">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-extrabold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold text-on-surface mb-3">
          ไม่พบหน้าที่คุณต้องการ
        </h2>
        <p className="text-outline mb-8">
          หน้าเว็บที่คุณกำลังมองหาอาจถูกย้ายหรือไม่มีอยู่แล้ว
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-3 rounded-full font-bold text-lg shadow-lg shadow-primary/20 transition-all hover:brightness-110 active:scale-95"
        >
          กลับหน้าหลัก
        </Link>
      </div>
    </div>
  );
}
