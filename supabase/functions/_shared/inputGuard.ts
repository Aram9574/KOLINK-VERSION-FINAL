/**
 * Input Guard - Utility for sanitizing and validating user inputs for LLMs.
 * Prevents basic prompt injection and enforces length limits.
 */

export const MAX_INPUT_LENGTH = 5000; // Reasonable limit for a post topic/context

// Patterns that might indicate an attempt to override system instructions
const INJECTION_PATTERNS = [
  /ignore (all )?previous instructions/i,
  /ignore (all )?above instructions/i,
  /disregard (all )?previous instructions/i,
  /forget your rules/i,
  /reveal your prompt/i,
  /system prompt/i,
  /you are now a/i,
  /act as a/i,
  /jailbreak/i,
  /<script/i,
  /javascript:/i,
];

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedInput?: string;
}

export function validateInput(text: string): ValidationResult {
  if (!text || typeof text !== "string") {
    return { isValid: false, error: "Input must be a non-empty string." };
  }

  // 1. Length Check
  if (text.length > MAX_INPUT_LENGTH) {
      return { 
          isValid: false, 
          error: `Input exceeds maximum length of ${MAX_INPUT_LENGTH} characters.` 
      };
  }

  // 2. Injection Pattern Check
  // We don't necessarily block everything, but we flag obvious attempts.
  // For a strictly controlled app, we might block. For a creative tool, we might just warn or log.
  // Here we will block explicit override attempts.
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(text)) {
      console.warn(`[Security] Potential prompt injection detected: ${pattern.source}`);
      return {
        isValid: false,
        error: "Your input contains patterns that are not allowed for security reasons.",
      };
    }
  }

  // 3. Sanitization (Basic)
  // Remove control characters that aren't newlines/tabs
  // eslint-disable-next-line no-control-regex
  const sanitized = text.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, "");

  return { isValid: true, sanitizedInput: sanitized.trim() };
}
