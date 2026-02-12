import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ isScrolled, className = "" }) {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className={`p-2 rounded-full transition-all duration-300 group ${
        isScrolled
          ? "bg-white dark:bg-slate-800 shadow-md text-emerald-600 dark:text-emerald-400"
          : darkMode
            ? "bg-white/10 text-white hover:bg-white/20"
            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100"
      } ${className}`}
      aria-label="Toggle Dark Mode"
    >
      {darkMode ? (
        <Sun
          className="w-6 h-6 group-hover:rotate-45 transition-transform duration-500"
          strokeWidth={2.5}
        />
      ) : (
        <Moon
          className="w-6 h-6 group-hover:-rotate-12 transition-transform duration-500"
          strokeWidth={2.5}
        />
      )}
    </button>
  );
}
