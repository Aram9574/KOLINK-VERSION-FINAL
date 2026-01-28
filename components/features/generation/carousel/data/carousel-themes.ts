import { CarouselDesign } from "@/types/carousel";

export interface CarouselThemePreset {
    id: string;
    name: string;
    design: Partial<CarouselDesign>; // Only the design parts that change
    previewColor: string; // Main color for the thumbnail UI if needed
}

export const CAROUSEL_THEMES: CarouselThemePreset[] = [
    {
        id: "modern-minimal",
        name: "Modern Minimal",
        previewColor: "#2563EB",
        design: {
            themeId: "modern-minimal",
            aspectRatio: "4:5",
            fonts: { heading: "Inter", body: "Inter" },
            colorPalette: {
                primary: "#2563EB", // Blue-600
                secondary: "#1E40AF", // Blue-800
                accent: "#F59E0B", // Amber-500
                background: "#FFFFFF",
                text: "#1F2937",
            },
            background: {
                type: "pattern",
                patternType: "dots",
                patternOpacity: 0.05,
                patternColor: "#000000",
                value: "#FFFFFF"
            },
            layout: { cornerRadius: "md", showSteppers: true, showSwipeIndicator: true, showCreatorProfile: true }
        }
    },
    {
        id: "bold-brand",
        name: "Bold Brand",
        previewColor: "#7C3AED",
        design: {
            themeId: "bold-brand",
            aspectRatio: "4:5",
            fonts: { heading: "Oswald", body: "Inter" },
            colorPalette: {
                primary: "#7C3AED", // Violet-600
                secondary: "#5B21B6", // Violet-800
                accent: "#10B981", // Emerald-500
                background: "#F5F3FF", // Violet-50
                text: "#111827",
            },
            background: {
                type: "pattern",
                patternType: "grid",
                patternOpacity: 0.1,
                patternColor: "#7C3AED",
                value: "#F5F3FF"
            },
            layout: { cornerRadius: "xl", showSteppers: true, showSwipeIndicator: true, showCreatorProfile: true }
        }
    },
    {
        id: "dark-mode",
        name: "Dark Mode",
        previewColor: "#111827",
        design: {
            themeId: "dark-mode",
            aspectRatio: "4:5",
            fonts: { heading: "Plus Jakarta Sans", body: "Inter" },
            colorPalette: {
                primary: "#60A5FA", // Blue-400
                secondary: "#3B82F6", // Blue-500
                accent: "#F472B6", // Pink-400
                background: "#111827", // Gray-900
                text: "#F9FAFB", // Gray-50
            },
            background: {
                type: "solid",
                patternType: "none",
                value: "#111827"
            },
            layout: { cornerRadius: "lg", showSteppers: true, showSwipeIndicator: true, showCreatorProfile: true }
        }
    },
    {
        id: "luxe-serif",
        name: "Luxe Serif",
        previewColor: "#1C1917",
        design: {
            themeId: "luxe-serif",
            aspectRatio: "4:5",
            fonts: { heading: "Playfair Display", body: "Montserrat" },
            colorPalette: {
                primary: "#1C1917", // Stone-900
                secondary: "#44403C", // Stone-700
                accent: "#D97706", // Amber-600
                background: "#FAFAF9", // Stone-50
                text: "#292524",
            },
            background: {
                type: "pattern",
                patternType: "waves",
                patternOpacity: 0.03,
                patternColor: "#D97706",
                value: "#FAFAF9"
            },
            layout: { cornerRadius: "none", showSteppers: true, showSwipeIndicator: false, showCreatorProfile: true }
        }
    },
    {
        id: "startup-tech",
        name: "Tech Startup",
        previewColor: "#0EA5E9",
        design: {
            themeId: "startup-tech",
            aspectRatio: "4:5",
            fonts: { heading: "Plus Jakarta Sans", body: "Inter" },
            colorPalette: {
                primary: "#0EA5E9", // Sky-500
                secondary: "#0284C7", // Sky-600
                accent: "#6366F1", // Indigo-500
                background: "#F0F9FF", // Sky-50
                text: "#0F172A", // Slate-900
            },
            background: {
                type: "pattern",
                patternType: "grid",
                patternOpacity: 0.15,
                patternColor: "#0EA5E9",
                value: "#F0F9FF"
            },
            layout: { cornerRadius: "2xl", showSteppers: true, showSwipeIndicator: true, showCreatorProfile: true }
        }
    },
    {
        id: "warm-breeze",
        name: "Warm Breeze",
        previewColor: "#F97316",
        design: {
            themeId: "warm-breeze",
            aspectRatio: "4:5",
            fonts: { heading: "Poppins", body: "Inter" },
            colorPalette: {
                primary: "#F97316", // Orange-500
                secondary: "#EA580C", // Orange-600
                accent: "#EAB308", // Yellow-500
                background: "#FFF7ED", // Orange-50
                text: "#431407", // Orange-950
            },
            background: {
                type: "pattern",
                patternType: "dots",
                patternOpacity: 0.1,
                patternColor: "#F97316",
                value: "#FFF7ED"
            },
            layout: { cornerRadius: "lg", showSteppers: true, showSwipeIndicator: true, showCreatorProfile: true }
        }
    }
];
