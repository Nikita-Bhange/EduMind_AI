import React, { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { toggleTheme } from "../../utils/theme";

const ThemeToggle = ({ className = "" }) => {
  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );

  const handleToggle = () => {
    const nextTheme = toggleTheme();
    setIsDark(nextTheme === "dark");
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/80 text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-[#2b2b2b] dark:bg-[#181818] dark:text-slate-200 dark:hover:bg-[#212121] ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

export default ThemeToggle;
