export interface CarouselTemplate {
    id: string;
    name: string;
    description: string;
    category: "Professional" | "Creative" | "Dark" | "Minimal" | "Premium";
    previewColor: string;
    styles: {
        container: string;
        title: string;
        content: string;
        footer: string;
        slideNumber: string;
        companyName: string;
        logoContainer?: string;
    };
    elements?: {
        showProgressBar?: boolean;
        showDecorativeShapes?: boolean;
        shapeStyle?: string;
    };
}

export const CAROUSEL_TEMPLATES: CarouselTemplate[] = [
    {
        id: "executive-minimal",
        name: "Executive Minimal",
        description:
            "Clean, professional, and authoritative. Best for thought leadership.",
        category: "Professional",
        previewColor: "#f8fafc",
        styles: {
            container:
                "bg-slate-50 text-slate-900 font-sans border border-slate-200",
            title:
                "text-5xl font-extrabold tracking-tight leading-tight text-slate-900",
            content: "text-2xl text-slate-700 leading-relaxed font-light mt-8",
            footer:
                "text-sm font-medium text-slate-400 uppercase tracking-widest",
            slideNumber: "font-bold text-slate-900",
            companyName: "font-bold text-slate-900",
            logoContainer: "mb-12",
        },
        elements: {
            showProgressBar: true,
            showDecorativeShapes: false,
        },
    },
    {
        id: "tech-dark-mode",
        name: "Tech Dark Mode",
        description:
            "Modern, high-contrast dark theme with glassmorphism effects.",
        category: "Dark",
        previewColor: "#0f172a",
        styles: {
            container:
                "bg-slate-900 text-white font-sans bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-cover relative overflow-hidden",
            title:
                "text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 leading-tight drop-shadow-sm",
            content:
                "text-2xl text-slate-300 leading-relaxed font-normal mt-8 backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10",
            footer: "text-sm font-medium text-slate-500",
            slideNumber: "text-blue-400 font-mono",
            companyName: "text-slate-400 font-mono",
            logoContainer:
                "mb-8 opacity-80 hover:opacity-100 transition-opacity",
        },
        elements: {
            showProgressBar: true,
            showDecorativeShapes: true,
            shapeStyle:
                "absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-blue-500/10 rounded-full blur-3xl pointer-events-none",
        },
    },
    {
        id: "bold-impact",
        name: "Bold Impact",
        description:
            "High energy, brutalist typographic style for maximum feed stopping power.",
        category: "Creative",
        previewColor: "#fbbf24",
        styles: {
            container:
                "bg-yellow-400 text-black font-mono border-[8px] border-black relative overflow-hidden",
            title:
                "text-4xl font-black uppercase tracking-tighter leading-[0.9] border-b-4 border-black pb-4 mb-4",
            content: "text-2xl font-black leading-[1.2] mt-4 mb-8",
            footer:
                "text-xl font-black uppercase bg-black text-yellow-400 px-3 py-1.5 inline-block transform -skew-x-12",
            slideNumber:
                "text-2xl font-black absolute bottom-4 right-4 bg-black text-white w-14 h-14 flex items-center justify-center rounded-sm border-2 border-white shadow-lg rotate-3",
            companyName:
                "font-black uppercase tracking-widest text-lg border-b-2 border-black inline-block",
            logoContainer: "mb-4 mix-blend-multiply scale-100 origin-left",
        } as any,
        elements: {
            showProgressBar: false,
            showDecorativeShapes: false,
        },
    },
    {
        id: "elegance-dark",
        name: "Elegance Dark",
        description: "Sophisticated navy and gold theme for high-end brands.",
        category: "Premium",
        previewColor: "#0f172a",
        styles: {
            container:
                "bg-[#050B18] text-white font-serif relative overflow-hidden",
            title:
                "text-5xl font-bold tracking-tight leading-[1.1] text-[#E2C58F] border-b border-[#E2C58F]/20 pb-8",
            content: "text-2xl text-slate-300 leading-relaxed font-light mt-10",
            footer:
                "text-[10px] font-bold text-[#E2C58F] uppercase tracking-[0.4em]",
            slideNumber: "text-[#E2C58F] font-serif italic text-4xl opacity-40",
            companyName:
                "text-white/60 font-sans tracking-widest uppercase text-[10px]",
            logoContainer: "mb-12 opacity-80",
        },
        elements: {
            showProgressBar: true,
            showDecorativeShapes: true,
            shapeStyle:
                "absolute -top-24 -left-24 w-64 h-64 bg-[#E2C58F]/5 rounded-full blur-3xl",
        },
    },
    {
        id: "cyberpunk-neon",
        name: "Cyberpunk Neon",
        description: "Futuristic dark theme with vibrant neon glow effects.",
        category: "Creative",
        previewColor: "#000000",
        styles: {
            container:
                "bg-black text-white font-mono border-2 border-cyan-500/50 relative overflow-hidden",
            title:
                "text-5xl font-black italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-yellow-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]",
            content:
                "text-2xl font-bold leading-snug mt-10 border-l-4 border-fuchsia-500 pl-8",
            footer:
                "text-xs font-black text-cyan-400 uppercase tracking-widest",
            slideNumber:
                "bg-fuchsia-600 text-white w-16 h-10 flex items-center justify-center font-black skew-x-[-15deg] shadow-[0_0_20px_rgba(192,38,211,0.6)]",
            companyName: "text-yellow-400 font-black tracking-tighter",
            logoContainer: "mb-10 brightness-150 saturate-150",
        },
        elements: {
            showProgressBar: true,
            showDecorativeShapes: true,
            shapeStyle:
                "absolute top-0 right-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_10px_#06b6d4]",
        },
    },
    {
        id: "newspaper-classic",
        name: "Newspaper Classic",
        description: "Timeless black and white aesthetic with a classic font.",
        category: "Professional",
        previewColor: "#f5f5f4",
        styles: {
            container:
                "bg-[#F5F5F0] text-[#1A1A1A] font-serif border-double border-4 border-[#1A1A1A] m-2",
            title:
                "text-6xl font-black tracking-tight leading-[0.85] text-center border-b-2 border-black pb-6",
            content:
                "text-xl font-medium leading-relaxed mt-8 indent-8 first-letter:text-5xl first-letter:font-black first-letter:mr-2 first-letter:float-left",
            footer:
                "text-xs font-black uppercase tracking-tighter border-t border-black pt-4 flex justify-between",
            slideNumber: "font-black text-2xl border border-black px-2",
            companyName: "font-black italic text-sm",
            logoContainer: "mb-6 grayscale contrast-150 text-center",
        },
        elements: {
            showProgressBar: false,
            showDecorativeShapes: false,
        },
    },
    {
        id: "minimalist-dark",
        name: "Minimalist Dark",
        description: "Sleek and professional dark theme with ruby accents.",
        category: "Dark",
        previewColor: "#171717",
        styles: {
            container: "bg-[#0A0A0A] text-white font-sans",
            title: "text-5xl font-black tracking-tighter leading-tight",
            content:
                "text-2xl text-neutral-400 font-light leading-relaxed mt-10",
            footer:
                "text-[10px] font-bold text-neutral-600 uppercase tracking-[0.4em]",
            slideNumber: "text-rose-500 font-black text-2xl",
            companyName: "text-white font-bold tracking-tight",
            logoContainer: "mb-12 brightness-0 invert opacity-80",
        },
        elements: {
            showProgressBar: true,
            showDecorativeShapes: true,
            shapeStyle: "absolute top-0 left-0 w-1 h-full bg-rose-600",
        },
    },
    {
        id: "modern-corporate",
        name: "Modern Corporate",
        description:
            "Clean enterprise aesthetic with professional blue accents.",
        category: "Professional",
        previewColor: "#ffffff",
        styles: {
            container:
                "bg-white text-slate-900 font-sans border border-slate-100",
            title: "text-5xl font-extrabold text-slate-900 leading-tight",
            content:
                "text-2xl text-slate-600 leading-relaxed mt-8 bg-slate-50 p-8 rounded-2xl border border-slate-100",
            footer:
                "text-xs font-bold text-slate-400 uppercase tracking-widest",
            slideNumber:
                "bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-blue-500/20",
            companyName: "text-blue-600 font-black",
            logoContainer: "mb-10",
        },
        elements: {
            showProgressBar: true,
            showDecorativeShapes: true,
            shapeStyle:
                "absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-bl-[100px]",
        },
    },
    {
        id: "storytelling-pastel",
        name: "Storytelling Pastel",
        description: "Warm and inviting layout for personal brand stories.",
        category: "Creative",
        previewColor: "#fff7ed",
        styles: {
            container: "bg-[#FFFBF5] text-orange-950 font-sans",
            title:
                "text-5xl font-serif italic font-bold tracking-tight text-orange-900 leading-[1.2]",
            content:
                "text-2xl text-orange-800/80 leading-loose font-medium mt-10",
            footer:
                "text-[11px] font-black text-orange-300 uppercase tracking-[0.2em]",
            slideNumber: "text-orange-900 font-serif italic font-bold text-3xl",
            companyName: "text-orange-900/40 font-bold",
            logoContainer: "mb-16 opacity-30 grayscale contrast-125",
        },
        elements: {
            showProgressBar: true,
            showDecorativeShapes: true,
            shapeStyle:
                "absolute bottom-12 right-12 w-24 h-24 bg-orange-100/50 rounded-full blur-2xl",
        },
    },
    {
        id: "founder-elite",
        name: "Founder Elite",
        description: "Elegant, high-authority look for top-tier creators.",
        category: "Premium",
        previewColor: "#0f172a",
        styles: {
            container:
                "bg-slate-950 text-white font-sans relative overflow-hidden",
            title:
                "text-6xl font-black tracking-tight leading-[1.1] bg-gradient-to-br from-white via-white to-slate-500 bg-clip-text text-transparent",
            content:
                "text-3xl text-slate-300 leading-relaxed font-light mt-12 pl-8 border-l-2 border-slate-800",
            footer:
                "text-sm font-bold text-slate-500 uppercase tracking-[0.3em]",
            slideNumber:
                "text-slate-700 font-black text-8xl absolute -bottom-4 -left-4 opacity-20",
            companyName: "font-black text-sky-500 tracking-widest",
            logoContainer: "mb-16",
        },
        elements: {
            showProgressBar: true,
            showDecorativeShapes: true,
            shapeStyle:
                "absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-sky-500 to-indigo-600",
        },
    },
    {
        id: "viral-gradient",
        name: "Viral Gradient",
        description: "Vibrant and energetic, impossible to scroll past.",
        category: "Creative",
        previewColor: "#8b5cf6",
        styles: {
            container:
                "bg-gradient-to-br from-indigo-900 via-purple-900 to-fuchsia-900 text-white font-sans",
            title:
                "text-7xl font-black italic tracking-tighter leading-none drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]",
            content:
                "text-3xl font-bold leading-snug mt-12 bg-white/10 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/20 shadow-2xl",
            footer:
                "text-sm font-black uppercase tracking-widest text-white/40",
            slideNumber:
                "bg-white text-indigo-900 w-20 h-20 flex items-center justify-center rounded-3xl font-black text-3xl rotate-12 shadow-xl",
            companyName: "font-black tracking-tighter text-2xl text-white",
            logoContainer: "mb-12 brightness-0 invert",
        },
        elements: {
            showProgressBar: true,
            showDecorativeShapes: true,
            shapeStyle:
                "absolute -top-24 -right-24 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-[120px]",
        },
    },
    {
        id: "soft-aesthetic",
        name: "Soft Aesthetic",
        description: "Minimalist, clean, and beautifully spaced.",
        category: "Minimal",
        previewColor: "#fffbeb",
        styles: {
            container: "bg-[#FAFAFA] text-slate-900 font-sans",
            title:
                "text-5xl font-light tracking-tight text-slate-900 leading-[1.2]",
            content:
                "text-2xl text-slate-500 leading-loose font-normal mt-12 bg-white p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100",
            footer:
                "text-xs font-bold text-slate-300 uppercase tracking-widest",
            slideNumber: "text-slate-900 font-bold",
            companyName: "text-slate-400 font-semibold",
            logoContainer: "mb-16 opacity-40 grayscale",
        },
        elements: {
            showProgressBar: true,
            showDecorativeShapes: true,
            shapeStyle:
                "absolute top-12 right-12 w-3 h-3 bg-blue-500 rounded-full",
        },
    },
    {
        id: "blueprint-tech",
        name: "Blueprint Tech",
        description: "Technical, structured layout with a grid feel.",
        category: "Dark",
        previewColor: "#1e3a8a",
        styles: {
            container:
                "bg-blue-900 text-blue-50 font-mono bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:40px_40px]",
            title:
                "text-5xl font-bold border-l-8 border-blue-400 pl-8 leading-tight",
            content: "text-2xl font-medium leading-relaxed mt-10 opacity-90",
            footer:
                "text-xs font-bold bg-blue-800 px-4 py-2 rounded-lg border border-blue-700",
            slideNumber: "font-mono border-2 border-blue-400 p-2 rounded",
            companyName: "font-black text-blue-400",
            logoContainer: "mb-12 border-b border-blue-800 pb-8",
        },
        elements: {
            showProgressBar: true,
            showDecorativeShapes: true,
            shapeStyle:
                "absolute top-0 left-0 w-full h-full border-[1px] border-blue-400/20 pointer-events-none",
        },
    },
    {
        id: "saas-modern",
        name: "SaaS Modern",
        description:
            "Trustworthy, clean enterprise aesthetic with blue accents.",
        category: "Professional",
        previewColor: "#eff6ff",
        styles: {
            container:
                "bg-blue-50 text-slate-800 font-sans relative overflow-hidden",
            title: "text-5xl font-bold tracking-tight text-blue-900",
            content: "text-2xl text-slate-600 leading-relaxed font-normal mt-8",
            footer:
                "text-sm font-semibold text-blue-400 uppercase tracking-wider",
            slideNumber:
                "text-blue-200 font-bold text-6xl opacity-40 absolute bottom-[-10px] right-[-10px]",
            companyName: "font-semibold text-blue-600",
            logoContainer: "mb-10",
        },
        elements: {
            showProgressBar: true,
            showDecorativeShapes: true,
            shapeStyle:
                "absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-bl-full pointer-events-none",
        },
    },
    {
        id: "gradient-flow",
        name: "Gradient Flow",
        description:
            "Trendy, Instagram-style fluent gradients for creative brands.",
        category: "Creative",
        previewColor: "#c026d3",
        styles: {
            container:
                "bg-gradient-to-br from-fuchsia-600 via-purple-600 to-indigo-600 text-white font-sans",
            title: "text-5xl font-black tracking-tight drop-shadow-lg",
            content:
                "text-2xl text-white/90 leading-relaxed font-medium mt-8 drop-shadow-md",
            footer: "text-sm font-bold text-white/60",
            slideNumber:
                "text-white/40 font-bold border border-white/20 rounded-full w-12 h-12 flex items-center justify-center",
            companyName: "font-bold text-white tracking-wide",
            logoContainer: "mb-8 brightness-0 invert opacity-90",
        },
        elements: {
            showProgressBar: true,
            showDecorativeShapes: true,
            shapeStyle:
                "absolute bottom-0 left-0 w-full h-[6px] bg-white/20 backdrop-blur-sm",
        },
    },
];
