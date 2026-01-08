export type SlideType = 'intro' | 'content' | 'outro';
export type AspectRatio = '1:1' | '4:5' | '9:16';
export type Platform = 'linkedin' | 'instagram' | 'tiktok' | 'twitter';

export type PatternType = 'dots' | 'grid' | 'waves' | 'none' | 'noise' | 'checkers' | 'horizontal-lines' | 'half-tone' | 'leaves';
export type LayoutVariant = 'default' | 'big-number' | 'quote' | 'checklist' | 'comparison' | 'code' | 'image-full';

export interface SlideContent {
  title?: string;
  subtitle?: string; // Tagline
  body?: string; // Main text / bullet points
  image_url?: string;
  cta_text?: string;
  visual_hint?: string; // Suggestion for icon/graphic
  background_override?: string;
}

export interface SlideDesignOverride {
  backgroundColor?: string;
  textColor?: string;
  layoutVariant?: LayoutVariant;
}

export interface CarouselSlide {
  id: string;
  type: SlideType;
  layoutVariant: LayoutVariant; // Explicit layout choice
  content: SlideContent;
  designOverride?: SlideDesignOverride;
  isVisible: boolean;
}

export interface CarouselDesign {
  themeId: string;
  aspectRatio: AspectRatio;
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  background: {
    type: 'solid' | 'gradient' | 'image' | 'pattern';
    value: string; // Hex, URL, or Gradient CSS
    patternType?: PatternType;
    patternOpacity?: number;
    patternColor?: string;
  };
  layout: {
    showSteppers: boolean; // Page numbers
    showSwipeIndicator: boolean;
    showCreatorProfile: boolean;
    cornerRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  };
}

export interface CarouselProject {
  id: string;
  title: string;
  platform: Platform;
  author: {
    name: string;
    handle: string;
    avatarUrl?: string;
  };
  slides: CarouselSlide[];
  design: CarouselDesign;
  createdAt: number;
  updatedAt: number;
}
