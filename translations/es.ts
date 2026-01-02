import { EmojiDensity, PostLength, ViralFramework, ViralTone } from "../types";

export const es = {
    nav: {
      howItWorks: "Cómo Funciona",
      demo: "Demo",
      features: "Funciones",
      tools: "Herramientas",
      testimonials: "Resultados",
      pricing: "Precios",
      comparison: "Comparativa",
      faq: "Preguntas",
      login: "Comenzar Gratis",
      getStarted: "Empezar",
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
            { label: "Sobre Nosotros", href: "/#hero" },
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
            { label: "Blog", href: "/#tools" },
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
      },
    },
    hero: {
      badge: "#1 Herramienta de IA para LinkedIn",
      titleLine1: "Crea contenido de autoridad",
      titleLine2: "en LinkedIn 10x más rápido.",
      subtitle:
        "Convierte ideas sueltas en posts virales que conectan. Tu estudio de IA para dominar LinkedIn en segundos, no horas.",
      ctaPrimary: "Generar mi primer post ahora",
      ctaSecondary: "Ver Demo",
      generating: "Generando Post Viral...",
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
          name: "Precio Base",
          values: {
            kolink: "€19/mes",
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
          name: "Modelos LLM Pro (GPT-4o/Claude 3.5)",
          values: {
            kolink: "✅ Incluido",
            taplio: "⚠️ (Limitado)",
            supergrow: "❌ (Básico)",
            authored: "❌",
          },
        },
        {
          name: "Pre-visualización Real-time",
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
      item1Price: "€2,000/mes",
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
      totalPrice: "€2,648/mes",
      kolinkLabel: "Todo esto incluido al unirte a Kolink.",
      kolinkPlan: "Plan Creador Pro:",
      kolinkPrice: "€19/mes",
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
          name: "Plan Inicial",
          description: "Para probar el poder de la IA",
          features: [
            "10 Créditos de Prueba",
            "Generador de Ideas Básico",
            "3 Tonos Predefinidos",
            "Acceso a Comunidad",
            "Sin Tarjeta de Crédito",
          ],
        },
        pro: {
          name: "Creador Pro",
          description: "Automatiza tu marca personal",
          features: [
            "Todo lo del Plan Inicial, más:",
            "Créditos IA ILIMITADOS",
            "Generador de Ideas ILIMITADO",
            "Autopilot (Programación)",
            "Análisis de Voz de Marca",
            "Soporte Prioritario",
          ],
        },
        viral: {
          name: "Dios Viral",
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
    settings: {
      language: "Idioma",
      languageDesc:
        "Selecciona tu idioma preferido para la interfaz y la generación de contenido.",
    },
    // APP INTERFACE TRANSLATIONS (ES)
    app: {
      sidebar: {
        studio: "Estudio",
        carousel: "Generador de Carrusel",
        ideas: "Generador de Ideas",
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
          preview: "Vista Previa",
          hooks: "Ganchos",
          endings: "Footers",
          snippets: "Snippets",
        },
        preview: {
          mobile: "Móvil",
          desktop: "Escritorio",
          seeMore: "...ver más",
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
        status: {
          readability: "Legibilidad",
          readTime: "tiempo de lectura",
        },
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
        mostPopular: "Más Popular",
        currentPlan: "Plan Actual",
        included: "Incluido en tu Plan",
        upgradeNow: "Mejorar Ahora",
        billedYearly: "Facturado {{amount}} anualmente",
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
};
