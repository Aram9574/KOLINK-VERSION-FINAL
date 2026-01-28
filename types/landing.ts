
export interface FeaturePageData {
    slug: string;
    hero: {
        badge: string;
        title: string;
        subtitle: string;
        cta: string;
        image: string; // Path to image or component name to render
    };
    problem: {
        title: string;
        cards: Array<{
            icon: any; // Lucide icon wrapper or string name
            title: string;
            text: string;
        }>;
    };
    solution: {
        title: string;
        subtitle: string;
        blocks: Array<{
            title: string;
            description: string;
            image: string;
            imagePosition: "left" | "right";
        }>;
    };
    useCases: {
        title: string;
        cases: Array<{
            title: string;
            description: string;
            icon: any;
        }>;
    };
    faq: Array<{
        q: string;
        a: string;
    }>;
    };
}

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    author: {
        name: string;
        avatar: string;
        role: string;
    };
    category: string;
    readTime: string;
    image: string;
    tags?: string[];
}
