import React from "react";
import {
  ArrowLeft,
  History,
  Bookmark,
  Search,
  Volume2,
  Moon,
  BookOpen,
  HelpCircle,
  Lightbulb,
  Compass,
  Sparkles,
  Library,
  Navigation,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";
import ThemeToggle from "@/components/ThemeToggle";

const HelpCard = ({ icon: Icon, title, description, steps }) => (
  <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300 group">
    <div className="flex items-center gap-4 mb-6">
      <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-500">
        <Icon size={28} strokeWidth={2.5} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
        {title}
      </h3>
    </div>
    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
      {description}
    </p>
    <ul className="space-y-3">
      {steps.map((step, index) => (
        <li
          key={index}
          className="flex items-start gap-3 text-sm text-gray-500 dark:text-gray-400"
        >
          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
          {step}
        </li>
      ))}
    </ul>
  </div>
);

export default function Help() {
  const navigate = useNavigate();

  const guides = [
    {
      icon: History,
      title: "Tandai Terakhir Dibaca",
      description:
        "Fitur ini membantu Anda melanjutkan bacaan tepat di ayat yang Anda tinggalkan sebelumnya.",
      steps: [
        "Buka surah yang ingin Anda baca.",
        "Cari ayat yang sedang Anda baca.",
        "Klik tombol 'Tandai terakhir dibaca' (Ikon Jam/History) di bagian bawah ayat.",
        "Akses kembali melalui kartu 'Terakhir Dibaca' di halaman utama.",
      ],
    },
    {
      icon: Bookmark,
      title: "Gunakan Bookmark",
      description:
        "Simpan ayat-ayat favorit atau penting untuk diakses dengan cepat kapan saja.",
      steps: [
        "Klik ikon Bookmark pada ayat yang ingin disimpan.",
        "Di halaman utama, klik tombol 'Lihat Bookmark' di bagian atas daftar surah.",
        "Gunakan fitur ini untuk muroja'ah atau menghafal ayat tertentu.",
      ],
    },
    {
      icon: Search,
      title: "Pencarian Cepat",
      description:
        "Temukan surah dengan mudah melalui fitur pencarian yang responsif.",
      steps: [
        "Gunakan kolom pencarian di halaman utama.",
        "Ketik lama surah (contoh: 'Al-Baqarah') atau nomor surah.",
        "Daftar surah akan otomatis terfilter sesuai kata kunci Anda.",
      ],
    },
    {
      icon: Volume2,
      title: "Audio Per Ayat",
      description:
        "Dengarkan lantunan ayat suci Al-Qur'an secara tartil per individu ayat.",
      steps: [
        "Klik ikon Speaker di samping nomor ayat.",
        "Audio akan mulai diputar khusus untuk ayat tersebut.",
        "Anda juga bisa memutar audio satu surah penuh melalui tombol audio di bagian atas.",
      ],
    },
    {
      icon: Moon,
      title: "Mode Gelap/Terang",
      description:
        "Sesuaikan tampilan aplikasi agar nyaman di mata saat membaca siang atau malam.",
      steps: [
        "Temukan ikon Bulan/Matahari di pojok kanan atas.",
        "Klik untuk mengganti tema aplikasi.",
        "Pengaturan ini akan tersimpan secara otomatis.",
      ],
    },
    {
      icon: BookOpen,
      title: "Fitur Tafsir",
      description:
        "Pahami makna mendalam dari setiap ayat melalui tafsir resmi.",
      steps: [
        "Klik tombol 'Tafsir' di deretan tombol aksi ayat.",
        "Panel tafsir akan muncul dari sisi layar.",
        "Baca penjelasan lengkap mengenai ayat tersebut.",
      ],
    },
    {
      icon: Compass,
      title: "Arah Qiblat & Shalat",
      description:
        "Pantau waktu shalat tepat waktu dan temukan arah kiblat di manapun Anda berada.",
      steps: [
        "Lihat kartu 'Jadwal Imsakiyah' atau 'Waktu Shalat' di beranda.",
        "Klik ikon 'Navigasi' untuk update otomatis sesuai lokasi Anda.",
        "Gunakan tombol 'Cek Arah Qiblat' untuk panduan arah Ka'bah.",
      ],
    },
    {
      icon: Sparkles,
      title: "Tanya AI (Asisten)",
      description:
        "Temukan ayat atau doa berdasarkan tema tertentu melalui asisten cerdas kami.",
      steps: [
        "Klik tombol 'Cari Ayat & Doa' dengan ikon bintang di bagian atas.",
        "Ketik topik yang Anda cari (contoh: 'sabar', 'doa orang tua').",
        "AI akan memberikan referensi ayat dan doa yang paling relevan.",
      ],
    },
    {
      icon: Library,
      title: "Juz & Doa Lengkap",
      description:
        "Akses ribuan doa harian dan baca Al-Qur'an secara terorganisir per Juz.",
      steps: [
        "Klik 'Baca per Juz' untuk navigasi 30 Juz yang sistematis.",
        "Klik 'Doa Harian' untuk mengakses kumpulan doa sehari-hari.",
        "Gunakan filter pencarian untuk menemukan konten spesifik.",
      ],
    },
    {
      icon: Sparkles,
      title: "Ayat Hari Ini",
      description:
        "Dapatkan inspirasi harian melalui pilihan ayat acak yang penuh makna setiap harinya.",
      steps: [
        "Lihat bagian 'Ayat Hari Ini' di dalam banner beranda.",
        "Gunakan tombol 'Refresh' (Ikon Putar) untuk mengganti ayat.",
        "Klik 'Baca Ayat' untuk melihat konteks lengkap ayat tersebut.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300 pb-20">
      <SEO
        title="Panduan Penggunaan - Al-Qur'an Indonesia"
        description="Pelajari cara menggunakan fitur-fitur di Al-Qur'an Indonesia seperti bookmark, penanda terakhir dibaca, audio, tafsir, jadwal shalat, dan arah kiblat."
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
              <HelpCircle className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Pusat Bantuan
            </h1>
          </div>

          <ThemeToggle />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Intro */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-bold mb-4 animate-bounce">
            <Lightbulb size={16} />
            <span>Tahukah Anda?</span>
          </div>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-6">
            Maksimalkan Ibadah Digital Anda
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Dari jadwal shalat hingga asisten AI, pelajari cara memanfaatkan
            seluruh fitur premium Al-Qur'an Indonesia untuk mendukung rutinitas
            ibadah Anda.
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {guides.map((guide, index) => (
            <HelpCard key={index} {...guide} />
          ))}
        </div>

        {/* Pro Tip Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-emerald-900/40">
            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
              <History size={150} />
            </div>
            <div className="relative flex flex-col sm:flex-row items-center gap-6">
              <div className="p-4 bg-white/20 rounded-3xl backdrop-blur-xl border border-white/20 shrink-0">
                <History size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Penanda Manual</h3>
                <p className="text-emerald-50 text-sm leading-relaxed">
                  Aplikasi tidak menggunakan sistem auto-menandai. Klik ikon
                  <span className="font-black px-1.5">"Tandai"</span> tepat pada
                  ayat yang sedang dibaca untuk ketelitian posisi "Terakhir
                  Dibaca".
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-900/40">
            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
              <Compass size={150} />
            </div>
            <div className="relative flex flex-col sm:flex-row items-center gap-6">
              <div className="p-4 bg-white/20 rounded-3xl backdrop-blur-xl border border-white/20 shrink-0">
                <Navigation size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Kalibrasi Kompas</h3>
                <p className="text-blue-50 text-sm leading-relaxed">
                  Jika arah kiblat terasa kurang akurat, gerakkan ponsel Anda
                  membentuk pola angka 8 (∞) di udara untuk melakukan kalibrasi
                  sensor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
