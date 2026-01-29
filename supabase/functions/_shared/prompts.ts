import { PROMPT_DATA } from './prompts_data.ts';

export const SYSTEM_INSTRUCTION = PROMPT_DATA.system_instruction;

export const VIRAL_EXAMPLES = PROMPT_DATA.viral_examples;

export const getFrameworkInstructions = (framework: string): string => {
  return PROMPT_DATA.frameworks[framework as keyof typeof PROMPT_DATA.frameworks] || "";
};

export const getEmojiInstructions = (density: string): string => {
  return PROMPT_DATA.emojis[density as keyof typeof PROMPT_DATA.emojis] || PROMPT_DATA.emojis.DEFAULT;
};

export const getLengthInstructions = (length: string): string => {
  return PROMPT_DATA.lengths[length as keyof typeof PROMPT_DATA.lengths] || PROMPT_DATA.lengths.DEFAULT;
};

export const getTemplates = () => PROMPT_DATA.templates;

export const FEW_SHOT_COT = PROMPT_DATA.few_shot_cot;

