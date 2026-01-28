import { BaseAIService } from "../_shared/services/BaseAIService.ts";
import { z } from "npm:zod";

const TestSchema = z.object({
  name: z.string(),
  age: z.number(),
  tags: z.array(z.string())
});

// 1. Deno.serve (Native)
Deno.serve(async (req) => {
  try {
    const aiService = new BaseAIService(Deno.env.get("GEMINI_API_KEY")!);
    
    // 1. Test Success Case
    console.log("Testing Success Case...");
    const successResult = await aiService.generateWithSchema(
      "gemini-2.0-flash-001",
      "Generate a JSON for a person named 'Aram', age 30, with tags ['developer', 'ai'].",
      TestSchema
    );
    
    // 2. Test Failure/Retry Case (Provoke invalid schema)
    // We ask for a "list of numbers" which violates the object schema
    // This should fail validation and retry, eventually throwing if it can't fix it.
    console.log("Testing Validation Failure Case...");
    let errorCaught = false;
    try {
        await aiService.generateWithSchema(
            "gemini-2.0-flash-001", 
            "Generate a simple list of 5 numbers: [1, 2, 3, 4, 5]. Do NOT output an object.", 
            TestSchema
        );
    } catch (e) {
        console.log("Caught expected validation error:", e.message);
        errorCaught = true;
    }

    return new Response(JSON.stringify({ 
        success: true, 
        data: successResult,
        validation_guard_working: errorCaught 
    }), { 
        headers: { "Content-Type": "application/json" } 
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
    });
  }
});
