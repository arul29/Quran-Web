/**
 * Data mapping Juz dalam Al-Quran
 * Karena API Equran tidak menyediakan informasi Juz,
 * data ini digunakan sebagai referensi mapping Juz → Surah → Ayat
 *
 * Menggunakan konvensi penamaan Bahasa Indonesia untuk konsistensi dengan API Equran
 */

export const juzData = [
  {
    juz: 1,
    daftarSurah: [
      {
        nomor: 1,
        nama: "Al-Fatihah",
        arti: "Pembuka",
        ayatAwal: 1,
        ayatAkhir: 7,
      },
      {
        nomor: 2,
        nama: "Al-Baqarah",
        arti: "Sapi Betina",
        ayatAwal: 1,
        ayatAkhir: 141,
      },
    ],
  },
  {
    juz: 2,
    daftarSurah: [
      {
        nomor: 2,
        nama: "Al-Baqarah",
        arti: "Sapi Betina",
        ayatAwal: 142,
        ayatAkhir: 252,
      },
    ],
  },
  {
    juz: 3,
    daftarSurah: [
      {
        nomor: 2,
        nama: "Al-Baqarah",
        arti: "Sapi Betina",
        ayatAwal: 253,
        ayatAkhir: 286,
      },
      {
        nomor: 3,
        nama: "Ali Imran",
        arti: "Keluarga Imran",
        ayatAwal: 1,
        ayatAkhir: 92,
      },
    ],
  },
  {
    juz: 4,
    daftarSurah: [
      {
        nomor: 3,
        nama: "Ali Imran",
        arti: "Keluarga Imran",
        ayatAwal: 93,
        ayatAkhir: 200,
      },
      { nomor: 4, nama: "An-Nisa", arti: "Wanita", ayatAwal: 1, ayatAkhir: 23 },
    ],
  },
  {
    juz: 5,
    daftarSurah: [
      {
        nomor: 4,
        nama: "An-Nisa",
        arti: "Wanita",
        ayatAwal: 24,
        ayatAkhir: 147,
      },
    ],
  },
  {
    juz: 6,
    daftarSurah: [
      {
        nomor: 4,
        nama: "An-Nisa",
        arti: "Wanita",
        ayatAwal: 148,
        ayatAkhir: 176,
      },
      {
        nomor: 5,
        nama: "Al-Ma'idah",
        arti: "Jamuan",
        ayatAwal: 1,
        ayatAkhir: 81,
      },
    ],
  },
  {
    juz: 7,
    daftarSurah: [
      {
        nomor: 5,
        nama: "Al-Ma'idah",
        arti: "Jamuan",
        ayatAwal: 82,
        ayatAkhir: 120,
      },
      {
        nomor: 6,
        nama: "Al-An'am",
        arti: "Hewan Ternak",
        ayatAwal: 1,
        ayatAkhir: 110,
      },
    ],
  },
  {
    juz: 8,
    daftarSurah: [
      {
        nomor: 6,
        nama: "Al-An'am",
        arti: "Hewan Ternak",
        ayatAwal: 111,
        ayatAkhir: 165,
      },
      {
        nomor: 7,
        nama: "Al-A'raf",
        arti: "Tempat yang Tertinggi",
        ayatAwal: 1,
        ayatAkhir: 87,
      },
    ],
  },
  {
    juz: 9,
    daftarSurah: [
      {
        nomor: 7,
        nama: "Al-A'raf",
        arti: "Tempat yang Tertinggi",
        ayatAwal: 88,
        ayatAkhir: 206,
      },
      {
        nomor: 8,
        nama: "Al-Anfal",
        arti: "Harta Rampasan Perang",
        ayatAwal: 1,
        ayatAkhir: 40,
      },
    ],
  },
  {
    juz: 10,
    daftarSurah: [
      {
        nomor: 8,
        nama: "Al-Anfal",
        arti: "Harta Rampasan Perang",
        ayatAwal: 41,
        ayatAkhir: 75,
      },
      {
        nomor: 9,
        nama: "At-Taubah",
        arti: "Pengampunan",
        ayatAwal: 1,
        ayatAkhir: 92,
      },
    ],
  },
  {
    juz: 11,
    daftarSurah: [
      {
        nomor: 9,
        nama: "At-Taubah",
        arti: "Pengampunan",
        ayatAwal: 93,
        ayatAkhir: 129,
      },
      {
        nomor: 10,
        nama: "Yunus",
        arti: "Nabi Yunus",
        ayatAwal: 1,
        ayatAkhir: 109,
      },
      { nomor: 11, nama: "Hud", arti: "Nabi Hud", ayatAwal: 1, ayatAkhir: 5 },
    ],
  },
  {
    juz: 12,
    daftarSurah: [
      { nomor: 11, nama: "Hud", arti: "Nabi Hud", ayatAwal: 6, ayatAkhir: 123 },
      {
        nomor: 12,
        nama: "Yusuf",
        arti: "Nabi Yusuf",
        ayatAwal: 1,
        ayatAkhir: 52,
      },
    ],
  },
  {
    juz: 13,
    daftarSurah: [
      {
        nomor: 12,
        nama: "Yusuf",
        arti: "Nabi Yusuf",
        ayatAwal: 53,
        ayatAkhir: 111,
      },
      { nomor: 13, nama: "Ar-Ra'd", arti: "Guruh", ayatAwal: 1, ayatAkhir: 43 },
      {
        nomor: 14,
        nama: "Ibrahim",
        arti: "Nabi Ibrahim",
        ayatAwal: 1,
        ayatAkhir: 52,
      },
    ],
  },
  {
    juz: 14,
    daftarSurah: [
      {
        nomor: 15,
        nama: "Al-Hijr",
        arti: "Gunung Al-Hijr",
        ayatAwal: 1,
        ayatAkhir: 99,
      },
      {
        nomor: 16,
        nama: "An-Nahl",
        arti: "Lebah",
        ayatAwal: 1,
        ayatAkhir: 128,
      },
    ],
  },
  {
    juz: 15,
    daftarSurah: [
      {
        nomor: 17,
        nama: "Al-Isra'",
        arti: "Perjalanan Malam",
        ayatAwal: 1,
        ayatAkhir: 111,
      },
      {
        nomor: 18,
        nama: "Al-Kahfi",
        arti: "Penghuni-Penghuni Gua",
        ayatAwal: 1,
        ayatAkhir: 74,
      },
    ],
  },
  {
    juz: 16,
    daftarSurah: [
      {
        nomor: 18,
        nama: "Al-Kahfi",
        arti: "Penghuni-Penghuni Gua",
        ayatAwal: 75,
        ayatAkhir: 110,
      },
      { nomor: 19, nama: "Maryam", arti: "Maryam", ayatAwal: 1, ayatAkhir: 98 },
      { nomor: 20, nama: "Ta Ha", arti: "Ta Ha", ayatAwal: 1, ayatAkhir: 135 },
    ],
  },
  {
    juz: 17,
    daftarSurah: [
      {
        nomor: 21,
        nama: "Al-Anbiya",
        arti: "Nabi-Nabi",
        ayatAwal: 1,
        ayatAkhir: 112,
      },
      { nomor: 22, nama: "Al-Hajj", arti: "Haji", ayatAwal: 1, ayatAkhir: 78 },
    ],
  },
  {
    juz: 18,
    daftarSurah: [
      {
        nomor: 23,
        nama: "Al-Mu'minun",
        arti: "Orang-Orang mukmin",
        ayatAwal: 1,
        ayatAkhir: 118,
      },
      { nomor: 24, nama: "An-Nur", arti: "Cahaya", ayatAwal: 1, ayatAkhir: 64 },
      {
        nomor: 25,
        nama: "Al-Furqan",
        arti: "Pembeda",
        ayatAwal: 1,
        ayatAkhir: 20,
      },
    ],
  },
  {
    juz: 19,
    daftarSurah: [
      {
        nomor: 25,
        nama: "Al-Furqan",
        arti: "Pembeda",
        ayatAwal: 21,
        ayatAkhir: 77,
      },
      {
        nomor: 26,
        nama: "Asy-Syu'ara'",
        arti: "Penyair",
        ayatAwal: 1,
        ayatAkhir: 227,
      },
      { nomor: 27, nama: "An-Naml", arti: "Semut", ayatAwal: 1, ayatAkhir: 55 },
    ],
  },
  {
    juz: 20,
    daftarSurah: [
      {
        nomor: 27,
        nama: "An-Naml",
        arti: "Semut",
        ayatAwal: 56,
        ayatAkhir: 93,
      },
      {
        nomor: 28,
        nama: "Al-Qasas",
        arti: "Kisah-Kisah",
        ayatAwal: 1,
        ayatAkhir: 88,
      },
      {
        nomor: 29,
        nama: "Al-'Ankabut",
        arti: "Laba-laba",
        ayatAwal: 1,
        ayatAkhir: 45,
      },
    ],
  },
  {
    juz: 21,
    daftarSurah: [
      {
        nomor: 29,
        nama: "Al-'Ankabut",
        arti: "Laba-laba",
        ayatAwal: 46,
        ayatAkhir: 69,
      },
      {
        nomor: 30,
        nama: "Ar-Rum",
        arti: "Bangsa Romawi",
        ayatAwal: 1,
        ayatAkhir: 60,
      },
      {
        nomor: 31,
        nama: "Luqman",
        arti: "Keluarga Luqman",
        ayatAwal: 1,
        ayatAkhir: 34,
      },
      {
        nomor: 32,
        nama: "As-Sajdah",
        arti: "Sajadah",
        ayatAwal: 1,
        ayatAkhir: 30,
      },
      {
        nomor: 33,
        nama: "Al-Ahzab",
        arti: "Golongan-Golongan yang Bersekutu",
        ayatAwal: 1,
        ayatAkhir: 30,
      },
    ],
  },
  {
    juz: 22,
    daftarSurah: [
      {
        nomor: 33,
        nama: "Al-Ahzab",
        arti: "Golongan-Golongan yang Bersekutu",
        ayatAwal: 31,
        ayatAkhir: 73,
      },
      {
        nomor: 34,
        nama: "Saba'",
        arti: "Kaum Saba'",
        ayatAwal: 1,
        ayatAkhir: 54,
      },
      {
        nomor: 35,
        nama: "Fatir",
        arti: "Pencipta",
        ayatAwal: 1,
        ayatAkhir: 45,
      },
      {
        nomor: 36,
        nama: "Ya Sin",
        arti: "Yaasiin",
        ayatAwal: 1,
        ayatAkhir: 27,
      },
    ],
  },
  {
    juz: 23,
    daftarSurah: [
      {
        nomor: 36,
        nama: "Ya Sin",
        arti: "Yaasiin",
        ayatAwal: 28,
        ayatAkhir: 83,
      },
      {
        nomor: 37,
        nama: "As-Saffat",
        arti: "Barisan-Barisan",
        ayatAwal: 1,
        ayatAkhir: 182,
      },
      { nomor: 38, nama: "Sad", arti: "Shaad", ayatAwal: 1, ayatAkhir: 88 },
      {
        nomor: 39,
        nama: "Az-Zumar",
        arti: "Rombongan-Rombongan",
        ayatAwal: 1,
        ayatAkhir: 31,
      },
    ],
  },
  {
    juz: 24,
    daftarSurah: [
      {
        nomor: 39,
        nama: "Az-Zumar",
        arti: "Rombongan-Rombongan",
        ayatAwal: 32,
        ayatAkhir: 75,
      },
      {
        nomor: 40,
        nama: "Al-Ghafir",
        arti: "Yang Mengampuni",
        ayatAwal: 1,
        ayatAkhir: 85,
      },
      {
        nomor: 41,
        nama: "Al-Fussilat",
        arti: "Yang Dijelaskan",
        ayatAwal: 1,
        ayatAkhir: 46,
      },
    ],
  },
  {
    juz: 25,
    daftarSurah: [
      {
        nomor: 41,
        nama: "Al-Fussilat",
        arti: "Yang Dijelaskan",
        ayatAwal: 47,
        ayatAkhir: 54,
      },
      {
        nomor: 42,
        nama: "Asy-Syura",
        arti: "Musyawarah",
        ayatAwal: 1,
        ayatAkhir: 53,
      },
      {
        nomor: 43,
        nama: "Az-Zukhruf",
        arti: "Perhiasan",
        ayatAwal: 1,
        ayatAkhir: 89,
      },
      {
        nomor: 44,
        nama: "Ad-Dukhan",
        arti: "Kabut",
        ayatAwal: 1,
        ayatAkhir: 59,
      },
      {
        nomor: 45,
        nama: "Al-Jatsiyah",
        arti: "Yang Bertekuk Lutut",
        ayatAwal: 1,
        ayatAkhir: 37,
      },
    ],
  },
  {
    juz: 26,
    daftarSurah: [
      {
        nomor: 46,
        nama: "Al-Ahqaf",
        arti: "Bukit-bukit Pasir",
        ayatAwal: 1,
        ayatAkhir: 35,
      },
      {
        nomor: 47,
        nama: "Muhammad",
        arti: "Nabi Muhammad",
        ayatAwal: 1,
        ayatAkhir: 38,
      },
      {
        nomor: 48,
        nama: "Al-Fath",
        arti: "Kemenangan",
        ayatAwal: 1,
        ayatAkhir: 29,
      },
      {
        nomor: 49,
        nama: "Al-Hujurat",
        arti: "Kamar-kamar",
        ayatAwal: 1,
        ayatAkhir: 18,
      },
      { nomor: 50, nama: "Qaf", arti: "Qaaf", ayatAwal: 1, ayatAkhir: 45 },
      {
        nomor: 51,
        nama: "Az-Zariyat",
        arti: "Angin yang Menerbangkan",
        ayatAwal: 1,
        ayatAkhir: 30,
      },
    ],
  },
  {
    juz: 27,
    daftarSurah: [
      {
        nomor: 51,
        nama: "Az-Zariyat",
        arti: "Angin yang Menerbangkan",
        ayatAwal: 31,
        ayatAkhir: 60,
      },
      { nomor: 52, nama: "At-Tur", arti: "Bukit", ayatAwal: 1, ayatAkhir: 49 },
      {
        nomor: 53,
        nama: "An-Najm",
        arti: "Bintang",
        ayatAwal: 1,
        ayatAkhir: 62,
      },
      {
        nomor: 54,
        nama: "Al-Qamar",
        arti: "Bulan",
        ayatAwal: 1,
        ayatAkhir: 55,
      },
      {
        nomor: 55,
        nama: "Ar-Rahman",
        arti: "Yang Maha Pemurah",
        ayatAwal: 1,
        ayatAkhir: 78,
      },
      {
        nomor: 56,
        nama: "Al-Waqi'ah",
        arti: "Hari Kiamat",
        ayatAwal: 1,
        ayatAkhir: 96,
      },
      { nomor: 57, nama: "Al-Hadid", arti: "Besi", ayatAwal: 1, ayatAkhir: 29 },
    ],
  },
  {
    juz: 28,
    daftarSurah: [
      {
        nomor: 58,
        nama: "Al-Mujadilah",
        arti: "Wanita yang Mengajukan Gugatan",
        ayatAwal: 1,
        ayatAkhir: 22,
      },
      {
        nomor: 59,
        nama: "Al-Hasyr",
        arti: "Pengusiran",
        ayatAwal: 1,
        ayatAkhir: 24,
      },
      {
        nomor: 60,
        nama: "Al-Mumtahanah",
        arti: "Wanita yang Diuji",
        ayatAwal: 1,
        ayatAkhir: 13,
      },
      {
        nomor: 61,
        nama: "As-Saff",
        arti: "Satu Barisan",
        ayatAwal: 1,
        ayatAkhir: 14,
      },
      {
        nomor: 62,
        nama: "Al-Jumu'ah",
        arti: "Hari Jumat",
        ayatAwal: 1,
        ayatAkhir: 11,
      },
      {
        nomor: 63,
        nama: "Al-Munafiqun",
        arti: "Orang-orang yang Munafik",
        ayatAwal: 1,
        ayatAkhir: 11,
      },
      {
        nomor: 64,
        nama: "At-Tagabun",
        arti: "Hari Dinampakkan Kesalahan-kesalahan",
        ayatAwal: 1,
        ayatAkhir: 18,
      },
      {
        nomor: 65,
        nama: "At-Talaq",
        arti: "Talak",
        ayatAwal: 1,
        ayatAkhir: 12,
      },
      {
        nomor: 66,
        nama: "At-Tahrim",
        arti: "Mengharamkan",
        ayatAwal: 1,
        ayatAkhir: 12,
      },
    ],
  },
  {
    juz: 29,
    daftarSurah: [
      {
        nomor: 67,
        nama: "Al-Mulk",
        arti: "Kerajaan",
        ayatAwal: 1,
        ayatAkhir: 30,
      },
      { nomor: 68, nama: "Al-Qalam", arti: "Pena", ayatAwal: 1, ayatAkhir: 52 },
      {
        nomor: 69,
        nama: "Al-Haqqah",
        arti: "Hari Kiamat",
        ayatAwal: 1,
        ayatAkhir: 52,
      },
      {
        nomor: 70,
        nama: "Al-Ma'arij",
        arti: "Tempat Naik",
        ayatAwal: 1,
        ayatAkhir: 44,
      },
      { nomor: 71, nama: "Nuh", arti: "Nabi Nuh", ayatAwal: 1, ayatAkhir: 28 },
      { nomor: 72, nama: "Al-Jinn", arti: "Jin", ayatAwal: 1, ayatAkhir: 28 },
      {
        nomor: 73,
        nama: "Al-Muzzammil",
        arti: "Orang yang Berselimut",
        ayatAwal: 1,
        ayatAkhir: 20,
      },
      {
        nomor: 74,
        nama: "Al-Muddassir",
        arti: "Orang yang Berkemul",
        ayatAwal: 1,
        ayatAkhir: 56,
      },
      {
        nomor: 75,
        nama: "Al-Qiyamah",
        arti: "Kiamat",
        ayatAwal: 1,
        ayatAkhir: 40,
      },
      {
        nomor: 76,
        nama: "Al-Insan",
        arti: "Manusia",
        ayatAwal: 1,
        ayatAkhir: 31,
      },
      {
        nomor: 77,
        nama: "Al-Mursalat",
        arti: "Malaikat-Malaikat yang Diutus",
        ayatAwal: 1,
        ayatAkhir: 50,
      },
    ],
  },
  {
    juz: 30,
    daftarSurah: [
      {
        nomor: 78,
        nama: "An-Naba'",
        arti: "Berita Besar",
        ayatAwal: 1,
        ayatAkhir: 40,
      },
      {
        nomor: 79,
        nama: "An-Nazi'at",
        arti: "Malaikat-Malaikat yang Mencabut",
        ayatAwal: 1,
        ayatAkhir: 46,
      },
      {
        nomor: 80,
        nama: "'Abasa",
        arti: "Ia Bermuka Masam",
        ayatAwal: 1,
        ayatAkhir: 42,
      },
      {
        nomor: 81,
        nama: "At-Takwir",
        arti: "Menggulung",
        ayatAwal: 1,
        ayatAkhir: 29,
      },
      {
        nomor: 82,
        nama: "Al-Infitar",
        arti: "Terbelah",
        ayatAwal: 1,
        ayatAkhir: 19,
      },
      {
        nomor: 83,
        nama: "Al-Muthaffifin",
        arti: "Orang-Orang yang Curang",
        ayatAwal: 1,
        ayatAkhir: 36,
      },
      {
        nomor: 84,
        nama: "Al-Insyiqaq",
        arti: "Terbelah",
        ayatAwal: 1,
        ayatAkhir: 25,
      },
      {
        nomor: 85,
        nama: "Al-Buruj",
        arti: "Gugusan Bintang",
        ayatAwal: 1,
        ayatAkhir: 22,
      },
      {
        nomor: 86,
        nama: "At-Tariq",
        arti: "Yang Datang di Malam Hari",
        ayatAwal: 1,
        ayatAkhir: 17,
      },
      {
        nomor: 87,
        nama: "Al-A'la",
        arti: "Yang Paling Tinggi",
        ayatAwal: 1,
        ayatAkhir: 19,
      },
      {
        nomor: 88,
        nama: "Al-Gasyiyah",
        arti: "Hari Pembalasan",
        ayatAwal: 1,
        ayatAkhir: 26,
      },
      { nomor: 89, nama: "Al-Fajr", arti: "Fajar", ayatAwal: 1, ayatAkhir: 30 },
      {
        nomor: 90,
        nama: "Al-Balad",
        arti: "Negeri",
        ayatAwal: 1,
        ayatAkhir: 20,
      },
      {
        nomor: 91,
        nama: "Asy-Syams",
        arti: "Matahari",
        ayatAwal: 1,
        ayatAkhir: 15,
      },
      { nomor: 92, nama: "Al-Lail", arti: "Malam", ayatAwal: 1, ayatAkhir: 21 },
      {
        nomor: 93,
        nama: "Ad-Duha",
        arti: "Waktu Matahari Sepenggalahan Naik (Duha)",
        ayatAwal: 1,
        ayatAkhir: 11,
      },
      {
        nomor: 94,
        nama: "Al-Insyirah",
        arti: "Melapangkan",
        ayatAwal: 1,
        ayatAkhir: 8,
      },
      {
        nomor: 95,
        nama: "At-Tin",
        arti: "Buah Tin",
        ayatAwal: 1,
        ayatAkhir: 8,
      },
      {
        nomor: 96,
        nama: "Al-'Alaq",
        arti: "Segumpal Darah",
        ayatAwal: 1,
        ayatAkhir: 19,
      },
      {
        nomor: 97,
        nama: "Al-Qadr",
        arti: "Kemuliaan",
        ayatAwal: 1,
        ayatAkhir: 5,
      },
      {
        nomor: 98,
        nama: "Al-Bayyinah",
        arti: "Pembuktian",
        ayatAwal: 1,
        ayatAkhir: 8,
      },
      {
        nomor: 99,
        nama: "Az-Zalzalah",
        arti: "Kegoncangan",
        ayatAwal: 1,
        ayatAkhir: 8,
      },
      {
        nomor: 100,
        nama: "Al-'Adiyat",
        arti: "Berlari Kencang",
        ayatAwal: 1,
        ayatAkhir: 11,
      },
      {
        nomor: 101,
        nama: "Al-Qari'ah",
        arti: "Hari Kiamat",
        ayatAwal: 1,
        ayatAkhir: 11,
      },
      {
        nomor: 102,
        nama: "At-Takasur",
        arti: "Bermegah-megahan",
        ayatAwal: 1,
        ayatAkhir: 8,
      },
      { nomor: 103, nama: "Al-'Asr", arti: "Masa", ayatAwal: 1, ayatAkhir: 3 },
      {
        nomor: 104,
        nama: "Al-Humazah",
        arti: "Pengumpat",
        ayatAwal: 1,
        ayatAkhir: 9,
      },
      { nomor: 105, nama: "Al-Fil", arti: "Gajah", ayatAwal: 1, ayatAkhir: 5 },
      {
        nomor: 106,
        nama: "Quraisy",
        arti: "Suku Quraisy",
        ayatAwal: 1,
        ayatAkhir: 4,
      },
      {
        nomor: 107,
        nama: "Al-Ma'un",
        arti: "Barang-Barang yang Berguna",
        ayatAwal: 1,
        ayatAkhir: 7,
      },
      {
        nomor: 108,
        nama: "Al-Kausar",
        arti: "Nikmat yang Berlimpah",
        ayatAwal: 1,
        ayatAkhir: 3,
      },
      {
        nomor: 109,
        nama: "Al-Kafirun",
        arti: "Orang-Orang Kafir",
        ayatAwal: 1,
        ayatAkhir: 6,
      },
      {
        nomor: 110,
        nama: "An-Nasr",
        arti: "Pertolongan",
        ayatAwal: 1,
        ayatAkhir: 3,
      },
      {
        nomor: 111,
        nama: "Al-Lahab",
        arti: "Gejolak Api",
        ayatAwal: 1,
        ayatAkhir: 5,
      },
      {
        nomor: 112,
        nama: "Al-Ikhlas",
        arti: "Ikhlas",
        ayatAwal: 1,
        ayatAkhir: 4,
      },
      {
        nomor: 113,
        nama: "Al-Falaq",
        arti: "Waktu Subuh",
        ayatAwal: 1,
        ayatAkhir: 5,
      },
      {
        nomor: 114,
        nama: "An-Nas",
        arti: "Umat Manusia",
        ayatAwal: 1,
        ayatAkhir: 6,
      },
    ],
  },
];

/**
 * Mendapatkan informasi Juz berdasarkan nomor
 * @param {number} nomorJuz - Nomor Juz (1-30)
 * @returns {Object|null} Data Juz atau null jika tidak ditemukan
 */
export const dapatkanJuzBerdasarkanNomor = (nomorJuz) => {
  return juzData.find((juz) => juz.juz === nomorJuz) || null;
};

/**
 * Mendapatkan nomor Juz berdasarkan Surah dan Ayat
 * @param {number} nomorSurah - Nomor Surah
 * @param {number} nomorAyat - Nomor Ayat
 * @returns {number|null} Nomor Juz atau null jika tidak ditemukan
 */
export const dapatkanJuzBerdasarkanSurahDanAyat = (nomorSurah, nomorAyat) => {
  for (const juz of juzData) {
    const surahDalamJuz = juz.daftarSurah.find(
      (s) =>
        s.nomor === nomorSurah &&
        nomorAyat >= s.ayatAwal &&
        nomorAyat <= s.ayatAkhir,
    );
    if (surahDalamJuz) {
      return juz.juz;
    }
  }
  return null;
};

/**
 * Mendapatkan daftar semua Juz
 * @returns {Array} Array berisi semua data Juz
 */
export const dapatkanSemuaJuz = () => {
  return juzData;
};

/**
 * Mendapatkan informasi ringkas untuk daftar Juz
 * @returns {Array} Array berisi ringkasan setiap Juz
 */
export const dapatkanRingkasanJuz = () => {
  return juzData.map((juz) => {
    const surahPertama = juz.daftarSurah[0];
    const surahTerakhir = juz.daftarSurah[juz.daftarSurah.length - 1];

    return {
      juz: juz.juz,
      surahAwal: {
        nomor: surahPertama.nomor,
        nama: surahPertama.nama,
        ayat: surahPertama.ayatAwal,
      },
      surahAkhir: {
        nomor: surahTerakhir.nomor,
        nama: surahTerakhir.nama,
        ayat: surahTerakhir.ayatAkhir,
      },
      jumlahSurah: juz.daftarSurah.length,
    };
  });
};

/**
 * Mendapatkan range ayat untuk surah tertentu dalam juz tertentu
 * @param {number} nomorJuz - Nomor Juz
 * @param {number} nomorSurah - Nomor Surah
 * @returns {Object|null} Object dengan ayatAwal dan ayatAkhir, atau null
 */
export const dapatkanRangeAyatDalamJuz = (nomorJuz, nomorSurah) => {
  const juz = dapatkanJuzBerdasarkanNomor(nomorJuz);
  if (!juz) return null;

  const surah = juz.daftarSurah.find((s) => s.nomor === nomorSurah);
  if (!surah) return null;

  return {
    ayatAwal: surah.ayatAwal,
    ayatAkhir: surah.ayatAkhir,
  };
};

// Alias untuk backward compatibility dengan nama English (opsional)
export const getJuzByNumber = dapatkanJuzBerdasarkanNomor;
export const getJuzBySurahAndVerse = dapatkanJuzBerdasarkanSurahDanAyat;
export const getAllJuz = dapatkanSemuaJuz;
export const getJuzSummary = dapatkanRingkasanJuz;
export const getVerseRangeInJuz = dapatkanRangeAyatDalamJuz;
