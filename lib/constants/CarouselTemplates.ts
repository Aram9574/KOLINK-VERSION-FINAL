import { CarouselDesign } from '../../types/carousel';

export const MASTER_TEMPLATES: Record<string, CarouselDesign> = {
  // 1. Minimal Modern (Default)
  minimal_modern: {
    themeId: 'minimal_modern',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#1e293b',
      secondary: '#475569',
      accent: '#3b82f6',
      background: '#ffffff',
      text: '#0f172a',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    background: {
      type: 'pattern',
      value: '#ffffff',
      patternType: 'dots',
      patternOpacity: 0.03,
      patternColor: '#000000',
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: 'md',
    },
  },

  // 2. Bold Pop
  bold_pop: {
    themeId: 'bold_pop',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#000000',
      secondary: '#333333',
      accent: '#EAB308', // Yellow
      background: '#FDE047', // Light Yellow
      text: '#000000',
    },
    fonts: {
      heading: 'Montserrat',
      body: 'Open Sans',
    },
    background: {
      type: 'solid',
      value: '#FDE047',
      patternType: 'dots',
      patternOpacity: 0.1,
      patternColor: '#000000'
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: 'none',
    },
  },

  // 3. Clinical Clean
  clinical_clean: {
    themeId: 'clinical_clean',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#059669', // Emerald 600
      secondary: '#34D399',
      accent: '#10B981',
      background: '#F0FDF4', // Emerald 50
      text: '#064E3B',
    },
    fonts: {
      heading: 'Lato',
      body: 'Lato',
    },
    background: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #F0FDF4 0%, #ffffff 100%)',
      patternType: 'grid',
      patternOpacity: 0.05,
      patternColor: '#059669'
    },
    layout: {
      showSteppers: false,
      showSwipeIndicator: true,
      showCreatorProfile: false,
      cornerRadius: 'lg',
    },
  },

  // 4. Tech Dark
  tech_dark: {
    themeId: 'tech_dark',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#60A5FA', // Blue 400
      secondary: '#93C5FD',
      accent: '#3B82F6',
      background: '#0F172A', // Slate 900
      text: '#F8FAFC',
    },
    fonts: {
      heading: 'Roboto Mono',
      body: 'Roboto',
    },
    background: {
      type: 'solid',
      value: '#0F172A',
      patternType: 'grid',
      patternOpacity: 0.1,
      patternColor: '#3B82F6'
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: 'xl',
    },
  },

  // 5. Luxury Serif
  luxury_serif: {
    themeId: 'luxury_serif',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#1c1917', // Stone 900
      secondary: '#44403c',
      accent: '#d4af37', // Gold
      background: '#fafaf9', // Stone 50
      text: '#1c1917',
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Lora',
    },
    background: {
      type: 'solid',
      value: '#fafaf9',
      patternType: 'noise',
      patternOpacity: 0.03,
      patternColor: '#000000'
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: false,
      showCreatorProfile: true,
      cornerRadius: 'none',
    },
  },

  // 6. Startup SaaS
  startup_saas: {
    themeId: 'startup_saas',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#4f46e5', // Indigo 600
      secondary: '#818cf8',
      accent: '#fbbf24', // Amber
      background: '#ffffff',
      text: '#111827',
    },
    fonts: {
      heading: 'Plus Jakarta Sans',
      body: 'Inter',
    },
    background: {
      type: 'gradient',
      value: 'linear-gradient(to bottom right, #e0e7ff, #ffffff)',
      patternType: 'checkers',
      patternOpacity: 0.03,
      patternColor: '#4f46e5'
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: '2xl',
    },
  },

  // 7. Nature Organic
  nature_organic: {
    themeId: 'nature_organic',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#3f6212', // Lime 800
      secondary: '#65a30d',
      accent: '#bef264',
      background: '#f7fee7', // Lime 50
      text: '#1a2e05',
    },
    fonts: {
      heading: 'Dm Sans',
      body: 'Dm Sans',
    },
    background: {
      type: 'solid',
      value: '#f7fee7',
      patternType: 'waves',
      patternOpacity: 0.05,
      patternColor: '#3f6212'
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: '3xl',
    },
  },

  // 8. Cyberpunk
  cyberpunk: {
    themeId: 'cyberpunk',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#f472b6', // Pink 400
      secondary: '#22d3ee', // Cyan 400
      accent: '#e879f9', // Purple
      background: '#09090b', // Zinc 950
      text: '#ffffff',
    },
    fonts: {
      heading: 'Oswald',
      body: 'Chivo',
    },
    background: {
      type: 'gradient',
      value: 'linear-gradient(45deg, #09090b 0%, #18181b 100%)',
      patternType: 'grid',
      patternOpacity: 0.2,
      patternColor: '#22d3ee'
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: 'none',
    },
  },

  // 9. Editorial Fashion
  editorial_fashion: {
    themeId: 'editorial_fashion',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#be123c', // Rose 700
      secondary: '#fb7185',
      accent: '#fda4af',
      background: '#fff1f2', // Rose 50
      text: '#881337',
    },
    fonts: {
      heading: 'Bodoni Moda',
      body: 'Lato',
    },
    background: {
      type: 'solid',
      value: '#fff1f2',
      patternType: 'none',
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: false,
      showCreatorProfile: true,
      cornerRadius: 'none',
    },
  },

  // 10. Corporate Trust
  corporate_trust: {
    themeId: 'corporate_trust',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#0c4a6e', // Sky 900
      secondary: '#0284c7',
      accent: '#38bdf8',
      background: '#f0f9ff', // Sky 50
      text: '#082f49',
    },
    fonts: {
      heading: 'Roboto',
      body: 'Open Sans',
    },
    background: {
      type: 'solid',
      value: '#f0f9ff',
      patternType: 'horizontal-lines',
      patternOpacity: 0.05,
      patternColor: '#0c4a6e'
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: 'sm',
    },
  },

  // 11. Sunset Vibes
  sunset_vibes: {
    themeId: 'sunset_vibes',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#c2410c', // Orange 700
      secondary: '#ea580c',
      accent: '#fb923c',
      background: '#fff7ed', // Orange 50
      text: '#431407',
    },
    fonts: {
      heading: 'Poppins',
      body: 'Poppins',
    },
    background: {
      type: 'gradient',
      value: 'linear-gradient(to top, #fff7ed, #ffedd5)',
      patternType: 'noise',
      patternOpacity: 0.05,
      patternColor: '#c2410c'
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: '2xl',
    },
  },

  // 12. Monochrome
  monochrome: {
    themeId: 'monochrome',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#171717', // Neutral 900
      secondary: '#525252',
      accent: '#a3a3a3',
      background: '#ffffff',
      text: '#000000',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    background: {
      type: 'solid',
      value: '#ffffff',
      patternType: 'grid',
      patternOpacity: 0.05,
      patternColor: '#171717'
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: false,
      cornerRadius: 'none',
    },
  },

  // 13. Electric Purple
  electric_purple: {
    themeId: 'electric_purple',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#7c3aed', // Violet 600
      secondary: '#a78bfa',
      accent: '#ddd6fe',
      background: '#2e1065', // Violet 950
      text: '#ffffff',
    },
    fonts: {
      heading: 'Space Grotesk',
      body: 'Space Grotesk',
    },
    background: {
      type: 'gradient',
      value: 'linear-gradient(to bottom, #2e1065, #4c1d95)',
      patternType: 'dots',
      patternOpacity: 0.1,
      patternColor: '#7c3aed'
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: 'xl',
    },
  },
  
  // 14. Retro Pop
  retro_pop: {
    themeId: 'retro_pop',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#be185d', // Pink 700
      secondary: '#f43f5e',
      accent: '#fecdd3',
      background: '#fff1f2',
      text: '#831843',
    },
    fonts: {
      heading: 'Abril Fatface',
      body: 'Montserrat',
    },
    background: {
      type: 'solid',
      value: '#fff1f2',
      patternType: 'half-tone',
      patternOpacity: 0.1,
      patternColor: '#be185d'
    },
    layout: {
      showSteppers: false,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: 'lg',
    },
  },

  // 15. Forest Deep
  forest_deep: {
    themeId: 'forest_deep',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#14532d', // Green 900
      secondary: '#166534',
      accent: '#4ade80',
      background: '#052e16', // Green 950
      text: '#f0fdf4',
    },
    fonts: {
      heading: 'Raleway',
      body: 'Raleway',
    },
    background: {
      type: 'solid',
      value: '#052e16',
      patternType: 'leaves',
      patternOpacity: 0.05,
      patternColor: '#4ade80'
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: 'xl',
    },
  }
};
