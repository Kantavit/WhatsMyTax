import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "WhatsMyTax — คำนวณภาษีเงินได้บุคคลธรรมดา",
    template: "%s | WhatsMyTax",
  },
  description:
    "คำนวณภาษีเงินได้บุคคลธรรมดาออนไลน์ ฟรี ใช้งานง่าย พร้อมอัตราภาษีขั้นบันได ค่าลดหย่อน และเงินหัก ณ ที่จ่าย",
  keywords: [
    "คำนวณภาษี",
    "ภาษีเงินได้บุคคลธรรมดา",
    "คำนวณภาษีออนไลน์",
    "อัตราภาษีขั้นบันได",
    "ค่าลดหย่อนภาษี",
    "หัก ณ ที่จ่าย",
    "Thai tax calculator",
    "Thailand income tax",
  ],
  authors: [{ name: "WhatsMyTax" }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: "WhatsMyTax",
    title: "WhatsMyTax — คำนวณภาษีเงินได้บุคคลธรรมดา",
    description:
      "คำนวณภาษีเงินได้บุคคลธรรมดาออนไลน์ ฟรี ใช้งานง่าย พร้อมอัตราภาษีขั้นบันได ค่าลดหย่อน และเงินหัก ณ ที่จ่าย",
    url: "https://whatsmytax.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "WhatsMyTax — คำนวณภาษีเงินได้บุคคลธรรมดา",
    description:
      "คำนวณภาษีเงินได้บุคคลธรรมดาออนไลน์ ฟรี ใช้งานง่าย พร้อมอัตราภาษีขั้นบันได ค่าลดหย่อน และเงินหัก ณ ที่จ่าย",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
