---
name: post-generation-v3-shield
description: Estándar de protección para el motor de generación de posts Premium 2026. Este documento "blinda" la lógica actual contra cambios accidentales o rediseños no solicitados.
---

# 🛡️ Escudo de Protección Post-Generación V3

Este estándar define la configuración "Gold" del motor de generación de posts de
KOLINK. **NO MODIFICAR** los componentes listados aquí a menos que el usuario lo
solicite explícitamente.

## 🧱 Componentes Protegidos

### 1. Motor de IA (Edge Function)

- **Path:** `supabase/functions/generate-viral-post/index.ts`
- **Modelo:** `gemini-3-flash-preview` (Detección de Thinking activa).
- **Regla de Oro:** Mantener el `Emergency Bypass` (autenticación por fallback
  `userId`) para garantizar disponibilidad total.

### 2. Cerebro Estratégico (Prompts)

- **Path:** `supabase/functions/_shared/prompts/PostGeneratorBrain.ts`
- **Contenido:** Contiene las reglas del Algoritmo 2026, estructuras de Hook y
  el modelo "Pillar and Spokes".
- **Regla de Oro:** No suavizar el tono ni cambiar las directivas de "Ironía
  Ética" sin permiso.

### 3. Validación de Datos (Zod)

- **Path:** `services/postService.ts` y `types/post.ts`
- **Esquema:** `PostContentSchema` debe mantener la sincronización con el objeto
  de respuesta de la Edge Function (`ai_reasoning`, `viralAnalysis`, `meta`).

## 🚨 Protocolo de Cambio

Si se requiere un cambio:

1. Crear un respaldo de la versión actual.
2. Notificar al usuario sobre el impacto en el "Factor WOW" actual.
3. Actualizar este escudo tras la aprobación.

> [!IMPORTANT]
> La estabilidad de la generación es la prioridad #1. Cualquier error 500 o 401
> en este módulo debe ser tratado como un incidente crítico de Nivel 1.
