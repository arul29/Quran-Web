import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Quote,
  Loader2,
  BookOpen,
  RotateCcw,
  Book,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function RamadhanBanner() {
  const [randomAyat, setRandomAyat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isRamadhan, setIsRamadhan] = useState(false);

  useEffect(() => {
    fetchDailyVerse();

    const calculateTimeLeft = () => {
      const ramadhanDate = new Date("February 18, 2026 00:00:00").getTime();
      const now = new Date().getTime();
      const difference = ramadhanDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
        setIsRamadhan(false);
      } else {
        setIsRamadhan(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchDailyVerse = async (forceRefresh = false) => {
    setLoading(true);
    const today = new Date().toDateString();
    const storedData = localStorage.getItem("verseOfTheDay");

    if (storedData && !forceRefresh) {
      const parsedData = JSON.parse(storedData);
      if (parsedData.date === today) {
        setRandomAyat(parsedData.verse);
        setLoading(false);
        return;
      }
    }

    try {
      const res = await axios.get("https://api.myquran.com/v3/quran/random");
      if (res.data.status) {
        const verseData = res.data.data;
        setRandomAyat(verseData);
        if (!forceRefresh) {
          localStorage.setItem(
            "verseOfTheDay",
            JSON.stringify({
              date: today,
              verse: verseData,
            }),
          );
        }
      }
    } catch (err) {
      console.error("Gagal mengambil ayat:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden mb-8 group rounded-[2.5rem]">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 dark:from-emerald-900 dark:via-slate-900 dark:to-emerald-950 shadow-2xl shadow-emerald-500/20"></div>
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl group-hover:bg-blue-400/20 transition-all duration-700"></div>

      <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
        {/* Left Side: Greeting/Countdown */}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-emerald-100 text-sm font-bold mb-4 border border-white/10">
            <Sparkles size={16} className="text-yellow-300 animate-pulse" />
            Ramadhan Kareem 1447H
          </div>

          {isRamadhan ? (
            <>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
                Marhaban ya Ramadhan!
              </h2>
              <p className="text-emerald-50/80 text-lg max-w-lg">
                Semoga bulan yang suci ini membawa kedamaian, kebahagiaan, dan
                keberkahan bagi kita semua.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
                Menuju Bulan Suci Ramadhan
              </h2>
              <div className="grid grid-cols-4 md:flex gap-2 md:gap-4">
                {[
                  { label: "Hari", value: timeLeft.days },
                  { label: "Jam", value: timeLeft.hours },
                  { label: "Menit", value: timeLeft.minutes },
                  { label: "Detik", value: timeLeft.seconds },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-2 md:p-3 min-w-[60px] md:min-w-[70px] transition-transform hover:scale-105"
                  >
                    <span className="text-xl md:text-3xl font-black text-white">
                      {item.value}
                    </span>
                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-emerald-200 mt-1">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Side: Verse of the Day Card */}
        <div className="w-full md:w-[450px]">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl relative overflow-hidden group/card shadow-emerald-900/20 min-h-[220px] flex flex-col justify-center">
            {loading ? (
              <div className="flex flex-col items-center justify-center space-y-3 animate-pulse">
                <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
                <p className="text-white/50 text-xs font-bold uppercase tracking-widest">
                  Memuat Ayat...
                </p>
              </div>
            ) : randomAyat ? (
              <>
                <div className="absolute top-0 right-10 p-4 opacity-10 pointer-events-none">
                  <Quote size={80} className="text-white" />
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/30">
                      <Book size={18} className="text-white" />
                    </div>
                    <span className="text-white font-bold tracking-wide uppercase text-xs">
                      Ayat Hari Ini
                    </span>
                  </div>
                  <button
                    onClick={() => fetchDailyVerse(true)}
                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 hover:text-white transition-all active:scale-95 group/btn"
                    title="Ganti Ayat"
                  >
                    <RotateCcw
                      size={14}
                      className="group-hover/btn:rotate-[-180deg] transition-transform duration-500"
                    />
                  </button>
                </div>

                <p
                  className="text-right text-2xl font-arabic text-white mb-4 leading-loose"
                  dir="rtl"
                >
                  {randomAyat.arab}
                </p>
                <p className="text-emerald-50/90 text-sm italic mb-4 line-clamp-3">
                  "{randomAyat.translation}"
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[10px] font-bold text-emerald-300 px-3 py-1 bg-emerald-900/50 rounded-full border border-emerald-500/30">
                    QS. {randomAyat.surah.name_latin}: {randomAyat.ayah_number}
                  </span>
                  <Link
                    to={`/baca/${randomAyat.surah_number}#verse-${randomAyat.ayah_number}`}
                    className="text-xs font-bold text-white flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10"
                  >
                    <BookOpen size={14} />
                    Baca Ayat
                  </Link>
                </div>
              </>
            ) : (
              <p className="text-white/50 text-center text-sm">
                Gagal memuat ayat.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
