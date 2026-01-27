export interface Draft {
    id: string;
    user_id: string;
    type: "post" | "carousel";
    content: Record<string, any>;
    last_saved_at: string;
    created_at: string;
}

export interface ScheduledPost {
    id: string;
    user_id: string;
    post_id: string;
    scheduled_datetime: string;
    status: "pending" | "published" | "failed";
    linkedin_scheduled_id?: string;
    created_at: string;
    updated_at: string;
}
