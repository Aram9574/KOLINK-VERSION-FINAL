import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { CarouselProject, CarouselSlide, CarouselDesign, AspectRatio, BrandKit } from '../../types/carousel';
import { BrandKitRepository } from '@/services/brandKitRepository';
import { toast } from 'sonner';

interface EditorState {
  activeSlideId: string | null;
  activeElementId: string | null;
  zoomLevel: number;
  isSidebarOpen: boolean;
  isFocusMode: boolean;
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

  // Settings
  updateSettings: (settings: Partial<CarouselProject['settings']>) => void;

  // Design Actions
  updateDesign: (updates: Partial<CarouselDesign> | Partial<CarouselDesign['layout']> | Partial<CarouselDesign['background']>) => void;
  // History
  history: {
      past: CarouselProject[];
      future: CarouselProject[];
  };
  undo: () => void;
  redo: () => void;

  setTheme: (themeId: string) => void; // Will apply a preset of colors/fonts
  updateElementOverride: (slideId: string, elementId: string, styles: any) => void; // Using any to avoid circular deps for now, but should be Partial<ElementStyle>
  duplicateSlide: (id: string) => void;



  // Editor Actions
  setZoom: (zoom: number) => void;
  toggleSidebar: () => void;
  setFocusMode: (isOpen: boolean) => void;
  setActivePanel: (panel: EditorState['activePanel']) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setActiveElement: (id: string | null) => void;

  // Brand Kits (formerly Presets)
  savedPresets: BrandKit[];
  isLoadingPresetes: boolean;
  savePreset: (name: string, userId: string) => Promise<void>;
  loadPresets: (userId: string) => Promise<void>;
  deletePreset: (id: string) => Promise<void>;
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
      body: '',
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
      subtitle: '',
      body: 'Post daily. Engage with comments. Be present. The algorithm rewards consistency above all else.',
      cta_text: '',
    },
  },
  {
    id: 'slide-3',
    type: 'outro',
    layoutVariant: 'default',
    isVisible: true,
    content: {
      title: 'Was this helpful?',
      subtitle: '',
      body: '',
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
    settings: {
        tone: 50, // Balanced
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  editor: {
    activeSlideId: 'slide-1',
    activeElementId: null,
    zoomLevel: 1,
    isSidebarOpen: true,
    isFocusMode: false,
    activePanel: 'generator',
    isGenerating: false,
  },

  // History
  history: {
    past: [],
    future: [],
  },

  undo: () =>
    set((state) => {
      const { past, future } = state.history;
      if (past.length === 0) return {};

      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      
      return {
        project: previous,
        history: {
          past: newPast,
          future: [state.project, ...future],
        },
        // Restore active slide validation
        editor: {
            ...state.editor,
            activeSlideId: previous.slides.find(s => s.id === state.editor.activeSlideId) ? state.editor.activeSlideId : previous.slides[0].id
        }
      };
    }),

  redo: () =>
    set((state) => {
      const { past, future } = state.history;
      if (future.length === 0) return {};

      const next = future[0];
      const newFuture = future.slice(1);

      return {
        project: next,
        history: {
          past: [...past, state.project],
          future: newFuture,
        },
        editor: {
            ...state.editor,
            activeSlideId: next.slides.find(s => s.id === state.editor.activeSlideId) ? state.editor.activeSlideId : next.slides[0].id
        }
      };
    }),
    
  duplicateSlide: (id) => 
    set((state) => {
        const slideIndex = state.project.slides.findIndex(s => s.id === id);
        if (slideIndex === -1) return {};

        const slideToClone = state.project.slides[slideIndex];
        const newSlide = {
            ...slideToClone,
            id: uuidv4(),
            content: { ...slideToClone.content } // Deep copy content
        };

        const newSlides = [...state.project.slides];
        newSlides.splice(slideIndex + 1, 0, newSlide);

        return {
            project: { ...state.project, slides: newSlides },
            history: {
                past: [...state.history.past, state.project],
                future: []
            },
            editor: { ...state.editor, activeSlideId: newSlide.id }
        };
    }),

  setProjectTitle: (title) => 
    set((state) => ({ 
        project: { ...state.project, title },
        history: { past: [...state.history.past, state.project], future: [] } 
    })),

  setAspectRatio: (ratio) =>
    set((state) => ({ 
      project: { 
        ...state.project, 
        design: { ...state.project.design, aspectRatio: ratio } 
      },
      history: { past: [...state.history.past, state.project], future: [] }
    })),

  updateAuthor: (updates) =>
    set((state) => ({
      project: {
        ...state.project,
        author: { ...state.project.author, ...updates }
      },
      history: { past: [...state.history.past, state.project], future: [] }
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
          subtitle: '',
          body: 'Add your content here.',
          cta_text: '',
        },
      };
      const slides = [...state.project.slides];
      if (index !== undefined) {
        slides.splice(index, 0, newSlide);
      } else {
        slides.push(newSlide);
      }
      return { 
          project: { ...state.project, slides }, 
          editor: { ...state.editor, activeSlideId: newSlide.id },
          history: { past: [...state.history.past, state.project], future: [] }
      };
    }),

  removeSlide: (id) =>
    set((state) => ({
      project: { ...state.project, slides: state.project.slides.filter((s) => s.id !== id) },
      history: { past: [...state.history.past, state.project], future: [] }
    })),

  updateSlide: (id, updates) =>
    set((state) => ({
      project: {
        ...state.project,
        slides: state.project.slides.map((s) =>
          s.id === id ? { ...s, ...updates } : s
        ),
      },
      history: { past: [...state.history.past, state.project], future: [] }
    })),

  reorderSlides: (startIndex, endIndex) =>
    set((state) => {
      const slides = [...state.project.slides];
      const [removed] = slides.splice(startIndex, 1);
      slides.splice(endIndex, 0, removed);
      return { 
          project: { ...state.project, slides },
          history: { past: [...state.history.past, state.project], future: [] }
      };
    }),

  setSlides: (slides) =>
    set((state) => ({ 
        project: { ...state.project, slides },
        history: { past: [...state.history.past, state.project], future: [] }
    })),

  setActiveSlide: (id) =>
    set((state) => ({ editor: { ...state.editor, activeSlideId: id } })),

  updateSettings: (settings) =>
    set((state) => ({
      project: {
        ...state.project,
        settings: { ...state.project.settings, ...settings, tone: settings.tone ?? state.project.settings?.tone ?? 50 }
      },
      history: { past: [...state.history.past, state.project], future: [] }
    })),

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
      history: { past: [...state.history.past, state.project], future: [] }
    })),

  updateElementOverride: (slideId, elementId, styles) =>
    set((state) => ({
      project: {
        ...state.project,
        slides: state.project.slides.map((s) => {
           if (s.id !== slideId) return s;
           const currentOverrides = s.elementOverrides || {};
           const currentElementStyle = currentOverrides[elementId] || {};
           return {
             ...s,
             elementOverrides: {
               ...currentOverrides,
               [elementId]: { ...currentElementStyle, ...styles }
             }
           };
        })
      },
      history: { past: [...state.history.past, state.project], future: [] }
    })),

  // Brand Kits
  savedPresets: [],
  isLoadingPresetes: false,
  
  savePreset: async (name, userId) => {
    // Optimistic update handled by fetch after save, or valid state update
    const state = useCarouselStore.getState();
    const currentDesign = state.project.design;

    try {
        const newKit = {
            name,
            colors: currentDesign.colorPalette,
            fonts: currentDesign.fonts
        };
        
        await BrandKitRepository.createBrandKit(userId, newKit);
        
        // Reload list to get the ID and correct state
        const kits = await BrandKitRepository.fetchBrandKits(userId);
        set({ savedPresets: kits });
        
    } catch (e) {
        console.error("Failed to save brand kit", e);
        throw e; // Rethrow for UI to handle toast if needed or handle here
    }
  },

  loadPresets: async (userId) => {
    set({ isLoadingPresetes: true });
    try {
        const kits = await BrandKitRepository.fetchBrandKits(userId);
        set({ savedPresets: kits });
    } catch (e) {
        console.error("Failed to load brand kits", e);
    } finally {
        set({ isLoadingPresetes: false });
    }
  },

  deletePreset: async (id) => {
     try {
         const success = await BrandKitRepository.deleteBrandKit(id);
         if (success) {
             set((state) => ({
                 savedPresets: state.savedPresets.filter(k => k.id !== id)
             }));
         }
     } catch (e) {
         console.error("Failed to delete brand kit", e);
     }
  },

  setTheme: (themeId) => 
    set((state) => {
       // Check if it's a built-in theme or saved preset
       const preset = state.savedPresets.find((p) => p.id === themeId);
       let designUpdates = {};
       
       if (preset) {
           designUpdates = { 
               ...state.project.design,
               colorPalette: preset.colors,
               fonts: preset.fonts,
           };
       } else {
           // Fallback to simpler check or no-op if logic is in DesignPanel
           // Ideally DesignPanel calculates the new design and calls updateDesign, 
           // but keeping setTheme for now.
           // NOTE: DesignPanel already uses updateDesign for master templates.
           // This method might be deprecated or only used for brand kits.
           return {};
       }
       
       return { 
           project: { ...state.project, design: designUpdates },
           history: { past: [...state.history.past, state.project], future: [] }
       };
    }),

  setZoom: (zoomLevel) =>
    set((state) => ({ editor: { ...state.editor, zoomLevel } })),

  toggleSidebar: () =>
    set((state) => ({ editor: { ...state.editor, isSidebarOpen: !state.editor.isSidebarOpen } })),

  setFocusMode: (isFocusMode: boolean) =>
    set((state) => ({ editor: { ...state.editor, isFocusMode } })),

  setActivePanel: (activePanel) =>
    set((state) => ({ editor: { ...state.editor, activePanel } })),

  setIsGenerating: (isGenerating) =>
    set((state) => ({ editor: { ...state.editor, isGenerating } })),

  setActiveElement: (id) =>
    set((state) => ({ editor: { ...state.editor, activeElementId: id } })),

  resetProject: () =>
    set((state) => ({
      project: {
        id: uuidv4(),
        title: 'Untitled Carousel',
        platform: 'linkedin',
        author: { name: 'User Name', handle: '@username' },
        slides: INITIAL_SLIDES,
        design: DEFAULT_DESIGN,
        settings: { tone: 50 },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      history: { past: [...state.history.past, state.project], future: [] },
      editor: {
        activeSlideId: INITIAL_SLIDES[0].id,
        zoomLevel: 1,
        isSidebarOpen: true,
        activePanel: 'generator',
        isGenerating: false,
        activeElementId: null,
      }
    })),
}));
