"use client";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { PlayerStatus } from "@/lib/types";
import { calcLevel } from "@/lib/gameEngine";
import { getTitleById } from "@/data/titles";

interface Props {
  status: PlayerStatus;
}

function StatBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-mono">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-200">{value} / {max}</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function StatChip({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="flex flex-col items-center bg-slate-900 border border-slate-700 rounded-lg p-2 min-w-[64px]">
      <span className="text-lg">{icon}</span>
      <span className="text-cyan-400 font-bold font-mono text-sm">{value}</span>
      <span className="text-slate-500 text-xs">{label}</span>
    </div>
  );
}

export default function StatusPanel({ status }: Props) {
  const { level, currentExp, nextLevelExp } = calcLevel(status.exp);
  const titleObj = status.activeTitle ? getTitleById(status.activeTitle) : null;
  const expPct = Math.round((currentExp / nextLevelExp) * 100);

  return (
    <div className="bg-slate-950 border border-cyan-900 rounded-xl p-4 space-y-4 shadow-[0_0_20px_rgba(0,255,255,0.05)]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-cyan-400 font-mono">LV.{level}</span>
            {titleObj && (
              <Badge variant="outline" className="text-xs border-cyan-800 text-cyan-300">
                {titleObj.name}
              </Badge>
            )}
          </div>
          <div className="text-slate-500 text-xs font-mono mt-0.5">
            TOTAL EXP: {status.exp.toLocaleString()}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500 font-mono">STREAK</div>
          <div className="text-xl font-bold text-yellow-400 font-mono">🔥 {status.streak}日</div>
        </div>
      </div>

      {/* EXP Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-cyan-500">EXP</span>
          <span className="text-slate-300">{currentExp} / {nextLevelExp}</span>
        </div>
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
          <div
            className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full transition-all duration-700"
            style={{ width: `${expPct}%` }}
          />
        </div>
        <div className="text-right text-xs text-slate-600 font-mono">{expPct}% to NEXT LEVEL</div>
      </div>

      {/* HP & Focus */}
      <div className="space-y-2">
        <StatBar label="HP" value={status.hp} max={status.maxHp} color="bg-gradient-to-r from-red-800 to-rose-500" />
        <StatBar label="集中力 FOCUS" value={status.focus} max={100} color="bg-gradient-to-r from-blue-800 to-blue-400" />
      </div>

      {/* Stats */}
      <div className="flex gap-2 flex-wrap">
        <StatChip label="STR 体力" value={status.strength} icon="⚔️" />
        <StatChip label="INT 知力" value={status.intelligence} icon="📚" />
        <StatChip label="称号数" value={status.titles.length} icon="🏅" />
        <StatChip label="ログ数" value={status.logs.length} icon="📝" />
      </div>
    </div>
  );
}
