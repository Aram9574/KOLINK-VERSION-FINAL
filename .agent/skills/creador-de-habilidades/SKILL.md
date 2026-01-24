---
name: creador-de-habilidades
description: Crea nuevas habilidades para el agente generando la estructura de directorios necesaria y archivos SKILL.md descriptivos en español. Utiliza esta habilidad cuando el usuario solicite añadir nuevas capacidades o "skills" al sistema.
---

# 🛠 Creador de Habilidades Antigravity

Esta habilidad te permite expandir mis capacidades creando nuevas "skills"
modulares y bien documentadas.

## 📋 Proceso de Creación

1. **Identificar el Propósito:** Determina qué funcionalidad específica cubrirá
   la nueva habilidad. Mantén un enfoque atómico (una sola tarea por habilidad).
2. **Definir el Nombre:** Usa un nombre descriptivo en minúsculas y con guiones
   (ej. `optimizador-de-prompt`).
3. **Estructura de Directorio:** Crea la carpeta en
   `.agent/skills/[nombre-de-habilidad]`.
4. **Generar SKILL.md:** Este es el archivo obligatorio. Debe incluir:
   - **YAML Frontmatter:**
     ```yaml
     ---
     name: nombre-de-habilidad
     description: Descripción larga en tercera persona sobre qué hace la habilidad y cuándo usarla.
     ---
     ```
   - **Instrucciones Detalladas:** Pasos técnicos y lógica de negocio.
   - **Contexto de Proyecto:** Referenciar el sistema de diseño de KOLINK y las
     reglas de modularidad si es relevante.

## 💎 Reglas de Oro de KOLINK

Al crear habilidades para este proyecto, asegúrate de que promuevan:

- **Modularidad Estricta:** Dividir lógica pesada en servicios/hooks.
- **Tipado Robusto:** Uso de interfaces en `types.ts` y evitar `any`.
- **Consistencia Visual:** Seguir el sistema de temas (@theme en index.css).
- **Seguridad:** Validar permisos RLS y usar ProtectedRoute.

## 📁 Estructura Opcional

Si la habilidad es compleja, añade los siguientes directorios dentro de su
carpeta:

- `scripts/`: Scripts de automatización o utilidades.
- `examples/`: Ejemplos de uso o archivos de referencia.
- `resources/`: Activos adicionales (prompts, JSONs, etc.).

## 🚀 Comando de Validación

Después de crear una habilidad, verifica que el archivo `SKILL.md` sea legible:
`cat .agent/skills/[nombre-de-habilidad]/SKILL.md`
