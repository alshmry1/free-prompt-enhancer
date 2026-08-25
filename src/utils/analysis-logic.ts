import { PromptTemplate } from "./i18n";

interface AnalysisResult {
  suggestions: string[];
  isValid: boolean;
}

interface AnalysisTranslations {
  [key: string]: {
    persona: string;
    context: string;
    format: string;
    constraints: string;
    specificity: string;
  };
}

export const analysisTranslations: AnalysisTranslations = {
  ar: {
    persona: "أضف شخصية أو دوراً لتحديد النبرة بشكل أفضل.",
    context: "زود السياق الخلفي لتقديم إرشادات أكثر دقة.",
    format: "حدد تنسيق الإخراج (مثل النقاط أو الفقرات) لتحسين البنية.",
    constraints: "أضف قيودًا واضحة لتجنب مخرجات غير مرغوب فيها.",
    specificity: "كن أكثر تحديدًا بها لتوجيه النتائج بدقة."
  },
  en: {
    persona: "Add a persona or role to better define the tone.",
    context: "Include background context to give more precise instructions.",
    format: "Specify an output format (like bullet points or paragraphs) to improve structure.",
    constraints: "Add clear constraints to avoid unwanted outputs.",
    specificity: "Be more specific to guide the results accurately."
  },
  es: {
    persona: "Añade una personalidad o rol para definir mejor el tono.",
    context: "Incluye contexto de fondo para dar instrucciones más precisas.",
    format: "Especifica un formato de salida (como puntos o párrafos) para mejorar la estructura.",
    constraints: "Agrega restricciones claras para evitar salidas no deseadas.",
    specificity: "Sé más específico para guiar los resultados con precisión."
  },
  fr: {
    persona: "Ajoutez une personnalité ou un rôle pour mieux définir le ton.",
    context: "Incluez un contexte pour donner des instructions plus précises.",
    format: "Spécifiez un format de sortie (comme les puces ou les paragraphes) pour améliorer la structure.",
    constraints: "Ajoutez des contraintes claires pour éviter les sorties indésirables.",
    specificity: "Soyez plus spécifique pour guider les résultats avec précision."
  },
  de: {
    persona: "Fügen Sie eine Persona oder Rolle hinzu, um den Ton besser zu definieren.",
    context: "Geben Sie Hintergrundkontext für präzisere Anweisungen an.",
    format: "Geben Sie ein Ausgabeformat an (wie Aufzählungen oder Absätze) für eine bessere Struktur.",
    constraints: "Fügen Sie klare Einschränkungen hinzu, um unerwünschte Ausgaben zu vermeiden.",
    specificity: "Seien Sie spezifischer, um die Ergebnisse genau zu steuern."
  },
  it: {
    persona: "Aggiungi una personalità o un ruolo per definire meglio il tono.",
    context: "Includi il contesto per dare istruzioni più precise.",
    format: "Specifica un formato di output (come punti o paragrafi) per migliorare la struttura.",
    constraints: "Aggiungi vincoli chiari per evitare output indesiderati.",
    specificity: "Sii più specifico per guidare i risultati con precisione."
  },
  pt: {
    persona: "Adicione uma personalidade ou função para definir melhor o tom.",
    context: "Inclua contexto para fornecer instruções mais precisas.",
    format: "Especifique um formato de saída (como pontos ou parágrafos) para melhorar a estrutura.",
    constraints: "Adicione restrições claras para evitar saídas indesejadas.",
    specificity: "Seja mais específico para direcionar os resultados com precisão."
  },
  ru: {
    persona: "Добавьте персонажа или роль, чтобы лучше определить тон.",
    context: "Включите фоновый контекст для более точных инструкций.",
    format: "Укажите формат вывода (например, пункты или абзацы) для улучшения структуры.",
    constraints: "Добавьте четкие ограничения, чтобы избежать нежелательных выходов.",
    specificity: "Будьте более конкретны, чтобы точно направлять результаты."
  },
  zh: {
    persona: "添加人物或角色以更好地定义语气。",
    context: "包含背景上下文以提供更精确的指示。",
    format: "指定输出格式（如项目符号或段落）以改善结构。",
    constraints: "添加清晰的约束条件以避免不需要的输出。",
    specificity: "更加具体，以准确指导结果。"
  },
  ja: {
    persona: "人格や役割を追加して、トーンをより明確に定義します。",
    context: "背景コンテキストを含めて、より正確な指示を提供します。",
    format: "出力形式（箇条書きや段落など）を指定して、構造を改善します。",
    constraints: "不要な出力を避けるために、明確な制約を追加します。",
    specificity: "結果を正確に導くためにより具体的にしてください。"
  },
  ko: {
    persona: "인물이나 역할을 추가하여 톤을 더 잘 정의하세요.",
    context: "더 정확한 지침을 제공하기 위해 배경 컨텍스트를 포함하세요.",
    format: "구조를 개선하기 위해 출력 형식(글머리 기호나 문단 등)을 지정하세요.",
    constraints: "원하지 않는 출력을 피하기 위해 명확한 제약 조건을 추가하세요.",
    specificity: "결과를 정확하게 안내하기 위해 더 구체적으로 하세요."
  },
  hi: {
    persona: "टोन को बेहतर ढंग से पoutlined करने के लिए एक व्यक्तित्व या भूमिका जोड़ें।",
    context: "अधिक सटीक निर्देश देने के लिए पृष्ठभूमि संदर्भ शामिल करें।",
    format: "संरचना में सुधार के लिए आउटपुट स्वरूप (जैसे बुलेट पॉइंट या पैराग्राफ) निर्दिष्ट करें।",
    constraints: "अवशंक्क परिणामों से बचने के लिए स्पष्ट बाधाएं जोड़ें।",
    specificity: "ईंधन के परिणामों की दिशा निर्धारित करने के लिए अधिक विशिष्ट हों।"
  },
  tr: {
    persona: "Tonu daha iyi tanımlamak için bir kişilik veya rol ekleyin.",
    context: "Daha hassas talimatlar vermek için arka plan bağlamı ekleyin.",
    format: "Yapıyı geliştirmek için bir çıktı formatı belirleyin (örneğin madde işaretleri veya paragraflar).",
    constraints: "İstenmeyen çıktılardan kaçınmak için net kısıtlamalar ekleyin.",
    specificity: "Sonuçları doğru yönlendirmek için daha spesifik olun."
  },
  nl: {
    persona: "Voeg een persona of rol toe om de toon beter te definiëren.",
    context: "Neem achtergrondcontext op voor nauwkeurigere instructies.",
    format: "Geef een output-indeling op (zoals opsommingen of alinea's) om de structuur te verbeteren.",
    constraints: "Voeg duidelijke beperkingen toe om ongewenste output te vermijden.",
    specificity: "Wees specifieker om de resultaten nauwkeurig te sturen."
  },
  pl: {
    persona: "Dodaj personę lub rolę, aby lepiej zdefiniować ton.",
    context: "Dołącz kontekst w tle, aby zapewnić bardziej precyzyjne instrukcje.",
    format: "Określ format wyjściowy (np. punkty lub akapity), aby poprawić strukturę.",
    constraints: "Dodaj wyraźne ograniczenia, aby uniknąć niepożądanych wyników.",
    specificity: "Bądź bardziej konkretny, aby precyzyjnie kierować wynikami."
  }
};

/**
 * Analyzes a prompt and returns suggestions for improvement
 */
export const analyzePrompt = (
  prompt: string,
  detectedLang: string = 'en'
): AnalysisResult => {
  const t = analysisTranslations[detectedLang] || analysisTranslations['en'];
  const suggestions: string[] = [];

  if (!prompt || prompt.trim().length < 5) {
    return { suggestions: [], isValid: false };
  }

  const lowerPrompt = prompt.toLowerCase();

  // Persona check
  const hasPersona = /\b(as|act as|you are|pretend to be|role of|in the role of|en tant que|als|come si|como|jak|как|作为|として|તરીકે|olarak|jako)\b/i.test(lowerPrompt) &&
                      /\b(expert|teacher|professor|doctor|engineer|writer|analyst|specialist|coach|consultant|therapist|lawyer|chef|scientist|advisor|adviser)\b/i.test(lowerPrompt);

  if (!hasPersona) {
    suggestions.push(t.persona);
  }

  // Context check
  const hasContext = /\b(background|context|given that|assuming|in this scenario|situation|faced with|you are working on|you are developing|in the domain of|within the framework of|dans le contexte|im Kontext|nel contesto|no contexto|в контексте|在...背景|...の文脈で|સंદર્ભમાં|bağlamında|in de context)\b/i.test(lowerPrompt) ||
                     prompt.length > 30;

  if (prompt.length < 30 || !hasContext) {
    suggestions.push(t.context);
  }

  // Format check
  const hasFormat = /\b(format|structure|outline|organized|as a list|bullet points|markdown|json|xml|table|step by step|step-by-step|steps|procedure|instructions|recipe|plan|framework|template|layout|sections|headings|numbered)\b/i.test(lowerPrompt) ||
                   /\b(return|provide|create|write|generate|output|produce|deliver|give me)\b.*?\b(list|steps|format|structured|organized|numbered|outlined)\b/i.test(lowerPrompt);

  if (!hasFormat) {
    suggestions.push(t.format);
  }

  // Constraints check
  const hasConstraints = /\b(avoid|don't|donot|do not|no |never|must not|should not|cannot|can not|without|exclude|omit|skip|restrict|limit|minimum|maximum|max |min |constraint|rule|requirement|criteria|condition|only|must be|should be|need to)\b/i.test(lowerPrompt);

  if (!hasConstraints) {
    suggestions.push(t.constraints);
  }

  // Specificity check
  const vagueWords = /\b(good|bad|nice|quick|fast|easy|hard|big|small|many|few|a lot|some|thing|stuff|work|help|deal with|handle|solve|figure out|make|get)\b/i;
  const specificWords = /\b(measurable|specific|quantifiable|detailed|precise|exact|concrete|clear|defined|target|goal|objective|metric|kpi|threshold|requirement|specification|parameter|boundary|condition|constraint|limitation|criterion)\b/i;

  if (vagueWords.test(lowerPrompt) && !specificWords.test(lowerPrompt)) {
    suggestions.push(t.specificity);
  }

  return { suggestions: suggestions.slice(0, 3), isValid: suggestions.length < 4 };
};