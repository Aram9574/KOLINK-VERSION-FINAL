import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SchemaMarkupProps {
    type: 'SoftwareApplication' | 'WebApplication' | 'Organization' | 'Product' | 'FAQPage' | 'HowTo';
    data: Record<string, any>;
}

export const SchemaMarkup: React.FC<SchemaMarkupProps> = ({ type, data }) => {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": type,
        ...data
    };

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
        </Helmet>
    );
};
