export interface NexusConversation {
    id: string;
    user_id: string;
    messages: Record<string, any>[];
    context_data: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export interface Fragment {
    id: string;
    user_id: string;
    name: string;
    content: string;
    usage_count: number;
    created_at: string;
    updated_at: string;
}
