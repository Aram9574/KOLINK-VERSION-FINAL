import { SupabaseClient } from "npm:@supabase/supabase-js@2";

export class MemoryService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Retrieves all memories for a user.
   */
  async getMemories(userId: string): Promise<Record<string, string>> {
     const { data, error } = await this.supabase
       .from("agent_memory")
       .select("key, value")
       .eq("user_id", userId);
     
     if (error) {
         console.error("Memory Fetch Error:", error);
         return {};
     }

     // Convert to easy Key-Value map
     return data.reduce((acc, mem) => {
         acc[mem.key] = mem.value;
         return acc;
     }, {} as Record<string, string>);
  }

  /**
   * Adds or updates a memory fact.
   */
  async remember(userId: string, category: string, key: string, value: string): Promise<void> {
    const { error } = await this.supabase
        .from("agent_memory")
        .upsert({
            user_id: userId,
            category,
            key,
            value,
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id, key' });

    if (error) {
        console.error("Memory Store Error:", error);
    } else {
        console.log(`[Memory] Stored: ${key} = ${value}`);
    }
  }

  /**
   * Forgets a specific memory key.
   */
  async forget(userId: string, key: string): Promise<void> {
      await this.supabase.from("agent_memory").delete().match({ user_id: userId, key });
  }

  /**
   * Constructs a system prompt block from memories.
   */
  async getMemoryContextBlock(userId: string): Promise<string> {
      const memories = await this.getMemories(userId);
      const keys = Object.keys(memories);
      
      if (keys.length === 0) return "";

      return `
      ### 🧠 LONG-TERM MEMORY (USER FACTS)
      I know the following strictly true facts about this user and their preferences. 
      I must respect these above all general defaults:
      ${keys.map(k => `- **${k}**: ${memories[k]}`).join('\n')}
      `;
  }
}
