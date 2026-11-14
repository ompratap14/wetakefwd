"use client";

import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  function toggleTheme() {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("insights-theme", next);
  }

  return <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label="Toggle light or dark mode" title="Toggle light or dark mode">
    <Moon className="theme-moon" size={18} strokeWidth={1.6} /><Sun className="theme-sun" size={18} strokeWidth={1.6} />
  </button>;
}
