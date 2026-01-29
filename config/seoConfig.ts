export const ROLES = [
  // Real Estate
  { id: 'real-estate-agent', slug: 'inmobiliaria', name: 'Agentes Inmobiliarios', painPoints: ['falta de tiempo', 'visibilidad de propiedades', 'construcción de marca'] },
  { id: 'real-estate-dev', slug: 'desarrolladores', name: 'Desarrolladores Inmobiliarios', painPoints: ['relación con inversores', 'escaparate de proyectos', 'autoridad de mercado'] },
  
  // Leadership & Execs
  { id: 'ceo', slug: 'ceos', name: 'CEOs y Fundadores', painPoints: ['liderazgo de pensamiento', 'reclutamiento de talento', 'cultura corporativa'] },
  { id: 'cto', slug: 'ctos', name: 'CTOs y Tech Leads', painPoints: ['contratación técnica', 'insights de arquitectura', 'innovación tecnológica'] },
  { id: 'cmo', slug: 'cmos', name: 'Directores de Marketing (CMOs)', painPoints: ['ROI de marketing', 'tendencias digitales', 'posicionamiento de marca'] },
  { id: 'cfo', slug: 'cfos', name: 'Directores Financieros (CFOs)', painPoints: ['estrategia financiera', 'gestión de riesgos', 'comunicación con stakeholders'] },

  // Sales & Business Development
  { id: 'sales-rep', slug: 'ventas', name: 'Representantes de Ventas', painPoints: ['generación de leads', 'social selling', 'networking'] },
  { id: 'biz-dev', slug: 'desarrollo-negocio', name: 'Gerentes de Desarrollo de Negocio', painPoints: ['alianzas estratégicas', 'apertura de mercados', 'networking ejecutivo'] },
  { id: 'account-mgr', slug: 'account-managers', name: 'Key Account Managers', painPoints: ['retención de clientes', 'upselling', 'relacionamiento a largo plazo'] },

  // Advanced Tech & Data
  { id: 'ai-eng', slug: 'ingenieros-ia', name: 'Ingenieros de IA', painPoints: ['explicar modelos complejos', 'ética en IA', 'ritmo de innovación'] },
  { id: 'cloud-architect', slug: 'arquitectos-cloud', name: 'Arquitectos Cloud', painPoints: ['costos de nube', 'migraciones complejas', 'seguridad híbrida'] },
  { id: 'cyber-analyst', slug: 'analistas-ciberseguridad', name: 'Analistas de Ciberseguridad', painPoints: ['fatiga de alertas', 'amenazas zero-day', 'concienciación de usuarios'] },
  { id: 'sre', slug: 'sre-engineers', name: 'Site Reliability Engineers (SRE)', painPoints: ['gestión de incidentes', 'SLOs/SLAs', 'toil reduction'] },
  { id: 'embedded-eng', slug: 'ingenieros-embebidos', name: 'Ingenieros de Sistemas Embebidos', painPoints: ['restricciones de hardware', 'debugging complejo', 'iot security'] },
  { id: 'game-designer', slug: 'game-designers', name: 'Diseñadores de Videojuegos', painPoints: ['mecánicas vs narrativa', 'retención de jugadores', 'monetización ética'] },

  // Specialized Healthcare
  { id: 'surgeon', slug: 'cirujanos', name: 'Cirujanos', painPoints: ['presión extrema', 'educación continua', 'gestión de expectativas'] },
  { id: 'dermatologist', slug: 'dermatologos', name: 'Dermatólogos', painPoints: ['mitos de skincare', 'diagnóstico visual', 'marketing estético'] },
  { id: 'chiropractor', slug: 'quiropracticos', name: 'Quiroprácticos', painPoints: ['educación postural', 'retención de pacientes', 'desconfianza médica'] },
  { id: 'physiotherapist', slug: 'fisioterapeutas', name: 'Fisioterapeutas', painPoints: ['adherencia al ejercicio', 'manejo del dolor', 'rehabilitación lenta'] },
  { id: 'speech-therapist', slug: 'logopedas', name: 'Logopedas', painPoints: ['participación familiar', 'recursos limitados', 'telepráctica'] },
  { id: 'occupational-therapist', slug: 'terapeutas-ocupacionales', name: 'Terapeutas Ocupacionales', painPoints: ['adaptación del entorno', 'independencia del paciente', 'burocracia'] },

  // Finance & Corporate
  { id: 'investment-banker', slug: 'banqueros-inversion', name: 'Banqueros de Inversión', painPoints: ['horas interminables', 'presión de deals', 'competencia feroz'] },
  { id: 'auditor', slug: 'auditores', name: 'Auditores', painPoints: ['temporada alta', 'compliance estricto', 'viajes constantes'] },
  { id: 'actuary', slug: 'actuarios', name: 'Actuarios', painPoints: ['explicar riesgos', 'modelado complejo', 'certificaciones difíciles'] },
  { id: 'risk-mgr', slug: 'gestores-riesgos', name: 'Gestores de Riesgos', painPoints: ['cisnes negros', 'cultura de riesgo', 'regulación bancaria'] },
  { id: 'procurement', slug: 'compradores-corporativos', name: 'Gerentes de Compras', painPoints: ['cadena de suministro', 'negociación dura', 'ahorro de costes'] },
  { id: 'sustainability', slug: 'consultores-sostenibilidad', name: 'Consultores de Sostenibilidad', painPoints: ['greenwashing', 'medición de impacto', 'cambio cultural'] },
  
  // Creative & Media
  { id: 'journalist', slug: 'periodistas', name: 'Periodistas', painPoints: ['fake news', 'plazos inminentes', 'clickbait vs calidad'] },
  { id: 'film-producer', slug: 'productores-cine', name: 'Productores de Cine', painPoints: ['financiación', 'logística de rodaje', 'distribución'] },
  { id: 'musician', slug: 'musicos', name: 'Músicos Profesionales', painPoints: ['monetización streaming', 'promoción', 'salud mental'] },
  { id: 'ux-writer', slug: 'ux-writers', name: 'UX Writers', painPoints: ['falta de contexto', 'lorem ipsum', 'tono de voz'] },
  { id: 'fashion-designer', slug: 'disenadores-moda', name: 'Diseñadores de Moda', painPoints: ['ciclos rápidos', 'sostenibilidad', 'producción ética'] },
  { id: 'animator', slug: 'animadores-3d', name: 'Animadores 3D', painPoints: ['tiempos de render', 'curvas de aprendizaje', 'feedback frame a frame'] },

  // Education & Research
  { id: 'phd-candidate', slug: 'candidatos-phd', name: 'Candidatos a PhD', painPoints: ['síndrome del impostor', 'publicación', 'financiamiento'] },
  { id: 'research-scientist', slug: 'cientificos-investigadores', name: 'Científicos Investigadores', painPoints: ['obtención de grants', 'reproducibilidad', 'burocracia lab'] },
  { id: 'dean', slug: 'decanos-universidad', name: 'Decanos Universitarios', painPoints: ['presupuestos decrecientes', 'política académica', 'captación alumnos'] },
  { id: 'school-principal', slug: 'directores-colegio', name: 'Directores de Colegio', painPoints: ['relación con padres', 'seguridad escolar', 'currículo'] },

  // Specialized Consulting
  { id: 'agile-coach', slug: 'agile-coaches', name: 'Agile Coaches', painPoints: ['resistencia al cambio', 'teatro ágil', 'medición de valor'] },
  { id: 'diversity-officer', slug: 'directores-diversidad', name: 'Directores de Diversidad (DEI)', painPoints: ['cambio sistémico', 'medición de inclusión', 'conversaciones difíciles'] },
  { id: 'franchise-owner', slug: 'duenos-franquicias', name: 'Dueños de Franquicias', painPoints: ['reglas corporativas', 'contratación local', 'márgenes ajustados'] },
  { id: 'nonprofit-dir', slug: 'directores-ong', name: 'Directores de ONGs', painPoints: ['fundraising constante', 'retención voluntarios', 'medir impacto social'] },

  // Real Estate & Architecture Niche
  { id: 'landscape-arch', slug: 'paisajistas', name: 'Arquitectos Paisajistas', painPoints: ['cambio climático', 'mantenimiento', 'presupuesto vs visión'] },
  { id: 'urban-planner', slug: 'planificadores-urbanos', name: 'Planificadores Urbanos', painPoints: ['política local', 'gentrificación', 'movilidad sostenible'] },
  { id: 'staging-expert', slug: 'home-stagers', name: 'Expertos en Home Staging', painPoints: ['convencer vendedores', 'inventario muebles', 'fotografía'] },

  // Events & Hospitality
  { id: 'wedding-planner', slug: 'wedding-planners', name: 'Wedding Planners', painPoints: ['novias estresadas', 'proveedores tarde', 'detalles infinitos'] },
  { id: 'hotel-manager', slug: 'gerentes-hotel', name: 'Gerentes de Hotel', painPoints: ['reviews en TripAdvisor', 'rotación personal', 'ocupación baja'] },
  { id: 'tour-guide', slug: 'guias-turisticos', name: 'Guías Turísticos', painPoints: ['grupos difíciles', 'clima impredecible', 'historia repetitiva'] },

  // Skilled Trades (Business Owners)
  { id: 'contractor', slug: 'contratistas-generales', name: 'Contratistas Generales', painPoints: ['subcontratistas', 'precios materiales', 'retrasos obra'] },
  { id: 'solar-installer', slug: 'instaladores-solares', name: 'Empresas de Energía Solar', painPoints: ['permisos locales', 'educación cliente', 'retorno inversión'] },
  
  // Legal Niche
  { id: 'legal-tech', slug: 'consultores-legaltech', name: 'Consultores LegalTech', painPoints: ['adopción tecnología', 'seguridad datos', 'mentalidad tradicional'] },
  { id: 'mediator', slug: 'mediadores-conflicto', name: 'Mediadores de Conflictos', painPoints: ['neutralidad', 'emociones altas', 'acuerdos duraderos'] },

  // Marketing Niche
  { id: 'email-marketer', slug: 'email-marketers', name: 'Email Marketers', painPoints: ['entregabilidad', 'filtros spam', 'creatividad asuntos'] },
  { id: 'cro-specialist', slug: 'especialistas-cro', name: 'Especialistas CRO', painPoints: ['significancia estadística', 'hipótesis fallidas', 'buy-in directivo'] },
  { id: 'pr-specialist', slug: 'especialistas-pr', name: 'Relaciones Públicas', painPoints: ['crisis reputación', 'cobertura mediática', 'medir valor PR'] },
  { id: 'influencer', slug: 'creadores-contenido', name: 'Creadores de Contenido', painPoints: ['algoritmo inestable', 'monetización', 'hate online'] },
  
  // NEW BATCH - 15 More
  { id: 'translator', slug: 'traductores-jurados', name: 'Traductores Jurados', painPoints: ['plazos urgentes', 'terminología exacta', 'precios bajos'] },
  { id: 'video-producer', slug: 'productores-video', name: 'Productores de Video', painPoints: ['gestión clientes', 'equipos caros', 'creatividad'] },
  { id: 'sound-engineer', slug: 'ingenieros-sonido', name: 'Ingenieros de Sonido', painPoints: ['acústica', 'clientes difíciles', 'plazos'] },
  { id: 'makeup-artist', slug: 'maquilladores-pro', name: 'Maquilladores Profesionales', painPoints: ['higiene', 'horarios', 'marketing'] },
  { id: 'fashion-stylist', slug: 'estilistas-moda', name: 'Estilistas de Moda', painPoints: ['presupuesto', 'devoluciones', 'tendencias'] },
  { id: 'interior-decorator', slug: 'decoradores-interiores', name: 'Decoradores', painPoints: ['gustos cliente', 'presupuesto', 'proveedores'] },
  { id: 'landscape-designer', slug: 'disenadores-jardines', name: 'Diseñadores de Jardines', painPoints: ['clima', 'mantenimiento', 'plagas'] },
  { id: 'florist', slug: 'floristas', name: 'Floristas', painPoints: ['perecederos', 'entregas', 'madrugones'] },
  { id: 'baker', slug: 'pasteleros', name: 'Pasteleros Artesanales', painPoints: ['madrugones', 'márgenes', 'competencia industrial'] },
  { id: 'brewer', slug: 'cerveceros-artesanales', name: 'Cerveceros Artesanales', painPoints: ['distribución', 'calidad lote', 'impuestos'] },
  { id: 'winemaker', slug: 'enologos', name: 'Enólogos y Bodegueros', painPoints: ['clima', 'exportación', 'marketing vino'] },
  { id: 'farmer', slug: 'agricultores-modernos', name: 'Agricultores Modernos', painPoints: ['clima', 'precios mercado', 'tecnología'] },
  { id: 'pilot', slug: 'pilotos-comerciales', name: 'Pilotos Comerciales', painPoints: ['jetlag', 'exámenes médicos', 'estabilidad'] },
  { id: 'flight-attendant', slug: 'tripulantes-cabina', name: 'Tripulantes de Cabina', painPoints: ['pasajeros difíciles', 'horarios', 'salud'] },
  { id: 'logistics-coord', slug: 'coordinadores-logistica', name: 'Coordinadores Logísticos', painPoints: ['retrasos', 'aduanas', 'costos'] },

  // Creative & Design
  { id: 'copywriter', slug: 'copywriters', name: 'Copywriters', painPoints: ['bloqueo del escritor', 'clientes exigentes', 'valorar su trabajo'] },
  { id: 'social-media-mgr', slug: 'social-media-managers', name: 'Social Media Managers', painPoints: ['cambios de algoritmo', 'burnout creativo', 'demostrar ROI'] },
  { id: 'designer', slug: 'disenadores', name: 'Diseñadores UX/UI', painPoints: ['feedback subjetivo', 'consistencia de diseño', 'handover a desarrollo'] },
  { id: 'video-editor', slug: 'editores-video', name: 'Editores de Video', painPoints: ['tiempos de renderizado', 'gestión de archivos', 'narrativa visual'] },
  { id: 'photographer', slug: 'fotografos', name: 'Fotógrafos Profesionales', painPoints: ['edición interminable', 'gestión de clientes', 'marketing personal'] },
  { id: 'architect', slug: 'arquitectos', name: 'Arquitectos', painPoints: ['normativas urbanas', 'presupuestos ajustados', 'gestión de obra'] },
  { id: 'interior-designer', slug: 'disenadores-interiores', name: 'Diseñadores de Interiores', painPoints: ['proveedores difíciles', 'visualización 3D', 'expectativas del cliente'] },
  { id: 'art-director', slug: 'directores-arte', name: 'Directores de Arte', painPoints: ['gestión de equipos creativos', 'visión cohesiva', 'presión de plazos'] },

  // Business & Operations
  { id: 'project-mgr', slug: 'project-managers', name: 'Project Managers', painPoints: ['scope creep', 'gestión de recursos', 'comunicación efectiva'] },
  { id: 'biz-analyst', slug: 'analistas-negocio', name: 'Analistas de Negocio', painPoints: ['requisitos ambiguos', 'gestión del cambio', 'puente negocio-técnico'] },
  { id: 'ops-manager', slug: 'gerentes-operaciones', name: 'Gerentes de Operaciones', painPoints: ['eficiencia de procesos', 'reducción de costes', 'logística compleja'] },
  { id: 'supply-chain', slug: 'supply-chain-managers', name: 'Gerentes de Cadena de Suministro', painPoints: ['interrupciones globales', 'inventario óptimo', 'negociación proveedores'] },
  { id: 'hr-manager', slug: 'gerentes-recursos-humanos', name: 'Gerentes de RRHH', painPoints: ['retención de talento', 'clima laboral', 'cumplimiento legal'] },
  { id: 'exec-assistant', slug: 'asistentes-ejecutivos', name: 'Asistentes Ejecutivos', painPoints: ['gestión de agenda', 'priorización extrema', 'confidencialidad'] },
  { id: 'compliance', slug: 'compliance-officers', name: 'Oficiales de Cumplimiento', painPoints: ['regulaciones cambiantes', 'riesgo reputacional', 'auditorías internas'] },

  // Sales & Marketing Expansion
  { id: 'seo-specialist', slug: 'especialistas-seo', name: 'Especialistas SEO', painPoints: ['actualizaciones de Google', 'link building', 'tráfico cualificado'] },
  { id: 'brand-manager', slug: 'brand-managers', name: 'Brand Managers', painPoints: ['consistencia de marca', 'diferenciación', 'lealtad del consumidor'] },
  { id: 'ecommerce-mgr', slug: 'ecommerce-managers', name: 'Gerentes de E-commerce', painPoints: ['tasa de conversión', 'abandono de carrito', 'logística de envíos'] },
  { id: 'affiliate-marketer', slug: 'afiliados', name: 'Marketing de Afiliados', painPoints: ['tráfico de calidad', 'elección de nicho', 'competencia alta'] },
  { id: 'sales-director', slug: 'directores-ventas', name: 'Directores de Ventas', painPoints: ['previsión de ingresos', 'motivación del equipo', 'ciclos de venta largos'] },

  // Health & Wellness
  { id: 'nutritionist', slug: 'nutricionistas', name: 'Nutricionistas', painPoints: ['adherencia del paciente', 'dietas de moda', 'educación nutricional'] },
  { id: 'personaltrainer', slug: 'entrenadores-personales', name: 'Entrenadores Personales', painPoints: ['retención de clientes', 'programación efectiva', 'motivación constante'] },
  { id: 'pharmacist', slug: 'farmaceuticos', name: 'Farmacéuticos', painPoints: ['atención al paciente', 'burocracia', 'gestión de stock'] },
  { id: 'dentist', slug: 'dentistas', name: 'Dentistas', painPoints: ['miedo del paciente', 'marketing de clínica', 'tecnología dental'] },
  { id: 'veterinarian', slug: 'veterinarios', name: 'Veterinarios', painPoints: ['burnout emocional', 'clientes difíciles', 'gestión de emergencias'] },
  { id: 'yoga-instructor', slug: 'instructores-yoga', name: 'Instructores de Yoga', painPoints: ['construir comunidad', 'clases híbridas', 'filosofía vs negocio'] },

  // Legal & Consulting Expansion
  { id: 'tax-advisor', slug: 'asesores-fiscales', name: 'Asesores Fiscales', painPoints: ['temporada de impuestos', 'leyes complejas', 'ahorro para clientes'] },
  { id: 'immigration-lawyer', slug: 'abogados-inmigracion', name: 'Abogados de Inmigración', painPoints: ['burocracia estatal', 'casos urgentes', 'ansiedad del cliente'] },
  { id: 'patent-attorney', slug: 'abogados-patentes', name: 'Abogados de Patentes', painPoints: ['tecnicismo extremo', 'plazos rígidos', 'búsqueda de anterioridad'] },

  // Services & Trades
  { id: 'event-planner', slug: 'organizadores-eventos', name: 'Organizadores de Eventos', painPoints: ['presupuestos', 'proveedores fallidos', 'estrés del día D'] },
  { id: 'travel-agent', slug: 'agentes-viajes', name: 'Agentes de Viajes', painPoints: ['precios volátiles', 'emergencias en viaje', 'personalización'] },
  { id: 'chef', slug: 'chefs', name: 'Chefs y Restauradores', painPoints: ['coste de alimentos', 'gestión de personal', 'críticas online'] },
  { id: 'real-estate-investor', slug: 'inversores-inmobiliarios', name: 'Inversores Inmobiliarios', painPoints: ['encontrar oportunidades', 'financiación', 'gestión de inquilinos'] },

  // Education & Writing
  { id: 'university-prof', slug: 'profesores-universitarios', name: 'Profesores Universitarios', painPoints: ['publicar o perecer', 'burocracia académica', 'engagement estudiantil'] },
  { id: 'online-tutor', slug: 'tutores-online', name: 'Tutores Online', painPoints: ['diferencia horaria', 'herramientas digitales', 'captación de alumnos'] },
  { id: 'freelance-writer', slug: 'escritores-freelance', name: 'Escritores Freelance', painPoints: ['tarifas bajas', 'revisión interminable', 'encontrar nicho'] },
  { id: 'tech-writer', slug: 'escritores-tecnicos', name: 'Escritores Técnicos', painPoints: ['complejidad del tema', 'documentación obsoleta', 'audiencia variada'] },

  // Consultores & Freelancers
  { id: 'coach', slug: 'coaches', name: 'Coaches y Consultores', painPoints: ['adquisición de clientes', 'demostrar experiencia', 'generar confianza'] },
  { id: 'consultant', slug: 'consultores-estrategicos', name: 'Consultores Estratégicos', painPoints: ['liderazgo intelectual', 'casos de éxito', 'networking corporativo'] },
  { id: 'freelancer', slug: 'freelancers', name: 'Freelancers', painPoints: ['flujo de clientes constante', 'marca personal', 'diferenciación'] },

  // HR & Recruiting
  { id: 'recruiter', slug: 'recruiters', name: 'Recruiters y HR', painPoints: ['atracción de candidatos', 'employer branding', 'cultura empresarial'] },
  { id: 'career-coach', slug: 'career-coaches', name: 'Coaches de Carrera', painPoints: ['consejos de empleo', 'optimización de perfiles', 'visibilidad'] },

  // Legal & Finance
  { id: 'lawyer', slug: 'abogados', name: 'Abogados', painPoints: ['explicar leyes complejo', 'generar clientes', 'reputación profesional'] },
  { id: 'finance-advisor', slug: 'asesores-financieros', name: 'Asesores Financieros', painPoints: ['educación financiera', 'confianza del cliente', 'cumplimiento normativo'] },

  // Health & Wellness
  { id: 'doctor', slug: 'doctores', name: 'Doctores y Médicos', painPoints: ['educación al paciente', 'desmentir mitos', 'confianza médica'] },
  { id: 'psychologist', slug: 'psicologos', name: 'Psicólogos', painPoints: ['salud mental', 'bienestar laboral', 'consejos prácticos'] },

  // Education
  { id: 'teacher', slug: 'profesores', name: 'Profesores y Educadores', painPoints: ['innovación educativa', 'recursos para alumnos', 'comunidad académica'] },

  // Otros
  { id: 'job-seeker', slug: 'buscandotrabajo', name: 'Buscadores de Empleo', painPoints: ['visibilidad', 'mostrar habilidades', 'conectar con recruiters'] },
];

export const ACTIONS = [
  { id: 'generate-posts', slug: 'generar-posts-linkedin', name: 'Generador de Posts de LinkedIn', description: 'Crea contenido viral en segundos' },
  { id: 'analyze-profile', slug: 'analisis-perfil-linkedin', name: 'Auditoría de Perfil de LinkedIn', description: 'Optimiza tu perfil para conversiones' },
  { id: 'create-carousels', slug: 'crear-carruseles-pdf', name: 'Creador de Carruseles PDF', description: 'Diseña carruseles educativos visuales' },
  { id: 'viral-hooks', slug: 'ganchos-virales', name: 'Generador de Ganchos Virales', description: 'Captura la atención desde la primera línea' }
];

export const META_TEMPLATES = {
  title: "{Action} para {Role} con IA | KOLINK",
  description: "Descubre la mejor herramienta de IA para {Action} diseñada específicamente para {Role}. Ahorra tiempo y maximiza tu impacto en LinkedIn con KOLINK.",
};
