import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  convertToArabicNumbers,
  RawHTML,
  dapatkanJuzBerdasarkanNomor,
} from "@/helpers";
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  History,
  Share2,
  Volume2,
  Loader,
  BookOpen,
  X,
  MessageCircle,
  Twitter,
  Facebook,
  Link2,
  MoreHorizontal,
  ExternalLink,
} from "lucide-react";
import SEO from "@/components/SEO";
import Toast from "@/components/Toast";

export default function JuzRead() {
  const { juzNumber } = useParams();
  const [loading, setLoading] = useState(true);
  const [verses, setVerses] = useState([]);
  const [juzInfo, setJuzInfo] = useState(null);
  const [playingVerse, setPlayingVerse] = useState(null);
  const [audioElement, setAudioElement] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadJuzData();
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = "";
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
    if (audioElement) {
      audioElement.pause();
    }

    const audio = new Audio(audioUrl);
    audio.play();
    setPlayingVerse(verseKey);
    setAudioElement(audio);

    audio.onended = () => {
      setPlayingVerse(null);
    };
  };

  const stopAudio = () => {
    if (audioElement) {
      audioElement.pause();
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

  const shareToSocial = (platform) => {
    if (!shareData) return;

    const url = encodeURIComponent(shareData.url);
    const text = encodeURIComponent(shareData.text);
    let shareUrl = "";

    switch (platform) {
      case "wa":
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
      case "x":
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case "fb":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      default:
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
    setShareModalOpen(false);
  };

  const copyPageLink = () => {
    if (!shareData) return;
    navigator.clipboard.writeText(shareData.url);
    showToast("Link berhasil disalin!", "success");
    setShareModalOpen(false);
  };

  const triggerNativeShare = async () => {
    if (!shareData) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareData.title,
          text: shareData.text,
          url: shareData.url,
        });
        setShareModalOpen(false);
      } catch (error) {
        if (error.name !== "AbortError") {
          showToast("Gagal membuka menu share sistem.", "error");
        }
      }
    } else {
      showToast("Browser Anda tidak mendukung menu share sistem.", "info");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader className="w-12 h-12 text-emerald-600 dark:text-emerald-400 animate-spin mx-auto" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Memuat Juz {juzNumber}...
          </p>
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
          <Link
            to="/juz"
            className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors"
          >
            Kembali ke Daftar Juz
          </Link>
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
            <Link
              to="/juz"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors text-gray-700 dark:text-gray-200 font-semibold"
            >
              <ChevronLeft size={20} />
              <span className="hidden sm:inline">Daftar Juz</span>
            </Link>

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

      {shareModalOpen && shareData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-xl animate-fade-in cursor-pointer"
            onClick={() => setShareModalOpen(false)}
          ></div>

          <div
            className="relative w-full max-w-lg animate-slide-up z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-white/40 dark:border-white/10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/20 rounded-full blur-[80px] -mr-10 -mt-10"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-[80px] -ml-10 -mb-10"></div>

              <div className="p-8 flex items-center justify-between relative z-10">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Sebarkan Kebaikan
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-gray-400 font-medium mt-1">
                    Pilih platform untuk berbagi ayat ini
                  </p>
                </div>
                <button
                  onClick={() => setShareModalOpen(false)}
                  className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-2xl transition-all group active:scale-90"
                  title="Tutup"
                >
                  <X
                    size={20}
                    className="text-slate-500 dark:text-gray-400 group-hover:text-red-500 transition-colors"
                  />
                </button>
              </div>

              <div className="px-8 pb-10 space-y-6 relative z-10">
                <div className="p-5 bg-white/50 dark:bg-slate-800/50 rounded-3xl border border-white/20 dark:border-white/5 shadow-inner">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <BookOpen className="text-white w-7 h-7" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-0.5">
                        Berbagi Ayat
                      </p>
                      <h4 className="font-bold text-slate-900 dark:text-white truncate">
                        {shareData.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-gray-400 truncate mt-0.5">
                        {shareData.url}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2 sm:gap-4">
                  {[
                    {
                      id: "wa",
                      label: "WhatsApp",
                      icon: MessageCircle,
                      color: "bg-green-500",
                    },
                    {
                      id: "x",
                      label: "X",
                      icon: Twitter,
                      color: "bg-slate-900 dark:bg-black",
                    },
                    {
                      id: "fb",
                      label: "Facebook",
                      icon: Facebook,
                      color: "bg-blue-600",
                    },
                    {
                      id: "copy",
                      label: "Copy",
                      icon: Link2,
                      color: "bg-emerald-600",
                    },
                    {
                      id: "more",
                      label: "Lainnya",
                      icon: MoreHorizontal,
                      color: "bg-slate-500",
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.id === "copy") copyPageLink();
                        else if (item.id === "more") triggerNativeShare();
                        else shareToSocial(item.id);
                      }}
                      className="flex flex-col items-center gap-3 group"
                    >
                      <div
                        className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center ${item.color} text-white rounded-2xl sm:rounded-3xl shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1`}
                      >
                        <item.icon
                          size={22}
                          className="sm:w-[26px] sm:h-[26px]"
                        />
                      </div>
                      <span className="text-[9px] sm:text-xs font-black text-slate-700 dark:text-gray-300 uppercase tracking-wider text-center w-full truncate">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-600 dark:bg-emerald-900/50 p-6">
                <p className="text-xs text-emerald-50 dark:text-emerald-300 leading-relaxed font-medium text-center italic">
                  "Barangsiapa yang menunjuki kepada kebaikan, maka baginya
                  pahala seperti pahala orang yang mengerjakannya." (HR. Muslim)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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
