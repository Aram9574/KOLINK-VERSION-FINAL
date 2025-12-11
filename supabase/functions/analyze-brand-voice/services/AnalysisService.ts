import { GoogleGenAI, Type } from 'https://esm.sh/@google/genai'

export interface AnalysisParams {
    contentSamples: string[];
    language: string;
}

export class AnalysisService {
    private ai: GoogleGenAI;
    private model = 'gemini-1.5-flash';

    constructor(apiKey: string) {
        this.ai = new GoogleGenAI({ apiKey });
    }

    async analyzeVoice(params: AnalysisParams) {
        const samples = params.contentSamples.join("\n---\n");
        const prompt = `
        You are an expert Ghostwriter and Brand Strategist.
        Analyze the following text samples from a LinkedIn creator. 
        Extract their unique "Brand Voice" so that an AI can ghostwrite exactly like them.
        
        Focus on:
        - Tone (e.g., specific adjectives like 'punchy', 'vulnerable', 'contrarian')
        - Sentence structure (e.g., short vs long, use of fragments)
        - Vocabulary (e.g., simple words, industry jargon, specific buzzwords)
        - Formatting quirks (e.g., bullet points, one-line paragraphs)
        - Emotional resonance (how it makes the reader feel)

        Target Language: ${params.language}
        
        Input Samples:
        ${samples}
        `;

        const response = await this.ai.models.generateContent({
            model: this.model,
            contents: prompt,
            config: {
                systemInstruction: "You are a brand voice analyst. Extract precise style instructions.",
                temperature: 0.5,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING, description: "A creative name for this style (e.g. 'The Empathetic Leader')" },
                        description: { type: Type.STRING, description: "A detailed prompt instruction that describes this voice perfectly to an LLM." },
                        keywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-5 adjectives describing the tone." }
                    },
                    required: ["name", "description", "keywords"]
                }
            }
        });

        const text = response.text;
        if (!text) throw new Error("No analysis generated");

        return JSON.parse(text);
    }
}
