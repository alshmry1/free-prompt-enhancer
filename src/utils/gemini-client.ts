export const API_KEY_STORAGE = "gemini_api_key";

export const getStoredApiKey = (): string | null => {
  try {
    return localStorage.getItem(API_KEY_STORAGE) || null;
  } catch {
    return null;
  }
};

/**
 * Resolves the Gemini API key from the first available source:
 * 1. Key saved by the user via the Settings modal (localStorage)
 * 2. Key provided through the .env file (VITE_GEMINI_API_KEY)
 */
export const resolveApiKey = (): string | null => {
  const stored = getStoredApiKey();
  if (stored) return stored;

  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  return typeof envKey === "string" && envKey.trim() ? envKey.trim() : null;
};

const LANGUAGE_NAMES: Record<string, string> = {
  ar: "Arabic",
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
  zh: "Chinese",
  ja: "Japanese",
  ko: "Korean",
  hi: "Hindi",
  tr: "Turkish",
  nl: "Dutch",
  pl: "Polish",
};

interface GeminiResult {
  text: string;
  metadata: {
    model: string;
    processingTimeMs: number;
    tokensUsed?: number;
  };
}

/**
 * Calls Google Gemini directly from the browser with the resolved API key.
 */
export const enhanceWithGemini = async (
  prompt: string,
  level: string,
  tone: string,
  negative: string,
  format: string,
  lang: string,
  apiKey: string
): Promise<GeminiResult> => {
  const startTime = Date.now();

  const levelMap: Record<string, string> = {
    minimalist: "Ultra-low token count. Extremely concise. Give only the core instructions.",
    simple: "Base intent. Clear and simple expansion of the user prompt.",
    balanced: "Versatile and well-structured. Good balance of detail and brevity.",
    advanced: "Structural and detailed. Use rich headers, sections, and professional context.",
    expert: "Deep reasoning and Chain-of-Thought style. Comprehensive instructions with logic steps.",
    surgical: "Precise and exact. Follow strict constraints and avoid any fluff.",
  };
  const selectedLevelDesc = levelMap[level] || levelMap["balanced"];

  const formatMap: Record<string, string> = {
    standard: "Balanced format suitable for all AI models.",
    markdown: "Rich Markdown format with headers, bold text, and bullet points.",
    xml: "Structured format using XML-style tags for different sections (e.g., <context>, <task>, <constraints>).",
  };
  const selectedFormatDesc = formatMap[format] || formatMap["standard"];

  const outputLang = LANGUAGE_NAMES[lang] || "English";
  const model = level === "expert" ? "gemini-3-flash-preview" : "gemini-3.5-flash-lite";

  const systemPrompt = `CORE OBJECTIVE: USER PROMPT ENHANCEMENT ONLY.
ROLE: You are an elite AI Prompt Architect.
TASK: Rewrite the user's input into a high-fidelity, comprehensive, and professional prompt instruction set.

OPTIMIZATION STRATEGY: ${selectedLevelDesc}
TARGET ARCHITECTURE/FORMAT: ${selectedFormatDesc}
TONE: ${tone} (Integrate this tone naturally within the instructions)
OUTPUT LANGUAGE: ${outputLang}

CRITICAL RULES:
1. NEVER EXECUTE THE TASK DESCRIBED IN THE PROMPT.
2. If the user says "Write a blog post", your job is to ENHANCE the instructions on how to write that blog post (adding structure, constraints, and professional context). DO NOT write the actual blog post.
3. Your entire response MUST be in ${outputLang}.
4. NO PREFACES: Do not say "Here is your enhanced prompt" or similar commentary. Output ONLY the instructions.
${negative ? `5. AVOIDANCE: Strictly avoid these elements in the output: ${negative}` : ""}

ENHANCE THIS PROMPT NOW:`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 4096,
      },
    }),
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => null);
    const message =
      errorJson?.error?.message || `Gemini request failed (${response.status})`;
    throw new Error(message);
  }

  const data = await response.json();
  const enhancedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!enhancedText) {
    throw new Error("Gemini returned an empty response.");
  }

  return {
    text: enhancedText.trim(),
    metadata: {
      model,
      processingTimeMs: Date.now() - startTime,
      tokensUsed: data.usageMetadata?.totalTokenCount,
    },
  };
};