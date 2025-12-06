import React, { useEffect } from 'react';

/**
 * DomainEnforcer Component
 * 
 * This component runs once when the application mounts.
 * It checks the current window location.
 * If the user is visiting from a vercel.app domain (or any non-production domain excluding localhost),
 * it redirects them to the primary production domain: https://www.kolink.es
 * 
 * This ensures consistent branding and consolidates SEO authority.
 */
const DomainEnforcer: React.FC = () => {
    useEffect(() => {
        // Configuration
        const PRODUCTION_DOMAIN = 'www.kolink.es';
        const TARGET_URL = `https://${PRODUCTION_DOMAIN}`;

        // Current hostname
        const hostname = window.location.hostname;

        // Allow localhost for development
        if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
            return;
        }

        // Check if we are NOT on the production domain
        // We check if the hostname implies it's a Vercel deployment but NOT our custom domain
        // Or simply, if it's NOT the production domain and NOT the apex domain (since apex redirects via Vercel usually, but we can catch it too)

        // Simplest rule: If it's not www.kolink.es and not kolink.es (let Vercel handle apex->www redirect, or handle it here too)
        // The user's Vercel config already handles kolink.es -> www.kolink.es (307 redirect). 
        // So we mainly want to catch *.vercel.app

        if (hostname.endsWith('.vercel.app')) {
            // Construct the new URL preserving the path and query string
            const newUrl = TARGET_URL + window.location.pathname + window.location.search;

            // Perform the redirect
            window.location.replace(newUrl);
        }
    }, []);

    // This component renders nothing
    return null;
};

export default DomainEnforcer;
