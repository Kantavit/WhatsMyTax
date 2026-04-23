import type { Metadata } from "next";
import { TaxCalculator } from "./components/TaxCalculator";

export const metadata: Metadata = {
  title: "คำนวณภาษีเงินได้บุคคลธรรมดา",
  description:
    "กรอกรายได้และค่าลดหย่อน เพื่อคำนวณภาษีเงินได้บุคคลธรรมดาในประเทศไทย ปี 2568 พร้อมอัตราภาษีแบบขั้นบันได",
};

export default function Home() {
  return <TaxCalculator />;
}
