// tailwind.config.js
module.exports = {
  content: [
    // 'purge' diganti menjadi 'content'
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  darkMode: "media", // atau 'class' tergantung kebutuhan Anda
  theme: {
    extend: {
      // Tambahkan konfigurasi fontFamily di sini
      fontFamily: {
        // 'arabic' adalah nama kelas utilitas Tailwind yang akan Anda gunakan
        // 'Amiri' adalah nama font yang digunakan oleh Google Fonts
        // Sertakan font fallback jika 'Amiri' tidak tersedia
        arabic: ["Amiri", "Traditional Arabic", "Times New Roman", "serif"],
        // Anda bisa menambahkan font lain jika diperlukan, contoh:
        // sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
