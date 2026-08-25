import React from 'react';
import { PromptTemplate } from "@/utils/i18n";

interface PromptTemplatesProps {
  onSelect: (text: string) => void;
  templates: PromptTemplate[];
}

const PromptTemplates: React.FC<PromptTemplatesProps> = ({ onSelect, templates }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {templates.map((t) => (
        <button
          key={t.label}
          onClick={() => onSelect(t.text)}
          className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors border border-gray-200"
        >
          {t.label}
        </button>
      ))}
    </div>
  );
};

export default PromptTemplates;