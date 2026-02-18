import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Search,
  BookOpen,
  Compass,
  Library,
  ArrowLeft,
  HandHeart,
} from "lucide-react";
import SEO from "@/components/SEO";

const quickLinks = [
  {
    to: "/",
    icon: BookOpen,
    label: "Al-Qur'an",
    desc: "Baca surah",
    color: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/30",
  },
  {
    to: "/juz",
    icon: Library,
    label: "Per Juz",
    desc: "30 Juz",
    color: "from-blue-500 to-indigo-600",
    shadow: "shadow-blue-500/30",
  },
  {
    to: "/qiblat",
    icon: Compass,
    label: "Qiblat",
    desc: "Arah kiblat",
    color: "from-amber-500 to-orange-600",
    shadow: "shadow-amber-500/30",
  },
  {
    to: "/doa",
    icon: HandHeart,
    label: "Doa",
    desc: "Kumpulan doa",
    color: "from-pink-500 to-rose-600",
    shadow: "shadow-pink-500/30",
  },
];

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger entrance animation after mount
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0a2e26] via-emerald-950 to-slate-950 overflow-hidden flex flex-col">
      <SEO
        title="404 – Halaman Tidak Ditemukan"
        description="Maaf, halaman yang Anda cari tidak dapat ditemukan di Quran Web."
      />

      {/* ── Decorative blobs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute -bottom-40 -right-20 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[140px] animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "0.75s" }}
        />
        {/* Islamic art pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]" />
      </div>

      {/* ── Main content ── */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-16">
        {/* Floating 404 badge */}
        <div
          className="transition-all duration-700"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(-24px)",
          }}
        >
          {/* Outer glow ring */}
          <div className="relative mx-auto mb-10 w-44 h-44 flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping"
              style={{ animationDuration: "2.5s" }}
            />
            <div
              className="absolute inset-2 rounded-full bg-emerald-500/10 animate-ping"
              style={{ animationDuration: "2.5s", animationDelay: "0.4s" }}
            />

            {/* Circle card */}
            <div className="relative w-full h-full rounded-full bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center shadow-2xl shadow-black/40">
              <span
                className="text-6xl font-black leading-none"
                style={{
                  background: "linear-gradient(135deg, #34d399, #059669)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                404
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400/70 mt-1">
                Not Found
              </span>
            </div>
          </div>
        </div>

        {/* Text block */}
        <div
          className="text-center max-w-md space-y-4 transition-all duration-700 delay-100"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Halaman <span className="text-emerald-400">Tidak</span> Ditemukan
          </h1>
          <p className="text-emerald-100/50 text-base sm:text-lg leading-relaxed">
            Sepertinya halaman yang Anda cari sudah berpindah atau tidak pernah
            ada. Jangan khawatir, kami siap membantu Anda kembali ke jalur yang
            benar.
          </p>
        </div>

        {/* Primary actions */}
        <div
          className="mt-10 flex flex-col sm:flex-row gap-3 w-full max-w-sm transition-all duration-700 delay-200"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <Link
            to="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-bold shadow-xl shadow-emerald-500/30 transition-all active:scale-95 group"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Ke Beranda
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-2xl font-bold backdrop-blur-sm transition-all active:scale-95 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Kembali
          </button>
        </div>

        {/* Divider */}
        <div
          className="mt-12 flex items-center gap-4 w-full max-w-sm transition-all duration-700 delay-300"
          style={{
            opacity: mounted ? 1 : 0,
          }}
        >
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs font-bold text-white/30 uppercase tracking-widest">
            Atau kunjungi
          </span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Quick links grid */}
        <div
          className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-sm sm:max-w-xl transition-all duration-700 delay-[400ms]"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
          }}
        >
          {quickLinks.map(({ to, icon: Icon, label, desc, color, shadow }) => (
            <Link
              key={to}
              to={to}
              className={`group flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-sm transition-all active:scale-95`}
            >
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg ${shadow} group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-white">{label}</p>
                <p className="text-[10px] text-white/40">{desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Search shortcut */}
        <div
          className="mt-6 w-full max-w-sm transition-all duration-700 delay-500"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(12px)",
          }}
        >
          <Link
            to="/tanya-ai"
            className="flex items-center gap-3 w-full px-5 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/40 rounded-2xl backdrop-blur-sm transition-all group"
          >
            <div className="p-2 bg-emerald-500/20 rounded-xl group-hover:bg-emerald-500/30 transition-colors">
              <Search className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-xs font-bold text-white">Cari dengan AI</p>
              <p className="text-[10px] text-white/40">
                Temukan ayat & doa yang Anda butuhkan
              </p>
            </div>
            <div className="text-white/20 group-hover:text-emerald-400 transition-colors text-lg">
              →
            </div>
          </Link>
        </div>
      </div>

      {/* ── Bottom quote ── */}
      <div
        className="relative pb-10 text-center px-4 transition-all duration-700 delay-700"
        style={{ opacity: mounted ? 1 : 0 }}
      >
        <p className="text-[11px] italic text-white/20 max-w-xs mx-auto leading-relaxed">
          "Barangsiapa yang menempuh jalan untuk mencari ilmu, maka Allah akan
          memudahkan baginya jalan menuju surga."
          <span className="not-italic font-bold text-white/30">
            {" "}
            — HR. Muslim
          </span>
        </p>
      </div>

      {/* Custom entrance animation */}
      <style>{`
        @keyframes float-up {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
