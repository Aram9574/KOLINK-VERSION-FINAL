export * from "./types/user";
export * from "./types/post";
export * from "./types/voice";
export * from "./types/audit";
export * from "./types/common";
export * from "./types/carousel";
export * from "./types/nexus";
export * from "./types/draft";

export interface UserContext {
    industry?: string;
    xp?: number | string;
    brand_voice?: string;
    company_name?: string;
}

export { type AppLanguage } from "./types/common";

export interface UserFeedback {
    id: string;
    user_id: string | null;
    content: string;
    rating: number | null;
    status: "new" | "reviewed" | "resolved";
    created_at: string;
}

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: "Paid" | "Pending" | "Failed";
  planName: string;
}
