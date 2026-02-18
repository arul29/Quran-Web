import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ChevronLeft,
  Heart,
  Share2,
  Loader,
  Copy,
  Check,
  MessageCircle,
  Twitter,
  Facebook,
  Link2,
  MoreHorizontal,
} from "lucide-react";
import { RawHTML } from "@/helpers";
import SEO from "@/components/SEO";
import Toast from "@/components/Toast";

export default function DoaRead() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [doa, setDoa] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [toast, setToast] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDoa();
    checkBookmark();
  }, [id]);

  const fetchDoa = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://equran.id/api/doa/${id}`);

      if (response.data.status === "success") {
        setDoa(response.data.data);
      } else {
        showToast("Doa tidak ditemukan", "error");
        navigate("/doa");
      }
    } catch (error) {
      console.error("Error fetching doa:", error);
      showToast("Gagal memuat doa", "error");
      navigate("/doa");
    } finally {
      setLoading(false);
    }
  };

  const checkBookmark = () => {
    const saved = localStorage.getItem("doaBookmarks");
    if (saved) {
      const bookmarks = JSON.parse(saved);
      setIsBookmarked(bookmarks.includes(parseInt(id)));
    }
  };

  const toggleBookmark = () => {
    const saved = localStorage.getItem("doaBookmarks");
    let bookmarks = saved ? JSON.parse(saved) : [];
    const doaId = parseInt(id);

    if (bookmarks.includes(doaId)) {
      bookmarks = bookmarks.filter((id) => id !== doaId);
      setIsBookmarked(false);
      showToast("Doa dihapus dari favorit", "success");
    } else {
      bookmarks.push(doaId);
      setIsBookmarked(true);
      showToast("Doa ditambahkan ke favorit", "success");
    }

    localStorage.setItem("doaBookmarks", JSON.stringify(bookmarks));
  };

  const handleShare = () => {
    setShareModalOpen(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast("Teks berhasil disalin", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToWhatsApp = () => {
    const text = `${doa.nama}\n\n${doa.ar}\n\n${doa.tr}\n\nArtinya: ${doa.idn}\n\nLihat selengkapnya: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareToTwitter = () => {
    const text = `${doa.nama}\n\n${doa.ar}\n\nArtinya: ${doa.idn}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`,
      "_blank",
    );
  };

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
      "_blank",
    );
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast("Link berhasil disalin", "success");
  };

  const triggerNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: doa.nama,
          text: `${doa.ar}\n\n${doa.tr}\n\nArtinya: ${doa.idn}`,
          url: window.location.href,
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

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pt-20">
        <div className="max-w-4xl mx-auto px-4 space-y-6 animate-pulse">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700">
            <div className="w-20 h-6 bg-gray-200 dark:bg-slate-700 rounded-lg mb-3"></div>
            <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-2/3 mb-4"></div>
            <div className="flex gap-2">
              <div className="w-16 h-7 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
              <div className="w-16 h-7 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-100 dark:border-slate-700">
            <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-32 mb-6"></div>
            <div className="h-24 bg-gray-200 dark:bg-slate-700 rounded w-full mx-auto"></div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700">
            <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-32 mb-4"></div>
            <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!doa) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <SEO title={`${doa.nama} - Doa Harian`} description={doa.idn} />

      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors text-gray-700 dark:text-gray-200 font-semibold"
            >
              <ChevronLeft size={20} />
              <span className="hidden sm:inline">Kembali</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleBookmark}
                className={`p-2 rounded-xl transition-colors ${
                  isBookmarked
                    ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                    : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400"
                }`}
                title={
                  isBookmarked ? "Hapus dari favorit" : "Tambah ke favorit"
                }
              >
                <Heart
                  size={20}
                  fill={isBookmarked ? "currentColor" : "none"}
                />
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400 transition-colors"
                title="Bagikan Doa"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Doa Header */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
          <span className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm font-medium mb-3">
            {doa.grup}
          </span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {doa.nama}
          </h1>

          {/* Tags */}
          {doa.tag && doa.tag.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {doa.tag.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded-lg text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Arabic Text */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Teks Arab
            </h2>
            <button
              onClick={() => copyToClipboard(doa.ar)}
              className="p-2 rounded-xl bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-600 dark:text-gray-400 transition-colors"
              title="Salin teks Arab"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
          <p
            className="text-3xl font-arabic leading-loose text-gray-900 dark:text-white text-center"
            dir="rtl"
          >
            {doa.ar}
          </p>
        </div>

        {/* Transliteration */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Transliterasi
          </h2>
          <p className="text-lg italic text-gray-700 dark:text-gray-300 leading-relaxed">
            {doa.tr}
          </p>
        </div>

        {/* Translation */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Terjemahan
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {doa.idn}
          </p>
        </div>

        {/* About/Source */}
        {doa.tentang && (
          <div className="bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 shadow-sm border border-blue-100 dark:border-slate-600">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Keterangan & Sumber
            </h2>
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
              <RawHTML>{doa.tentang}</RawHTML>
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {shareModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setShareModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Bagikan Doa
              </h3>

              <div className="grid grid-cols-4 gap-4 mb-4">
                <button
                  onClick={shareToWhatsApp}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-800/40 transition-colors"
                >
                  <MessageCircle
                    className="text-green-600 dark:text-green-400"
                    size={24}
                  />
                  <span className="text-xs text-green-700 dark:text-green-300 font-medium">
                    WhatsApp
                  </span>
                </button>

                <button
                  onClick={shareToTwitter}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors"
                >
                  <Twitter
                    className="text-blue-600 dark:text-blue-400"
                    size={24}
                  />
                  <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                    Twitter
                  </span>
                </button>

                <button
                  onClick={shareToFacebook}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors"
                >
                  <Facebook
                    className="text-blue-600 dark:text-blue-400"
                    size={24}
                  />
                  <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                    Facebook
                  </span>
                </button>

                <button
                  onClick={triggerNativeShare}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <MoreHorizontal
                    className="text-gray-600 dark:text-gray-400"
                    size={24}
                  />
                  <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                    Lainnya
                  </span>
                </button>
              </div>

              <button
                onClick={copyLink}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-xl transition-colors text-gray-700 dark:text-gray-300 font-medium"
              >
                <Link2 size={18} />
                Salin Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
