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
import SEO from "@/components/SEO";
import ThemeToggle from "@/components/ThemeToggle";
import Toast from "@/components/Toast";

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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300 pb-20">
      <SEO
        title="Tanya AI - Pencarian Pintar Al-Quran"
        description="Cari ayat, tafsir, dan doa menggunakan kecerdasan buatan (Vector Search) di Al-Qur'an Indonesia."
      />

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-100 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between font-bold text-gray-900 border-gray-100 uppercase dark:text-neutral-50 ">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 px-4 py-2 rounded-2xl transition-all active:scale-95"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
            <span className="hidden sm:inline">Kembali</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-600/20">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Tanya AI
            </h1>
          </div>

          <ThemeToggle />
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-bold mb-6 animate-fade-in">
            <Sparkles size={16} className="animate-pulse" />
            <span>AI Semantic Search</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 animate-slide-up">
            Tanya Al-Qur'an
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed animate-fade-in delay-100">
            Temukan ayat, tafsir, dan doa berdasarkan makna dan konteks
            pertanyaan Anda.
          </p>
        </div>

        {/* Search Input Card */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none p-2 mb-12 border border-gray-100 dark:border-slate-800 animate-fade-in delay-200">
          <form
            onSubmit={handleAISearch}
            className="relative flex items-center"
          >
            <div className="absolute left-6 text-emerald-500">
              <Search size={24} strokeWidth={2.5} />
            </div>
            <input
              type="text"
              value={vectorQuery}
              onChange={(e) => setVectorQuery(e.target.value)}
              placeholder="Contoh: ayat tentang kesabaran..."
              className="w-full pl-16 pr-40 py-6 text-xl bg-transparent border-0 focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={loading || !vectorQuery.trim()}
              className="absolute right-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50 disabled:shadow-none"
            >
              {isSearchingAI ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Mencari...
                </span>
              ) : (
                "Tanya AI"
              )}
            </button>
          </form>
        </div>

        {/* Info Grid */}
        {vectorResults.length === 0 && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in delay-300 text-center md:text-left">
            {[
              {
                icon: <MessageSquare className="text-emerald-500" />,
                title: "Bahasa Natural",
                desc: "Gunakan bahasa sehari-hari seperti 'cara bersyukur' atau 'hukum riba'.",
              },
              {
                icon: <BookOpen className="text-blue-500" />,
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
                className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-8 rounded-3xl hover:border-emerald-500/30 transition-colors"
              >
                <div className="w-12 h-12 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 mx-auto md:mx-0">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-40 bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 animate-pulse"
              ></div>
            ))}
          </div>
        )}

        {/* Results Section */}
        {!loading && vectorResults.length > 0 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Ditemukan {vectorResults.length} hasil relevan
              </h2>
              <button
                onClick={() => setVectorResults([])}
                className="text-sm text-gray-400 hover:text-red-500 font-bold transition-colors"
              >
                Bersihkan Pencarian
              </button>
            </div>

            {vectorResults.map((result, idx) => (
              <div
                key={idx}
                className="group bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 p-6 md:p-8 hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-500/20 transition-all duration-300"
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
                        <div className="flex flex-col-reverse md:flex-row md:items-start justify-between gap-4 mb-4">
                          <h4 className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">
                            QS. {result.data.nama_surat} :{" "}
                            {result.data.nomor_ayat}
                          </h4>
                          <div
                            className="text-right font-arabic text-2xl leading-loose text-gray-900 dark:text-white"
                            dir="rtl"
                          >
                            {result.data.teks_arab}
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed italic border-l-4 border-gray-100 dark:border-slate-800 pl-4 py-1">
                          "{result.data.terjemahan_id}"
                        </p>
                      </>
                    )}

                    {result.tipe === "tafsir" && (
                      <>
                        <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-3 text-lg">
                          Tafsir {result.data.nama_surat} :{" "}
                          {result.data.nomor_ayat}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
                          {result.data.isi}
                        </p>
                      </>
                    )}

                    {result.tipe === "doa" && (
                      <>
                        <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-2 text-lg">
                          {result.data.judul}
                        </h4>
                        <span className="text-[10px] bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-md mb-6 inline-block font-bold">
                          {result.data.grup}
                        </span>
                        <div
                          className="text-right font-arabic text-2xl leading-loose text-gray-900 dark:text-white mb-4"
                          dir="rtl"
                        >
                          {result.data.teks_arab}
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {result.data.terjemahan}
                        </p>
                      </>
                    )}

                    <div className="mt-6 pt-6 border-t border-gray-50 dark:border-slate-800/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            result.skor > 0.8
                              ? "bg-emerald-500"
                              : "bg-yellow-500"
                          }`}
                        ></div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Relevansi: {Math.round(result.skor * 100)}%
                        </span>
                      </div>
                      {result.tipe !== "doa" ? (
                        <Link
                          to={
                            result.tipe === "surat" || result.tipe === "ayat"
                              ? `/baca/${result.data.nomor}`
                              : `/baca/${result.data.id_surat}#verse-${result.data.nomor_ayat}`
                          }
                          className="flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:gap-3 transition-all px-4 py-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
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
                          className="flex items-center gap-2 text-sm font-bold text-purple-600 dark:text-purple-400 px-4 py-2 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
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
      </main>

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
