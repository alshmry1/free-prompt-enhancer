import React from 'react';
import { Sparkles, Zap, ShieldCheck, Leaf, Scale, Target } from "lucide-react";
import { EnhancementLevel } from "@/utils/prompt-logic";
import { cn } from "@/lib/utils";
import { Translation } from "@/utils/i18n";

interface LevelSelectorProps {
  currentLevel: EnhancementLevel;
  onSelect: (level: EnhancementLevel) => void;
  showAll: boolean;
  onToggleShowAll: (show: boolean) => void;
  t: Translation;
}

const EnhancementLevelSelector: React.FC<LevelSelectorProps> = ({ currentLevel, onSelect, showAll, onToggleShowAll, t }) => {

  const allLevels: { id: EnhancementLevel; label: string; icon: any; color: string; desc: string }[] = [
    { id: 'simple', label: t.simple, icon: Sparkles, color: 'text-blue-500 bg-blue-50', desc: t.simpleDesc },
    { id: 'advanced', label: t.advanced, icon: Zap, color: 'text-purple-500 bg-purple-50', desc: t.advancedDesc },
    { id: 'expert', label: t.expert, icon: ShieldCheck, color: 'text-indigo-600 bg-indigo-50', desc: t.expertDesc },
    { id: 'minimalist', label: t.minimalist, icon: Leaf, color: 'text-emerald-500 bg-emerald-50', desc: t.minimalistDesc },
    { id: 'balanced', label: t.balanced, icon: Scale, color: 'text-amber-500 bg-amber-50', desc: t.balancedDesc },
    { id: 'surgical', label: t.surgical, icon: Target, color: 'text-red-500 bg-red-50', desc: t.surgicalDesc },
  ];

  const filteredLevels = showAll ? allLevels : allLevels.filter(l => l.id === 'simple' || l.id === 'advanced');

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {filteredLevels.map((level) => {
          const Icon = level.icon;
          const isActive = currentLevel === level.id;

          return (
            <button
              key={level.id}
              onClick={() => onSelect(level.id)}
              className={cn(
                "flex flex-row items-center gap-2 p-2.5 rounded-2xl border-2 transition-all duration-200 text-start w-full overflow-hidden",
                isActive
                  ? "border-indigo-500 bg-indigo-50 shadow-sm"
                  : "border-gray-50 bg-white hover:border-gray-100"
              )}
            >
              <div className={cn("flex-shrink-0 p-1.5 rounded-xl", level.color)}>
                <Icon size={14} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-gray-900 text-[11px] leading-tight truncate">
                  {level.label}
                </span>
                <span className="text-[10px] text-gray-500 leading-tight truncate">
                  {level.desc}
                </span>
              </div>
            </button>
          );
        })}

        <button
          onClick={() => onToggleShowAll(!showAll)}
          className="flex items-center justify-center gap-2 p-2.5 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-all duration-200 text-[10px] font-black uppercase tracking-tight"
        >
          <span>{showAll ? t.less : `+ ${t.more}`}</span>
        </button>
      </div>
    </div>
  );
};

export default EnhancementLevelSelector;