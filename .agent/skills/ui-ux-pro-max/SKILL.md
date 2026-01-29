---
name: ui-ux-pro-max
description: Provee patrones de diseño avanzados, principios de estética moderna y micro-interacciones para elevar la calidad visual (Factor WOW). Úsala para tareas de rediseño, pulido de UI y mejora de UX.
---

# ✨ UI/UX Pro Max: Estándar de Diseño Premium

Esta habilidad contiene las directrices y recursos para garantizar que KOLINK
cumpla con su Regla #1: "Wowed at first glance".

## 🎨 Principios Estéticos (Factor WOW)

1. **Jerarquía de Profundidad:**
   - Fondo Base: `bg-slate-50` con patrón de cuadrícula sutil
     (`bg-grid-slate-200`).
   - Contenedores: `bg-white/80` (glassmorphism) con `backdrop-blur-md` y
     `border border-white/50`.
   - Elevación: Sombras suaves y difusas (`shadow-xl shadow-brand-500/10`).

2. **Tipografía Moderna:**
   - Títulos: `font-display` (Plus Jakarta Sans o Inter Tight),
     `tracking-tight`, `font-bold`.
   - Cuerpo: `font-sans` (Inter), alta legibilidad (`text-slate-600`).
   - Acentos: Gradientes de texto para palabras clave
     (`bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent`).

3. **Colorimetría:**
   - Primario: Brand Blue (#0A66C2 - LinkedIn Blue mejorado).
   - Acentos: Indigo, Violeta (para sensación tech/AI).
   - Neutros: Slate (nunca Gray puro) para una sensación más rica.

## ⚡ Micro-interacciones (Framer Motion)

Toda interacción debe tener feedback inmediato.

### Botones y Tarjetas

```tsx
<motion.button
  whileHover={{ y: -2, boxShadow: "0 10px 20px -10px rgba(0,0,0,0.1)" }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
```

### Aparición de Elementos (Staggered)

```tsx
const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};
```

## 🧩 Componentes Clave

1. **GlassPanel:** Contenedor estándar para módulos del dashboard.
2. **MagicButton:** Botón con gradiente animado y brillo para acciones
   principales de IA.
3. **StatusBadge:** Indicadores de estado (Online, Processing) con pulsación
   suave (`animate-pulse`).

## 🚫 Anti-Patrones (Lo que NO debes hacer)

- **Bordes Negros/Grises duros:** Usa `border-slate-200/60` siempre.
- **Sombras por defecto:** Evita `shadow-md` simple; prefiere sombras coloreadas
  y difusas.
- **Animaciones Lineales:** Evita `ease-in-out`; usa siempre `type: "spring"`
  para naturalidad.
- **Estados de Carga Estáticos:** Nunca uses "Loading..."; usa Skeletons
  animados con shimmer (`animate-shimmer`).
