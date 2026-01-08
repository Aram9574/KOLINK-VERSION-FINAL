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
                "bg-slate-50 text-slate-900 font-sans border border-slate-200/60/60",
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
                "bg-white text-slate-900 font-sans border border-slate-200/60/60",
            title: "text-5xl font-extrabold text-slate-900 leading-tight",
            content:
                "text-2xl text-slate-600 leading-relaxed mt-8 bg-slate-50 p-8 rounded-xl border border-slate-200/60/60",
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
                "bg-white text-indigo-900 w-20 h-20 flex items-center justify-center rounded-xl font-black text-3xl rotate-12 shadow-xl",
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
                "text-2xl text-slate-500 leading-loose font-normal mt-12 bg-white p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-200/60/60",
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
    {
        id: "masterclass-dark",
        name: "Masterclass Dark",
        description: "Dark, sophisticated theme with a focus on education and authority.",
        category: "Premium",
        previewColor: "#000000",
        styles: {
            container: "bg-[#0A0A0B] text-white font-sans border-t-4 border-brand-500",
            title: "text-5xl font-black tracking-tight leading-[1.1] mb-6",
            content: "text-2xl text-slate-400 leading-relaxed font-normal mt-8",
            footer: "text-[10px] font-bold text-slate-500 uppercase tracking-widest",
            slideNumber: "bg-brand-600 text-white px-3 py-1 rounded font-bold text-lg",
            companyName: "text-brand-400 font-bold",
            logoContainer: "mb-10",
        },
        elements: {
            showProgressBar: true,
            showDecorativeShapes: true,
            shapeStyle: "absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-bl-full",
        },
    },
    {
        id: "step-by-step-clean",
        name: "Step-by-Step",
        description: "Minimalist layout with clear progression markers. Ideal for tutorials.",
        category: "Minimal",
        previewColor: "#ffffff",
        styles: {
            container: "bg-white text-slate-900 font-sans border border-slate-200/60",
            title: "text-4xl font-extrabold text-slate-900 flex items-center gap-4",
            content: "text-xl text-slate-600 leading-relaxed mt-10 p-8 bg-slate-50 rounded-2xl border border-slate-100",
            footer: "text-xs font-semibold text-slate-400",
            slideNumber: "w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold",
            companyName: "text-slate-900 font-bold",
            logoContainer: "mb-8",
        },
        elements: {
            showProgressBar: true,
            showDecorativeShapes: false,
        },
    },
    {
        id: "minimalist-pro-accent",
        name: "Minimalist Pro",
        description: "High-end minimalist design with subtle brand accents and airy spacing.",
        category: "Premium",
        previewColor: "#fafafa",
        styles: {
            container: "bg-white text-slate-950 font-sans",
            title: "text-6xl font-black tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-500",
            content: "text-2xl text-slate-500 font-medium leading-normal mt-12",
            footer: "text-[10px] font-black text-brand-500 uppercase tracking-[0.5em]",
            slideNumber: "text-slate-200 text-9xl font-black absolute -bottom-10 -right-10 leading-none",
            companyName: "text-slate-900 font-black",
            logoContainer: "mb-20",
        },
        elements: {
            showProgressBar: true,
            showDecorativeShapes: true,
            shapeStyle: "absolute top-10 left-10 w-2 h-2 bg-brand-500 rounded-full",
        },
    },
    {
        id: "saas-glass-dark",
        name: "SaaS Glass",
        description: "Modern glassmorphism style for high-tech product updates.",
        category: "Dark",
        previewColor: "#000000",
        styles: {
            container: "bg-black text-white font-sans bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]",
            title: "text-5xl font-black tracking-tight leading-none text-white",
            content: "text-2xl text-neutral-300 leading-relaxed mt-8 bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl",
            footer: "text-xs font-bold text-neutral-500 tracking-widest",
            slideNumber: "bg-blue-500 text-white w-12 h-12 flex items-center justify-center rounded-2xl font-black text-xl shadow-[0_0_20px_rgba(59,130,246,0.5)]",
            companyName: "text-blue-400 font-black",
            logoContainer: "mb-8",
        },
        elements: {
            showProgressBar: true,
            showDecorativeShapes: true,
            shapeStyle: "absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px]",
        },
    },
    {
        id: "luxury-gold",
        name: "Luxury Gold",
        description: "Prestigious black and gold aesthetic for high-ticket offers.",
        category: "Premium",
        previewColor: "#000000",
        styles: {
            container: "bg-[#090909] text-white font-serif border-[1px] border-[#D4AF37]/30",
            title: "text-6xl font-black italic tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#D4AF37] to-[#8A6D3B] leading-[1.1]",
            content: "text-2xl text-[#C5A059] leading-loose font-light mt-12 pl-10 border-l-[1px] border-[#D4AF37]/20",
            footer: "text-[9px] font-black text-[#D4AF37] uppercase tracking-[0.6em]",
            slideNumber: "text-[#D4AF37] font-serif text-3xl opacity-50",
            companyName: "text-white/80 font-sans tracking-[0.3em] font-light",
            logoContainer: "mb-16",
        },
        elements: {
            showProgressBar: false,
            showDecorativeShapes: true,
            shapeStyle: "absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent",
        },
    },
    {
        id: "brutalist-block",
        name: "Brutalist Block",
        description: "Raw, high-contrast urban design for maximum disruption.",
        category: "Creative",
        previewColor: "#ffffff",
        styles: {
            container: "bg-white text-black font-mono border-[15px] border-black",
            title: "text-6xl font-black uppercase tracking-tighter bg-black text-white px-4 py-2 inline-block leading-none rotate-[-1deg]",
            content: "text-3xl font-black leading-tight mt-12 underline decoration-8",
            footer: "text-lg font-black bg-black text-white px-2 py-1 inline-block uppercase",
            slideNumber: "text-5xl font-black",
            companyName: "font-black underline",
            logoContainer: "mb-10",
        },
        elements: {
            showProgressBar: false,
            showDecorativeShapes: true,
            shapeStyle: "absolute bottom-10 right-10 w-24 h-24 bg-red-600 border-4 border-black",
        },
    },
    {
        id: "startup-vibes",
        name: "Startup Vibes",
        description: "Cool, friendly and approachable design for Gen-Z founders.",
        category: "Creative",
        previewColor: "#6366f1",
        styles: {
            container: "bg-[#F3F4FF] text-indigo-950 font-sans",
            title: "text-5xl font-black tracking-tight leading-[1.1] text-indigo-600",
            content: "text-2xl text-indigo-900/70 leading-relaxed font-bold mt-10 p-10 bg-white rounded-[3rem] shadow-[20px_20px_0px_rgba(79,70,229,0.1)]",
            footer: "text-sm font-black text-indigo-400 tracking-tighter",
            slideNumber: "bg-indigo-600 text-white px-5 py-2 rounded-full font-black",
            companyName: "text-indigo-900 font-black",
            logoContainer: "mb-12 scale-125 origin-left",
        },
        elements: {
            showProgressBar: true,
            showDecorativeShapes: true,
            shapeStyle: "absolute -top-10 -right-10 w-40 h-40 bg-indigo-200 rounded-full mix-blend-multiply blur-2xl",
        },
    },
    {
        id: "zen-minimal",
        name: "Zen Minimal",
        description: "Peaceful, balanced layout for mindfulness and focus.",
        category: "Minimal",
        previewColor: "#fdf4ff",
        styles: {
            container: "bg-[#FAF9F6] text-[#333333] font-serif",
            title: "text-5xl font-medium tracking-tight leading-[1.3] text-center italic",
            content: "text-2xl text-[#666666] leading-loose font-normal mt-16 text-center max-w-[80%] mx-auto",
            footer: "text-[10px] font-light text-[#999999] tracking-[0.5em] text-center",
            slideNumber: "text-center text-xs opacity-30 mt-10",
            companyName: "text-[#333333]/40 tracking-widest text-[9px] uppercase",
            logoContainer: "mb-20 mx-auto",
        },
        elements: {
            showProgressBar: false,
            showDecorativeShapes: true,
            shapeStyle: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-[1px] border-[#333333]/5 rounded-full",
        },
    },
    {
        id: "gradient-sunset",
        name: "Sunset Wave",
        description: "Dreamy orange and purple gradients for creative portfolios.",
        category: "Creative",
        previewColor: "#f97316",
        styles: {
            container: "bg-gradient-to-tr from-[#FF512F] to-[#DD2476] text-white font-sans",
            title: "text-6xl font-black tracking-tighter drop-shadow-2xl italic",
            content: "text-3xl font-medium leading-normal mt-10 bg-black/10 p-8 rounded-2xl backdrop-blur-sm",
            footer: "text-xs font-bold uppercase tracking-[0.2em] opacity-80",
            slideNumber: "text-6xl font-black absolute bottom-4 right-4 text-white/10",
            companyName: "font-black text-white",
            logoContainer: "mb-12",
        },
        elements: {
            showProgressBar: true,
            showDecorativeShapes: true,
            shapeStyle: "absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-from)_0%,_transparent_50%)]",
        },
    },
    {
        id: "neo-tokyo-night",
        name: "Neo Tokyo",
        description: "Retrowave energy with striking neon pink and purple.",
        category: "Creative",
        previewColor: "#ec4899",
        styles: {
            container: "bg-[#0B011B] text-white font-mono border-y-8 border-pink-500",
            title: "text-5xl font-black italic tracking-widest leading-none text-transparent bg-clip-text bg-gradient-to-b from-pink-400 to-purple-600 drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]",
            content: "text-2xl font-bold leading-snug mt-12 bg-white/5 border-l-4 border-cyan-400 p-8",
            footer: "text-[10px] font-black text-cyan-400 tracking-widest bg-cyan-400/10 px-3 py-1 inline-block",
            slideNumber: "text-pink-500 font-black italic text-4xl",
            companyName: "text-white uppercase font-black",
            logoContainer: "mb-8",
        },
        elements: {
            showProgressBar: true,
            showDecorativeShapes: true,
            shapeStyle: "absolute -top-10 left-10 w-1 h-32 bg-pink-500/50 shadow-[0_0_30px_#ec4899]",
        },
    },
    {
        id: "monochrome-pro",
        name: "Monochrome Pro",
        description: "Ultimate high-contrast black & white for timeless authority.",
        category: "Professional",
        previewColor: "#000000",
        styles: {
            container: "bg-black text-white font-sans border-r-[20px] border-white",
            title: "text-7xl font-black tracking-tighter leading-[0.85] text-white",
            content: "text-3xl font-light leading-relaxed mt-10 text-neutral-400 italic",
            footer: "text-[10px] font-black uppercase text-white tracking-[0.8em]",
            slideNumber: "text-neutral-800 font-black text-9xl absolute -bottom-10 left-0",
            companyName: "font-black text-white text-xl",
            logoContainer: "mb-16",
        },
        elements: {
            showProgressBar: false,
            showDecorativeShapes: false,
        },
    },
    {
        id: "earthy-organic",
        name: "Earthy Organic",
        description: "Natural tones and soft serif fonts for wellness and sustainability.",
        category: "Minimal",
        previewColor: "#fef3c7",
        styles: {
            container: "bg-[#F3EFE0] text-[#434B4D] font-serif",
            title: "text-5xl font-bold tracking-tight text-[#2D5A27] leading-[1.2]",
            content: "text-2xl text-[#5C6B61] leading-relaxed mt-10 italic font-medium",
            footer: "text-[11px] font-bold text-[#2D5A27] uppercase tracking-[0.2em]",
            slideNumber: "w-12 h-12 flex items-center justify-center border border-[#2D5A27] text-[#2D5A27] rounded-full font-bold",
            companyName: "text-[#2D5A27] font-bold",
            logoContainer: "mb-12",
        },
        elements: {
            showProgressBar: true,
            showDecorativeShapes: true,
            shapeStyle: "absolute bottom-0 right-0 w-64 h-64 bg-[#2D5A27]/5 rounded-tl-full blur-3xl",
        },
    },
    {
        id: "brutalist-yellow",
        name: "Alert Yellow",
        description: "High-visibility warning style for news and alerts.",
        category: "Creative",
        previewColor: "#facc15",
        styles: {
            container: "bg-yellow-400 text-black font-sans border-[10px] border-black p-4",
            title: "text-6xl font-black uppercase tracking-tighter leading-none bg-black text-yellow-400 px-2 py-4 shadow-[10px_10px_0px_#000]",
            content: "text-4xl font-black leading-tight mt-16 p-4 border-4 border-black",
            footer: "text-xl font-black bg-black text-white px-4 py-2",
            slideNumber: "text-5xl font-black flex items-center justify-center",
            companyName: "font-black underline decoration-4",
            logoContainer: "mb-4",
        },
        elements: {
            showProgressBar: false,
            showDecorativeShapes: false,
        },
    },
    {
        id: "cyber-glitch",
        name: "Cyber Glitch",
        description: "Experimental design with digital distortion aesthetics.",
        category: "Creative",
        previewColor: "#06b6d4",
        styles: {
            container: "bg-slate-950 text-white font-mono overflow-hidden relative",
            title: "text-5xl font-black tracking-widest leading-none drop-shadow-[2px_2px_0_#ff00ff] after:content-[attr(data-text)] after:absolute after:left-[-2px] after:text-cyan-400 after:mix-blend-screen after:animate-pulse",
            content: "text-2xl font-bold mt-10 p-6 bg-cyan-500/10 border border-cyan-500/30",
            footer: "text-xs font-black text-fuchsia-500 tracking-[0.4em] animate-pulse",
            slideNumber: "text-cyan-500 font-mono text-2xl skew-x-[-20deg] border-2 border-cyan-500 px-4",
            companyName: "text-white font-black italic",
            logoContainer: "mb-10 brightness-200",
        },
        elements: {
            showProgressBar: true,
            showDecorativeShapes: true,
            shapeStyle: "absolute top-0 left-0 w-full h-[1px] bg-cyan-500 shadow-[0_0_10px_#00ffff]",
        },
    },
    {
        id: "soft-gradient-pro",
        name: "Cloud Pro",
        description: "Ultra-clean, soft pastel gradients for high-end B2B.",
        category: "Professional",
        previewColor: "#eff6ff",
        styles: {
            container: "bg-white text-slate-800 font-sans bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-[size:100px_100px]",
            title: "text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600",
            content: "text-2xl text-slate-500 font-medium leading-loose mt-12 bg-white/40 backdrop-blur-md p-10 rounded-[3rem] border border-blue-50 shadow-xl",
            footer: "text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]",
            slideNumber: "text-blue-500 font-black text-2xl opacity-20",
            companyName: "text-blue-600 font-black",
            logoContainer: "mb-16",
        },
        elements: {
            showProgressBar: true,
            showDecorativeShapes: true,
            shapeStyle: "absolute -top-40 -left-40 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl",
        },
    },
    {
        id: "ocean-deep",
        name: "Ocean Deep",
        description: "Authoritative blue & teal combination for financial services.",
        category: "Professional",
        previewColor: "#1e3a8a",
        styles: {
            container: "bg-[#0A192F] text-white font-sans border-l-[12px] border-cyan-500",
            title: "text-5xl font-black tracking-tighter leading-tight bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent",
            content: "text-2xl text-slate-400 font-normal leading-relaxed mt-10 border-b border-slate-800 pb-12",
            footer: "text-xs font-bold text-cyan-500 uppercase tracking-widest",
            slideNumber: "text-7xl font-black text-slate-800 absolute bottom-0 right-8",
            companyName: "text-white font-bold tracking-tight",
            logoContainer: "mb-12",
        },
        elements: {
            showProgressBar: true,
            showDecorativeShapes: true,
            shapeStyle: "absolute top-10 right-10 w-2 h-2 bg-cyan-500 rounded-full",
        },
    },
    {
        id: "paper-texture-pro",
        name: "Editorial",
        description: "Classic magazine aesthetic with high-end typography.",
        category: "Premium",
        previewColor: "#f5f5f5",
        styles: {
            container: "bg-[#FDFCF0] text-[#222222] font-serif p-4 border border-[#E9E1D1]",
            title: "text-6xl font-bold tracking-tight leading-[0.9] border-b-2 border-black pb-8 text-center",
            content: "text-2xl font-medium leading-relaxed mt-10 text-center px-8",
            footer: "text-[9px] font-black uppercase tracking-[0.3em] flex items-center justify-between",
            slideNumber: "italic border border-black rounded-full w-10 h-10 flex items-center justify-center font-bold",
            companyName: "font-black text-sm",
            logoContainer: "mb-6 grayscale text-center",
        },
        elements: {
            showProgressBar: false,
            showDecorativeShapes: false,
        },
    },
    {
        id: "electric-vibe",
        name: "Electric Vibe",
        description: "High-voltage design with bright lime and deep black.",
        category: "Creative",
        previewColor: "#bef264",
        styles: {
            container: "bg-black text-[#D9FF00] font-sans relative",
            title: "text-7xl font-black uppercase tracking-tighter leading-[0.85] italic",
            content: "text-3xl font-black leading-tight mt-12 bg-[#D9FF00] text-black p-10 transform -rotate-1 rounded-sm",
            footer: "text-lg font-black bg-[#D9FF00] text-black px-4 py-1",
            slideNumber: "text-8xl font-black opacity-10 absolute -bottom-10 right-4",
            companyName: "text-white font-black tracking-widest",
            logoContainer: "mb-10",
        },
        elements: {
            showProgressBar: true,
            showDecorativeShapes: true,
            shapeStyle: "absolute top-10 left-10 w-16 h-1 w-full bg-[#D9FF00] -rotate-12",
        },
    },
    {
        id: "minimalist-slate",
        name: "Architecture",
        description: "Cold, structured and precise layout for technical experts.",
        category: "Minimal",
        previewColor: "#475569",
        styles: {
            container: "bg-white text-slate-900 font-sans border border-slate-200",
            title: "text-4xl font-light tracking-[0.2em] uppercase leading-tight text-slate-500 mb-4",
            content: "text-3xl font-black text-slate-900 tracking-tighter leading-none mt-8 border-l-8 border-slate-900 pl-10 py-4",
            footer: "text-[10px] font-black text-slate-400 uppercase tracking-[0.6em]",
            slideNumber: "text-slate-900 font-bold border-t-2 border-slate-900 pt-2",
            companyName: "font-black tracking-widest text-slate-900",
            logoContainer: "mb-16",
        },
        elements: {
            showProgressBar: false,
            showDecorativeShapes: true,
            shapeStyle: "absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-50",
        },
    },
    {
        id: "corporate-glass-pro",
        name: "Corporate Glass",
        description: "Multi-layered professional design with depths and shadows.",
        category: "Professional",
        previewColor: "#ffffff",
        styles: {
            container: "bg-slate-50 text-slate-900 font-sans overflow-hidden",
            title: "text-5xl font-black tracking-tight leading-tight",
            content: "text-2xl text-slate-600 leading-relaxed mt-10 bg-white/60 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white shadow-[0_22px_70px_4px_rgba(0,0,0,0.05)]",
            footer: "text-[11px] font-black text-slate-400 uppercase tracking-widest",
            slideNumber: "bg-slate-900 text-white w-12 h-12 flex items-center justify-center rounded-2xl font-bold rotate-6 shadow-xl",
            companyName: "text-slate-900 font-black",
            logoContainer: "mb-12",
        },
        elements: {
            showProgressBar: true,
            showDecorativeShapes: true,
            shapeStyle: "absolute -bottom-10 -right-10 w-64 h-64 bg-slate-900/5 rounded-full blur-3xl",
        },
    },
    {
        id: "lavender-dream",
        name: "Soft Lavender",
        description: "Elegant and calm purple aesthetic for creative agencies.",
        category: "Creative",
        previewColor: "#ddd6fe",
        styles: {
            container: "bg-[#F7F5FF] text-[#4C1D95] font-sans",
            title: "text-5xl font-black tracking-tighter leading-[1.1] italic",
            content: "text-2xl text-[#6D28D9] leading-relaxed font-medium mt-10 p-10 bg-white/80 rounded-[4rem] border border-[#DDD6FE] shadow-[20px_20px_60px_#d1d1d1,-20px_-20px_60px_#ffffff]",
            footer: "text-xs font-black text-[#A78BFA] uppercase tracking-widest",
            slideNumber: "text-[#4C1D95] font-black text-4xl opacity-20",
            companyName: "font-bold text-[#4C1D95] opacity-50",
            logoContainer: "mb-16",
        },
        elements: {
            showProgressBar: true,
            showDecorativeShapes: true,
            shapeStyle: "absolute top-1/2 right-[-10%] w-40 h-40 bg-[#DDD6FE]/40 rounded-full blur-3xl",
        },
    },
    {
        id: "industrial-bold",
        name: "Industrial Bold",
        description: "Heavy-duty design with safety orange accents for construction/tech.",
        category: "Dark",
        previewColor: "#fb923c",
        styles: {
            container: "bg-[#1A1A1A] text-white font-mono border-l-[30px] border-orange-500",
            title: "text-6xl font-black uppercase tracking-tighter leading-none m-0 border-b-8 border-orange-500 pb-8",
            content: "text-3xl font-black leading-tight mt-12 text-orange-400 italic",
            footer: "text-sm font-black bg-orange-500 text-black px-5 py-2 inline-block",
            slideNumber: "text-white font-mono text-5xl font-black opacity-20",
            companyName: "text-orange-500 font-black tracking-widest uppercase",
            logoContainer: "mb-8",
        },
        elements: {
            showProgressBar: false,
            showDecorativeShapes: true,
            shapeStyle: "absolute top-0 right-0 w-32 h-32 bg-[repeating-linear-gradient(45deg,#fb923c,#fb923c_10px,#000_10px,#000_20px)] opacity-20",
        },
    },
];
