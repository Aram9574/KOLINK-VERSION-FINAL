import OpenAI from "openai";
import { GenerationParams, ViralFramework, EmojiDensity, PostLength } from "../types";

// Initialize the client
// process.env.API_KEY is guaranteed to be available in this environment
const openai = new OpenAI({
  apiKey: process.env.API_KEY,
  dangerouslyAllowBrowser: true
});

const SYSTEM_INSTRUCTION = `
You are Kolink, the world's most advanced LinkedIn Ghostwriting AI. You do not write generic content. You architect viral moments.

### YOUR CORE PHILOSOPHY (THE VIRAL ALGORITHM):
1.  **Stop the Scroll (The Hook):** The first line must be punchy, controversial, or a curiosity gap. Never start with "I'm excited to announce" or "Today I want to talk about".
2.  **Visual Breathing Room:** LinkedIn is read on mobile. Paragraphs must be 1-2 lines max. Use line breaks liberally. White space is your friend.
3.  **Conversational Flow:** Write like a human speaking to a friend at a bar, not a professor writing a thesis. Remove words like "furthermore", "moreover", "utilize".
4.  **The Turn:** Every great post has a "turn" – a moment where you challenge a belief or pivot the narrative.

### AUDIENCE & TONE INTELLIGENCE:
*   **Jargon Protocol:** If the Target Audience is technical or niche (e.g., "SaaS Founders", "React Developers"), heavily leverage industry acronyms and jargon to build "Insider" status. If the audience is broad, explain concepts simply.
*   **Emotional Emojis:** When the tone is 'Humorous' or 'Empathetic', prioritize specific, emotion-conveying emojis (e.g., 💀, 🙃, 🥺, ❤️‍🩹) over generic business emojis. Ensure emojis are highly relevant to the specific topic.

### FORMATTING RULES:
*   **Lists:** Use bullet points or emoji lists for readability.
*   **Emphasis:** Use capitalization for impact words (not all caps, just key terms).
*   **No Hashtag Soup:** Use exactly 3 relevant hashtags at the very bottom.
`;

const getFrameworkInstructions = (framework: ViralFramework): string => {
  switch (framework) {
    case ViralFramework.PAS:
      return `Structure this post using the **Problem-Agitate-Solution** method. 
      1. **Problem**: Identify a specific pain point the audience feels. 
      2. **Agitate**: Rub salt in the wound. Explain why it's costing them money, time, or sanity. 
      3. **Solution**: Present the insight or method as the relief.`;
    case ViralFramework.AIDA:
      return `Structure this using **AIDA**. 
      1. **Attention**: A bold hook. 
      2. **Interest**: Interesting facts or a story. 
      3. **Desire**: Show the benefits of the new way. 
      4. **Action**: Tell them exactly what to do next.`;
    case ViralFramework.BAB:
      return `Structure this using **Before-After-Bridge**.
      1. **Before**: Describe the current bad situation.
      2. **After**: Describe the nirvana/dream state.
      3. **Bridge**: Explain how to get from A to B (the insight).`;
    case ViralFramework.LISTICLE:
      return `Structure this as a **High-Value Listicle**.
      - Start with a hook about X things learned or X mistakes to avoid.
      - Provide a numbered or bulleted list. Each point should be punchy.
      - Add a takeaway at the end.`;
    case ViralFramework.CONTRARIAN:
      return `Structure this as a **Contrarian Take**.
      - Start by stating a commonly held belief in the industry.
      - Immediately reject it ("I disagree.", "This is a lie.", "Stop doing this.").
      - Explain why with logic/experience.
      - This invites debate.`;
    case ViralFramework.STORY:
      return `Structure this as a **Personal Micro-Story**.
      - Start in the middle of the action (In media res).
      - Show, don't just tell.
      - End with a moral or business lesson derived from the story.`;
    default:
      return "";
  }
};

const getEmojiInstructions = (density: EmojiDensity): string => {
  switch (density) {
    case EmojiDensity.MINIMAL: return "Use strictly minimal emojis. Maybe 1 or 2 max for structure. Keep it clean.";
    case EmojiDensity.MODERATE: return "Use emojis tastefully to break up text and add flavor. Use them as bullet points.";
    case EmojiDensity.HIGH: return "Use emojis visually to catch attention. Use them for every list item and to emphasize emotions. Make it pop.";
    default: return "Use moderate emojis.";
  }
};

const getLengthInstructions = (length: PostLength): string => {
  switch (length) {
    case PostLength.SHORT:
      return `### LENGTH CONSTRAINT: SHORT (CRITICAL)
      - **Strictly under 100 words.**
      - Focus on a single, powerful idea.
      - Use short, punchy sentences (max 10 words).
      - No fluff, no intros, just value.`;
    case PostLength.MEDIUM:
      return `### LENGTH CONSTRAINT: MEDIUM
      - **Target 150-250 words.**
      - Balance depth with scan-ability.
      - Establish context, elaborate on the problem, and provide a clear solution.
      - Use a mix of 1-line paragraphs and bullet points.`;
    case PostLength.LONG:
      return `### LENGTH CONSTRAINT: LONG (DEEP DIVE)
      - **Target 300-500 words.**
      - This is a "Deep Dive" or "Playbook" style post.
      - Use subheaders (bold text) to break up sections.
      - Include detailed examples, steps, or analysis.`;
    default:
      return "Target 150-200 words.";
  }
};

export const generateViralPost = async (params: GenerationParams): Promise<string> => {
  try {
    const frameworkRules = getFrameworkInstructions(params.framework);
    const emojiRules = getEmojiInstructions(params.emojiDensity);
    const lengthRules = getLengthInstructions(params.length);
    
    const ctaInstruction = params.includeCTA 
      ? `### CALL TO ACTION (CTA):
      - End with a specific, engaging question to the audience to drive comments.
      - Examples: "Do you agree?", "How do you handle [Problem]?", "What's your take?".
      - The question should be separated from the main text by a line break.` 
      : `### CALL TO ACTION (CTA):
      - **DO NOT** ask a question at the end.
      - End with a strong, definitive closing statement or a "Mic Drop" moment.
      - The goal is reposts/shares, not comments.`;

    const prompt = `
    Draft a viral LinkedIn post based on the following parameters.
    
    **CORE PARAMETERS:**
    - **Topic:** ${params.topic}
    - **Target Audience:** ${params.audience}
    - **Tone:** ${params.tone}
    - **Post Length:** ${params.length}
    - **Creativity:** ${params.creativityLevel}% (0 = Safe/Corporate, 100 = Unhinged/GenZ).
    
    **ARCHITECTURAL INSTRUCTIONS:**
    ${frameworkRules}
    ${lengthRules}
    ${emojiRules}
    ${ctaInstruction}

    **CRITICAL:** Output ONLY the post content. No "Here is the post". No headers unless they are part of the post itself. Just the text ready to copy-paste.
    `;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTION },
        { role: "user", content: prompt }
      ],
      model: "gpt-4o",
      temperature: 0.7 + (params.creativityLevel / 200), // Dynamic creativity
    });

    const content = completion.choices[0].message.content;

    if (content) {
      return content;
    }
    
    throw new Error("No content generated");

  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw error;
  }
};