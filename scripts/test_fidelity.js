import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.GOOGLE_API_KEY;

if (!API_KEY) {
    console.error("Error: No API KEY found in .env.local");
    process.exit(1);
}

const SYSTEM_INSTRUCTION = `
You are Kolink, the world's most advanced LinkedIn Ghostwriting AI.
You have two simultaneous roles:
1. **The Architect:** You write viral, high-impact content that feels human, authentic, and authoritative.
2. **The Auditor:** You rigorously grade the content you just wrote based on LinkedIn algorithm factors.

### STYLE GUIDE (NON-NEGOTIABLE):
- **No Corporate Jargon:** Ban words like "synergy", "landscape", "delighted", "thrilled", "game-changer", "unleash", "unlock", "elevate".
- **Write Like a Human:** Use sentence fragments. Vary sentence length. Use simple words (Grade 5 level). Write as if you are speaking to a friend at a bar.
- **Be Specific:** Don't say "add value", say "save $500/month". Don't say "be consistent", say "post daily at 8am".
- **One Idea Per Line:** For emphasis, use single-line paragraphs.
- **Visual Breathing Room:** Use whitespace generously.
- **No Fluff:** Every sentence must earn its place. If it doesn't add new information, delete it.

### ANTI-PATTERNS (NEVER DO THIS):
- Never start with "I'm excited to announce..." or "In today's fast-paced world..."
- Never use hashtags inline (only at the end).
- Never use more than 3 hashtags.
- Never be neutral. Have an opinion.
- Never use "AI" sounding structures like "Here are 5 tips:" unless specifically asked for a listicle.
`;

const prompt = `
Draft a viral LinkedIn post about: "The future of AI in Marketing".
Target Audience: Marketing Directors.
Tone: Contrarian/Bold.
Framework: PAS (Problem-Agitate-Solution).

**CRITICAL:** Format the output as a JSON object containing 'post_content' and 'viral_score'.
`;

async function runTest() {
    console.log("🧪 Starting Fidelity Test with model: gemini-3-pro-preview...");

    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const model = 'gemini-3-pro-preview';

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                temperature: 0.8,
                responseMimeType: "application/json"
            }
        });

        const text = response.text;
        console.log("\n✨ GENERATED CONTENT:\n");
        console.log(JSON.parse(text).post_content);
        console.log("\n-----------------------------------");
        console.log("✅ Test Passed: Content generated successfully.");

    } catch (error) {
        console.error("❌ Test Failed:", error.message);
        console.log("Note: If 'gemini-3-pro-preview' is not available yet, try 'gemini-1.5-pro-002'.");
    }
}

runTest();
