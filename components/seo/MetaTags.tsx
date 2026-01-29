import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  noIndex?: boolean;
}

const MetaTags: React.FC<MetaTagsProps> = ({ 
  title, 
  description, 
  keywords, 
  image,
  noIndex = false
}) => {
  const location = useLocation();
  const currentUrl = `https://kolink.ai${location.pathname}`;
  const defaultTitle = "Kolink AI - Viral Content & LinkedIn Growth";
  const defaultDescription = "Create viral LinkedIn posts, audit your profile, and grow your audience with AI-powered tools.";
  const defaultImage = "https://kolink.ai/og-image.png";

  const finalTitle = title ? `${title} | Kolink AI` : defaultTitle;
  const finalDescription = description || defaultDescription;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={currentUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={image || defaultImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={finalTitle} />
      <meta property="twitter:description" content={finalDescription} />
      <meta property="twitter:image" content={image || defaultImage} />
    </Helmet>
  );
};

export default MetaTags;
