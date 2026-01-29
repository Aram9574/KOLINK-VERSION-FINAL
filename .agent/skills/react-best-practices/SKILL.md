---
name: react-best-practices
description: Define el estándar de calidad de código para KOLINK, enfocándose en un stack React/TypeScript estricto. Incluye patrones de arquitectura (Service-Repository), gestión de estados y performance.
---

# ⚛️ React & TypeScript Pro Code

Esta habilidad contiene las reglas no negociables para la ingeniería de software
en KOLINK. Cumple con las reglas globales #4, #5 y #12.

## 📐 Patrones Arquitectónicos

### 1. Service-Repository Pattern

Desacopla la UI de la base de datos y la lógica de negocio externa.

- **Repository (`/services/userRepository.ts`):** Lógica pura de datos (Supabase
  queries).
  - _Correcto:_ `getUserProfile(id)`
  - _Retorna:_ `Promise<UserProfile | null>`
- **Service (`/services/geminiService.ts`):** Lógica de negocio y orquestación.
  - _Correcto:_ `generateViralPost(params)` (Llama a API, valida, formatea).
- **Hook (`/hooks/usePostGeneration.ts`):** Estado de la UI y efectos.
  - _Correcto:_ `handleGenerate()` (Llama al servicio, actualiza loading state).
- **Component (`PostGenerator.tsx`):** Renderizado puro.
  - _Correcto:_ Recibe props, muestra UI, llama handlers del hook.

### 2. Gestión de Tipado (TypeScript Strict)

- **Prohibido `any`:** Si no sabes el tipo, usa `unknown` y haz type guards.
- **Interfaces Centralizadas:** Todo tipo compartido vive en `/types/index.ts`.
- **Zod para Runtime:** Usa Zod para validar datos externos (API responses,
  inputs de usuario).

## ⚡ Performance First

### 1. Code Splitting & Lazy Loading

Regla #12: Módulos pesados deben cargarse bajo demanda.

```tsx
// Lazy load de componentes grandes
const CarouselEditor = React.lazy(() =>
    import("./features/carousel/CarouselStudio")
);

// Suspense wrapper obligatorio
<Suspense fallback={<LoadingSkeleton />}>
    <CarouselEditor />
</Suspense>;
```

### 2. React.memo & useMemo

Evita re-renderizados innecesarios en componentes interactivos complejos (ej. el
Editor de texto).

- Usa `useCallback` para funciones pasadas como props.
- Usa `React.memo` en componentes hoja que reciben las mismas props
  frecuentemente.

## 🛡 Manejo de Errores (Robustez)

- **Error Boundaries:** Envuelve módulos críticos para que un fallo no rompa
  toda la app.
- **Try/Catch en Servicios:** Nunca dejes una promesa sin catch en la capa de
  servicio. Lanza errores tipados (`AppError`) que la UI pueda entender.
