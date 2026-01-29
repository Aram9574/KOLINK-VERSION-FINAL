import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getNiche } from '../../data/niches';
import { SeoService } from '../../services/seoService';
import NicheGeneratorPage from '../landing/NicheGeneratorPage';
import ProgrammaticLanding from './ProgrammaticLanding';

const ToolsRouter: React.FC = () => {
    // We capture the slug from the URL. It was named 'nicheSlug' in the original route.
    const { nicheSlug } = useParams<{ nicheSlug: string }>();

    if (!nicheSlug) {
        return <Navigate to="/tools" replace />;
    }

    // 1. Priority: Check existing Legacy Niches (e.g. "real-estate", "marketing")
    const legacyNiche = getNiche(nicheSlug);
    if (legacyNiche) {
        return <NicheGeneratorPage />;
    }

    // 2. Priority: Check Programmatic SEO Pattern ("action-para-role")
    // Example: "generar-posts-linkedin-para-inmobiliaria"
    const parts = nicheSlug.split('-para-');
    if (parts.length === 2) {
        const actionSlug = parts[0];
        const roleSlug = parts[1];
        
        // Validate if this combination exists in our SEO Service configuration
        const metadata = SeoService.getPageMetadata(actionSlug, roleSlug);
        
        if (metadata) {
            // It's valid! Render the dynamic landing page
            return <ProgrammaticLanding actionSlug={actionSlug} roleSlug={roleSlug} />;
        }
    }

    // 3. Fallback: Not found
    // You might want to redirect to a search page or the tools index
    return <Navigate to="/404" replace />;
};

export default ToolsRouter;
