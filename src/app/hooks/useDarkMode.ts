"use client";

import { useState, useEffect, useCallback } from "react";

interface UseDarkModeReturn {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  mounted: boolean;
}

export function useDarkMode(): UseDarkModeReturn {
  const [isDarkMode, setIsDarkMode] = useState(true); // Dark mode is default
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // On mount, check if light class was already added (shouldn't be now)
    const isLight = document.documentElement.classList.contains("light");
    setIsDarkMode(!isLight);
  }, []);

  // Sync the 'light' class on <html> with state
  useEffect(() => {
    if (!mounted) return;
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.remove("light");
    } else {
      root.classList.add("light");
    }
  }, [isDarkMode, mounted]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  return { isDarkMode, toggleDarkMode, mounted };
}
