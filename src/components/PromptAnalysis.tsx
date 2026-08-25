import React from 'react';
import { Lightbulb, CheckCircle2 } from "lucide-react";
import { Translation } from "@/utils/i18n";

interface PromptAnalysisProps {
  hasInput: boolean;
  suggestions: string[];
  t: Translation;
}

const PromptAnalysis: React.FC<PromptAnalysisProps> = ({ hasInput, suggestions, t }) => {
  if (!hasInput) return null;

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-2.5 animate-in fade-in duration-300">
      <div className="flex items-center gap-2 px-1">
        <Lightbulb size={13} className="text-amber-500" />
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-600">{t.analysis}</h3>
      </div>
      {suggestions.length === 0 ? (
        <div className="flex items-center gap-2 px-1 text-xs font-medium text-emerald-600">
          <CheckCircle2 size={13} />
          {t.analysisGreat}
        </div>
      ) : (
        <ul className="space-y-1.5 px-1">
          {suggestions.map((s) => (
            <li key={s} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
              <span className="mt-1.5 h-1 w-1 rounded-full bg-indigo-400 flex-shrink-0" />
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PromptAnalysis;