// tailwind.config.js
module.exports = {
  content: [
    // 'purge' diganti menjadi 'content'
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  darkMode: "media", // atau 'class' tergantung kebutuhan Anda
  theme: {
    extend: {},
  },
  plugins: [],
};
