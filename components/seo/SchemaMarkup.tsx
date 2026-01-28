import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SchemaMarkupProps {
    type: 'SoftwareApplication' | 'WebApplication' | 'Organization' | 'Product';
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
