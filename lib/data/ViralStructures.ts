import { CarouselSlide } from "@/types/carousel";
import { v4 as uuidv4 } from 'uuid';

export interface ViralStructure {
    id: string;
    name: string;
    description: string;
    icon: string; // lucide icon name
    slides: CarouselSlide[];
}

const generateId = () => uuidv4();

export const VIRAL_STRUCTURES: ViralStructure[] = [
    {
        id: 'the_bridge',
        name: 'El Puente (The Bridge)',
        description: 'Lleva a tu audiencia del Dolor A al Placer B.',
        icon: 'Bridge',
        slides: [
            {
                id: generateId(),
                type: 'intro',
                layoutVariant: 'default',
                isVisible: true,
                content: {
                    title: 'Deja de intentar [Método Común]',
                    subtitle: 'Está frenando tu crecimiento',
                    body: 'Te prometieron resultados rápidos, pero la realidad es otra.',
                    cta_text: 'Descubre el cambio ->'
                }
            },
            {
                id: generateId(),
                type: 'content',
                layoutVariant: 'comparison',
                isVisible: true,
                content: {
                    title: 'La Vieja Escuela vs La Nueva Era',
                    body: 'Enviar DMs fríos masivos VS Atraer leads con contenido magnético',
                    subtitle: 'Por qué fallas actualmente'
                }
            },
            {
                id: generateId(),
                type: 'content',
                layoutVariant: 'default',
                isVisible: true,
                content: {
                    title: 'El Problema Invisible',
                    body: 'No es falta de esfuerzo. Es falta de apalancamiento. Estás trabajando duro en la dirección equivocada.',
                    subtitle: 'La fricción'
                }
            },
            {
                id: generateId(),
                type: 'content',
                layoutVariant: 'default',
                isVisible: true,
                content: {
                    title: 'El Cambio de Paradigma',
                    body: 'Lo que necesitas no es más volumen, es más confianza. Aquí es donde construimos "El Puente".',
                    subtitle: 'La Solución'
                }
            },
            {
                id: generateId(),
                type: 'content',
                layoutVariant: 'checklist',
                isVisible: true,
                content: {
                    title: '3 Pasos para Cruzar',
                    body: '1. Audita tu autoridad percibida\n2. Sistematiza tu contenido\n3. Humaniza tu marca',
                    subtitle: 'Tu Plan de Acción'
                }
            },
            {
                id: generateId(),
                type: 'outro',
                layoutVariant: 'default',
                isVisible: true,
                content: {
                    title: '¿Estás listo para cruzar?',
                    body: 'Comenta "PUENTE" y te envío la guía completa.',
                    subtitle: 'Link en Bio',
                    cta_text: 'Te escucho 👇'
                }
            }
        ]
    },
    {
        id: 'negative_list',
        name: 'Lista Negativa',
        description: 'Detén estos errores para crecer más rápido.',
        icon: 'XCircle',
        slides: [
            {
                id: generateId(),
                type: 'intro',
                layoutVariant: 'big-number',
                isVisible: true,
                content: {
                    title: '6',
                    subtitle: 'Cosas que debes DETENER hoy',
                    body: 'Si quieres escalar tu negocio en 2026',
                    cta_text: 'Desliza para ver'
                }
            },
            {
                id: generateId(),
                type: 'content',
                layoutVariant: 'default',
                isVisible: true,
                content: {
                    title: '1. Ignorar los Datos',
                    body: 'Publicar sin analizar es solo adivinar. Si no mides tu CPI (Coste Por Interacción), estás volando a ciegas.',
                    subtitle: 'Error #1'
                }
            },
            {
                id: generateId(),
                type: 'content',
                layoutVariant: 'default',
                isVisible: true,
                content: {
                    title: '2. Diseño Inconsistente',
                    body: 'Tu marca es tu promesa. Si tus visuales son caóticos, la confianza de tu cliente cae en picada.',
                    subtitle: 'Error #2'
                }
            },
            {
                id: generateId(),
                type: 'content',
                layoutVariant: 'default',
                isVisible: true,
                content: {
                    title: '3. Vender antes de dar',
                    body: 'Nadie entra a LinkedIn para ver anuncios. Entran para aprender o entretenerse. Aporta valor primero.',
                    subtitle: 'Error #3'
                }
            },
            {
                id: generateId(),
                type: 'content',
                layoutVariant: 'quote',
                isVisible: true,
                content: {
                    title: 'La Verdad Incómoda',
                    body: 'Los amateurs se centran en la viralidad. Los profesionales se centran en la confianza.',
                    subtitle: 'Recuerda esto'
                }
            },
            {
                id: generateId(),
                type: 'outro',
                layoutVariant: 'default',
                isVisible: true,
                content: {
                    title: '¿Cuál te cuesta más dejar?',
                    body: 'Sé honesto, nadie te juzga aquí.',
                    subtitle: 'Te leo en comentarios',
                    cta_text: 'Sígueme para más'
                }
            }
        ]
    },
    {
        id: 'hero_journey',
        name: 'El Viaje del Héroe',
        description: 'Cuenta una transformación que resuene.',
        icon: 'BookOpen',
        slides: [
            {
                id: generateId(),
                type: 'intro',
                layoutVariant: 'image-full',
                isVisible: true,
                content: {
                    title: 'Cómo pasé de 0 a 10k',
                    subtitle: 'En 90 Días',
                    body: 'Sin gastar un euro en publicidad pagada.',
                    cta_text: 'Mi Historia'
                }
            },
            {
                id: generateId(),
                type: 'content',
                layoutVariant: 'default',
                isVisible: true,
                content: {
                    title: 'El Fondo del Pozo',
                    body: 'Publicaba todos los días pero solo escuchaba grillos. Me sentía invisible. Estuve a punto de rendirme y borrar mi cuenta.',
                    subtitle: 'Día 1'
                }
            },
            {
                id: generateId(),
                type: 'content',
                layoutVariant: 'default',
                isVisible: true,
                content: {
                    title: 'El Momento "Aha!"',
                    body: 'Me di cuenta de que hablaba HACIA la gente, no CON la gente. Cambié una sola cosa en mi estrategia.',
                    subtitle: 'El Giro'
                }
            },
            {
                id: generateId(),
                type: 'content',
                layoutVariant: 'default',
                isVisible: true,
                content: {
                    title: 'La Nueva Estrategia',
                    body: 'Dejé de ser un "experto" inalcanzable y empecé a ser un guía vulnerable. Compartí mis errores, no solo mis éxitos.',
                    subtitle: 'La Ejecución'
                }
            },
            {
                id: generateId(),
                type: 'content',
                layoutVariant: 'big-number',
                isVisible: true,
                content: {
                    title: '10x',
                    subtitle: 'Mi Engagement',
                    body: 'Todo cambió cuando mostré mi humanidad.',
                    cta_text: 'El Resultado'
                }
            },
            {
                id: generateId(),
                type: 'outro',
                layoutVariant: 'default',
                isVisible: true,
                content: {
                    title: 'Escribe tu propia historia.',
                    body: 'Tu vulnerabilidad es tu mayor activo.',
                    subtitle: 'Empieza hoy',
                    cta_text: 'Sigue mi viaje'
                }
            }
        ]
    },
    {
        id: 'step_by_step',
        name: 'Guía Paso a Paso',
        description: 'Tutorial práctico y accionable.',
        icon: 'ListOrdered',
        slides: [
            {
                id: generateId(),
                type: 'intro',
                layoutVariant: 'default',
                isVisible: true,
                content: {
                    title: 'Dominando [Skill] en 4 Pasos',
                    subtitle: 'Guía Definitiva 2026',
                    body: 'Guarda este carrusel, lo necesitarás luego.',
                    cta_text: 'Empezar Tutorial'
                }
            },
            {
                id: generateId(),
                type: 'content',
                layoutVariant: 'default',
                isVisible: true,
                content: {
                    title: 'Paso 1: Fundamentos',
                    body: 'Antes de correr, aprende a caminar. Configura tu entorno de trabajo correctamente para evitar fricción.',
                    subtitle: 'Preparación'
                }
            },
            {
                id: generateId(),
                type: 'content',
                layoutVariant: 'default',
                isVisible: true,
                content: {
                    title: 'Paso 2: La Estrategia',
                    body: 'No improvises. Define tus KPIs y tu público objetivo. ¿A quién quieres ayudar exactamente?',
                    subtitle: 'Planificación'
                }
            },
            {
                id: generateId(),
                type: 'content',
                layoutVariant: 'default',
                isVisible: true,
                content: {
                    title: 'Paso 3: Ejecución Masiva',
                    body: 'La calidad viene de la cantidad. Itera rápido. Falla rápido. Aprende más rápido.',
                    subtitle: 'Acción'
                }
            },
            {
                id: generateId(),
                type: 'content',
                layoutVariant: 'checklist',
                isVisible: true,
                content: {
                    title: 'Checklist Final',
                    body: '✓ Perfil optimizado\n✓ Calendario editorial creado\n✓ 30 minutos de engagement diario\n✓ Análisis semanal de métricas',
                    subtitle: 'Resumen'
                }
            },
            {
                id: generateId(),
                type: 'outro',
                layoutVariant: 'default',
                isVisible: true,
                content: {
                    title: '¿Te ha sido útil?',
                    body: 'Reenvía esto a alguien que necesite claridad.',
                    subtitle: 'Guárdalo para luego 📌',
                    cta_text: 'Sígueme'
                }
            }
        ]
    },
    {
        id: 'myth_buster',
        name: 'Mito vs Verdad',
        description: 'Desmiente creencias limitantes de tu industria.',
        icon: 'Zap',
        slides: [
            {
                id: generateId(),
                type: 'intro',
                layoutVariant: 'default',
                isVisible: true,
                content: {
                    title: 'Mentiras que te han contado sobre [Tema]',
                    subtitle: 'Rompiendo Mitos',
                    body: 'Lo que los "gurus" no quieren que sepas.',
                    cta_text: 'La Verdad ->'
                }
            },
            {
                id: generateId(),
                type: 'content',
                layoutVariant: 'comparison',
                isVisible: true,
                content: {
                    title: 'Mito #1: Necesitas miles de seguidores',
                    body: 'Influencer VS Líder de Opinión',
                    subtitle: 'La Realidad'
                }
            },
            {
                id: generateId(),
                type: 'content',
                layoutVariant: 'default',
                isVisible: true,
                content: {
                    title: 'La Verdad',
                    body: 'Puedes facturar 6 cifras con menos de 2,000 seguidores si son los seguidores CORRECTOS.',
                    subtitle: 'Enfoque en Calidad'
                }
            },
            {
                id: generateId(),
                type: 'content',
                layoutVariant: 'quote',
                isVisible: true,
                content: {
                    title: 'Reflexión',
                    body: 'Los números son vanidad. Las ventas son sanidad.',
                    subtitle: 'Principio Básico'
                }
            },
             {
                id: generateId(),
                type: 'content',
                layoutVariant: 'default',
                isVisible: true,
                content: {
                    title: 'Mito #2: Tienes que estar en todas partes',
                    body: 'Falso. Domina un canal antes de diversificar. La omnicanalidad sin recursos es suicidio.',
                    subtitle: 'Foco Absoluto'
                }
            },
            {
                id: generateId(),
                type: 'outro',
                layoutVariant: 'default',
                isVisible: true,
                content: {
                    title: '¿Qué otro mito conoces?',
                    body: 'Rompamos más creencias en los comentarios.',
                    subtitle: 'Opina abajo',
                    cta_text: 'Debatamos 👇'
                }
            }
        ]
    },
    {
        id: 'contrarian',
        name: 'El Contrarian',
        description: 'Una opinión impopular que polariza.',
        icon: 'AlertTriangle',
        slides: [
            {
                id: generateId(),
                type: 'intro',
                layoutVariant: 'default',
                isVisible: true,
                content: {
                    title: 'Por qué [Tendencia Popular] es una estafa',
                    subtitle: 'Opinión Impopular',
                    body: 'Voy a perder seguidores por decir esto, pero es necesario.',
                    cta_text: 'Leer mi opinión'
                }
            },
            {
                id: generateId(),
                type: 'content',
                layoutVariant: 'default',
                isVisible: true,
                content: {
                    title: 'Todo el mundo lo hace',
                    body: 'Veo a cientos de perfiles repitiendo el mismo consejo genérico como loros. Y nadie obtiene resultados.',
                    subtitle: 'El Rebaño'
                }
            },
            {
                id: generateId(),
                type: 'content',
                layoutVariant: 'default',
                isVisible: true,
                content: {
                    title: 'Por qué no funciona',
                    body: 'Porque carece de contexto. Lo que funciona para una gran corporación mata a una PYME.',
                    subtitle: 'El Contexto es Rey'
                }
            },
            {
                id: generateId(),
                type: 'content',
                layoutVariant: 'default',
                isVisible: true,
                content: {
                    title: 'Mi Propuesta Radical',
                    body: 'Haz exactamente lo contrario. Sé pequeño. Sé lento. Sé profundo en un mundo superficial.',
                    subtitle: 'La Alternativa'
                }
            },
            {
                id: generateId(),
                type: 'content',
                layoutVariant: 'quote',
                isVisible: true,
                content: {
                    title: 'Cita',
                    body: 'Si todo el mundo piensa igual, alguien no está pensando.',
                    subtitle: 'George Patton'
                }
            },
            {
                id: generateId(),
                type: 'outro',
                layoutVariant: 'default',
                isVisible: true,
                content: {
                    title: '¿Estás de acuerdo o loco?',
                    body: 'Sé que esto va a molestar a algunos.',
                    subtitle: 'Dime lo que piensas',
                    cta_text: 'Comenta'
                }
            }
        ]
    },
     {
        id: 'case_study',
        name: 'Estudio de Caso',
        description: 'Muestra resultados reales con pruebas.',
        icon: 'BarChart',
        slides: [
            {
                id: generateId(),
                type: 'intro',
                layoutVariant: 'default',
                isVisible: true,
                content: {
                    title: 'Cómo ayudé a [Cliente] a ganar +30k',
                    subtitle: 'Estudio de Caso Real',
                    body: 'Desglose paso a paso de estrategia y ejecución.',
                    cta_text: 'Ver Estrategia'
                }
            },
            {
                id: generateId(),
                type: 'content',
                layoutVariant: 'default',
                isVisible: true,
                content: {
                    title: 'El Desafío Inicial',
                    body: 'El cliente tenía un producto increíble pero nadie lo conocía. Su CAC (Coste de Adquisición) era insostenible.',
                    subtitle: 'Situación A'
                }
            },
            {
                id: generateId(),
                type: 'content',
                layoutVariant: 'checklist',
                isVisible: true,
                content: {
                    title: 'El Diagnóstico',
                    body: '✗ Mensaje confuso\n✗ Oferta no irresistible\n✗ Falta de prueba social',
                    subtitle: 'Análisis'
                }
            },
            {
                id: generateId(),
                type: 'content',
                layoutVariant: 'default',
                isVisible: true,
                content: {
                    title: 'La Solución Implementada',
                    body: 'Simplificamos la oferta. Creamos un embudo de contenido educativo. Automatizamos el seguimiento.',
                    subtitle: 'La Magia'
                }
            },
            {
                id: generateId(),
                type: 'content',
                layoutVariant: 'big-number',
                isVisible: true,
                content: {
                    title: '340%',
                    subtitle: 'Retorno de Inversión',
                    body: 'En solo 6 semanas de implementación.',
                    cta_text: 'Resultados'
                }
            },
            {
                id: generateId(),
                type: 'outro',
                layoutVariant: 'default',
                isVisible: true,
                content: {
                    title: '¿Quieres resultados así?',
                    body: 'Tengo espacio para 2 clientes más este mes.',
                    subtitle: 'Mándame un DM "ESCALAR"',
                    cta_text: 'Trabajemos juntos'
                }
            }
        ]
    }
];
