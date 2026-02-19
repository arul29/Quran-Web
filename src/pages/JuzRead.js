import React, { useEffect, useState, useRef } from "react";

import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  convertToArabicNumbers,
  RawHTML,
  dapatkanJuzBerdasarkanNomor,
} from "@/helpers";
import {
  ChevronLeft,
  ChevronRight,
  History,
  Share2,
  BookOpen,
  Volume2,
} from "lucide-react";
import SEO from "@/components/SEO";
import Toast from "@/components/Toast";
import ShareModal from "@/components/ShareModal";

export default function JuzRead() {
  const { juzNumber } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verses, setVerses] = useState([]);
  const [juzInfo, setJuzInfo] = useState(null);
  const [playingVerse, setPlayingVerse] = useState(null);
  const audioRef = useRef(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const [shareData, setShareData] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadJuzData();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, [juzNumber]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const loadJuzData = async () => {
    setLoading(true);
    const juz = dapatkanJuzBerdasarkanNomor(parseInt(juzNumber));

    if (!juz) {
      setLoading(false);
      return;
    }

    setJuzInfo(juz);

    try {
      const allVerses = [];

      for (const surahDalamJuz of juz.daftarSurah) {
        const response = await axios.get(
          `https://equran.id/api/v2/surat/${surahDalamJuz.nomor}`,
        );

        const surahData = response.data.data;

        const filteredVerses = surahData.ayat
          .filter(
            (ayat) =>
              ayat.nomorAyat >= surahDalamJuz.ayatAwal &&
              ayat.nomorAyat <= surahDalamJuz.ayatAkhir,
          )
          .map((ayat) => ({
            ...ayat,
            surahNumber: surahData.nomor,
            surahName: surahData.namaLatin,
            surahNameArabic: surahData.nama,
          }));

        allVerses.push(...filteredVerses);
      }

      setVerses(allVerses);
    } catch (error) {
      console.error("Error loading Juz data:", error);
    }

    setLoading(false);
  };

  const playAudio = (audioUrl, verseKey) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    audio.play();
    setPlayingVerse(verseKey);
    audioRef.current = audio;

    audio.onended = () => {
      setPlayingVerse(null);
    };
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingVerse(null);
    }
  };

  const handleShare = (verse) => {
    const text = `${verse.teksArab}\n\n"${verse.teksIndonesia}"\n\n(QS. ${verse.surahName} [${verse.surahNumber}]: ${verse.nomorAyat})`;
    const url = `${window.location.origin}/juz/${juzNumber}#verse-${verse.surahNumber}-${verse.nomorAyat}`;

    setShareData({
      title: `QS. ${verse.surahName} Ayat ${verse.nomorAyat}`,
      text: text,
      url: url,
      verse: verse,
    });
    setShareModalOpen(true);
  };

  const saveLastRead = (verse) => {
    const lastReadData = {
      nomorSurah: verse.surahNumber,
      namaLatin: verse.surahName,
      nomorAyat: verse.nomorAyat,
      juz: parseInt(juzNumber),
      type: "juz",
      timestamp: new Date().getTime(),
    };
    localStorage.setItem("lastRead", JSON.stringify(lastReadData));
    showToast(
      `Berhasil menandai Ayat ${verse.nomorAyat} sebagai terakhir dibaca di Juz ${juzNumber}!`,
      "success",
    );
  };

  // Separate useEffect for scrolling to verse AFTER data is fully loaded
  useEffect(() => {
    if (!loading && verses.length > 0) {
      const scrollTarget = window.location.hash;

      // If no hash, check if this Juz is the last read one
      let autoScrollId = null;
      if (scrollTarget) {
        autoScrollId = scrollTarget.replace("#", "");
      } else {
        const lastRead = JSON.parse(localStorage.getItem("lastRead"));
        if (lastRead && lastRead.juz === parseInt(juzNumber)) {
          autoScrollId = `verse-${lastRead.nomorSurah}-${lastRead.nomorAyat}`;
        }
      }

      if (autoScrollId) {
        const timer = setTimeout(() => {
          const element = document.getElementById(autoScrollId);
          if (element) {
            const yOffset = -100;
            const y =
              element.getBoundingClientRect().top +
              window.pageYOffset +
              yOffset;
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
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [loading, verses, juzNumber]);

  const triggerNativeShare = async () => {
    // Moved to ShareModal component
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pt-20">
        <div className="max-w-4xl mx-auto px-4 space-y-6 animate-pulse">
          <div className="bg-gradient-to-r from-emerald-600/20 to-teal-800/20 rounded-3xl p-8 border border-emerald-500/20">
            <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
              <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
            </div>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
                    <div className="w-32 h-5 bg-gray-200 dark:bg-slate-700 rounded"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-9 h-9 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
                    <div className="w-9 h-9 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
                  </div>
                </div>
                <div className="h-20 bg-gray-200 dark:bg-slate-700 rounded-xl w-full mb-4"></div>
                <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!juzInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Juz tidak ditemukan
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors"
          >
            Kembali ke Daftar Juz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <SEO
        title={`Juz ${juzNumber} - Al-Qur'an Indonesia`}
        description={`Baca Juz ${juzNumber} Al-Qur'an dengan terjemahan Bahasa Indonesia. Mulai dari ${juzInfo.daftarSurah[0].nama} ayat ${juzInfo.daftarSurah[0].ayatAwal}.`}
      />

      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors text-gray-700 dark:text-gray-200 font-semibold"
            >
              <ChevronLeft size={20} />
              <span className="hidden sm:inline">Daftar Juz</span>
            </button>

            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Juz {convertToArabicNumbers(juzNumber)}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {juzInfo.daftarSurah.length} Surah • {verses.length} Ayat
              </p>
            </div>

            <div className="flex items-center gap-2">
              {parseInt(juzNumber) > 1 && (
                <Link
                  to={`/juz/${parseInt(juzNumber) - 1}`}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                  title="Juz Sebelumnya"
                >
                  <ChevronLeft
                    size={20}
                    className="text-gray-700 dark:text-gray-200"
                  />
                </Link>
              )}
              {parseInt(juzNumber) < 30 && (
                <Link
                  to={`/juz/${parseInt(juzNumber) + 1}`}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                  title="Juz Selanjutnya"
                >
                  <ChevronRight
                    size={20}
                    className="text-gray-700 dark:text-gray-200"
                  />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Juz Info Card */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-800 rounded-3xl p-6 text-white shadow-xl">
          <h2 className="text-2xl font-bold mb-4">Juz {juzNumber}</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-emerald-100">Mulai dari:</span>
              <span className="font-semibold">
                {juzInfo.daftarSurah[0].nama} :{" "}
                {juzInfo.daftarSurah[0].ayatAwal}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-emerald-100">Berakhir di:</span>
              <span className="font-semibold">
                {juzInfo.daftarSurah[juzInfo.daftarSurah.length - 1].nama} :{" "}
                {juzInfo.daftarSurah[juzInfo.daftarSurah.length - 1].ayatAkhir}
              </span>
            </div>
          </div>
        </div>

        {/* Verses */}
        <div className="space-y-4">
          {verses.map((verse, index) => {
            const verseKey = `${verse.surahNumber}-${verse.nomorAyat}`;
            const isPlaying = playingVerse === verseKey;

            const isNewSurah =
              index === 0 ||
              verses[index - 1].surahNumber !== verse.surahNumber;

            return (
              <div key={verseKey}>
                {isNewSurah && (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-4 border border-gray-100 dark:border-slate-700">
                    <div className="text-center space-y-2">
                      <h3
                        className="text-3xl font-arabic font-bold text-gray-900 dark:text-white"
                        dir="rtl"
                      >
                        {verse.surahNameArabic}
                      </h3>
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        {verse.surahName}
                      </p>
                      <Link
                        to={`/baca/${verse.surahNumber}`}
                        className="inline-block text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        Lihat Surah Lengkap →
                      </Link>
                    </div>
                  </div>
                )}

                <div
                  id={`verse-${verseKey}`}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 dark:from-emerald-600 dark:to-emerald-800 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {convertToArabicNumbers(verse.nomorAyat)}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {verse.surahName} : {verse.nomorAyat}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          isPlaying
                            ? stopAudio()
                            : playAudio(verse.audio["05"], verseKey)
                        }
                        className={`p-2 rounded-xl transition-all ${
                          isPlaying
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                            : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600"
                        }`}
                        title="Putar Audio"
                      >
                        <Volume2
                          size={18}
                          className={isPlaying ? "animate-pulse" : ""}
                        />
                      </button>

                      <button
                        onClick={() => saveLastRead(verse)}
                        className="p-2 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        title="Tandai Terakhir Dibaca"
                      >
                        <History size={18} />
                      </button>

                      <button
                        onClick={() => handleShare(verse)}
                        className="p-2 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                        title="Bagikan Ayat"
                      >
                        <Share2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div
                    className="text-3xl sm:text-4xl font-arabic leading-[2.5] text-right mb-6 text-gray-900 dark:text-white"
                    dir="rtl"
                  >
                    <RawHTML>{verse.teksArab}</RawHTML>
                  </div>

                  <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    <RawHTML>{verse.teksIndonesia}</RawHTML>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-8">
          {parseInt(juzNumber) > 1 ? (
            <Link
              to={`/juz/${parseInt(juzNumber) - 1}`}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors shadow-lg"
            >
              <ChevronLeft size={20} />
              Juz {parseInt(juzNumber) - 1}
            </Link>
          ) : (
            <div></div>
          )}

          {parseInt(juzNumber) < 30 ? (
            <Link
              to={`/juz/${parseInt(juzNumber) + 1}`}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors shadow-lg"
            >
              Juz {parseInt(juzNumber) + 1}
              <ChevronRight size={20} />
            </Link>
          ) : (
            <div></div>
          )}
        </div>
      </div>

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        showToast={showToast}
        data={shareData}
      />

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
