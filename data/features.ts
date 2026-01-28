import { FeaturePageData } from "../types/landing";
import { 
    PenTool, Zap, Layout, MessageSquare, UserCheck, 
    Clock, Globe, Target, BarChart3, Shield,
    Building2, Rocket, Scale, Megaphone, HeartPulse,
    Palette, XCircle, Search, RefreshCw, Briefcase, TrendingUp,
    HelpCircle, PlayCircle, Info, DollarSign, Users, BrainCircuit, CreditCard, Sparkles
} from "lucide-react";

export const featuresData: Record<string, FeaturePageData> = {
    // --- FEATURES ---
    "post-editor": {
        slug: "post-editor",
        hero: {
            badge: "EDITOR VIRAL DE IA",
            title: "Escribe contenido de LinkedIn en segundos, no horas.",
            subtitle: "La única herramienta que combina IA, formatos virales probados y una vista previa real de LinkedIn para eliminar el bloqueo del escritor para siempre.",
            cta: "Empezar a Escribir Gratis",
            image: "PostEditorMockup" 
        },
        problem: {
            title: "¿Por qué tu contenido actual no convierte?",
            cards: [
                {
                    icon: Clock,
                    title: "El coste del tiempo perdido",
                    text: "Pasar 2 horas editando un solo post para obtener 10 likes no es sostenible. Te convierte en esclavo del algoritmo sin retorno de inversión."
                },
                {
                    icon: Layout,
                    title: "Formato ilegible (Muro de texto)",
                    text: "Los bloques de texto densos sin espaciado inteligente ni 'ganchos' visuales son ignorados por el cerebro humano en menos de 0.2 segundos."
                },
                {
                    icon: Target,
                    title: "Publicar sin estrategia",
                    text: "Publicar ocurrencias aleatorias sin una estructura narrativa probada es como gritar en un bosque vacío. Necesitas marcos psicológicos."
                }
            ]
        },
        solution: {
            title: "Tu nuevo mentor de escritura viral",
            subtitle: "Olvídate de luchar con la página en blanco. Kolink combina psicología del consumidor, análisis de algoritmos y diseño visual en una sola herramienta fluida.",
            blocks: [
                {
                    title: "Vista Previa 100% Precisa (Móvil y Desktop)",
                    description: "El 80% del tráfico de LinkedIn es móvil. Si tu gancho se corta o tu formato se rompe en pantallas pequeñas, pierdes la atención al instante. Nuestro simulador de alta fidelidad te muestra exactamente qué verán tus lectores antes de que sea demasiado tarde, permitiéndote optimizar cada salto de línea.",
                    image: "RealPreviewMockup",
                    imagePosition: "right"
                },
                {
                    title: "Plantillas Virales de Ingeniería Inversa",
                    description: "No necesitas ser creativo todos los días. Accede a nuestra biblioteca de +50 estructuras probadas (Hooks, Storytelling, Listas Contrarias) que han generado millones de visualizaciones para los top creators. Simplemente selecciona una estructura y la IA te guiará para rellenar los huecos con tu expertise.",
                    image: "TemplatesMockup",
                    imagePosition: "left"
                },
                {
                    title: "Editor Inteligente con IA Contextual",
                    description: "Más allá de la corrección ortográfica. Nuestra IA analiza el tono, la legibilidad y la persuasión de tu texto. Pídele que lo haga 'más polémico', 'más empático' o que 'mejore el gancho' con un solo clic. Es como tener a un copywriter senior revisando cada palabra.",
                    image: "AIRewriteMockup",
                    imagePosition: "right"
                }
            ]
        },
        useCases: {
            title: "Potencia para cada perfil profesional",
            cases: [
                { title: "Fundadores & CEOs", description: "Construye una autoridad de pensamiento líder en la industria sin sacrificar horas de gestión. Delega la ejecución, no la voz.", icon: Target },
                { title: "Copywriters Freelance", description: "Multiplica tu output x5. Entrega borradores perfectos a tus clientes con previsualizaciones reales que eliminan rondas de revisión.", icon: PenTool },
                { title: "Líderes de Ventas", description: "Deja de hacer llamadas en frío. Atrae prospectos cualificados demostrando expertise con contenido que educa y convence.", icon: BarChart3 }
            ]
        },
        faq: [
            { q: "¿Es seguro para mi cuenta?", a: "Totalmente. Kolink usa la API oficial de LinkedIn y no automatiza acciones prohibidas." },
            { q: "¿Puedo programar los posts?", a: "Sí, el editor se conecta directamente con nuestro planificador inteligente." }
        ],
        cta: {
            title: "¿Listo para dominar tu nicho?",
            subtitle: "Únete a los creadores que ya están ahorrando 10h/semana.",
            buttonText: "Probar Editor Gratis",
            link: "/login"
        }
    },
    "carousel-studio": {
        slug: "carousel-studio",
        hero: {
            badge: "CAROUSEL STUDIO",
            title: "Crea Carruseles que Generan Clientes",
            subtitle: "Diseño premium, redacción con IA y marca personal consistente. Todo en una sola herramienta diseñada para convertir.",
            cta: "Empezar a Crear",
            image: "CarouselEditorMockup"
        },
        problem: {
            title: "¿Por qué tus carruseles no convierten?",
            cards: [
                { icon: Clock, title: "Canva te roba tiempo", text: "Pasas horas moviendo cajas de texto y alineando iconos en lugar de crear valor." },
                { icon: Palette, title: "Diseño Amateur", text: "Sin conocimientos de diseño, es difícil lograr esa estética 'premium' que genera confianza." },
                { icon: Layout, title: "Falta de Estructura", text: "Un carrusel bonito sin una buena narrativa es solo decoración. Necesitas retención." }
            ]
        },
        solution: {
            title: "Tu Agencia de Diseño en una App",
            subtitle: "Deja de luchar con los píxeles. Enfócate en tu mensaje.",
            blocks: [
                {
                    title: "De Idea a Carrusel en Segundos",
                    description: "No empieces desde cero. Escribe un tema y nuestra ia redactará el guion slide por slide, optimizado para retención y viralidad.",
                    image: "AIContentMockup",
                    imagePosition: "right"
                },
                {
                    title: "Identidad Visual Automática",
                    description: "Sube tu logo, colores y fuentes una sola vez. Aplícalos a cualquier plantilla con un clic y mantén una imagen de marca impecable.",
                    image: "BrandKitMockup",
                    imagePosition: "left"
                }
            ]
        },
        useCases: {
            title: "Potencia tu Autoridad",
            cases: [
                { title: "Consultores", description: "Transforma metodologías complejas en guías visuales paso a paso.", icon: Target },
                { title: "Fundadores", description: "Comparte aprendizajes y cultura de empresa con un diseño profesional.", icon: Building2 },
                { title: "Creadores", description: "Multiplica tu alcance reciclando hilos de Twitter en carruseles de LinkedIn.", icon: Globe }
            ]
        },
        faq: [
            { q: "¿En qué formato se exportan?", a: "PDF de alta resolución y PNGs individuales, listos para subir a LinkedIn e Instagram." },
            { q: "¿Puedo editar el contenido generado?", a: "Totalmente. El editor es flexible: cambia textos, imágenes, colores y orden de slides." }
        ],
        cta: {
            title: "Tu marca merece verse bien",
            subtitle: "Únete a los líderes de opinión que ya usan Kolink para destacar.",
            buttonText: "Crear Carrusel Gratis",
            link: "/tools/carousel-studio"
        }
    },
    "autopilot": {
        slug: "autopilot",
        hero: {
            badge: "SISTEMA AUTOPILOT",
            title: "Tu Sistema de Crecimiento Infinito",
            subtitle: "Olvídate de publicar manualmente. Programa un mes de contenido en una tarde y deja que nuestra IA optimice tus horarios para máxima viralidad.",
            cta: "Activar Piloto Automático",
            image: "SchedulingCalendarMockup"
        },
        problem: {
            title: "La Inconsistencia Mata tu Alcance",
            cards: [
                { icon: Clock, title: "El Día a Día te Come", text: "Empiezas la semana motivado, pero el martes ya estás apagando fuegos y olvidas publicar." },
                { icon: Globe, title: "Timing Incorrecto", text: "Publicas cuando tu audiencia duerme o está en reuniones, desperdiciando tu mejor contenido." },
                { icon: BarChart3, title: "Postear y Rezar", text: "Disparas a ciegas sin una estrategia de repetición para tus mejores ideas." }
            ]
        },
        solution: {
            title: "Domina el Algoritmo sin Esfuerzo",
            subtitle: "Un sistema que trabaja 24/7 para mantenerte visible.",
            blocks: [
                {
                    title: "Calendario Visual Drag & Drop",
                    description: "Diseña tu estrategia mensual de un vistazo. Arrastra borradores, reordena ideas y asegúrate de tener una mezcla perfecta de contenido educativo, personal y de venta.",
                    image: "SchedulingCalendarMockup",
                    imagePosition: "right"
                },
                {
                    title: "Reciclaje Inteligente de Contenido",
                    description: "No dejes que tus mejores posts mueran. Nuestra 'Cola Inteligente' detecta huecos en tu calendario y rellena automáticamente con tus éxitos pasados (Evergreen Content).",
                    image: "SmartQueueMockup",
                    imagePosition: "left"
                }
            ]
        },
        useCases: {
            title: "Esencial para...",
            cases: [
                { title: "Ejecutivos", description: "Mantén una presencia de líder de opinión invirtiendo solo 30 min a la semana.", icon: Building2 },
                { title: "Agencias", description: "Gestiona 10+ cuentas de clientes desde un solo calendario unificado.", icon: Users },
                { title: "Nómadas Digitales", description: "Tu contenido se publica en hora punta de Nueva York mientras tú duermes en Bali.", icon: Globe }
            ]
        },
        faq: [
            { q: "¿Publica automáticamente en LinkedIn?", a: "Sí, usamos la API oficial. No hay riesgo de ban como con las herramientas de automatización 'grises'." },
            { q: "¿Puedo ver una vista previa antes de que salga?", a: "Por supuesto. Verás exactamente cómo quedará el post en móvil y escritorio." }
        ],
        cta: {
            title: "Recupera tu Libertad",
            subtitle: "Deja de ser esclavo del botón 'Publicar'. Automatiza tu éxito.",
            buttonText: "Probar AutoPilot Gratis",
            link: "/autopilot"
        }
    },
    "profile-auditor": {
        slug: "profile-auditor",
        hero: {
            badge: "AUDITORÍA DE PERFIL",
            title: "Convierte cada Visita en un Cliente Potencial",
            subtitle: "Tu Perfil de LinkedIn es tu Landing Page más importante. Nuestra IA analiza 50+ puntos de contacto para asegurar que comuniques autoridad en los primeros 3 segundos.",
            cta: "Auditar mi Perfil Gratis",
            image: "AuditScoreMockup"
        },
        problem: {
            title: "¿Por qué nadie te contacta?",
            cards: [
                { icon: UserCheck, title: "Banner Confuso", text: "El 90% de los visitantes se van porque no entienden qué problema resuelves." },
                { icon: Target, title: "Bio Genérica", text: "Palabras vacías como 'apasionado' o 'innovador' te hacen invisible en el buscador." },
                { icon: Shield, title: "Falta de Prueba Social", text: "Sin validación visual, pierdes credibilidad instantánea frente a tu competencia." }
            ]
        },
        solution: {
            title: "Ingeniería de Conversión para LinkedIn",
            subtitle: "Optimización basada en datos de los top 1% de perfiles.",
            blocks: [
                {
                    title: "Score de Autoridad Instantáneo",
                    description: "Recibe una puntuación del 0 al 100 basada en claridad, SEO y persuasión. Descubre si tu perfil está listo para vender o si necesitas una renovación urgente.",
                    image: "AuditScoreMockup",
                    imagePosition: "right"
                },
                {
                    title: "Mapa de Calor de Errores",
                    description: "Nuestra IA escanea tu perfil como lo haría un cliente. Detectamos zonas muertas, falta de contraste y oportunidades perdidas para colocar CTAs.",
                    image: "ProfileHeatmapMockup",
                    imagePosition: "left"
                }
            ]
        },
        useCases: {
            title: "Crítico para...",
            cases: [
                { title: "Buscadores de Empleo", description: "Pasa los filtros ATS y destaca ante los reclutadores en 5 segundos.", icon: UserCheck },
                { title: "Freelancers", description: "Justifica tarifas más altas con una imagen que transmite profesionalismo top-tier.", icon: DollarSign },

                { title: "Consultores", description: "Genera confianza antes de la primera llamada.", icon: Shield }
            ]
        },
        faq: [
            { q: "¿Es realmente gratis?", a: "El análisis básico es 100% gratuito. El reporte detallado es Pro." }
        ],
        cta: {
            title: "¿Tu perfil vende o espanta?",
            subtitle: "Descúbrelo en 30 segundos.",
            buttonText: "Escanear Perfil Ahora",
            link: "/tools/profile-auditor"
        }
    },
    "employment-insight": {
        slug: "employment-insight",
        hero: {
            badge: "EMPLOYMENT INSIGHT",
            title: "Consigue el Trabajo de tus Sueños con IA",
            subtitle: "Deja de enviar cientos de CVs al vacío. Nuestra IA optimiza tu hoja de vida para vencer a los ATS y te conecta con las ofertas donde eres el candidato ideal.",
            cta: "Analizar mi CV Gratis",
            image: "ResumeScannerMockup"
        },
        problem: {
            title: "¿Cansado de que te ignoren?",
            cards: [
                { icon: XCircle, title: "Filtros ATS", text: "El 75% de los CVs son descartados por robots antes de que un humano los lea." },
                { icon: Target, title: "Aplicaciones Genéricas", text: "Enviar el mismo CV a todas partes ya no funciona en 2026." },
                { icon: HelpCircle, title: "Falta de Feedback", text: "Nunca sabes por qué te rechazaron o qué habilidad te faltó." }
            ]
        },
        solution: {
            title: "Tu Coach de Carrera Personal",
            subtitle: "Tecnología de reclutamiento de élite, ahora de tu lado.",
            blocks: [
                {
                    title: "Escáner de CV vs Oferta",
                    description: "Sube tu CV y la descripción del puesto. Nuestra IA simula el sistema ATS de la empresa y te dice exactamente qué palabras clave te faltan para pasar el filtro.",
                    image: "ResumeScannerMockup",
                    imagePosition: "right"
                },
                {
                    title: "Match de Empleo Inteligente",
                    description: "No pierdas tiempo en roles donde no encajas. Nuestro algoritmo analiza tus habilidades reales y te muestra solo las ofertas donde estás en el top 10% de candidatos.",
                    image: "JobMatcherMockup",
                    imagePosition: "left"
                }
            ]
        },
        useCases: {
            title: "Indispensable para...",
            cases: [
                { title: "Buscadores Activos", description: "Multiplica x3 tus entrevistas optimizando cada aplicación.", icon: Search },
                { title: "Career Switchers", description: "Traduce tu experiencia previa al lenguaje de tu nueva industria.", icon: RefreshCw },
                { title: "Altos Perfiles", description: "Asegura roles senior alineando tu CV con las expectativas del mercado.", icon: Briefcase }
            ]
        },
        faq: [
            { q: "¿Garantizan que conseguiré empleo?", a: "No, pero maximizamos tus probabilidades al asegurarnos de que tu CV sea leído por humanos." },
            { q: "¿Es seguro subir mis datos?", a: "Absolutamente. Tu CV se procesa de forma privada y no se comparte con terceros." }
        ],
        cta: {
            title: "Tu próxima oferta te espera",
            subtitle: "No dejes que un mal formato te cierre puertas.",
            buttonText: "Optimizar CV Ahora",
            link: "/employment-insight"
        }
    },
    "insight-responder": {
        slug: "insight-responder",
        hero: {
            badge: "ENGAGEMENT INTELIGENTE",
            title: "Comenta como un Experto, a Escala",
            subtitle: "El crecimiento no solo viene de publicar. Viene de interactuar. Genera comentarios perspicaces y valiosos en segundos para atraer a tu audiencia ideal.",
            cta: "Empezar a Interactuar",
            image: "CommentAnalysisMockup"
        },
        problem: {
            title: "Comentar es un trabajo a tiempo completo",
            cards: [
                { icon: MessageSquare, title: "Mente en Blanco", text: "Te pasas 10 minutos mirando un post sin saber qué aportar." },
                { icon: Clock, title: "Ineficiencia Total", text: "Leer, pensar y escribir una respuesta de valor te roba horas productivas." },
                { icon: Zap, title: "Comentarios 'Bot'", text: "'¡Buen post!' no te va a conseguir seguidores ni respeto." }
            ]
        },
        solution: {
            title: "Networking a la velocidad de la luz",
            subtitle: "Sé la persona más interesante de la sala, sin el esfuerzo.",
            blocks: [
                {
                    title: "Análisis de Contexto Profundo",
                    description: "Nuestra IA lee el post completo, detecta el tono, el tema y el sentimiento para sugerirte ángulos de respuesta que demuestran que realmente leíste el contenido.",
                    image: "CommentAnalysisMockup",
                    imagePosition: "right"
                },
                {
                    title: "Respuestas con Personalidad",
                    description: "Elige tu estrategia: ¿Quieres estar de acuerdo? ¿Hacer una pregunta socrática? ¿Debatir respetuosamente? Kolink redacta el borrador perfecto en tu propia voz.",
                    image: "ReplyGeneratorMockup",
                    imagePosition: "left"
                }
            ]
        },
        useCases: {
            title: "Perfecto para...",
            cases: [
                { title: "Estrategia '$1.80'", description: "Comenta en 90 posts al día sin quemarte ni perder calidad.", icon: Zap },
                { title: "Networking", description: "Conecta con líderes de la industria aportando valor real en sus conversaciones.", icon: Users },
                { title: "Venta Social", description: "Inicia conversaciones calientes en los comentarios que terminan en DMs.", icon: DollarSign }
            ]
        },
        faq: [
            { q: "¿Pareceré un robot?", a: "No. Kolink genera borradores que tú apruebas y editas. La idea es saltarse el bloqueo, no la humanidad." },
            { q: "¿Funciona en cualquier idioma?", a: "Sí, detecta el idioma del post y responde en el mismo idioma automáticamente." }
        ],
        cta: {
            title: "Domina la sección de comentarios",
            subtitle: "Atrae miradas a tu perfil con cada interacción.",
            buttonText: "Probar Insight Responder",
            link: "/login"
        }
    },
    "ideas": {
        slug: "ideas",
        hero: {
            badge: "GENERADOR DE IDEAS",
            title: "Nunca más te quedes sin Ideas",
            subtitle: "Una fuente inagotable de inspiración basada en noticias de tu industria, tendencias virales y marcos de contenido probados.",
            cta: "Generar 50 Ideas",
            image: "IdeaDeckMockup"
        },
        problem: {
            title: "El bloqueo creativo es costoso",
            cards: [
                { icon: HelpCircle, title: "¿De qué hablo hoy?", text: "Mirar una pantalla en blanco cada mañana drena tu energía mental." },
                { icon: Rocket, title: "Contenido Aburrido", text: "Acabas repitiendo lo mismo que todos los demás porque es lo fácil." },
                { icon: TrendingUp, title: "Llegar Tarde", text: "Te enteras de las tendencias cuando ya pasaron de moda." }
            ]
        },
        solution: {
            title: "Musas Digitales a Demanda",
            subtitle: "Inspiración personalizada, no aleatoria.",
            blocks: [
                {
                    title: "Newsjacking Automático",
                    description: "Kolink monitorea noticias de tu sector y te sugiere cómo opinar sobre ellas para surfear la ola de la tendencia mientras está caliente.",
                    image: "TrendSpotterMockup",
                    imagePosition: "right"
                },
                {
                    title: "Baraja de Ideas Infinitas",
                    description: "Si no te gusta una idea, desliza. Nuestra IA aprende de lo que rechazas y afina lo que te sugiere hasta que tu calendario esté lleno.",
                    image: "IdeaDeckMockup",
                    imagePosition: "left"
                }
            ]
        },
        useCases: {
            title: "Útil para...",
            cases: [
                { title: "Creadores Diarios", description: "Llena tu calendario editorial de un mes en 30 minutos.", icon: Rocket },
                { title: "Marcas Personales", description: "Posiciónate como líder de opinión comentando noticias actuales.", icon: Briefcase },
                { title: "Content Managers", description: "Gestiona múltiples clientes sin quedarte sin ángulos creativos.", icon: Users }
            ]
        },
        faq: [],
        cta: {
            title: "Adiós al bloqueo",
            subtitle: "Ten siempre algo interesante que decir.",
            buttonText: "Ver mis Ideas",
            link: "/login"
        }
    },

    // --- SOLUTIONS ---
    "agentes-inmobiliarios": {
        slug: "agentes-inmobiliarios",
        hero: {
            badge: "SOLUCIÓN PARA REAL ESTATE",
            title: "Vende propiedades con tu Marca Personal",
            subtitle: "Los agentes que publican en LinkedIn venden un 40% más rápido. Automatiza tus listings y consejos de mercado.",
            cta: "Ver Demo Inmobiliaria",
            image: "/screenshots/real-estate-hero.png"
        },
        problem: {
            title: "El mercado está saturado",
            cards: [
                { icon: Building2, title: "Ruido ensordecedor", text: "Todos publican las mismas fotos de casas." },
                { icon: Users, title: "Falta de confianza", text: "Los clientes eligen al experto que conocen y confían." }
            ]
        },        solution: {
            title: "De Vendedor a Asesor de Confianza",
            subtitle: "Posiciónate como el experto local.",
            blocks: [
                {
                    title: "Carruseles de Propiedades",
                    description: "Convierte un listing de Idealista en un carrusel educativo sobre '5 cosas que buscar en un ático' o 'Análisis del mercado en Madrid'.",
                    image: "/screenshots/real-estate-carousel.png",
                    imagePosition: "right"
                }
            ]
        },
        useCases: {
            title: "Resultados",
            cases: [
                { title: "Captación", description: "Atrae propietarios que quieren vender.", icon: Target }
            ]
        },
        faq: [],
        cta: { title: "Lidera tu mercado local", subtitle: "Empieza a construir tu imperio digital.", buttonText: "Empezar Gratis", link: "/login" }
    },
    "fundadores-saas": {
        slug: "fundadores-saas",
        hero: {
            badge: "SOLUCIÓN PARA SAAS",
            title: "Build in Public sin perder el foco",
            subtitle: "Comparte tu viaje de fundador, atrae inversores y consigue early adopters. Todo mientras sigues programando.",
            cta: "Empezar Growth Hacking",
            image: "/screenshots/saas-hero.png"
        },
        problem: { title: "Codear o Marketing?", cards: [{ icon: Clock, title: "No hay tiempo", text: "El producto requiere 110% de tu atención." }] },
        solution: { title: "Marketing de Fundador Automatizado", subtitle: "Tu historia es tu mejor activo de ventas.", blocks: [{ title: "Narrativa de Startup", description: "Transforma tus commits de Git y updates de producto en historias emocionantes sobre los desafíos de emprender.", image: "/screenshots/saas-story.png", imagePosition: "right" }] },
        useCases: { title: "Impacto", cases: [{ title: "Inversión", description: "Los VCs viven en LinkedIn.", icon: DollarSign }] },
        faq: [],
        cta: { title: "Escala tu MRR", subtitle: "El marketing orgánico tiene el CAC más bajo.", buttonText: "Unirse a Kolink", link: "/login" }
    },
    // Generic filler for others to save space, but strictly following schema
    "abogados-y-legal": { slug: "abogados-y-legal", hero: { badge: "LEGAL", title: "Autoridad Legal en LinkedIn", subtitle: "Atrae clientes corporativos demostrando tu expertise.", cta: "Empezar", image: "/screenshots/legal-hero.png" }, problem: { title: "Confianza", cards: [] }, solution: { title: "Liderazgo de Pensamiento", subtitle: "", blocks: [] }, useCases: { title: "", cases: [] }, faq: [], cta: { title: "Empieza hoy", subtitle: "", buttonText: "Prueba Gratis", link: "/login" } },
    "especialistas-marketing": { slug: "especialistas-marketing", hero: { badge: "MARKETING", title: "Domina el Marketing B2B", subtitle: "Demuestra que sabes de lo que hablas con contenido de vanguardia.", cta: "Empezar", image: "/screenshots/marketing-hero.png" }, problem: { title: "Ruido", cards: [] }, solution: { title: "Contenido que Convierte", subtitle: "", blocks: [] }, useCases: { title: "", cases: [] }, faq: [], cta: { title: "Mejora tu Agencia", subtitle: "", buttonText: "Prueba Gratis", link: "/login" } },
    "doctores-y-salud": { slug: "doctores-y-salud", hero: { badge: "SALUD", title: "Educa a tus Pacientes", subtitle: "Construye una práctica privada próspera basada en la confianza.", cta: "Empezar", image: "/screenshots/health-hero.png" }, problem: { title: "Desinformación", cards: [] }, solution: { title: "Divulgación Médica Simple", subtitle: "", blocks: [] }, useCases: { title: "", cases: [] }, faq: [], cta: { title: "Crece tu consulta", subtitle: "", buttonText: "Prueba Gratis", link: "/login" } },

    // --- RESOURCES ---

    "help-center": { 
        slug: "help-center", 
        hero: { 
            badge: "CENTRO DE AYUDA", 
            title: "Toda la potencia de Kolink a tu alcance", 
            subtitle: "Tutoriales detallados, guías de configuración y mejores prácticas para que aproveches cada crédito al máximo.", 
            cta: "Explorar Guías", 
            image: "PostEditorMockup" 
        }, 
        problem: { 
            title: "¿Necesitas ayuda?", 
            cards: [
                { icon: HelpCircle, title: "Primeros Pasos", text: "¿Acabas de llegar? Te enseñamos cómo configurar tu perfil y crear tu primer post en 2 minutos." },
                { icon: Zap, title: "Optimización de IA", text: "Aprende a dar mejores prompts a Nexus para que el contenido suene exactamente como tú." },
                { icon: Shield, title: "Seguridad y Cuentas", text: "Todo sobre la seguridad de tu cuenta, suscripciones y facturación." }
            ] 
        }, 
        solution: { 
            title: "Soporte diseñado para Creadores", 
            subtitle: "Menos tiempo configurando, más tiempo creando.", 
            blocks: [
                {
                    title: "Video Tutoriales Paso a Paso",
                    description: "Nuestra librería de videos te guía visualmente por cada funcionalidad, desde el Carousel Studio hasta el sistema AutoPilot.",
                    image: "CarouselEditorMockup",
                    imagePosition: "right"
                }
            ] 
        }, 
        useCases: { 
            title: "Tópicos Populares", 
            cases: [
                { title: "Configuración Nexus", description: "Cómo entrenar a la IA con tu Brand Voice única.", icon: BrainCircuit },
                { title: "Gestión de Créditos", description: "Entiende cómo funcionan los créditos y cómo renovarlos.", icon: CreditCard },
                { title: "Exportación Pro", description: "Cómo descargar tus carruseles en máxima calidad para LinkedIn.", icon: Layout }
            ] 
        }, 
        faq: [
            { q: "¿Tienen chat en vivo?", a: "Sí, los usuarios de planes Pro tienen acceso a soporte prioritario vía chat." }
        ], 
        cta: { title: "¿Aún tienes dudas?", subtitle: "Nuestro equipo de expertos está listo para ayudarte.", buttonText: "Contactar Soporte", link: "mailto:support@kolink.ai" } 
    },
    "video-demo": { 
        slug: "video-demo", 
        hero: { 
            badge: "KOLINK EN VIVO", 
            title: "Mira cómo Transformamos tu LinkedIn", 
            subtitle: "Un recorrido completo por la plataforma. Mira cómo pasamos de una idea simple a un post viral y un carrusel de 10 páginas en minutos.", 
            cta: "Ver Demo Completa", 
            image: "RealPreviewMockup" 
        }, 
        problem: { 
            title: "Ver para Creer", 
            cards: [
                { icon: PlayCircle, title: "Flujo Real", text: "Cero humo. Mostramos el dashboard real, la velocidad de la IA y la facilidad del editor." },
                { icon: Sparkles, title: "Resultados", text: "Mira la calidad del contenido que Nexus genera y cómo se ve en la vista previa oficial." }
            ] 
        }, 
        solution: { 
            title: "Un día en la vida de un Top Creator", 
            subtitle: "Kolink no es solo una herramienta, es tu equipo de contenido.", 
            blocks: [
                {
                    title: "Creación Multimodal",
                    description: "En el video verás cómo Nexus puede redactar un post y luego derivar un carrusel completo de ese mismo contenido con un clic.",
                    image: "AIContentMockup",
                    imagePosition: "right"
                }
            ] 
        }, 
        useCases: { 
            title: "Qué verás en la Demo", 
            cases: [
                { title: "Escritura con IA", description: "Nexus redactando ganchos que no se pueden ignorar.", icon: Zap },
                { title: "Diseño de Carruseles", description: "Personalizando colores y logos de marca al instante.", icon: Palette },
                { title: "Programación Smart", description: "Cómo el AutoPilot decide la mejor hora para ti.", icon: Clock }
            ] 
        }, 
        faq: [], 
        cta: { title: "¿Listo para ser el próximo?", subtitle: "Únete a los +2,000 profesionales que usan Kolink a diario.", buttonText: "Empezar Gratis Ahora", link: "/login" } 
    },
    "common-faq": { 
        slug: "common-faq", 
        hero: { 
            badge: "TE RESPONDEMOS TODO", 
            title: "Transparencia desde el día uno", 
            subtitle: "Todo lo que necesitas saber antes de dar el salto a Kolink. Sin letras pequeñas, solo respuestas claras.", 
            cta: "Ver Todas las Preguntas", 
            image: "IdeaDeckMockup" 
        }, 
        problem: { 
            title: "Tus dudas, resueltas", 
            cards: [
                { icon: Info, title: "Precios y Planes", text: "¿Qué incluye cada plan? ¿Hay permanencia? Resolvemos tus dudas financieras." },
                { icon: Shield, title: "Privacidad y Datos", text: "¿Qué pasa con mi contenido? ¿Usan mis datos para entrenar otros modelos?" },
                { icon: Zap, title: "Tecnología IA", text: "¿Qué modelos usan? ¿ Nexus es realmente diferente a ChatGPT?" }
            ] 
        }, 
        solution: { 
            title: "Sin Misterios", 
            subtitle: "Queremos que te sientas seguro usando Kolink.", 
            blocks: [
                {
                    title: "Compromiso de Privacidad",
                    description: "Tu contenido es solo tuyo. Kolink cumple con la RGPD y no compartimos tus datos ni borradores con terceros.",
                    image: "SmartQueueMockup",
                    imagePosition: "right"
                }
            ] 
        }, 
        useCases: { 
            title: "Preguntas por Categoría", 
            cases: [
                { title: "Suscripciones", description: "Mejoras de plan, cancelaciones y reembolsos.", icon: CreditCard },
                { title: "Funcionalidades", description: "Detalles sobre el uso de créditos y Nexus.", icon: Zap },
                { title: "Seguridad", description: "Protección de cuenta y API de LinkedIn.", icon: Shield }
            ] 
        }, 
        faq: [ 
            {q: "¿Puedo cancelar en cualquier momento?", a: "Sí, todas nuestras suscripciones son sin permanencia. Puedes cancelar con un solo clic desde tu configuración."},
            {q: "¿Nexus sabe quién soy?", a: "Nexus aprende de tu 'Brand Voice' y 'Behavioral DNA' que configuras al inicio para que el contenido sea 100% tú."},
            {q: "¿Es seguro para mi cuenta de LinkedIn?", a: "Totalmente. Cumplimos con todas las normativas de la API oficial de LinkedIn para garantizar la seguridad de tu perfil."}
        ], 
        cta: { title: "¿Más dudas?", subtitle: "Si no encontraste lo que buscabas, escríbenos directamente.", buttonText: "Contactar por Email", link: "mailto:info@kolink.ai" } 
    },

    // --- COMPANY ---
    "pricing": { slug: "pricing", hero: { badge: "PRECIOS", title: "Inversión Rentable", subtitle: "Planes diseñados para pagarse solos con tu primer cliente.", cta: "Ver Planes", image: "/screenshots/pricing-hero.png" }, problem: { title: "Caro vs Costoso", cards: [] }, solution: { title: "ROI Inmediato", subtitle: "", blocks: [] }, useCases: { title: "", cases: [] }, faq: [], cta: { title: "Elige tu plan", subtitle: "", buttonText: "Empezar", link: "/#pricing" } },
    "affiliate": { slug: "affiliate", hero: { badge: "PARTNERS", title: "Programa de Afiliados", subtitle: "Gana un 30% recurrente por cada usuario que refieras.", cta: "Unirse al Programa", image: "/screenshots/affiliate-hero.png" }, problem: { title: "Ingresos Pasivos", cards: [] }, solution: { title: "Gana con nosotros", subtitle: "", blocks: [] }, useCases: { title: "", cases: [] }, faq: [], cta: { title: "Empieza a recomendar", subtitle: "", buttonText: "Unirse ahora", link: "mailto:partners@kolink.ai" } },
};
