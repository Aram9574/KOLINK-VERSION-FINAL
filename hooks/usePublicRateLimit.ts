import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { getOrCreateFingerprint } from '../utils/browserFingerprint';

export type ToolName = 'headline' | 'bio' | 'scorecard' | 'niche_content';

interface UsageInfo {
  currentCount: number;
  limit: number;
  resetAt: Date;
  isLimitReached: boolean;
}

interface UsePublicRateLimitReturn {
  usageInfo: UsageInfo | null;
  isLoading: boolean;
  checkLimit: () => Promise<boolean>;
  isLimitReached: boolean;
}

/**
 * Hook for managing rate limits on public tools
 * Checks usage without incrementing the counter
 */
export const usePublicRateLimit = (toolName: ToolName): UsePublicRateLimitReturn => {
  const [usageInfo, setUsageInfo] = useState<UsageInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fingerprint, setFingerprint] = useState<string>('');

  // Generate fingerprint on mount
  useEffect(() => {
    const initFingerprint = async () => {
      const fp = await getOrCreateFingerprint();
      setFingerprint(fp);
    };
    initFingerprint();
  }, []);

  // Check limit when fingerprint is ready
  useEffect(() => {
    if (fingerprint) {
      checkLimit();
    }
  }, [fingerprint, toolName]);

  const checkLimit = async (): Promise<boolean> => {
    if (!fingerprint) {
      return false;
    }

    setIsLoading(true);
    
    try {
      // Get IP hash (will be done server-side, but we need to pass fingerprint)
      const { data, error } = await supabase
        .rpc('check_tool_usage', {
          p_ip_hash: 'client-side', // Server will override with real IP hash
          p_fingerprint: fingerprint,
          p_tool_name: toolName
        });

      if (error) {
        console.error('Error checking rate limit:', error);
        return false;
      }

      if (data && data.length > 0) {
        const info = data[0];
        setUsageInfo({
          currentCount: info.current_count,
          limit: info.max_limit,
          resetAt: new Date(info.reset_at),
          isLimitReached: info.limit_reached
        });
        return !info.limit_reached;
      }

      return true;
    } catch (error) {
      console.error('Error checking rate limit:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    usageInfo,
    isLoading,
    checkLimit,
    isLimitReached: usageInfo?.isLimitReached || false
  };
};
