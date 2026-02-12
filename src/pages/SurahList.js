import React, { useEffect, useState } from "react";
import axios from "axios";
import { convertToArabicNumbers } from "../helpers";
import { FaBoxOpen } from "react-icons/fa";
import SEO from "../components/SEO";
import ThemeToggle from "../components/ThemeToggle";

export default function SurahList() {
  const [loading, setLoading] = useState(false);
  const [surahList, setSurahList] = useState([]);
  const [surahAll, setSurahAll] = useState([]);
  const [bookmark, setBookmark] = useState([]);
  const [viewBookmark, setViewBookmark] = useState(false);

  const getSurahList = async () => {
    setLoading(true);
    await axios
      .get(`https://equran.id/api/v2/surat`) // Pastikan ini sudah v2
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
    // Pastikan properti yang disimpan di bookmark sesuai dengan format yang Anda inginkan
    // Ini penting agar SurahList bisa menampilkan namaLatin, jumlahAyat, tempatTurun dengan benar
    localStorage.setItem(
      "bookmark",
      JSON.stringify(
        newBookmark.concat({
          nomor: item.nomor,
          nama: item.nama,
          namaLatin: item.namaLatin, // Simpan namaLatin
          jumlahAyat: item.jumlahAyat, // Simpan jumlahAyat
          tempatTurun: item.tempatTurun, // Simpan tempatTurun
          arti: item.arti,
          // Jika Anda perlu menyimpan audioFull atau deskripsi, tambahkan di sini
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

  useEffect(() => {
    getBookmark();
    getSurahList();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <SEO
        title="Baca Online 30 Juz"
        description="Baca Al-Qur'an secara online di Al-Qur'an Indonesia. Tersedia 114 Surah lengkap dengan terjemahan Bahasa Indonesia dan audio."
        isHomePage={true}
      />
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-900 dark:to-slate-900">
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Al-Qur'an Indonesia
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Baca Al-Qur'an secara online dengan mudah, dilengkapi terjemahan
            Bahasa Indonesia
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search & Filter Section */}
        <div className="mb-12">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                onChange={searchSurah}
                type="search"
                className="w-full pl-12 pr-4 py-4 text-lg border-0 rounded-2xl bg-white dark:bg-slate-800 shadow-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all duration-200 dark:text-white dark:placeholder-gray-400"
                placeholder="Cari berdasarkan nama Surah..."
              />
            </div>
          </div>

          {/* Bookmark Toggle */}
          <div className="text-center mt-8">
            <button
              onClick={() => {
                setViewBookmark(!viewBookmark);
                viewBookmark ? setSurahList(surahAll) : setSurahList(bookmark);
              }}
              className="inline-flex items-center px-6 py-3 rounded-full bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-200 text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
              </svg>
              {viewBookmark ? "Lihat Semua Surah" : "Lihat Bookmark"}
            </button>
          </div>
        </div>

        {/* Surah Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading Skeleton
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
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <FaBoxOpen className="w-12 h-12 text-gray-400" />
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
                        <svg
                          className="w-6 h-6"
                          fill={isBookmark(item.nomor) ? "#059669" : "none"}
                          stroke={
                            isBookmark(item.nomor) ? "#059669" : "#9ca3af"
                          }
                          strokeWidth={1}
                          viewBox="0 0 24 24"
                        >
                          <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <a href={`/baca/${item.nomor}`} className="block">
                    {/* MODIFIKASI DI SINI: Tambahkan dir="rtl" dan text-right */}
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
    </div>
  );
}
