import React, { useState, useEffect } from "react";
import { Sparkles, Quran, Quote } from "lucide-react";

const RAMADHAN_AYATS = [
  {
    surah: "Al-Baqarah",
    ayat: 183,
    text: "Wahai orang-orang yang beriman! Diwajibkan atas kamu berpuasa sebagaimana diwajibkan atas orang sebelum kamu agar kamu bertakwa.",
    arabic:
      "يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ",
  },
  {
    surah: "Al-Baqarah",
    ayat: 185,
    text: "Bulan Ramadhan adalah (bulan) yang di dalamnya diturunkan Al-Qur'an, sebagai petunjuk bagi manusia dan penjelasan-penjelasan mengenai petunjuk itu dan pembeda (antara yang benar dan yang salah).",
    arabic:
      "شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ هُدًى لِّلنَّاسِ وَبَيِّنَاتٍ مِّنَ الْهُدَىٰ وَالْفُرْقَانِ",
  },
  {
    surah: "Al-Qadr",
    ayat: 1,
    text: "Sesungguhnya Kami telah menurunkannya (Al-Qur'an) pada malam qadar.",
    arabic: "إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ",
  },
];

export default function RamadhanBanner() {
  const [randomAyat, setRandomAyat] = useState(RAMADHAN_AYATS[0]);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isRamadhan, setIsRamadhan] = useState(false);

  useEffect(() => {
    const index = Math.floor(Math.random() * RAMADHAN_AYATS.length);
    setRandomAyat(RAMADHAN_AYATS[index]);

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
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl relative overflow-hidden group/card shadow-emerald-900/20">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Quote size={80} className="text-white" />
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/30">
                <Sparkles size={18} className="text-white" />
              </div>
              <span className="text-white font-bold tracking-wide uppercase text-xs">
                Ayat Hari Ini
              </span>
            </div>

            <p
              className="text-right text-2xl font-arabic text-white mb-4 leading-loose"
              dir="rtl"
            >
              {randomAyat.arabic}
            </p>
            <p className="text-emerald-50/90 text-sm italic mb-4 line-clamp-3">
              "{randomAyat.text}"
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300 px-3 py-1 bg-emerald-900/50 rounded-full border border-emerald-500/30">
                QS. {randomAyat.surah}: {randomAyat.ayat}
              </span>
              <button
                className="text-xs font-bold text-white flex items-center gap-1 hover:gap-2 transition-all group-hover/card:translate-x-1"
                onClick={() => {
                  const index = Math.floor(
                    Math.random() * RAMADHAN_AYATS.length,
                  );
                  setRandomAyat(RAMADHAN_AYATS[index]);
                }}
              >
                Ganti Ayat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
