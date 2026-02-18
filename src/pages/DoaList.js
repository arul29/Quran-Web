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
  Filter,
  X,
} from "lucide-react";
import SEO from "@/components/SEO";
import Toast from "@/components/Toast";
import ThemeToggle from "@/components/ThemeToggle";

export default function DoaList() {
  const [loading, setLoading] = useState(true);
  const [doaList, setDoaList] = useState([]);
  const [filteredDoa, setFilteredDoa] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrup, setSelectedGrup] = useState("");
  const [grupList, setGrupList] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
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
  }, [searchQuery, selectedGrup, doaList]);

  const fetchDoaList = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://equran.id/api/doa");

      if (response.data.status === "success") {
        setDoaList(response.data.data);

        // Extract unique groups
        const groups = [...new Set(response.data.data.map((doa) => doa.grup))];
        setGrupList(groups.sort());
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

    // Filter by category
    if (selectedGrup) {
      filtered = filtered.filter((doa) => doa.grup === selectedGrup);
    }

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
        <div className="mb-12 space-y-4">
          <div className="flex gap-3">
            <div className="relative group flex-1">
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
            <button
              onClick={() => setShowFilterModal(true)}
              className={`px-6 py-5 rounded-3xl border transition-all duration-300 flex items-center gap-2 font-bold ${
                selectedGrup
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/20"
                  : "bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-200 border-gray-100 dark:border-slate-800 hover:border-emerald-500/30 shadow-2xl shadow-emerald-500/5"
              }`}
            >
              <Filter size={20} strokeWidth={2.5} />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>

          {/* Active Filter Badge */}
          {selectedGrup && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Kategori:
              </span>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl font-medium">
                {selectedGrup}
                <button
                  onClick={() => setSelectedGrup("")}
                  className="p-1 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 rounded-lg transition-colors"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 animate-pulse border border-gray-100 dark:border-slate-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
                    <div className="w-8 h-8 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="w-20 h-6 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
                  <div className="h-7 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
                  <div className="flex gap-2 pt-2">
                    <div className="w-12 h-5 bg-gray-200 dark:bg-slate-700 rounded-md"></div>
                    <div className="w-12 h-5 bg-gray-200 dark:bg-slate-700 rounded-md"></div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700 flex justify-between">
                  <div className="w-20 h-4 bg-gray-200 dark:bg-slate-700 rounded"></div>
                  <div className="w-24 h-4 bg-gray-200 dark:bg-slate-700 rounded"></div>
                </div>
              </div>
            ))}
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
                  className="group flex flex-col h-full bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl dark:hover:shadow-emerald-900/10 transition-all duration-300 overflow-hidden border border-gray-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800"
                >
                  <div className="p-6 flex-1 flex flex-col">
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

                    <div className="space-y-3 flex-1">
                      <div>
                        <span className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs font-medium mb-2">
                          {doa.grup}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200 line-clamp-2">
                        {doa.nama}
                      </h3>

                      {doa.tag && doa.tag.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap pt-2">
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

                  <div className="px-6 py-3 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-700 mt-auto">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">
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

      {/* Filter Modal */}
      {showFilterModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowFilterModal(false)}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Filter Kategori
              </h2>
              <button
                onClick={() => setShowFilterModal(false)}
                className="p-2 rounded-xl bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
              >
                <X size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-2">
              <button
                onClick={() => {
                  setSelectedGrup("");
                  setShowFilterModal(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl transition-colors font-medium ${
                  selectedGrup === ""
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                    : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                }`}
              >
                Semua Kategori
              </button>
              {grupList.map((grup) => (
                <button
                  key={grup}
                  onClick={() => {
                    setSelectedGrup(grup);
                    setShowFilterModal(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors font-medium ${
                    selectedGrup === grup
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                      : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                  }`}
                >
                  {grup}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
