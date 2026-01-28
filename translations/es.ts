import { EmojiDensity, PostLength, ViralFramework, ViralTone } from "../types.ts";

export const es = {
  auth: {
    welcomeHeadline: "Accede a tu Centro de Comando Viral",
    welcomeSub: "Donde el 1% de los creadores construye su audiencia.",
    signupSub: "Únete a la élite de creadores de contenido asistidos por IA.",
    joinHeadline: "Reclama tu Ventaja Injusta",
    ctaLogin: "Iniciar Sistema",
    ctaSignup: "Desbloquear Acceso Gratuito",
    emailLabel: "Correo Profesional",
    passwordLabel: "Llave de Acceso",
    forgotPassword: "¿Perdiste tu llave?",
    rememberMe: "Mantener sesión segura",
    continueWith: "O accede con",
    newHere: "¿Nuevo en la elité?",
    alreadyMember: "¿Ya eres miembro?",
    register: "Solicitar Acceso",
    login: "Entrar",
    trust: {
      security: "Encriptación Militar",
      noCard: "Sin Tarjeta",
      users: "+2k Creadores"
    },
    reset: {
      title: "Recuperar Acceso",
      desc: "Te enviaremos un enlace seguro a tu correo.",
      button: "Enviar Enlace de Rescate",
      back: "Volver al Login",
      success: "Enlace enviado. Revisa tu correo.",
      error: "No pudimos enviar el enlace. Intenta de nuevo."
    }
  },
  nav: {
    features: "Funciones",
    solutions: "Casos de Uso",
    resources: "Recursos",
    company: "Empresa",
    login: "Comenzar Gratis",
    getStarted: "Empezar",
    freeTools: "Herramientas Gratuitas",
    howItWorks: "Cómo Funciona",
    demo: "Demo",
    tools: "Herramientas",
    testimonials: "Resultados",
    pricing: "Precios",
    comparison: "Comparativa",
    faq: "Preguntas",
    viralScore: "Calculador Viral",
    items: {
      postEditor: { title: "Editor de Posts", desc: "Motor de creación de contenido con IA." },
      carouselStudio: { title: "Carousel Studio", desc: "Diseña carruseles virales en minutos." },
      autoPilot: { title: "AutoPilot", desc: "Automatiza tu presencia en LinkedIn." },
      profileAudit: { title: "Auditoría de Perfil", desc: "Optimiza tu perfil para ganar autoridad." },
      insightResponder: { title: "Insight Responder", desc: "Convierte insights en comentarios de valor." },
      employmentInsight: { title: "Insights Laborales", desc: "Consigue empleo más rápido con IA." },
      ideas: { title: "Generador de Ideas", desc: "Inspiración diaria adaptada a tu nicho." },
      
      nicheRealEstate: { title: "Agentes Inmobiliarios", desc: "Domina tu mercado local." },
      nicheSaaS: { title: "Fundadores SaaS", desc: "Growth hacking para líderes tecnológicos." },
      nicheLawyers: { title: "Abogados y Legal", desc: "Construye autoridad en tu práctica." },
      nicheMarketing: { title: "Especialistas Marketing", desc: "Mantente a la vanguardia de la IA." },
      nicheHealth: { title: "Doctores y Salud", desc: "Educa y conecta con tus pacientes." },
      
      blog: { title: "Blog", desc: "Últimas estrategias y novedades." },
      helpCenter: { title: "Centro de Ayuda", desc: "Tutoriales y documentación técnica." },
      videoDemo: { title: "Demo en Vídeo", desc: "Mira Kolink en acción." },
      commonFaq: { title: "FAQ", desc: "Respuestas a dudas comunes." },
      
      headlineGenerator: { title: "Generador de Hooks", desc: "10 Títulos virales en segundos." },
      bioGenerator: { title: "Generador de Bios", desc: "Optimiza tu perfil LinkedIn." },
      viralCalculator: { title: "Calculadora Viral", desc: "Predice el alcance de tus posts." },
      hooks: { title: "Librería de Ganchos", desc: "100+ Hooks Virales probados." },
      profileAuditor: { title: "Auditor de Perfil", desc: "Score gratuito de tu perfil." },
      bestTime: { title: "Mejor Hora", desc: "Calculadora basada en tu sector." },
      trust: { title: "Centro de Confianza", desc: "Seguridad y cumplimiento." },
      about: { title: "Sobre Nosotros", desc: "Nuestra misión para humanizar la IA." },
      prices: { title: "Precios", desc: "Planes para cada etapa de crecimiento." },
      affiliate: { title: "Programa de Afiliados", desc: "Gana recomendando el futuro." },
      socials: { title: "Síguenos", desc: "Únete a +10k creadores en redes." },
      viewAll: { title: "Ver todas", desc: "Explora todas las herramientas" }
    }
  },
  footer: {
    description:
    "La herramienta definitiva de creación de contenido y analítica para LinkedIn™.",
    rights: "© 2025 Kolink Inc. Todos los derechos reservados.",
    disclaimer:
    "Kolink no está afiliado, asociado, autorizado, respaldado ni conectado oficialmente de ninguna manera con LinkedIn Corporation, registrada en los EE. UU. y otros países. LinkedIn es una marca comercial de LinkedIn Corporation.",
    verifiedLabel: "Verificado",
    compliantLabel: "Certificado",
    madeWith: "Hecho con ❤️ para creadores de LinkedIn",
    columns: {
      company: {
        title: "Compañía",
        links: [
          { label: "Sobre Nosotros", href: "/about" },
          { label: "Precios", href: "/#pricing" },
          { label: "Hecho con Kolink", href: "/#carousel" },
          { label: "Contacto", href: "mailto:info@kolink.es" },
          {
            label: "Programa de Afiliados",
            href: "mailto:info@kolink.es?subject=Programa de Afiliados",
          },
        ],
      },
      legal: {
        title: "Legal",
        links: [
          { label: "Política de Cookies", href: "/cookies" },
          { label: "Política de Privacidad", href: "/privacy" },
          { label: "Términos y Condiciones", href: "/terms" },
        ],
      },
      resources: {
        title: "Recursos",
        links: [
          { label: "Generador de Bios", href: "/tools/bio-generator" },
          { label: "Calculadora Viral", href: "/tools/viral-calculator" },
          { label: "Auditoría de Perfil", href: "/tools/profile-auditor" },
          { label: "Mejor Hora Publicar", href: "/tools/best-time-to-post" },
          { label: "Blog", href: "/blog" },
          { label: "Noticias", href: "/#tools" },
          { label: "Hoja de Ruta", href: "/#tools" },
          { label: "Centro de Ayuda", href: "mailto:info@kolink.es" },
        ],
      },
      alternatives: {
        title: "Alternativas",
        links: [
          { label: "Kolink vs Taplio", href: "/#comparison" },
          { label: "Kolink vs Supergrow", href: "/#comparison" },
          { label: "Kolink vs AuthoredUp", href: "/#comparison" },
        ],
      },
      solutions: {
        title: "Sectores",
        links: [
          { label: "Agentes Inmobiliarios", href: "/tools/agentes-inmobiliarios" },
          { label: "Abogados y Legal", href: "/tools/abogados-y-legal" },
          { label: "Fundadores SaaS", href: "/tools/fundadores-saas" },
          { label: "Marketing", href: "/tools/especialistas-marketing" },
          { label: "Salud y Doctores", href: "/tools/doctores-y-salud" },
          { label: "Ver todos los sectores →", href: "/tools" },
        ],
      },
      freeTools: {
        title: "Herramientas Gratuitas",
        links: [
            { label: "Generador de Hooks", href: "/tools/headline-generator" },
            { label: "Generador de Bios", href: "/tools/bio-generator" },
            { label: "Carousel Studio", href: "/tools/carousel-studio" },
        ]
      }
    },
  },
  hero: {
    badge: "EL MOTOR DE CRECIMIENTO #1 EN HABLA HISPANA",
    titleLine1: "Domina LinkedIn con",
    titleLine2: "",
    subtitle:
    "Mientras otros pierden 10h/semana prompteando, tú generas autoridad viral en 30 segundos. No te quedes atrás en la era del contenido IA.",
    rotatingWords: [
      "posts que venden",
      "carruseles magnéticos",
      "perfiles de autoridad",
      "voces ultra-reales",
      "alcance imbatible",
    ],
    ctaPrimary: "Probar KOLINK AI Gratis",
    ctaSecondary: "Ver Resultados Reales",
    generating: "Calculando Impacto Viral...",
  },
  socialProof: "1500+ compañias y creadores confian en Kolink",
  workflow: {
    badge: "EL MOTOR",
    title: "LA LÍNEA DE ENSAMBLAJE VIRAL",
    step1Title: "Inyectar Idea Cruda",
    step1Desc: "Ingresa un pensamiento, URL o palabra clave.",
    step2Title: "Arquitectura Neural",
    step2Desc: "IA selecciona la estructura viral perfecta.",
    step3Title: "Ops Psicológicas",
    step3Desc: "Inyecta ganchos, patrones y formato.",
    step4Title: "Desplegar Activo",
    step4Desc: "Copia en un clic al editor de LinkedIn.",
    step5Title: "Dominar el Feed",
    step5Desc: "Mira cómo explotan las impresiones.",
  },
  howItWorks: {
    title: "De idea vaga a éxito viral",
    subtitle:
    "Nuestro proceso de 3 pasos convierte tus pensamientos aleatorios en activos de contenido.",
    step1Title: "Ingresa el Tema",
    step1Desc: "Vuelca tus ideas crudas, un enlace o solo una palabra clave.",
    step2Title: "Elige la Estructura",
    step2Desc: "Selecciona un marco viral como 'Contreras' o 'Historia'.",
    step3Title: "Hazte Viral",
    step3Desc:
    "Obtén un post perfectamente formateado listo para dominar el feed.",
  },
  comparison: {
    title: "El Golpe de Realidad",
    subtitle:
    "Mira por qué 10k+ creadores cambiaron los chatbots estándar por Kolink.",
    genericHeader: "Chatbots Genéricos",
    genericSub: 'Generador de "Muros de Texto"',
    kolinkHeader: "Kolink Studio",
    kolinkSub: "Motor de Arquitectura Viral",
    visualText: "Estructura Visual",
    genericVisualLabel: "Bloque Ilegible",
    kolinkVisualLabel: "Sneak Peek Viral",
    vsBad: "Párrafos densos, ignorados.",
    vsGood: "Escaneable, gancho viral.",
    hookBad: 'Intros aburridas tipo "Me complace anunciar".',
    hookGood: "Ganchos psicológicos que detienen el scroll.",
    toneBad: "Robótico, académico y seco.",
    toneGood: "Humano, ingenioso y auténtico.",
    promptBad: "Requiere ingeniería de prompts.",
    promptGood: "Marcos de un clic. Sin habilidades.",
    feature1Title: "Humano y Viral",
    feature2Title: "Ganchos Psicológicos",
    feature3Title: "Cero Curva de Aprendizaje",
    visualList1: "Sistematizar output",
    visualList2: "Apalancar psicología",
    viralBadge: "Viral",
  },
  strategicComparison: {
    title: "La Plataforma de IA más Completa",
    subtitle:
    "Funcionalidades que otros no pueden igualar. Compruébalo tú mismo.",
    bestChoice: "Mejor Opción",
    features: "Características",
    kolink: "Kolink",
    taplio: "Taplio",
    supergrow: "Supergrow",
    authoredUp: "AuthoredUp",
    rows: [
      {
        name: "Precio",
        values: {
          kolink: "€15/mes",
          taplio: "$65/mes",
          supergrow: "€49/mes",
          authored: "$20/mes",
        },
      },
      {
        name: "Generador Viral AI",
        values: {
          kolink: "✅ (Full)",
          taplio: "✅",
          supergrow: "✅",
          authored: "❌",
        },
      },
      {
        name: "Modelos IA SOTA",
        values: {
          kolink: "✅ Incluido",
          taplio: "⚠️ (Limitado)",
          supergrow: "❌ (Básico)",
          authored: "❌",
        },
      },
      {
        name: "Edita en Tiempo Real",
        values: {
          kolink: "✅",
          taplio: "✅",
          supergrow: "✅",
          authored: "✅",
        },
      },
      {
        name: "Extensión de Navegador Integrada",
        values: {
          kolink: "✅",
          taplio: "✅",
          supergrow: "✅",
          authored: "✅",
        },
      },
      {
        name: "Ghostwriting Personalizado",
        values: {
          kolink: "✅ (Alta Fidelidad)",
          taplio: "✅",
          supergrow: "⚠️",
          authored: "❌",
        },
      },
      {
        name: "Análisis de Gancho (Hooks) Virales",
        values: {
          kolink: "✅",
          taplio: "✅",
          supergrow: "⚠️",
          authored: "❌",
        },
      },
      {
        name: "Soporte Multilingüe Avanzado",
        values: {
          kolink: "✅",
          taplio: "⚠️",
          supergrow: "✅",
          authored: "⚠️",
        },
      },
    ],
  },
  roi: {
    title: "Deja de quemar dinero en múltiples herramientas",
    subtitle:
    "Kolink reemplaza todo tu stack de crecimiento en LinkedIn por una fracción del costo.",
    item1Title: "Ghostwriter Profesional",
    item1Desc: "Reemplaza: Contratar freelancers caros (€0.50/palabra)",
    item1Price: "€1,000/mes",
    item2Title: "Coach de Crecimiento LinkedIn",
    item2Desc: "Reemplaza: Llamadas de estrategia y calendarios",
    item2Price: "€500/mes",
    item3Title: "Herramienta de Programación",
    item3Desc: "Reemplaza: Herramientas como Taplio o Shield",
    item3Price: "€49/mes",
    item4Title: "Pack de Plantillas Virales",
    item4Desc: "Reemplaza: Comprar PDFs estáticos de ganchos",
    item4Price: "€99/mes",
    totalLabel: "Lo que gastarías normalmente:",
    totalPrice: "€1,648/mes",
    kolinkLabel: "Todo esto incluido al unirte a Kolink.",
    kolinkPlan: "Plan Creador Pro:",
    kolinkPrice: "€15/mes",
  },
  testimonials: {
    title: "Creadores creciendo rápido",
    subtitle:
    "Únete al movimiento de fundadores construyendo marcas personales masivas.",
    t1:
    "Dupliqué mis impresiones en la semana 1. La estructura 'Contreras' es un truco de magia.",
    t2:
    "Por fin, una IA que entiende el formato de LinkedIn. Adiós a los párrafos gigantes.",
    t3:
    "Kolink me ahorró 10 horas de escritura esta semana. Vale cada centavo.",
  },
  bento: {
    postGenerator: {
      title: "Generador de Posts con IA",
      desc: "Escribe contenido viral",
      subDesc: "Convierte ideas sueltas en posts optimizados en segundos."
    },
    voiceCloning: {
      title: "Clonación de Voz",
      desc: "Tu esencia, escalada",
      subDesc: "Entrena a la IA con tus posts antiguos para que escriba exactamente como tú, pero 10x más rápido."
    },
    audit: {
      title: "Auditoría de Perfil",
      desc: "Analiza tu impacto",
      subDesc: "Identifica qué partes de tu perfil están espantando a tus clientes potenciales."
    },
    carousel: {
      title: "Diseñador de Carruseles",
      desc: "Retención máxima",
      subDesc: "Genera documentos PDF visuales que LinkedIn ama, sin tocar Canva."
    },
    scheduling: {
      title: "Programación Inteligente",
      desc: "El mejor momento",
      subDesc: "Publica automáticamente cuando tu audiencia está más activa."
    },
    analytics: {
      title: "Analítica Viral",
      desc: "Crecimiento real",
      subDesc: "Métricas que importan: conversiones y alcance, no solo likes."
    }
  },
  features: {
    title: "Todo lo que necesitas para ser viral",
    subtitle:
    "No solo escribimos texto. Diseñamos engagement usando estructuras respaldadas por datos.",
    tools: {
      title: "Herramientas de la Plataforma",
      subtitle: "Una suite completa para dominar LinkedIn.",
      studio: {
        title: "Studio Viral",
        desc:
        "Tu centro de comando creativo. Genera posts virales, edita con IA y perfecciona tu contenido antes de publicar.",
      },
      nexus: {
        title: "Nexus AI",
        desc:
        "Tu asistente estratégico IA. Chatea con tus datos, idea ángulos y recibe feedback instantáneo sobre tu estrategia.",
      },
      editor: {
        title: "Editor de Posts",
        desc:
        "Editor sin distracciones con vista previa real. Formatea ganchos y snippets perfectos para máxima legibilidad.",
      },
      carousel: {
        title: "Generador de Carrusel",
        desc:
        "Convierte cualquier texto o URL en un carrusel PDF impresionante. Sin habilidades de diseño, solo valor puro.",
      },
      autopost: {
        title: "AutoPost",
        desc:
        "Crecimiento en piloto automático. Programa tu estrategia y deja que la IA genere y publique contenido por ti mientras duermes.",
      },
      audit: {
        title: "Auditoría de Perfil",
        desc:
        "Analiza tu perfil con IA para detectar brechas y optimizar palabras clave para máxima visibilidad.",
      },
    },
    f1Title: "6 Marcos Virales",
    f1Desc:
    'No adivines. Usa estructuras como "La Opinión Contraria" o "Historia Vulnerable" probadas para detener el scroll.',
    f2Title: "Clonación de Voz de Marca",
    f2Desc:
    "Enséñale a la IA tu estilo de escritura. Aprende tu vocabulario, longitud de oraciones y personalidad.",
    f3Title: "Predictor de Engagement",
    f3Desc:
    "Nuestro sistema de puntuación califica tu post antes de publicar, optimizando para el máximo alcance.",
    viralScore: "Puntaje Viral",
    hooks: "Ganchos",
    format: "Formato",
    roboticTone: "Tono Robótico",
    zeroStructure: "Cero Estructura",
    hardToPrompt: "Difícil de Promptear",
    speedTitle: "De Ideas a Viral en 30s",
    speedDesc:
    "Deja de perder horas. Nuestro flujo te lleva de un pensamiento desordenado a un activo viral listo al instante.",
    noWritersBlock: "Sin Bloqueo Creativo",
    mobileOptimized: "Optimizado para Móvil",
    readyToPost: "Listo para Publicar",
    frameworks: {
      pas: { name: "Problem-Agitate-Solution", desc: "Conversión" },
      bab: { name: "Before-After-Bridge", desc: "Storytelling" },
      contrarian: { name: "The Contrarian Take", desc: "Engagement" },
      listicle: { name: "The Listicle", desc: "Alcance" },
    },
    brandVoice: {
      aiModel: "Modelo IA",
      you: "TÚ",
      ai: "IA",
      match: "100% Coincidencia",
    },
  },
  pricing: {
    title: "Precios simples y transparentes",
    subtitle: "Empieza gratis, mejora mientras creces. Sin tarifas ocultas.",
    monthly: "Mensual",
    yearly: "Anual",
    save: "Ahorra 20%",
    startFree: "Empezar Gratis",
    getStarted: "Comenzar",
    mostPopular: "Recomendado",
    footer: "Pago seguro vía Stripe. Cancela cuando quieras.",
    plans: {
      free: {
        name: "Gratis",
        description: "Para probar el poder de la IA",
        features: [
          "10 Créditos de Prueba",
          "Generador de Posts Básico",
          "3 Tonos Predefinidos",
          "Publica en LinkedIn",
          "Sin Tarjeta de Crédito",
        ],
      },
      pro: {
        name: "Creador",
        description: "Automatiza tu marca personal",
        features: [
          "Todo lo del Plan Inicial, más:",
          "Créditos IA ILIMITADOS",
          "Generador de Posts ILIMITADO",
          "AutoPost ILIMITADO",
          "Auditoría de Perfil",
          "Generador de Carrusel",
        ],
      },
      viral: {
        name: "Profesional",
        description: "Para escalar sin límites",
        features: [
          "Todo lo del Creador Pro, más:",
          "Multi-Cuenta (Agencias)",
          "A/B Testing de Ganchos",
          "Integración Buffer/Hootsuite",
          "Soporte VIP Dedicado 24/7",
        ],
      },
    },
  },
  faq: {
    title: "Preguntas Frecuentes",
    q1: "¿Kolink genera contenido único?",
    a1:
    "Absolutamente. Usamos una combinación de modelos avanzados ajustados con marcos virales propietarios. No hay dos posts iguales.",
    q2: "¿Puedo cancelar mi suscripción?",
    a2:
    "Sí, puedes cancelar en cualquier momento desde tu panel. Mantendrás acceso hasta el final de tu ciclo de facturación.",
    q3: "¿Cuál es la diferencia entre los modelos?",
    a3:
    "El plan Gratis usa un modelo más ligero. Los planes Pro y Viral usan nuestros modelos 'Deep Think' mejores en matices y humor.",
    q4: "¿Ofrecen planes para equipos?",
    a4:
    "¡Sí! El plan 'Viral God' soporta hasta 3 miembros. Para necesidades empresariales, contacta a ventas.",
  },
  cta: {
    title: "¿Listo para dominar tu feed?",
    subtitle:
    "Únete a 10,000+ creadores usando Kolink para construir su marca personal. Empieza a generar contenido viral en 2 minutos.",
    button: "Empezar Gratis",
    disclaimer: "No requiere tarjeta de crédito • Cancela cuando quieras",
  },
  bugReport: {
    buttonLabel: "Reportar Error",
    title: "Reportar un Problema",
    subtitle: "¿Encontraste un bug? Avísanos.",
    placeholder: "Describe el error o tu feedback...",
    cancel: "Cancelar",
    send: "Enviar Reporte",
    sending: "Enviando...",
    success: "¡Gracias! Lo revisaremos.",
  },
  onboarding: {
    step1: {
      title: "¡Bienvenido a Kolink!",
      subtitle: "Personalicemos tu estudio. ¿Cómo te llamas?",
      firstName: "Nombre",
      firstNamePlaceholder: "Juan",
      lastName: "Apellido",
      lastNamePlaceholder: "Pérez",
      jobTitle: "Profesión / Cargo",
      jobTitlePlaceholder: "ej. Fundador, Marketing Manager, Desarrollador",
      next: "Siguiente Paso",
    },
    step2: {
      title: "¿Cuál es tu objetivo?",
      subtitle:
      "Esto ayuda a nuestra IA a seleccionar los mejores marcos virales.",
      intents: {
        personal_brand: {
          label: "Marca Personal",
          desc: "Construir autoridad y red",
        },
        company: {
          label: "Página de Empresa",
          desc: "Promocionar mi startup",
        },
        agency: {
          label: "Trabajo para Clientes",
          desc: "Ghostwriting para otros",
        },
        sales: { label: "Ventas / Leads", desc: "Venta social" },
        job_hunt: {
          label: "Búsqueda de Empleo",
          desc: "Ser visto por reclutadores",
        },
        content_creator: {
          label: "Creador de Contenido",
          desc: "Monetizar audiencia",
        },
      },
      next: "Siguiente Paso",
    },
    step3: {
      title: "Una última cosa...",
      subtitle: "¿Cómo te enteraste de Kolink?",
      sources: {
        linkedin: "LinkedIn",
        twitter: "Twitter / X",
        friend: "Amigo / Colega",
        youtube: "YouTube",
        google: "Buscador",
        other: "Otro",
      },
      start: "Empezar a Crear",
    },
    footer: "Usamos esta información para personalizar tus marcos virales.",
  },
  levelUp: {
    title: "¡Subiste de Nivel!",
    subtitle: "Ahora eres Nivel {{level}}",
    achievements: "Logros Desbloqueados",
    xp: "XP",
    awesome: "¡Genial!",
    achievementList: {
      first_step: {
        title: "El Primer Paso",
        description: "Genera tu primer post.",
      },
      streak_3: {
        title: "La Constancia es Clave",
        description: "Alcanza una racha de 3 días.",
      },
      streak_7: {
        title: "Top Voice LinkedIn",
        description: "Alcanza una racha de 7 días.",
      },
      pro_writer: {
        title: "Escritor Prolífico",
        description: "Genera 10 posts en total.",
      },
      clickbait_master: {
        title: "Maestro del Clickbait",
        description: "Usa el tono 'Controvertido'.",
      },
    },
    rewards: "Recompensas",
    continue: "Continuar",
    bonus_credits: "Créditos Extra",
    widget: {
      level: "Nivel",
      xp: "XP",
      to_next_level: "para subir",
      credits: "Créditos"
    }
  },
  about: {
    hero: {
      badge: "NUESTRO MANIFIESTO",
      title: "La IA no debería reemplazarte.",
      subtitle: "Debería darte superpoderes.",
      description: "En un mundo inundado de contenido generado por bots, creemos que la verdadera influencia proviene de historias humanas amplificadas por tecnología de precisión."
    },
    mission: {
      title: "Nuestra Misión",
      text: "Democratizar la influencia profesional. Creemos que cada experto merece una audiencia, pero no todos tienen 20 horas a la semana para dedicarlas a escribir en LinkedIn. Kolink existe para cerrar esa brecha."
    },
    values: {
      title: "Principios de Diseño",
      v1Title: "Calidad sobre Cantidad",
      v1Desc: "Preferimos un post que cambie una carrera a mil posts que nadie lee.",
      v2Title: "Humano en el Centro",
      v2Desc: "La IA sugiere, el humano decide. Nunca automatizamos sin tu toque final.",
      v3Title: "Transparencia Radical",
      v3Desc: "Nuestros algoritmos están diseñados para evitar el 'clickbait vacio'. Valor real, siempre."
    },
    team: {
      title: "El Equipo",
      desc: "Somos un colectivo de ingenieros, escritores y growth hackers obsesionados con descifrar el código de la viralidad ética."
    },
    cta: "Únete a la nueva ola de creadores",
    stats: {
      s1: { value: "1.2M+", label: "Posts Generados" },
      s2: { value: "50k+", label: "Usuarios Activos" },
      s3: { value: "98%", label: "Satisfacción" },
      s4: { value: "15+", label: "Países" },
    },
    tech: {
      title: "Más que un Wrapper de GPT",
      subtitle: "Nuestra Arquitectura Híbrida",
      description: "Kolink no solo 'pide' texto a la IA. Utilizamos un sistema propietario de RAG (Retrieval-Augmented Generation) que inyecta datos de tendencias virales en tiempo real antes de generar una sola palabra.",
      cards: [
        { title: "Análisis de Sentimiento", desc: "Detectamos el tono emocional exacto de tu audiencia." },
        { title: "Base de Datos Viral", desc: "Entrenado con 100k+ posts de alto rendimiento." },
        { title: "Verificación de Hechos", desc: "Capa de seguridad para minimizar alucinaciones." },
        { title: "Estilometría Adaptativa", desc: "Clonamos tu sintaxis, no solo tu contenido." }
      ]
    },
    teamSection: {
      title: "Mentes detrás del Código",
      subtitle: "Ingenieros, Escritores y Soñadores.",
      members: [
        { name: "Alex Rivera", role: "CEO & Fundador", bio: "Ex-Google. Obsesionado con escalar la creatividad humana." },
        { name: "Sarah Chen", role: "Head of AI", bio: "PhD en NLP. Arquitecta del motor 'Deep Think'." },
        { name: "Marc Johnson", role: "Lead Growth", bio: "Escaló 3 startups a unicornio. Sabe lo que vende." }
      ]
    },
    history: {
      title: "Nuestra Evolución",
      steps: [
        { year: "2023", title: "El Problema", desc: "Observamos que el 90% de los expertos en LinkedIn se rinden por falta de tiempo." },
        { year: "2024", title: "La Beta Privada", desc: "Lanzamos 'Project Nexus' con 50 usuarios seleccionados. El feedback fue brutal." },
        { year: "2025", title: "Kolink 1.0", desc: "Apertura al público. 10,000 usuarios en el primer mes. viralidad validada." },
        { year: "2026", title: "La Era de la Autoridad", desc: "Lanzamiento de Kolink Studio. La herramienta definitiva para líderes de opinión." }
      ]
    },
    ticker: "CONFIAN EN NOSOTROS FUNDADORES DE",
    founderLetter: {
      salutation: "Carta del Fundador",
      title: "Por qué construimos Kolink",
      p1: "Hace tres años, intenté construir mi marca personal en LinkedIn. Pasaba 15 horas a la semana escribiendo. Al mes, me rendí. No por falta de ideas, sino por agotamiento.",
      p2: "Me di cuenta de que el juego estaba amañado en contra de los expertos ocupados. Si no tenías un equipo de ghostwriters, eras invisible.",
      p3: "Kolink nació de una obsesión: ¿Podemos usar la IA para clonar no solo nuestra productividad, sino nuestra esencia? No queríamos otro generador de texto genérico.",
      p4: "Queríamos un 'Traje de Iron Man' para tu marca personal.",
      signature: "Alex Rivera",
      role: "CEO & Fundador"
    },
    global: {
      title: "Impacto Global",
      subtitle: "De Madrid a Nueva York",
      description: "Nuestra tecnología no entiende de fronteras. Creators de 15 países confían en Kolink para escalar su voz.",
      stats: [
        { label: "Ciudades", value: "150+" },
        { label: "Idiomas Agente", value: "25+" },
        { label: "Posts/Día", value: "12k" }
      ],
      magicTools: {
        improve: "Mejorar Escritura",
        shorten: "Acortar Texto",
        expand: "Expandir / Detallar",
        punchify: "Dar Punch / Gancho",
        emojify: "Añadir Emojis"
      },
      noBrandColors: "No se encontró ADN de marca en tu perfil. Configúralo en Configuración."
    },
    press: {
      title: "Visto En",
      items: [
        { name: "TechCrunch", quote: "'La herramienta que democratiza la viralidad B2B.'" },
        { name: "Forbes", quote: "'Kolink está redefiniendo la marca personal ejecutiva.'" },
        { name: "ProductHunt", quote: "'#1 Producto de la Semana: Imprescindible.'" }
      ]
    }
  },
  trustPage: {
    hero: {
      title: "Centro de Confianza",
      subtitle: "Tu seguridad es nuestra prioridad #1. Construimos para empresas, protegemos como bancos.",
      badge: "SEGURIDAD DE GRADO MILITAR"
    },
    cards: {
      encryption: {
        title: "Encriptación de Grado Bancario",
        desc: "Todos los datos están encriptados en tránsito (TLS 1.3) y en reposo (AES-256). Ni nosotros podemos ver tus contraseñas."
      },
      payment: {
        title: "Pagos Seguros por Stripe",
        desc: "No almacenamos tu tarjeta. Los pagos son procesados por Stripe, el estándar de oro en pagos online."
      },
      privacy: {
        title: "Privacidad de Datos",
        desc: "Tus datos son tuyos. Nunca vendemos tu información a terceros ni entrenamos modelos públicos con tus borradores privados."
      },
      uptime: {
        title: "99.9% Uptime",
        desc: "Infraestructura redundante distribuida globalmente para garantizar que siempre estés online cuando la viralidad golpea."
      }
    },
    badges: {
      ssl: "SSL Seguro",
      gdpr: "Listo para GDPR",
      pci: "PCI DSS Compliant"
    },
    certifications: "Certificaciones y Cumplimiento"
  },
  toolsPage: {
    common: {
      moreTools: "Más Herramientas",
      home: "Inicio",
      tools: "Herramientas",
      tryPro: "Prueba Pro Gratis",
      copyToast: "¡Copiado al portapapeles!",
      conversion: "Convertir a Post",
      footer: "Kolink AI © 2026. Hecho para Creadores de LinkedIn."
    },
    headlineGenerator: {
      seoTitle: "Generador de Headlines Virales para LinkedIn (Ganchos) | Kolink AI",
      seoDesc: "Genera 10 titulares virales en segundos para LinkedIn. La herramienta gratuita #1 para escribir ganchos que detienen el scroll.",
      label: "Herramienta Gratuita",
      title: "Generador de Headlines",
      titleHighlight: "Virales",
      subtitle: "Detén el scroll. Genera 10 ganchos virales optimizados para el algoritmo de LinkedIn en segundos.",
      roleLabel: "Tu Rol (ej. Fundador)",
      industryLabel: "Industria",
      topicLabel: "¿De qué trata tu post?",
      rolePlaceholder: "ej. CEO, Marketer...",
      industryPlaceholder: "ej. SaaS, Real Estate...",
      topicPlaceholder: "ej. Cómo escalar un negocio sin burnout...",
      button: "Obtener Headlines",
      generating: "Generando...",
      resultTitle: "10 Ganchos Virales para Ti",
      whyTitle: "¿Por qué importan los Headlines?",
      whyDesc: "Las primeras 2 líneas de tu post determinan el 80% de tu éxito. Si no hacen clic en 'Ver más', el algoritmo asume que tu contenido es irrelevante.",
      frameworks: [
        { title: "El Contrario", desc: "Desafía creencias comunes para generar curiosidad." },
        { title: "La Lista", desc: "Muestra valor cuantificable inmediatamente." },
        { title: "La Historia", desc: "Abre con un momento dramático o vulnerable." }
      ]
    },
    bioGenerator: {
      seoTitle: "Generador de Bios de LinkedIn | Kolink AI",
      seoDesc: "Crea el titular de perfil perfecto en segundos. Optimiza para SEO y autoridad con nuestra herramienta gratuita de IA.",
      label: "Optimizador de Perfil",
      title: "Generador de Bios",
      titleHighlight: "LinkedIn",
      subtitle: "Lo primero que ven los reclutadores es tu titular. Hazlo imposible de ignorar.",
      roleLabel: "Tu Rol",
      nicheLabel: "Nichode / Audiencia",
      keywordsLabel: "Top 3 Palabras Clave (SEO)",
      styleLabel: "Estilo",
      styles: {
        professional: "Profesional",
        creative: "Creativo",
        minimalist: "Minimalista"
      },
      button: "Generar Bios",
      generating: "Optimizando...",
      resultTitle: "5 Titulares Optimizados",
      ctaBtn: "Obtener Auditoría",
      ctaBox: {
        title: "¿Quieres un Perfil Completo?",
        subtitle: "Audita tu perfil completo gratis.",
        button: "Auditoría Gratis"
      }
    },
    viralCalculator: {
      seoTitle: "Calculadora de Viralidad de LinkedIn | Kolink AI",
      seoDesc: "Predice el potencial viral de tus posts antes de publicar. Calculadora IA gratuita basada en tu engagement y calidad de contenido.",
      label: "Analítica Predictiva",
      title: "Calculadora de",
      titleHighlight: "Viralidad",
      subtitle: "Deja de adivinar. Nuestra IA analiza tus seguidores, tasa de engagement y estructura de contenido para predecir el alcance.",
      followersLabel: "Seguidores",
      followersPlaceholder: "ej. 5000",
      avgLikesLabel: "Promedio de Likes",
      avgLikesPlaceholder: "ej. 150",
      contentLabel: "Pega tu Borrador (Draft)",
      contentPlaceholder: "Pega el contenido de tu post aquí...",
      button: "Calcular Puntaje Viral",
      analyzing: "Analizando...",
      resultLabel: "Probabilidad Viral",
      suggestionsLabel: "Sugerencias de IA",
      cta: "Mejorar con AI Studio"
    },
    profileScorecard: {
      seoTitle: "Puntuación de Perfil LinkedIn | Herramienta de Auditoría Gratuita",
      seoDesc: "Obtén una puntuación instantánea para tu perfil de LinkedIn. Nuestra IA analiza tu titular y resumen para revelar oportunidades ocultas de crecimiento.",
      label: "Auditor de Perfiles",
      title: "Califica mi",
      titleHighlight: "Perfil",
      subtitle: "¿Tu perfil de LinkedIn está ahuyentando a clientes de alto valor? Obtén una puntuación brutal y honesta en segundos.",
      headlineLabel: "Tu Titular (Headline)",
      headlinePlaceholder: "ej. Ayudando a Fundadores SaaS a escalar a $10M...",
      aboutLabel: "Resumen (About) (Opcional)",
      aboutPlaceholder: "Pega tu sección 'Acerca de' aquí para un análisis más profundo...",
      button: "Obtener mi Puntuación",
      analyzing: "Auditando...",
      emptyTitle: "Listo para Auditar",
      emptyDesc: "Ingresa tus detalles para revelar tu puntuación de autoridad.",
      scoreLabel: "Puntuación de Autoridad",
      good: "Bueno",
      needsWork: "Necesita Mejora",
      diagnosisLabel: "Diagnóstico",
      cta: "Desbloquear Informe PDF Completo",
      ctaSub: "Obtén un análisis profundo de 20 páginas con Kolink Pro."
    },
    bestTime: {
      seoTitle: "Mejor Hora para Publicar en LinkedIn | Herramienta IA Gratuita",
      seoDesc: "Encuentra el momento perfecto para publicar en LinkedIn y maximizar tu alcance. Mapa de calor algorítmico personalizado por industria.",
      label: "Algoritmo de Tiempo",
      title: "Mejor Hora para",
      titleHighlight: "Publicar",
      subtitle: "Determina algorítmicamente las ventanas de mayor engagement para tu industria específica.",
      industryLabel: "Selecciona tu Industria",
      industries: {
        tech: "Tecnología y SaaS",
        marketing: "Marketing y Agencias",
        realEstate: "Bienes Raíces",
        finance: "Finanzas y Consultoría",
        healthcare: "Salud y Medicina",
        education: "Educación y Coaching",
        general: "Marca Personal / General"
      },
      button: "Revelar Mejores Horas",
      analyzing: "Analizando Datos...",
      heatmapTitle: "Tu Mapa de Calor de Engagement",
      emptyState: "Selecciona tu industria y haz clic en calcular para ver tu mapa de calor personalizado.",
      low: "Bajo",
      high: "Alto",
      schedCtaTitle: "¿Quieres programar automáticamente?",
      schedCtaDesc: "Kolink Pro programa tus posts en tus horas óptimas.",
      schedCtaBtn: "Programar Post",
      whyTitle: "¿Por qué importa la hora de publicación?",
      whyDesc: "La 'Hora Dorada' en LinkedIn se refiere a los primeros 60 minutos. El algoritmo prueba tu contenido. Si interactúan, se impulsa.",
      bestDaysTitle: "Mejores Días",
      bestDaysDesc: "Martes, Miércoles y Jueves suelen tener un 25-40% más de engagement en B2B.",
      worstTimesTitle: "Peores Horas",
      worstTimesDesc: "Lunes antes de las 10 AM y Viernes después de las 4 PM suelen tener menor retención.",
      days: {
        Mon: "Lun",
        Tue: "Mar",
        Wed: "Mié",
        Thu: "Jue",
        Fri: "Vie",
        Sat: "Sáb",
        Sun: "Dom"
      },
      timeSlots: {
        "8am - 10am": "8am - 10am",
        "10am - 12pm": "10am - 12pm",
        "12pm - 2pm": "12pm - 2pm",
        "2pm - 5pm": "2pm - 5pm",
        "5pm - 8pm": "5pm - 8pm"
      }
    },
    hookGallery: {
      seoTitle: "Librería de Ganchos Virales para LinkedIn | +50 Openers Probados",
      seoDesc: "Explora nuestra librería de ganchos de alta conversión. Copia plantillas para posts Contreras, de Datos, Historias y Listas. Recurso gratuito.",
      label: "Librería Viral",
      title: "La Galería Definitiva de",
      titleHighlight: "Ganchos",
      subtitle: "Deja de mirar la página en blanco. Explora líneas de apertura probadas que captan la atención y generan engagement.",
      filters: {
        all: "Todos",
        contrarian: "Contreras",
        data: "Datos",
        story: "Historia",
        listicle: "Lista",
        question: "Pregunta",
        direct: "Directo"
      },
      card: {
        useInStudio: "Usar en Studio",
        copy: "Copiar",
        copied: "¡Copiado!",
        example: "Ej:"
      },
      empty: {
        title: "No se encontraron ganchos",
        desc: "Intenta con otra categoría."
      },
      cta: {
        title: "¿Necesitas ganchos personalizados para tu marca?",
        desc: "Nuestra IA analiza tu voz única y genera ganchos infinitos adaptados a tu industria.",
        button: "Probar Generador IA"
      },
      categories: {
          Contrarian: "Contreras",
          Data: "Datos",
          Story: "Historia",
          Listicle: "Lista",
          Question: "Pregunta",
          Direct: "Directo"
      }
    },
    vsPage: {
      notFound: "Comparación No Encontrada",
      returnTools: "Volver a Herramientas",
      startTrial: "Empezar Prueba Gratis",
      seeAllTools: "Ver Todas las Herramientas",
      switchHeadline: "Cámbiate a la Alternativa",
      switchHeadlineHighlight: "Completa",
      feature: "Característica",
      monthlyCost: "Costo Mensual",
      pricesDisclaimer: "* Precios comparados basados en planes Pro mensuales a Oct 2025.",
      whySwitch: "Por qué los creadores se cambian a Kolink",
      designedFor: "Diseñado para el algoritmo moderno de LinkedIn que favorece el contenido visual.",
      theGap: "La Brecha de",
      savings: "Ahorro / Mes",
      readyHeadline: "¿Listo para mejorar tu flujo de trabajo?",
      tryFree: "Prueba Kolink Gratis",
      noCard: "No se requiere tarjeta de crédito para herramientas gratuitas."
    }
  },
  cro: {
    exitPopup: {
      title: "¡Espera! No te vayas con las manos vacías.",
      subtitle: "Antes de irte, queremos darte una ventaja injusta.",
      offer: "Obtén acceso gratuito a nuestra 'Bóveda de Viralidad' — 5 templates de posts que han generado +1M de impresiones.",
      emailPlaceholder: "Tu email mejor profesional...",
      button: "Quiero los Templates",
      success: "¡Enviado! Revisa tu bandeja de entrada.",
      decline: "No, prefiero escribir desde cero"
    },
    sticky: {
      text: "Únete a 2,000+ creadores hoy.",
      button: "Empezar Gratis"
    }
  },
  productTour: {
    skip: "Saltar Tour",
    back: "Atrás",
    next: "Siguiente",
    start: "Empezar",
    steps: {
      create: {
        title: "Crear",
        desc: "Empieza aquí para crear nuevos posts virales.",
      },
      history: { title: "Historial", desc: "Gestiona tus posts pasados." },
      ideas: { title: "Ideas", desc: "Inspiración con IA a tu medida." },
      autopilot: {
        title: "AutoPilot",
        desc: "Automatiza tu estrategia de contenido.",
      },
      levelUp: {
        title: "Subir Nivel",
        desc: "Gana XP y recompensas por publicar.",
      },
    },
  },

  // APP INTERFACE TRANSLATIONS (ES)
  carouselStudio: {
    title: "Generador de Carruseles",
    tabs: {
      ai: "Generator IA",
      templates: "Plantillas",
      design: "Diseño Global",
      slide: "Editar Slide"
    },
    inputs: {
      topic: {
        label: "Tu Idea / Tema",
        placeholder: "ej. Cómo escalar un negocio B2B...",
        question: "¿Sobre qué quieres escribir hoy?"
      },
      text: {
        label: "Texto Crudo",
        placeholder: "Pega aquí tu borrador...",
      },
      url: {
        label: "URL del Artículo",
        placeholder: "https://...",
        hint: "Pegar enlace aquí"
      },
      generateBtn: "Generar Carrusel",
      generating: "Diseñando Slides...",
      tabs: {
        topic: "Tema",
        url: "URL",
        youtube: "YouTube",
        pdf: "PDF"
      },
      youtube: {
        label: "URL de Video YouTube",
        placeholder: "https://youtube.com/watch?v=...",
        hint: "Analizaremos el video para crear una historia visual."
      },
      pdf: {
        label: "Subir Documento PDF",
        placeholder: "Seleccionar archivo...",
        select: "Seleccionar PDF",
        change: "Clic para cambiar",
        maxSize: "Max 5MB"
      },
      buttons: {
        generate: "Generar con IA",
        generating: "Diseñando... (~15s)",
        convert: "Convertir Artículo",
        converting: "Convirtiendo... (~20s)",
        video: "Video → Carrusel",
        analyzing: "Analizando... (~30s)",
        extract: "Extraer y Crear",
        extracting: "Extrayendo... (~20s)",
        magic: "Magia IA",
        generateBtn: "Generar",
      },
      hint: "Tip: Usa URLs específicas para mejores resultados.",
      question: "¿Qué quieres crear hoy?",
      footer: "El contenido generado por IA puede requerir edición. Revisa antes de publicar."
    },
    templates: {
      modern: "Moderno",
      minimal: "Minimalista",
      bold: "Atrevido",
      gradient: "Gradiente",
    },
    design: "Diseño",
    properties: {
      globalDesign: "Diseño Global",
      slideEditor: "Editor de Slide",
      palette: "Paleta de Colores",
      font: "Tipografía",
      background: "Fondo",
      showProfile: "Mostrar Perfil",
      showPageNumbers: "Paginas",
      slideType: "Tipo de Slide",
      title: "Título",
      subtitle: "Subtítulo",
      body: "Cuerpo",
      cta: "Texto CTA",
      deleteSlide: "Borrar Slide",
      delete: "Borrar",
      deleteConfirm: "¿Seguro que quieres borrar esta slide?",
      deleteConfirmTitle: "¿Borrar Slide?",
      deleteConfirmDesc: "Esta acción no se puede deshacer.",
      addSlide: "Añadir Slide",
      intro: "Intro",
      content: "Contenido",
      outro: "Outro",
      brandNamePrompt: "Ingresa un nombre para tu Kit de Marca:",
      aiTools: "Herramientas Mágicas IA",
      brandKits: "Kits de Marca",
      saveKits: "Guardar Kit",
      brandKitHint: "Guarda tus colores de marca para reusarlos.",
      export: {
         watermarkNotice: "Plan Gratis: Marca de agua añadida",
         removeWatermark: "Mejorar para Eliminar",
         createdWith: "Creado con Kolink.ai"
      },
      brandKit: {
        title: "Mis Brand Kits",
        description: "Tus identidades visuales guardadas.",
        saveCurrent: "Guardar Actual",
        saveDialogTitle: "Guardar Kit de Marca",
        saveDialogDesc: "Guarda los colores y fuentes actuales como un preset reutilizable.",
        kitNameLabel: "Nombre del Kit",
        kitNamePlaceholder: "Ej. Marca Personal 2026",
        saveButton: "Guardar Kit",
        emptyState: "No tienes kits guardados aún.",
        deleteConfirm: "¿Borrar este kit?",
        deletedSuccess: "Kit eliminado",
        savedSuccess: "Kit de marca guardado",
        saveError: "Error al guardar el kit",
        applied: "Kit \"{{name}}\" aplicado"
      },
      primaryFont: "Fuente Principal",
      magicTools: {
        improve: "Mejorar Escrita",
        shorten: "Acortar",
        expand: "Expandir",
        punchify: "Gancho Viral",
        emojify: "Añadir Emojis"
      },
      layouts: {
        default: "Default",
        fullImg: "Img Completa",
        quote: "Cita",
        number: "Número",
        list: "Lista",
        compare: "Comparar",
        code: "Código"
      },
      slideImage: "Imagen del Slide",
      slideLayout: "Diseño del Slide",
      imageUrl: "URL de Imagen",
      backgroundImage: "Imagen de Fondo",
    },
    export: {
      download: "Descargar PDF",
      exporting: "Exportando...",
    },
    sidebar: {
      caption: "Caption",
      sidebar: "Barra Lateral",
      tabs: {
        ai: "IA",
        templates: "Plantillas",
        design: "Diseño"
      },
      inputs: {
        topic: { label: "Tema o Idea", placeholder: "Ej: Estrategias de marketing para 2024...", question: "¿Sobre qué quieres escribir hoy?" },
        url: { label: "URL del Artículo/Noticia", placeholder: "https://ejemplo.com/noticia", hint: "Pegar enlace aquí" },
        text: { label: "Texto", placeholder: "Pega tu texto..." },
        generateBtn: "Generar",
        generating: "Generando..."
      },
      captions: "Captions"
    },
    captions: {
      title: "Caption para LinkedIn",
      copy: "Copiar al portapapeles",
      copied: "¡Copiado!"
    },
    toasts: {
      captionGenerated: "¡Caption generado!",
      addSlides: "Por favor añade slides primero.",
      captionFailed: "Fallo al generar caption.",
      copied: "¡Copiado al portapapeles!",
      bgRemoved: "Fondo eliminado con éxito",
      bgFailed: "Fallo al eliminar fondo",
      pdfNeeded: "Por favor sube un archivo PDF.",
      contentNeeded: "Por favor proporciona contenido para generar.",
      genSuccess: "¡Carrusel generado con éxito!",
      genFailed: "Generación fallida. Intenta de nuevo.",
      loaded: "Cargado",
      templateApplied: "¡Plantilla aplicada con éxito!"
    },


    canvas: {
      new: "Nuevo Carrusel",
      slides: "Slides",
      zoomIn: "Acercar",
      zoomOut: "Alejar",
      export: "Exportar",
      resetTitle: "Crear Nuevo Carrusel",
      resetDesc: "¿Estás seguro de querer empezar de cero? Esta acción no se puede deshacer.",
      confirmReset: "Confirmar y Resetear",
      cancel: "Cancelar",
      slideIndicator: "Slide {{current}} de {{total}}",
      useArrows: "Usa las Flechas",
      deleteSlideTitle: "¿Borrar Slide?",
      deleteSlideDesc: "Esta acción no se puede deshacer.",
      confirmDelete: "Borrar",
      toasts: {
        cannotDeleteLast: "No puedes borrar la última slide"
      },
      fit: "Ajustar",
      fullscreen: "Pantalla Completa"
    },
    ai: {
      predict: "Predecir Rendimiento",
      predictSubtitle: "Simular la reacción de la audiencia antes de publicar.",
      analyzing: "Analizando audiencia...",
      score: "Puntuación Viral",
      feedback: "Feedback de la Audiencia",
      tips: "Micro-Optimizaciones",
      hook: "Mejor Gancho Sugerido",
      polish: "Optimizar Slide",
      polishSubtitle: "Deja que la IA optimice esta slide específica para mayor impacto.",
      optimizeBtn: "Optimizar con IA"
    },
    creator: {
      title: "Perfil del Creador",
      name: "Tu Nombre",
      handle: "Tu Usuario",
      photo: "Foto de Perfil",
      upload: "Subir Foto"
    },
    patterns: {
      title: "Patrones de Fondo",
      type: "Tipo de Patrón",
      opacity: "Opacidad",
      color: "Color del Patrón",
      none: "Ninguno",
      dots: "Puntos",
      grid: "Cuadrícula",
      waves: "Ondas"
    }
  },
  common: {
    loading: "Cargando experiencia...",
    confirmDelete: "¿Estás seguro de que quieres eliminar este post?",
    premiumLock: {
      title: "Función Premium",
      description: "Mejora tu plan para acceder a esta función.",
      button: "Ver Planes",
      unlockNow: "Desbloquear Ahora",
      premiumFeature: "Esta es una función premium",
      availableOn: "Disponible en los planes Pro y Viral",
      postDeleted: "Post eliminado",
      success: "Éxito",
    }
  },
  app: {
    sidebar: {
      home: "Inicio",
      studio: "Post Editor",
      carousel: "Carruseles",
      ideas: "Generador de Ideas",
      insightResponder: "Respuesta Inteligente",
      autopilot: "AutoPost",
      history: "Historial",
      settings: "Ajustes",
      library: "Biblioteca",
      goPremium: "Planes que crecen contigo",
      upgradeNow: "Mejorar Plan",
      unlockDesc:
      "Desbloquea generaciones ilimitadas y modos virales avanzados.",
      creditsLeft: "créditos restantes",
      logout: "Cerrar Sesión",
      editor: "Editor de Posts",
      audit: "Auditoría de Perfil",
      insight: {
        title: "Respuesta Inteligente",
        subtitle: "Convierte capturas en comentarios de alta autoridad usando",
        uploadTitle: "Subir Post de LinkedIn",
        uploadDesc: "Arrastra una captura aquí o pega una imagen (Cmd+V).",
        intentLabel: "Mi Intención (Opcional)",
        intentPlaceholder: "ej. Quiero discrepar respetuosamente sobre...",
        toneLabel: "Tono de Respuesta",
        generate: "Generar Insights",
        suggestions: "Sugerencias de IA",
        analyzing: "Analizando Contexto Visual...",
        tones: {
          technical: "Autoridad Técnica",
          supportive: "Apoyo Estratégico",
          contrarian: "Contrarian Sutil",
          connector: "Networking Connector",
          empathetic: "Par Empático"
        }
      },
    },


    voiceLab: {
      title: "Laboratorio de Voz",
      description: "Analiza tu estilo de escritura y genera tu ADN de voz único.",
      scanProfile: "Escanear Perfil",
      analyzeDNA: "Analizar ADN",
      cloneVoice: "Clonar Voz",
      inputPlaceholder: "Pega tu texto aquí o selecciona del historial...",
      analyzeButton: "Analizar Voz",
      scanning: "Escaneando...",
      results: "Resultados del Análisis",
      saveVoice: "Guardar Voz",
      voiceSaved: "¡ADN de Voz Guardado!",
    },
    audit: {
      title: "Optimización de Perfil LinkedIn",
      subtitle: "Analiza tu presencia digital con nuestro motor de IA. Detectamos brechas de contenido y optimizamos tu visibilidad para reclutadores.",
      inputLabel: "Descarga el PDF de LinkedIn y súbelo aquí",
      inputPlaceholder: "Haz clic para subir o arrastra tu PDF de LinkedIn",
      buttonAction: "Iniciar Auditoría Híbrida",
      pdfHint: "El PDF te identifica y usamos la URL interna para obtener tus fotos.",
      processing: {
        step1: "Extrayendo texto del PDF...",
        step2: "Identificando tu URL de Perfil...",
        step3: "Obteniendo datos visuales con Bright Data...",
        step4: "Generando resultados de auditoría profunda...",
      },
      results: {
        scoreTitle: "Puntuación de Auditoría",
        summaryTitle: "Resumen IA",
        headline: "Titular",
        about: "Extracto",
        experience: "Experiencia",
        skills: "Aptitudes",
        current: "Actual",
        suggested: "Sugerido",
        analysis: "Análisis IA",
        copyBtn: "Copiar al portapapeles",
        copied: "¡Copiado!",
      }
    },
    editor: {
      title: "Editor de Posts",
      limitWarning: {
        text: "Límite de caracteres cercano.",
        note: "Manténlo conciso."
      },
      placeholder: "Escribe tu post viral aquí...",
      status: {
        readability: {
          title: "Nivel de Lectura",
          subtitle: "Basado en Flesch-Kincaid",
          levels: [
            { g: "5-6", desc: "Ideal para Viralidad", color: "text-green-500" },
            { g: "7-8", desc: "Bueno para Artículos", color: "text-blue-500" },
            { g: "9+", desc: "Muy Complejo", color: "text-red-500" }
          ],
          tip: "Apunta a grado 5-6 para máximo alcance."
        }
      },
      drafts: "Borradores",
      noDrafts: "No se encontraron borradores.",
      toolbar: {
        bold: "Negrita",
        italic: "Cursiva",
        bullet: "Viñetas",
        dash: "Guiones",
        undo: "Deshacer",
        redo: "Rehacer",
        clear: "Limpiar Formato",
      },
      sidebar: {
        preview: "Post Final",
        hooks: "Sugerencias",
        endings: "Contenido",
        snippets: "Snippets",
      },
      preview: {
        mobile: "Móvil",
        desktop: "Escritorio",
        seeMore: "...ver más",
        live: "Vista Previa en Vivo",
        tipTitle: "Consejo Pro",
        tipDesc: "Esta vista simula cómo se verá tu post en el feed. Asegúrate de que los saltos de línea sean limpios."
      },
      hooks: {
        title: "Ganchos Virales",
        empty: "No hay ganchos disponibles para esta búsqueda."
      },
      endings: {
        title: "Cierres / CTAs",
        empty: "No hay cierres disponibles para esta búsqueda."
      },
      snippets: {
        title: "Mis Snippets",
        empty: "No has guardado ningún snippet aún. Selecciona texto en el editor para guardar uno."
      },
      metrics: {
        characters: "caracteres",
        words: "palabras",
        paragraphs: "párrafos",
        sentences: "frases",
        readingTime: "tiempo de lectura",
        grade: "Grado",
      },

      aiActions: {
        title: "Acciones IA",
        rewrite: "Reescribir",
        shorten: "Acortar",
        expand: "Expandir",
        tone: "Cambiar Tono",
      },
      unsavedDraft: "Borrador sin guardar",
      saveDraft: "Guardar borrador",
      openDraft: "Abrir borrador",
      grade: "Grado",
      attach: "Adjuntar",
      continueLinkedIn: "Publicar en LinkedIn",
      copyText: "Copiar texto",
      theme: "Tema",

    },
    ideas: {
      title: "Inspiración Viral",
      subtitle: "Tendencias actuales con IA adaptadas a tu perfil.",
      generateBtn: "Generar Ideas",
      generating: "Analizando tendencias y sintetizando ideas...",
      useThis: "Usar Esta Idea",
      sources: "Fuentes y Noticias:",
      configTitle: "Configuración",
      nicheLabel: "Sector / Tema",
      nicheTooltip:
      "Temas específicos (ej. 'Marketing SaaS') generan mejores tendencias que generales (ej. 'Negocios').",
      nichePlaceholder: "ej. Marketing SaaS, Trabajo Remoto...",
      styleLabel: "Estilo de Idea",
      sourceLabel: "Fuente de Datos",
      countLabel: "Cantidad",
      contextLabel: "Base de Conocimiento / Contexto (Opcional)",
      contextTooltip:
      "Sube archivos o enlaces para dar más contexto a la IA.",
      addLink: "Añadir Enlace",
      addImage: "Subir Imagen",
      addText: "Pegar Texto",
      addDrive: "Desde Drive",
      linkPlaceholder: "https://...",
      pastePlaceholder: "Pega notas o contexto...",
      realTimeData: "Datos en tiempo real de Google Search",
      angle: "Ángulo",
      styles: {
        trending: "🔥 Noticias / Tendencias",
        contrarian: "😈 Contreras / Debate",
        educational: "📚 Educativo / How-to",
        story: "📖 Historia Personal",
        predictions: "🔮 Predicciones Futuras",
      },
      sourcesOpts: {
        news: "Google Search (Noticias en Vivo)",
        evergreen: "Evergreen (Conocimiento General)",
      },
    },
    autopilot: {
      title: "AutoPilot",
      subtitle: "Pon tu crecimiento en LinkedIn en piloto automático.",
      description:
      "AutoPilot genera borradores automáticamente basados en tus temas. Haz clic en 'Ver Resultado' en cualquier borrador para abrirlo en el Estudio, editarlo y publicarlo.",
      stats: {
        systemHealth: "Salud del Sistema",
        optimal: "ÓPTIMO",
        generations: "Generaciones",
      },
      insight: {
        title: "Insight de IA Kolink",
      },
      console: {
        liveMonitoring: "MONITOREO_EN_VIVO",
        ready: "LISTO",
        cpuPriority: "PRIORIDAD_CPU",
        maxHigh: "MÁX_ALTA",
        queueStatus: "ESTADO_COLA",
        waitingSchedule: "ESPERANDO_PROGRAMACIÓN",
        idle: "INACTIVO",
        awaitingSignal: "// Esperando señal de generación inicial",
        outputGenerated: "Resultado Generado:",
        awaitingCycle: "Esperando siguiente ciclo operativo...",
      },
      statusCard: {
        active: "SISTEMA ACTIVO",
        inactive: "SISTEMA OFFLINE",
        nextRun: "Próxima Ejecución",
        lastRun: "Última Generación",
        activateBtn: "Activar AutoPilot",
        deactivateBtn: "Desactivar",
        forceRunBtn: "Ejecutar Ahora",
        systemLive: "Sistema en Línea",
        systemOff: "Sistema Apagado",
        systemStandby: "SIS_ESPERA // ESPERANDO_ENTRADA",
        cloudSyncOk: "SICRONIZACIÓN_NUBE_OK",
        neuralProcessing:
        "PROCESAMIENTO_MOTOR_NEURAL: Optimizando para el próximo despliegue...",
      },
      config: {
        title: "Parámetros de Vuelo",
        frequencyLabel: "Frecuencia",
        frequencyTooltip:
        "Con qué frecuencia debe AutoPilot generar un borrador para ti.",
        topicsLabel: "Temas de Contenido",
        topicsTooltip:
        "AutoPilot elegirá aleatoriamente uno de estos temas para cada ejecución.",
        topicsPlaceholder: "Escribe tema y presiona Enter...",
        audienceLabel: "Audiencia Objetivo",
        audiencePlaceholder:
        "ej. Fundadores SaaS, Directores de Marketing...",
        postCountLabel: "Cantidad de Posts por Ejecución",
        postCountTooltip:
        "Número de posts a generar cada vez que se ejecute AutoPilot (1 crédito por post).",
        save: "Actualizar Configuración",
        description:
        "Define tus parámetros estratégicos de contenido autónomo.",
        expand: "Haz clic para expandir ajustes.",
        syncing: "Sincronizando...",
        addTheme: "Añadir Tema",
      },
      activity: {
        title: "Bitácora de Vuelo",
        empty: "Aún no hay posts automáticos generados.",
        manualOverride: "Control Manual",
        generatedFor: "Post generado para:",
        viewOutput: "Ver Resultado",
        beta: "Beta",
        systemOnline: "SISTEMA EN LÍNEA",
        systemStandby: "SISTEMA EN ESPERA",
        connected: "CONECTADO",
        autoPilotTone: "Tono de AutoPilot",
        postUnit: "Post",
        postsUnit: "Posts",
        creditCostNote:
        "* Cada post generado consume 1 crédito. Total: {{count}} créditos por ejecución.",
        noTopics: "No hay temas añadidos. Añade al menos uno.",
      },
      frequencies: {
        daily: "Diario (24h)",
        weekly: "Semanal (7d)",
        biweekly: "Quincenal (14d)",
      },
    },
    generator: {
      title: "Motor Viral",
      credits: "Créditos",
      topicLabel: "Idea Central / Tema",
      topicPlaceholder:
      "ej. Por qué la 'cultura del esfuerzo' está destruyendo la productividad...",
      audienceLabel: "Audiencia Objetivo",
      audienceTooltip:
      "Nichos específicos funcionan 2x mejor. 'Fundadores SaaS' > 'Gente de negocios'.",
      audiencePlaceholder:
      "ej. Fundadores SaaS, Desarrolladores Junior, Gerentes de Marketing",
      toneLabel: "Tono de Voz",
      toneTooltip:
      "Define la actitud. 'Profesional' genera confianza, 'Controvertido' debate.",
      structureLabel: "Estructura Viral",
      structureTooltipTitle: "¿Por qué importa la estructura?",
      structureTooltip1: "Listicle: Máxima legibilidad y guardados.",
      structureTooltip2: "Historia: Construye confianza y conexión.",
      structureTooltip3: "Contreras: Provoca debate y comentarios.",
      lengthLabel: "Longitud del Post",
      emojiLabel: "Densidad de Emojis",
      emojiTooltip:
      "Anclas visuales. 'Alto' para móvil, 'Mínimo' para pulido corporativo.",
      ctaLabel: "¿Incluir Llamada a la Acción?",
      creativityLabel: "Nivel de Creatividad",
      creativityTooltip:
      "Alto = Arriesgado/Atrevido. Bajo = Seguro/Profesional.",
      creativityLow: "Seguro/Corporativo",
      creativityHigh: "Viral y Atrevido",
      generateBtn: "Generar con IA",
      generatingBtn: "Arquitectando Post Viral...",
      noCreditsBtn: "0 Créditos Restantes",
      strategyTitle: "Estrategia de Contenido",
      detailsTitle: "Detalles & Ajustes",
    },

    preview: {
      edit: "Editar",
      save: "Guardar",
      cancel: "Cancelar",
      placeholder: "Tu obra maestra viral aparecerá aquí...",
      follow: "Seguir",
      scheduled: "Programado exitosamente",
      seeMore: "...ver más",
      viralPotential: "Potencial Viral",
      aiEstimate: "Probabilidad de alcance estimada por IA",
      high: "Alto",
      medium: "Medio",
      low: "Bajo",
      hook: "GANCHO",
      readability: "LEGIBILIDAD",
      value: "VALOR",
      proTip: "CONSEJO PRO",
    },
    history: {
      title: "Creaciones Recientes",
      navAll: "Todo",
      navPublished: "Publicados",
      navScheduled: "Programados",
      navDrafts: "Borradores",
      libraryTitle: "Biblioteca",
      favorites: "Favoritos",
      filtersTitle: "Filtros",
      toneLabel: "Tono",
      frameworkLabel: "Estructura",
      filterAllFrameworks: "Todas Estructuras",
      empty: "Sin historial aún.",
      copy: "Copiar",
      delete: "Eliminar",
      viewTitle: "Archivo de Contenido",
      viewSubtitle:
      "Revisa, edita y republica tu contenido de mejor rendimiento.",
      searchPlaceholder: "Buscar por tema...",
      filterAll: "Todos los Tonos",
      noResults: "No se encontraron posts con esos criterios.",
      noResultsDesc:
      "Intenta ajustar tus filtros o genera un nuevo post para comenzar.",
      noScore: "Sin Puntaje",
      statsViews: "Vistas Est.",
      statsLikes: "Likes Est.",
      actions: {
        reuse: "Reusar",
        copied: "¡Copiado!",
      },
    },
    settings: {
      title: "Ajustes",
      subtitle: "Gestiona tus preferencias y suscripción.",
      trophyRoom: "Sala de Trofeos",
      generalPrefs: "Preferencias Generales",
      languageLabel: "Idioma / Language",
      languageTooltip:
      "Cambia el idioma de la interfaz Y el idioma de salida de la IA.",
      languageDesc:
      "Selecciona tu idioma preferido para la interfaz y la generación.",
      brandVoiceTitle: "Voz de Marca y Persona",
      brandVoiceTooltip:
      "Esto anula la configuración estándar de 'Tono'. Sé descriptivo con adjetivos.",
      premiumFeature: "Función Premium",
      brandVoiceDesc:
      "Describe cómo quieres que suene tu IA. Esto define tu estilo único y anula los tonos estándar.",
      brandVoicePlaceholder:
      "ej. 'Ingenioso, sarcástico y usa referencias pop.', 'Autoritario, basado en datos y usa frases cortas.', 'Empático, vulnerable y enfocado en historias.'",
      profileTitle: "Información del Perfil",
      uploadPhoto: "Subir Nueva Foto",
      fullName: "Nombre Completo",
      jobTitle: "Cargo",
      companyLabel: "Nombre de Empresa",
      companyTooltip:
      "Ayuda a la IA a adaptar el contenido a tu organización.",
      industryLabel: "Industria",
      industryTooltip:
      "Proporciona contexto para jerga específica de la industria.",
      headline: "Titular de LinkedIn",
      securityTitle: "Seguridad y Privacidad",
      twoFactor: "Autenticación de Dos Factores (2FA)",
      twoFactorDesc: "Protege tu cuenta con una capa extra de seguridad.",
      securityAlerts: "Alertas de Seguridad",
      securityAlertsDesc:
      "Recibe notificaciones sobre inicios de sesión sospechosos.",
      activeSessions: "Sesiones Activas",
      billingTitle: "Facturación y Uso",
      currentUsage: "Uso Actual",
      manageSub: "Gestionar Suscripción",
      paymentMethod: "Método de Pago",
      updatePayment: "Actualizar Detalles de Pago",
      invoiceHistory: "Historial de Facturas",
      saveChanges: "Guardar Cambios",
      saving: "Guardando...",
      saved: "¡Guardado!",
      support: {
        title: "¿Necesitas ayuda?",
        subtitle: "Nuestro equipo de soporte está listo para ayudarte con cualquier problema o duda que tengas.",
        cta: "Contactar Soporte",
        email: "info@kolink.es"
      },
    },
    cancellation: {
      title: "Lamentamos que te vayas",
      subtitle:
      "Por favor cuéntanos por qué te vas para que podamos mejorar.",
      reasons: {
        expensive: "Muy caro",
        usage: "No lo uso suficiente",
        alternative: "Encontré otra alternativa",
        features: "Faltan funciones",
        other: "Otro",
      },
      keepPlan: "Mantener mi Plan",
      continue: "Continuar",
      offer30: {
        title: "¡Espera! No pierdas tu progreso",
        subtitle:
        "Nos encantaría mantenerte como creador. Aquí tienes una oferta especial solo para ti.",
        badge: "OFERTA LIMITADA",
        discountText: "30% DTO POR 6 MESES",
        claimBtn: "Reclamar 30% de Descuento",
        applying: "Aplicando...",
        reject: "No gracias, aún quiero cancelar",
      },
      offer50: {
        title: "Oferta de Última Oportunidad",
        subtitle:
        "Realmente no queremos que te vayas. Esta es nuestra mejor oferta posible.",
        badge: "OFERTA FINAL",
        discountText: "50% DTO POR 1 AÑO",
        claimBtn: "Reclamar 50% de Descuento",
        applying: "Aplicando...",
        reject: "No gracias, proceder a la cancelación",
      },
      confirm: {
        title: "Confirmar Cancelación",
        subtitle:
        "Tu suscripción se cancelará al final de tu período de facturación actual. Perderás acceso a las funciones premium y tus créditos expirarán.",
        access: "Acceso hasta el final del ciclo",
        data: "Datos preservados por 30 días",
        frozen: "Los créditos se congelarán",
        goBack: "Volver",
        confirmBtn: "Confirmar Cancelación",
        canceling: "Cancelando...",
        deletionWarning: "IMPORTANTE: Si cancelas ahora, tu cuenta será ELIMINADA PERMANENTEMENTE en 3 días debido a nuestra política contra el abuso de cupones (solo para cuentas con menos de 1 mes).",
      },
    },
    upgrade: {
      title: "Elige tu Plan Viral",
      subtitle:
      "Desbloquea modelos de IA avanzados, generaciones ilimitadas y los marcos virales secretos usados por los mejores creadores.",
      monthly: "Mensual",
      yearly: "Anual",
      save: "Ahorra 20%",
      mostPopular: "MÁS POPULAR",
      currentPlan: "Plan Actual",
      included: "Incluido en tu Plan",
      upgradeNow: "Mejorar Ahora",
      billedYearly: "Facturado {{amount}} anualmente",
      moneyBack: "Garantía de reembolso de 7 días",
      socialProof: "Elegido por +1,200 creadores",
      saveAmount: "Ahorras {{amount}} al año",
      securePayment:
      "Pago seguro vía Stripe. Cancela cuando quieras. Al mejorar, aceptas nuestros Términos de Servicio. Para planes empresariales personalizados, contacta a ventas.",
    },
    constants: {
      tones: {
        [ViralTone.PROFESSIONAL]: {
          label: "👔 Profesional",
          desc: "Limpio, corporativo, enfocado en liderazgo.",
        },
        [ViralTone.CONTROVERSIAL]: {
          label: "🔥 Controvertido",
          desc: "Opiniones polarizantes que generan comentarios.",
        },
        [ViralTone.EMPATHETIC]: {
          label: "❤️ Empático",
          desc: "Vulnerable stories that build connection.",
        },
        [ViralTone.EDUCATIONAL]: {
          label: "📚 Educativo",
          desc: "Alto valor, consejos accionables.",
        },
        [ViralTone.HUMOROUS]: {
          label: "😂 Humorístico",
          desc: "Alegre, identificable, memes.",
        },
        [ViralTone.STORYTELLING]: {
          label: "📖 Storytelling",
          desc: "Deep dive narrative.",
        },
      },
      frameworks: {
        [ViralFramework.PAS]: {
          label: "Problema-Agitación-Solución",
          desc: "Fórmula clásica de copywriting.",
        },
        [ViralFramework.AIDA]: {
          label: "AIDA",
          desc: "Atención, Interés, Deseo, Acción.",
        },
        [ViralFramework.BAB]: {
          label: "Antes-Después-Puente",
          desc: "Muestra la transformación.",
        },
        [ViralFramework.LISTICLE]: {
          label: "La Lista (Listicle)",
          desc: "Puntos escaneables (Alto CTR).",
        },
        [ViralFramework.CONTRARIAN]: {
          label: "Opinión Impopular",
          desc: "Desafía el status quo.",
        },
        [ViralFramework.STORY]: {
          label: "Micro-Historia",
          desc: "Anécdota personal con lección.",
        },
      },
      lengths: {
        [PostLength.SHORT]: { label: "Corto e Impactante" },
        [PostLength.MEDIUM]: { label: "Estándar" },
        [PostLength.LONG]: { label: "Profundo" },
      },
      emojis: {
        [EmojiDensity.MINIMAL]: { label: "Mínimo" },
        [EmojiDensity.MODERATE]: { label: "Balanceado" },
        [EmojiDensity.HIGH]: { label: "Alto" },
      },
      hooks: {
        random: { label: "🎲 Aleatorio (Sorpréndeme)" },
        question: { label: "Pregunta Retórica" },
        statistic: { label: "Dato/Estadística Impactante" },
        negative: { label: "Negativo/Advertencia" },
        story: { label: "Inicio de Historia ('Ayer me pasó...')" },
        assertion: { label: "Afirmación Directa" },
      },
    },
  },
  dashboard: {
    sidebar: {
      home: "Inicio",
      create: "Nuevo Post",
      history: "Historial",
      carousel: "Carousel Studio",
      tools: "Niche Tools",
      settings: "Configuración",
      upgrade: {
        title: "Mejorar a Pro",
        desc: "Desbloquea IA ilimitada y herramientas virales.",
        btn: "Ver Planes"
      },
      userToken: "Usuario",
      logoutToast: "Sesión cerrada"
    },
    header: {
      dashboard: "Panel de Control",
      create: "Redactor de Posts",
      history: "Biblioteca de Contenido",
      settings: "Configuración",
      carousel: "Estudio de Carruseles",
      credits: "Créditos",
      level: "Nivel",
      autopost: "Programador Inteligente",
      responder: "Asistente de Engagement",
      chat: "Estratega Personal IA",
      audit: "Auditor de Perfil",
      voice: "Voice Lab",
      editor: "Editor",
      home: "Inicio",
      menu: "Menú",
      upgrade: "Mejorar Plan"
    },
    activation: {
      title: "Tu Viaje en Kolink",
      subtitle: "Completa estos pasos para despegar 🚀",
      pending: "Pendiente",
      completed: "Completado",
      steps: {
        brandVoice: {
          title: "Define tu Brand Voice",
          desc: "Entrena a la IA con tu estilo único.",
        },
        firstPost: {
          title: "Crea tu Primer Post",
          desc: "Redacta contenido viral en segundos.",
        },
        firstCarousel: {
          title: "Diseña un Carrusel",
          desc: "Visuales impactantes sin esfuerzo.",
        },
      },
    },
    launchpad: {
      tools: {
        create: { name: "Arquitectura Viral", desc: "Inicia aquí. Diseña posts de alta retención con IA.", badge: "Acción Principal" },
        carousel: { name: "Storyteller Visual", desc: "Convierte texto en carruseles PDF.", badge: "NUEVO" },
        chat: { name: "Consultor Estratégico", desc: "Tu experto 24/7 en Marca Personal.", badge: "MENTOR IA" },
        autopost: { name: "Piloto Automático", desc: "Programa tu consistencia. Crece mientras duermes." },
        responder: { name: "Comunidad & Leads", desc: "Responde comentarios. Convierte fans en clientes." },
        audit: { name: "Auditor de Perfil", desc: "Optimiza tu biografía y foto para máxima autoridad." },
        voice: { name: "Clon de Voz", desc: "Entrena a la IA para escribir como tú." },
        editor: { name: "Perfeccionador", desc: "Formato, negritas y ganchos finales." },
        history: { name: "Biblioteca", desc: "Tus mejores posts guardados." },
        settings: { name: "Ajustes", desc: "Preferencias de cuenta." }
      },
      shortcuts: {
        home: "Inicio",
        notifications: "Notificaciones",
        settings: "Ajustes",
        support: "Soporte",
        security: "Seguridad"
      },
      stats: {
        weeklyGoal: "Meta Semanal",
        level: "Nivel",
        xpToNext: "XP para el siguiente",
        master: "Maestro del Contenido",
        hero: "Tu audiencia está activa. Es hora de liderar.",
        streak: "Días Racha",
        week: "Semana"
      }
    },
    expertChat: {
      initialMessage: "¡Hola! Soy Nexus, tu estratega personal de LinkedIn. ¿En qué puedo ayudarte hoy?",
      errors: {
        insufficientCredits: "No tienes suficientes créditos para esta consulta.",
        generic: "Lo siento, hubo un error procesando tu consulta."
      },
      sidebar: {
        activeContext: "Contexto Activo",
        brandVoice: "Voz de Marca",
        noBrandVoice: "No definido. Nexus usará un tono profesional estándar.",
        userProfile: "Perfil de Usuario",
        noHeadline: "Sin titular",
        mode: "Modo",
        ghostwriter: "Ghostwriter",
        dnaActive: "DNA Activo",
        nexusKnows: "Nexus te conoce:"
      },
      status: {
        analyzing: "Analizando estrategia...",
        sending: "Enviando...",
        send: "Enviar Mensaje",
        placeholder: "Escribe un borrador o pide consejo..."
      }
    },
    lockedStates: {
      history: {
        title: "Accede a tu Historial Ilimitado",
        subtitle: "No pierdas tus mejores ideas. Recupera, analiza y reutiliza tu contenido pasado.",
        features: ["Archivo completo de posts", "Análisis de rendimiento viral", "Reutilización de contenido en 1 clic", "Exportación de datos"],
        cta: "Ver mis Estadísticas"
      },
      chat: {
        title: "Desbloquea Nexus AI Expert",
        subtitle: "Tu consultor estratégico personal disponible 24/7 para potenciar tu marca.",
        features: ["Consultoría ilimitada de estrategia LinkedIn", "Análisis de tendencias en tiempo real", "Ideas de contenido personalizadas", "Respuestas instantáneas a dudas técnicas"],
        cta: "Desbloquear Nexus"
      },
      editor: {
        title: "Editor de Posts Profesional",
        subtitle: "Lleva tus posts al siguiente nivel con nuestro editor avanzado. Formato Unicode, ganchos predefinidos y previsualización real de LinkedIn.",
        features: ["Formato Negrita/Cursiva", "Biblioteca de Ganchos", "Previsualización Móvil/PC", "Biblioteca de Snippets"]
      },
      audit: {
        title: "Auditoría de Perfil Profesional",
        subtitle: "Optimiza tu perfil de LinkedIn con nuestra IA avanzada. Detecta brechas, mejora tu SEO y aumenta tu visibilidad ante reclutadores.",
        features: ["Análisis de SEO", "Optimización de Titular", "Detección de Brechas", "Sugerencias de Contenido"]
      }
    }
  },
  landing: {
    meta: {
      title: "Kolink | Arquitecto de IA para LinkedIn",
      description: "Crea posts virales, carruseles infinitos y domina LinkedIn con IA. La herramienta definitiva para profesionales y marcas que buscan autoridad.",
      keywords: "LinkedIn IA, Generador de posts, Carruseles LinkedIn, Marca Personal, Social Selling, Automatización LinkedIn",
    },
    mock: {
      level: "NIVEL 1",
      creator: "Creador",
      studio: "Estudio",
      ideas: "Ideas",
      autopilot: "AutoPilot",
      history: "Historial",
      settings: "Ajustes",
      credits: "20 créditos",
      topicLabel: "Tema o Idea",
      topicValue: "Cómo la consistencia vence a la intensidad en LinkedIn...",
      audienceLabel: "Audiencia",
      audienceValue: "Fundadores SaaS, Creadores",
      toneLabel: "Tono",
      toneValue: "Controvertido",
      structureLabel: "Estructura",
      creativityLabel: "Creatividad",
      creativityValue: "Alta",
      generate: "Generar",
      postHeader: "Founder @ Kolink",
      postContent: "Deja de mirar una página en blanco. 🛑\n\nLa mayoría pierde 10 horas/semana pensando qué escribir.\n\nMientras tanto, el top 1% usa frameworks.\n\nAquí está el secreto: No necesitas más creatividad. Necesitas mejor arquitectura.\n\nEl Framework PAS para viralidad:\n❌ Problema: El bloqueo mata el impulso.\n🔥 Agitación: La inconsistencia mata el alcance.\n✅ Solución: Usa estructuras probadas.",
      postTags: "#GrowthHacking #LinkedInTips #AI",
      voiceCardTitle: "ADN de Marca",
      voiceCardVal: "Clonación: 99%",
      viralCardTitle: "Alcance Viral",
      viralCardVal: "Potencial: Alto",
      badPost: "Me complace anunciar que hoy he reflexionado sobre la importancia de la consistencia. La consistencia es clave porque nos permite desarrollar hábitos duraderos. Además, es fundamental mantenerse motivado incluso cuando los resultados no son inmediatos para poder alcanzar el éxito a largo plazo en nuestras carreras profesionales...",
      goodPostHook: "La consistencia vence a la intensidad.",
      goodPostBody: "La mayoría falla porque corre un sprint.\nEl 1% gana porque camina cada día.\n\nAquí mi sistema de 3 pasos: 👇",
    }
  }
};
