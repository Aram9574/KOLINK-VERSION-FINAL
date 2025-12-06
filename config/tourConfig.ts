import { AppLanguage, TourStep } from '../types';
import { translations } from '../translations';

export const getTourSteps = (lang: AppLanguage): TourStep[] => {
    const t = translations[lang].app.sidebar;
    return [
        {
            targetId: 'tour-sidebar',
            title: lang === 'es' ? 'Tu Centro de Comando' : 'Your Command Center',
            description: lang === 'es' ? 'Accede a tu panel, historial y configuración desde la barra de navegación.' : 'Access your dashboard, history, and settings from the navigation bar.',
            position: 'right'
        },
        {
            targetId: 'tour-generator',
            title: lang === 'es' ? 'El Motor Viral' : 'The Viral Engine',
            description: lang === 'es' ? 'Aquí ocurre la magia. Elige tu tema, tono y estructura para arquitectar el post perfecto.' : 'Magic happens here. Choose your topic, tone, and structure to architect the perfect post.',
            position: 'right'
        },
        {
            targetId: 'tour-credits',
            title: lang === 'es' ? 'Gestiona tus Créditos' : 'Manage Your Credits',
            description: lang === 'es' ? 'Lleva el control de tus generaciones aquí. Mejora a Premium para acceso ilimitado.' : 'Track your generations here. Upgrade to Premium for unlimited access.',
            position: 'right'
        },
        {
            targetId: 'tour-preview',
            title: lang === 'es' ? 'Vista Previa en Vivo' : 'Live Preview',
            description: lang === 'es' ? 'Mira exactamente cómo lucirá tu post en LinkedIn antes de publicar.' : 'See exactly how your post will look on LinkedIn before publishing.',
            position: 'left'
        }
    ];
};
