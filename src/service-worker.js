/* eslint-disable no-restricted-globals */

/**
 * Service Worker - Al-Qur'an Indonesia
 *
 * Strategi caching:
 * 1. App Shell (JS/CSS/HTML)  → Precache (Cache First, otomatis oleh Workbox)
 * 2. Data Surah & Tafsir      → CacheFirst  (data statis, valid 30 hari)
 * 3. Jadwal Shalat/Imsakiyah  → NetworkFirst (berubah tiap hari, timeout 5 detik)
 * 4. Ayat Random (myquran)    → NetworkFirst (timeout 5 detik)
 * 5. Font Google & CDN        → StaleWhileRevalidate (cache dulu, update di background)
 * 6. Gambar lokal (.png/svg)  → CacheFirst (aset statis)
 * 7. Offline fallback         → Tampilkan /offline.html jika data tidak ter-cache
 */

import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute, setCatchHandler } from "workbox-routing";
import {
  StaleWhileRevalidate,
  CacheFirst,
  NetworkFirst,
} from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";

// Ambil alih semua client segera (tidak perlu reload)
clientsClaim();

// ─── 1. PRECACHE (App Shell) ───────────────────────────────────────────────
// Semua aset hasil build CRA (JS, CSS, index.html) di-precache otomatis
precacheAndRoute(self.__WB_MANIFEST);

// Handle SPA navigation — selalu sajikan index.html untuk route apapun
const fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$");
registerRoute(
  ({ request, url }) => {
    if (request.mode !== "navigate") return false;
    if (url.pathname.startsWith("/_")) return false;
    if (url.pathname.match(fileExtensionRegexp)) return false;
    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + "/index.html"),
);

// ─── 2. DATA AL-QUR'AN (equran.id/api/v2/surat) ───────────────────────────
// Strategi: CacheFirst — data surah jarang berubah, valid 30 hari
// Mencakup: daftar surah, detail surah per nomor, audio metadata
registerRoute(
  ({ url }) =>
    url.origin === "https://equran.id" &&
    url.pathname.startsWith("/api/v2/surat"),
  new CacheFirst({
    cacheName: "quran-surah-cache-v1",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200], // termasuk opaque response
      }),
      new ExpirationPlugin({
        maxEntries: 250, // 114 surah + tafsir tiap surah = ~228 entry
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 hari
        purgeOnQuotaError: true,
      }),
    ],
  }),
);

// ─── 3. DATA TAFSIR (equran.id/api/v2/tafsir) ─────────────────────────────
// Strategi: CacheFirst — tafsir tidak pernah berubah
registerRoute(
  ({ url }) =>
    url.origin === "https://equran.id" &&
    url.pathname.startsWith("/api/v2/tafsir"),
  new CacheFirst({
    cacheName: "quran-tafsir-cache-v1",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 120, // 114 surah tafsir
        maxAgeSeconds: 60 * 60 * 24 * 90, // 90 hari
        purgeOnQuotaError: true,
      }),
    ],
  }),
);

// ─── 4. JADWAL SHALAT & IMSAKIYAH (equran.id/api/v2/shalat, /imsakiyah) ───
// Strategi: NetworkFirst — data berubah per hari, timeout 5 detik
registerRoute(
  ({ url }) =>
    url.origin === "https://equran.id" &&
    (url.pathname.includes("/shalat") || url.pathname.includes("/imsakiyah")),
  new NetworkFirst({
    cacheName: "shalat-cache-v1",
    networkTimeoutSeconds: 5, // fallback ke cache setelah 5 detik
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 2, // 2 hari (lebih dari cukup)
        purgeOnQuotaError: true,
      }),
    ],
  }),
);

// ─── 5. AYAT RANDOM (api.myquran.com) ─────────────────────────────────────
// Strategi: NetworkFirst — berubah-ubah, tapi tetap tampilkan cache saat offline
registerRoute(
  ({ url }) => url.origin === "https://api.myquran.com",
  new NetworkFirst({
    cacheName: "myquran-cache-v1",
    networkTimeoutSeconds: 5,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 60 * 60 * 24, // 1 hari
        purgeOnQuotaError: true,
      }),
    ],
  }),
);

// ─── 6. GEOCODING NOMINATIM (openstreetmap) ────────────────────────────────
// Strategi: NetworkFirst — lokasi bisa berubah, cache 7 hari
registerRoute(
  ({ url }) => url.origin === "https://nominatim.openstreetmap.org",
  new NetworkFirst({
    cacheName: "nominatim-cache-v1",
    networkTimeoutSeconds: 8,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 5,
        maxAgeSeconds: 60 * 60 * 24 * 7, // 7 hari
        purgeOnQuotaError: true,
      }),
    ],
  }),
);

// ─── 7. GOOGLE FONTS ───────────────────────────────────────────────────────
// Strategi: StaleWhileRevalidate — font jarang berubah
registerRoute(
  ({ url }) =>
    url.origin === "https://fonts.googleapis.com" ||
    url.origin === "https://fonts.gstatic.com",
  new StaleWhileRevalidate({
    cacheName: "google-fonts-cache-v1",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 tahun
      }),
    ],
  }),
);

// ─── 8. GAMBAR & ASET LOKAL ────────────────────────────────────────────────
// Strategi: CacheFirst — aset statis, tidak berubah
registerRoute(
  ({ url }) =>
    url.origin === self.location.origin &&
    (url.pathname.endsWith(".png") ||
      url.pathname.endsWith(".svg") ||
      url.pathname.endsWith(".ico") ||
      url.pathname.endsWith(".webp")),
  new CacheFirst({
    cacheName: "local-assets-cache-v1",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 hari
      }),
    ],
  }),
);

// ─── 9. OFFLINE FALLBACK ───────────────────────────────────────────────────
// Jika navigate request gagal (offline & tidak ada cache) → tampilkan offline.html
// /offline.html sudah di-precache oleh Workbox jika ada di public/
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("offline-fallback-v1").then((cache) => {
      return cache.add(new Request("/offline.html", { cache: "reload" }));
    }),
  );
});

setCatchHandler(async ({ event }) => {
  if (event.request.destination === "document") {
    const cache = await caches.open("offline-fallback-v1");
    const cachedResponse = await cache.match("/offline.html");
    return cachedResponse || Response.error();
  }
  return Response.error();
});

// ─── 10. SKIP WAITING ──────────────────────────────────────────────────────
// Izinkan app untuk trigger update service worker tanpa harus tutup tab
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
