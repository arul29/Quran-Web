import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center">
          <div className="text-center">
            <div className="flex items-center gap-6 mb-4">
              <a
                href="/bantuan"
                className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
              >
                Bantuan & Panduan
              </a>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-slate-700"></span>
              <a
                href="https://github.com/arul29/Quran-Web"
                target="_blank"
                rel="noreferrer"
                className="text-sm font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                GitHub
              </a>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-3">
              © {new Date().getFullYear()} Al-Qur'an Indonesia. Made by{" "}
              <a
                className="text-emerald-600 dark:text-emerald-400 hover:underline transition-all"
                href="https://quran.darul.id"
                target="_blank"
                rel="noreferrer"
              >
                Darul.id
              </a>
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Data sourced from{" "}
              <a
                className="hover:text-emerald-500 transition-colors"
                href="https://equran.id/apidev"
                target="_blank"
                rel="noreferrer"
              >
                Equran.id
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
