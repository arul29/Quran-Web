import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

// Import icons from react-icons
import {
  FiArrowLeft,
  FiShare2,
  FiChevronLeft,
  FiChevronRight,
  FiBookmark, // Outline bookmark icon
  FiVolume2, // Play icon
  FiPause, // Pause icon
} from "react-icons/fi";
import { BsBookmarkFill } from "react-icons/bs"; // Filled bookmark icon

import { convertToArabicNumbers, RawHTML } from "../helpers";
import { FaBoxOpen } from "react-icons/fa";
import { Helmet } from "react-helmet-async";

export default function SurahRead() {
  const { no } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [surahData, setSurahData] = useState({});
  const [surahRead, setSurahRead] = useState([]);
  const [activeVerse, setActiveVerse] = useState(null); // Keep for potential future use
  const [isScrolled, setIsScrolled] = useState(false);
  const [bookmark, setBookmark] = useState([]);

  // State untuk audio
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef(null); // Ref untuk elemen Audio

  const headerRef = useRef(null);

  // Wrap getSurahData in useCallback to make it a stable function
  const getSurahData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`https://equran.id/api/v2/surat/${no}`);
      // Access res.data.data for surah details
      const data = res.data.data;
      setSurahData(data);
      setSurahRead(data.ayat); // Access data.ayat for verses
      document.title = `${data.namaLatin} - Al-Qur'an`; // Use namaLatin

      // Inisialisasi Audio object setelah data surah didapatkan
      // Check if audioRef.current exists before updating src
      if (audioRef.current === null) {
        // Use data.audioFull["01"] for the main surah audio
        audioRef.current = new Audio(data.audioFull["01"]);
        audioRef.current.onended = () => {
          setIsPlayingAudio(false);
        };
        audioRef.current.onpause = () => {
          setIsPlayingAudio(false);
        };
      } else if (data.audioFull && data.audioFull["01"]) {
        // If surah changes, update audio source
        audioRef.current.src = data.audioFull["01"];
        audioRef.current.load();
        setIsPlayingAudio(false);
      }
    } catch (err) {
      console.error("Failed to fetch surah data:", err);
      document.title = "Al-Qur'an Indonesia";
      setSurahData({});
      setSurahRead([]);
      // Ensure audio is stopped if there's an error
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null; // Reset audio object
      }
    } finally {
      setLoading(false);
    }
  }, [no]); // `no` is a dependency for `getSurahData`

  // Bookmark functions
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
    return (
      bookmark.filter((bookmarkItem) => item_id === bookmarkItem.nomor).length >
      0
    );
  };

  useEffect(() => {
    getBookmark(); // Get bookmarks on component mount
    getSurahData(); // Now getSurahData is stable, so no warning

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup function to stop audio when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [no, getSurahData]); // Depend on `no` and `getSurahData`

  const navigateSurah = (direction) => {
    // Stop audio when navigating
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }

    const newNo = parseInt(no) + direction;
    if (newNo >= 1 && newNo <= 114) {
      navigate(`/baca/${newNo}`);
      window.scrollTo(0, 0);
    }
  };

  // Bookmark toggle for the entire surah
  const toggleSurahBookmark = () => {
    if (!surahData || !surahData.nomor) return; // Ensure surahData is available

    if (isBookmark(surahData.nomor)) {
      removeBookmark(surahData.nomor);
    } else {
      addBookmark({
        nomor: surahData.nomor,
        nama_latin: surahData.namaLatin, // Use namaLatin
        arti: surahData.arti,
        jumlah_ayat: surahData.jumlahAyat, // Use jumlahAyat
        tempat_turun: surahData.tempatTurun, // Use tempatTurun
        link: `/baca/${surahData.nomor}`, // Link to this surah
      });
    }
  };

  // Function to play or pause entire surah audio
  const toggleSurahAudio = async () => {
    // Access the specific audio URL for the full surah from audioFull object
    const surahAudioUrl = surahData.audioFull && surahData.audioFull["01"];

    if (!surahAudioUrl) {
      alert("Maaf, audio untuk surah ini tidak tersedia.");
      return;
    }

    if (!audioRef.current) {
      // Initialize Audio object if it doesn't exist
      audioRef.current = new Audio(surahAudioUrl);
      audioRef.current.onended = () => {
        setIsPlayingAudio(false);
      };
      audioRef.current.onpause = () => {
        setIsPlayingAudio(false);
      };
    }

    try {
      if (isPlayingAudio) {
        audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
      setIsPlayingAudio(!isPlayingAudio);
    } catch (error) {
      console.error("Error playing audio:", error);
      alert(
        "Gagal memutar audio. Pastikan browser Anda mengizinkan autoplay atau coba lagi.",
      );
      setIsPlayingAudio(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <Helmet>
        <title>
          {surahData.namaLatin
            ? `${surahData.namaLatin} (${surahData.arti}) - Al-Qur'an Indonesia`
            : "Memuat Surah... - Al-Qur'an Indonesia"}
        </title>
        <meta
          name="description"
          content={
            surahData.namaLatin
              ? `Baca Surah ${surahData.namaLatin} (${surahData.arti}) lengkap dengan terjemahan Bahasa Indonesia, teks Arab, dan audio resmi di Al-Qur'an Indonesia.`
              : "Baca Al-Qur'an Online dengan terjemahan Bahasa Indonesia."
          }
        />
        <meta
          property="og:title"
          content={`${surahData.namaLatin} - Al-Qur'an Indonesia`}
        />
        <meta
          property="og:description"
          content={`Baca Surah ${surahData.namaLatin} (${surahData.arti}) lengkap dengan terjemahan Bahasa Indonesia dan audio.`}
        />
        <meta property="og:url" content={window.location.href} />
      </Helmet>
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
              {surahData.namaLatin || "Memuat..."}
              {/* Use namaLatin */}
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
              onClick={toggleSurahBookmark}
              className={`p-2 rounded-full ${
                isScrolled ? "bg-white shadow-md" : "bg-white/30"
              } hover:bg-white/50 transition duration-200`}
              aria-label="Bookmark Surah"
              disabled={loading}
            >
              {surahData.nomor && isBookmark(surahData.nomor) ? (
                <BsBookmarkFill
                  className={`h-6 w-6 ${
                    isScrolled ? "text-emerald-600" : "text-white"
                  }`}
                />
              ) : (
                <FiBookmark
                  className={`h-6 w-6 ${
                    isScrolled ? "text-emerald-600" : "text-white"
                  }`}
                />
              )}
            </button>
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
          // Modified Loading Skeleton
          <div className="animate-pulse">
            {/* Surah Header Card Skeleton */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 text-center border border-gray-100">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {/* Arabic text placeholder */}
                </div>
              </div>

              <div className="h-8 bg-gray-200 rounded w-2/3 mx-auto mb-3"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>

              <div className="flex justify-center space-x-4 text-sm text-gray-500 mt-4 mb-4">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-4"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>

              <div className="h-12 bg-gray-200 rounded-full w-56 mx-auto"></div>
            </div>

            {/* Verses List Skeleton (repeated for several items) */}
            <div className="space-y-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    {/* Placeholder for bookmark/share icons if needed */}
                  </div>
                  <div className="h-7 bg-gray-200 rounded w-5/6 mr-auto mb-4"></div>{" "}
                  {/* Arabic text */}
                  <div className="h-5 bg-gray-200 rounded w-full mb-2"></div>{" "}
                  {/* Transliteration */}
                  <div className="h-5 bg-gray-200 rounded w-11/12"></div>{" "}
                  {/* Indonesian translation */}
                  <div className="flex justify-end mt-4 border-t border-gray-100 pt-4">
                    <div className="h-10 w-32 bg-gray-200 rounded-full"></div>{" "}
                    {/* Share button */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : surahRead.length === 0 ? (
          // No Data (from SurahList)
          <div className="col-span-full text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <FaBoxOpen className="w-12 h-12 text-gray-400" />
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
                  <h1 className="text-4xl font-arabic">{surahData.nama}</h1>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {surahData.namaLatin}
                {/* Use namaLatin */}
              </h2>
              <p className="text-lg font-medium text-emerald-600">
                {surahData.arti}
              </p>

              <div className="flex justify-center space-x-4 text-sm text-gray-500 mt-4 mb-4">
                <span>{surahData.jumlahAyat} Ayat</span>
                {/* Use jumlahAyat */}
                <span>•</span>
                <span className="capitalize">{surahData.tempatTurun}</span>
                {/* Use tempatTurun */}
              </div>

              {/* Dengarkan button for the entire surah */}
              <button
                onClick={toggleSurahAudio}
                className="px-6 py-3 rounded-full bg-emerald-100 hover:bg-emerald-200 transition duration-200 flex items-center justify-center text-emerald-800 font-semibold mx-auto"
                aria-label={
                  isPlayingAudio ? "Jeda Audio Surah" : "Dengarkan Surah"
                }
                // Ensure surahData.audioFull is checked for existence of any key
                disabled={
                  loading ||
                  !surahData.audioFull ||
                  Object.keys(surahData.audioFull).length === 0
                }
              >
                {isPlayingAudio ? (
                  <FiPause className="h-6 w-6 mr-3" />
                ) : (
                  <FiVolume2 className="h-6 w-6 mr-3" />
                )}
                {isPlayingAudio ? "Jeda Audio Surah" : "Dengarkan Surah"}
              </button>
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
                        {convertToArabicNumbers(item.nomorAyat)}
                        {/* Use nomorAyat */}
                      </div>
                      {/* Bookmark button per ayat (was here) */}
                    </div>
                    <p className="text-right text-3xl font-arabic leading-loose text-gray-800 mb-4">
                      {item.teksArab}
                      {/* Use teksArab */}
                    </p>

                    <div className="flex flex-col gap-2 mb-3">
                      <p className="text-gray-700">
                        <RawHTML>{item.teksLatin}</RawHTML>
                        {/* Use teksLatin */}
                      </p>
                      <p className="text-gray-600 italic">
                        {item.teksIndonesia}
                      </p>
                      {/* Use teksIndonesia */}
                    </div>

                    <div className="flex justify-end space-x-3 mt-4 border-t border-gray-100 pt-4">
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
            // Check suratSebelumnya from surahData
            disabled={
              loading ||
              !surahData.suratSebelumnya ||
              surahData.suratSebelumnya === false
            }
            className="px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-200 flex items-center text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiChevronLeft className="h-5 w-5 mr-2" />
            Sebelumnya
          </button>

          <button
            onClick={() => navigateSurah(1)}
            // Check suratSelanjutnya from surahData
            disabled={
              loading ||
              !surahData.suratSelanjutnya ||
              surahData.suratSelanjutnya === false
            }
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
