const fs = require("fs");
const path = require("path");

const BASE_URL = "https://quran.darul.id";
const TOTAL_SURAH = 114;

const generateSitemap = () => {
  const date = new Date().toISOString().split("T")[0];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Home Page -->
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/juz</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${BASE_URL}/doa</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
`;

  // Add all 114 Surahs
  for (let i = 1; i <= TOTAL_SURAH; i++) {
    sitemap += `  <url>
    <loc>${BASE_URL}/baca/${i}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
  }

  sitemap += `</urlset>`;

  const publicPath = path.resolve(__dirname, "../public/sitemap.xml");
  fs.writeFileSync(publicPath, sitemap);

  console.log(`✅ Sitemap successfully generated at: ${publicPath}`);
};

generateSitemap();
