import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

// Import icons from react-icons
import {
  FiArrowLeft,
  FiShare2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { BsBookmark, BsFillVolumeUpFill } from "react-icons/bs";

import { convertToArabicNumbers, RawHTML } from "../helpers";

export default function SurahRead() {
  const { no } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [surahData, setSurahData] = useState({});
  const [surahRead, setSurahRead] = useState([]);
  const [activeVerse, setActiveVerse] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
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

  useEffect(() => {
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Floating Header */}
      <header
        ref={headerRef}
        className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${
          isScrolled ? "bg-white/90 shadow-sm py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition duration-200"
            aria-label="Kembali"
          >
            {/* Mengganti SVG dengan React Icon */}
            <FiArrowLeft className="h-6 w-6 text-blue-600" />
          </button>

          <div className="text-center flex-1 mx-4">
            <h1 className="font-bold text-gray-800 text-lg md:text-xl truncate">
              {surahData.nama_latin || "Loading..."}
            </h1>
            {isScrolled && (
              <p className="text-xs text-gray-500 mt-1 truncate">
                {surahData.arti || "Al-Qur'an"}
              </p>
            )}
          </div>

          <div className="flex space-x-2">
            <button
              className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition duration-200"
              aria-label="Simpan"
            >
              {/* Mengganti SVG dengan React Icon */}
              <BsBookmark className="h-6 w-6 text-blue-600" />
            </button>
            <button
              className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition duration-200"
              aria-label="Bagikan"
            >
              {/* Mengganti SVG dengan React Icon */}
              <FiShare2 className="h-6 w-6 text-blue-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Memuat Surah...</p>
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Surah Header Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 text-center border border-gray-100">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <h1 className="text-3xl text-blue-800 font-arabic">
                    {surahData.nama}
                  </h1>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {surahData.nama_latin}
              </h2>

              <div className="flex justify-center space-x-4 text-sm text-gray-600 mt-3">
                <span>{surahData.jumlah_ayat} Ayat</span>
                <span>•</span>
                <span>{surahData.tempat_turun}</span>
              </div>

              <p className="text-gray-600 mt-4 italic">{surahData.arti}</p>
            </div>

            {/* Verses List */}
            <div className="space-y-5">
              {surahRead.map((item, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 cursor-pointer
                    ${
                      activeVerse === index
                        ? "ring-2 ring-blue-500"
                        : "hover:shadow-md"
                    }`}
                  onClick={() => handleVerseClick(index)}
                >
                  <div className="flex items-start p-5">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-4 mt-1">
                      <span className="text-blue-700 font-medium">
                        {convertToArabicNumbers(item.nomor)}
                      </span>
                    </div>

                    <div className="flex-grow">
                      <p className="text-right text-3xl font-arabic leading-loose text-gray-800 mb-4">
                        {item.ar}
                      </p>

                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          activeVerse === index
                            ? "max-h-screen pt-2 border-t border-gray-100 mt-4"
                            : "max-h-0"
                        }`}
                      >
                        <div className="text-gray-700 mb-3">
                          <RawHTML>{item.tr}</RawHTML>
                        </div>
                        <p className="text-gray-600 italic">{item.idn}</p>

                        <div className="flex justify-end space-x-3 mt-4">
                          <button
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-200"
                            aria-label="Putar audio"
                          >
                            {/* Mengganti SVG dengan React Icon */}
                            <BsFillVolumeUpFill className="h-6 w-6 text-blue-600" />
                          </button>
                          <button
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-200"
                            aria-label="Tandai ayat"
                          >
                            {/* Mengganti SVG dengan React Icon */}
                            <BsBookmark className="h-6 w-6 text-blue-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Navigation Footer */}
      <footer className="sticky bottom-0 bg-white border-t py-3 mt-8">
        <div className="container mx-auto px-4 flex justify-between">
          <button
            onClick={() => navigateSurah(-1)}
            disabled={parseInt(no) <= 1}
            className="px-4 py-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 transition duration-200 flex items-center"
          >
            {/* Mengganti SVG dengan React Icon */}
            <FiChevronLeft className="h-5 w-5 mr-2" />
            Sebelumnya
          </button>

          <button
            onClick={() => navigateSurah(1)}
            disabled={parseInt(no) >= 114}
            className="px-4 py-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 transition duration-200 flex items-center"
          >
            Selanjutnya
            {/* Mengganti SVG dengan React Icon */}
            <FiChevronRight className="h-5 w-5 ml-2" />
          </button>
        </div>
      </footer>
    </div>
  );
}
