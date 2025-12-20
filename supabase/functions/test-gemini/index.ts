import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { AIService } from "../_shared/AIService.ts";

serve(async (req) => {
  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY missing" }), {
        status: 400,
      });
    }

    const service = new AIService(apiKey);

    // Test 1: Embedding
    console.log("Testing Embedding...");
    const embedding = await service.createEmbedding("Test");

    // Test 2: List Models
    let modelList = [];
    try {
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      );
      const data = await resp.json();
      if (data.models) {
        modelList = data.models.map((m: any) => m.name);
      } else {
        modelList = [
          "Error: No models found in response",
          JSON.stringify(data),
        ];
      }
    } catch (err: any) {
      modelList = [`Failed: ${err.message}`];
    }

    return new Response(
      JSON.stringify({
        success: true,
        embedding_dim: embedding.length,
        available_models: modelList,
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (e: any) {
    return new Response(
      JSON.stringify({
        error: e.message,
        stack: e.stack,
        details: e.toString(),
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
});
