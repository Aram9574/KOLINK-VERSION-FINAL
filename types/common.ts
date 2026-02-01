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

export interface AIFeedback {
    id?: string;
    user_id: string;
    input_context: any;
    output_content: string;
    rating: 1 | -1;
    metadata?: any;
    created_at?: string;
}
