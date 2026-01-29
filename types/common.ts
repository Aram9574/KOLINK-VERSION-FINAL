export type AppLanguage = "en" | "es";

export type AppTab =
  | "home"
  | "create"
  | "history"
  | "settings"
  | "autopilot"
  | "carousel"
  | "chat"
  | "editor"
  | "voice-lab"
  | "audit"
  | "insight-responder";

export interface CustomSource {
  id: string;
  type: "link" | "image" | "text" | "drive";
  content: string;
  name?: string;
  mimeType?: string;
}

export interface TourStep {
  targetId: string;
  title: string;
  description: string;
  position?: "top" | "right" | "bottom" | "left";
}

export interface Trend {
    id: string;
    title: string;
    summary: string;
    source: string;
    category: "news" | "social" | "search" | "regulatory";
    matchScore: number;
    timestamp: number;
    url?: string;
}

export interface ContentAngle {
    type: "visionary" | "implementer" | "analyst";
    title: string;
    hook: string;
    description: string;
}

export interface AIFeedback {
    id?: string;
    user_id: string;
    input_context: any;
    output_content: string;
    rating: 1 | -1;
    metadata?: any;
    created_at?: string;
}
