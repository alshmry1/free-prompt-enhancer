import React from 'react';
import { cn } from "@/lib/utils";
import { 
  MessageSquareText, 
  GraduationCap, 
  Flame, 
  Briefcase, 
  Heart, 
  Laugh, 
  Target, 
  Rocket, 
  Search, 
  BookOpen, 
  Cpu 
} from "lucide-react";
import { PromptTone } from "@/utils/prompt-logic";
import { Translation } from "@/utils/i18n";

interface ToneSelectorProps {
  currentTone: PromptTone;
  onSelect: (tone: PromptTone) => void;
  t: Translation;
}

const ToneSelector: React.FC<ToneSelectorProps> = ({ currentTone, onSelect, t }) => {
  const tones: { id: PromptTone; label: string; icon: any; color: string }[] = [
    { id: 'professional', label: t.professional, icon: Briefcase, color: 'text-blue-500' },
    { id: 'creative', label: t.creative, icon: Flame, color: 'text-orange-500' },
    { id: 'academic', label: t.academic, icon: GraduationCap, color: 'text-indigo-500' },
    { id: 'concise', label: t.concise, icon: MessageSquareText, color: 'text-green-500' },
    { id: 'empathetic', label: t.empathetic, icon: Heart, color: 'text-pink-500' },
    { id: 'humorous', label: t.humorous, icon: Laugh, color: 'text-yellow-500' },
    { id: 'direct', label: t.direct, icon: Target, color: 'text-red-500' },
    { id: 'motivational', label: t.motivational, icon: Rocket, color: 'text-purple-500' },
    { id: 'skeptical', label: t.skeptical, icon: Search, color: 'text-slate-500' },
    { id: 'teacher', label: t.teacher, icon: BookOpen, color: 'text-emerald-500' },
    { id: 'technical', label: t.technical, icon: Cpu, color: 'text-cyan-500' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tones.map((tone) => {
        const Icon = tone.icon;
        const isActive = currentTone === tone.id;
        
        return (
          <button
            key={tone.id}
            onClick={() => onSelect(tone.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 text-xs font-bold whitespace-nowrap",
              isActive 
                ? "bg-white border-primary shadow-sm ring-4 ring-primary/5 text-gray-900" 
                : "bg-gray-50/50 border-transparent text-gray-400 hover:bg-gray-100"
            )}
          >
            <Icon size={14} className={cn(isActive ? tone.color : "text-gray-300")} />
            {tone.label}
          </button>
        );
      })}
    </div>
  );
};

export default ToneSelector;