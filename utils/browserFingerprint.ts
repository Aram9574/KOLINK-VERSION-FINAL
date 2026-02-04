/**
 * Browser Fingerprinting Utility
 * Generates a unique identifier based on browser characteristics
 * Used for rate limiting public tools without authentication
 */

export const generateFingerprint = async (): Promise<string> => {
  const components: string[] = [];

  // User Agent
  components.push(navigator.userAgent);

  // Screen resolution
  components.push(`${screen.width}x${screen.height}x${screen.colorDepth}`);

  // Timezone
  components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);

  // Language
  components.push(navigator.language);

  // Platform
  components.push(navigator.platform);

  // Hardware concurrency (CPU cores)
  components.push(String(navigator.hardwareConcurrency || 0));

  // Device memory (if available)
  if ('deviceMemory' in navigator) {
    components.push(String((navigator as any).deviceMemory));
  }

  // Canvas fingerprint (lightweight version)
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Kolink', 2, 2);
      components.push(canvas.toDataURL());
    }
  } catch (e) {
    // Canvas fingerprinting blocked
    components.push('canvas-blocked');
  }

  // Combine all components
  const combined = components.join('|');

  // Generate SHA-256 hash
  const encoder = new TextEncoder();
  const data = encoder.encode(combined);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
};

/**
 * Get or create fingerprint from localStorage
 * Persists across sessions for better tracking
 */
export const getOrCreateFingerprint = async (): Promise<string> => {
  const STORAGE_KEY = 'kolink_fp';
  
  // Try to get existing fingerprint
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) {
    return existing;
  }

  // Generate new fingerprint
  const fingerprint = await generateFingerprint();
  localStorage.setItem(STORAGE_KEY, fingerprint);
  
  return fingerprint;
};
