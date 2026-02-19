import React from "react";
import {
  X,
  MessageCircle,
  Twitter,
  Facebook,
  Link2,
  MoreHorizontal,
  BookOpen,
  ExternalLink,
} from "lucide-react";

export default function ShareModal({ isOpen, onClose, data, showToast }) {
  if (!isOpen || !data) return null;

  const { title, text, url, surahName, arti } = data;

  const shareToSocial = (platform) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);
    let shareUrl = "";

    switch (platform) {
      case "wa":
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case "x":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case "fb":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      default:
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
    onClose();
  };

  const copyPageLink = () => {
    navigator.clipboard.writeText(url);
    showToast("Link berhasil disalin!", "success");
    onClose();
  };

  const triggerNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        onClose();
      } catch (error) {
        if (error.name !== "AbortError") {
          showToast("Gagal membuka menu share sistem.", "error");
        }
      }
    } else {
      showToast("Browser Anda tidak mendukung menu share sistem.", "info");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-xl animate-fade-in cursor-pointer"
        onClick={onClose}
      ></div>

      <div
        className="relative w-full max-w-lg animate-slide-up z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-white/40 dark:border-white/10">
          {/* Background Glows */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/20 rounded-full blur-[80px] -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-[80px] -ml-10 -mb-10"></div>

          {/* Header */}
          <div className="p-8 flex items-center justify-between relative z-10">
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Sebarkan Kebaikan
              </h3>
              <p className="text-sm text-slate-500 dark:text-gray-400 font-medium mt-1">
                Pilih platform untuk berbagi
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-2xl transition-all group active:scale-90"
            >
              <X
                size={20}
                className="text-slate-500 dark:text-gray-400 group-hover:text-red-500 transition-colors"
              />
            </button>
          </div>

          <div className="px-8 pb-10 space-y-6 relative z-10">
            {/* Preview Bento */}
            <div className="p-5 bg-white/50 dark:bg-slate-800/50 rounded-3xl border border-white/20 dark:border-white/5 shadow-inner">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <BookOpen className="text-white w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-0.5">
                    {surahName ? "Berbagi Surah" : "Berbagi Ayat"}
                  </p>
                  <h4 className="font-bold text-slate-900 dark:text-white truncate">
                    {surahName || title} {arti && `• ${arti}`}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-gray-400 truncate mt-0.5">
                    {url}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Grid */}
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
                    <item.icon size={22} className="sm:w-[26px] sm:h-[26px]" />
                  </div>
                  <span className="text-[9px] sm:text-xs font-black text-slate-700 dark:text-gray-300 uppercase tracking-wider text-center w-full truncate">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Secondary Action */}
            <div className="pt-2">
              <button
                onClick={() => {
                  window.open(
                    `https://www.google.com/search?q=${encodeURIComponent(title)}`,
                    "_blank",
                  );
                  onClose();
                }}
                className="w-full py-4 px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-[0.98]"
              >
                <ExternalLink size={18} />
                Pelajari Lebih Lanjut
              </button>
            </div>
          </div>

          <div className="bg-emerald-600 dark:bg-emerald-900/50 p-6">
            <p className="text-xs text-emerald-50 dark:text-emerald-300 leading-relaxed font-medium text-center italic">
              "Barangsiapa yang menunjuki kepada kebaikan, maka baginya pahala
              seperti pahala orang yang mengerjakannya." (HR. Muslim)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
