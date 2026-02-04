export type AnalyticsEventName = 
  // Core (North Star)
  | 'post_generated_success'
  | 'carousel_exported'
  | 'post_published_linkedin'
  | 'post_saved_to_history'
  | 'voice_cloning_success'
  | 'profile_audit_completed'
  
  // Engagement
  | 'micro_edit_applied'
  | 'tone_changed'
  | 'preview_device_toggled'
  | 'app_session_start'
  | 'feature_viewed'
  
  // Business
  | 'checkout_started'
  | 'credits_depleted'
  | 'plan_upgraded'
  
  // Errors (handled separately but good to have type)
  | 'client_error';

export interface AnalyticsEvent {
  id?: string;
  user_id?: string;
  event_name: AnalyticsEventName;
  properties: Record<string, any>;
  session_id?: string;
  created_at?: string;
}

export interface AnalyticsRepository {
  insertEvent(event: AnalyticsEvent): Promise<void>;
  insertBatch(events: AnalyticsEvent[]): Promise<void>;
}

export interface RetentionCohortRow {
  cohort_date: string;
  weeks_after: number;
  active_users: number;
  cohort_size: number;
}
