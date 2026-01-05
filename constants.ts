import {
  Achievement,
  EmojiDensity,
  Invoice,
  PostLength,
  SubscriptionPlan,
  UserProfile,
  ViralFramework,
  ViralTone,
} from "./types";

export const RANDOM = {
  value: "random",
  label: "🎲 Aleatorio (Sorpréndeme)",
  desc: "La IA elegirá la mejor opción.",
};

export const TONES = [
  { ...RANDOM, isPremium: false },
  {
    value: ViralTone.PROFESSIONAL,
    label: "👔 Profesional",
    desc: "Limpio, corporativo, liderazgo.",
    isPremium: false,
  },
  {
    value: ViralTone.CONTROVERSIAL,
    label: "🔥 Controversial/Debate",
    desc: "Opiniones polarizantes.",
    isPremium: false,
  },
  {
    value: ViralTone.INSPIRATIONAL,
    label: "✨ Inspiracional",
    desc: "Motivador, visionario.",
    isPremium: false,
  },
  {
    value: ViralTone.EDUCATIONAL,
    label: "📚 Educativo",
    desc: "Alto valor, consejos accionables.",
    isPremium: true,
  },
  {
    value: ViralTone.HUMOROUS,
    label: "😂 Humorístico/Casual",
    desc: "Alegre, memes, identificable.",
    isPremium: true,
  },
  {
    value: ViralTone.PROMOTIONAL,
    label: "💰 Venta/Promocional",
    desc: "Persuasivo, enfocado en conversión.",
    isPremium: true,
  },
  {
    value: ViralTone.EMPATHETIC,
    label: "❤️ Empático/Vulnerable",
    desc: "Historias reales y conexión humana.",
    isPremium: true,
  },
  {
    value: ViralTone.STORYTELLING,
    label: "📖 Storytelling",
    desc: "Narrativa profunda.",
    isPremium: true,
  },
];

export const FRAMEWORKS = [
  { ...RANDOM, isPremium: false },
  {
    value: ViralFramework.STANDARD,
    label: "Estándar",
    desc: "Estructura sólida y balanceada.",
    isPremium: false,
  },
  {
    value: ViralFramework.PAS,
    label: "Problema-Agitación-Solución",
    desc: "Fórmula clásica de conversión.",
    isPremium: false,
  },
  {
    value: ViralFramework.AIDA,
    label: "AIDA",
    desc: "Atención, Interés, Deseo, Acción.",
    isPremium: false,
  },
  {
    value: ViralFramework.BAB,
    label: "Antes-Después-Puente",
    desc: "Muestra la transformación.",
    isPremium: true,
  },
  {
    value: ViralFramework.LISTICLE,
    label: "Lista/Puntos",
    desc: "Puntos escaneables (Alto CTR).",
    isPremium: true,
  },
  {
    value: ViralFramework.STORY,
    label: "Historia Personal",
    desc: "Anécdota personal con lección.",
    isPremium: true,
  },
  {
    value: ViralFramework.CASE_STUDY,
    label: "Caso de Estudio",
    desc: "Prueba social y resultados reales.",
    isPremium: true,
  },
  {
    value: ViralFramework.CONTRARIAN,
    label: "Opinión Impopular",
    desc: "Desafía el status quo.",
    isPremium: true,
  },
  {
    value: ViralFramework.VS_COMPARISON,
    label: "Comparativa (Vs)",
    desc: "Este vs Aquel.",
    isPremium: true,
  },
];

export const HOOK_STYLES = [
  { value: "random", label: "🎲 Aleatorio (Sorpréndeme)", isPremium: false },
  { value: "question", label: "Pregunta Retórica", isPremium: false },
  {
    value: "statistic",
    label: "Dato/Estadística Impactante",
    isPremium: false,
  },
  { value: "negative", label: "Negativo/Advertencia", isPremium: false },
  {
    value: "story",
    label: 'Inicio de Historia ("Ayer me pasó...")',
    isPremium: true,
  },
  { value: "assertion", label: "Afirmación Directa", isPremium: true },
];

export const LENGTH_OPTIONS = [
  RANDOM,
  {
    value: PostLength.SHORT,
    label: "Corto e Impactante",
    desc: "< 100 palabras",
  },
  { value: PostLength.MEDIUM, label: "Estándar", desc: "100-250 palabras" },
  { value: PostLength.LONG, label: "Profundo", desc: "300+ palabras" },
];

export const EMOJI_OPTIONS = [
  RANDOM,
  { value: EmojiDensity.MINIMAL, label: "Mínimo" },
  { value: EmojiDensity.MODERATE, label: "Balanceado" },
  { value: EmojiDensity.HIGH, label: "Alto" },
];

export const PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Starter / Explorer",
    price: 0,
    description: "Prueba de concepto y validación inmediata.",
    credits: 10,
    features: [
      "10 Créditos de Prueba",
      "Generador de Posts (AIDA/PAS)",
      "Vista Previa LinkedIn",
      "Sin Auditoría Viral",
      "Sin Personalización de Voz",
    ],
  },
  {
    id: "pro",
    name: "Pro / Creator",
    price: 15,
    description: "Domina tu nicho con IA personalizada.",
    credits: 100,
    features: [
      "100 Posts / Mes",
      "Voice Lab (Desbloqueado)",
      "Auditoría Viral en Tiempo Real",
      "Carousel Studio",
      "Nexus Chat 24/7",
    ],
    highlight: true,
    stripePriceId: "price_1SZJKhE0zDGmS9ihOiYOzLa1",
  },
  {
    id: "viral",
    name: "Viral / Authority",
    price: 49,
    description: "Escala tu autoridad en piloto automático.",
    credits: 99999,
    features: [
      "Créditos Ilimitados / VIP",
      "Smart Autopilot Engine",
      "Insight Responder",
      "Soporte Prioritario",
      "Acceso Beta a Nuevas Funciones",
    ],
    stripePriceId: "price_1SZDgvE0zDGmS9ihnRXmmx4T",
  },
];

export const EMPTY_USER: UserProfile = {
  id: "",
  email: "",
  name: "",
  headline: "",
  avatarUrl: "",
  credits: 0,
  maxCredits: 5,
  isPremium: false,
  planTier: "free",
  // hasOnboarded is undefined by default to indicate "loading" state
  language: "es",
  xp: 0,
  level: 1,
  currentStreak: 0,
  lastPostDate: null,
  unlockedAchievements: [],
  autoPilot: {
    enabled: false,
    frequency: "weekly",
    nextRun: 0,
    topics: [],
    tone: ViralTone.PROFESSIONAL,
    targetAudience: "",
    postCount: 1,
  },
};
export const MOCK_USER: UserProfile = {
  id: "mock-user-uuid-123456",
  email: "alex@kolink.ai",
  name: "Alex Rivera",
  headline: "Fundador @ Kolink | Ayudando a 10k+ creadores a ser virales",
  avatarUrl: "https://picsum.photos/150/150",
  credits: 100, // Matches Pro Plan
  maxCredits: 100,
  isPremium: true,
  planTier: "pro",
  xp: 120,
  level: 1,
  currentStreak: 1,
  lastPostDate: Date.now(),
  unlockedAchievements: ["first_step"],
  hasOnboarded: false,
  brandVoice: "",
  companyName: "Kolink",
  industry: "SaaS / AI",
  language: "es",
  autoPilot: {
    enabled: false,
    frequency: "weekly",
    nextRun: Date.now(),
    topics: ["Growth Hacking", "AI Trends", "Startup Lessons"],
    tone: ViralTone.EDUCATIONAL,
    targetAudience: "Entrepreneurs & Founders",
    postCount: 1,
  },
};

export const MOCK_INVOICES: Invoice[] = [
  {
    id: "inv_001",
    date: "2023-10-24",
    amount: "€19.00",
    status: "Paid",
    planName: "Creador Pro",
  },
  {
    id: "inv_002",
    date: "2023-09-24",
    amount: "€19.00",
    status: "Paid",
    planName: "Creador Pro",
  },
  {
    id: "inv_003",
    date: "2023-08-24",
    amount: "€19.00",
    status: "Paid",
    planName: "Creador Pro",
  },
];

export const INITIAL_POST_ID = "init-1";

export const MARKETING_DOMAIN = "kolink.es";
export const APP_DOMAIN = "kolink-jade.vercel.app";

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_step",
    title: "El Primer Paso",
    description: "Genera tu primer post.",
    icon: "Footprints",
    xpReward: 50,
  },
  {
    id: "streak_3",
    title: "La Constancia es Clave",
    description: "Alcanza una racha de 3 días.",
    icon: "Flame",
    xpReward: 150,
  },
  {
    id: "streak_7",
    title: "Top Voice LinkedIn",
    description: "Alcanza una racha de 7 días.",
    icon: "Trophy",
    xpReward: 500,
  },
  {
    id: "pro_writer",
    title: "Escritor Prolífico",
    description: "Genera 10 posts en total.",
    icon: "Feather",
    xpReward: 300,
  },
  {
    id: "clickbait_master",
    title: "Maestro del Clickbait",
    description: 'Usa el tono "Controvertido".',
    icon: "Zap",
    xpReward: 100,
  },
];

export const ALGORITHM_TIPS_CONTENT = {
  es: [
    { title: "Horario de Oro", desc: "Publicar entre las 8:00 AM y 10:00 AM aumenta el alcance inicial en un 20%." },
    { title: "Espacios en Blanco", desc: "Los posts con más de 3 líneas sin un espacio blanco tienen un 40% menos de CTR." },
    { title: "Regla de Oro: 60 min", desc: "Responder a los comentarios en los primeros 60 minutos es clave para la viralidad." },
    { title: "Contenido Nativo", desc: "El algoritmo de LinkedIn prioriza el contenido nativo sobre los enlaces externos." },
  ],
  en: [
    { title: "Golden Hours", desc: "Posting between 8:00 AM and 10:00 AM increases initial reach by 20%." },
    { title: "Negative Space", desc: "Posts with more than 3 lines without white space have 40% less CTR." },
    { title: "The 60-Min Rule", desc: "Responding to comments in the first 60 minutes is key to virality." },
    { title: "Native Content", desc: "The LinkedIn algorithm prioritizes native content over external links." },
  ],
};
