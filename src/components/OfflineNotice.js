import React, { useState, useEffect, useRef } from "react";
import { WifiOff, Wifi } from "lucide-react";

/**
 * OfflineNotice
 * Menampilkan banner otomatis saat user offline atau saat koneksi pulih kembali.
 * - Offline  → banner merah muncul & tetap ada selama offline
 * - Online   → banner hijau muncul 3 detik lalu hilang
 */
export default function OfflineNotice() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBanner, setShowBanner] = useState(false);
  const [justRecovered, setJustRecovered] = useState(false);
  const hideTimer = useRef(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setJustRecovered(true);
      setShowBanner(true);

      // Sembunyikan banner "online" setelah 3 detik
      clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => {
        setShowBanner(false);
        setJustRecovered(false);
      }, 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setJustRecovered(false);
      setShowBanner(true);
      clearTimeout(hideTimer.current);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Tampilkan banner offline langsung jika sudah offline dari awal
    if (!navigator.onLine) {
      setShowBanner(true);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearTimeout(hideTimer.current);
    };
  }, []);

  if (!showBanner) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: "1.25rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        animation: "offline-slide-up 0.4s cubic-bezier(0.16,1,0.3,1) both",
        width: "calc(100% - 2rem)",
        maxWidth: "420px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "12px 16px",
          borderRadius: "1rem",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: justRecovered
            ? "0 8px 32px rgba(16,185,129,0.25)"
            : "0 8px 32px rgba(0,0,0,0.25)",
          background: justRecovered
            ? "rgba(5, 150, 105, 0.92)"
            : "rgba(30, 30, 30, 0.92)",
          border: justRecovered
            ? "1px solid rgba(52,211,153,0.4)"
            : "1px solid rgba(248,113,113,0.3)",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: justRecovered
              ? "rgba(255,255,255,0.15)"
              : "rgba(239,68,68,0.15)",
            border: justRecovered
              ? "1px solid rgba(255,255,255,0.2)"
              : "1px solid rgba(248,113,113,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {justRecovered ? (
            <Wifi size={18} color="#34d399" />
          ) : (
            <WifiOff size={18} color="#f87171" />
          )}
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: "0.875rem",
              fontWeight: 700,
              color: "#fff",
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            {justRecovered ? "Koneksi Pulih!" : "Tidak Ada Koneksi"}
          </p>
          <p
            style={{
              fontSize: "0.75rem",
              color: justRecovered
                ? "rgba(255,255,255,0.75)"
                : "rgba(255,255,255,0.55)",
              margin: 0,
              marginTop: 2,
            }}
          >
            {justRecovered
              ? "Anda kembali online. Data terbaru akan dimuat."
              : "Menampilkan konten yang tersimpan di cache."}
          </p>
        </div>

        {/* Close button — hanya saat offline */}
        {!justRecovered && (
          <button
            onClick={() => setShowBanner(false)}
            aria-label="Tutup notifikasi"
            style={{
              flexShrink: 0,
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        )}
      </div>

      <style>{`
        @keyframes offline-slide-up {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
