import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { CarouselProject, CarouselSlide, CarouselDesign, AspectRatio } from '../../types/carousel';

interface EditorState {
  activeSlideId: string | null;
  zoomLevel: number;
  isSidebarOpen: boolean;
  activePanel: 'generator' | 'templates' | 'brand';
  isGenerating: boolean;
}

interface CarouselStore {
  project: CarouselProject;
  editor: EditorState;

  // Actions
  setProjectTitle: (title: string) => void;
  setAspectRatio: (ratio: AspectRatio) => void;
  updateAuthor: (updates: Partial<CarouselProject['author']>) => void;
  
  // Slide Actions
  addSlide: (type?: CarouselSlide['type'], index?: number) => void;
  removeSlide: (id: string) => void;
  updateSlide: (id: string, updates: Partial<CarouselSlide> | Partial<CarouselSlide['content']>) => void;
  reorderSlides: (startIndex: number, endIndex: number) => void;
  setSlides: (slides: CarouselSlide[]) => void;
  setActiveSlide: (id: string) => void;

  // Design Actions
  updateDesign: (updates: Partial<CarouselDesign> | Partial<CarouselDesign['layout']> | Partial<CarouselDesign['background']>) => void;
  setTheme: (themeId: string) => void; // Will apply a preset of colors/fonts

  // Editor Actions
  setZoom: (zoom: number) => void;
  toggleSidebar: () => void;
  setActivePanel: (panel: EditorState['activePanel']) => void;
  setIsGenerating: (isGenerating: boolean) => void;

  // Presets
  savedPresets: any[]; // Using any for simplicity in this phase, ideally defining a Preset type
  savePreset: (name: string) => void;
  loadPresets: () => void;
  deletePreset: (id: string) => void;
  resetProject: () => void;
}

const DEFAULT_DESIGN: CarouselDesign = {
  themeId: 'modern_minimal',
  aspectRatio: '4:5',
  colorPalette: {
    primary: '#2563EB', // Blue-600
    secondary: '#1E40AF', // Blue-800
    accent: '#F59E0B', // Amber-500
    background: '#FFFFFF',
    text: '#1F2937', // Gray-800
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
  },
  background: {
    type: 'pattern',
    value: '#FFFFFF',
    patternType: 'dots',
    patternOpacity: 0.05,
    patternColor: '#000000',
  },
  layout: {
    showSteppers: true,
    showSwipeIndicator: true,
    showCreatorProfile: true,
    cornerRadius: 'md',
  },
};

const INITIAL_SLIDES: CarouselSlide[] = [
  {
    id: 'slide-1',
    type: 'intro',
    layoutVariant: 'default',
    isVisible: true,
    content: {
      title: 'How to Build a Personal Brand in 2026',
      subtitle: 'The Ultimate Guide',
      cta_text: 'Swipe to learn',
    },
  },
  {
    id: 'slide-2',
    type: 'content',
    layoutVariant: 'default',
    isVisible: true,
    content: {
      title: 'Consistency is Key',
      body: 'Post daily. Engage with comments. Be present. The algorithm rewards consistency above all else.',
    },
  },
  {
    id: 'slide-3',
    type: 'outro',
    layoutVariant: 'default',
    isVisible: true,
    content: {
      title: 'Was this helpful?',
      cta_text: 'Follow for more tips!',
    },
  },
];

export const useCarouselStore = create<CarouselStore>((set) => ({
  project: {
    id: 'new-project',
    title: 'Untitled Carousel',
    platform: 'linkedin',
    author: {
      name: 'User Name', // Placeholder, should come from UserContext
      handle: '@username',
    },
    slides: INITIAL_SLIDES,
    design: DEFAULT_DESIGN,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  editor: {
    activeSlideId: 'slide-1',
    zoomLevel: 1,
    isSidebarOpen: true,
    activePanel: 'generator',
    isGenerating: false,
  },

  setProjectTitle: (title) => 
    set((state) => ({ project: { ...state.project, title } })),

  setAspectRatio: (ratio) =>
    set((state) => ({ 
      project: { 
        ...state.project, 
        design: { ...state.project.design, aspectRatio: ratio } 
      } 
    })),

  updateAuthor: (updates) =>
    set((state) => ({
      project: {
        ...state.project,
        author: { ...state.project.author, ...updates }
      }
    })),

  addSlide: (type = 'content', index) =>
    set((state) => {
      const newSlide: CarouselSlide = {
        id: uuidv4(),
        type,
        layoutVariant: 'default',
        isVisible: true,
        content: {
          title: 'New Slide',
          body: 'Add your content here.',
        },
      };
      const slides = [...state.project.slides];
      if (index !== undefined) {
        slides.splice(index, 0, newSlide);
      } else {
        slides.push(newSlide);
      }
      return { project: { ...state.project, slides }, editor: { ...state.editor, activeSlideId: newSlide.id } };
    }),

  removeSlide: (id) =>
    set((state) => ({
      project: { ...state.project, slides: state.project.slides.filter((s) => s.id !== id) },
    })),

  updateSlide: (id, updates) =>
    set((state) => ({
      project: {
        ...state.project,
        slides: state.project.slides.map((s) =>
          s.id === id ? { ...s, ...updates } : s
        ),
      },
    })),

  reorderSlides: (startIndex, endIndex) =>
    set((state) => {
      const slides = [...state.project.slides];
      const [removed] = slides.splice(startIndex, 1);
      slides.splice(endIndex, 0, removed);
      return { project: { ...state.project, slides } };
    }),

  setSlides: (slides) =>
    set((state) => ({ project: { ...state.project, slides } })),

  setActiveSlide: (id) =>
    set((state) => ({ editor: { ...state.editor, activeSlideId: id } })),

  updateDesign: (updates) =>
    set((state) => ({
      project: {
        ...state.project,
        design: { 
          ...state.project.design, 
          ...updates, 
          layout: { ...state.project.design.layout, ...(updates as any).layout },
          background: { ...state.project.design.background, ...(updates as any).background },
          colorPalette: { ...state.project.design.colorPalette, ...(updates as any).colorPalette }
        },
      },
    })),

  // Presets
  savedPresets: [],
  
  savePreset: (name) =>
    set((state) => {
       const newPreset = { ...state.project.design, themeId: uuidv4(), name }; // Add name prop to design type conceptually or just store it
       // Actually we need a specific type for presets. Let's just store the design object with a name property.
       const presetWithMeta = { ...state.project.design, id: uuidv4(), name };
       
       const updatedPresets = [...state.savedPresets, presetWithMeta];
       localStorage.setItem('kolink_brand_presets', JSON.stringify(updatedPresets));
       return { savedPresets: updatedPresets };
    }),

  loadPresets: () =>
    set((state) => {
      const stored = localStorage.getItem('kolink_brand_presets');
      if (stored) {
          return { savedPresets: JSON.parse(stored) };
      }
      return {};
    }),

  deletePreset: (id) =>
    set((state) => {
        const updated = state.savedPresets.filter((p: any) => p.id !== id);
        localStorage.setItem('kolink_brand_presets', JSON.stringify(updated));
        return { savedPresets: updated };
    }),

  setTheme: (themeId) => 
    set((state) => {
       // Check if it's a built-in theme or saved preset
       const preset = state.savedPresets.find((p: any) => p.id === themeId);
       if (preset) {
           return { 
               project: { 
                   ...state.project, 
                   design: { 
                       ...state.project.design, 
                       colorPalette: preset.colorPalette,
                       fonts: preset.fonts,
                       background: preset.background 
                   } 
               } 
           };
       }
       return state; 
    }),

  setZoom: (zoomLevel) =>
    set((state) => ({ editor: { ...state.editor, zoomLevel } })),

  toggleSidebar: () =>
    set((state) => ({ editor: { ...state.editor, isSidebarOpen: !state.editor.isSidebarOpen } })),

  setActivePanel: (activePanel) =>
    set((state) => ({ editor: { ...state.editor, activePanel } })),

  setIsGenerating: (isGenerating) =>
    set((state) => ({ editor: { ...state.editor, isGenerating } })),

  resetProject: () =>
    set(() => ({
      project: {
        id: uuidv4(),
        title: 'Untitled Carousel',
        platform: 'linkedin',
        author: { name: 'User Name', handle: '@username' },
        slides: INITIAL_SLIDES,
        design: DEFAULT_DESIGN,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      editor: {
        activeSlideId: INITIAL_SLIDES[0].id,
        zoomLevel: 1,
        isSidebarOpen: true,
        activePanel: 'generator',
        isGenerating: false,
      }
    })),
}));
