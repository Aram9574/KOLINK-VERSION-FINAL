import { LucideIcon, Briefcase, Building2, Scale, Rocket, Megaphone, HeartPulse, User, GraduationCap, DollarSign, Wrench, Code, ShoppingCart, Truck, Camera } from 'lucide-react';

export interface SeoToolConfig {
    slug: string;
    title: string;
    role: string;
    description: string;
    icon: LucideIcon;
    defaultPrompt: string;
    niche: string;
    metaTitle: string;
    metaDesc: string;
}

export const SEO_TOOLS_CONFIG: SeoToolConfig[] = [
    {
        slug: 'agentes-inmobiliarios',
        title: 'Generador de Posts para Inmobiliaria',
        role: 'Real Estate Agent',
        description: 'Crea posts virales para vender propiedades y captar leads inmobiliarios.',
        icon: Building2,
        niche: 'Real Estate',
        defaultPrompt: 'Create a LinkedIn post for a Real Estate Agent selling a luxury property...',
        metaTitle: 'Generador de Posts LinkedIn para Agentes Inmobiliarios | Kolink AI',
        metaDesc: 'Herramienta gratuita de IA para crear contenido inmobiliario viral en LinkedIn. Aumenta tus ventas y captación de propiedades.'
    },
    {
        slug: 'fundadores-saas',
        title: 'Generador para Fundadores SaaS',
        role: 'SaaS Founder',
        description: 'Comparte tu viaje de construcción, métricas y lecciones de startup.',
        icon: Rocket,
        niche: 'SaaS',
        defaultPrompt: 'Write a "Building in Public" update for a B2B SaaS Founder...',
        metaTitle: 'Generador de Contenido LinkedIn para Fundadores SaaS | Kolink AI',
        metaDesc: 'Crea posts de "Building in Public" y liderazgo de pensamiento para fundadores de startups tecnológicas.'
    },
    {
        slug: 'abogados-y-legal',
        title: 'Marketing Legal con IA',
        role: 'Lawyer',
        description: 'Simplifica conceptos legales complejos y construye autoridad.',
        icon: Scale,
        niche: 'Legal Service',
        defaultPrompt: 'Write an educational post explaining a complex legal concept simply...',
        metaTitle: 'Herramienta LinkedIn para Abogados y Firmas Legales | Kolink AI',
        metaDesc: 'Posiciónate como experto legal en LinkedIn. Genera explicaciones claras y profesionales con IA.'
    },
    {
        slug: 'especialistas-marketing',
        title: 'Generador para Marketers',
        role: 'Marketing Agency Owner',
        description: 'Demuestra tu expertise con tips de marketing y casos de estudio.',
        icon: Megaphone,
        niche: 'Marketing',
        defaultPrompt: 'Share a contrarian take on modern digital marketing trends...',
        metaTitle: 'Generador de Posts Virales para Marketing Digital | Kolink AI',
        metaDesc: 'Ahorra tiempo creando contenido sobre SEO, PPC y estrategia de marca. Ideal para agencias y freelancers.'
    },
    {
        slug: 'doctores-y-salud',
        title: 'Posts para Profesionales de Salud',
        role: 'Health Professional',
        description: 'Educa a tu audiencia y combate mitos de salud con autoridad.',
        icon: HeartPulse,
        niche: 'Healthcare',
        defaultPrompt: 'Write a myth-busting post about a common health misconception...',
        metaTitle: 'IA para Doctores y Profesionales de la Salud en LinkedIn | Kolink AI',
        metaDesc: 'Construye tu marca personal médica. Comparte consejos de salud y bienestar de forma ética y profesional.'
    },
    {
        slug: 'reclutadores-rrhh',
        title: 'Generador para Recruiters',
        role: 'Technical Recruiter',
        description: 'Atrae al mejor talento y destaca tu cultura de empresa.',
        icon: User,
        niche: 'Recruiting',
        defaultPrompt: 'Write a job post that focuses on culture and mission, not just requirements...',
        metaTitle: 'Generador de Job Posts y Contenido RRHH | Kolink AI',
        metaDesc: 'Atrae candidatos pasivos con posts de reclutamiento irresistibles. Herramienta gratuita para RRHH.'
    },
    {
        slug: 'consultores-negocios',
        title: 'Marca Personal para Consultores',
        role: 'Business Consultant',
        description: 'Comparte frameworks estratégicos y gana clientes high-ticket.',
        icon: Briefcase,
        niche: 'Consulting',
        defaultPrompt: 'Share a strategic framework for solving a common business problem...',
        metaTitle: 'Estrategia de Contenido para Consultores de Negocio | Kolink AI',
        metaDesc: 'Genera leads cualificados demostrando tu metodología. IA entrenada para consultoría estratégica.'
    },
    {
        slug: 'coaches-vida',
        title: 'Contenido para Life Coaches',
        role: 'Life Coach',
        description: 'Inspira a tu audiencia con historias de transformación y mindset.',
        icon: GraduationCap,
        niche: 'Coaching',
        defaultPrompt: 'Share a vulnerable story about overcoming a personal challenge...',
        metaTitle: 'Generador de Posts para Coaches y Mentores | Kolink AI',
        metaDesc: 'Conecta emocionalmente con tu audiencia. Crea posts inspiradores y motivacionales en segundos.'
    },
    {
        slug: 'asesores-financieros',
        title: 'Posts para Asesores Financieros',
        role: 'Financial Advisor',
        description: 'Explica finanzas de forma simple y genera confianza.',
        icon: DollarSign,
        niche: 'Finance',
        defaultPrompt: 'Explain an investment concept using a simple analogy...',
        metaTitle: 'Marketing para Asesores Financieros en LinkedIn | Kolink AI',
        metaDesc: 'Cumple con el tono profesional mientras educas sobre finanzas e inversión. Contenido listo para usar.'
    },
    {
        slug: 'desarrolladores-software',
        title: 'Posts para Programadores',
        role: 'Senior Software Engineer',
        description: 'Comparte código, opiniones tech y experiencias dev.',
        icon: Code,
        niche: 'Software Engineering',
        defaultPrompt: 'Share an opinionated take on a specific programming language or tech stack...',
        metaTitle: 'Generador de Contenido para Developers y Tech Leads | Kolink AI',
        metaDesc: 'Construye tu reputación técnica. Comparte snippets, arquitecturas y opiniones tech con IA.'
    }
];
