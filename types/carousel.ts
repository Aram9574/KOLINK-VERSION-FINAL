export type SlideType = 'intro' | 'content' | 'outro' | 'image' | 'poll';
export type AspectRatio = '1:1' | '4:5' | '9:16';
export type Platform = 'linkedin' | 'instagram' | 'tiktok' | 'twitter';

export interface SlideContent {
  title?: string;
  subtitle?: string; // Tagline
  body?: string; // Main text / bullet points
  image_url?: string;
  cta_text?: string;
  background_override?: string;
  variant?: 'default' | 'tweet' | 'quote' | 'image-full' | 'big-number' | 'checklist' | 'code' | 'comparison';
}

export interface SlideDesignOverride {
  backgroundColor?: string;
  textColor?: string;
  layoutId?: string;
}

export interface CarouselSlide {
  id: string;
  type: SlideType;
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
    patternOpacity?: number;
  };
  layout: {
    showSteppers: boolean; // Page numbers
    showSwipeIndicator: boolean;
    showCreatorProfile: boolean;
    cornerRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
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
