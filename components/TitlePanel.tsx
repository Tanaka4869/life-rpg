"use client";

import { ALL_TITLES, getTitleById } from "@/data/titles";
import type { PlayerStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface Props {
  status: PlayerStatus;
  onSelectTitle: (titleId: string) => void;
}

export default function TitlePanel({ status, onSelectTitle }: Props) {
  const earned = status.titles;
  const locked = ALL_TITLES.filter((t) => !earned.includes(t.id));

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-purple-400" />
        <h2 className="text-sm font-mono text-slate-400 uppercase tracking-widest">
          Titles
        </h2>
        <span className="ml-auto text-xs font-mono text-slate-600">
          {earned.length} / {ALL_TITLES.length}
        </span>
      </div>

      {earned.length === 0 ? (
        <p className="text-slate-600 font-mono text-xs italic">
          まだ称号がない。行動して解除せよ。
        </p>
      ) : (
        <div className="space-y-1">
          <p className="text-xs font-mono text-slate-500 mb-2">▼ 取得済み（クリックで装備）</p>
          <div className="flex flex-wrap gap-2">
            {earned.map((tid) => {
              const t = getTitleById(tid);
              if (!t) return null;
              const isActive = status.activeTitle === tid;
              return (
                <button
                  key={tid}
                  onClick={() => onSelectTitle(tid)}
                  title={t.description}
                  className={`text-xs px-2 py-1 rounded border font-mono transition-all ${
                    isActive
                      ? "border-purple-400 bg-purple-900/40 text-purple-200"
                      : "border-slate-700 text-slate-400 hover:border-purple-600 hover:text-purple-300"
                  }`}
                >
                  {isActive ? "★ " : ""}{t.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {locked.length > 0 && (
        <div className="space-y-1 pt-2 border-t border-slate-800">
          <p className="text-xs font-mono text-slate-600 mb-2">▼ 未解除</p>
          <div className="flex flex-wrap gap-2">
            {locked.slice(0, 6).map((t) => (
              <Badge
                key={t.id}
                variant="outline"
                className="text-xs border-slate-800 text-slate-700 font-mono"
                title={t.description}
              >
                ??? {t.name}
              </Badge>
            ))}
            {locked.length > 6 && (
              <Badge variant="outline" className="text-xs border-slate-800 text-slate-700 font-mono">
                +{locked.length - 6} more
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
