import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({
  title,
  description,
  ogTitle,
  ogDescription,
  ogUrl,
  breadcrumbList,
  isHomePage = false,
}) => {
  const siteName = "Al-Qur'an Indonesia";
  const domain = "https://quran.darul.id";
  const fullTitle = title ? `${title} - ${siteName}` : siteName;
  const currentUrl = ogUrl || window.location.href;
  const logoUrl = `${domain}/icon-quran.png`;

  return (
    <Helmet>
      {/* Title & Description */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={ogTitle || fullTitle} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={logoUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || fullTitle} />
      <meta name="twitter:description" content={ogDescription || description} />
      <meta name="twitter:image" content={logoUrl} />

      {/* Breadcrumbs Schema */}
      {breadcrumbList && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: breadcrumbList.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.name,
              item: item.url,
            })),
          })}
        </script>
      )}

      {/* WebSite SearchBox Schema (Only on Home) */}
      {isHomePage && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            url: domain,
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${domain}/?search={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
