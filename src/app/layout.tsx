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
    default: "What's My Tax — Thailand Income Tax Calculator",
    template: "%s | What's My Tax",
  },
  description:
    "Calculate your Thai individual income tax easily. Free online tax calculator for Thailand with 2025 progressive tax brackets, deductions, and allowances.",
  keywords: [
    "Thai tax calculator",
    "Thailand income tax",
    "personal income tax Thailand",
    "PIT Thailand",
    "tax brackets Thailand 2025",
    "คำนวณภาษี",
    "ภาษีเงินได้บุคคลธรรมดา",
  ],
  authors: [{ name: "What's My Tax" }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "What's My Tax",
    title: "What's My Tax — Thailand Income Tax Calculator",
    description:
      "Free online calculator for Thai individual income tax. Instantly compute your tax liability with 2025 progressive brackets.",
    url: "https://whatsmytax.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "What's My Tax — Thailand Income Tax Calculator",
    description:
      "Free online calculator for Thai individual income tax. Instantly compute your tax liability with 2025 progressive brackets.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
