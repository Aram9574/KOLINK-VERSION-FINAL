import { CarouselDesign } from '../../../../types/carousel';

export const DESIGN_PRESETS: Record<string, CarouselDesign> = {
  'executive-minimal': {
    themeId: 'executive-minimal',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#0f172a', // slate-900
      secondary: '#94a3b8', // slate-400
      accent: '#0f172a', // slate-900
      background: '#f8fafc', // slate-50
      text: '#0f172a', // slate-900
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    background: {
      type: 'solid',
      value: '#f8fafc',
      patternType: 'none',
      patternOpacity: 0,
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: 'sm',
    },
  },
  'tech-dark-mode': {
    themeId: 'tech-dark-mode',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#60a5fa', // blue-400
      secondary: '#94a3b8', // slate-400
      accent: '#818cf8', // indigo-400
      background: '#0f172a', // slate-900
      text: '#f1f5f9', // slate-100
    },
    fonts: {
      heading: 'Roboto',
      body: 'Roboto',
    },
    background: {
      type: 'pattern',
      value: '#0f172a',
      patternType: 'grid',
      patternColor: '#1e293b',
      patternOpacity: 0.1,
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: 'xl',
    },
  },
  'elegance-dark': {
    themeId: 'elegance-dark',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#E2C58F', // Gold
      secondary: '#94a3b8', // slate-400
      accent: '#E2C58F',
      background: '#050B18', // Deep Navy
      text: '#cbd5e1', // slate-300
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Lora',
    },
    background: {
      type: 'solid',
      value: '#050B18',
      patternType: 'none',
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: 'none',
    },
  },
  'newspaper-classic': {
    themeId: 'newspaper-classic',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#1A1A1A',
      secondary: '#404040',
      accent: '#000000',
      background: '#F5F5F0', // Off-white/newsprint
      text: '#1A1A1A',
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Merriweather',
    },
    background: {
      type: 'solid',
      value: '#F5F5F0',
      patternType: 'none',
    },
    layout: {
      showSteppers: false,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: 'none',
    },
  },
  'minimalist-dark': {
    themeId: 'minimalist-dark',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#ffffff',
      secondary: '#a1a1aa', // neutral-400
      accent: '#f43f5e', // rose-500
      background: '#0A0A0A',
      text: '#ffffff',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    background: {
      type: 'solid',
      value: '#0A0A0A',
      patternType: 'none',
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: 'none',
    },
  },
  'modern-corporate': {
    themeId: 'modern-corporate',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#0f172a', // slate-900
      secondary: '#475569', // slate-600
      accent: '#2563eb', // blue-600
      background: '#ffffff',
      text: '#334155', // slate-700
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    background: {
      type: 'solid',
      value: '#ffffff',
      patternType: 'dots',
      patternColor: '#bae6fd', // sky-200
      patternOpacity: 0.3,
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: 'lg',
    },
  },
  'founder-elite': {
    themeId: 'founder-elite',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#ffffff',
      secondary: '#94a3b8', // slate-400
      accent: '#0ea5e9', // sky-500
      background: '#020617', // slate-950
      text: '#cbd5e1', // slate-300
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    background: {
      type: 'solid',
      value: '#020617',
      patternType: 'none',
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: 'md',
    },
  },
  'soft-aesthetic': {
    themeId: 'soft-aesthetic',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#0f172a', // slate-900
      secondary: '#64748b', // slate-500
      accent: '#3b82f6', // blue-500
      background: '#FAFAFA',
      text: '#334155', // slate-700
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    background: {
      type: 'solid',
      value: '#FAFAFA',
      patternType: 'none',
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: '2xl',
    },
  },
  'blueprint-tech': {
    themeId: 'blueprint-tech',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#60a5fa', // blue-400
      secondary: '#93c5fd', // blue-300
      accent: '#60a5fa', // blue-400
      background: '#1e3a8a', // blue-900
      text: '#eff6ff', // blue-50
    },
    fonts: {
      heading: 'JetBrains Mono', // or Monospace fallback
      body: 'JetBrains Mono',
    },
    background: {
      type: 'pattern',
      value: '#1e3a8a',
      patternType: 'grid',
      patternColor: '#60a5fa',
      patternOpacity: 0.1,
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: 'sm',
    },
  },
  'saas-modern': {
    themeId: 'saas-modern',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#1e3a8a', // blue-900
      secondary: '#60a5fa', // blue-400
      accent: '#2563eb', // blue-600
      background: '#eff6ff', // blue-50
      text: '#475569', // slate-600
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    background: {
      type: 'solid',
      value: '#eff6ff',
      patternType: 'none',
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: 'xl',
    },
  },
  'masterclass-dark': {
    themeId: 'masterclass-dark',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#ffffff',
      secondary: '#94a3b8', // slate-400
      accent: '#6366f1', // indigo-500 (brand)
      background: '#0A0A0B',
      text: '#cbd5e1', // slate-300
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    background: {
      type: 'solid',
      value: '#0A0A0B',
      patternType: 'none',
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: 'md',
    },
  },
  'step-by-step-clean': {
    themeId: 'step-by-step-clean',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#0f172a', // slate-900
      secondary: '#94a3b8', // slate-400
      accent: '#0f172a',
      background: '#ffffff',
      text: '#475569', // slate-600
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    background: {
      type: 'solid',
      value: '#ffffff',
      patternType: 'none',
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: 'lg',
    },
  },
  'monochrome-pro': {
    themeId: 'monochrome-pro',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#ffffff',
      secondary: '#a3a3a3', // neutral-400
      accent: '#ffffff',
      background: '#000000',
      text: '#ffffff',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    background: {
      type: 'solid',
      value: '#000000',
      patternType: 'none',
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: 'none',
    },
  },
  'earthy-organic': {
    themeId: 'earthy-organic',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#2D5A27', // Green
      secondary: '#5C6B61',
      accent: '#2D5A27',
      background: '#F3EFE0', // Beige
      text: '#434B4D',
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Lora',
    },
    background: {
      type: 'solid',
      value: '#F3EFE0',
      patternType: 'none',
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: 'lg',
    },
  },
  'brutalist-yellow': {
    themeId: 'brutalist-yellow',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#000000',
      secondary: '#000000',
      accent: '#000000',
      background: '#facc15', // yellow-400
      text: '#000000',
    },
    fonts: {
      heading: 'Oswald',
      body: 'Inter',
    },
    background: {
      type: 'solid',
      value: '#facc15',
      patternType: 'none',
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: 'none',
    },
  },
  'cyber-glitch': {
    themeId: 'cyber-glitch',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#06b6d4', // cyan-500
      secondary: '#d946ef', // fuchsia-500
      accent: '#06b6d4',
      background: '#020617', // slate-950
      text: '#f1f5f9', // slate-100
    },
    fonts: {
      heading: 'JetBrains Mono',
      body: 'JetBrains Mono',
    },
    background: {
      type: 'pattern',
      value: '#020617',
      patternType: 'grid',
      patternColor: '#06b6d4',
      patternOpacity: 0.15,
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: 'none',
    },
  },
  'soft-gradient-pro': {
    themeId: 'soft-gradient-pro',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#2563eb', // blue-600
      secondary: '#94a3b8', // slate-400
      accent: '#2563eb',
      background: '#eff6ff',
      text: '#64748b', // slate-500
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    background: {
      type: 'gradient',
      value: 'linear-gradient(to right, #2563eb, #4f46e5)', // Clip text gradient approximation
      patternType: 'none',
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: '2xl',
    },
  },
  'ocean-deep': {
    themeId: 'ocean-deep',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#06b6d4', // cyan-500
      secondary: '#94a3b8', // slate-400
      accent: '#06b6d4',
      background: '#0A192F',
      text: '#cbd5e1', // slate-300
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    background: {
      type: 'solid',
      value: '#0A192F',
      patternType: 'none',
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: 'none',
    },
  },
  'paper-texture-pro': {
    themeId: 'paper-texture-pro',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#222222',
      secondary: '#555555',
      accent: '#222222',
      background: '#FDFCF0',
      text: '#222222',
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Merriweather',
    },
    background: {
      type: 'pattern', // Using texture as a pattern concept
      value: '#FDFCF0',
      patternType: 'none',
    },
    layout: {
      showSteppers: false,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: 'none',
    },
  },
  'electric-vibe': {
    themeId: 'electric-vibe',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#D9FF00', // Lime
      secondary: '#FFFFFF',
      accent: '#D9FF00',
      background: '#000000',
      text: '#D9FF00',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    background: {
      type: 'solid',
      value: '#000000',
      patternType: 'none',
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: 'none',
    },
  },
  'minimalist-slate': {
    themeId: 'minimalist-slate',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#0f172a', // slate-900
      secondary: '#94a3b8', // slate-400
      accent: '#0f172a',
      background: '#ffffff',
      text: '#0f172a',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    background: {
      type: 'solid',
      value: '#ffffff',
      patternType: 'none',
    },
    layout: {
      showSteppers: false,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: 'none',
    },
  },
  'minimalist-pro-accent': {
    themeId: 'minimalist-pro-accent',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#0f172a', // slate-900
      secondary: '#64748b', // slate-500
      accent: '#2563eb', // blue-600
      background: '#ffffff',
      text: '#334155', // slate-700
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    background: {
      type: 'solid',
      value: '#ffffff',
      patternType: 'none',
      patternOpacity: 0,
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: 'md',
    },
  },
  'saas-glass-dark': {
    themeId: 'saas-glass-dark',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#ffffff',
      secondary: '#94a3b8', // slate-400
      accent: '#3b82f6', // blue-500
      background: '#000000',
      text: '#cbd5e1', // slate-300
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    background: {
      type: 'pattern',
      value: '#000000',
      patternType: 'grid',
      patternColor: '#333333',
      patternOpacity: 0.2,
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: 'xl',
    },
  },
  'luxury-gold': {
    themeId: 'luxury-gold',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#D4AF37', // Gold
      secondary: '#F5F5F5',
      accent: '#D4AF37',
      background: '#090909',
      text: '#C5A059',
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Lora',
    },
    background: {
      type: 'solid',
      value: '#090909',
      patternType: 'none',
      patternOpacity: 0,
    },
    layout: {
      showSteppers: false,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: 'none',
    },
  },
  'brutalist-block': {
    themeId: 'brutalist-block',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#000000',
      secondary: '#000000',
      accent: '#dc2626', // red-600
      background: '#ffffff',
      text: '#000000',
    },
    fonts: {
      heading: 'Oswald',
      body: 'Montserrat',
    },
    background: {
      type: 'solid',
      value: '#ffffff',
      patternType: 'none',
      patternOpacity: 0,
    },
    layout: {
      showSteppers: false,
      showSwipeIndicator: false,
      showCreatorProfile: true,
      cornerRadius: 'none',
    },
  },
  'startup-vibes': {
    themeId: 'startup-vibes',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#4f46e5', // indigo-600
      secondary: '#818cf8', // indigo-400
      accent: '#4f46e5',
      background: '#F3F4FF',
      text: '#312e81', // indigo-900
    },
    fonts: {
      heading: 'Poppins',
      body: 'Nunito',
    },
    background: {
      type: 'solid',
      value: '#F3F4FF',
      patternType: 'dots',
      patternColor: '#4f46e5',
      patternOpacity: 0.05,
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: '2xl',
    },
  },
  'zen-minimal': {
    themeId: 'zen-minimal',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#333333',
      secondary: '#666666',
      accent: '#999999',
      background: '#FAF9F6', // Off-white
      text: '#555555',
    },
    fonts: {
      heading: 'Lora',
      body: 'Lato',
    },
    background: {
      type: 'solid',
      value: '#FAF9F6',
      patternType: 'none',
      patternOpacity: 0,
    },
    layout: {
      showSteppers: false,
      showSwipeIndicator: false,
      showCreatorProfile: true,
      cornerRadius: 'lg',
    },
  },
  'gradient-sunset': {
    themeId: 'gradient-sunset',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#ffffff',
      secondary: '#ffedd5', // orange-100
      accent: '#fb923c', // orange-400
      background: '#FF512F',
      text: '#ffffff',
    },
    fonts: {
      heading: 'Montserrat',
      body: 'Raleway',
    },
    background: {
      type: 'solid',
      value: '#FF512F', // Fallback
      patternType: 'none',
      patternOpacity: 0,
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: 'lg',
    },
  },
  'neo-tokyo-night': {
    themeId: 'neo-tokyo-night',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#d946ef', // fuchsia-500
      secondary: '#a855f7', // purple-500
      accent: '#06b6d4', // cyan-500
      background: '#2e1065', // violet-950
      text: '#e9d5ff', // purple-100
    },
    fonts: {
      heading: 'Iceland', // Trying a tech font if available, fallback sans
      body: 'Roboto',
    },
    background: {
      type: 'pattern',
      value: '#2e1065',
      patternType: 'grid',
      patternColor: '#d946ef',
      patternOpacity: 0.15,
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: 'sm',
    },
  },
  'bold-impact': {
    themeId: 'bold-impact',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#000000',
      secondary: '#000000',
      accent: '#000000',
      background: '#FACC15', // Yellow-400
      text: '#000000',
    },
    fonts: {
      heading: 'Oswald',
      body: 'Inter',
    },
    background: {
      type: 'solid',
      value: '#FACC15',
      patternType: 'none',
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: 'none',
    },
  },
  'viral-gradient': {
    themeId: 'viral-gradient',
    aspectRatio: '4:5',
    colorPalette: {
      primary: '#ffffff',
      secondary: '#e9d5ff',
      accent: '#ffffff',
      background: 'linear-gradient(135deg, #4338ca 0%, #7e22ce 50%, #a21caf 100%)', // stored as value
      text: '#ffffff',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    background: {
      type: 'solid',
      value: 'linear-gradient(135deg, #4338ca 0%, #7e22ce 50%, #a21caf 100%)',
      patternType: 'none',
    },
    layout: {
      showSteppers: true,
      showSwipeIndicator: true,
      showCreatorProfile: true,
      cornerRadius: 'lg',
    },
  },
  'cyberpunk-neon': {
    themeId: 'cyberpunk-neon',
    aspectRatio: '4:5',
    colorPalette: {
        primary: '#d946ef',
        secondary: '#a855f7',
        accent: '#06b6d4',
        background: '#000000',
        text: '#e9d5ff',
    },
    fonts: {
        heading: 'Inter', // Fallback
        body: 'Roboto',
    },
    background: {
        type: 'solid',
        value: '#000000',
        patternType: 'grid',
        patternColor: '#06b6d4',
        patternOpacity: 0.2
    },
    layout: {
        showSteppers: true,
        showSwipeIndicator: true,
        showCreatorProfile: true,
        cornerRadius: 'sm'
    }
  },
  'storytelling-pastel': {
    themeId: 'storytelling-pastel',
    aspectRatio: '4:5',
    colorPalette: {
        primary: '#7c2d12', // orange-900
        secondary: '#9a3412', // orange-800
        accent: '#fdba74', // orange-300
        background: '#fff7ed', // orange-50
        text: '#431407', // orange-950
    },
    fonts: {
        heading: 'Playfair Display',
        body: 'Inter',
    },
    background: {
        type: 'solid',
        value: '#fff7ed',
        patternType: 'none',
    },
    layout: {
        showSteppers: true,
        showSwipeIndicator: true,
        showCreatorProfile: true,
        cornerRadius: 'lg'
    }
  },
  'gradient-flow': {
    themeId: 'gradient-flow',
    aspectRatio: '4:5',
    colorPalette: {
        primary: '#ffffff',
        secondary: '#f0abfc', // fuchsia-300
        accent: '#ffffff',
        background: 'linear-gradient(to bottom right, #c026d3, #7e22ce, #4f46e5)',
        text: '#ffffff',
    },
    fonts: {
        heading: 'Inter',
        body: 'Inter',
    },
    background: {
        type: 'solid',
        value: 'linear-gradient(to bottom right, #c026d3, #7e22ce, #4f46e5)',
        patternType: 'none',
    },
    layout: {
        showSteppers: true,
        showSwipeIndicator: true,
        showCreatorProfile: true,
        cornerRadius: 'xl'
    }
  }
};
