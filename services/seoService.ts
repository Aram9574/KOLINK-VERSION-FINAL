import { ROLES, ACTIONS, META_TEMPLATES } from '../config/seoConfig';

interface PageMetadata {
  title: string;
  description: string;
  canonical: string;
  roleName: string;
  actionName: string;
  painPoints: string[];
}

export const SeoService = {
  
  /**
   * Generates metadata for a Programmatic SEO page based on the slug segments.
   */
  getPageMetadata(actionSlug: string, roleSlug: string): PageMetadata | null {
    const role = ROLES.find(r => r.slug === roleSlug);
    const action = ACTIONS.find(a => a.slug === actionSlug);

    if (!role || !action) {
      return null;
    }

    const title = META_TEMPLATES.title
      .replace('{Action}', action.name)
      .replace('{Role}', role.name);

    const description = META_TEMPLATES.description
      .replace('{Action}', action.name)
      .replace('{Role}', role.name);

    const canonical = `https://kolink.ai/tools/${action.slug}-para-${role.slug}`;

    return {
      title,
      description,
      canonical,
      roleName: role.name,
      actionName: action.name,
      painPoints: role.painPoints
    };
  },

  /**
   * Returns all possible valid URL paths for sitemap generation
   */
  getAllPaths(): string[] {
    const paths: string[] = [];
    ACTIONS.forEach(action => {
      ROLES.forEach(role => {
        paths.push(`/tools/${action.slug}-para-${role.slug}`);
      });
    });
    return paths;
  }
};
