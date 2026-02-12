import React, { useState, useEffect } from "react";
import { Award, BookOpen, ChevronRight, Trophy, Zap } from "lucide-react";

export default function KhatamTracker() {
  const [currentJuz, setCurrentJuz] = useState(0);
  const [target, setTarget] = useState(30);

  useEffect(() => {
    const saved = localStorage.getItem("khatamProgress");
    if (saved) {
      setCurrentJuz(parseInt(saved));
    }
  }, []);

  const updateProgress = (val) => {
    const newVal = Math.max(0, Math.min(30, val));
    setCurrentJuz(newVal);
    localStorage.setItem("khatamProgress", newVal.toString());
  };

  const percentage = Math.round((currentJuz / target) * 100);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-lg border border-gray-100 dark:border-slate-700 mb-8 overflow-hidden relative group">
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full -ml-32 -mt-32 group-hover:scale-110 transition-transform duration-700"></div>

      <div className="relative flex flex-col lg:flex-row items-center gap-10">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-blue-500 rounded-2xl shadow-lg shadow-blue-500/20 text-white">
              <Trophy size={22} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                Progress Khatam
              </h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Lacak perjalanan One Day One Juz Anda
              </p>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-end mb-3">
              <span className="text-4xl font-black text-gray-900 dark:text-white">
                {percentage}%{" "}
                <span className="text-lg font-bold text-gray-400 ml-1">
                  Selesai
                </span>
              </span>
              <span className="text-sm font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-4 py-1.5 rounded-full border border-blue-100 dark:border-blue-800/50">
                Juz {currentJuz} dari {target}
              </span>
            </div>

            <div className="h-4 w-full bg-gray-100 dark:bg-slate-900 rounded-full overflow-hidden border border-gray-200/50 dark:border-slate-700/50 p-1">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000 ease-out relative group/bar"
                style={{ width: `${percentage}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full mr-1 shadow-sm"></div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-8">
            <div className="flex-1 flex items-center gap-2 p-2 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-700">
              <button
                onClick={() => updateProgress(currentJuz - 1)}
                className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 rounded-xl shadow-sm text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors font-bold text-xl"
              >
                -
              </button>
              <div className="flex-1 text-center font-black text-gray-900 dark:text-white text-lg">
                Juz {currentJuz}
              </div>
              <button
                onClick={() => updateProgress(currentJuz + 1)}
                className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 rounded-xl shadow-sm text-gray-600 dark:text-gray-300 hover:bg-emerald-50 hover:text-emerald-500 transition-colors font-bold text-xl"
              >
                +
              </button>
            </div>
            <p className="text-sm text-gray-400 max-w-[150px] font-medium leading-tight">
              Update progress Anda setiap kali selesai membaca satu Juz.
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center w-48 h-48 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 to-purple-600 p-8 shadow-xl shadow-indigo-500/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
          <div className="text-center text-white">
            <Award size={48} className="mx-auto mb-4 animate-bounce-subtle" />
            <p className="font-black text-sm uppercase tracking-widest">
              Target
            </p>
            <p className="text-3xl font-black">Khatam</p>
          </div>
        </div>
      </div>
    </div>
  );
}
