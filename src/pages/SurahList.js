import React, { useEffect, useState } from "react";
import axios from "axios";
import { convertToArabicNumbers } from "@/helpers";
import {
  BookOpen,
  Search,
  Bookmark,
  Library,
  Box,
  History,
  Trash2,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import ThemeToggle from "@/components/ThemeToggle";
import RamadhanBanner from "@/components/RamadhanBanner";
import PrayerTimes from "@/components/PrayerTimes";
import ShalatTimes from "@/components/ShalatTimes";

export default function SurahList() {
  const [loading, setLoading] = useState(false);
  const [surahList, setSurahList] = useState([]);
  const [surahAll, setSurahAll] = useState([]);
  const [bookmark, setBookmark] = useState([]);
  const [viewBookmark, setViewBookmark] = useState(false);
  const [lastRead, setLastRead] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getSurahList = async () => {
    setLoading(true);
    await axios
      .get(`https://equran.id/api/v2/surat`)
      .then(async (res) => {
        setSurahList(res.data.data);
        setSurahAll(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  const searchSurah = (event) => {
    let updatedList = viewBookmark ? bookmark : surahAll;
    updatedList = updatedList.filter(function (item) {
      return (
        item.namaLatin
          .toLowerCase()
          .search(event.target.value.toLowerCase()) !== -1
      );
    });
    setSurahList(updatedList);
  };

  const getBookmark = () => {
    const bookmark = localStorage.getItem("bookmark");
    if (bookmark) {
      setBookmark(JSON.parse(bookmark));
    } else {
      setBookmark([]);
      console.log("No Bookmark");
    }
  };

  const addBookmark = (item) => {
    const oldBookmark = localStorage.getItem("bookmark");
    let newBookmark;
    if (oldBookmark == null) {
      newBookmark = [];
    } else {
      newBookmark = JSON.parse(oldBookmark);
    }
    localStorage.setItem(
      "bookmark",
      JSON.stringify(
        newBookmark.concat({
          nomor: item.nomor,
          nama: item.nama,
          namaLatin: item.namaLatin,
          jumlahAyat: item.jumlahAyat,
          tempatTurun: item.tempatTurun,
          arti: item.arti,
        }),
      ),
    );
    getBookmark();
  };

  const removeBookmark = (item_id) => {
    let newBookmark = bookmark.filter(function (obj) {
      return obj.nomor !== item_id;
    });
    localStorage.setItem("bookmark", JSON.stringify(newBookmark));
    getBookmark();
  };

  const isBookmark = (item_id) => {
    return bookmark.filter((bookmark) => item_id === bookmark.nomor).length > 0;
  };

  const getLastRead = () => {
    const data = localStorage.getItem("lastRead");
    if (data) {
      setLastRead(JSON.parse(data));
    }
  };

  const deleteLastRead = () => {
    localStorage.removeItem("lastRead");
    setLastRead(null);
    setShowDeleteConfirm(false);
  };

  useEffect(() => {
    getBookmark();
    getSurahList();
    getLastRead();
  }, []);

  // Check if current Hijri month is Ramadhan (9th month)
  const isRamadhan = () => {
    try {
      const today = new Date();
      const hijriMonth = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
        month: "numeric",
      }).format(today);
      return hijriMonth === "9";
    } catch (e) {
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <SEO
        title="Baca Online 30 Juz"
        description="Baca Al-Qur'an secara online di Al-Qur'an Indonesia. Tersedia 114 Surah lengkap dengan terjemahan Bahasa Indonesia dan audio."
        isHomePage={true}
      />
      {/* Header Section */}
      <div className="relative overflow-hidden bg-[#0a2e26] dark:bg-slate-950 pt-20 pb-16 sm:py-24 px-4 sm:px-6">
        {/* Decorative Elements */}
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
            Al-Qur'an Indonesia Digital
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tight animate-slide-up leading-[1.1]">
            Baca <span className="text-emerald-400">Al-Qur'an</span> di mana
            saja.
          </h1>

          <p className="text-lg text-emerald-100/60 max-w-xl mx-auto leading-relaxed animate-fade-in delay-100 px-4">
            Al-Qur'an digital Indonesia lengkap dengan terjemahan, tafsir, dan
            audio jernih dalam genggaman Anda.
          </p>

          <div className="flex items-center justify-center pt-4 animate-fade-in delay-200">
            <Link
              to="/tanya-ai"
              className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-[2rem] font-bold transition-all shadow-xl shadow-emerald-500/20 active:scale-95 group"
            >
              <Sparkles
                size={20}
                className="group-hover:rotate-12 transition-transform"
              />
              Cari Ayat & Doa
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {!viewBookmark && (
          <div className="space-y-8 mb-12">
            <RamadhanBanner />
            {isRamadhan() ? <PrayerTimes /> : <ShalatTimes />}
          </div>
        )}

        {/* Search & Action Section */}
        <div className="mb-12 space-y-6">
          <div className="w-full animate-fade-in">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search
                  className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors"
                  strokeWidth={2.5}
                />
              </div>
              <input
                onChange={searchSurah}
                type="search"
                className="w-full pl-14 pr-6 py-5 text-lg border border-gray-100 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-2xl shadow-emerald-500/5 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none transition-all duration-300 dark:text-white dark:placeholder-gray-500"
                placeholder="Cari Surah..."
              />
            </div>
          </div>

          {/* Action Buttons - 3 Columns Grid */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full animate-fade-in delay-100">
            <button
              onClick={() => {
                setViewBookmark(!viewBookmark);
                viewBookmark ? setSurahList(surahAll) : setSurahList(bookmark);
              }}
              className="flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-800 hover:border-emerald-500/30 hover:shadow-lg transition-all duration-300 dark:text-gray-200 font-bold group"
            >
              {viewBookmark ? (
                <Library className="w-5 h-5 group-hover:scale-110 transition-transform text-emerald-500" />
              ) : (
                <Bookmark className="w-5 h-5 group-hover:scale-110 transition-transform text-emerald-500" />
              )}
              <span className="text-xs sm:text-base hidden sm:inline">
                {viewBookmark ? "Semua Surah" : "Bookmark"}
              </span>
            </button>

            <Link
              to="/juz"
              className="flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-800 hover:border-emerald-500/30 hover:shadow-lg transition-all duration-300 dark:text-gray-200 font-bold group"
            >
              <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform text-emerald-500" />
              <span className="text-xs sm:text-base hidden sm:inline">
                Baca per Juz
              </span>
            </Link>

            <Link
              to="/bantuan"
              className="flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-800 hover:border-emerald-500/30 hover:shadow-lg transition-all duration-300 dark:text-gray-200 font-bold group"
            >
              <HelpCircle className="w-5 h-5 group-hover:rotate-12 transition-transform text-emerald-500" />
              <span className="text-xs sm:text-base hidden sm:inline">
                Bantuan
              </span>
            </Link>
          </div>
        </div>

        {/* Last Read Card */}
        {!viewBookmark && lastRead && (
          <div className="mb-8 animate-fade-in">
            <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-800 rounded-3xl p-6 shadow-xl shadow-emerald-500/10 text-white border border-white/5">
              <div className="absolute top-1/2 -right-4 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                <History size={120} strokeWidth={1} />
              </div>

              <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="flex-shrink-0 p-3.5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 shadow-lg">
                    <History className="h-6 w-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-md">
                        Terakhir Dibaca
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white leading-tight">
                      {lastRead.type === "juz"
                        ? `Juz ${lastRead.juz}`
                        : lastRead.namaLatin}
                    </h3>
                    <p className="text-white/70 text-sm">
                      {lastRead.type === "juz"
                        ? `${lastRead.namaLatin} Ayat ${lastRead.nomorAyat}`
                        : `Ayat ${lastRead.nomorAyat}`}{" "}
                      <span className="mx-1 • text-white/30">•</span> Lanjutkan
                      Membaca
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Link
                    to={
                      lastRead.type === "juz"
                        ? `/juz/${lastRead.juz}#verse-${lastRead.nomorSurah}-${lastRead.nomorAyat}`
                        : `/baca/${lastRead.nomorSurah}#verse-${lastRead.nomorAyat}`
                    }
                    className="flex-1 md:flex-none inline-flex items-center justify-center px-6 py-2.5 bg-white text-emerald-800 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-all duration-200 shadow-md active:scale-95"
                  >
                    <History className="w-4 h-4 mr-2" strokeWidth={2.5} />
                    Lanjutkan Membaca
                  </Link>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex-none p-2.5 bg-white/10 hover:bg-red-500/20 border border-white/20 rounded-xl transition-all duration-200 active:scale-95 text-white"
                    title="Hapus Penanda"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Surah List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 animate-pulse"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
                  <div className="w-6 h-6 bg-gray-200 dark:bg-slate-700 rounded"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-2/3"></div>
                </div>
              </div>
            ))
          ) : surahList.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center">
                <Box className="w-12 h-12 text-gray-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Tidak ada data ditemukan
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Coba ubah kata kunci pencarian Anda
              </p>
            </div>
          ) : (
            surahList.map((item, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl dark:hover:shadow-emerald-900/10 transition-all duration-300 overflow-hidden border border-gray-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <a
                      href={`/baca/${item.nomor}`}
                      className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 dark:from-emerald-600 dark:to-emerald-800 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-105 transition-transform duration-200"
                    >
                      {convertToArabicNumbers(item.nomor)}
                    </a>

                    {!viewBookmark && (
                      <button
                        onClick={() => {
                          if (isBookmark(item.nomor))
                            removeBookmark(item.nomor);
                          else addBookmark(item);
                        }}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
                      >
                        <Bookmark
                          className={`w-6 h-6 transition-all duration-300 ${
                            isBookmark(item.nomor)
                              ? "fill-emerald-600 text-emerald-600"
                              : "text-gray-400"
                          }`}
                          strokeWidth={2}
                        />
                      </button>
                    )}
                  </div>

                  <a href={`/baca/${item.nomor}`} className="block">
                    <h3
                      className="text-2xl font-arabic font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200 text-right"
                      dir="rtl"
                    >
                      {item.nama}
                    </h3>
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                      {item.namaLatin}
                    </p>
                    <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                      {item.arti}
                    </p>
                  </a>
                </div>

                <div className="px-6 py-4 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-700">
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{item.jumlahAyat} Ayat</span>
                    <span className="capitalize">{item.tempatTurun}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-scale-up">
            <div className="p-6 text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <Trash2
                  className="w-8 h-8 text-red-600 dark:text-red-400"
                  strokeWidth={2.5}
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Hapus Terakhir Dibaca?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Anda akan menghapus penanda terakhir dibaca di{" "}
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Surah {lastRead?.namaLatin} Ayat {lastRead?.nomorAyat}
                </span>
                . Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-6 py-3 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors text-gray-700 dark:text-gray-200 font-semibold"
                >
                  Batal
                </button>
                <button
                  onClick={deleteLastRead}
                  className="flex-1 px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors text-white font-semibold shadow-lg shadow-red-600/20 active:scale-95"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
