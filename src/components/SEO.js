import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({
  title,
  description,
  ogTitle,
  ogDescription,
  ogUrl,
  breadcrumbList,
}) => {
  const siteName = "Al-Qur'an Indonesia";
  const fullTitle = title ? `${title} - ${siteName}` : siteName;
  const currentUrl = ogUrl || window.location.href;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:title" content={ogTitle || fullTitle} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content="website" />

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
    </Helmet>
  );
};

export default SEO;
