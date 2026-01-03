import { AppLanguage } from "./types.ts";
import { en } from "./translations/en.ts";
import { es } from "./translations/es.ts";

export type TranslationType = typeof en;
export const translations: Record<AppLanguage, TranslationType> = { en, es };
