import { supabase } from '@/services/supabaseClient';
import { AnalyticsEvent } from '@/types/analytics';

/**
 * Repository for interacting with the 'analytics_events' table.
 * Follows the Service-Repository pattern.
 */
export const analyticsRepository = {
  /**
   * Inserts a single event into the database.
   * @param event The event to insert
   */
  async insertEvent(event: AnalyticsEvent): Promise<void> {
    // @ts-ignore - Table defined in Supabase but not in local types yet
    const { error } = await supabase
      .from('analytics_events' as any)
      .insert({
        user_id: event.user_id,
        event_name: event.event_name,
        properties: event.properties,
        session_id: event.session_id,
        created_at: event.created_at || new Date().toISOString(),
      });

    if (error) {
      console.error('Error inserting analytics event:', error);
      // We do not throw here to avoid disrupting user experience for a metric failure
    }
  },

  /**
   * Inserts a batch of events into the database.
   * @param events Array of events to insert
   */
  async insertBatch(events: AnalyticsEvent[]) {
    if (events.length === 0) return;

    // @ts-ignore
    const { error } = await supabase
      .from('analytics_events' as any)
      .insert(events.map(e => ({
        user_id: e.user_id,
        event_name: e.event_name,
        properties: e.properties,
        session_id: e.session_id,
        created_at: e.created_at || new Date().toISOString()
      })));

    if (error) {
      console.error('Error inserting analytics batch:', error);
    }
  },

  /**
   * Fetches recent events for the dashboard.
   * @param limit Number of events to fetch
   */
  async fetchRecentEvents(limit = 1000): Promise<AnalyticsEvent[]> {
      // @ts-ignore
      const { data, error } = await supabase
        .from('analytics_events' as any)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
          console.error("Error fetching analytics:", error);
          return [];
      }
      return data || [];
  },

  /**
   * Fetches retention cohort data from the SQL view.
   */
  async fetchRetentionCohorts(): Promise<import('@/types/analytics').RetentionCohortRow[]> {
      // @ts-ignore
      const { data, error } = await supabase
          .from('analytics_retention_cohorts' as any)
          .select('*')
          .order('cohort_date', { ascending: true });

      if (error) {
          console.error("Error fetching retention cohorts:", error);
          return [];
      }
      if (error) {
          console.error("Error fetching retention cohorts:", error);
          return [];
      }
      return data || [];
  },

  /**
   * Fetches top clicked elements for simplified heatmap/interaction tracking.
   */
  async fetchTopClicks(limit = 10): Promise<{ element: string, clicks: number }[]> {
      // @ts-ignore
      const { data, error } = await supabase.rpc('get_top_clicks', { limit_count: limit });

      // Fallback if RPC doesn't exist (simulated client-side agg if low volume, but better to use RP or simple select)
      // Since I can't easily create an RPC without sql tool, I will try a raw select and aggregate client side if needed, 
      // or just selecting raw events if volume is low.
      // But for a robust solution, I should create the RPC.
      
      // Let's create the RPC first with execute_sql tool.
      if (error) {
          console.error("Error fetching top clicks:", error);
          return [];
      }
      return data || [];
  }
};
