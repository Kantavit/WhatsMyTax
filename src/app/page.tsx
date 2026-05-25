import type { Metadata } from "next";
import { TaxCalculator } from "./components/TaxCalculator";

export const metadata: Metadata = {
  title: "คำนวณภาษีเงินได้ — WhatsMyTax",
  description:
    "คำนวณภาษีเงินได้บุคคลธรรมดาออนไลน์ ฟรี ใช้งานง่าย พร้อมอัตราภาษีขั้นบันได ค่าลดหย่อน และเงินหัก ณ ที่จ่าย",
};

export default function Home() {
  return <TaxCalculator />;
}
