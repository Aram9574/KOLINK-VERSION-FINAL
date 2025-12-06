

import { ViralTone, ViralFramework, EmojiDensity, PostLength, UserProfile, Achievement, SubscriptionPlan, Invoice } from './types';

export const TONES = [
  { value: ViralTone.PROFESSIONAL, label: '👔 Profesional', desc: 'Limpio, corporativo, liderazgo.' },
  { value: ViralTone.CONTROVERSIAL, label: '🔥 Controvertido', desc: 'Opiniones polarizantes.' },
  { value: ViralTone.EMPATHETIC, label: '❤️ Empático', desc: 'Historias vulnerables.' },
  { value: ViralTone.EDUCATIONAL, label: '📚 Educativo', desc: 'Alto valor, consejos accionables.' },
  { value: ViralTone.HUMOROUS, label: '😂 Humorístico', desc: 'Alegre, memes, identificable.' },
  { value: ViralTone.STORYTELLING, label: '📖 Storytelling', desc: 'Narrativa profunda.' },
];

export const FRAMEWORKS = [
  { value: ViralFramework.PAS, label: 'Problema-Agitación-Solución', desc: 'Fórmula clásica de conversión.' },
  { value: ViralFramework.AIDA, label: 'AIDA', desc: 'Atención, Interés, Deseo, Acción.' },
  { value: ViralFramework.BAB, label: 'Antes-Después-Puente', desc: 'Muestra la transformación.' },
  { value: ViralFramework.LISTICLE, label: 'Lista (Listicle)', desc: 'Puntos escaneables (Alto CTR).' },
  { value: ViralFramework.CONTRARIAN, label: 'Opinión Impopular', desc: 'Desafía el status quo.' },
  { value: ViralFramework.STORY, label: 'Micro-Historia', desc: 'Anécdota personal con lección.' },
];

export const LENGTH_OPTIONS = [
  { value: PostLength.SHORT, label: 'Corto e Impactante', desc: '< 100 palabras' },
  { value: PostLength.MEDIUM, label: 'Estándar', desc: '100-250 palabras' },
  { value: PostLength.LONG, label: 'Profundo', desc: '300+ palabras' },
];

export const EMOJI_OPTIONS = [
  { value: EmojiDensity.MINIMAL, label: 'Mínimo' },
  { value: EmojiDensity.MODERATE, label: 'Balanceado' },
  { value: EmojiDensity.HIGH, label: 'Alto' },
];

export const ALGORITHM_TIPS_CONTENT = {
  es: [
    { title: "La Hora Dorada", desc: "Los primeros 60 minutos definen el alcance. Responde a cada comentario inmediatamente para activar la viralidad." },
    { title: "Dwell Time", desc: "El algoritmo mide cuánto tiempo pasan leyendo. Usa listas y espacios en blanco para detener el scroll." },
    { title: "La Regla del Enlace", desc: "Nunca pongas enlaces externos en el post. El algoritmo penaliza salidas. Ponlo en el primer comentario o bio." },
    { title: "Comentarios > Likes", desc: "Un comentario vale por 5 likes. Termina tu post con una pregunta abierta para incitar el debate." },
    { title: "El Gancho Visual", desc: "LinkedIn es móvil. Si tu primer párrafo tiene más de 2 líneas, la gente no hará clic en 'Ver más'." },
    { title: "Humaniza tu Marca", desc: "Las fotos personales (selfies, equipo) tienen 3x más alcance que los gráficos corporativos o stock photos." },
    { title: "PDFs y Carruseles", desc: "Actualmente es el formato con mayor alcance orgánico. Aportan valor denso y retienen al usuario." },
    { title: "La Constancia Paga", desc: "Publicar a la misma hora diariamente entrena a tu audiencia y al algoritmo. La racha importa." },
    { title: "Evita Editar", desc: "No edites tu post en los primeros 10 minutos de publicación, puede reiniciar el puntaje de distribución." },
    { title: "Hashtags Precisos", desc: "No hagas spam. Usa solo 3 hashtags: uno amplio, uno de nicho y uno de marca personal." }
  ],
  en: [
    { title: "The Golden Hour", desc: "The first 60 minutes define reach. Reply to every comment immediately to trigger virality." },
    { title: "Dwell Time", desc: "The algorithm tracks reading time. Use lists and white space to stop the scroll." },
    { title: "No External Links", desc: "Never put links in the post body. LinkedIn penalizes exits. Put it in comments or bio." },
    { title: "Comments > Likes", desc: "One comment is worth 5 likes. End your post with an open question to spark debate." },
    { title: "The Visual Hook", desc: "LinkedIn is mobile. If your first paragraph is >2 lines, people won't click 'See more'." },
    { title: "Humanize It", desc: "Personal photos (selfies, team) get 3x more reach than corporate graphics or stock photos." },
    { title: "PDF Carousels", desc: "Currently the highest reach format. They provide dense value and retain users." },
    { title: "Consistency Pays", desc: "Posting at the same time daily trains your audience and the algorithm. Streaks matter." },
    { title: "Avoid Editing", desc: "Don't edit your post in the first 10 minutes, it can reset the distribution score." },
    { title: "Precise Hashtags", desc: "Don't spam. Use exactly 3 hashtags: one broad, one niche, and one personal brand." }
  ]
};

export const PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Plan Inicial',
    price: 0,
    description: 'Acceso mínimo viable para experimentar',
    credits: 15,
    features: [
      '15 Créditos IA / mes',
      'Generador de Ideas Básico',
      '3 Tonos Predefinidos',
      'Soporte por Email Estándar'
    ]
  },
  {
    id: 'pro',
    name: 'Creador Pro',
    price: 19,
    description: 'Para automatizar tu marca personal',
    credits: 100,
    features: [
      '100 Créditos IA / mes',
      'Autopilot (Generación Programada)',
      'Generador de Ideas Ilimitado',
      'Personalización de Voz de Marca',
      'Integración LinkedIn Directa',
      'Soporte Prioritario 24h'
    ],
    highlight: true,
    stripePriceId: 'price_1SZJKhE0zDGmS9ihOiYOzLa1'
  },
  {
    id: 'viral',
    name: 'Dios Viral',
    price: 79,
    description: 'Para agencias y power users',
    credits: 350,
    features: [
      '350 Créditos IA / mes',
      'Modelado de Voz (LLM Exclusivo)',
      'Acceso Anticipado a Modelos',
      'A/B Testing de Ganchos',
      'Integración Buffer/Hootsuite',
      'Gerente de Cuenta Dedicado'
    ],
    stripePriceId: 'price_1SZDgvE0zDGmS9ihnRXmmx4T'
  }
];

export const EMPTY_USER: UserProfile = {
  id: '',
  email: '',
  name: '',
  headline: '',
  avatarUrl: '',
  credits: 0,
  maxCredits: 5,
  isPremium: false,
  planTier: 'free',
  // hasOnboarded is undefined by default to indicate "loading" state
  language: 'es',
  xp: 0,
  level: 1,
  currentStreak: 0,
  lastPostDate: null,
  unlockedAchievements: [],
  autoPilot: {
    enabled: false,
    frequency: 'weekly',
    nextRun: 0,
    topics: [],
    tone: ViralTone.PROFESSIONAL,
    targetAudience: '',
    postCount: 1
  }
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
  planTier: 'pro',
  xp: 120,
  level: 1,
  currentStreak: 1,
  lastPostDate: Date.now(),
  unlockedAchievements: ['first_step'],
  hasOnboarded: false,
  brandVoice: "",
  companyName: "Kolink",
  industry: "SaaS / AI",
  language: 'es',
  autoPilot: {
    enabled: false,
    frequency: 'weekly',
    nextRun: Date.now(),
    topics: ['Growth Hacking', 'AI Trends', 'Startup Lessons'],
    tone: ViralTone.EDUCATIONAL,
    targetAudience: 'Entrepreneurs & Founders',
    postCount: 1
  }
};

export const MOCK_INVOICES: Invoice[] = [
  { id: 'inv_001', date: '2023-10-24', amount: '€19.00', status: 'Paid', planName: 'Creador Pro' },
  { id: 'inv_002', date: '2023-09-24', amount: '€19.00', status: 'Paid', planName: 'Creador Pro' },
  { id: 'inv_003', date: '2023-08-24', amount: '€19.00', status: 'Paid', planName: 'Creador Pro' },
];

export const INITIAL_POST_ID = 'init-1';

export const MARKETING_DOMAIN = 'kolink.es';
export const APP_DOMAIN = 'kolink-jade.vercel.app';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_step',
    title: 'El Primer Paso',
    description: 'Genera tu primer post.',
    icon: 'Footprints',
    xpReward: 50
  },
  {
    id: 'streak_3',
    title: 'La Constancia es Clave',
    description: 'Alcanza una racha de 3 días.',
    icon: 'Flame',
    xpReward: 150
  },
  {
    id: 'streak_7',
    title: 'Top Voice LinkedIn',
    description: 'Alcanza una racha de 7 días.',
    icon: 'Trophy',
    xpReward: 500
  },
  {
    id: 'pro_writer',
    title: 'Escritor Prolífico',
    description: 'Genera 10 posts en total.',
    icon: 'Feather',
    xpReward: 300
  },
  {
    id: 'clickbait_master',
    title: 'Maestro del Clickbait',
    description: 'Usa el tono "Controvertido".',
    icon: 'Zap',
    xpReward: 100
  }
];