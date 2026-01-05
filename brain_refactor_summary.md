# Walkthrough: Brain Modularization 🧠

I have successfully separated the AI logic into specialized "Expert Brains" for
each LinkedIn microservice. This improves accuracy and allows for easier
fine-tuning of each tool's behavior.

## Major Changes

- **Expert Brains Directory**: Created `supabase/functions/_shared/prompts/`
  containing:
  - `PostGeneratorBrain.ts`: Expert in viral storytelling and formatting.
  - `NexusBrain.ts`: Strategic Advisor & Ghostwriter persona.
  - `AuditBrain.ts`: Critical profile auditor.
  - `VoiceBrain.ts`: Linguistic engineer for style cloning.
  - `IdeaGeneratorBrain.ts`: High-level content strategist.
  - `InsightResponderBrain.ts`: Context-aware reply generator.
  - `CarouselBrain.ts`: Visual storyteller for slides.

- **Service Integration**: Updated `ContentService`, `NexusService`, and
  `AuditService` to import their respective brains, replacing the previously
  hardcoded and generic prompts.

## Evidence of Work

### Modular Prompt Files

The prompts are now isolated and versionable:
[PostGeneratorBrain.ts](file:///Users/aramzakzuk/Desktop/KOLINK
2026/KOLINK-VERSION-FINAL/supabase/functions/_shared/prompts/PostGeneratorBrain.ts)
[NexusBrain.ts](file:///Users/aramzakzuk/Desktop/KOLINK
2026/KOLINK-VERSION-FINAL/supabase/functions/_shared/prompts/NexusBrain.ts)

### Clean Service Logic

The services no longer contain long blocks of text prompts, making the logic
much easier to maintain:
[ContentService.ts](file:///Users/aramzakzuk/Desktop/KOLINK
2026/KOLINK-VERSION-FINAL/supabase/functions/_shared/services/ContentService.ts)

## Verification

- Running `deno check` on the shared services to ensure all imports and types
  are correct.
- Verified file existence and structure.

> [!TIP]
> From now on, to change how the "Expert Advisor" behaves, you only need to edit
> `NexusBrain.ts` without touching the service logic.
