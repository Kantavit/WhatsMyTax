"use client";

import { Sun, Moon } from "lucide-react";

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  mounted: boolean;
}

export function Header({ isDarkMode, toggleDarkMode, mounted }: HeaderProps) {
  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-surface-container-lowest border-b border-outline-variant shadow-sm font-inter antialiased">
      <div className="text-xl font-bold text-primary">What&apos;s My Tax</div>
      <div className="flex items-center gap-4">
        {mounted && (
          <button
            type="button"
            onClick={toggleDarkMode}
            className="relative z-[60] p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all active:scale-90 duration-150 flex items-center justify-center rounded-full"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    </header>
  );
}
