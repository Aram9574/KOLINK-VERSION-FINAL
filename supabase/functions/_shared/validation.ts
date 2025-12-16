export const sanitizeInput = (input: string): string => {
    if (!input) return "";
    let sanitized = input.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "");
    sanitized = sanitized.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
    return sanitized.trim();
};
