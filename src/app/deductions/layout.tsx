import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ค่าลดหย่อนภาษีบุคคลธรรมดา 2568 | WhatsMyTax",
  description:
    "รวมรายการค่าลดหย่อนภาษีเงินได้บุคคลธรรมดาของประเทศไทย ปี 2568 ครบทุกหมวด ทั้งค่าลดหย่อนส่วนตัว ครอบครัว ประกัน การลงทุน และการบริจาค",
};

export default function DeductionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
