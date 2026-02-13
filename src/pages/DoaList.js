import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Search,
  BookOpen,
  Loader,
  HelpCircle,
  HandHeart,
  ArrowRight,
  Heart,
} from "lucide-react";
import SEO from "@/components/SEO";
import Toast from "@/components/Toast";
import ThemeToggle from "@/components/ThemeToggle";

export default function DoaList() {
  const [loading, setLoading] = useState(true);
  const [doaList, setDoaList] = useState([]);
  const [filteredDoa, setFilteredDoa] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Check if this is a back navigation with saved scroll position
    const savedScrollPos = sessionStorage.getItem("doaListScrollPos");
    const isBackNavigation = sessionStorage.getItem("doaListScrollRestore");

    if (!savedScrollPos && !isBackNavigation) {
      // Fresh navigation - scroll to top immediately
      window.scrollTo(0, 0);
    }

    fetchDoaList();
    loadBookmarks();
  }, []);

  // Restore scroll position after data is loaded (for back navigation)
  useEffect(() => {
    if (!loading && filteredDoa.length > 0) {
      const savedScrollPos = sessionStorage.getItem("doaListScrollPos");
      const isBackNavigation = sessionStorage.getItem("doaListScrollRestore");

      if (savedScrollPos && isBackNavigation) {
        // Small delay to ensure DOM is fully rendered
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedScrollPos));
          sessionStorage.removeItem("doaListScrollPos");
          sessionStorage.removeItem("doaListScrollRestore");
        }, 50);
      }
    }
  }, [loading, filteredDoa]);

  useEffect(() => {
    filterDoa();
  }, [searchQuery, doaList]);

  const fetchDoaList = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://equran.id/api/doa");

      if (response.data.status === "success") {
        setDoaList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching doa:", error);
      showToast("Gagal memuat daftar doa", "error");
    } finally {
      setLoading(false);
    }
  };

  const filterDoa = () => {
    let filtered = doaList;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (doa) =>
          doa.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doa.idn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doa.tr.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doa.grup.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doa.tag.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    setFilteredDoa(filtered);
  };

  const loadBookmarks = () => {
    const saved = localStorage.getItem("doaBookmarks");
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  };

  const toggleBookmark = (e, doaId) => {
    e.preventDefault();
    let newBookmarks;
    if (bookmarks.includes(doaId)) {
      newBookmarks = bookmarks.filter((id) => id !== doaId);
      showToast("Doa dihapus dari favorit", "success");
    } else {
      newBookmarks = [...bookmarks, doaId];
      showToast("Doa ditambahkan ke favorit", "success");
    }
    setBookmarks(newBookmarks);
    localStorage.setItem("doaBookmarks", JSON.stringify(newBookmarks));
  };

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <SEO
        title="Daftar Doa Harian - Al-Qur'an Indonesia"
        description="Kumpulan doa-doa harian dari Al-Qur'an dan Hadits Shahih dengan teks Arab, transliterasi, dan terjemahan Bahasa Indonesia."
      />

      {/* Header Section */}
      <div className="relative overflow-hidden bg-[#0a2e26] dark:bg-slate-950 pt-20 pb-16 sm:py-24 px-4 sm:px-6">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/50 to-[#0a2e26] dark:to-slate-950"></div>
        </div>

        <div className="absolute top-6 right-6 z-50 flex items-center gap-2">
          <ThemeToggle />
          <Link
            to="/bantuan"
            className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl backdrop-blur-md text-white transition-all active:scale-95 group border border-white/10"
            title="Pusat Bantuan"
          >
            <HelpCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </Link>
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] animate-fade-in">
            Doa Harian
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tight animate-slide-up leading-[1.1]">
            Daftar <span className="text-emerald-400">Doa</span>
          </h1>

          <p className="text-lg text-emerald-100/60 max-w-xl mx-auto leading-relaxed animate-fade-in delay-100 px-4">
            Kumpulan doa-doa harian dari Al-Qur'an dan Hadits Shahih dengan teks
            Arab, transliterasi, dan terjemahan.
          </p>

          <div className="flex items-center justify-center gap-3 pt-4 animate-fade-in delay-200">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold transition-all border border-white/10 active:scale-95"
            >
              <BookOpen size={18} />
              Baca Al-Qur'an
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-12">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search
                className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors"
                strokeWidth={2.5}
              />
            </div>
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
              type="search"
              className="w-full pl-14 pr-6 py-5 text-lg border border-gray-100 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-2xl shadow-emerald-500/5 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none transition-all duration-300 dark:text-white dark:placeholder-gray-500"
              placeholder="Cari doa berdasarkan nama, kategori, atau tag..."
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="w-12 h-12 text-emerald-600 dark:text-emerald-400 animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Memuat Daftar Doa...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoa.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <HandHeart
                  className="w-12 h-12 text-gray-400 mx-auto mb-6"
                  strokeWidth={1.5}
                />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Tidak ada doa yang ditemukan
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Coba gunakan kata kunci yang berbeda
                </p>
              </div>
            ) : (
              filteredDoa.map((doa) => (
                <Link
                  key={doa.id}
                  to={`/doa/${doa.id}`}
                  onClick={() => {
                    sessionStorage.setItem("doaListScrollRestore", "true");
                    sessionStorage.setItem(
                      "doaListScrollPos",
                      window.pageYOffset.toString(),
                    );
                  }}
                  className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl dark:hover:shadow-emerald-900/10 transition-all duration-300 overflow-hidden border border-gray-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 dark:from-emerald-600 dark:to-emerald-800 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-105 transition-transform duration-200">
                        <HandHeart size={28} strokeWidth={2} />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => toggleBookmark(e, doa.id)}
                          className={`p-2 rounded-full transition-colors ${
                            bookmarks.includes(doa.id)
                              ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                              : "bg-gray-50 dark:bg-slate-700/50 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                          }`}
                          title={
                            bookmarks.includes(doa.id)
                              ? "Hapus dari favorit"
                              : "Tambah ke favorit"
                          }
                        >
                          <Heart
                            size={18}
                            fill={
                              bookmarks.includes(doa.id)
                                ? "currentColor"
                                : "none"
                            }
                            strokeWidth={2.5}
                          />
                        </button>
                        <div className="p-2 rounded-full bg-gray-50 dark:bg-slate-700/50 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-colors duration-200">
                          <ArrowRight
                            className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-200"
                            strokeWidth={2.5}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs font-medium mb-2">
                          {doa.grup}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200 line-clamp-2">
                        {doa.nama}
                      </h3>

                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {doa.idn}
                      </p>

                      {doa.tag && doa.tag.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          {doa.tag.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded-md text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                          {doa.tag.length > 3 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              +{doa.tag.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        {bookmarks.includes(doa.id)
                          ? "★ Favorit"
                          : "Lihat Detail"}
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform duration-200">
                        Baca Sekarang →
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
