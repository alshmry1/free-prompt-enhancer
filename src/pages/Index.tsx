import React, { useState, useEffect, useMemo } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wand2, RotateCcw, Sparkles, Ban, Terminal, Settings2, ChevronDown, ChevronUp, FastForward, Cpu } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import EnhancementLevelSelector from "@/components/EnhancementLevelSelector";
import EnhancedResultComponent from "@/components/EnhancedResult";
import PromptTemplates from "@/components/PromptTemplates";
import PromptHistory from "@/components/PromptHistory";
import PromptAnalysis from "@/components/PromptAnalysis";
import ToneSelector from "@/components/ToneSelector";
import ModelSelector from "@/components/ModelSelector";
import LanguageDropdown from "@/components/LanguageDropdown";
import SettingsModal from "@/components/SettingsModal";
import { EnhancementLevel, OutputFormat, enhancePrompt, validatePrompt, estimateTokenCount, detectLanguage, getLanguageName } from "@/utils/prompt-logic";
import { analyzePrompt } from "@/utils/analysis-logic";
import { showSuccess, showError } from "@/utils/toast";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { resolveApiKey, enhanceWithGemini } from "@/utils/gemini-client";
import { translations, isRTL } from "@/utils/i18n";
import { useUiLanguage } from "@/hooks/use-ui-language";

interface HistoryItem {
  id: string;
  original: string;
  enhanced: string;
  techniques: string[];
  timestamp: number;
  tokenEstimate?: number;
}

const Index = () => {
  const [lang, setLang] = useUiLanguage();
  const [input, setInput] = useState("");
  const [level, setLevel] = useState<EnhancementLevel>('simple');
  const [tone, setTone] = useState<any>('professional');
  const [model, setModel] = useState<OutputFormat>('standard');
  const [negative, setNegative] = useState("");
  const [output, setOutput] = useState({
    text: "",
    techniques: [] as string[],
    tokenEstimate: 0,
    warnings: [] as string[]
  });
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isFastProcessing, setIsFastProcessing] = useState(false);
  const [enhancementMode, setEnhancementMode] = useState<'ai' | 'fast'>('fast');
  const [lastRunMode, setLastRunMode] = useState<'ai' | 'fast'>('fast');
  const [showAllStrategies, setShowAllStrategies] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    const saved = localStorage.getItem('prompt_history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  const addToHistory = (original: string, enhanced: string, techniques: string[], tokenEstimate?: number) => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      original,
      enhanced,
      techniques,
      timestamp: Date.now(),
      tokenEstimate,
    };
    const updatedHistory = [newItem, ...history].slice(0, 20);
    setHistory(updatedHistory);
    localStorage.setItem('prompt_history', JSON.stringify(updatedHistory));
  };

  const handleFastEnhance = () => {
    if (!input.trim()) return;

    // Validate input before processing
    const validation = validatePrompt(input);
    if (!validation.isValid) {
      showError(validation.errors[0]);
      return;
    }

    setIsFastProcessing(true);
    setLastRunMode('fast');

    setTimeout(() => {
      const result = enhancePrompt(input, level, tone, negative, model, lang);

      // Check if enhancement returned errors
      if (result.warnings && result.warnings.some(w => w.includes("exceeds") || w.includes("empty"))) {
        showError(result.warnings[0]);
        setIsFastProcessing(false);
        return;
      }

      setOutput({
        text: result.text,
        techniques: result.techniques,
        tokenEstimate: result.tokenEstimate,
        warnings: result.warnings || []
      });
      addToHistory(input, result.text, result.techniques, result.tokenEstimate);
      showSuccess(t.successFast);
      setIsFastProcessing(false);
    }, 400);
  };

  const handleAiEnhance = async () => {
    if (!input.trim()) return;

    // Validate input before processing
    const validation = validatePrompt(input);
    if (!validation.isValid) {
      showError(validation.errors[0]);
      return;
    }

    setIsEnhancing(true);
    setLastRunMode('ai');
    try {
      // Resolve the Gemini key: Settings modal (localStorage) first,
      // then the .env file (VITE_GEMINI_API_KEY). Everything runs
      // directly in the browser — no server required.
      const apiKey = resolveApiKey();

      if (!apiKey) {
        throw new Error(t.edgeErrorHint);
      }

      const data = await enhanceWithGemini(input, level, String(tone), negative, model, lang, apiKey);

      const techniques = [
        "AI Semantic Rewriting",
        level === 'expert' ? "Chain-of-Thought" : "Contextual Expansion",
        tone.charAt(0).toUpperCase() + tone.slice(1) + " Calibration"
      ];

      // Add metadata to techniques if available
      if (data.metadata?.model) {
        techniques.push(`Model: ${data.metadata.model}`);
      }
      if (data.metadata?.tokensUsed) {
        techniques.push(`Tokens: ${data.metadata.tokensUsed}`);
      }
      if (data.metadata?.processingTimeMs) {
        techniques.push(`Time: ${data.metadata.processingTimeMs}ms`);
      }

      const tokenEstimate = data.metadata?.tokensUsed || estimateTokenCount(data.text);

      setOutput({
        text: data.text,
        techniques,
        tokenEstimate,
        warnings: []
      });
      addToHistory(input, data.text, techniques, tokenEstimate);
      showSuccess(t.successAi);
    } catch (err: any) {
      console.error("AI Enhance Error Detail:", err);
      showError(err.message || "AI failed");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleRegenerate = () => {
    if (!output.text || isEnhancing || isFastProcessing) return;
    if (lastRunMode === 'ai') {
      handleAiEnhance();
    } else {
      handleFastEnhance();
    }
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setInput(item.original);
    setOutput({
      text: item.enhanced,
      techniques: item.techniques,
      tokenEstimate: item.tokenEstimate || 0,
      warnings: []
    });
    showSuccess(t.successRestore);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Live prompt analysis (Phase 2: activates the dormant analyzer)
  const trimmedInput = input.trim();
  const detectedInputLang = trimmedInput ? detectLanguage(input) : null;
  const analysisSuggestions = useMemo(
    () => (trimmedInput.length >= 5 ? analyzePrompt(input, detectedInputLang ?? 'en').suggestions : []),
    [input]
  );

  return (
    <div
      dir={isRTL(lang) ? 'rtl' : 'ltr'}
      className={cn(
        "min-h-screen bg-[#F8FAFC] selection:bg-indigo-100 selection:text-indigo-900 relative overflow-hidden flex flex-col items-center py-12 px-4 sm:px-6 transition-all duration-500",
        isRTL(lang) ? "font-arabic" : "font-sans"
      )}
    >
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/20 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] bg-purple-200/20 rounded-full blur-[140px]" />
      </div>

      <div className="w-full max-w-5xl z-10 space-y-10">
        <header>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="hidden sm:flex p-2.5 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/20 flex-shrink-0">
                <Wand2 size={16} className="text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg md:text-xl font-black tracking-tight truncate">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">
                    {t.title}
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 font-medium truncate mt-0.5">
                  {t.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <LanguageDropdown current={lang} onSelect={setLang} />
              <SettingsModal t={t} lang={lang} />
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-12">
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-200/60 p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-slate-800">
                  <Terminal size={18} className="text-indigo-500" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">{t.initVector}</h3>
                </div>
                {input && (
                  <button
                    onClick={() => setInput("")}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors uppercase"
                  >
                    <RotateCcw size={12} /> {t.purge}
                  </button>
                )}
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[1.5rem] blur opacity-0 group-focus-within:opacity-10 transition duration-500" />
                <Textarea
                  dir={isRTL(lang) ? 'rtl' : 'ltr'}
                  placeholder={t.placeholder}
                  className="relative min-h-[220px] text-lg font-medium rounded-[1.5rem] border-slate-100 bg-slate-50/50 p-6 focus:bg-white focus:ring-0 focus:border-indigo-200 transition-all resize-none custom-scrollbar shadow-inner"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>

              {/* Character, Token Counter & Detected Language */}
              <div className="flex items-center justify-between px-2 text-xs gap-2">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className={cn(
                    "font-medium transition-colors",
                    input.length > 7500 ? "text-red-500" : input.length > 5000 ? "text-amber-500" : "text-slate-500"
                  )}>
                    {input.length} / 8000 {t.chars}
                  </span>
                  <span className="text-slate-500">
                    ~{estimateTokenCount(input)} tokens
                  </span>
                  {detectedInputLang && trimmedInput.length >= 3 && (
                    <span className="text-slate-500 font-medium">
                      {t.detected}: {getLanguageName(detectedInputLang)}
                    </span>
                  )}
                </div>
                {input.length > 5000 && (
                  <span className="text-amber-500 font-medium whitespace-nowrap">
                    ⚠️ {t.longPrompt}
                  </span>
                )}
              </div>

              {/* Live Analysis Panel */}
              <PromptAnalysis hasInput={trimmedInput.length >= 5} suggestions={analysisSuggestions} t={t} />

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-400 px-1">
                  <Sparkles size={14} />
                  <span>{t.inspiration}</span>
                </div>
                <PromptTemplates onSelect={setInput} templates={t.templates} />
              </div>

              <div className="space-y-4 pt-2">
                <RadioGroup
                  value={enhancementMode}
                  onValueChange={(v: any) => setEnhancementMode(v)}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="relative">
                    <RadioGroupItem
                      value="ai"
                      id="ai"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="ai"
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300",
                        enhancementMode === 'ai'
                          ? "bg-indigo-50 border-indigo-600 text-indigo-700 shadow-md scale-[1.02]"
                          : "bg-white border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50"
                      )}
                    >
                      <Cpu size={20} className={cn("mb-2 transition-transform duration-500", enhancementMode === 'ai' && "rotate-12")} />
                      <span className="text-xs font-black uppercase tracking-wider">{t.aiEnhance}</span>
                    </Label>
                    {enhancementMode === 'ai' && (
                      <div className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <RadioGroupItem
                      value="fast"
                      id="fast"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="fast"
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300",
                        enhancementMode === 'fast'
                          ? "bg-amber-50 border-amber-500 text-amber-700 shadow-md scale-[1.02]"
                          : "bg-white border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50"
                      )}
                    >
                      <FastForward size={20} className={cn("mb-2 transition-transform duration-500", enhancementMode === 'fast' && "translate-x-1")} />
                      <span className="text-xs font-black uppercase tracking-wider">{t.fastEnhance}</span>
                    </Label>
                    {enhancementMode === 'fast' && (
                      <div className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                      </div>
                    )}
                  </div>
                </RadioGroup>

                <Button
                  className={cn(
                    "w-full h-16 text-lg font-black rounded-2xl gap-3 transition-all duration-300 shadow-xl group overflow-hidden relative",
                    input.trim()
                      ? "bg-slate-900 border-b-4 border-slate-700 hover:bg-slate-800 hover:border-b-2 active:border-b-0 active:translate-y-1 text-white shadow-indigo-500/10"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                  )}
                  onClick={enhancementMode === 'ai' ? handleAiEnhance : handleFastEnhance}
                  disabled={!input.trim() || isEnhancing || isFastProcessing}
                >
                  {isEnhancing || isFastProcessing ? (
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="tracking-widest uppercase">{t.synthsizing}</span>
                    </div>
                  ) : (
                    <>
                      <Wand2 size={24} className="group-hover:rotate-12 transition-transform text-indigo-400" />
                      <span className="tracking-tight uppercase">{t.startEnhance}</span>
                      <Sparkles size={18} className="text-amber-400 group-hover:scale-125 transition-transform" />
                    </>
                  )}
                </Button>
              </div>

              <div className={cn(
                "bg-slate-50/50 rounded-2xl border border-slate-100 p-5 space-y-4 transition-all duration-500",
                enhancementMode === 'ai' && "opacity-40 grayscale pointer-events-none select-none"
              )}>
                <div className="flex items-center gap-2 px-1">
                  <Sparkles size={14} className="text-indigo-500" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-800">{t.optStrategy}</h3>
                </div>
                <EnhancementLevelSelector
                  currentLevel={level}
                  onSelect={setLevel}
                  showAll={showAllStrategies}
                  onToggleShowAll={setShowAllStrategies}
                  t={t}
                />
              </div>

              {showAllStrategies && (
                <Collapsible
                  open={isAdvancedOpen && enhancementMode === 'fast'}
                  onOpenChange={setIsAdvancedOpen}
                  className={cn(
                    "bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/40 border border-white overflow-hidden transition-all duration-500",
                    enhancementMode === 'ai' && "opacity-40 grayscale pointer-events-none select-none font-sans"
                  )}
                >
                  <CollapsibleTrigger asChild>
                    <button className="flex items-center justify-between w-full p-6 md:px-8 hover:bg-white/50 transition-colors group">
                      <div className="flex items-center gap-2 text-slate-800">
                        <Settings2 size={18} className={cn("transition-transform duration-500", isAdvancedOpen ? "text-indigo-500 rotate-90" : "text-slate-400")} />
                        <h3 className="text-sm font-bold uppercase tracking-wider">{t.advancedParams}</h3>
                      </div>
                      {isAdvancedOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                    </button>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="p-6 md:px-8 pt-0 space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="h-px bg-slate-100 w-full mb-6" />

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">{t.targetArch}</h4>
                      <ModelSelector currentModel={model} onSelect={setModel} t={t} />
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">{t.personality}</h4>
                      <ToneSelector currentTone={tone} onSelect={setTone} t={t} />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.antiPrompt}</h4>
                        <Ban size={12} className="text-slate-300" />
                      </div>
                      <div className="relative group">
                        <Input
                          placeholder={t.excludePlaceholder}
                          className="rounded-2xl border-slate-100 bg-slate-50/50 ps-4 h-12 text-sm focus:bg-white focus:ring-0 focus:border-red-200 transition-all shadow-inner"
                          value={negative}
                          onChange={(e) => setNegative(e.target.value)}
                        />
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}

            </div>
          </div>

          <div className="lg:col-span-6 space-y-8 lg:sticky lg:top-8">
            <EnhancedResultComponent
              content={output.text}
              techniques={output.techniques}
              t={t}
              tokenEstimate={output.tokenEstimate}
              warnings={output.warnings}
              format={model}
              onRegenerate={handleRegenerate}
            />

            <div className="px-4">
              <PromptHistory
                items={history}
                onSelect={handleSelectHistory}
                onClear={() => { setHistory([]); localStorage.removeItem('prompt_history'); }}
                t={t}
              />
            </div>
          </div>
        </main>

        <footer className="pt-8 pb-12 border-t border-slate-200/60 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
            &copy; {new Date().getFullYear()} Crash AI. {t.copyright}.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;