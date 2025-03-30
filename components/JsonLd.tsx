'use client';

import React from 'react';
import Script from 'next/script';

/**
 * JsonLd component for adding structured data to improve SEO
 * This helps search engines better understand the content of your site
 */
export const JsonLd = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ReadmeChef',
    applicationCategory: 'DeveloperApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    operatingSystem: 'Web',
    description:
      'AI-powered README generator that helps you create professional documentation for your projects in minutes.',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '120'
    },
    creator: {
      '@type': 'Person',
      name: 'Samit Kapoor',
      url: 'https://github.com/samitkapoor'
    },
    sameAs: [
      'https://github.com/samitkapoor',
      'https://linkedin.com/in/samit-kapoor',
      'https://x.com/samitkapoorr'
    ]
  };

  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export default JsonLd;
