"use client";

import type { Quest } from "@/lib/types";
import { getQuestById } from "@/lib/quests";
import { Badge } from "@/components/ui/badge";

interface Props {
  questIds: string[];
  completedIds: string[];
}

const CATEGORY_ICONS: Record<string, string> = {
  WORK: "💼",
  EXERCISE: "🏃",
  STUDY: "📖",
  MEDITATE: "🧘",
  SLEEP: "😴",
  DEBUFF: "⚠️",
  UNKNOWN: "❓",
};

export default function QuestPanel({ questIds, completedIds }: Props) {
  const quests: Quest[] = questIds
    .map((id) => getQuestById(id))
    .filter(Boolean)
    .map((q) => ({ ...q!, completed: completedIds.includes(q!.id) }));

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-yellow-400" />
        <h2 className="text-sm font-mono text-slate-400 uppercase tracking-widest">
          Daily Quests
        </h2>
        <span className="ml-auto text-xs font-mono text-slate-600">
          {completedIds.length} / {quests.length}
        </span>
      </div>

      <div className="space-y-2">
        {quests.map((quest) => (
          <div
            key={quest.id}
            className={`flex items-center gap-3 p-2 rounded-lg border transition-all ${
              quest.completed
                ? "border-green-900 bg-green-950/30"
                : "border-slate-800 bg-slate-900/50"
            }`}
          >
            <span className="text-lg">{CATEGORY_ICONS[quest.category]}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-mono font-medium truncate ${
                    quest.completed ? "text-green-400 line-through" : "text-slate-200"
                  }`}
                >
                  {quest.title}
                </span>
                {quest.completed && (
                  <span className="text-green-500 text-xs">✓</span>
                )}
              </div>
              <span className="text-xs text-slate-500 font-mono">{quest.description}</span>
            </div>
            <Badge
              variant="outline"
              className={`text-xs shrink-0 font-mono ${
                quest.completed
                  ? "border-green-700 text-green-400"
                  : "border-yellow-800 text-yellow-500"
              }`}
            >
              +{quest.reward} EXP
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
