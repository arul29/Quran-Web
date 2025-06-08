import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

// Import icons from react-icons
import {
  FiArrowLeft,
  FiShare2,
  FiChevronLeft,
  FiChevronRight,
  FiBookmark, // Changed from BsBookmark for consistency if needed, but BsBookmark is fine too.
  FiVolume2, // Changed from BsFillVolumeUpFill for consistency if needed.
} from "react-icons/fi";
import { BsBookmarkFill } from "react-icons/bs"; // For filled bookmark icon

import { convertToArabicNumbers, RawHTML } from "../helpers";

export default function SurahRead() {
  const { no } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [surahData, setSurahData] = useState({});
  const [surahRead, setSurahRead] = useState([]);
  const [activeVerse, setActiveVerse] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [bookmark, setBookmark] = useState([]); // State for bookmark
  const headerRef = useRef(null);

  const getSurahData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`https://equran.id/api/surat/${no}`);
      setSurahData(res.data);
      setSurahRead(res.data.ayat);
      document.title = `${res.data.nama_latin} - Al-Qur'an`;
    } catch (err) {
      console.error("Failed to fetch surah data:", err);
      document.title = "Al-Qur'an Indonesia";
      setSurahData({});
      setSurahRead([]);
    } finally {
      setLoading(false);
    }
  };

  // Bookmark functions (reused from SurahList)
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
    localStorage.setItem("bookmark", JSON.stringify(newBookmark.concat(item)));
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
    getBookmark(); // Get bookmarks on component mount
    getSurahData();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [no]);

  const handleVerseClick = (index) => {
    setActiveVerse(activeVerse === index ? null : index);
  };

  const navigateSurah = (direction) => {
    const newNo = parseInt(no) + direction;
    if (newNo >= 1 && newNo <= 114) {
      navigate(`/baca/${newNo}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Header Section (adapted from SurahList for consistency) */}
      <div
        ref={headerRef}
        className={`relative overflow-hidden ${
          isScrolled
            ? "bg-white/90 shadow-sm py-2"
            : "bg-gradient-to-r from-emerald-600 to-blue-600 py-4"
        } transition-all duration-300 sticky top-0 z-50`}
      >
        <div
          className={`absolute inset-0 ${
            isScrolled ? "bg-transparent" : "bg-black/10"
          }`}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className={`p-2 rounded-full ${
              isScrolled ? "bg-white shadow-md" : "bg-white/30"
            } hover:bg-white/50 transition duration-200`}
            aria-label="Kembali"
          >
            <FiArrowLeft
              className={`h-6 w-6 ${
                isScrolled ? "text-emerald-600" : "text-white"
              }`}
            />
          </button>

          <div className="text-center flex-1 mx-4">
            <h1
              className={`font-bold text-lg md:text-xl truncate ${
                isScrolled ? "text-gray-800" : "text-white"
              }`}
            >
              {surahData.nama_latin || "Memuat..."}
            </h1>
            <p
              className={`text-xs mt-1 truncate ${
                isScrolled ? "text-gray-500" : "text-white/90"
              }`}
            >
              {surahData.arti || "Al-Qur'an Indonesia"}
            </p>
          </div>

          <div className="flex space-x-2">
            <button
              className={`p-2 rounded-full ${
                isScrolled ? "bg-white shadow-md" : "bg-white/30"
              } hover:bg-white/50 transition duration-200`}
              aria-label="Bagikan"
            >
              <FiShare2
                className={`h-6 w-6 ${
                  isScrolled ? "text-emerald-600" : "text-white"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          // Loading Skeleton (from SurahList)
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm p-6 animate-pulse"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="w-6 h-6 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : surahRead.length === 0 ? (
          // No Data (from SurahList)
          <div className="col-span-full text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.007-5.824-2.709M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Tidak ada data ditemukan
            </h3>
            <p className="text-gray-500">
              Maaf, data Surah tidak dapat dimuat.
            </p>
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Surah Header Card (similar to SurahList card) */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 text-center border border-gray-100">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  <h1 className="text-4xl font-arabic">{surahData.nama}</h1>{" "}
                  {/* Arabic name */}
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {surahData.nama_latin}
              </h2>
              <p className="text-lg font-medium text-emerald-600">
                {surahData.arti}
              </p>

              <div className="flex justify-center space-x-4 text-sm text-gray-500 mt-4">
                <span>{surahData.jumlah_ayat} Ayat</span>
                <span>•</span>
                <span className="capitalize">{surahData.tempat_turun}</span>
              </div>
            </div>

            {/* Verses List */}
            <div className="space-y-5">
              {surahRead.map((item, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-300
                    ${
                      activeVerse === index
                        ? "ring-2 ring-emerald-500 shadow-xl"
                        : "hover:shadow-md border border-gray-100 hover:border-emerald-200"
                    }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                        {convertToArabicNumbers(item.nomor)}
                      </div>

                      <button
                        onClick={() => {
                          // Pass surahData to addBookmark to store full surah info
                          if (isBookmark(item.nomor_ayat))
                            // Assuming ayat number is unique for bookmark
                            removeBookmark(item.nomor_ayat);
                          else
                            addBookmark({
                              nomor: item.nomor_ayat, // Use ayat number for individual verse bookmark
                              nama_latin: `${surahData.nama_latin} - Ayat ${item.nomor_ayat}`, // Create a descriptive name
                              arti: surahData.arti,
                              jumlah_ayat: item.nomor, // Storing verse number for display purposes in SurahList
                              tempat_turun: surahData.tempat_turun,
                              // You might want to store actual verse content or a link
                              link: `/baca/${surahData.nomor}#ayat-${item.nomor_ayat}`,
                            });
                        }}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                      >
                        {isBookmark(item.nomor_ayat) ? (
                          <BsBookmarkFill className="w-6 h-6 text-emerald-600" />
                        ) : (
                          <FiBookmark className="w-6 h-6 text-gray-400" />
                        )}
                      </button>
                    </div>

                    <p className="text-right text-3xl font-arabic leading-loose text-gray-800 mb-4">
                      {item.ar}
                    </p>

                    <div className="flex flex-col gap-2 mb-3">
                      <p className="text-gray-700">
                        <RawHTML>{item.tr}</RawHTML>
                      </p>
                      <p className="text-gray-600 italic">{item.idn}</p>
                    </div>

                    <div className="flex justify-end space-x-3 mt-4 border-t border-gray-100 pt-4">
                      <button
                        className="px-4 py-2 rounded-full bg-emerald-50 hover:bg-emerald-100 transition duration-200 flex items-center text-emerald-700 font-medium"
                        aria-label="Putar audio"
                      >
                        <FiVolume2 className="h-5 w-5 mr-2" />
                        Dengarkan
                      </button>
                      <button
                        className="px-4 py-2 rounded-full bg-blue-50 hover:bg-blue-100 transition duration-200 flex items-center text-blue-700 font-medium"
                        aria-label="Bagikan ayat"
                      >
                        <FiShare2 className="h-5 w-5 mr-2" />
                        Bagikan
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Navigation Footer */}
      <footer className="sticky bottom-0 bg-white border-t border-gray-100 shadow-inner py-3 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between">
          <button
            onClick={() => navigateSurah(-1)}
            disabled={parseInt(no) <= 1}
            className="px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-200 flex items-center text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiChevronLeft className="h-5 w-5 mr-2" />
            Sebelumnya
          </button>

          <button
            onClick={() => navigateSurah(1)}
            disabled={parseInt(no) >= 114}
            className="px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-200 flex items-center text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Selanjutnya
            <FiChevronRight className="h-5 w-5 ml-2" />
          </button>
        </div>
      </footer>
    </div>
  );
}
