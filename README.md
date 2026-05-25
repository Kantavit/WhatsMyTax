# WhatsMyTax - เครื่องมือคำนวณภาษีเงินได้บุคคลธรรมดา (Thailand Personal Income Tax Calculator)

**WhatsMyTax** เป็นเว็บแอปพลิเคชันที่พัฒนาด้วย **Next.js**, **TypeScript** และ **Tailwind CSS** ออกแบบมาเพื่อให้ผู้เสียภาษีในประเทศไทยสามารถคำนวณภาษีเงินได้บุคคลธรรมดาได้อย่างรวดเร็ว ถูกต้อง และใช้งานง่าย โดยอ้างอิงอัตราภาษีเงินได้บุคคลธรรมดาแบบขั้นบันไดของประเทศไทย (อัตราภาษีปีล่าสุด)

---

## 🌟 ฟีเจอร์หลัก (Key Features)

- **การคำนวณภาษีแบบขั้นบันได (Progressive Tax Rates)**: คำนวณเงินได้สุทธิตามอัตราก้าวหน้าปีล่าสุด (ตั้งแต่ 0% ถึง 35%) พร้อมแสดงรายละเอียดข้อมูลภาษีแต่ละขั้นอย่างชัดเจน
- **จัดการรายได้ได้หลากหลายช่องทาง (Multiple Income Items)**: สามารถเพิ่ม/ลดรายการรายได้ ระบุจำนวนเงิน และภาษีหัก ณ ที่จ่ายแยกในแต่ละรายการ รวมถึงเลือกเปิด-ปิด (Toggle) การคำนวณบางรายการได้
- **ปรับแต่งค่าลดหย่อนภาษี (Customizable Deductions)**: รองรับการกรอกข้อมูลและเลือกเปิด-ปิดรายการค่าลดหย่อนต่าง ๆ เพื่อดูยอดภาษีเปรียบเทียบได้ทันที
- **สรุปผลลัพธ์ที่ละเอียดและเข้าใจง่าย (Detailed Tax Breakdown)**: แสดงอัตราภาษีที่แท้จริง (Effective Tax Rate), ยอดภาษีที่ต้องชำระเพิ่มเติม หรือยอดเงินภาษีที่จะได้รับคืน (Refund)
- **การออกแบบที่ทันสมัยและตอบสนองได้ดี (Premium & Responsive UI)**: ทำงานได้อย่างราบรื่นและสวยงามบนทุกอุปกรณ์ ไม่ว่าจะเป็นมือถือ แท็บเล็ต หรือเดสก์ท็อป

---

## 🛠️ เทคโนโลยีที่เลือกใช้ (Tech Stack)

- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Hosting / Deploy**: [Github Pages](https://docs.github.com/en/pages)

---

## 🚀 วิธีการติดตั้งและรันในเครื่อง (Local Installation)

ทำตามขั้นตอนด้านล่างนี้เพื่อรันโปรเจกต์นี้ในเครื่องคอมพิวเตอร์ของคุณ:

### 1. โคลน Repository

ใช้ Git ในการโคลนโปรเจกต์นี้ลงบนเครื่องของคุณ:

```bash
git clone https://github.com/[username]/WhatsMyTax.git
cd WhatsMyTax
```

_(หมายเหตุ: โปรดเปลี่ยน `[username]` ให้เป็นชื่อบัญชี GitHub ของคุณ)_

### 2. ติดตั้ง Dependencies

ติดตั้งแพ็กเกจต่าง ๆ ที่จำเป็นสำหรับโปรเจกต์ โดยรันคำสั่งใดคำสั่งหนึ่งด้านล่างนี้ตาม Package Manager ที่คุณใช้งาน:

```bash
npm install
# หรือ
yarn install
# หรือ
pnpm install
# หรือ
bun install
```

### 3. รัน Development Server

เปิดใช้งานเซิร์ฟเวอร์สำหรับทดสอบโค้ดด้วยคำสั่ง:

```bash
npm run dev
# หรือ
yarn dev
# หรือ
pnpm dev
# หรือ
bun dev
```

### 4. เข้าใช้งานแอปพลิเคชัน

เมื่อรันเซิร์ฟเวอร์เสร็จเรียบร้อย ให้เปิดเว็บเบราว์เซอร์แล้วเข้าไปที่:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 📂 โครงสร้างโฟลเดอร์ที่สำคัญ (Project Structure)

```text
src/
├── app/
│   ├── components/       # คอมโพเนนต์ต่าง ๆ (TaxCalculator, TaxResultsPanel, Header, Footer)
│   ├── globals.css       # ไฟล์ CSS หลักและสไตล์ Tailwind
│   ├── layout.tsx        # เลย์เอาต์หลักของแอปพลิเคชัน
│   ├── page.tsx          # หน้าหลักของโปรเจกต์
│   ├── types.ts          # ไฟล์เก็บอินเทอร์เฟซ ข้อมูลขั้นบันไดภาษี (TAX_BRACKETS)
│   └── lib/              # ฟังก์ชันคำนวณและตัวแปรเสริม
```

---

## 📝 คำสั่งสคริปต์ที่สามารถใช้ได้ (Available Scripts)

ในโปรเจกต์นี้สามารถใช้คำสั่งต่าง ๆ ในการทดสอบหรือเตรียมโปรเจกต์ขึ้นโปรดักชันได้ผ่าน `package.json`:

- `npm run dev`: เริ่มต้นรันโปรเจกต์สำหรับการพัฒนา (Development Mode)
- `npm run build`: สร้างโปรเจกต์สำหรับขึ้นใช้งานจริง (Production Build)
- `npm run start`: รันตัวโปรเจกต์ที่บิลด์เสร็จเรียบร้อยแล้ว
- `npm run lint`: ตรวจเช็กไวยากรณ์และความถูกต้องของโค้ดด้วย ESLint

---

## 📄 ใบอนุญาต (License)

โปรเจกต์นี้เผยแพร่ภายใต้ใบอนุญาต [MIT License](LICENSE)
