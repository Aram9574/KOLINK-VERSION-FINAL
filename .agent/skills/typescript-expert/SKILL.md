---
name: typescript-expert
description: Blinda la aplicación contra errores en tiempo de ejecución mediante tipado estricto, genéricos avanzados y validación de esquemas.
---

# 🛡 TypeScript Expert KOLINK

Esta habilidad se enfoca en llevar la seguridad del código al máximo nivel,
eliminando la ambigüedad y garantizando que el flujo de datos sea predecible.

## 📋 Acciones Core

1. **Eliminar `any`:** Prohibido el uso de `any`. Usar `unknown` con validación
   o interfaces específicas.
2. **Strict Mode:** Activar y corregir errores de `strictNullChecks` y
   `noImplicitAny` en el `tsconfig.json`.
3. **Genéricos Avanzados:** Implementar hooks y servicios que acepten tipos
   genéricos `<T>` para mayor reutilización.
4. **Discriminated Unions:** Usar uniones discriminadas para manejar estados
   compuestos (ej. `{ status: 'loading' } | { status: 'success', data: T }`).
5. **Edge Function Typing:** Crear interfaces compartidas entre el frontend y
   las Edge Functions de Supabase.
6. **Supabase Type Gen:** Utilizar `supabase gen types typescript --local` (o
   equivalente via MCP) para mantener los tipos de la DB sincronizados.
7. **Typesafe IDs:** Implementar Brand Types para evitar pasar un `PostID` donde
   se espera un `UserID`.

## 🛠 Proceso de Refactorización

1. **Localizar:** Usar `grep` o `ripgrep` para encontrar instancias de `: any` o
   `as any`.
2. **Definir:** Crear la interfaz necesaria en `types.ts` o archivos locales de
   tipos.
3. **Aplicar:** Reemplazar el `any` y corregir los errores de compilación
   resultantes.
4. **Verificar:** Asegurar que el linter (`tsc`) pase sin advertencias.

## 💎 Regla de Oro

"Si no puedes definir el tipo de un dato, es que probablemente no entiendes cómo
fluye ese dato por tu sistema."
