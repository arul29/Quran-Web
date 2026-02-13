export const convertToArabicNumbers = (num) => {
  const arabicNumbers =
    "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669";
  return String(num).replace(/[0123456789]/g, (d) => {
    return arabicNumbers[d];
  });
};

export const RawHTML = ({ children, className = "" }) => (
  <div
    className={className}
    dangerouslySetInnerHTML={{
      __html: children.replace(/\n/g, "<br />"),
    }}
  />
);

// Export Juz-related functions (Bahasa Indonesia untuk konsistensi dengan API)
export {
  juzData,
  dapatkanJuzBerdasarkanNomor,
  dapatkanJuzBerdasarkanSurahDanAyat,
  dapatkanSemuaJuz,
  dapatkanRingkasanJuz,
  dapatkanRangeAyatDalamJuz,
  // English aliases untuk backward compatibility
  getJuzByNumber,
  getJuzBySurahAndVerse,
  getAllJuz,
  getJuzSummary,
  getVerseRangeInJuz,
} from "./juzData";
