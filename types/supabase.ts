export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          achievement_type: string
          created_at: string | null
          id: string
          unlocked_at: string | null
          user_id: string
          xp_earned: number | null
        }
        Insert: {
          achievement_type: string
          created_at?: string | null
          id?: string
          unlocked_at?: string | null
          user_id: string
          xp_earned?: number | null
        }
        Update: {
          achievement_type?: string
          created_at?: string | null
          id?: string
          unlocked_at?: string | null
          user_id?: string
          xp_earned?: number | null
        }
        Relationships: []
      }
      ai_feedback: {
        Row: {
          created_at: string | null
          id: string
          input_context: Json
          metadata: Json | null
          output_content: string
          rating: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          input_context: Json
          metadata?: Json | null
          output_content: string
          rating: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          input_context?: Json
          metadata?: Json | null
          output_content?: string
          rating?: number
          user_id?: string
        }
        Relationships: []
      }
      autopost_schedule: {
        Row: {
          confidence_score: number | null
          content_idea: string
          created_at: string | null
          id: string
          pillar_id: string | null
          scheduled_date: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          content_idea: string
          created_at?: string | null
          id?: string
          pillar_id?: string | null
          scheduled_date: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          content_idea?: string
          created_at?: string | null
          id?: string
          pillar_id?: string | null
          scheduled_date?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "autopost_schedule_pillar_id_fkey"
            columns: ["pillar_id"]
            isOneToOne: false
            referencedRelation: "content_pillars"
            referencedColumns: ["id"]
          },
        ]
      }
      benchmarks: {
        Row: {
          category: string
          created_at: string | null
          embedding: string | null
          id: string
          metadata: Json | null
          text_content: string
        }
        Insert: {
          category: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          text_content: string
        }
        Update: {
          category?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          text_content?: string
        }
        Relationships: []
      }
      brand_kits: {
        Row: {
          colors: Json
          created_at: string | null
          fonts: Json
          id: string
          logos: string[] | null
          name: string
          user_id: string
        }
        Insert: {
          colors?: Json
          created_at?: string | null
          fonts?: Json
          id?: string
          logos?: string[] | null
          name: string
          user_id: string
        }
        Update: {
          colors?: Json
          created_at?: string | null
          fonts?: Json
          id?: string
          logos?: string[] | null
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      brand_voices: {
        Row: {
          created_at: string | null
          description: string | null
          hook_patterns: Json | null
          id: string
          is_active: boolean | null
          mimicry_instructions: string | null
          name: string
          stylistic_dna: Json
          user_id: string
          voice_name: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          hook_patterns?: Json | null
          id?: string
          is_active?: boolean | null
          mimicry_instructions?: string | null
          name: string
          stylistic_dna: Json
          user_id: string
          voice_name?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          hook_patterns?: Json | null
          id?: string
          is_active?: boolean | null
          mimicry_instructions?: string | null
          name?: string
          stylistic_dna?: Json
          user_id?: string
          voice_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_voices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      carousels: {
        Row: {
          aspect_ratio: string | null
          created_at: string | null
          data: Json
          id: string
          settings: Json
          status: string | null
          theme_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          aspect_ratio?: string | null
          created_at?: string | null
          data?: Json
          id?: string
          settings?: Json
          status?: string | null
          theme_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          aspect_ratio?: string | null
          created_at?: string | null
          data?: Json
          id?: string
          settings?: Json
          status?: string | null
          theme_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      closures: {
        Row: {
          category: string
          created_at: string | null
          id: string
          tags: string[] | null
          template_text: string
          usage_count: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          tags?: string[] | null
          template_text: string
          usage_count?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          tags?: string[] | null
          template_text?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      content_pillars: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
          user_id: string
          weight_percentage: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
          user_id: string
          weight_percentage?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string
          weight_percentage?: number | null
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          amount: number
          balance_after: number | null
          created_at: string | null
          feature: string
          id: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after?: number | null
          created_at?: string | null
          feature: string
          id?: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number | null
          created_at?: string | null
          feature?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      credits_ledger: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          metadata: Json | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          metadata?: Json | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          metadata?: Json | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      drafts: {
        Row: {
          content: Json | null
          created_at: string | null
          id: string
          last_saved_at: string | null
          type: string | null
          user_id: string
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          id?: string
          last_saved_at?: string | null
          type?: string | null
          user_id: string
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          id?: string
          last_saved_at?: string | null
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          email_template_id: string
          id: string
          metadata: Json | null
          sent_at: string
          status: string | null
          user_id: string
        }
        Insert: {
          email_template_id: string
          id?: string
          metadata?: Json | null
          sent_at?: string
          status?: string | null
          user_id: string
        }
        Update: {
          email_template_id?: string
          id?: string
          metadata?: Json | null
          sent_at?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          component: string | null
          created_at: string | null
          error_message: string
          id: string
          metadata: Json | null
          stack_trace: string | null
          user_id: string | null
        }
        Insert: {
          component?: string | null
          created_at?: string | null
          error_message: string
          id?: string
          metadata?: Json | null
          stack_trace?: string | null
          user_id?: string | null
        }
        Update: {
          component?: string | null
          created_at?: string | null
          error_message?: string
          id?: string
          metadata?: Json | null
          stack_trace?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          content: string
          created_at: string | null
          id: string
          message: string | null
          rating: number | null
          status: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          message?: string | null
          rating?: number | null
          status?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          message?: string | null
          rating?: number | null
          status?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      fragments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
          usage_count: number | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
          usage_count?: number | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          usage_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      hook_library: {
        Row: {
          category: string
          created_at: string | null
          hook_template: string
          id: string
          is_premium: boolean | null
        }
        Insert: {
          category: string
          created_at?: string | null
          hook_template: string
          id?: string
          is_premium?: boolean | null
        }
        Update: {
          category?: string
          created_at?: string | null
          hook_template?: string
          id?: string
          is_premium?: boolean | null
        }
        Relationships: []
      }
      hooks: {
        Row: {
          category: string
          created_at: string | null
          id: string
          tags: string[] | null
          template_text: string
          usage_count: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          tags?: string[] | null
          template_text: string
          usage_count?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          tags?: string[] | null
          template_text?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      insight_responses: {
        Row: {
          created_at: string | null
          generated_response: string
          id: string
          original_post_image_url: string | null
          original_post_url: string | null
          tone: string | null
          user_id: string
          user_intent: string | null
        }
        Insert: {
          created_at?: string | null
          generated_response: string
          id?: string
          original_post_image_url?: string | null
          original_post_url?: string | null
          tone?: string | null
          user_id: string
          user_intent?: string | null
        }
        Update: {
          created_at?: string | null
          generated_response?: string
          id?: string
          original_post_image_url?: string | null
          original_post_url?: string | null
          tone?: string | null
          user_id?: string
          user_intent?: string | null
        }
        Relationships: []
      }
      linkedin_knowledge_base: {
        Row: {
          content: string
          created_at: string | null
          embedding: string | null
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      nexus_conversations: {
        Row: {
          context_data: Json | null
          created_at: string | null
          id: string
          messages: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          context_data?: Json | null
          created_at?: string | null
          id?: string
          messages?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          context_data?: Json | null
          created_at?: string | null
          id?: string
          messages?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          ai_reasoning: string | null
          content: string | null
          created_at: string | null
          emoji_density: number | null
          hashtags_count: number | null
          id: string
          is_auto_pilot: boolean | null
          is_favorite: boolean | null
          params: Json | null
          pillar: string | null
          scheduled_at: string | null
          status: string | null
          tags: string[] | null
          user_id: string
          viral_analysis: Json | null
          viral_score: number | null
        }
        Insert: {
          ai_reasoning?: string | null
          content?: string | null
          created_at?: string | null
          emoji_density?: number | null
          hashtags_count?: number | null
          id?: string
          is_auto_pilot?: boolean | null
          is_favorite?: boolean | null
          params?: Json | null
          pillar?: string | null
          scheduled_at?: string | null
          status?: string | null
          tags?: string[] | null
          user_id: string
          viral_analysis?: Json | null
          viral_score?: number | null
        }
        Update: {
          ai_reasoning?: string | null
          content?: string | null
          created_at?: string | null
          emoji_density?: number | null
          hashtags_count?: number | null
          id?: string
          is_auto_pilot?: boolean | null
          is_favorite?: boolean | null
          params?: Json | null
          pillar?: string | null
          scheduled_at?: string | null
          status?: string | null
          tags?: string[] | null
          user_id?: string
          viral_analysis?: Json | null
          viral_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_audits: {
        Row: {
          analysis_data: Json | null
          authority_score: number | null
          created_at: string | null
          id: string
          snapshot_url: string | null
          user_id: string
        }
        Insert: {
          analysis_data?: Json | null
          authority_score?: number | null
          created_at?: string | null
          id?: string
          snapshot_url?: string | null
          user_id: string
        }
        Update: {
          analysis_data?: Json | null
          authority_score?: number | null
          created_at?: string | null
          id?: string
          snapshot_url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_audits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          active_voice_id: string | null
          auto_pilot: Json | null
          auto_pilot_config: Json | null
          avatar_url: string | null
          behavioral_dna: Json | null
          brand_colors: Json | null
          brand_settings: Json | null
          company_name: string | null
          created_at: string | null
          credits: number | null
          current_streak: number | null
          daily_generations_count: number | null
          email: string | null
          full_name: string | null
          gamification_stats: Json | null
          has_onboarded: boolean | null
          headline: string | null
          id: string
          industry: string | null
          language: Database["public"]["Enums"]["app_language_enum"] | null
          last_post_at: string | null
          last_post_date: string | null
          last_reset_at: string | null
          level: number | null
          linkedin_url: string | null
          plan_tier: Database["public"]["Enums"]["plan_tier_enum"] | null
          position: string | null
          security_notifications: boolean | null
          stripe_customer_id: string | null
          subscription_id: string | null
          two_factor_enabled: boolean | null
          unlocked_achievements: string[] | null
          updated_at: string | null
          xp: number | null
          xp_points: number | null
        }
        Insert: {
          active_voice_id?: string | null
          auto_pilot?: Json | null
          auto_pilot_config?: Json | null
          avatar_url?: string | null
          behavioral_dna?: Json | null
          brand_colors?: Json | null
          brand_settings?: Json | null
          company_name?: string | null
          created_at?: string | null
          credits?: number | null
          current_streak?: number | null
          daily_generations_count?: number | null
          email?: string | null
          full_name?: string | null
          gamification_stats?: Json | null
          has_onboarded?: boolean | null
          headline?: string | null
          id: string
          industry?: string | null
          language?: Database["public"]["Enums"]["app_language_enum"] | null
          last_post_at?: string | null
          last_post_date?: string | null
          last_reset_at?: string | null
          level?: number | null
          linkedin_url?: string | null
          plan_tier?: Database["public"]["Enums"]["plan_tier_enum"] | null
          position?: string | null
          security_notifications?: boolean | null
          stripe_customer_id?: string | null
          subscription_id?: string | null
          two_factor_enabled?: boolean | null
          unlocked_achievements?: string[] | null
          updated_at?: string | null
          xp?: number | null
          xp_points?: number | null
        }
        Update: {
          active_voice_id?: string | null
          auto_pilot?: Json | null
          auto_pilot_config?: Json | null
          avatar_url?: string | null
          behavioral_dna?: Json | null
          brand_colors?: Json | null
          brand_settings?: Json | null
          company_name?: string | null
          created_at?: string | null
          credits?: number | null
          current_streak?: number | null
          daily_generations_count?: number | null
          email?: string | null
          full_name?: string | null
          gamification_stats?: Json | null
          has_onboarded?: boolean | null
          headline?: string | null
          id?: string
          industry?: string | null
          language?: Database["public"]["Enums"]["app_language_enum"] | null
          last_post_at?: string | null
          last_post_date?: string | null
          last_reset_at?: string | null
          level?: number | null
          linkedin_url?: string | null
          plan_tier?: Database["public"]["Enums"]["plan_tier_enum"] | null
          position?: string | null
          security_notifications?: boolean | null
          stripe_customer_id?: string | null
          subscription_id?: string | null
          two_factor_enabled?: boolean | null
          unlocked_achievements?: string[] | null
          updated_at?: string | null
          xp?: number | null
          xp_points?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_profiles_voice"
            columns: ["active_voice_id"]
            isOneToOne: false
            referencedRelation: "brand_voices"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string | null
          id: string
          referral_code: string
          referred_email: string | null
          referrer_user_id: string
          reward_claimed: boolean | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          referral_code: string
          referred_email?: string | null
          referrer_user_id: string
          reward_claimed?: boolean | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          referral_code?: string
          referred_email?: string | null
          referrer_user_id?: string
          reward_claimed?: boolean | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      scheduled_posts: {
        Row: {
          created_at: string | null
          id: string
          linkedin_scheduled_id: string | null
          post_id: string | null
          scheduled_datetime: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          linkedin_scheduled_id?: string | null
          post_id?: string | null
          scheduled_datetime: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          linkedin_scheduled_id?: string | null
          post_id?: string | null
          scheduled_datetime?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_posts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      security_logs: {
        Row: {
          created_at: string | null
          details: Json | null
          event_type: string
          id: string
          ip_address: string | null
          request_path: string | null
          severity: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          request_path?: string | null
          severity?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          request_path?: string | null
          severity?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      snippets: {
        Row: {
          content: string
          created_at: string
          id: string
          last_used_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          last_used_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          last_used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          billing_cycle: string | null
          canceled_at: string | null
          created_at: string | null
          credits_limit: number | null
          id: string
          plan_type: string | null
          price: number | null
          reset_date: string | null
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          billing_cycle?: string | null
          canceled_at?: string | null
          created_at?: string | null
          credits_limit?: number | null
          id?: string
          plan_type?: string | null
          price?: number | null
          reset_date?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          billing_cycle?: string | null
          canceled_at?: string | null
          created_at?: string | null
          credits_limit?: number | null
          id?: string
          plan_type?: string | null
          price?: number | null
          reset_date?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_behavior_analytics: {
        Row: {
          detected_personality: string | null
          id: string
          last_interaction: string | null
          peak_engagement_hours: number[] | null
          preferred_pillars: string[] | null
          user_id: string
        }
        Insert: {
          detected_personality?: string | null
          id?: string
          last_interaction?: string | null
          peak_engagement_hours?: number[] | null
          preferred_pillars?: string[] | null
          user_id: string
        }
        Update: {
          detected_personality?: string | null
          id?: string
          last_interaction?: string | null
          peak_engagement_hours?: number[] | null
          preferred_pillars?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_behavior_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string | null
          device_id: string
          device_info: Json | null
          id: string
          ip_address: string | null
          last_seen: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_id: string
          device_info?: Json | null
          id?: string
          ip_address?: string | null
          last_seen?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_id?: string
          device_info?: Json | null
          id?: string
          ip_address?: string | null
          last_seen?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_style_vectors: {
        Row: {
          content: string
          created_at: string | null
          embedding: string | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      voice_models: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
          user_id: string
          voice_profile: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
          user_id: string
          voice_profile?: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string
          voice_profile?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrement_credit: { Args: { target_user_id: string }; Returns: undefined }
      decrement_credits: { Args: { user_id: string }; Returns: undefined }
      deduct_credits_transactional: {
        Args: { p_amount: number; p_feature: string; p_user_id: string }
        Returns: number
      }
      deduct_user_credits: {
        Args: {
          p_amount: number
          p_metadata?: Json
          p_type: string
          p_user_id: string
        }
        Returns: boolean
      }
      get_onboarding_candidates: {
        Args: { max_hours: number; min_hours: number; template_id: string }
        Returns: {
          email: string
          id: string
          name: string
        }[]
      }
      match_benchmarks: {
        Args: {
          match_count: number
          match_threshold: number
          query_embedding: string
        }
        Returns: {
          category: string
          id: string
          similarity: number
          text_content: string
        }[]
      }
      match_linkedin_knowledge:
        | {
            Args: {
              match_count: number
              match_threshold: number
              query_embedding: string
            }
            Returns: {
              content: string
              id: string
              similarity: number
            }[]
          }
        | {
            Args: {
              match_count: number
              match_threshold: number
              p_user_id?: string
              query_embedding: string
            }
            Returns: {
              content: string
              id: string
              similarity: number
            }[]
          }
      match_user_style: {
        Args: {
          match_count: number
          match_threshold: number
          p_user_id: string
          query_embedding: string
        }
        Returns: {
          content: string
          id: string
          similarity: number
        }[]
      }
    }
    Enums: {
      app_language_enum: "en" | "es"
      plan_tier_enum: "free" | "pro" | "viral"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_language_enum: ["en", "es"],
      plan_tier_enum: ["free", "pro", "viral"],
    },
  },
} as const
