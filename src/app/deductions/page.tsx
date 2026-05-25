"use client";

import Link from "next/link";
import {
  ArrowLeft,
  User,
  Users,
  Shield,
  TrendingUp,
  Heart,
  Building2,
  Home,
  Landmark,
  Info,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { useDarkMode } from "../hooks/useDarkMode";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

/* ── Data ── */
interface DeductionItem {
  label: string;
  amount: string;
  note?: string;
}

interface DeductionCategory {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  color: string;
  items: DeductionItem[];
}

const CATEGORIES: DeductionCategory[] = [
  {
    id: "personal",
    icon: User,
    title: "ค่าลดหย่อนส่วนตัวและครอบครัว",
    subtitle: "สิทธิพื้นฐานที่ทุกคนได้รับ",
    color: "#34d399",
    items: [
      { label: "ค่าลดหย่อนส่วนตัว", amount: "60,000 บาท" },
      { label: "คู่สมรสที่ไม่มีรายได้", amount: "60,000 บาท" },
      {
        label: "บุตร (คนละ)",
        amount: "30,000 บาท",
        note: "บุตรชอบด้วยกฎหมาย อายุไม่เกิน 20 ปี หรือไม่เกิน 25 ปีหากกำลังศึกษา",
      },
      {
        label: "บุตรคนที่ 2 เป็นต้นไป (เกิดตั้งแต่ปี 2561)",
        amount: "60,000 บาท/คน",
        note: "เฉพาะบุตรที่เกิดในหรือหลังปี 2561",
      },
      {
        label: "ฝากครรภ์และคลอดบุตร",
        amount: "ตามจริง สูงสุด 60,000 บาท/ท้อง",
      },
      {
        label: "ค่าเลี้ยงดูบิดามารดาของตนเองและคู่สมรส (คนละ)",
        amount: "30,000 บาท",
        note: "บิดามารดาต้องมีอายุ 60 ปีขึ้นไป และมีรายได้ไม่เกิน 30,000 บาท/ปี",
      },
      {
        label: "ค่าอุปการะผู้พิการหรือทุพพลภาพ (คนละ)",
        amount: "60,000 บาท",
        note: "ต้องมีบัตรประจำตัวผู้พิการและมีรายได้ไม่เกิน 30,000 บาท/ปี",
      },
    ],
  },
  {
    id: "insurance",
    icon: Shield,
    title: "ประกันและกองทุนเพื่อการเกษียณ",
    subtitle: "วางแผนอนาคตพร้อมลดหย่อนภาษี",
    color: "#60a5fa",
    items: [
      {
        label: "เบี้ยประกันชีวิต",
        amount: "ตามจริง สูงสุด 100,000 บาท",
        note: "กรมธรรม์คุ้มครองไม่น้อยกว่า 10 ปี",
      },
      {
        label: "เบี้ยประกันชีวิตแบบบำนาญ",
        amount: "15% ของรายได้ สูงสุด 200,000 บาท",
        note: "เมื่อรวมกับ RMF, กบข., กองทุนสำรองเลี้ยงชีพ ต้องไม่เกิน 500,000 บาท",
      },
      {
        label: "เบี้ยประกันสุขภาพตนเอง",
        amount: "ตามจริง สูงสุด 25,000 บาท",
        note: "เมื่อรวมกับเบี้ยประกันชีวิตต้องไม่เกิน 100,000 บาท",
      },
      {
        label: "เบี้ยประกันสุขภาพบิดามารดา",
        amount: "ตามจริง สูงสุด 15,000 บาท",
        note: "บิดามารดาต้องไม่มีรายได้หรือมีรายได้ไม่เกิน 30,000 บาท/ปี",
      },
      {
        label: "กองทุนรวมเพื่อการออม (SSF)",
        amount: "30% ของรายได้ สูงสุด 200,000 บาท",
        note: "ถือหน่วยลงทุนอย่างน้อย 10 ปี",
      },
      {
        label: "กองทุนรวมเพื่อการเลี้ยงชีพ (RMF)",
        amount: "30% ของรายได้ สูงสุด 500,000 บาท",
        note: "เมื่อรวมกับกองทุนเกษียณอื่น ๆ ต้องไม่เกิน 500,000 บาท",
      },
      {
        label: "กองทุนสำรองเลี้ยงชีพ (PVF)",
        amount: "ตามจริง สูงสุด 500,000 บาท",
        note: "เมื่อรวมกับกองทุนเกษียณอื่น ๆ ต้องไม่เกิน 500,000 บาท",
      },
      {
        label: "กองทุนบำเหน็จบำนาญข้าราชการ (กบข.)",
        amount: "ตามจริง สูงสุด 500,000 บาท",
        note: "เมื่อรวมกับกองทุนเกษียณอื่น ๆ ต้องไม่เกิน 500,000 บาท",
      },
      {
        label: "กองทุนการออมแห่งชาติ (กอช.)",
        amount: "ตามจริง สูงสุด 30,000 บาท",
        note: "เมื่อรวมกับกองทุนเกษียณอื่น ๆ ต้องไม่เกิน 500,000 บาท",
      },
      {
        label: "กองทุนประกันสังคม",
        amount: "ตามจริง (สูงสุด ~9,000 บาท/ปี)",
        note: "ส่วนของลูกจ้าง 5% ของค่าจ้าง สูงสุดเดือนละ 750 บาท",
      },
    ],
  },
  {
    id: "investment",
    icon: TrendingUp,
    title: "การลงทุนและกระตุ้นเศรษฐกิจ",
    subtitle: "มาตรการพิเศษจากภาครัฐ",
    color: "#f59e0b",
    items: [
      {
        label: "กองทุนรวมไทยเพื่อความยั่งยืน (TESG)",
        amount: "30% ของรายได้ สูงสุด 300,000 บาท",
        note: "ถือหน่วยลงทุนอย่างน้อย 8 ปี (นับตั้งแต่วันที่ซื้อ)",
      },
      {
        label: "หุ้นกู้เพื่ออนุรักษ์สิ่งแวดล้อม (Green Bond)",
        amount: "ตามจริง สูงสุด 100,000 บาท",
        note: "ตามเงื่อนไขที่กรมสรรพากรกำหนด",
      },
      {
        label: "ดอกเบี้ยเงินกู้ซื้อ/สร้างที่อยู่อาศัย",
        amount: "ตามจริง สูงสุด 100,000 บาท",
        note: "ดอกเบี้ยเงินกู้เพื่อซื้อหรือสร้างที่อยู่อาศัย",
      },
    ],
  },
  {
    id: "social",
    icon: Heart,
    title: "การบริจาค",
    subtitle: "ช่วยเหลือสังคมพร้อมลดหย่อนภาษี",
    color: "#f87171",
    items: [
      {
        label: "บริจาคเพื่อการศึกษา กีฬา สาธารณสุข",
        amount: "2 เท่าของที่บริจาคจริง สูงสุด 10% ของรายได้สุทธิ",
        note: "บริจาคผ่านระบบ e-Donation ของกรมสรรพากร",
      },
      {
        label: "บริจาคพรรคการเมือง",
        amount: "ตามจริง สูงสุด 10,000 บาท",
      },
      {
        label: "บริจาคทั่วไป (วัด มูลนิธิ ฯลฯ)",
        amount: "ตามจริง สูงสุด 10% ของรายได้สุทธิ",
        note: "องค์กรต้องได้รับการรับรองจากกรมสรรพากร",
      },
    ],
  },
  {
    id: "property",
    icon: Home,
    title: "ค่าใช้จ่ายและอสังหาริมทรัพย์",
    subtitle: "สิทธิลดหย่อนด้านที่อยู่อาศัย",
    color: "#a78bfa",
    items: [
      {
        label: "ค่าเช่าบ้าน",
        amount: "20% ของค่าเช่าที่จ่ายจริง สูงสุด 120,000 บาท/ปี",
        note: "ต้องมีสัญญาเช่าและไม่มีกรรมสิทธิ์ในที่อยู่อาศัยในจังหวัดที่ทำงาน",
      },
      {
        label: "ซื้อบ้านหลังแรก (อาคารชุด/บ้านใหม่)",
        amount: "สูงสุด 200,000 บาท",
        note: "ราคาซื้อไม่เกิน 3,000,000 บาท ลดหย่อนได้ 0.5% ของราคาซื้อต่อปี เป็นเวลา 2 ปี ใช้ในปีที่โอนกรรมสิทธิ์",
      },
    ],
  },
  {
    id: "government",
    icon: Landmark,
    title: "มาตรการรัฐและพิเศษ",
    subtitle: "โครงการกระตุ้นเศรษฐกิจ",
    color: "#34d399",
    items: [
      {
        label: "Easy E-Receipt 2568",
        amount: "สูงสุด 50,000 บาท",
        note: "ซื้อสินค้าและบริการจากผู้ประกอบการ VAT ที่ออก e-Tax Invoice หรือ e-Receipt ระหว่าง 16 ม.ค. – 28 ก.พ. 2568",
      },
      {
        label: "ท่องเที่ยวในประเทศ",
        amount: "ตามจริง สูงสุด 15,000 บาท",
        note: "ค่าบริการนำเที่ยวหรือค่าที่พักในชุมชนท่องเที่ยวที่ได้รับการรับรอง (ตรวจสอบเงื่อนไขปัจจุบัน)",
      },
    ],
  },
  {
    id: "expense",
    icon: Building2,
    title: "ค่าใช้จ่าย (หักแบบเหมา)",
    subtitle: "หักค่าใช้จ่ายตามประเภทเงินได้",
    color: "#fb923c",
    items: [
      {
        label: "เงินเดือน ค่าจ้าง (มาตรา 40(1)(2))",
        amount: "50% สูงสุด 100,000 บาท",
        note: "หักก่อนคำนวณเงินได้สุทธิ",
      },
      {
        label: "ค่าแห่งกู๊ดวิลล์ ลิขสิทธิ์ (มาตรา 40(3))",
        amount: "50% สูงสุด 100,000 บาท",
      },
      {
        label: "รายได้จากทรัพย์สิน (มาตรา 40(5))",
        amount: "10–30% ขึ้นอยู่กับประเภท",
        note: "ค่าเช่า: 10–30% / ค่าเช่าบ้าน: 30%",
      },
      {
        label: "รายได้จากวิชาชีพอิสระ (มาตรา 40(6))",
        amount: "45–60% ขึ้นอยู่กับสาขา",
        note: "กฎหมาย/วิศวกรรม/สถาปัตยกรรม: 30% / แพทย์: 60%",
      },
      {
        label: "รายได้รับเหมาและธุรกิจ (มาตรา 40(7)(8))",
        amount: "60–85% ขึ้นอยู่กับประเภท",
        note: "หรือหักตามจริง หากสูงกว่า",
      },
    ],
  },
];

function CategoryCard({ cat }: { cat: DeductionCategory }) {
  const [open, setOpen] = useState(true);
  const Icon = cat.icon;

  return (
    <div className="calc-card animate-fade-in" id={`cat-${cat.id}`}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="calc-card-header w-full text-left cursor-pointer"
        style={{ background: "none", border: "none" }}
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <div
            className="p-2.5 rounded-xl flex-shrink-0"
            style={{
              background: `color-mix(in srgb, ${cat.color}, transparent 85%)`,
            }}
          >
            <Icon
              className="w-5 h-5"
              style={{ color: cat.color }}
            />
          </div>
          <div>
            <h2 className="text-base font-bold text-on-surface leading-tight">
              {cat.title}
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {cat.subtitle}
            </p>
          </div>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-on-surface-variant flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-on-surface-variant flex-shrink-0" />
        )}
      </button>

      {open && (
        <div className="divide-y" style={{ borderColor: "var(--color-outline-variant)" }}>
          {cat.items.map((item, i) => (
            <div key={i} className="px-5 py-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1.5">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-on-surface">{item.label}</p>
                {item.note && (
                  <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed flex gap-1 items-start">
                    <Info className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: cat.color }} />
                    {item.note}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0 sm:text-right">
                <span
                  className="inline-block text-sm font-bold px-2.5 py-0.5 rounded-lg"
                  style={{
                    background: `color-mix(in srgb, ${cat.color}, transparent 88%)`,
                    color: cat.color,
                  }}
                >
                  {item.amount}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DeductionsPage() {
  const { isDarkMode, toggleDarkMode, mounted } = useDarkMode();

  return (
    <div className="min-h-dvh flex flex-col bg-background text-on-background antialiased">
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} mounted={mounted} />

      <main className="flex-grow">
        {/* Hero */}
        <section className="pt-16 pb-8 px-4 md:px-8 max-w-5xl mx-auto animate-fade-in">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors mb-6 no-underline"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับสู่หน้าคำนวณ
          </Link>

          <div className="flex items-center gap-3 mb-3">
            <div
              className="p-2.5 rounded-xl flex-shrink-0"
              style={{ background: "color-mix(in srgb, var(--color-primary), transparent 88%)" }}
            >
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-on-surface">
              ค่าลดหย่อนภาษี{" "}
              <span className="text-primary">2568</span>
            </h1>
          </div>
          <p className="text-on-surface-variant text-base max-w-2xl leading-relaxed">
            รวมรายการค่าลดหย่อนภาษีเงินได้บุคคลธรรมดาสำหรับปีภาษี 2568 (ยื่นแบบปี 2569)
            ครบทุกหมวดหมู่ ช่วยให้คุณวางแผนภาษีได้อย่างถูกต้องและครบถ้วน
          </p>

          {/* Summary chips */}
          <div className="flex flex-wrap gap-2 mt-5">
            {CATEGORIES.map((cat) => (
              <a
                key={cat.id}
                href={`#cat-${cat.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold no-underline transition-all hover:scale-105"
                style={{
                  background: `color-mix(in srgb, ${cat.color}, transparent 88%)`,
                  color: cat.color,
                  border: `1px solid color-mix(in srgb, ${cat.color}, transparent 70%)`,
                }}
              >
                <cat.icon className="w-3.5 h-3.5" />
                {cat.title.split("และ")[0].split("(")[0].trim()}
              </a>
            ))}
          </div>
        </section>

        {/* Deduction cards */}
        <section className="pb-12 px-4 md:px-8 max-w-5xl mx-auto space-y-4">
          {CATEGORIES.map((cat, i) => (
            <div key={cat.id} style={{ animationDelay: `${i * 0.06}s` }}>
              <CategoryCard cat={cat} />
            </div>
          ))}

          {/* Source */}
          <p className="text-xs text-on-surface-variant mt-2 flex items-center gap-1">
            อ้างอิง:{" "}
            <a
              href="https://www.rd.go.th"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-0.5"
            >
              กรมสรรพากร <ExternalLink className="w-3 h-3" />
            </a>
            · ข้อมูล ณ ปีภาษี 2568 ควรตรวจสอบกับกรมสรรพากรก่อนยื่นแบบ
          </p>
        </section>

        {/* Tips */}
        <section
          className="pb-16 px-4 md:px-8 max-w-5xl mx-auto animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="tip-card">
            <div className="flex items-start gap-3">
              <div
                className="p-2 rounded-lg flex-shrink-0"
                style={{ background: "color-mix(in srgb, var(--color-primary), transparent 85%)" }}
              >
                <Info className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-tip-card-text mb-2">
                  เพดานรวมกองทุนเพื่อการเกษียณ
                </h2>
                <p className="text-xs leading-relaxed text-on-surface-variant">
                  เงินสะสม RMF + กองทุนสำรองเลี้ยงชีพ + กบข. + กอช. + เบี้ยประกันชีวิตแบบบำนาญ
                  รวมกันต้องไม่เกิน <strong className="text-primary">500,000 บาท</strong> ต่อปี
                </p>
                <p className="text-xs leading-relaxed text-on-surface-variant mt-1.5">
                  เบี้ยประกันชีวิตทั่วไป + เบี้ยประกันสุขภาพ รวมกันต้องไม่เกิน{" "}
                  <strong className="text-primary">100,000 บาท</strong> ต่อปี
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="btn-primary no-underline">
              <ArrowLeft className="w-4 h-4" />
              กลับไปคำนวณภาษี
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
