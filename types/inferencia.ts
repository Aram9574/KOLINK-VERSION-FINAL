export type CarouselFormat = "linkedin" | "instagram" | "twitter";

export interface CarouselElement {
    id: string;
    type: "text" | "image" | "shape" | "icon";
    content: string; // Text content or image URL
    x: number;
    y: number;
    width: number;
    height: number;
    style: Record<string, any>; // CSS properties
}

export interface CarouselSlide {
    id: string;
    type: "intro" | "content" | "outro";
    elements: CarouselElement[];
    background: string; // Color or Image URL
    notes?: string;
}

export interface CarouselTheme {
    id: string;
    name: string;
    colors: {
        primary: string;
        secondary: string;
        background: string;
        text: string;
        accent: string;
    };
    fonts: {
        heading: string;
        body: string;
    };
}

export interface EditorState {
    slides: CarouselSlide[];
    activeSlideId: string | null;
    selectedElementId: string | null;
    theme: CarouselTheme;
    format: CarouselFormat;
    history: EditorHistory[];
}

export interface EditorHistory {
    id: string;
    timestamp: number;
    state: Partial<EditorState>;
}
