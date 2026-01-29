---
name: seo-audit
description: Provee criterios técnicos reales de SEO y optimización de perfiles en LinkedIn para alimentar el prompt de la IA. Transformando la auditoría de 'opinión' a 'análisis técnico'.
---

# 🔍 SEO Audit: Ingeniería de Perfiles

Esta habilidad define los criterios objetivos para evaluar un perfil de LinkedIn
(KOLINK Audit), basados en el algoritmo de búsqueda de la plataforma y prácticas
de conversión.

## 📊 Factores de Ranking (Técnicos)

Utiliza estos factores al construir prompts para la función `analyze-profile`.

### 1. Keywords en el Headline (Peso: 30%)

- **Regla:** El algoritmo prioriza coincidencias exactas en el Headline.
- **Check:** ¿Contiene el rol principal + industria + propuesta de valor única?
- **Anti-Patrón:** Headlines abstractos como "Helping dreams come true" (0 SEO
  power).

### 2. Densidad de Palabras Clave en About (Peso: 20%)

- **Regla:** Las primeras 3 líneas son críticas para el CTR (Click Through Rate)
  de "Ver más".
- **Check:** ¿Menciona 3-5 habilidades técnicas (hard skills) en el primer
  párrafo?

### 3. Completitud del Perfil (Peso: 15%)

- **Regla:** Perfiles "All-Star" tienen 40x más probabilidad de ser contactados.
- **Check:** Foto de perfil (no avatar), Banner personalizado, al menos 3
  experiencias, 5 skills validadas.

## 🧠 Estructura del Prompt de Auditoría

Cuando modifiques `analyze-profile`, inyecta este contexto en el System Prompt:

```markdown
ACT AS: Senior LinkedIn SEO Strategist & Conversion Copywriter.

EVALUATION CRITERIA:

1. **Discoverability (SEO):** Can recruiters find this profile? Check Headline &
   Skills match.
2. **Authority (Social Proof):** Does the Banner and Experience prove
   competence?
3. **Conversion (CRO):** Is there a clear Call to Action (CTA) in the About
   section?

SCORING MATRIX (0-100):

- <50: Invisible. Missing core keywords or images.
- 50-75: Standard. Functional but generic.
- 75-90: Optimized. Strong keywords, clear value prop.
- 90+: Top 1% Voice. Authority leader, perfect funnels.
```

## 🛠 Herramientas y Recursos

- **Keyword Planner:** Usa términos de volumen alto (ej. "Full Stack Developer"
  > "Coding Wizard").
- **Human Touch:** El SEO trae tráfico, el Copywriting convierte. La auditoría
  debe sugerir un balance.
