import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Share2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Copy,
  BookOpen,
  Volume2,
  Pause,
  Box,
  History,
  X,
  MoreHorizontal,
} from "lucide-react";

import { convertToArabicNumbers, RawHTML } from "@/helpers";
import SEO from "@/components/SEO";
import ThemeToggle from "@/components/ThemeToggle";
import Toast from "@/components/Toast";
import ShareModal from "@/components/ShareModal";
import useBookmark from "@/hooks/useBookmark";

export default function SurahRead() {
  const { no } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [surahData, setSurahData] = useState({});
  const [surahRead, setSurahRead] = useState([]);
  const [playingVerseId, setPlayingVerseId] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isBookmark, addBookmark, removeBookmark } = useBookmark();

  // State untuk Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // State untuk audio
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef(null);
  const verseAudioRef = useRef(null);

  // State untuk Tafsir
  const [tafsirData, setTafsirData] = useState([]);
  const [selectedTafsir, setSelectedTafsir] = useState(null);
  const [isTafsirOpen, setIsTafsirOpen] = useState(false);

  // State untuk Share
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const headerRef = useRef(null);

  const getSurahData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`https://equran.id/api/v2/surat/${no}`);
      const data = res.data.data;
      setSurahData(data);
      setSurahRead(data.ayat);
      document.title = `${data.namaLatin} - Al-Qur'an`;

      const tafsirRes = await axios.get(
        `https://equran.id/api/v2/tafsir/${no}`,
      );
      const tafsirResult = tafsirRes.data.data;
      setTafsirData(tafsirResult.tafsir);

      if (audioRef.current === null) {
        audioRef.current = new Audio(data.audioFull["01"]);
        audioRef.current.onended = () => setIsPlayingAudio(false);
        audioRef.current.onpause = () => setIsPlayingAudio(false);
      } else if (data.audioFull && data.audioFull["01"]) {
        audioRef.current.src = data.audioFull["01"];
        audioRef.current.load();
        setIsPlayingAudio(false);
      }
    } catch (err) {
      console.error("Failed to fetch surah data:", err);
      document.title = "Al-Qur'an Indonesia";
      setSurahData({});
      setSurahRead([]);
      setTafsirData([]);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    } finally {
      setLoading(false);
    }
  }, [no]);

  const saveLastRead = (nomorAyat) => {
    const lastReadData = {
      nomorSurah: no,
      namaLatin: surahData.namaLatin,
      nomorAyat: nomorAyat,
      type: "surah",
      timestamp: new Date().getTime(),
    };
    localStorage.setItem("lastRead", JSON.stringify(lastReadData));
    showToast(
      `Berhasil menandai Ayat ${nomorAyat} sebagai terakhir dibaca!`,
      "success",
    );
  };

  useEffect(() => {
    getSurahData();

    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (verseAudioRef.current) {
        verseAudioRef.current.pause();
        verseAudioRef.current = null;
      }
    };
  }, [no, getSurahData]);

  // Separate useEffect for scrolling to verse AFTER data is fully loaded
  useEffect(() => {
    if (!loading && surahRead.length > 0 && window.location.hash) {
      // Small delay to ensure DOM is fully rendered
      const timer = setTimeout(() => {
        const id = window.location.hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          // Scroll with offset for better visibility
          const yOffset = -100;
          const y =
            element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });

          // Highlight effect
          element.classList.add(
            "ring-4",
            "ring-emerald-500/50",
            "animate-pulse",
          );
          setTimeout(() => {
            element.classList.remove(
              "ring-4",
              "ring-emerald-500/50",
              "animate-pulse",
            );
          }, 3000);
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [loading, surahRead]);

  const navigateSurah = (direction) => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }
    if (verseAudioRef.current) {
      verseAudioRef.current.pause();
      setPlayingVerseId(null);
    }

    const newNo = parseInt(no) + direction;
    if (newNo >= 1 && newNo <= 114) {
      navigate(`/baca/${newNo}`);
      window.scrollTo(0, 0);
    }
  };

  const toggleSurahBookmark = () => {
    if (!surahData || !surahData.nomor) return;
    if (isBookmark(surahData.nomor)) {
      removeBookmark(surahData.nomor);
    } else {
      // Struktur seragam dengan SurahList.js
      addBookmark({
        nomor: surahData.nomor,
        nama: surahData.nama,
        namaLatin: surahData.namaLatin,
        jumlahAyat: surahData.jumlahAyat,
        tempatTurun: surahData.tempatTurun,
        arti: surahData.arti,
      });
    }
  };

  const toggleSurahAudio = async () => {
    const surahAudioUrl = surahData.audioFull && surahData.audioFull["01"];
    if (!surahAudioUrl) {
      showToast("Maaf, audio untuk surah ini tidak tersedia.", "error");
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio(surahAudioUrl);
      audioRef.current.onended = () => setIsPlayingAudio(false);
      audioRef.current.onpause = () => setIsPlayingAudio(false);
    }

    try {
      if (isPlayingAudio) {
        audioRef.current.pause();
      } else {
        if (verseAudioRef.current) {
          verseAudioRef.current.pause();
          setPlayingVerseId(null);
        }
        await audioRef.current.play();
      }
      setIsPlayingAudio(!isPlayingAudio);
    } catch (error) {
      console.error("Error playing audio:", error);
      showToast(
        "Gagal memutar audio. Pastikan browser Anda mengizinkan autoplay.",
        "error",
      );
      setIsPlayingAudio(false);
    }
  };

  const openTafsir = (ayatNumber) => {
    const tafsirAyat = tafsirData.find((tafsir) => tafsir.ayat === ayatNumber);
    if (tafsirAyat) {
      setSelectedTafsir({ nomor: ayatNumber, teks: tafsirAyat.teks });
      setIsTafsirOpen(true);
    } else {
      showToast("Tafsir untuk ayat ini tidak ditemukan.", "error");
    }
  };

  const toggleVerseAudio = (audioUrl, verseId) => {
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }

    if (playingVerseId === verseId) {
      verseAudioRef.current.pause();
      setPlayingVerseId(null);
    } else {
      if (verseAudioRef.current) {
        verseAudioRef.current.pause();
      }
      verseAudioRef.current = new Audio(audioUrl);
      verseAudioRef.current.play();
      setPlayingVerseId(verseId);
      verseAudioRef.current.onended = () => setPlayingVerseId(null);
    }
  };

  const copyVerse = (arabicText, indonesianText, verseNumber) => {
    const textToCopy = `${arabicText}\n\n${indonesianText}\n\n(QS. ${surahData.namaLatin}:${verseNumber})`;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => showToast("Ayat berhasil disalin!", "success"))
      .catch((err) => {
        console.error("Gagal menyalin ayat:", err);
        showToast("Gagal menyalin ayat.", "error");
      });
  };

  const copyTafsir = (text, verseNumber) => {
    const textToCopy = `Tafsir QS. ${surahData.namaLatin} Ayat ${verseNumber}:\n\n${text}`;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => showToast("Tafsir berhasil disalin!", "success"))
      .catch((err) => {
        console.error("Gagal menyalin tafsir:", err);
        showToast("Gagal menyalin tafsir.", "error");
      });
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const triggerNativeShare = async () => {
    // Moved to ShareModal component
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <SEO
        title={
          surahData.namaLatin
            ? `${surahData.namaLatin} - Al-Qur'an Indonesia`
            : "Memuat Surah..."
        }
        description={
          surahData.namaLatin
            ? `Baca Surah ${surahData.namaLatin} (${surahData.arti}) ayat 1-${surahData.jumlahAyat} lengkap dengan terjemahan Bahasa Indonesia, teks Arab, audio, dan tafsir resmi di Al-Qur'an Indonesia.`
            : "Baca Al-Qur'an Online dengan terjemahan Bahasa Indonesia, audio, dan tafsir lengkap 30 Juz."
        }
        ogTitle={
          surahData.namaLatin
            ? `Surah ${surahData.namaLatin} - Al-Qur'an Indonesia`
            : "Al-Qur'an Indonesia"
        }
        ogDescription={
          surahData.namaLatin
            ? `Baca Surah ${surahData.namaLatin} (${surahData.arti}) dengan terjemahan Indonesia, audio per ayat, dan tafsir lengkap dari Kemenag.`
            : "Baca Al-Qur'an Online Lengkap 30 Juz dengan terjemahan Bahasa Indonesia, audio resmi, dan tafsir."
        }
        ogUrl={`https://quran.darul.id/baca/${surahData.nomor}`}
        breadcrumbList={[
          { name: "Beranda", url: "https://quran.darul.id" },
          {
            name: surahData.namaLatin || "Surah",
            url: `https://quran.darul.id/baca/${surahData.nomor}`,
          },
        ]}
      />

      <div
        ref={headerRef}
        className={`relative overflow-hidden ${
          isScrolled
            ? "bg-white/90 dark:bg-slate-900/90 shadow-sm py-2 backdrop-blur-md"
            : "bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-900 dark:to-slate-900 py-4"
        } transition-all duration-300 sticky top-0 z-50`}
      >
        <div
          className={`absolute inset-0 ${isScrolled ? "bg-transparent" : "bg-black/10"}`}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className={`p-2 rounded-full ${isScrolled ? "bg-white dark:bg-slate-800 shadow-md" : "bg-white/30"} hover:bg-white/50 transition duration-200`}
            aria-label="Kembali"
          >
            <ArrowLeft
              className={`h-6 w-6 ${isScrolled ? "text-emerald-600 dark:text-emerald-400" : "text-white"}`}
              strokeWidth={2.5}
            />
          </button>

          <div className="text-center flex-1 mx-4">
            <h1
              className={`font-bold text-lg md:text-xl truncate ${isScrolled ? "text-gray-800 dark:text-white" : "text-white"}`}
            >
              {surahData.namaLatin || "Memuat..."}
            </h1>
            <p
              className={`text-xs mt-1 truncate ${isScrolled ? "text-gray-500 dark:text-gray-400" : "text-white/90"}`}
            >
              {surahData.arti || "Al-Qur'an Indonesia"}
            </p>
          </div>

          <div className="flex space-x-2 items-center">
            <ThemeToggle isScrolled={isScrolled} />
            <button
              onClick={toggleSurahBookmark}
              className={`p-2 rounded-full ${isScrolled ? "bg-white dark:bg-slate-800 shadow-md" : "bg-white/30"} hover:bg-white/50 transition duration-200`}
              aria-label="Bookmark Surah"
              disabled={loading}
            >
              <Bookmark
                className={`h-6 w-6 ${isScrolled ? "text-emerald-600 dark:text-emerald-400" : "text-white"}`}
                fill={
                  surahData.nomor && isBookmark(surahData.nomor)
                    ? "currentColor"
                    : "none"
                }
                strokeWidth={2.5}
              />
            </button>
            <button
              onClick={handleShare}
              className={`p-2 rounded-full ${isScrolled ? "bg-white dark:bg-slate-800 shadow-md" : "bg-white/30"} hover:bg-white/50 transition duration-200 group`}
              aria-label="Bagikan"
            >
              <Share2
                className={`h-6 w-6 ${isScrolled ? "text-emerald-600 dark:text-emerald-400" : "text-white"} group-hover:scale-110 transition-transform`}
                strokeWidth={2.5}
              />
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="animate-pulse">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 mb-8 text-center border border-gray-100 dark:border-slate-700">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-slate-700"></div>
              </div>
              <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-2/3 mx-auto mb-3"></div>
              <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mx-auto mb-4"></div>
              <div className="h-12 bg-gray-200 dark:bg-slate-700 rounded-full w-56 mx-auto"></div>
            </div>
            <div className="space-y-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 sm:p-8 border border-gray-100 dark:border-slate-700"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
                  </div>
                  <div className="flex flex-col items-end mb-6">
                    <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
                    <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-700">
                    <div className="h-10 w-24 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
                    <div className="h-10 w-24 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : surahRead.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center">
              <Box className="w-12 h-12 text-gray-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Tidak ada data ditemukan
            </h3>
            <p className="text-gray-500">
              Maaf, data Surah tidak dapat dimuat.
            </p>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 mb-8 text-center border border-gray-100 dark:border-slate-700">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 dark:from-emerald-600 dark:to-emerald-800 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  <h1 className="text-2xl font-arabic">{surahData.nama}</h1>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {surahData.namaLatin}
              </h2>
              <p className="text-lg font-medium text-emerald-600 dark:text-emerald-400">
                {surahData.arti}
              </p>
              <div className="flex justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-4 mb-4">
                <span>{surahData.jumlahAyat} Ayat</span>
                <span>•</span>
                <span className="capitalize">{surahData.tempatTurun}</span>
              </div>
              <button
                onClick={toggleSurahAudio}
                className="px-6 py-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition duration-200 flex items-center justify-center text-emerald-800 dark:text-emerald-400 font-semibold mx-auto"
                disabled={
                  loading ||
                  !surahData.audioFull ||
                  Object.keys(surahData.audioFull).length === 0
                }
              >
                {isPlayingAudio ? (
                  <Pause className="h-6 w-6 mr-3" strokeWidth={2.5} />
                ) : (
                  <Volume2 className="h-6 w-6 mr-3" strokeWidth={2.5} />
                )}
                {isPlayingAudio ? "Jeda Audio Surah" : "Dengarkan Surah"}
              </button>
            </div>

            <div className="space-y-5">
              {surahRead.map((item, index) => (
                <div
                  key={index}
                  id={`verse-${item.nomorAyat}`}
                  className={`relative group bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm border transition-all duration-500 ${
                    playingVerseId === item.nomorAyat
                      ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-emerald-500/10 dark:shadow-emerald-500/5 translate-x-1"
                      : "border-gray-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800"
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 dark:from-emerald-600 dark:to-emerald-800 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                        {convertToArabicNumbers(item.nomorAyat)}
                      </div>
                    </div>
                    <p className="text-right text-3xl font-arabic leading-loose text-gray-800 dark:text-gray-100 mb-4">
                      {item.teksArab}
                    </p>
                    <div className="flex flex-col gap-2 mb-3">
                      <p className="text-gray-700 dark:text-gray-200">
                        <RawHTML>{item.teksLatin}</RawHTML>
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 italic">
                        {item.teksIndonesia}
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-end gap-3 mt-4 border-t border-gray-100 dark:border-slate-700 pt-4">
                      <button
                        onClick={() =>
                          toggleVerseAudio(item.audio["05"], item.nomorAyat)
                        }
                        className={`px-3 sm:px-4 py-2 rounded-full transition duration-200 flex items-center font-medium ${playingVerseId === item.nomorAyat ? "bg-red-500 text-white shadow-lg shadow-red-500/30" : "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40"}`}
                      >
                        {playingVerseId === item.nomorAyat ? (
                          <>
                            <Pause
                              className="h-5 w-5 sm:mr-2 animate-pulse"
                              strokeWidth={2.5}
                            />
                            <span className="hidden sm:inline">Berhenti</span>
                          </>
                        ) : (
                          <>
                            <Volume2
                              className="h-5 w-5 sm:mr-2"
                              strokeWidth={2.5}
                            />
                            <span className="hidden sm:inline">Putar</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => openTafsir(item.nomorAyat)}
                        className="px-3 sm:px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition duration-200 flex items-center text-emerald-700 dark:text-emerald-400 font-medium"
                      >
                        <BookOpen
                          className="w-5 h-5 sm:mr-2"
                          strokeWidth={2.5}
                        />
                        <span className="hidden sm:inline">Tafsir</span>
                      </button>
                      <button
                        onClick={() => saveLastRead(item.nomorAyat)}
                        className="px-3 sm:px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition duration-200 flex items-center text-blue-700 dark:text-blue-400 font-medium"
                        aria-label="Tandai terakhir dibaca"
                      >
                        <History
                          className="h-5 w-5 sm:mr-2"
                          strokeWidth={2.5}
                        />
                        <span className="hidden sm:inline">Tandai</span>
                      </button>
                      <button
                        onClick={() =>
                          copyVerse(
                            item.teksArab,
                            item.teksIndonesia,
                            item.nomorAyat,
                          )
                        }
                        className="px-3 sm:px-4 py-2 rounded-full bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 transition duration-200 flex items-center text-gray-700 dark:text-gray-200 font-medium"
                      >
                        <Copy className="h-5 w-5 sm:mr-2" strokeWidth={2.5} />
                        <span className="hidden sm:inline">Salin</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="sticky bottom-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-gray-100 dark:border-slate-800 shadow-inner py-3 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between">
          <button
            onClick={() => navigateSurah(-1)}
            disabled={
              loading ||
              !surahData.suratSebelumnya ||
              surahData.suratSebelumnya === false
            }
            className="px-6 py-3 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition duration-200 flex items-center text-gray-700 dark:text-gray-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5 mr-2" strokeWidth={2.5} />
            Sebelumnya
          </button>
          <button
            onClick={() => navigateSurah(1)}
            disabled={
              loading ||
              !surahData.suratSelanjutnya ||
              surahData.suratSelanjutnya === false
            }
            className="px-6 py-3 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition duration-200 flex items-center text-gray-700 dark:text-gray-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Selanjutnya
            <ChevronRight className="h-5 w-5 ml-2" strokeWidth={2.5} />
          </button>
        </div>
      </footer>

      {isTafsirOpen && selectedTafsir && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col transform transition-all animate-scale-up">
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900 z-10">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Tafsir Ayat {selectedTafsir.nomor}
                </h3>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  {surahData.namaLatin}
                </p>
              </div>
              <button
                onClick={() => setIsTafsirOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Tutup"
              >
                <X className="w-6 h-6 text-gray-500" strokeWidth={2.5} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50/50 dark:bg-slate-900/50">
              <div className="prose prose-emerald dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-lg">
                  {selectedTafsir.teks}
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3">
              <button
                onClick={() =>
                  copyTafsir(selectedTafsir.teks, selectedTafsir.nomor)
                }
                className="px-8 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 transition-all text-white font-semibold shadow-lg shadow-emerald-600/20 active:scale-95 flex items-center gap-2"
              >
                <Copy size={20} />
                Salin
              </button>
            </div>
          </div>
        </div>
      )}

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        showToast={showToast}
        data={{
          title: `Surah ${surahData.namaLatin} - Al-Qur'an Indonesia`,
          text: `Baca Surah ${surahData.namaLatin} (${surahData.arti}) - ${surahData.jumlahAyat} Ayat di Al-Qur'an Indonesia.`,
          url: window.location.href,
          surahName: surahData.namaLatin,
          arti: surahData.arti,
        }}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
