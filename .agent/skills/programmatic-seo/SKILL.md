---
name: programmatic-seo
description: Implementa una estrategia de SEO programático para capturar tráfico orgánico long-tail mediante la generación masiva y controlada de landing pages dinámicas.
---

# 🚀 Programmatic SEO para KOLINK

Esta habilidad guía la implementación de una arquitectura escalable para SEO
programático, permitiendo la creación de miles de landing pages optimizadas para
nichos específicos sin esfuerzo manual.

## 🎯 Objetivos

1. Capturar tráfico de búsquedas long-tail (ej. "IA para agentes inmobiliarios
   en LinkedIn").
2. Generar contenido único y valioso para cada página usando Gemini.
3. Mantener una estructura técnica impecable (Sitemaps, Schema, Performance).

## 🛠 Plan de Implementación

### 1. Identificación de Keywords (Nicho x Caso de Uso)

Definir la matriz de generación:

- **Roles:** Inmobiliaria, Marketing, CEO, Recruiter, Coach, etc.
- **Acciones:** Generar posts, Mejorar perfil, Crear carruseles.
- **Plataforma:** LinkedIn.

### 2. Arquitectura de Landing Pages

Implementar rutas dinámicas en React:

- Ruta: `/tools/linkedin-[action]-for-[role]`
- Componente: `ProgrammaticLandingTemplate.tsx`

### 3. Generación de Contenido con Gemini

Utilizar la Edge Function `generate-seo-content` para crear:

- Títulos H1 hiper-específicos.
- Puntos de dolor del nicho particular.
- Ejemplos de uso adaptados al rol.

### 4. Technical SEO

- **Sitemap Dinámico:** Generar `sitemap.xml` que liste todas las combinaciones
  válidas.
- **Schema Markup:** Inyectar JSON-LD `SoftwareApplication` con datos
  específicos.
- **Interlinking:** Crear un "Hub" de herramientas que enlace a las landings.

## 💎 Reglas de Calidad

- **Evitar Contenido Duplicado:** Cada página debe tener al menos un 40% de
  contenido único generado por IA.
- **Performance:** Las landings deben cargar en <1s (LCP). Usar SSG o ISR si es
  posible, o cache agresivo.
- **Conversión:** Cada landing debe tener un CTA claro hacia el registro
  ("Prueba gratis para [Rol]").
