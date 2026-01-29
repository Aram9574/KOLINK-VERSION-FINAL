
export const estimateTokens = (text: string): number => {
  // Rough estimate: 1 token ~= 4 characters for English, maybe 3-4 for Spanish
  return Math.ceil(text.length / 4);
};

export const truncateToTokenLimit = (text: string, maxTokens: number): string => {
  const estimated = estimateTokens(text);
  if (estimated <= maxTokens) return text;
  
  // Truncate
  const charLimit = maxTokens * 4;
  return text.substring(0, charLimit) + "... [Truncated]";
};
