import React, { useState } from "react";
import axios from "axios";
import {
  Search,
  ArrowLeft,
  Sparkles,
  ChevronRight,
  Info,
  Copy,
  BookOpen,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import ThemeToggle from "../components/ThemeToggle";
import Toast from "../components/Toast";

export default function SmartSearch() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [vectorQuery, setVectorQuery] = useState("");
  const [vectorResults, setVectorResults] = useState([]);
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [toast, setToast] = useState(null);

  // Load from sessionStorage on mount
  React.useEffect(() => {
    const savedQuery = sessionStorage.getItem("vectorQuery");
    const savedResults = sessionStorage.getItem("vectorResults");
    if (savedQuery) setVectorQuery(savedQuery);
    if (savedResults) setVectorResults(JSON.parse(savedResults));
  }, []);

  // Save to sessionStorage on change
  React.useEffect(() => {
    sessionStorage.setItem("vectorQuery", vectorQuery);
    sessionStorage.setItem("vectorResults", JSON.stringify(vectorResults));
  }, [vectorQuery, vectorResults]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleAISearch = async (e) => {
    if (e) e.preventDefault();
    if (!vectorQuery.trim()) return;

    setIsSearchingAI(true);
    setLoading(true);
    try {
      const res = await axios.post("https://equran.id/api/vector", {
        cari: vectorQuery,
      });

      if (res.data.status === "sukses") {
        setVectorResults(res.data.hasil);
      } else {
        showToast("Gagal melakukan pencarian AI", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Terjadi kesalahan pada server AI", "error");
    } finally {
      setIsSearchingAI(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <SEO
        title="Tanya AI - Pencarian Pintar Al-Quran"
        description="Cari ayat, tafsir, dan doa menggunakan kecerdasan buatan (Vector Search) di Al-Qur'an Indonesia."
      />

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-slate-900 dark:to-blue-950 py-12">
        <div className="absolute top-4 left-4 z-50">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-md text-white border border-white/10 transition-all active:scale-95"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-400/20 border border-blue-400/30 text-blue-100 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
            <Sparkles size={14} className="animate-pulse" />
            AI Semantic Search
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Tanya Al-Qur'an
          </h1>
          <p className="text-blue-100/80 max-w-2xl mx-auto text-lg">
            Temukan ayat, tafsir, dan doa berdasarkan makna dan konteks
            pertanyaan Anda.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 -mt-8">
        {/* Search Input Card */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-2 mb-12 border border-slate-100 dark:border-slate-800">
          <form
            onSubmit={handleAISearch}
            className="relative flex items-center"
          >
            <div className="absolute left-6 text-blue-500">
              <Sparkles size={24} strokeWidth={2.5} />
            </div>
            <input
              type="text"
              value={vectorQuery}
              onChange={(e) => setVectorQuery(e.target.value)}
              placeholder="Apa yang ingin Anda cari hari ini?"
              className="w-full pl-16 pr-40 py-6 text-xl bg-transparent border-0 focus:ring-0 dark:text-white placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={loading || !vectorQuery.trim()}
              className="absolute right-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50"
            >
              {isSearchingAI ? "Mencari..." : "Tanya AI"}
            </button>
          </form>
        </div>

        {/* Info Grid */}
        {vectorResults.length === 0 && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in text-center md:text-left">
            {[
              {
                icon: <MessageSquare className="text-blue-500" />,
                title: "Bahasa Natural",
                desc: "Gunakan bahasa sehari-hari seperti 'cara bersyukur' atau 'hukum riba'.",
              },
              {
                icon: <Search className="text-emerald-500" />,
                title: "Lintas Data",
                desc: "Pencarian mencakup Ayat, Tafsir, dan Kumpulan Doa sekaligus.",
              },
              {
                icon: <Info className="text-purple-500" />,
                title: "Paham Konteks",
                desc: "AI memahami arti pertanyaan, bukan hanya sekadar kata kunci.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-100 dark:border-slate-800 p-6 rounded-3xl"
              >
                <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl shadow-sm flex items-center justify-center mb-4 mx-auto md:mx-0">
                  {item.icon}
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-48 bg-white dark:bg-slate-900 rounded-[2rem] animate-pulse"
              ></div>
            ))}
          </div>
        )}

        {/* Results Section */}
        {!loading && vectorResults.length > 0 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-xl font-bold dark:text-white">
                Ditemukan {vectorResults.length} hasil relevan
              </h2>
              <button
                onClick={() => setVectorResults([])}
                className="text-sm text-slate-400 hover:text-red-500 font-bold"
              >
                Bersihkan
              </button>
            </div>

            {vectorResults.map((result, idx) => (
              <div
                key={idx}
                className="group bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 md:p-8 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <span
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        result.tipe === "ayat"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : result.tipe === "tafsir"
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            : result.tipe === "doa"
                              ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {result.tipe}
                    </span>
                  </div>

                  <div className="flex-1">
                    {result.tipe === "ayat" && (
                      <>
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="font-bold text-blue-600 dark:text-blue-400">
                            Surah {result.data.nama_surat} :{" "}
                            {result.data.nomor_ayat}
                          </h4>
                          <div
                            className="text-right font-arabic text-2xl leading-loose text-slate-800 dark:text-slate-100 mb-4"
                            dir="rtl"
                          >
                            {result.data.teks_arab}
                          </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic">
                          "{result.data.terjemahan_id}"
                        </p>
                      </>
                    )}

                    {result.tipe === "tafsir" && (
                      <>
                        <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-2">
                          Tafsir {result.data.nama_surat} :{" "}
                          {result.data.nomor_ayat}
                        </h4>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
                          {result.data.isi}
                        </p>
                      </>
                    )}

                    {result.tipe === "doa" && (
                      <>
                        <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-2">
                          {result.data.judul}
                        </h4>
                        <span className="text-[10px] bg-purple-50 dark:bg-purple-900/20 text-purple-500 px-2 py-0.5 rounded-md mb-4 inline-block font-bold">
                          {result.data.grup}
                        </span>
                        <div
                          className="text-right font-arabic text-2xl leading-loose text-slate-800 dark:text-slate-100 mb-4"
                          dir="rtl"
                        >
                          {result.data.teks_arab}
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                          {result.data.terjemahan}
                        </p>
                      </>
                    )}

                    <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Ketepatan: {Math.round(result.skor * 100)}%
                        </span>
                      </div>
                      {result.tipe !== "doa" ? (
                        <Link
                          to={
                            result.tipe === "surat"
                              ? `/baca/${result.data.nomor}`
                              : `/baca/${result.data.id_surat}#verse-${result.data.nomor_ayat}`
                          }
                          className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:gap-3 transition-all"
                        >
                          Lihat Detail
                          <ChevronRight size={16} />
                        </Link>
                      ) : (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `${result.data.teks_arab}\n\n${result.data.terjemahan}`,
                            );
                            showToast("Doa berhasil disalin!", "success");
                          }}
                          className="flex items-center gap-2 text-sm font-bold text-purple-600 dark:text-purple-400"
                        >
                          <Copy size={16} />
                          Salin
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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

// Reuse icon for the card above that isn't imported
function MessageSquare({ className, size = 20 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
