import React, { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check initial theme from localStorage or system preference
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
      className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 backdrop-blur-md transition-all duration-300 text-white dark:text-emerald-400 shadow-lg border border-white/30 dark:border-emerald-500/30 group"
      aria-label="Toggle Dark Mode"
    >
      {darkMode ? (
        <FiSun className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
      ) : (
        <FiMoon className="w-5 h-5 group-hover:-rotate-12 transition-transform duration-500" />
      )}
    </button>
  );
}
