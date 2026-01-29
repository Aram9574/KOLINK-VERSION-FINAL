---
name: analytics-tracking
description: Define la estrategia de seguimiento de eventos para entender el comportamiento de los usuarios (Product Analytics). Va más allá de guardar filas en la DB; se trata de capturar la intención y el flujo.
---

# 📊 Analytics Tracking: User Intelligence

Esta habilidad establece qué medir y cómo, para convertir a KOLINK en un
producto data-driven.

## 🎯 Jerarquía de Eventos

No midas todo. Mide lo que importa para la retención y conversión.

### 1. Core Events (North Star Metrics)

Son los eventos que indican que el usuario obtuvo valor real ("Aha! Moment").

- `post_generated_success`: Usuario generó un post con éxito.
- `carousel_exported`: Usuario descargó un carrusel PDF.
- `post_published_linkedin`: Usuario hizo clic en "Publicar" (intención fuerte).

### 2. Engagement Events

Indican interacción profunda.

- `micro_edit_applied`: Usó "Magic Edit" para refinar texto.
- `tone_changed`: Cambió el tono del post (exploración).
- `preview_device_toggled`: Cambió entre vista móvil/desktop.

### 3. Business Events

Impacto directo en ingresos.

- `checkout_started`: Fue a Stripe.
- `credits_depleted`: Se quedó sin créditos (Oportunidad de Upsell).

## 🛠 Implementación Técnica

### Estructura del Evento

Usa un esquema consistente para todos los eventos de analítica.

```typescript
interface AnalyticsEvent {
    event_name: string; // ej. 'post_generated'
    user_id: string;
    properties: {
        feature_id: string; // ej. 'generator', 'carousel_studio'
        plan_tier: "free" | "pro";
        source?: string; // ej. 'dashboard_shortcut'
        meta?: any; // Datos específicos (ej. { viral_score: 85 })
    };
    timestamp: string;
}
```

### Dónde implementar

- **No en componentes de UI:** Evita ensuciar el JSX con `analytics.track()`.
- **En Hooks/Services:** El mejor lugar es donde ocurre la acción exitosa.
  - _Ejemplo:_ En `geminiService.ts`, después de recibir la respuesta exitosa de
    la IA, dispara `post_generated_success`.

## 📈 Privacidad y Ética

- Nunca rastrear PII (Información Personal Identificable) en las propiedades del
  evento a menos que sea estrictamente necesario y seguro.
- Respetar configuraciones de "Do Not Track" si se implementan cookies
  analíticas de terceros.
