import React, { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

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
          : "bg-white/30 text-white hover:bg-white/50"
      } ${className}`}
      aria-label="Toggle Dark Mode"
    >
      {darkMode ? (
        <FiSun className="w-6 h-6 group-hover:rotate-45 transition-transform duration-500" />
      ) : (
        <FiMoon className="w-6 h-6 group-hover:-rotate-12 transition-transform duration-500" />
      )}
    </button>
  );
}
