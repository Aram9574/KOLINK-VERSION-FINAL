

import { ViralTone, ViralFramework, EmojiDensity, PostLength, UserProfile, Achievement, SubscriptionPlan, Invoice } from './types';

export const RANDOM = { value: 'random', label: '🎲 Aleatorio (Sorpréndeme)', desc: 'La IA elegirá la mejor opción.' };

export const TONES = [
  { ...RANDOM, isPremium: false },
  { value: ViralTone.PROFESSIONAL, label: '👔 Profesional', desc: 'Limpio, corporativo, liderazgo.', isPremium: false },
  { value: ViralTone.CONTROVERSIAL, label: '🔥 Controversial/Debate', desc: 'Opiniones polarizantes.', isPremium: false },
  { value: ViralTone.INSPIRATIONAL, label: '✨ Inspiracional', desc: 'Motivador, visionario.', isPremium: false },
  { value: ViralTone.EDUCATIONAL, label: '📚 Educativo', desc: 'Alto valor, consejos accionables.', isPremium: true },
  { value: ViralTone.HUMOROUS, label: '😂 Humorístico/Casual', desc: 'Alegre, memes, identificable.', isPremium: true },
  { value: ViralTone.PROMOTIONAL, label: '💰 Venta/Promocional', desc: 'Persuasivo, enfocado en conversión.', isPremium: true },
  { value: ViralTone.EMPATHETIC, label: '❤️ Empático/Vulnerable', desc: 'Historias reales y conexión humana.', isPremium: true },
  { value: ViralTone.STORYTELLING, label: '📖 Storytelling', desc: 'Narrativa profunda.', isPremium: true },
];

export const FRAMEWORKS = [
  { ...RANDOM, isPremium: false },
  { value: ViralFramework.STANDARD, label: 'Estándar', desc: 'Estructura sólida y balanceada.', isPremium: false },
  { value: ViralFramework.PAS, label: 'Problema-Agitación-Solución', desc: 'Fórmula clásica de conversión.', isPremium: false },
  { value: ViralFramework.AIDA, label: 'AIDA', desc: 'Atención, Interés, Deseo, Acción.', isPremium: false },
  { value: ViralFramework.BAB, label: 'Antes-Después-Puente', desc: 'Muestra la transformación.', isPremium: true },
  { value: ViralFramework.LISTICLE, label: 'Lista/Puntos', desc: 'Puntos escaneables (Alto CTR).', isPremium: true },
  { value: ViralFramework.STORY, label: 'Historia Personal', desc: 'Anécdota personal con lección.', isPremium: true },
  { value: ViralFramework.CASE_STUDY, label: 'Caso de Estudio', desc: 'Prueba social y resultados reales.', isPremium: true },
  { value: ViralFramework.CONTRARIAN, label: 'Opinión Impopular', desc: 'Desafía el status quo.', isPremium: true },
  { value: ViralFramework.VS_COMPARISON, label: 'Comparativa (Vs)', desc: 'Este vs Aquel.', isPremium: true },
];

export const HOOK_STYLES = [
  { value: 'random', label: '🎲 Aleatorio (Sorpréndeme)', isPremium: false },
  { value: 'question', label: 'Pregunta Retórica', isPremium: false },
  { value: 'statistic', label: 'Dato/Estadística Impactante', isPremium: false },
  { value: 'negative', label: 'Negativo/Advertencia', isPremium: false },
  { value: 'story', label: 'Inicio de Historia ("Ayer me pasó...")', isPremium: true },
  { value: 'assertion', label: 'Afirmación Directa', isPremium: true },
];

export const LENGTH_OPTIONS = [
  RANDOM,
  { value: PostLength.SHORT, label: 'Corto e Impactante', desc: '< 100 palabras' },
  { value: PostLength.MEDIUM, label: 'Estándar', desc: '100-250 palabras' },
  { value: PostLength.LONG, label: 'Profundo', desc: '300+ palabras' },
];

export const EMOJI_OPTIONS = [
  RANDOM,
  { value: EmojiDensity.MINIMAL, label: 'Mínimo' },
  { value: EmojiDensity.MODERATE, label: 'Balanceado' },
  { value: EmojiDensity.HIGH, label: 'Alto' },
];

export const ALGORITHM_TIPS_CONTENT = {
  es: [
    { title: "La 'Hora Dorada'", desc: "Los primeros 60 minutos definen tu viralidad. El algoritmo evalúa la velocidad de interacción. Responde comentarios de inmediato." },
    { title: "Comentarios > Likes", desc: "Un comentario detallado (>15 palabras) vale 3x más que un like. Fomenta debates, no solo aplausos." },
    { title: "Dwell Time (Tiempo en Pantalla)", desc: "LinkedIn mide si el usuario para el scroll. Usa ganchos visuales y espacios en blanco para retener la atención >10seg." },
    { title: "El Gancho es el Rey", desc: "Tienes 210 caracteres antes del 'Ver más'. Si no provocas curiosidad o emoción ahí, nadie leerá el resto." },
    { title: "Carruseles = Viralidad", desc: "El formato #1 en alcance. Entre 5 y 10 diapositivas, con diseño limpio, genera retención masiva." },
    { title: "Abre Conversaciones (CTC)", desc: "No termines con 'Dale like'. Termina con una pregunta abierta que fuerce una respuesta matizada, no un sí/no." },
    { title: "Sin Enlaces Externos", desc: "El algoritmo odia que saques a la gente de la app. Pon tu link en el primer comentario o en tu perfil." },
    { title: "Constancia Estratégica", desc: "Publicar 2-5 veces por semana (Mar-Jue) entrena a tu audiencia. La consistencia vence a la intensidad." },
    { title: "Comentar es Crecer", desc: "Comentar inteligentemente en posts de líderes te expone a sus audiencias. Es la forma más rápida de crecer sin publicar." },
    { title: "Narrativa de Transformación", desc: "Las historias de 'Antes vs Después' conectan mejor que los consejos teóricos. Muestra vulnerabilidad y resultados." }
  ],
  en: [
    { title: "The 'Golden Hour'", desc: "The first 60 minutes define virality. The algorithm evaluates interaction speed. Reply to comments immediately." },
    { title: "Comments > Likes", desc: "A detailed comment (>15 words) is worth 3x more than a like. Spark debates, not just applause." },
    { title: "Dwell Time", desc: "LinkedIn tracks scroll stops. Use visual hooks and white space to retain attention for >10 seconds." },
    { title: "The Hook is King", desc: "You have 210 chars before 'See more'. If you don't spark curiosity or emotion there, no one reads the rest." },
    { title: "Carousels = Virality", desc: "The #1 format for reach. 5-10 slides with clean design generate massive retention." },
    { title: "Call to Conversation (CTC)", desc: "Don't end with 'Like this'. End with an open question that forces a nuanced reply, not a yes/no." },
    { title: "No External Links", desc: "The algorithm hates exits. Put your link in the first comment or your profile/bio." },
    { title: "Strategic Consistency", desc: "Posting 2-5x weekly (Tue-Thu) trains your audience. Consistency beats intensity." },
    { title: "Commenting is Growth", desc: "Smart comments on leader's posts expose you to their audience. Fastest way to grow without posting." },
    { title: "Transformation Narrative", desc: "'Before vs After' stories connect better than theoretical advice. Show vulnerability and real results." }
  ]
};

export const PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Plan Inicial',
    price: 0,
    description: 'Para probar el poder de la IA',
    credits: 10,
    features: [
      '10 Créditos de Prueba',
      'Generador de Ideas Básico',
      '3 Tonos Predefinidos',
      'Acceso a Comunidad',
      'Sin Tarjeta de Crédito'
    ]
  },
  {
    id: 'pro',
    name: 'Creador Pro',
    price: 19,
    description: 'Automatiza tu marca personal',
    credits: 99999,
    features: [
      'Todo lo del Plan Inicial, más:',
      'Créditos IA ILIMITADOS',
      'Generador de Ideas ILIMITADO',
      'Autopilot (Programación)',
      'Análisis de Voz de Marca',
      'Soporte Prioritario'
    ],
    highlight: true,
    stripePriceId: 'price_1SZJKhE0zDGmS9ihOiYOzLa1'
  },
  {
    id: 'viral',
    name: 'Dios Viral',
    price: 79,
    description: 'Para escalar sin límites',
    credits: 99999,
    features: [
      'Todo lo del Creador Pro, más:',
      'Multi-Cuenta (Agencias)',
      'Auditoría de Perfil Mensual',
      'A/B Testing de Ganchos',
      'Integración Buffer/Hootsuite',
      'Soporte VIP Dedicado 24/7'
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