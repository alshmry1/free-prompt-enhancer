import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Language name mapping for detected languages
const LANGUAGE_NAMES: Record<string, string> = {
  'ar': 'Arabic', 'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German',
  'it': 'Italian', 'pt': 'Portuguese', 'ru': 'Russian', 'zh': 'Chinese', 'ja': 'Japanese',
  'ko': 'Korean', 'hi': 'Hindi', 'tr': 'Turkish', 'nl': 'Dutch', 'pl': 'Polish'
}

function detectLanguage(text: string): string {
  if (!text) return 'en'
  if (/[\u0600-\u06FF]/.test(text)) return 'ar'
  if (/[\u4E00-\u9FFF]/.test(text)) return 'zh'
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'ja'
  return 'en'
}

function getLanguageName(langCode: string): string {
  return LANGUAGE_NAMES[langCode] || 'English'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const startTime = Date.now()
  let debugLog: string[] = []

  try {
    const body = await req.json().catch(e => {
      debugLog.push(`JSON Parse Error: ${e.message}`)
      return {}
    })

    // format is the 'Target Architecture' (standard, markdown, xml)
    const { prompt, level, tone, negative, lang, format } = body
    debugLog.push(`Processing: Level=${level}, Tone=${tone}, Format=${format}`)

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is missing', debug: debugLog }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const apiKey = Deno.env.get('OPENAI_API_KEY')
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'OPENAI_API_KEY secret missing', debug: debugLog }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const detectedLang = detectLanguage(prompt)
    const outputLang = (detectedLang === 'en' && lang && lang !== 'en') ? lang : detectedLang
    const langName = getLanguageName(outputLang)

    // Optimization Strategy Logic
    const levelMap: Record<string, string> = {
      'minimalist': 'Ultra-low token count. Extremely concise. Give only the core instructions.',
      'simple': 'Base intent. Clear and simple expansion of the user prompt.',
      'balanced': 'Versatile and well-structured. Good balance of detail and brevity.',
      'advanced': 'Structural and detailed. Use rich headers, sections, and professional context.',
      'expert': 'Deep reasoning and Chain-of-Thought style. Comprehensive instructions with logic steps.',
      'surgical': 'Precise and exact. Follow strict constraints and avoid any fluff.'
    }
    const selectedLevelDesc = levelMap[level] || levelMap['balanced']

    // Target Architecture Logic
    const formatMap: Record<string, string> = {
      'standard': 'Balanced format suitable for all AI models.',
      'markdown': 'Rich Markdown format with headers, bold text, and bullet points.',
      'xml': 'Structured format using XML-style tags for different sections (e.g., <context>, <task>, <constraints>).'
    }
    const selectedFormatDesc = formatMap[format] || formatMap['standard']

    const model = level === 'expert' ? 'gemini-3-flash-preview' : 'gemini-3.5-flash-lite'

    const systemPrompt = `CORE OBJECTIVE: USER PROMPT ENHANCEMENT ONLY.
ROLE: You are an elite AI Prompt Architect.
TASK: Rewrite the user's input into a high-fidelity, comprehensive, and professional prompt instruction set.

OPTIMIZATION STRATEGY: ${selectedLevelDesc}
TARGET ARCHITECTURE/FORMAT: ${selectedFormatDesc}
TONE: ${tone} (Integrate this tone naturally within the instructions)
OUTPUT LANGUAGE: ${langName}

CRITICAL RULES:
1. NEVER EXECUTE THE TASK DESCRIBED IN THE PROMPT.
2. If the user says "Write a blog post", your job is to ENHANCE the instructions on how to write that blog post (adding structure, constraints, and professional context). DO NOT write the actual blog post.
3. Your entire response MUST be in ${langName}.
4. NO PREFACES: Do not say "Here is your enhanced prompt" or similar commentary. Output ONLY the instructions.
${negative ? `5. AVOIDANCE: Strictly avoid these elements in the output: ${negative}` : ''}

ENHANCE THIS PROMPT NOW:`

    debugLog.push(`Using v1beta with model: ${model}`)

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

    const geminiRequest = {
      system_instruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 4096
      }
    }

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiRequest),
    })

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({ message: 'Unparseable API error' }))
      debugLog.push(`Gemini API Error: ${response.status}`)
      return new Response(JSON.stringify({
        error: `Gemini ${model} Error: ${errorJson.error?.message || response.statusText}`,
        debug: debugLog
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const data = await response.json()
    const enhancedText = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!enhancedText) {
      return new Response(JSON.stringify({ error: 'Gemini returned empty response. Check safety filters.', debug: debugLog, raw: data }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    return new Response(JSON.stringify({
      text: enhancedText.trim(),
      metadata: { model, processingTimeMs: Date.now() - startTime, debug: debugLog }
    }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: `Edge Function Exception: ${error.message}`, debug: debugLog }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
