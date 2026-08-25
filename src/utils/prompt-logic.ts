import { Language } from "./i18n";

export type EnhancementLevel = 'minimalist' | 'simple' | 'advanced' | 'expert' | 'balanced' | 'surgical';

// Language name mapping for detected languages
const LANGUAGE_NAMES: Record<string, string> = {
  'ar': 'Arabic',
  'en': 'English',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'zh': 'Chinese',
  'ja': 'Japanese',
  'ko': 'Korean',
  'hi': 'Hindi',
  'tr': 'Turkish',
  'nl': 'Dutch',
  'pl': 'Polish'
};

/**
 * Detects the language of the input text based on character patterns and common words
 * Returns a language code (e.g., 'ar', 'en', 'es', 'fr', 'de')
 */
export const detectLanguage = (text: string): string => {
  if (!text || text.trim().length === 0) {
    return 'en'; // Default to English for empty text
  }

  // Arabic: Check for Arabic Unicode range (strong indicator)
  if (/[\u0600-\u06FF]/.test(text)) return 'ar';

  // Chinese: Check for Chinese characters
  if (/[\u4E00-\u9FFF]/.test(text)) return 'zh';

  // Japanese: Check for Hiragana and Katakana
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'ja';

  // Korean: Check for Hangul
  if (/[\uAC00-\uD7AF]/.test(text)) return 'ko';

  // Russian: Check for Cyrillic
  if (/[\u0400-\u04FF]/.test(text)) return 'ru';

  // Hindi: Check for Devanagari
  if (/[\u0900-\u097F]/.test(text)) return 'hi';

  // Turkish: Check for Turkish-specific characters
  if (/[ğüşöçİıĞÜŞÖÇ]/.test(text)) return 'tr';

  // For Latin-based languages, check common words
  const lowerText = text.toLowerCase();

  // English: Check for common English-only words first to avoid false positives in Romance languages
  const englishWords = /\b(the|and|that|for|with|this|from|which|would|there|their|about|where|when|who|how)\b/;
  if (englishWords.test(lowerText)) return 'en';

  // Spanish: Check for common Spanish patterns
  const spanishWords = /\b(el|la|los|las|es|en|de|que|y|un|una|por|para|con|sin|sobre|entre|hacia|hasta)\b/;
  const spanishPatterns = /ción|mente|idad|¿|¡/;
  if (spanishWords.test(lowerText) || spanishPatterns.test(text)) return 'es';

  // French: Check for common French patterns
  const frenchWords = /\b(le|la|les|de|du|des|et|est|en|que|un|une|dans|pour|avec|sur|par)\b/;
  const frenchPatterns = /tion|ment|eur|euse|eux|ç|œ|î|ô|é|è|ê|à|ù/;
  if (frenchWords.test(lowerText) || frenchPatterns.test(text)) return 'fr';

  // German: Check for common German patterns
  const germanWords = /\b(der|die|das|und|ist|von|zu|den|ein|eine|für|mit|auf|nicht|sich|als|auch)\b/;
  const germanPatterns = /ung|heit|keit|schaft|lich|isch|ß|ä|ö|ü/;
  if (germanWords.test(lowerText) || germanPatterns.test(text)) return 'de';

  // Italian: Check for common Italian patterns
  const italianWords = /\b(il|lo|la|gli|le|di|che|e|è|un|una|per|con|non|sono|come|ma)\b/;
  const italianPatterns = /zione|mente|ità/;
  if (italianWords.test(lowerText) || italianPatterns.test(text)) return 'it';

  // Portuguese: Check for common Portuguese patterns
  const portugueseWords = /\b(o|os|as|do|da|pelo|pela|uma|para|com|não|em|por)\b/;
  const portuguesePatterns = /ção|ões|ão|nh|lh|çã|çõ/;
  if (portugueseWords.test(lowerText) || portuguesePatterns.test(text)) return 'pt';

  // Dutch: Check for common Dutch patterns
  const dutchWords = /\b(de|het|een|van|en|is|op|te|dat|die|voor|with|zijn|aan|ook)\b/;
  const dutchPatterns = /ij|oe|aa|ee|oo|uu/;
  if (dutchWords.test(lowerText) || dutchPatterns.test(text)) return 'nl';

  // Polish: Check for common Polish patterns
  const polishPatterns = /ą|ć|ę|ł|ń|ó|ś|ź|ż/;
  if (polishPatterns.test(text)) return 'pl';

  // Default to English
  return 'en';
};

/**
 * Gets the human-readable language name from a language code
 */
export const getLanguageName = (langCode: string): string => {
  return LANGUAGE_NAMES[langCode] || 'English';
};
// ------------------------------------------------------------------
// Type Definitions & Helper Functions
// ------------------------------------------------------------------

export type PromptTone =
  | 'professional'
  | 'creative'
  | 'academic'
  | 'concise'
  | 'empathetic'
  | 'humorous'
  | 'direct'
  | 'motivational'
  | 'skeptical'
  | 'teacher'
  | 'technical';
export type OutputFormat = 'standard' | 'markdown' | 'xml';

interface EnhancedResult {
  text: string;
  techniques: string[];
  tokenEstimate: number;
  warnings?: string[];
}

// Constants for validation
const MAX_PROMPT_LENGTH = 8000;
const CHARS_PER_TOKEN = 4; // Rough estimate: ~4 characters per token

/**
 * Estimates token count based on character count
 * Uses a rough approximation of 4 characters per token
 */
export const estimateTokenCount = (text: string): number => {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
};

/**
 * Validates the input prompt
 * Returns an object with validation result and any error messages
 */
export const validatePrompt = (prompt: string): { isValid: boolean; errors: string[]; warnings: string[] } => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for empty or whitespace-only prompts
  if (!prompt || !prompt.trim()) {
    errors.push("Prompt cannot be empty or contain only whitespace");
    return { isValid: false, errors, warnings };
  }

  // Check for maximum length
  if (prompt.length > MAX_PROMPT_LENGTH) {
    errors.push(`Prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters (current: ${prompt.length})`);
  }

  // Add warning for very short prompts
  if (prompt.trim().length < 10) {
    warnings.push("Prompt is very short and may not produce optimal results");
  }

  // Add warning for very long prompts
  if (prompt.length > 5000) {
    warnings.push("Prompt is quite long; consider breaking it into smaller parts for better results");
  }

  return { isValid: errors.length === 0, errors, warnings };
};


// Translation dictionary for prompt templates
const TEMPLATE_TRANSLATIONS: Record<string, {
  // Common
  tone: string;
  outputIn: string;
  language: string;
  avoiding: string;
  important: string;
  respondIn: string;
  langName: string;

  // Values
  max: string;
  high: string;
  taskSpecific: string;
  structuredScannable: string;
  techAccuracy: string;
  immediateApplicability: string;
  addressAllAspects: string;
  verifyAllClaims: string;

  // Tone names
  professional: string;
  creative: string;
  academic: string;
  concise: string;
  empathetic: string;
  humorous: string;
  direct: string;
  motivational: string;
  skeptical: string;
  teacher: string;
  technical: string;

  // Simple
  asExpert: string;
  pleaseCraft: string;
  ensureOutput: string;
  regarding: string;
  coveringCore: string;
  usingA: string;

  // Balanced
  actingSpecialist: string;
  provideStructured: string;
  objectives: string;
  defineGoals: string;
  analysis: string;
  examineKey: string;
  implementation: string;
  provideActionable: string;
  maintainTone: string;

  // Advanced
  distinguishedExpert: string;
  seekExpertise: string;
  expertPersona: string;
  actThoughtLeader: string;
  currentLandscape: string;
  summarizeContext: string;
  detailedAnalysis: string;
  exploreCore: string;
  bestPractices: string;
  provideInsights: string;
  futureOutlook: string;
  offerProjections: string;
  leverageKnowledge: string;

  // Surgical
  precisionProtocol: string;
  taskSpecification: string;
  executionParameters: string;
  depth: string;
  precision: string;
  constraints: string;
  scope: string;
  outputRequirements: string;
  format: string;
  detailLevel: string;
  actionability: string;
  qualityMetrics: string;
  completeness: string;
  accuracy: string;
  executeExactness: string;

  // Expert
  firstPrinciples: string;
  coreQuestion: string;
  foundationalReasoning: string;
  deconstructProblem: string;
  historicalContext: string;
  traceEvolution: string;
  theoreticalFramework: string;
  establishPrinciples: string;
  detailedAnalysisExpert: string;
  examineComplex: string;
  edgeCases: string;
  identifyBoundary: string;
  expertOptimizations: string;
  provideAdvanced: string;
  synthesis: string;
  integrateInsights: string;
  responseRequirements: string;
  exhaustiveCoverage: string;
  writtenExclusively: string;
  expertLevelDepth: string;
}> = {
  ar: {
    tone: "النبرة",
    outputIn: "الإخراج باللغة",
    language: "اللغة",
    avoiding: "تجنب",
    important: "مهم",
    respondIn: "الرد باللغة",
    langName: "العربية",

    // Values
    max: "أقصى",
    high: "عالٍ",
    taskSpecific: "خاص بالمهمة فقط",
    structuredScannable: "منظم وقابل للمسح",
    techAccuracy: "دقة تقنية في كل عبارة",
    immediateApplicability: "تطبيق فوري مطلوب",
    addressAllAspects: "معالجة جميع جوانب المهمة",
    verifyAllClaims: "التحقق من جميع الادعاءات والتوصيات",

    // Tone names
    professional: "احترافية",
    creative: "إبداعية",
    academic: "أكاديمية",
    concise: "موجزة",
    empathetic: "متعاطفة",
    humorous: "فكاهية",
    direct: "مباشرة",
    motivational: "تحفيزية",
    skeptical: "نقدية",
    teacher: "تعليمية",
    technical: "تقنية",

    asExpert: "بصفتك خبيراً في هذا المجال،",
    pleaseCraft: "يرجى صياغة رد مفصل بنبرة",
    ensureOutput: "تأكد من أن الناتج شامل ومكتوب باللغة",
    regarding: "بشأن:",
    coveringCore: "، مع تغطية المفاهيم الأساسية والتطبيقات العملية.",
    usingA: "، بنبرة",

    // Balanced
    actingSpecialist: "بصفتك متخصصاً، قدم رداً جيد التنظيم حول ما يلي:",
    provideStructured: "قدم رداً جيد التنظيم",
    objectives: "## الأهداف",
    defineGoals: "حدد الأهداف الرئيسية والنتائج المتوقعة.",
    analysis: "## التحليل",
    examineKey: "افحص المكونات الرئيسية والعلاقات والمبادئ الأساسية.",
    implementation: "## التنفيذ",
    provideActionable: "قدم خطوات قابلة للتنفيذ وتوصيات عملية.",
    maintainTone: "حافظ على نبرة",

    distinguishedExpert: "أنت خبير مرموق ولديك خبرة واسعة في موضوع:",
    seekExpertise: "أطلب خبرتك لتطوير رد شامل ورؤية ثاقبة.",
    expertPersona: "## شخصية الخبير",
    actThoughtLeader: "تصرف كقائد فكري ذو معرفة عميقة وخبرة عملية.",
    currentLandscape: "## المشهد الحالي",
    summarizeContext: "لخص السياق الحالي، والمناهج الحديثة، والتطورات الأخيرة.",
    detailedAnalysis: "## تحليل مفصل",
    exploreCore: "استكشف الآليات الأساسية والمبادئ الضمنية والاعتبارات الدقيقة.",
    bestPractices: "## أفضل الممارسات",
    provideInsights: "قدم رؤى قابلة للتنفيذ، ومنهجيات مثبتة، وتوصيات الخبراء.",
    futureOutlook: "## النظرة المستقبلية",
    offerProjections: "قدم توقعات بناءً على الاتجاهات الحالية والتطورات الناشئة.",
    leverageKnowledge: "استفد من معرفتك المتخصصة لإنتاج رد موثوق وجذاب",

    precisionProtocol: "## بروتوكول الدقة",
    taskSpecification: "### مواصفات المهمة",
    executionParameters: "### معايير التنفيذ",
    depth: "العمق",
    precision: "الدقة",
    constraints: "### القيود",
    scope: "النطاق",
    outputRequirements: "### متطلبات الإخراج",
    format: "التنسيق",
    detailLevel: "مستوى التفاصيل",
    actionability: "قابلية التنفيذ",
    qualityMetrics: "### مقاييس الجودة",
    completeness: "الشمولية",
    accuracy: "الدقة",
    executeExactness: "نفذ بدقة وإحكام تقني طوال الوقت.",

    firstPrinciples: "## تحليل المبادئ الأولى",
    coreQuestion: "### السؤال الجوهري",
    foundationalReasoning: "### الاستدلال التأسيسي",
    deconstructProblem: "فكك هذه المشكلة إلى حقائقها الأساسية وابنِ من هناك. حدد المكونات غير القابلة للاختزال وعلاقاتها.",
    historicalContext: "### السياق التاريخي",
    traceEvolution: "تتبع تطور هذا المجال، والاختراقات الرئيسية، والتحولات النموذجية التي تشكل الفهم الحالي.",
    theoreticalFramework: "### الإطار النظري",
    establishPrinciples: "أسس المبادئ والنماذج والنظريات التي تحكم هذا المجال.",
    detailedAnalysisExpert: "### تحليل مفصل",
    examineComplex: "افحص التفاعلات المعقدة والتبعيات والفروق الدقيقة التي تؤثر على النتائج.",
    edgeCases: "### الحالات الحدية والاستثناءات",
    identifyBoundary: "حدد الشروط الحدودية، والسيناريوهات غير العادية، وأنماط الفشل المحتملة.",
    expertOptimizations: "### تحسينات الخبراء",
    provideAdvanced: "قدم تقنيات متقدمة، واختصارات، وتحسينات معروفة فقط للممارسين.",
    synthesis: "### التركيب والتوصيات",
    integrateInsights: "دمج جميع الرؤى في توصيات قابلة للتنفيذ مع مبررات واضحة.",
    responseRequirements: "**متطلبات الرد:**",
    exhaustiveCoverage: "- تغطية شاملة بنبرة",
    writtenExclusively: "- مكتوب حصرياً باللغة",
    expertLevelDepth: "- عمق ودقة على مستوى الخبراء"
  },
  es: {
    tone: "tono",
    outputIn: "Salida en",
    language: "Idioma",
    avoiding: "Evitando",
    important: "IMPORTANTE",
    respondIn: "Responder en",
    langName: "Español",

    // Values
    max: "Máximo",
    high: "Alto",
    taskSpecific: "Solo específico de la tarea",
    structuredScannable: "Estructurado y escaneable",
    techAccuracy: "Precisión técnica en cada declaración",
    immediateApplicability: "Se requiere aplicabilidad inmediata",
    addressAllAspects: "Abordar todos los aspectos de la tarea",
    verifyAllClaims: "Verificar todas las afirmaciones y recomendaciones",

    // Tone names
    professional: "profesional",
    creative: "creativo",
    academic: "académico",
    concise: "conciso",
    empathetic: "empático",
    humorous: "humorístico",
    direct: "directo",
    motivational: "motivador",
    skeptical: "escéptico",
    teacher: "profesor",
    technical: "técnico",

    asExpert: "Como experto en este campo,",
    pleaseCraft: "por favor redacta una respuesta detallada:",
    ensureOutput: "Asegura que la salida sea completa y escrita en",
    regarding: "con respecto a:",
    coveringCore: ", cubriendo conceptos básicos y aplicaciones prácticas.",
    usingA: ", utilizando un",

    // Balanced
    actingSpecialist: "Actuando como especialista, proporciona una respuesta bien estructurada a lo siguiente:",
    provideStructured: "proporciona una respuesta bien estructurada",
    objectives: "## Objetivos",
    defineGoals: "Define los objetivos principales y los resultados esperados.",
    analysis: "## Análisis",
    examineKey: "Examina los componentes clave, las relaciones y los principios subyacentes.",
    implementation: "## Implementación",
    provideActionable: "Proporciona pasos accionables y recomendaciones prácticas.",
    maintainTone: "Mantén un tono",

    distinguishedExpert: "Eres un experto distinguido con amplia experiencia en la materia de:",
    seekExpertise: "Busco tu experiencia para desarrollar una respuesta completa y perspicaz.",
    expertPersona: "## Persona Experta",
    actThoughtLeader: "Actúa como un líder de pensamiento con profundo conocimiento del dominio y experiencia práctica.",
    currentLandscape: "## Panorama Actual",
    summarizeContext: "Resume el contexto existente, los enfoques de vanguardia y los avances recientes.",
    detailedAnalysis: "## Análisis Detallado",
    exploreCore: "Explora la mecánica central, los principios subyacentes y las consideraciones matizadas.",
    bestPractices: "## Mejores Prácticas",
    provideInsights: "Proporciona ideas accionables, metodologías probadas y recomendaciones expertas.",
    futureOutlook: "## Perspectiva Futura",
    offerProjections: "Ofrece proyecciones basadas en las tendencias actuales y los desarrollos emergentes.",
    leverageKnowledge: "Aprovecha tu conocimiento especializado para producir una respuesta autorizada y atractiva en",

    precisionProtocol: "## PROTOCOLO DE PRECISIÓN",
    taskSpecification: "### Especificación de la Tarea",
    executionParameters: "### Parámetros de Ejecución",
    depth: "Profundidad",
    precision: "Precisión",
    constraints: "### Restricciones",
    scope: "Alcance",
    outputRequirements: "### Requisitos de Salida",
    format: "Formato",
    detailLevel: "Nivel de Detalle",
    actionability: "Accionabilidad",
    qualityMetrics: "### Métricas de Calidad",
    completeness: "Integridad",
    accuracy: "Exactitud",
    executeExactness: "Ejecuta con exactitud y precisión técnica en todo momento.",

    firstPrinciples: "## Análisis de Primeros Principios",
    coreQuestion: "### Pregunta Central",
    foundationalReasoning: "### Razonamiento Fundamental",
    deconstructProblem: "Deconstruye este problema en sus verdades fundamentales y constrúyelo desde ahí. Identifica los componentes irreducibles y sus relaciones.",
    historicalContext: "### Contexto Histórico",
    traceEvolution: "Rastrea la evolución de este dominio, los avances clave y los cambios de paradigma que informan la comprensión actual.",
    theoreticalFramework: "### Marco Teórico",
    establishPrinciples: "Establece los principios, modelos y teorías subyacentes que gobiernan este dominio.",
    detailedAnalysisExpert: "### Análisis Detallado",
    examineComplex: "Examina interacciones complejas, dependencias y matices que afectan los resultados.",
    edgeCases: "### Casos Límite y Excepciones",
    identifyBoundary: "Identifica condiciones límite, escenarios inusuales y posibles modos de fallo.",
    expertOptimizations: "### Optimizaciones Expertas",
    provideAdvanced: "Proporciona técnicas avanzadas, atajos y optimizaciones conocidas solo por los practicantes.",
    synthesis: "### Síntesis y Recomendaciones",
    integrateInsights: "Integra todas las ideas en recomendaciones accionables con justificación clara.",
    responseRequirements: "**Requisitos de Respuesta:**",
    exhaustiveCoverage: "- Cobertura exhaustiva con tono:",
    writtenExclusively: "- Escrito exclusivamente en",
    expertLevelDepth: "- Profundidad y precisión a nivel experto"
  },
  fr: {
    tone: "ton",
    outputIn: "Sortie en",
    language: "Langue",
    avoiding: "Évitant",
    important: "IMPORTANT",
    respondIn: "Répondre en",
    langName: "Français",

    // Values
    max: "Maximum",
    high: "Élevé",
    taskSpecific: "Uniquement spécifique à la tâche",
    structuredScannable: "Structuré et scannable",
    techAccuracy: "Précision technique dans chaque déclaration",
    immediateApplicability: "Applicabilité immédiate requise",
    addressAllAspects: "Abordez tous les aspects de la tâche",
    verifyAllClaims: "Vérifier toutes les affirmations et recommandations",

    // Tone names
    professional: "professionnel",
    creative: "créatif",
    academic: "académique",
    concise: "concis",
    empathetic: "empathique",
    humorous: "humoristique",
    direct: "direct",
    motivational: "motivateur",
    skeptical: "sceptique",
    teacher: "enseignant",
    technical: "technique",

    asExpert: "En tant qu'expert dans ce domaine,",
    pleaseCraft: "veuillez rédiger une réponse détaillée :",
    ensureOutput: "Assurez-vous que la sortie est complète et écrite en",
    regarding: "concernant :",
    coveringCore: ", couvrant les concepts de base et les applications pratiques.",
    usingA: ", en utilisant un",

    // Balanced
    actingSpecialist: "Agissant en tant que spécialiste, fournissez une réponse bien structurée à ce qui suit :",
    provideStructured: "fournir une réponse bien structurée",
    objectives: "## Objectifs",
    defineGoals: "Définissez les principaux objectifs et les résultats attendus.",
    analysis: "## Analyse",
    examineKey: "Examinez les composants clés, les relations et les principes sous-jacents.",
    implementation: "## Mise en œuvre",
    provideActionable: "Fournissez des étapes concrètes et des recommandations pratiques.",
    maintainTone: "Maintenez un ton",

    distinguishedExpert: "Vous êtes un expert distingué avec une vaste expérience dans le sujet de :",
    seekExpertise: "Je sollicite votre expertise pour développer une réponse complète et perspicace.",
    expertPersona: "## Persona Expert",
    actThoughtLeader: "Agissez en tant que leader d'opinion avec une connaissance approfondie du domaine et une expérience pratique.",
    currentLandscape: "## Paysage Actuel",
    summarizeContext: "Résumez le contexte existant, les approches de pointe et les avancées récentes.",
    detailedAnalysis: "## Analyse Détaillée",
    exploreCore: "Explorez les mécanismes de base, les principes sous-jacents et les considérations nuancées.",
    bestPractices: "## Meilleures Pratiques",
    provideInsights: "Fournissez des idées concrètes, des méthodologies éprouvées et des recommandations d'experts.",
    futureOutlook: "## Perspectives Futures",
    offerProjections: "Offrez des projections basées sur les tendances actuelles et les développements émergents.",
    leverageKnowledge: "Tirez parti de vos connaissances spécialisées pour produire une réponse faisant autorité et engageante en",

    precisionProtocol: "## PROTOCOLE DE PRÉCISION",
    taskSpecification: "### Spécification de la Tâche",
    executionParameters: "### Paramètres d'Exécution",
    depth: "Profondeur",
    precision: "Précision",
    constraints: "### Contraintes",
    scope: "Portée",
    outputRequirements: "### Exigences de Sortie",
    format: "Format",
    detailLevel: "Niveau de Détail",
    actionability: "Actionnabilité",
    qualityMetrics: "### Métriques de Qualité",
    completeness: "Exhaustivité",
    accuracy: "Précision",
    executeExactness: "Exécutez avec exactitude et précision technique tout au long.",

    firstPrinciples: "## Analyse des Premiers Principes",
    coreQuestion: "### Question Centrale",
    foundationalReasoning: "### Raisonnement Fondamental",
    deconstructProblem: "Déconstruisez ce problème en ses vérités fondamentales et construisez à partir de là. Identifiez les composants irréductibles et leurs relations.",
    historicalContext: "### Contexte Historique",
    traceEvolution: "Retracez l'évolution de ce domaine, les percées clés et les changements de paradigme qui informent la compréhension actuelle.",
    theoreticalFramework: "### Cadre Théorique",
    establishPrinciples: "Établissez les principes, modèles et théories sous-jacents qui régissent ce domaine.",
    detailedAnalysisExpert: "### Analyse Détaillée",
    examineComplex: "Examinez les interactions complexes, les dépendances et les nuances qui affectent les résultats.",
    edgeCases: "### Cas Limites et Exceptions",
    identifyBoundary: "Identifiez les conditions limites, les scénarios inhabituels et les modes de défaillance potentiels.",
    expertOptimizations: "### Optimisations Expertes",
    provideAdvanced: "Fournissez des techniques avancées, des raccourcis et des optimisations connus uniquement des praticiens.",
    synthesis: "### Synthèse et Recommandations",
    integrateInsights: "Intégrez toutes les idées dans des recommandations concrètes avec une justification claire.",
    responseRequirements: "**Exigences de Réponse :**",
    exhaustiveCoverage: "- Couverture exhaustive avec un ton :",
    writtenExclusively: "- Écrit exclusivement en",
    expertLevelDepth: "- Profondeur et précision au niveau expert"
  },
  de: {
    tone: "Ton",
    outputIn: "Ausgabe in",
    language: "Sprache",
    avoiding: "Vermeiden",
    important: "WICHTIG",
    respondIn: "Antworten auf",
    langName: "Deutsch",

    // Values
    max: "Maximum",
    high: "Hoch",
    taskSpecific: "Nur aufgabenspezifisch",
    structuredScannable: "Strukturiert und scannbar",
    techAccuracy: "Technische Genauigkeit in jeder Aussage",
    immediateApplicability: "Sofortige Anwendbarkeit erforderlich",
    addressAllAspects: "Alle Aspekte der Aufgabe ansprechen",
    verifyAllClaims: "Alle Behauptungen und Empfehlungen prüfen",

    // Tone names
    professional: "professionell",
    creative: "kreativ",
    academic: "akademisch",
    concise: "prägnant",
    empathetic: "empathisch",
    humorous: "humorvoll",
    direct: "direkt",
    motivational: "motivierend",
    skeptical: "skeptisch",
    teacher: "lehrer",
    technical: "technisch",

    asExpert: "Als Experte auf diesem Gebiet,",
    pleaseCraft: "bitte verfassen Sie eine detaillierte Antwort:",
    ensureOutput: "Stellen Sie sicher, dass die Ausgabe umfassend ist und geschrieben in",
    regarding: "bezüglich:",
    coveringCore: ", wobei Kernkonzepte und praktische Anwendungen abgedeckt werden.",
    usingA: ", unter Verwendung eines",

    // Balanced
    actingSpecialist: "Als Spezialist, geben Sie eine gut strukturierte Antwort auf Folgendes:",
    provideStructured: "geben Sie eine gut strukturierte Antwort",
    objectives: "## Ziele",
    defineGoals: "Definieren Sie die primären Ziele und erwarteten Ergebnisse.",
    analysis: "## Analyse",
    examineKey: "Untersuchen Sie die Schlüsselkomponenten, Beziehungen und zugrunde liegenden Prinzipien.",
    implementation: "## Umsetzung",
    provideActionable: "Geben Sie umsetzbare Schritte und praktische Empfehlungen.",
    maintainTone: "Bewahren Sie einen Ton",

    distinguishedExpert: "Sie sind ein angesehener Experte mit umfangreicher Erfahrung im Thema:",
    seekExpertise: "Ich suche Ihre Expertise, um eine umfassende und aufschlussreiche Antwort zu entwickeln.",
    expertPersona: "## Experten-Persona",
    actThoughtLeader: "Handeln Sie als Vordenker mit tiefem Fachwissen und praktischer Erfahrung.",
    currentLandscape: "## Aktuelle Landschaft",
    summarizeContext: "Fassen Sie den bestehenden Kontext, modernste Ansätze und jüngste Fortschritte zusammen.",
    detailedAnalysis: "## Detaillierte Analyse",
    exploreCore: "Erkunden Sie Kernmechanismen, zugrunde liegende Prinzipien und nuancierte Überlegungen.",
    bestPractices: "## Best Practices",
    provideInsights: "Geben Sie umsetzbare Einblicke, bewährte Methoden und Expertenempfehlungen.",
    futureOutlook: "## Zukunftsausblick",
    offerProjections: "Bieten Sie Prognosen basierend auf aktuellen Trends und neuen Entwicklungen an.",
    leverageKnowledge: "Nutzen Sie Ihr Fachwissen, um eine maßgebliche und ansprechende Antwort zu erstellen in",

    precisionProtocol: "## PRÄZISIONSPROTOKOLL",
    taskSpecification: "### Aufgabenspezifikation",
    executionParameters: "### Ausführungsparameter",
    depth: "Tiefe",
    precision: "Präzision",
    constraints: "### Einschränkungen",
    scope: "Umfang",
    outputRequirements: "### Ausgabeanforderungen",
    format: "Format",
    detailLevel: "Detailgrad",
    actionability: "Umsetzbarkeit",
    qualityMetrics: "### Qualitätsmetriken",
    completeness: "Vollständigkeit",
    accuracy: "Genauigkeit",
    executeExactness: "Führen Sie durchgehend mit Exaktheit und technischer Präzision aus.",

    firstPrinciples: "## Analyse der Ersten Prinzipien",
    coreQuestion: "### Kernfrage",
    foundationalReasoning: "### Grundlegendes Denken",
    deconstructProblem: "Zerlegen Sie dieses Problem in seine fundamentalen Wahrheiten und bauen Sie von dort aus auf. Identifizieren Sie die nicht reduzierbaren Komponenten und ihre Beziehungen.",
    historicalContext: "### Historischer Kontext",
    traceEvolution: "Verfolgen Sie die Entwicklung dieses Bereichs, Schlüsseldurchbrüche und Paradigmenwechsel, die das aktuelle Verständnis prägen.",
    theoreticalFramework: "### Theoretischer Rahmen",
    establishPrinciples: "Etablieren Sie die zugrunde liegenden Prinzipien, Modelle und Theorien, die diesen Bereich regeln.",
    detailedAnalysisExpert: "### Detaillierte Analyse",
    examineComplex: "Untersuchen Sie komplexe Interaktionen, Abhängigkeiten und Nuancen, die Ergebnisse beeinflussen.",
    edgeCases: "### Grenzfälle und Ausnahmen",
    identifyBoundary: "Identifizieren Sie Randbedingungen, ungewöhnliche Szenarien und potenzielle Fehlermodi.",
    expertOptimizations: "### Expertenoptimierungen",
    provideAdvanced: "Geben Sie fortgeschrittene Techniken, Abkürzungen und Optimierungen an, die nur Praktikern bekannt sind.",
    synthesis: "### Synthese und Empfehlungen",
    integrateInsights: "Integrieren Sie alle Erkenntnisse in umsetzbare Empfehlungen mit klarer Begründung.",
    responseRequirements: "**Antwortanforderungen:**",
    exhaustiveCoverage: "- Umfassende Abdeckung mit Ton:",
    writtenExclusively: "- Ausschließlich geschrieben in",
    expertLevelDepth: "- Tiefe und Präzision auf Expertenniveau"
  },
  en: {
    tone: "tone",
    outputIn: "Output in",
    language: "Language",
    avoiding: "Avoiding",
    important: "IMPORTANT",
    respondIn: "Respond in",
    langName: "English",

    // Values
    max: "Maximum",
    high: "High",
    taskSpecific: "Task-specific only",
    structuredScannable: "Structured and scannable",
    techAccuracy: "Technical accuracy in every statement",
    immediateApplicability: "Immediate applicability required",
    addressAllAspects: "Address all aspects of the task",
    verifyAllClaims: "Verify all claims and recommendations",

    // Tone names
    professional: "professional",
    creative: "creative",
    academic: "academic",
    concise: "concise",
    empathetic: "empathetic",
    humorous: "humorous",
    direct: "direct",
    motivational: "motivational",
    skeptical: "skeptical",
    teacher: "teacher",
    technical: "technical",

    asExpert: "As an expert in this field,",
    pleaseCraft: "please craft a detailed response with tone:",
    ensureOutput: "Ensure the output is comprehensive and written in",
    regarding: "regarding:",
    coveringCore: ", covering core concepts and practical applications.",
    usingA: ", using a",

    // Balanced
    actingSpecialist: "Acting as a specialist, provide a well-structured response to the following:",
    provideStructured: "provide a well-structured response",
    objectives: "## Objectives",
    defineGoals: "Define the primary goals and expected outcomes.",
    analysis: "## Analysis",
    examineKey: "Examine the key components, relationships, and underlying principles.",
    implementation: "## Implementation",
    provideActionable: "Provide actionable steps and practical recommendations.",
    maintainTone: "Maintain a",

    distinguishedExpert: "You are a distinguished expert with extensive experience in the subject of:",
    seekExpertise: "I seek your expertise to develop a comprehensive and insightful response.",
    expertPersona: "## Expert Persona",
    actThoughtLeader: "Act as a thought leader with deep domain knowledge and practical experience.",
    currentLandscape: "## Current Landscape",
    summarizeContext: "Summarize existing context, state-of-the-art approaches, and recent advancements.",
    detailedAnalysis: "## Detailed Analysis",
    exploreCore: "Explore core mechanics, underlying principles, and nuanced considerations.",
    bestPractices: "## Best Practices",
    provideInsights: "Provide actionable insights, proven methodologies, and expert recommendations.",
    futureOutlook: "## Future Outlook",
    offerProjections: "Offer projections based on current trends and emerging developments.",
    leverageKnowledge: "Leverage your specialized knowledge to produce an authoritative and engaging response in",

    precisionProtocol: "## PRECISION PROTOCOL",
    taskSpecification: "### Task Specification",
    executionParameters: "### Execution Parameters",
    depth: "Depth",
    precision: "Precision",
    constraints: "### Constraints",
    scope: "Scope",
    outputRequirements: "### Output Requirements",
    format: "Format",
    detailLevel: "Detail Level",
    actionability: "Actionability",
    qualityMetrics: "### Quality Metrics",
    completeness: "Completeness",
    accuracy: "Accuracy",
    executeExactness: "Execute with exactness and technical precision throughout.",

    firstPrinciples: "## First Principles Analysis",
    coreQuestion: "### Core Question",
    foundationalReasoning: "### Foundational Reasoning",
    deconstructProblem: "Deconstruct this problem into its fundamental truths and build up from there. Identify the irreducible components and their relationships.",
    historicalContext: "### Historical Context",
    traceEvolution: "Trace the evolution of this domain, key breakthroughs, and paradigm shifts that inform current understanding.",
    theoreticalFramework: "### Theoretical Framework",
    establishPrinciples: "Establish the underlying principles, models, and theories that govern this domain.",
    detailedAnalysisExpert: "### Detailed Analysis",
    examineComplex: "Examine complex interactions, dependencies, and nuances that affect outcomes.",
    edgeCases: "### Edge Cases & Exceptions",
    identifyBoundary: "Identify boundary conditions, unusual scenarios, and potential failure modes.",
    expertOptimizations: "### Expert Optimizations",
    provideAdvanced: "Provide advanced techniques, shortcuts, and optimizations known only to practitioners.",
    synthesis: "### Synthesis & Recommendations",
    integrateInsights: "Integrate all insights into actionable recommendations with clear rationale.",
    responseRequirements: "**Response Requirements:**",
    exhaustiveCoverage: "- Exhaustive coverage with tone:",
    writtenExclusively: "- Written exclusively in",
    expertLevelDepth: "- Expert-level depth and precision"
  },
  it: {
    tone: "tono",
    outputIn: "Output in",
    language: "Lingua",
    avoiding: "Evitare",
    important: "IMPORTANTE",
    respondIn: "Rispondi in",
    langName: "Italiano",

    // Values
    max: "Massimo",
    high: "Alto",
    taskSpecific: "Solo specifico per il compito",
    structuredScannable: "Strutturato e scansionabile",
    techAccuracy: "Precisione tecnica in ogni affermazione",
    immediateApplicability: "Applicabilità immediata richiesta",
    addressAllAspects: "Affrontare tutti gli aspetti del compito",
    verifyAllClaims: "Verificare tutte le affermazioni e raccomandazioni",

    // Tone names
    professional: "professionale",
    creative: "creativo",
    academic: "accademico",
    concise: "conciso",
    empathetic: "empatico",
    humorous: "umoristico",
    direct: "diretto",
    motivational: "motivazionale",
    skeptical: "scettico",
    teacher: "insegnante",
    technical: "tecnico",

    asExpert: "Come esperto in questo campo,",
    pleaseCraft: "per favore elabora una risposta dettagliata con tono:",
    ensureOutput: "Assicurati che l'output sia completo e scritto in",
    regarding: "riguardo a:",
    coveringCore: ", coprendo i concetti base e le applicazioni pratiche.",
    usingA: ", usando un",

    // Balanced
    actingSpecialist: "Agendo come specialista, fornisci una risposta ben strutturata a quanto segue:",
    provideStructured: "fornisci una risposta ben strutturata",
    objectives: "## Obiettivi",
    defineGoals: "Definisci gli obiettivi primari e i risultati attesi.",
    analysis: "## Analisi",
    examineKey: "Esamina le componenti chiave, le relazioni e i principi sottostanti.",
    implementation: "## Implementazione",
    provideActionable: "Fornisci passaggi attuabili e raccomandazioni pratiche.",
    maintainTone: "Mantieni un tono",

    distinguishedExpert: "Sei un distinto esperto con vasta esperienza nel tema di:",
    seekExpertise: "Cerco la tua competenza per sviluppare una risposta completa e approfondita.",
    expertPersona: "## Persona Esperta",
    actThoughtLeader: "Agisci come un leader di pensiero con profonda conoscenza del dominio ed esperienza pratica.",
    currentLandscape: "## Panorama Attuale",
    summarizeContext: "Riassumi il contesto esistente, gli approcci all'avanguardia e i recenti progressi.",
    detailedAnalysis: "## Analisi Dettagliata",
    exploreCore: "Esplora le meccaniche centrali, i principi sottostanti e le considerazioni sfumate.",
    bestPractices: "## Migliori Pratiche",
    provideInsights: "Fornisci approfondimenti attuabili, metodologie comprovate e raccomandazioni esperte.",
    futureOutlook: "## Prospettive Future",
    offerProjections: "Offri proiezioni basate sulle tendenze attuali e sugli sviluppi emergenti.",
    leverageKnowledge: "Sfrutta la tua conoscenza specializzata per produrre una risposta autorevole e coinvolgente in",

    precisionProtocol: "## PROTOCOLLO DI PRECISIONE",
    taskSpecification: "### Specifica del Compito",
    executionParameters: "### Parametri di Esecuzione",
    depth: "Profondità",
    precision: "Precisione",
    constraints: "### Vincoli",
    scope: "Ambito",
    outputRequirements: "### Requisiti di Output",
    format: "Formato",
    detailLevel: "Livello di Dettaglio",
    actionability: "Attuabilità",
    qualityMetrics: "### Metriche di Qualità",
    completeness: "Completezza",
    accuracy: "Accuratezza",
    executeExactness: "Esegui con esattezza e precisione tecnica ovunque.",

    firstPrinciples: "## Analisi dei Primi Principi",
    coreQuestion: "### Domanda Centrale",
    foundationalReasoning: "### Ragionamento Fondamentale",
    deconstructProblem: "Decostruisci questo problema nelle sue verità fondamentali e costruisci da lì. Identifica le componenti irriducibili e le loro relazioni.",
    historicalContext: "### Contesto Storico",
    traceEvolution: "Traccia l'evoluzione di questo dominio, le scoperte chiave e i cambiamenti di paradigma che informano la comprensione attuale.",
    theoreticalFramework: "### Quadro Teorico",
    establishPrinciples: "Stabilisci i principi, i modelli e le teorie sottostanti che governano questo dominio.",
    detailedAnalysisExpert: "### Analisi Dettagliata",
    examineComplex: "Esamina interazioni complesse, dipendenze e sfumature che influenzano i risultati.",
    edgeCases: "### Casi Limite ed Eccezioni",
    identifyBoundary: "Identifica le condizioni limite, gli scenari insoliti e i potenziali modi di fallimento.",
    expertOptimizations: "### Ottimizzazioni Esperte",
    provideAdvanced: "Fornisci tecniche avanzate, scorciatoie e ottimizzazioni note solo ai professionisti.",
    synthesis: "### Sintesi e Raccomandazioni",
    integrateInsights: "Integra tutti gli approfondimenti in raccomandazioni attuabili con una chiara logica.",
    responseRequirements: "**Requisiti della Risposta:**",
    exhaustiveCoverage: "- Copertura esaustiva con tono:",
    writtenExclusively: "- Scritto esclusivamente in",
    expertLevelDepth: "- Profondità e precisione di livello esperto"
  },
  pt: {
    tone: "tom",
    outputIn: "Saída em",
    language: "Idioma",
    avoiding: "Evitando",
    important: "IMPORTANTE",
    respondIn: "Responder em",
    langName: "Português",

    // Values
    max: "Máximo",
    high: "Alto",
    taskSpecific: "Apenas específico da tarefa",
    structuredScannable: "Estruturado e digitalizável",
    techAccuracy: "Precisão técnica em cada declaração",
    immediateApplicability: "Aplicabilidade imediata necessária",
    addressAllAspects: "Abordar todos os aspectos da tarefa",
    verifyAllClaims: "Verificar todas as afirmações e recomendações",

    // Tone names
    professional: "profissional",
    creative: "criativo",
    academic: "académico",
    concise: "conciso",
    empathetic: "empático",
    humorous: "humorístico",
    direct: "direto",
    motivational: "motivacional",
    skeptical: "cético",
    teacher: "professor",
    technical: "técnico",

    asExpert: "Como especialista neste campo,",
    pleaseCraft: "por favor, elabore uma resposta detalhada com o tom:",
    ensureOutput: "Certifique-se de que a saída seja abrangente e escrita em",
    regarding: "em relação a:",
    coveringCore: ", cobrindo conceitos básicos e aplicações práticas.",
    usingA: ", usando um",

    // Balanced
    actingSpecialist: "Atuando como especialista, forneça uma resposta bem estruturada para o seguinte:",
    provideStructured: "forneça uma resposta bem estruturada",
    objectives: "## Objetivos",
    defineGoals: "Defina os principais objetivos e resultados esperados.",
    analysis: "## Análise",
    examineKey: "Examine os principais componentes, relações e princípios subjacentes.",
    implementation: "## Implementação",
    provideActionable: "Forneça etapas acionáveis e recomendações práticas.",
    maintainTone: "Mantenha um tom",

    distinguishedExpert: "Você é um especialista ilustre com vasta experiência no assunto de:",
    seekExpertise: "Busco sua experiência para desenvolver uma resposta abrangente e perspicaz.",
    expertPersona: "## Persona Especialista",
    actThoughtLeader: "Atue como um líder de pensamento com profundo conhecimento do domínio e experiência prática.",
    currentLandscape: "## Cenário Atual",
    summarizeContext: "Resuma o contexto existente, abordagens de ponta e avanços recentes.",
    detailedAnalysis: "## Análise Detalhada",
    exploreCore: "Explore a mecânica central, os princípios subjacentes e as considerações matizadas.",
    bestPractices: "## Melhores Práticas",
    provideInsights: "Forneça insights acionáveis, metodologias comprovadas e recomendações de especialistas.",
    futureOutlook: "## Perspectivas Futuras",
    offerProjections: "Ofereça projeções baseadas nas tendências atuais e desenvolvimentos emergentes.",
    leverageKnowledge: "Aproveite seu conhecimento especializado para produzir uma resposta autorizada e envolvente em",

    precisionProtocol: "## PROTOCOLO DE PRECISÃO",
    taskSpecification: "### Especificação da Tarefa",
    executionParameters: "### Parâmetros de Execução",
    depth: "Profundidade",
    precision: "Precisão",
    constraints: "### Restrições",
    scope: "Escopo",
    outputRequirements: "### Requisitos de Saída",
    format: "Formato",
    detailLevel: "Nível de Detalhe",
    actionability: "Capacidade de ação",
    qualityMetrics: "### Métricas de Qualidade",
    completeness: "Integridade",
    accuracy: "Precisão",
    executeExactness: "Execute com exatidão e precisão técnica em todos os momentos.",

    firstPrinciples: "## Análise de Primeiros Princípios",
    coreQuestion: "### Pergunta Central",
    foundationalReasoning: "### Raciocínio Fundamental",
    deconstructProblem: "Desconstrua este problema em suas verdades fundamentais e construa a partir daí. Identifique os componentes irredutíveis e suas relações.",
    historicalContext: "### Contexto Histórico",
    traceEvolution: "Rastreie a evolução deste domínio, as principais descobertas e as mudanças de paradigma que informam a compreensão atual.",
    theoreticalFramework: "### Quadro Teórico",
    establishPrinciples: "Estabeleça os princípios, modelos e teorias subjacentes que governam este domínio.",
    detailedAnalysisExpert: "### Análise Detalhada",
    examineComplex: "Examine interações complexas, dependências e nuances que afetam os resultados.",
    edgeCases: "### Casos Limite e Exceções",
    identifyBoundary: "Identifique condições de contorno, cenários incomuns e possíveis modos de falha.",
    expertOptimizations: "### Otimizações Especialistas",
    provideAdvanced: "Forneça técnicas avançadas, atalhos e otimizações conhecidas apenas pelos praticantes.",
    synthesis: "### Síntese e Recomendações",
    integrateInsights: "Integre todos os insights em recomendações acionáveis com uma lógica clara.",
    responseRequirements: "**Requisitos de Resposta:**",
    exhaustiveCoverage: "- Cobertura exaustiva com tom:",
    writtenExclusively: "- Escrito exclusivamente em",
    expertLevelDepth: "- Profundidade e precisão de nível de especialista"
  },
  ru: {
    tone: "тон",
    outputIn: "Вывод на",
    language: "Язык",
    avoiding: "Избегая",
    important: "ВАЖНО",
    respondIn: "Отвечать на",
    langName: "Русский",

    // Values
    max: "Максимальный",
    high: "Высокая",
    taskSpecific: "Только по конкретной задаче",
    structuredScannable: "Структурировано и легко читаемо",
    techAccuracy: "Техническая точность в каждом утверждении",
    immediateApplicability: "Требуется немедленная применимость",
    addressAllAspects: "Рассмотреть все аспекты задачи",
    verifyAllClaims: "Проверить все утверждения и рекомендации",

    // Tone names
    professional: "профессиональный",
    creative: "творческий",
    academic: "академический",
    concise: "лаконичный",
    empathetic: "эмпатичный",
    humorous: "юмористический",
    direct: "прямой",
    motivational: "мотивационный",
    skeptical: "скептический",
    teacher: "учитель",
    technical: "технический",

    asExpert: "Как эксперт в этой области,",
    pleaseCraft: "пожалуйста, составьте подробный ответ в тоне:",
    ensureOutput: "Убедитесь, что ответ является исчерпывающим и написан на",
    regarding: "относительно:",
    coveringCore: ", охватывая основные концепции и практическое применение.",
    usingA: ", используя",

    // Balanced
    actingSpecialist: "Действуя как специалист, предоставьте хорошо структурированный ответ на следующее:",
    provideStructured: "предоставьте хорошо структурированный ответ",
    objectives: "## Цели",
    defineGoals: "Определите основные цели и ожидаемые результаты.",
    analysis: "## Анализ",
    examineKey: "Изучите ключевые компоненты, взаимосвязи и основополагающие принципы.",
    implementation: "## Реализация",
    provideActionable: "Представьте практические шаги и рекомендации.",
    maintainTone: "Придерживайтесь тона",

    distinguishedExpert: "Вы — выдающийся эксперт с богатым опытом в области:",
    seekExpertise: "Мне нужны ваши знания для разработки всестороннего и глубокого ответа.",
    expertPersona: "## Личность эксперта",
    actThoughtLeader: "Действуйте как идейный лидер с глубокими знаниями предметной области и практическим опытом.",
    currentLandscape: "## Текущая ситуация",
    summarizeContext: "Опишите существующий контекст, современные подходы и недавние достижения.",
    detailedAnalysis: "## Детальный анализ",
    exploreCore: "Исследуйте основные механизмы, первопринципы и нюансы.",
    bestPractices: "## Лучшие практики",
    provideInsights: "Предоставьте практические идеи, проверенные методологии и рекомендации экспертов.",
    futureOutlook: "## Перспективы",
    offerProjections: "Предложите прогнозы, основанные на текущих тенденциях и новых разработках.",
    leverageKnowledge: "Используйте свои специальные знания, чтобы подготовить авторитетный и увлекательный ответ на",

    precisionProtocol: "## ПРОТОКОЛ ТОЧНОСТИ",
    taskSpecification: "### Спецификация задачи",
    executionParameters: "### Параметры выполнения",
    depth: "Глубина",
    precision: "Точность",
    constraints: "### Ограничения",
    scope: "Область",
    outputRequirements: "### Требования к выводу",
    format: "Формат",
    detailLevel: "Уровень детализации",
    actionability: "Применимость",
    qualityMetrics: "### Метрики качества",
    completeness: "Полнота",
    accuracy: "Точность",
    executeExactness: "Выполняйте с безупречной точностью и техническим совершенством во всем.",

    firstPrinciples: "## Анализ первопринципов",
    coreQuestion: "### Основной вопрос",
    foundationalReasoning: "### Фундаментальное обоснование",
    deconstructProblem: "Разложите эту проблему на фундаментальные истины и стройте решение от них. Определите неделимые компоненты и их связи.",
    historicalContext: "### Исторический контекст",
    traceEvolution: "Проследите эволюцию этой области, ключевые прорывы и сдвиги парадигм, определяющие современное понимание.",
    theoreticalFramework: "### Теоретическая база",
    establishPrinciples: "Установите основополагающие принципы, модели и теории, управляющие этой областью.",
    detailedAnalysisExpert: "### Детальный анализ",
    examineComplex: "Изучите сложные взаимодействия, зависимости и нюансы, влияющие на результаты.",
    edgeCases: "### Краевые случаи и исключения",
    identifyBoundary: "Определите граничные условия, необычные сценарии и возможные режимы сбоя.",
    expertOptimizations: "### Экспертные оптимизации",
    provideAdvanced: "Предоставьте продвинутые методы, короткие пути и оптимизации, известные только практикам.",
    synthesis: "### Синтез и рекомендации",
    integrateInsights: "Объедините все выводы в практические рекомендации с четким обоснованием.",
    responseRequirements: "**Требования к ответу:**",
    exhaustiveCoverage: "- Исчерпывающий охват в тоне:",
    writtenExclusively: "- Написано исключительно на",
    expertLevelDepth: "- Глубина и точность экспертного уровня"
  },
  zh: {
    tone: "语气",
    outputIn: "输出语言",
    language: "语言",
    avoiding: "避免",
    important: "重要",
    respondIn: "以此语言回答",
    langName: "中文",

    // Values
    max: "最大",
    high: "高",
    taskSpecific: "仅针对特定任务",
    structuredScannable: "结构化且易于浏览",
    techAccuracy: "每句话都保证技术准确性",
    immediateApplicability: "要求立即适用性",
    addressAllAspects: "涵盖任务的所有方面",
    verifyAllClaims: "核实所有主张和建议",

    // Tone names
    professional: "专业",
    creative: "创意",
    academic: "学术",
    concise: "简洁",
    empathetic: "共情",
    humorous: "幽默",
    direct: "直接",
    motivational: "励志",
    skeptical: "质疑",
    teacher: "教师",
    technical: "技术",

    asExpert: "作为该领域的专家，",
    pleaseCraft: "请以此语气撰写详细回复：",
    ensureOutput: "确保输出内容全面并使用以下语言编写：",
    regarding: "关于：",
    coveringCore: "，涵盖核心概念和实际应用。",
    usingA: "，使用",

    // Balanced
    actingSpecialist: "作为专家，请针对以下内容提供结构合理的回复：",
    provideStructured: "提供结构合理的回复",
    objectives: "## 目标",
    defineGoals: "定义主要目标和预期成果。",
    analysis: "## 分析",
    examineKey: "检查关键组件、关系和底层原则。",
    implementation: "## 实施",
    provideActionable: "提供可操作的步骤和实际建议。",
    maintainTone: "保持语气为",

    distinguishedExpert: "您是该领域享有盛誉的专家，在以下方面拥有丰富的经验：",
    seekExpertise: "我寻求您的专业知识，以制定全面且深入的回复。",
    expertPersona: "## 专家人格",
    actThoughtLeader: "作为拥有深厚领域知识和实践经验的思想领袖。",
    currentLandscape: "## 当前格局",
    summarizeContext: "总结现有背景、尖端方法和最新进展。",
    detailedAnalysis: "## 详细分析",
    exploreCore: "探索核心机制、底层原则和细微考虑。",
    bestPractices: "## 最佳实践",
    provideInsights: "提供可操作的见解、经证实的理论和专家建议。",
    futureOutlook: "## 未来展望",
    offerProjections: "根据当前趋势和新兴发展提供预测。",
    leverageKnowledge: "利用您的专业知识，以以下语言生成权威且引人入胜的回复：",

    precisionProtocol: "## 精准协议",
    taskSpecification: "### 任务说明",
    executionParameters: "### 执行参数",
    depth: "深度",
    precision: "精准度",
    constraints: "### 约束条件",
    scope: "范围",
    outputRequirements: "### 输出要求",
    format: "格式",
    detailLevel: "细节级别",
    actionability: "可操作性",
    qualityMetrics: "### 质量指标",
    completeness: "完整性",
    accuracy: "准确性",
    executeExactness: "始终保持严格的准确性和技术上的精准度。",

    firstPrinciples: "## 第一性原理分析",
    coreQuestion: "### 核心问题",
    foundationalReasoning: "### 基础推理",
    deconstructProblem: "将此问题分解为基本事实并以此为基础进行构建。识别不可简化的组件及其关系。",
    historicalContext: "### 历史背景",
    traceEvolution: "追踪该领域的发展历程、关键突破以及影响当前理解的范式转变。",
    theoreticalFramework: "### 理论框架",
    establishPrinciples: "确立管理该领域的底层原则、模型和理论。",
    detailedAnalysisExpert: "### 详细分析",
    examineComplex: "检查影响结果的复杂交互、依赖关系和细微差别。",
    edgeCases: "### 边界情况与异常",
    identifyBoundary: "识别边界条件、异常场景和潜在的故障模式。",
    expertOptimizations: "### 专家级优化",
    provideAdvanced: "提供仅限从业者知晓的高级技术、捷径和优化方案。",
    synthesis: "### 综合与建议",
    integrateInsights: "将所有见解整合到具有明确依据的可操作建议中。",
    responseRequirements: "**回复要求：**",
    exhaustiveCoverage: "- 语气详尽的覆盖：",
    writtenExclusively: "- 专门使用以下语言编写：",
    expertLevelDepth: "- 专家级深度与精准度"
  },
  ja: {
    tone: "トーン",
    outputIn: "出力言語",
    language: "言語",
    avoiding: "回避",
    important: "重要",
    respondIn: "この言語で回答",
    langName: "日本語",

    // Values
    max: "最大",
    high: "高",
    taskSpecific: "タスク固有のみ",
    structuredScannable: "構造化されスキャン可能",
    techAccuracy: "すべての記述における技術的な正確性",
    immediateApplicability: "即時の適用性が必要",
    addressAllAspects: "タスクのすべての側面に対処",
    verifyAllClaims: "すべての主張と推奨事項を検証",

    // Tone names
    professional: "プロフェッショナル",
    creative: "クリエイティブ",
    academic: "アカデミック",
    concise: "簡潔",
    empathetic: "共感的",
    humorous: "ユーモラス",
    direct: "ダイレクト",
    motivational: "モチベーショナル",
    skeptical: "懐疑的",
    teacher: "ティーチャー",
    technical: "テクニカル",

    asExpert: "この分野のエキスパートとして、",
    pleaseCraft: "以下のトーンで詳細な回答を作成してください：",
    ensureOutput: "出力が包括的であり、以下の言語で書かれていることを確認してください：",
    regarding: "に関して：",
    coveringCore: "、基本概念と実用的な応用をカバーしてください。",
    usingA: "、以下のトーンを使用して：",

    // Balanced
    actingSpecialist: "スペシャリストとして、以下に対して構造化された回答を提供してください：",
    provideStructured: "構造化された回答を提供",
    objectives: "## 目的",
    defineGoals: "主要な目標と期待される成果を定義してください。",
    analysis: "## 分析",
    examineKey: "主要な構成要素、関係、および基礎となる原則を調査してください。",
    implementation: "## 実施",
    provideActionable: "実行可能なステップと実用的な推奨事項を提供してください。",
    maintainTone: "以下のトーンを維持してください：",

    distinguishedExpert: "あなたは、以下の主題において広範な経験を持つ著名なエキスパートです：",
    seekExpertise: "包括的で洞察力に満ちた回答を作成するために、あなたの専門知識を求めます。",
    expertPersona: "## エキスパート・ペルソナ",
    actThoughtLeader: "深いドメイン知識と実務経験を持つソートリーダーとして行動してください。",
    currentLandscape: "## 現状の展望",
    summarizeContext: "既存のコンテキスト、最先端のアプローチ、および最近の進歩を要約してください。",
    detailedAnalysis: "## 詳細な分析",
    exploreCore: "核となるメカニズム、基礎となる原則、および微妙な考慮事項を探索してください。",
    bestPractices: "## ベストプラクティス",
    provideInsights: "実行可能な洞察、実証済みの方法論、および専門的な推奨事項を提供してください。",
    futureOutlook: "## 今後の展望",
    offerProjections: "現在のトレンドと新たな展開に基づく予測を提供してください。",
    leverageKnowledge: "専門知識を活用して、以下の言語で権威があり魅力的な回答を生成してください：",

    precisionProtocol: "## プレシジョン・プロトコル",
    taskSpecification: "### タスク仕様",
    executionParameters: "### 実行パラメータ",
    depth: "深さ",
    precision: "精度",
    constraints: "### 制約",
    scope: "範囲",
    outputRequirements: "### 出力要件",
    format: "形式",
    detailLevel: "詳細レベル",
    actionability: "実行可能性",
    qualityMetrics: "### 品質指標",
    completeness: "網羅性",
    accuracy: "正確性",
    executeExactness: "常に厳密さと技術的な精度をもって実行してください。",

    firstPrinciples: "## 第一原理分析",
    coreQuestion: "### 核心的な問い",
    foundationalReasoning: "### 基礎的な推論",
    deconstructProblem: "この問題を根本的な事実に分解し、そこから構築してください。還元不可能な構成要素とその関係を特定してください。",
    historicalContext: "### 歴史的背景",
    traceEvolution: "この分野の進化、主要な画期的進歩、および現在の理解を形作るパラダイムシフトを追跡してください。",
    theoreticalFramework: "### 理論的枠組み",
    establishPrinciples: "この分野を支配する基礎となる原則、モデル、および理論を確立してください。",
    detailedAnalysisExpert: "### 詳細な分析",
    examineComplex: "結果に影響を与える複雑な相互作用、依存関係、および微妙な違いを調査してください。",
    edgeCases: "### エッジケースと例外",
    identifyBoundary: "境界条件、異常なシナリオ、および潜在的な失敗モードを特定してください。",
    expertOptimizations: "### エキスパートによる最適化",
    provideAdvanced: "実務家のみが知る高度なテクニック、ショートカット、および最適化を提供してください。",
    synthesis: "### 統合と推奨",
    integrateInsights: "すべての洞察を、明確な根拠を持つ実行可能な推奨事項に統合してください。",
    responseRequirements: "**回答要件：**",
    exhaustiveCoverage: "- 以下のトーンでの網羅的なカバー：",
    writtenExclusively: "- 以下の言語のみで記述：",
    expertLevelDepth: "- エキスパートレベルの深さと精度"
  },
  ko: {
    tone: "톤",
    outputIn: "출력 언어",
    language: "언어",
    avoiding: "회피",
    important: "중요",
    respondIn: "이 언어로 응답",
    langName: "한국어",

    // Values
    max: "최대",
    high: "높음",
    taskSpecific: "작업 관련 사항만",
    structuredScannable: "구조화되고 검색 가능",
    techAccuracy: "모든 진술의 기술적 정확성",
    immediateApplicability: "즉각적인 적용성 필요",
    addressAllAspects: "작업의 모든 측면 처리",
    verifyAllClaims: "모든 주장과 권장 사항 검증",

    // Tone names
    professional: "전문적",
    creative: "창의적",
    academic: "학술적",
    concise: "간결한",
    empathetic: "공감하는",
    humorous: "유머러스한",
    direct: "직설적인",
    motivational: "동기 부여",
    skeptical: "회의적인",
    teacher: "교사",
    technical: "기술적",

    asExpert: "이 분야의 전문가로서,",
    pleaseCraft: "다음 톤으로 상세한 답변을 작성해 주세요:",
    ensureOutput: "출력이 포괄적이고 다음 언어로 작성되었는지 확인하십시오:",
    regarding: "관련 사항:",
    coveringCore: ", 핵심 개념과 실제 응용 프로그램을 다룹니다.",
    usingA: ", 다음을 사용하여:",

    // Balanced
    actingSpecialist: "전문가로서 다음에 대해 잘 구조화된 답변을 제공하십시오:",
    provideStructured: "잘 구조화된 답변 제공",
    objectives: "## 목표",
    defineGoals: "주요 목표와 예상 결과 정의.",
    analysis: "## 분석",
    examineKey: "주요 구성 요소, 관계 및 기본 원칙 조사.",
    implementation: "## 구현",
    provideActionable: "실행 가능한 단계 및 실제 권장 사항 제공.",
    maintainTone: "톤 유지:",

    distinguishedExpert: "귀하는 다음 주제에 대해 광범위한 경험을 가진 저명한 전문가입니다:",
    seekExpertise: "포괄적이고 통찰력 있는 답변을 개발하기 위해 귀하의 전문 지식을 구합니다.",
    expertPersona: "## 전문가 페르소나",
    actThoughtLeader: "심도 있는 도메인 지식과 실무 경험을 갖춘 사상적 리더로서 행동하십시오.",
    currentLandscape: "## 현재 상황",
    summarizeContext: "기존 컨텍스트, 최첨단 접근 방식 및 최근 발전 사항을 요약합니다.",
    detailedAnalysis: "## 상세 분석",
    exploreCore: "핵심 메커니즘, 기본 원칙 및 미묘한 고려 사항 탐구.",
    bestPractices: "## 모범 사례",
    provideInsights: "실행 가능한 통찰력, 입증된 방법론 및 전문가 권장 사항 제공.",
    futureOutlook: "## 미래 전망",
    offerProjections: "현재 추세와 새로운 발전을 기반으로 한 예측 제공.",
    leverageKnowledge: "귀하의 전문 지식을 활용하여 다음 언어로 신뢰할 수 있고 매력적인 답변을 생성하십시오:",

    precisionProtocol: "## 정밀 프로토콜",
    taskSpecification: "### 작업 사양",
    executionParameters: "### 실행 매개변수",
    depth: "깊이",
    precision: "정밀도",
    constraints: "### 제약 조건",
    scope: "범위",
    outputRequirements: "### 출력 요구 사항",
    format: "형식",
    detailLevel: "상세 수준",
    actionability: "실행 가능성",
    qualityMetrics: "### 품질 지표",
    completeness: "완전성",
    accuracy: "정확성",
    executeExactness: "항상 정확성과 기술적 정밀함을 유지하며 실행하십시오.",

    firstPrinciples: "## 제1원리 분석",
    coreQuestion: "### 핵심 질문",
    foundationalReasoning: "### 기초적 추론",
    deconstructProblem: "이 문제를 근본적인 사실로 분해하고 거기에서 다시 체계화하십시오. 나눌 수 없는 구성 요소와 그 관계를 식별하십시오.",
    historicalContext: "### 역사적 배경",
    traceEvolution: "이 분야의 진화, 주요 돌파구 및 현재의 이해를 형성하는 패러다임 변화를 추적하십시오.",
    theoreticalFramework: "### 이론적 프레임워크",
    establishPrinciples: "이 분야를 지배하는 기본 원칙, 모델 및 이론을 확립하십시오.",
    detailedAnalysisExpert: "### 상세 분석",
    examineComplex: "결과에 영향을 미치는 복잡한 상호 작용, 의존성 및 미묘한 차이를 조사하십시오.",
    edgeCases: "### 엣지 케이스 및 예외",
    identifyBoundary: "경계 조건, 비정상적인 시나리오 및 잠재적 실패 모드를 식별하십시오.",
    expertOptimizations: "### 전문가 최적화",
    provideAdvanced: "실무자만 아는 고급 기술, 지름길 및 최적화 방법을 제공하십시오.",
    synthesis: "### 종합 및 권장 사항",
    integrateInsights: "모든 통찰력을 명확한 근거가 있는 실행 가능한 권장 사항으로 통합하십시오.",
    responseRequirements: "**응답 요구 사항:**",
    exhaustiveCoverage: "- 다음 톤으로 철저한 범위 제공:",
    writtenExclusively: "- 다음 언어로만 작성:",
    expertLevelDepth: "- 전문가 수준의 깊이와 정밀성"
  },
  hi: {
    tone: "स्वर",
    outputIn: "आउटपुट भाषा",
    language: "भाषा",
    avoiding: "परहेज",
    important: "महत्वपूर्ण",
    respondIn: "इसमें उत्तर दें",
    langName: "हिन्दी",

    // Values
    max: "अधिकतम",
    high: "उच्च",
    taskSpecific: "केवल कार्य-विशिष्ट",
    structuredScannable: "संरचित और स्कैन करने योग्य",
    techAccuracy: "हर वाक्य में तकनीकी सटीकता",
    immediateApplicability: "त्वरित प्रयोज्यता आवश्यक",
    addressAllAspects: "कार्य के सभी पहलुओं को संबोधित करें",
    verifyAllClaims: "सभी दावों और सिफारिशों को सत्यापित करें",

    // Tone names
    professional: "पेशेवर",
    creative: "रचनात्मक",
    academic: "शैक्षणिक",
    concise: "संक्षिप्त",
    empathetic: "सहानुभूतिपूर्ण",
    humorous: "हास्यपूर्ण",
    direct: "सीधा",
    motivational: "प्रेरक",
    skeptical: "संदेहवादी",
    teacher: "शिक्षक",
    technical: "तकनीकी",

    asExpert: "इस क्षेत्र के विशेषज्ञ के रूप में,",
    pleaseCraft: "कृपया निम्नलिखित स्वर के साथ एक विस्तृत प्रतिक्रिया तैयार करें:",
    ensureOutput: "सुनिश्चित करें कि आउटपुट व्यापक है और इस भाषा में लिखा गया है:",
    regarding: "के बारे में:",
    coveringCore: ", जिसमें मूल अवधारणाओं और व्यावहारिक अनुप्रयोगों को शामिल किया गया है।",
    usingA: ", एक का उपयोग करते हुए",

    // Balanced
    actingSpecialist: "एक विशेषज्ञ के रूप में कार्य करते हुए, निम्नलिखित के लिए एक अच्छी तरह से संरचित प्रतिक्रिया प्रदान करें:",
    provideStructured: "एक अच्छी तरह से संरचित प्रतिक्रिया प्रदान करें",
    objectives: "## उद्देश्य",
    defineGoals: "प्राथमिक लक्ष्यों और अपेक्षित परिणामों को परिभाषित करें।",
    analysis: "## विश्लेषण",
    examineKey: "प्रमुख घटकों, संबंधों और अंतर्निहित सिद्धांतों की जांच करें।",
    implementation: "## कार्यान्वयन",
    provideActionable: "कार्रवाई योग्य कदम और व्यावहारिक सिफारिशें प्रदान करें।",
    maintainTone: "स्वर बनाए रखें:",

    distinguishedExpert: "आप निम्नलिखित विषय में व्यापक अनुभव रखने वाले एक विशिष्ट विशेषज्ञ हैं:",
    seekExpertise: "मैं एक व्यापक और अंतर्दृष्टिपूर्ण प्रतिक्रिया विकसित करने के लिए आपकी विशेषज्ञता चाहता हूं।",
    expertPersona: "## विशेषज्ञ व्यक्तित्व",
    actThoughtLeader: "गहन डोमेन ज्ञान और व्यावहारिक अनुभव के साथ एक विचार नेता के रूप में कार्य करें।",
    currentLandscape: "## वर्तमान परिदृश्य",
    summarizeContext: "मौजूदा संदर्भ, अत्याधुनिक दृष्टिकोण और हालिया प्रगति का सारांश प्रस्तुत करें।",
    detailedAnalysis: "## विस्तृत विश्लेषण",
    exploreCore: "मूल तंत्र, अंतर्निहित सिद्धांतों और सूक्ष्म विचारों का अन्वेषण करें।",
    bestPractices: "## सर्वोत्तम प्रथाएं",
    provideInsights: "कार्रवाई योग्य अंतर्दृष्टि, सिद्ध कार्यप्रणाली और विशेषज्ञ सिफारिशें प्रदान करें।",
    futureOutlook: "## भविष्य का दृष्टिकोण",
    offerProjections: "वर्तमान रुझानों और उभरते घटनाक्रमों के आधार पर अनुमान प्रस्तुत करें।",
    leverageKnowledge: "एक आधिकारिक और आकर्षक प्रतिक्रिया तैयार करने के लिए अपने विशिष्ट ज्ञान का लाभ उठाएं:",

    precisionProtocol: "## सटीक प्रोटोकॉल",
    taskSpecification: "### कार्य विशिष्टता",
    executionParameters: "### निष्पादन पैरामीटर",
    depth: "गहराई",
    precision: "सटीकता",
    constraints: "### बाधाएं",
    scope: "दायरा",
    outputRequirements: "### आउटपुट आवश्यकताएं",
    format: "प्रारूप",
    detailLevel: "विस्तार का स्तर",
    actionability: "कार्रवाई योग्यता",
    qualityMetrics: "### गुणवत्ता मेट्रिक्स",
    completeness: "पूर्णता",
    accuracy: "सटीकता",
    executeExactness: "हर समय तकनीकी सटीकता और स्पष्टता के साथ निष्पादित करें।",

    firstPrinciples: "## प्रथम सिद्धांत विश्लेषण",
    coreQuestion: "### मुख्य प्रश्न",
    foundationalReasoning: "### मौलिक तर्क",
    deconstructProblem: "इस समस्या को इसके मौलिक सत्यों में विभाजित करें और वहां से निर्माण करें। अपरिवर्तनीय घटकों और उनके संबंधों की पहचान करें।",
    historicalContext: "### ऐतिहासिक संदर्भ",
    traceEvolution: "इस क्षेत्र के विकास, प्रमुख सफलताओं और प्रतिमान बदलावों का पता लगाएं जो वर्तमान समझ को सूचित करते हैं।",
    theoreticalFramework: "### सैद्धांतिक रूपरेखा",
    establishPrinciples: "अंतर्निहित सिद्धांतों, मॉडलों और सिद्धांतों को स्थापित करें जो इस क्षेत्र को नियंत्रित करते हैं।",
    detailedAnalysisExpert: "### विस्तृत विश्लेषण",
    examineComplex: "जटिल अंतःक्रियाओं, निर्भरताओं और बारीकियों की जांच करें जो परिणामों को प्रभावित करती हैं।",
    edgeCases: "### किनारे के मामले और अपवाद",
    identifyBoundary: "सीमा स्थितियों, असामान्य परिदृश्यों और संभावित विफलता मोड की पहचान करें।",
    expertOptimizations: "### विशेषज्ञ अनुकूलन",
    provideAdvanced: "उन्नत तकनीकें, शॉर्टकट और अनुकूलन प्रदान करें जो केवल अभ्यासकर्ताओं को ज्ञात हैं।",
    synthesis: "### संश्लेषण और सिफारिशें",
    integrateInsights: "स्पष्ट औचित्य के साथ सभी अंतर्दृष्टि को कार्रवाई योग्य सिफारिशों में एकीकृत करें।",
    responseRequirements: "**प्रतिक्रिया आवश्यकताएँ:**",
    exhaustiveCoverage: "- स्वर के साथ व्यापक कवरेज:",
    writtenExclusively: "- विशेष रूप से इसमें लिखा गया है:",
    expertLevelDepth: "- विशेषज्ञ-स्तरीय गहराई और सटीकता"
  },
  tr: {
    tone: "ton",
    outputIn: "Çıktı dili",
    language: "Dil",
    avoiding: "Kaçınma",
    important: "ÖNEMLİ",
    respondIn: "Şu dilde yanıtla",
    langName: "Türkçe",

    // Values
    max: "Maksimum",
    high: "Yüksek",
    taskSpecific: "Yalnızca göreve özgü",
    structuredScannable: "Yapılandırılmış ve taranabilir",
    techAccuracy: "Her ifadede teknik doğruluk",
    immediateApplicability: "Acil uygulanabilirlik gerekli",
    addressAllAspects: "Görevin tüm yönlerini ele al",
    verifyAllClaims: "Tüm iddiaları ve önerileri doğrula",

    // Tone names
    professional: "profesyonel",
    creative: "yaratıcı",
    academic: "akademik",
    concise: "öz",
    empathetic: "empatik",
    humorous: "mizahi",
    direct: "doğrudan",
    motivational: "motive edici",
    skeptical: "şüpheci",
    teacher: "öğretmen",
    technical: "teknik",

    asExpert: "Bu alanda bir uzman olarak,",
    pleaseCraft: "lütfen şu tonda detaylı bir yanıt hazırlayın:",
    ensureOutput: "Çıktının kapsamlı olduğundan ve şu dilde yazıldığından emin olun:",
    regarding: "ilgili:",
    coveringCore: ", temel kavramları ve pratik uygulamaları kapsayan.",
    usingA: ", şunu kullanarak:",

    // Balanced
    actingSpecialist: "Bir uzman olarak hareket ederek, aşağıdakiler için iyi yapılandırılmış bir yanıt sağlayın:",
    provideStructured: "iyi yapılandırılmış bir yanıt sağlayın",
    objectives: "## Hedefler",
    defineGoals: "Birincil hedefleri ve beklenen sonuçları tanımlayın.",
    analysis: "## Analiz",
    examineKey: "Temel bileşenleri, ilişkileri ve temel ilkeleri inceleyin.",
    implementation: "## Uygulama",
    provideActionable: "Uygulanabilir adımlar ve pratik öneriler sağlayın.",
    maintainTone: "Tonda kalın:",

    distinguishedExpert: "Şu konuda geniş deneyime sahip saygın bir uzmansınız:",
    seekExpertise: "Kapsamlı ve anlayışlı bir yanıt geliştirmek için uzmanlığınıza başvuruyorum.",
    expertPersona: "## Uzman Persona",
    actThoughtLeader: "Derin alan bilgisi ve pratik deneyime sahip bir düşünce lideri olarak hareket edin.",
    currentLandscape: "## Mevcut Durum",
    summarizeContext: "Mevcut bağlamı, en son yaklaşımları ve son gelişmeleri özetleyin.",
    detailedAnalysis: "## Detaylı Analiz",
    exploreCore: "Temel mekanizmaları, temel ilkeleri ve incelikli hususları keşfedin.",
    bestPractices: "## En İyi Uygulamalar",
    provideInsights: "Uygulanabilir bilgiler, kanıtlanmış metodolojiler ve uzman önerileri sağlayın.",
    futureOutlook: "## Gelecek Görünümü",
    offerProjections: "Mevcut trendlere ve ortaya çıkan gelişmelere dayalı projeksiyonlar sunun.",
    leverageKnowledge: "Şu dilde yetkin ve ilgi çekici bir yanıt oluşturmak için uzmanlık bilginizden yararlanın:",

    precisionProtocol: "## HASSASİYET PROTOKOLÜ",
    taskSpecification: "### Görev Spesifikasyonu",
    executionParameters: "### Uygulama Parametreleri",
    depth: "Derinlik",
    precision: "Hassasiyet",
    constraints: "### Kısıtlamalar",
    scope: "Kapsam",
    outputRequirements: "### Çıktı Gereksinimleri",
    format: "Format",
    detailLevel: "Detay Seviyesi",
    actionability: "Uygulanabilirlik",
    qualityMetrics: "### Kalite Metrikleri",
    completeness: "Tamlık",
    accuracy: "Doğruluk",
    executeExactness: "Her zaman tam doğruluk ve teknik hassasiyetle uygulayın.",

    firstPrinciples: "## Temel İlkeler Analizi",
    coreQuestion: "### Temel Soru",
    foundationalReasoning: "### Temel Akıl Yürütme",
    deconstructProblem: "Bu sorunu temel gerçeklerine ayırın ve oradan inşa edin. İndirgenemez bileşenleri ve ilişkilerini tanımlayın.",
    historicalContext: "### Tarihsel Bağlam",
    traceEvolution: "Bu alanın evrimini, mevcut anlayışı şekillendiren temel atılımları ve paradigma değişimlerini izleyin.",
    theoreticalFramework: "### Teorik Çerçeve",
    establishPrinciples: "Bu alanı yöneten temel ilkeleri, modelleri ve teorileri belirleyin.",
    detailedAnalysisExpert: "### Detaylı Analiz",
    examineComplex: "Sonuçları etkileyen karmaşık etkileşimleri, bağımlılıkları ve incelikleri inceleyin.",
    edgeCases: "### Uç Durumlar ve İstisnalar",
    identifyBoundary: "Sınır koşullarını, olağandışı senaryoları ve olası hata modlarını belirleyin.",
    expertOptimizations: "### Uzman Optimizasyonları",
    provideAdvanced: "Yalnızca uygulayıcılar tarafından bilinen ileri teknikler, kısayollar ve optimizasyonlar sağlayın.",
    synthesis: "### Sentez ve Öneriler",
    integrateInsights: "Tüm bilgileri açık gerekçelerle uygulanabilir önerilere dönüştürün.",
    responseRequirements: "**Yanıt Gereksinimleri:**",
    exhaustiveCoverage: "- Şu tonla kapsamlı ele alma:",
    writtenExclusively: "- Özel olarak şu dilde yazılmıştır:",
    expertLevelDepth: "- Uzman düzeyinde derinlik ve hassasiyet"
  },
  nl: {
    tone: "toon",
    outputIn: "Output in",
    language: "Taal",
    avoiding: "Vermijden",
    important: "BELANGRIJK",
    respondIn: "Antwoord in",
    langName: "Nederlands",

    // Values
    max: "Maximaal",
    high: "Hoog",
    taskSpecific: "Alleen taakspecifiek",
    structuredScannable: "Gestructureerd en scanbaar",
    techAccuracy: "Technische nauwkeurigheid in elke verklaring",
    immediateApplicability: "Onmiddellijke toepasbaarheid vereist",
    addressAllAspects: "Behandel alle aspecten van de taak",
    verifyAllClaims: "Verifieer alle claims en aanbevelingen",

    // Tone names
    professional: "professioneel",
    creative: "creatief",
    academic: "academisch",
    concise: "beknopt",
    empathetic: "empathisch",
    humorous: "humoristisch",
    direct: "direct",
    motivational: "motiverend",
    skeptical: "sceptisch",
    teacher: "docent",
    technical: "technisch",

    asExpert: "Als expert in dit vakgebied,",
    pleaseCraft: "stel een gedetailleerd antwoord op met de toon:",
    ensureOutput: "Zorg ervoor dat de output uitgebreid is en geschreven in het",
    regarding: "betreffende:",
    coveringCore: ", waarbij kernconcepten en praktische toepassingen worden behandeld.",
    usingA: ", met gebruik van een",

    // Balanced
    actingSpecialist: "Optredend als specialist, geef een goed gestructureerd antwoord op het volgende:",
    provideStructured: "geef een goed gestructureerd antwoord",
    objectives: "## Doelstellingen",
    defineGoals: "Definieer de primaire doelen en verwachte resultaten.",
    analysis: "## Analyse",
    examineKey: "Onderzoek de belangrijkste componenten, relaties en onderliggende principes.",
    implementation: "## Implementatie",
    provideActionable: "Geef bruikbare stappen en praktische aanbevelingen.",
    maintainTone: "Behoud de toon:",

    distinguishedExpert: "U bent een vooraanstaand expert met uitgebreide ervaring in het onderwerp:",
    seekExpertise: "Ik zoek uw expertise om een uitgebreid en inzichtelijk antwoord te ontwikkelen.",
    expertPersona: "## Expert Persona",
    actThoughtLeader: "Acteer als een thought leader met diepgaande domeinkennis en praktische ervaring.",
    currentLandscape: "## Huidig Landschap",
    summarizeContext: "Vat de bestaande context, state-of-the-art benaderingen en recente vooruitgang samen.",
    detailedAnalysis: "## Gedetailleerde Analyse",
    exploreCore: "Verken de kernmechanismen, onderliggende principes en genuanceerde overwegingen.",
    bestPractices: "## Best Practices",
    provideInsights: "Geef bruikbare inzichten, bewezen methodologieën en expert aanbevelingen.",
    futureOutlook: "## Toekomstverwachting",
    offerProjections: "Bied projecties op basis van huidige trends en opkomende ontwikkelingen.",
    leverageKnowledge: "Gebruik uw gespecialiseerde kennis om een gezaghebbend en boeiend antwoord te genereren in het",

    precisionProtocol: "## PRECISIEPROTOCOL",
    taskSpecification: "### Taakspecificatie",
    executionParameters: "### Uitvoeringsparameters",
    depth: "Diepte",
    precision: "Precisie",
    constraints: "### Beperkingen",
    scope: "Reikwijdte",
    outputRequirements: "### Outputvereisten",
    format: "Formaat",
    detailLevel: "Detailniveau",
    actionability: "Toepasbaarheid",
    qualityMetrics: "### Kwaliteitsstatistieken",
    completeness: "Volledigheid",
    accuracy: "Nauwkeurigheid",
    executeExactness: "Voer te allen tijde uit met exactheid en technische precisie.",

    firstPrinciples: "## Eerste Principes Analyse",
    coreQuestion: "### Kernvraag",
    foundationalReasoning: "### Fundamentele Redenering",
    deconstructProblem: "Deconstrueer dit probleem tot de fundamentele waarheden en bouw van daaruit verder. Identificeer de onreduceerbare componenten en hun relaties.",
    historicalContext: "### Historische Context",
    traceEvolution: "Traceer de evolutie van dit domein, belangrijke doorbraken en paradigmaverschuivingen die het huidige begrip informeren.",
    theoreticalFramework: "### Theoretisch Kader",
    establishPrinciples: "Stel de onderliggende principes, modellen en theorieën vast die dit domein beheersen.",
    detailedAnalysisExpert: "### Gedetailleerde Analyse",
    examineComplex: "Onderzoek complexe interacties, afhankelijkheden en nuances die resultaten beïnvloeden.",
    edgeCases: "### Randgevallen & Uitzonderingen",
    identifyBoundary: "Identificeer randvoorwaarden, ongebruikelijke scenario's en potentiële faalwijzen.",
    expertOptimizations: "### Expert Optimalisaties",
    provideAdvanced: "Zorg voor geavanceerde technieken, kortere routes en optimalisaties die alleen bekend zijn bij beoefenaars.",
    synthesis: "### Synthese & Aanbevelingen",
    integrateInsights: "Integreer alle inzichten in bruikbare aanbevelingen met een duidelijke rationale.",
    responseRequirements: "**Responsvereisten:**",
    exhaustiveCoverage: "- Uitputtende dekking met de toon:",
    writtenExclusively: "- Uitsluitend geschreven in het",
    expertLevelDepth: "- Diepte en precisie op expertniveau"
  },
  pl: {
    tone: "ton",
    outputIn: "Wynik w języku",
    language: "Język",
    avoiding: "Unikanie",
    important: "WAŻNE",
    respondIn: "Odpowiedz w języku",
    langName: "Polski",

    // Values
    max: "Maksimum",
    high: "Wysoka",
    taskSpecific: "Tylko specyficzne dla zadania",
    structuredScannable: "Strukturyzowane i łatwe do przeglądania",
    techAccuracy: "Techniczna dokładność w każdym stwierdzeniu",
    immediateApplicability: "Wymagana natychmiantowa stosowalność",
    addressAllAspects: "Adresuj wszystkie aspekty zadania",
    verifyAllClaims: "Weryfikuj wszystkie twierdzenia i rekomendacje",

    // Tone names
    professional: "profesjonalny",
    creative: "kreatywny",
    academic: "akademicki",
    concise: "zwięzły",
    empathetic: "empatyczny",
    humorous: "humorystyczny",
    direct: "bezpośredni",
    motivational: "motywacyjny",
    skeptical: "sceptyczny",
    teacher: "nauczyciel",
    technical: "techniczny",

    asExpert: "Jako ekspert w tej dziedzinie,",
    pleaseCraft: "proszę przygotuj szczegółową odpowiedź w tonie:",
    ensureOutput: "Upewnij się, że wynik jest wyczerpujący i napisany w języku",
    regarding: "dotyczącym:",
    coveringCore: ", obejmującym podstawowe pojęcia i praktyczne zastosowania.",
    usingA: ", używając",

    // Balanced
    actingSpecialist: "Działając jako specjalista, zapewnij dobrze skonstruowaną odpowiedź na następujące pytania:",
    provideStructured: "zapewnij dobrze skonstruowaną odpowiedź",
    objectives: "## Cele",
    defineGoals: "Zdefiniuj główne cele i oczekiwane rezultaty.",
    analysis: "## Analiza",
    examineKey: "Zbadaj kluczowe komponenty, relacje i podstawowe zasady.",
    implementation: "## Implementacja",
    provideActionable: "Przedstaw kroki do podjęcia i praktyczne rekomendacje.",
    maintainTone: "Utrzymuj ton:",

    distinguishedExpert: "Jesteś wybitnym ekspertem z bogatym doświadczeniem w temacie:",
    seekExpertise: "Szukam Twojej wiedzy specjalistycznej, aby opracować kompleksową i wnikliwą odpowiedź.",
    expertPersona: "## Persona Eksperta",
    actThoughtLeader: "Działaj jako lider myśli z głęboką wiedzą dziedzinową i doświadczeniem praktycznym.",
    currentLandscape: "## Obecny Krajobraz",
    summarizeContext: "Podsumuj istniejący kontekst, najnowocześniejsze podejścia i ostatnie postępy.",
    detailedAnalysis: "## Szczegółowa Analiza",
    exploreCore: "Zbadaj podstawową mechanikę, zasady i niuanse.",
    bestPractices: "## Najlepsze Praktyki",
    provideInsights: "Dostarcz praktycznych spostrzeżeń, sprawdzonych metodologii i rekomendacji ekspertów.",
    futureOutlook: "## Perspektywy na Przyszłość",
    offerProjections: "Przedstaw prognozy oparte na obecnych trendach i pojawiających się zmianach.",
    leverageKnowledge: "Wykorzystaj swoją specjalistyczną wiedzę, aby wygenerować autorytatywną i angażującą odpowiedź w języku",

    precisionProtocol: "## PROTOKÓŁ PRECYZJI",
    taskSpecification: "### Specyfikacja Zadania",
    executionParameters: "### Parametry Wykonania",
    depth: "Głębokość",
    precision: "Precyzja",
    constraints: "### Ograniczenia",
    scope: "Zakres",
    outputRequirements: "### Wymagania dotyczące Wyniku",
    format: "Format",
    detailLevel: "Poziom Szczegółowości",
    actionability: "Możliwość podjęcia działań",
    qualityMetrics: "### Metryki Jakości",
    completeness: "Kompletność",
    accuracy: "Dokładność",
    executeExactness: "Wykonuj z dokładnością i techniczną precyzją przez cały czas.",

    firstPrinciples: "## Analiza Zasad Podstawowych",
    coreQuestion: "### Kluczowe Pytanie",
    foundationalReasoning: "### Podstawowe Rozumowanie",
    deconstructProblem: "Rozłóż ten problem na podstawowe prawdy i buduj od tego miejsca. Zidentyfikuj nieredukowalne komponenty i ich relacje.",
    historicalContext: "### Kontekst Historyczny",
    traceEvolution: "Prześledź ewolucję tej dziedziny, kluczowe przełomy i zmiany paradygmatów, które kształtują obecne rozumienie.",
    theoreticalFramework: "### Ramy Teoretyczne",
    establishPrinciples: "Ustal podstawowe zasady, modele i teorie rządzące tą dziedziną.",
    detailedAnalysisExpert: "### Szczegółowa Analiza",
    examineComplex: "Zbadaj złożone interakcje, zależności i niuanse wpływające na wyniki.",
    edgeCases: "### Przypadki Graniczne i Wyjątki",
    identifyBoundary: "Zidentyfikuj warunki brzegowe, nietypowe scenariusze i potencjalne tryby awarii.",
    expertOptimizations: "### Optymalizacje Eksperckie",
    provideAdvanced: "Zapewnij zaawansowane techniki, skróty i optymalizacje znane tylko praktykom.",
    synthesis: "### Synteza i Rekomendacje",
    integrateInsights: "Zintegruj wszystkie spostrzeżenia w możliwe do wdrożenia rekomendacje z jasnym uzasadnieniem.",
    responseRequirements: "**Wymagania Dotyczące Odpowiedzi:**",
    exhaustiveCoverage: "- Wyczerpujące omówienie w tonie:",
    writtenExclusively: "- Napisane wyłącznie w języku",
    expertLevelDepth: "- Głębokość i precyzja na poziomie eksperckim"
  },
};

// ------------------------------------------------------------------
// Tone Behavioral Directives
// Makes the selected tone actionable instead of decorative. Directives
// are kept in English — the lingua franca of prompt engineering — so
// they read as technical instructions regardless of output language.
// ------------------------------------------------------------------
const TONE_DIRECTIVES: Record<PromptTone, string> = {
  professional: "Set clear expectations, use precise terminology, and stay objective.",
  creative: "Explore unconventional angles and favor vivid, concrete imagery.",
  academic: "Ground every claim in evidence and maintain a formal register.",
  concise: "Eliminate redundancy, lead with the key point, and use zero filler.",
  empathetic: "Acknowledge the reader's situation first and stay supportive and non-judgmental.",
  humorous: "Keep it playful and light, never at the expense of clarity.",
  direct: "State conclusions first, with no hedging and no preamble.",
  motivational: "Energize the reader and emphasize agency and concrete next steps.",
  skeptical: "Challenge assumptions, stress-test claims, and flag weak evidence.",
  teacher: "Build from fundamentals, use analogies, and verify understanding step by step.",
  technical: "Prefer exact specifications over descriptions and cover edge cases.",
};

// ------------------------------------------------------------------
// Structured Prompt Model & Architecture Renderers
// Level templates build a structure-free model; the target architecture
// (standard / markdown / xml) owns ALL formatting. This prevents
// double-wrapping and guarantees "Standard" output is plain text.
// ------------------------------------------------------------------
interface PromptSection {
  title: string;
  body: string;
}

interface PromptStructure {
  intro: string;
  sections: PromptSection[];
  requirements?: string[];
}

/** Strips markdown decoration baked into some translation strings. */
const cleanHeading = (raw: string): string =>
  raw.replace(/^[#\s]+/, "").replace(/\*/g, "").replace(/[:：]\s*$/, "").trim();

const stripBullet = (raw: string): string => raw.replace(/^-\s*/, "");

const renderStandard = (s: PromptStructure): string => {
  const parts: string[] = [];
  if (s.intro) parts.push(s.intro);
  for (const sec of s.sections) parts.push(`${sec.title}\n${sec.body}`);
  if (s.requirements?.length) parts.push(s.requirements.join("\n"));
  return parts.join("\n\n");
};

const renderMarkdown = (s: PromptStructure): string => {
  const parts: string[] = ["## Instruction Set"];
  if (s.intro) parts.push(s.intro);
  for (const sec of s.sections) parts.push(`## ${sec.title}\n${sec.body}`);
  if (s.requirements?.length) {
    parts.push(`## Requirements\n${s.requirements.map((r) => `- ${r}`).join("\n")}`);
  }
  return parts.join("\n\n");
};

const escapeXml = (text: string): string =>
  text.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">");

const renderXml = (s: PromptStructure, langName: string, constraints: string): string => {
  const blocks: string[] = [];

  if (s.intro) {
    blocks.push(`<instructions>\n${escapeXml(s.intro)}\n</instructions>`);
  }

  const contextLines = [`  <language>${langName}</language>`];
  if (constraints) contextLines.push(`  <constraints>${escapeXml(constraints)}</constraints>`);
  blocks.push(`<context>\n${contextLines.join("\n")}\n</context>`);

  if (s.sections.length) {
    const sectionsXml = s.sections
      .map(
        (sec) =>
          `  <section>\n    <title>${escapeXml(sec.title)}</title>\n    <content>${escapeXml(sec.body)}</content>\n  </section>`
      )
      .join("\n");
    blocks.push(`<sections>\n${sectionsXml}\n</sections>`);
  }

  if (s.requirements?.length) {
    const reqXml = s.requirements.map((r) => `  <requirement>${escapeXml(r)}</requirement>`).join("\n");
    blocks.push(`<requirements>\n${reqXml}\n</requirements>`);
  }

  blocks.push(
    `<output_format>\nProvide a well-structured response that addresses the request comprehensively.\nIMPORTANT: Respond entirely in ${langName}.\n</output_format>`
  );

  return blocks.join("\n\n");
};

/** Tightens a raw prompt for the minimalist level: strips filler and normalizes spacing. */
const minimalistTransform = (prompt: string): string => {
  let p = prompt.trim();
  p = p.replace(/^(can|could)\s+you\s+/i, "");
  p = p.replace(/^i\s+(want|need|would like)\s+(you\s+to\s+)?/i, "");
  p = p.replace(/\b(please|kindly|just|basically|actually|simply|really)\b\s*/gi, "");
  p = p.replace(/\s{2,}/g, " ").trim();
  return p.charAt(0).toUpperCase() + p.slice(1);
};

export const enhancePrompt = (
  prompt: string,
  level: EnhancementLevel,
  tone: PromptTone,
  negative: string = "",
  format: OutputFormat = 'standard',
  uiLang: Language = 'en'
): EnhancedResult => {
  // Input validation
  const validation = validatePrompt(prompt);

  if (!validation.isValid) {
    return {
      text: "",
      techniques: [],
      tokenEstimate: 0,
      warnings: validation.errors
    };
  }

  // Detect the language of the input prompt. A real detection signal always
  // wins; the UI language is only used as a tie-breaker for very short
  // inputs where detection has nothing reliable to work with.
  let detectedLang = detectLanguage(prompt) as Language;
  if (detectedLang === 'en' && uiLang !== 'en' && prompt.trim().length < 12) {
    detectedLang = uiLang;
  }

  // Get translations for the detected language, fallback to English
  const t = TEMPLATE_TRANSLATIONS[detectedLang] || TEMPLATE_TRANSLATIONS['en'];

  // Bare constraint value (no wrapping parentheses) for contexts that embed
  // it inside their own syntax (XML tags, numbered parameters).
  const avoidValue = negative.trim() ? `${t.avoiding}: ${negative.trim()}` : "";
  const avoidSuffix = avoidValue ? ` (${avoidValue})` : "";

  // Localized tone name
  const toneDesc = t[tone as keyof typeof t] || tone.charAt(0).toUpperCase() + tone.slice(1);
  const directive = TONE_DIRECTIVES[tone] || "";

  const outputLangName = t.langName;
  const langInstruction = (detectedLang !== 'en' && detectedLang !== 'ar' && t.important && t.respondIn)
    ? `\n\n${t.important}: ${t.respondIn} ${outputLangName}.`
    : '';

  // Arabic uses noun+adjective order; other languages use adjective+noun
  const toneSuffix = (detectedLang === 'ar') ? '' : ` ${t.tone}`;

  let structure: PromptStructure;
  let techniques: string[];

  switch (level) {
    case 'minimalist': {
      structure = {
        intro: `${minimalistTransform(prompt)} (${toneDesc}).${avoidSuffix}`,
        sections: [],
      };
      techniques = ["Token Efficiency", "Filler Stripping"];
      break;
    }
    case 'simple': {
      structure = {
        intro: `${t.asExpert} ${t.pleaseCraft} ${toneDesc.toLowerCase()} ${t.regarding} "${prompt}"${t.coveringCore}${avoidSuffix}`,
        sections: [],
      };
      techniques = ["Natural Language Expansion", "Expert Framing"];
      break;
    }
    case 'balanced': {
      structure = {
        intro: `${t.actingSpecialist} "${prompt}" ${t.usingA} ${toneDesc.toLowerCase()}${toneSuffix}.`,
        sections: [
          { title: cleanHeading(t.objectives), body: t.defineGoals },
          { title: cleanHeading(t.analysis), body: t.examineKey },
          { title: cleanHeading(t.implementation), body: `${t.provideActionable}\n${t.maintainTone} ${toneDesc.toLowerCase()}.${avoidSuffix}` },
        ],
      };
      techniques = ["Balanced Structure", "Three-Section Framework", "Clear Organization"];
      break;
    }
    case 'advanced': {
      structure = {
        intro: `${t.distinguishedExpert} "${prompt}". ${t.seekExpertise}`,
        sections: [
          { title: cleanHeading(t.expertPersona), body: t.actThoughtLeader },
          { title: cleanHeading(t.currentLandscape), body: t.summarizeContext },
          { title: cleanHeading(t.detailedAnalysis), body: t.exploreCore },
          { title: cleanHeading(t.bestPractices), body: t.provideInsights },
          { title: cleanHeading(t.futureOutlook), body: `${t.offerProjections}\n${t.leverageKnowledge} ${t.usingA} ${toneDesc.toLowerCase()}${toneSuffix}.${avoidSuffix}` },
        ],
      };
      techniques = ["Persona Architecture", "Five-Section Framework", "Expert Positioning", "Comprehensive Coverage"];
      break;
    }
    case 'surgical': {
      structure = {
        intro: "",
        sections: [
          { title: cleanHeading(t.taskSpecification), body: `"${prompt}"` },
          {
            title: cleanHeading(t.executionParameters),
            body: `1. ${t.tone}: ${toneDesc} — ${directive}\n2. ${t.depth}: ${t.max}\n3. ${t.precision}: ${t.high}`,
          },
          {
            title: cleanHeading(t.constraints),
            body: avoidValue ? `4. ${avoidValue}` : `4. ${t.scope}: ${t.taskSpecific}`,
          },
          {
            title: cleanHeading(t.outputRequirements),
            body: `5. ${t.format}: ${t.structuredScannable}\n6. ${t.detailLevel}: ${t.techAccuracy}\n7. ${t.actionability}: ${t.immediateApplicability}`,
          },
          {
            title: cleanHeading(t.qualityMetrics),
            body: `8. ${t.completeness}: ${t.addressAllAspects}\n9. ${t.accuracy}: ${t.verifyAllClaims}\n\n${t.executeExactness}`,
          },
        ],
      };
      techniques = ["Semantic Precision", "Parameter-Style Formatting", "Numbered Constraints", "Quality Metrics"];
      break;
    }
    case 'expert':
    default: {
      structure = {
        intro: `${cleanHeading(t.firstPrinciples)} (${toneDesc})`,
        sections: [
          { title: cleanHeading(t.coreQuestion), body: `"${prompt}"` },
          { title: cleanHeading(t.foundationalReasoning), body: t.deconstructProblem },
          { title: cleanHeading(t.historicalContext), body: t.traceEvolution },
          { title: cleanHeading(t.theoreticalFramework), body: t.establishPrinciples },
          { title: cleanHeading(t.detailedAnalysisExpert), body: t.examineComplex },
          { title: cleanHeading(t.edgeCases), body: t.identifyBoundary },
          { title: cleanHeading(t.expertOptimizations), body: t.provideAdvanced },
          { title: cleanHeading(t.synthesis), body: t.integrateInsights },
        ],
        requirements: [
          `${stripBullet(t.exhaustiveCoverage)} ${toneDesc.toLowerCase()}`,
          `${stripBullet(t.writtenExclusively)} ${outputLangName}`,
          `${stripBullet(t.expertLevelDepth)}${avoidSuffix}`,
        ],
      };
      techniques = ["First Principles Reasoning", "Eight-Section Framework", "Edge Case Analysis", "Expert Optimizations", "Historical Context"];
      break;
    }
  }

  // Inject the tone's behavioral directive as a closing instruction line
  // (surgical already embeds it inline in its parameters).
  if (directive && level !== 'surgical' && level !== 'minimalist' && level !== 'simple' && structure.sections.length > 0) {
    const lastSection = structure.sections[structure.sections.length - 1];
    lastSection.body += `\n${directive}`;
  }

  // Render through the target architecture — the formatter owns ALL structure.
  let text: string;
  if (format === 'xml') {
    text = renderXml(structure, outputLangName, avoidValue);
    techniques.push("XML Structure");
  } else if (format === 'markdown') {
    text = renderMarkdown(structure);
    techniques.push("Markdown Structure");
  } else {
    text = renderStandard(structure);
  }

  // Language directive for non-English, non-Arabic outputs (Arabic templates
  // close with their own instruction; XML declares it in <output_format>).
  if (format !== 'xml') {
    text += langInstruction;
  }

  // Dynamic technique chips reflecting what actually happened in this run
  techniques.push(`Detected: ${getLanguageName(detectedLang)}`);
  techniques.push(`Tone: ${toneDesc}`);
  if (negative.trim()) techniques.push("Anti-Prompt Filter");

  return {
    text,
    techniques,
    tokenEstimate: estimateTokenCount(text),
    warnings: [...validation.warnings],
  };
};
