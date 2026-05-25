import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "อัตราภาษีเงินได้บุคคลธรรมดา 2568 | WhatsMyTax",
  description:
    "อัตราภาษีเงินได้บุคคลธรรมดาแบบขั้นบันไดของประเทศไทย ปี 2568 พร้อมเกร็ดความรู้เรื่องภาษี",
};

export default function TaxRatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
