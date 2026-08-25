import React from 'react';
import { Box, FileText, Code, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { OutputFormat } from '../utils/prompt-logic';
import { Translation } from '../utils/i18n';

interface ModelSelectorProps {
  currentModel: OutputFormat;
  onSelect: (model: OutputFormat) => void;
  t: Translation;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ currentModel, onSelect, t }) => {
  const models: { id: OutputFormat; label: string; icon: any; desc: string }[] = [
    { id: 'standard', label: t.standard, icon: Box, desc: t.standardDesc },
    { id: 'markdown', label: t.markdown, icon: FileText, desc: t.markdownDesc },
    { id: 'xml', label: t.xml, icon: Code, desc: t.xmlDesc },
  ];

  return (
    <div className="flex flex-col gap-2">
      {models.map((model) => {
        const Icon = model.icon;
        const isActive = currentModel === model.id;

        return (
          <button
            key={model.id}
            onClick={() => onSelect(model.id)}
            className={cn(
              "group flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 text-start w-full overflow-hidden",
              isActive
                ? "bg-white border-indigo-200 shadow-sm ring-4 ring-indigo-500/5 text-gray-900"
                : "bg-gray-50/50 border-transparent text-gray-400 hover:bg-gray-100"
            )}
          >
            <div className={cn(
              "flex-shrink-0 p-2 rounded-xl transition-colors",
              isActive ? "bg-indigo-50 text-indigo-600" : "bg-gray-100 text-gray-400"
            )}>
              <Icon size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-black uppercase tracking-tight truncate">
                {model.label}
              </div>
              <div className="text-[10px] opacity-60 leading-tight truncate">
                {model.desc}
              </div>
            </div>
            <ChevronRight
              size={14}
              className={cn(
                "flex-shrink-0 transition-all rtl:rotate-180",
                isActive ? "text-indigo-400 opacity-100 translate-x-0" : "opacity-0 -translate-x-2 rtl:translate-x-2"
              )}
            />
          </button>
        );
      })}
    </div>
  );
};

export default ModelSelector;