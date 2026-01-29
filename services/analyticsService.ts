import { AnalyticsEvent, AnalyticsEventName } from '@/types/analytics';
import { analyticsRepository } from '@/services/repositories/analyticsRepository';
import { supabase } from './supabaseClient';

const FLUSH_INTERVAL = 5000; // 5 seconds
const BATCH_SIZE = 10;

class AnalyticsService {
  private queue: AnalyticsEvent[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private sessionId: string;
  private userId: string | undefined;

  constructor() {
    this.sessionId = crypto.randomUUID();
    this.initSession();
    // Flush on unload
    if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', () => {
            this.flush(true);
        });
    }
  }

  private async initSession() {
    // Attempt to get user ID if already logged in
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
        this.userId = data.session.user.id;
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
            this.userId = session.user.id;
            this.track('app_session_start', { source: 'auth_change' });
        } else {
            this.userId = undefined;
            // Reset session on logout? Maybe keep same session ID for visitor tracking.
        }
    });

    this.track('app_session_start', { source: 'init' });
  }

  /**
   * Track a user action or event.
   * @param eventName Name of the event
   * @param properties Additional context properties
   */
  public track(eventName: AnalyticsEventName, properties: Record<string, any> = {}) {
    // Respect Do Not Track
    if (typeof navigator !== 'undefined' && navigator.doNotTrack === '1') {
      console.debug('Analytics skipped due to Do Not Track');
      return;
    }

    const event: AnalyticsEvent = {
        event_name: eventName,
        user_id: this.userId,
        session_id: this.sessionId,
        properties: {
            ...properties,
            path: window.location.pathname,
            timestamp: new Date().toISOString(),
            device_type: this.getDeviceType(),
        }
    };

    this.queue.push(event);

    if (this.queue.length >= BATCH_SIZE) {
        this.flush();
    } else if (!this.flushTimer) {
        this.flushTimer = setTimeout(() => this.flush(), FLUSH_INTERVAL);
    }
  }

  /**
   * Flushes the current queue to the repository.
   * @param urgent If true, prevents using async awaits to try and send data before close (best effort)
   */
  private async flush(urgent = false) {
    if (this.flushTimer) {
        clearTimeout(this.flushTimer);
        this.flushTimer = null;
    }

    if (this.queue.length === 0) return;

    const eventsToSend = [...this.queue];
    this.queue = [];

    try {
        await analyticsRepository.insertBatch(eventsToSend);
    } catch (error) {
        console.error('Failed to flush analytics queue', error);
        // Retry logic could go here, but for now we drop to avoid memory leaks
    }
  }

  private getDeviceType(): string {
     if (typeof window === 'undefined') return 'unknown';
     const ua = navigator.userAgent;
     if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
         return 'tablet';
     }
     if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
         return 'mobile';
     }
     return 'desktop';
  }

  public async getRetentionCohorts() {
      return analyticsRepository.fetchRetentionCohorts();
  }
}

export const analytics = new AnalyticsService();
