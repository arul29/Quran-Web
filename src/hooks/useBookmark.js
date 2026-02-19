import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "bookmark";

/**
 * Custom hook untuk mengelola bookmark surah.
 * Menggunakan struktur data yang seragam:
 * { nomor, nama, namaLatin, jumlahAyat, tempatTurun, arti }
 */
export default function useBookmark() {
  const [bookmarks, setBookmarks] = useState([]);

  // Baca dari localStorage saat pertama kali mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setBookmarks(stored ? JSON.parse(stored) : []);
    } catch {
      setBookmarks([]);
    }
  }, []);

  const addBookmark = useCallback((surah) => {
    setBookmarks((prev) => {
      // Hindari duplikat
      if (prev.some((b) => b.nomor === surah.nomor)) return prev;

      const newItem = {
        nomor: surah.nomor,
        nama: surah.nama,
        namaLatin: surah.namaLatin,
        jumlahAyat: surah.jumlahAyat,
        tempatTurun: surah.tempatTurun,
        arti: surah.arti,
      };
      const updated = [...prev, newItem];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeBookmark = useCallback((nomor) => {
    setBookmarks((prev) => {
      const updated = prev.filter((b) => b.nomor !== nomor);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isBookmark = useCallback(
    (nomor) => bookmarks.some((b) => b.nomor === nomor),
    [bookmarks],
  );

  return { bookmarks, addBookmark, removeBookmark, isBookmark };
}
