import React, { useState, useEffect } from "react";
import { convertToArabicNumbers, dapatkanRingkasanJuz } from "@/helpers";
import { Search, BookOpen, HelpCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import ThemeToggle from "@/components/ThemeToggle";

export default function JuzList() {
  const allJuz = dapatkanRingkasanJuz();
  const [juzList, setJuzList] = useState(allJuz);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const searchJuz = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = allJuz.filter((juz) => {
      return (
        juz.juz.toString().includes(searchTerm) ||
        juz.surahAwal.nama.toLowerCase().includes(searchTerm) ||
        juz.surahAkhir.nama.toLowerCase().includes(searchTerm)
      );
    });
    setJuzList(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <SEO
        title="Daftar 30 Juz Al-Qur'an"
        description="Jelajahi Al-Qur'an berdasarkan 30 Juz. Baca dan pelajari setiap Juz dengan terjemahan Bahasa Indonesia."
      />

      {/* Header Section */}
      <div className="relative overflow-hidden bg-[#0a2e26] dark:bg-slate-950 pt-20 pb-16 sm:py-24 px-4 sm:px-6">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/50 to-[#0a2e26] dark:to-slate-950"></div>
        </div>

        <div className="absolute top-6 right-6 z-50 flex items-center gap-2">
          <ThemeToggle />
          <Link
            to="/bantuan"
            className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl backdrop-blur-md text-white transition-all active:scale-95 group border border-white/10"
            title="Pusat Bantuan"
          >
            <HelpCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </Link>
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] animate-fade-in">
            30 Juz Al-Qur'an
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tight animate-slide-up leading-[1.1]">
            Baca per <span className="text-emerald-400">Juz</span>
          </h1>

          <p className="text-lg text-emerald-100/60 max-w-xl mx-auto leading-relaxed animate-fade-in delay-100 px-4">
            Jelajahi Al-Qur'an berdasarkan pembagian 30 Juz untuk kemudahan
            membaca dan menghafal.
          </p>

          <div className="flex items-center justify-center gap-3 pt-4 animate-fade-in delay-200">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold transition-all border border-white/10 active:scale-95"
            >
              <BookOpen size={18} />
              Baca per Surah
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-12">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search
                className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors"
                strokeWidth={2.5}
              />
            </div>
            <input
              onChange={searchJuz}
              type="search"
              className="w-full pl-14 pr-6 py-5 text-lg border border-gray-100 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-2xl shadow-emerald-500/5 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none transition-all duration-300 dark:text-white dark:placeholder-gray-500"
              placeholder="Cari Juz atau Surah..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {juzList.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <BookOpen
                className="w-12 h-12 text-gray-400 mx-auto mb-6"
                strokeWidth={1.5}
              />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Tidak ada data ditemukan
              </h3>
            </div>
          ) : (
            juzList.map((juz, index) => (
              <Link
                key={index}
                to={`/juz/${juz.juz}`}
                className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl dark:hover:shadow-emerald-900/10 transition-all duration-300 overflow-hidden border border-gray-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 dark:from-emerald-600 dark:to-emerald-800 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-105 transition-transform duration-200">
                      {convertToArabicNumbers(juz.juz)}
                    </div>
                    <div className="p-2 rounded-full bg-gray-50 dark:bg-slate-700/50 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-colors duration-200">
                      <ArrowRight
                        className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-200"
                        strokeWidth={2.5}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
                      Juz {juz.juz}
                    </h3>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-gray-400">
                          Mulai dari:
                        </span>
                        <span className="font-semibold text-gray-700 dark:text-gray-200">
                          {juz.surahAwal.nama} : {juz.surahAwal.ayat}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-gray-400">
                          Berakhir di:
                        </span>
                        <span className="font-semibold text-gray-700 dark:text-gray-200">
                          {juz.surahAkhir.nama} : {juz.surahAkhir.ayat}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      {juz.jumlahSurah} Surah
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform duration-200">
                      Baca Sekarang →
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
