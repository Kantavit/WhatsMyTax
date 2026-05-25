"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon, Slash } from "lucide-react";

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  mounted: boolean;
}

const NAV_ITEMS = [
  { href: "/", label: "คำนวณภาษี" },
  { href: "/tax-rates", label: "อัตราภาษี" },
  { href: "/deductions", label: "ลดหย่อนภาษี" },
];

export function Header({ isDarkMode, toggleDarkMode, mounted }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-surface-container border-b border-outline-variant backdrop-blur-md"
      style={{
        background:
          "color-mix(in srgb, var(--color-surface-container), transparent 20%)",
      }}
    >
      {/* Logo + Nav */}
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-primary no-underline"
        >
          <Slash className="w-5 h-5" />
          <span>WhatsMyTax</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${pathname === item.href ? "nav-link-active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        {mounted && (
          <button
            type="button"
            onClick={toggleDarkMode}
            className="cursor-pointer p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all active:scale-90 duration-150 flex items-center justify-center rounded-full"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        )}
        {/* <button className="btn-signin hidden sm:inline-flex" aria-label="Sign in">
          Sign In
        </button> */}
      </div>
    </header>
  );
}
