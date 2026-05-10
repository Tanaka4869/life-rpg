"use client";

import { useEffect, useState } from "react";
import type { PlayerStats, StatKey } from "@/lib/types";
import { STAT_DEFINITIONS } from "@/data/statConfig";

/** バーが 100 の倍数ごとに折り返す上限値 */
const TIER_SIZE = 100;

interface Props {
  stats: PlayerStats;
  lastDeltas: Partial<PlayerStats> | null;
}

export default function StatGrowthPanel({ stats, lastDeltas }: Props) {
  const [flashDeltas, setFlashDeltas] = useState<Partial<PlayerStats> | null>(null);

  // 新しいデルタを受け取るたびに 2.5 秒間フラッシュ表示
  useEffect(() => {
    if (!lastDeltas || Object.keys(lastDeltas).length === 0) return;
    setFlashDeltas(lastDeltas);
    const t = setTimeout(() => setFlashDeltas(null), 2500);
    return () => clearTimeout(t);
  }, [lastDeltas]);

  const totalStats = Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-slate-950 border border-cyan-900 rounded-xl p-4 space-y-3 shadow-[0_0_20px_rgba(0,255,255,0.05)]">
      {/* ヘッダー */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="text-xs font-mono text-cyan-600 tracking-widest">
          📊 CHARACTER STATS
        </span>
        <span className="text-xs font-mono text-slate-600">
          TOTAL <span className="text-slate-400">{totalStats}</span>
        </span>
      </div>

      {/* ステータス一覧 */}
      <div className="space-y-3">
        {STAT_DEFINITIONS.map(({ key, label, labelEn, icon, color, description }) => {
          const value = stats[key] ?? 0;
          const delta = flashDeltas?.[key];
          // ティア内の進捗（0〜TIER_SIZE でループ）
          const inTierValue = value % TIER_SIZE;
          const tier = Math.floor(value / TIER_SIZE);
          const barPct = value === 0 ? 0 : inTierValue === 0 ? 100 : (inTierValue / TIER_SIZE) * 100;

          return (
            <div key={key} className="group">
              <div className="flex items-center justify-between mb-1">
                {/* 左側：アイコン + 名前 */}
                <div className="flex items-center gap-2">
                  <span className="text-base w-5 text-center leading-none">{icon}</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs font-mono text-slate-300 leading-none">
                      {label}
                    </span>
                    <span className="text-xs font-mono text-slate-700 leading-none">
                      {labelEn}
                    </span>
                    {tier > 0 && (
                      <span className="text-xs font-mono text-cyan-700 leading-none">
                        Tier.{tier + 1}
                      </span>
                    )}
                  </div>
                </div>

                {/* 右側：増減フラッシュ + 現在値 */}
                <div className="flex items-center gap-2">
                  {delta !== undefined && delta > 0 && (
                    <span
                      key={`${key}-plus-${Date.now()}`}
                      className="text-xs font-mono font-bold text-green-400 animate-bounce"
                    >
                      +{delta}
                    </span>
                  )}
                  {delta !== undefined && delta < 0 && (
                    <span className="text-xs font-mono font-bold text-red-400 animate-pulse">
                      {delta}
                    </span>
                  )}
                  <span className="text-sm font-bold font-mono text-slate-200 min-w-[2.5rem] text-right tabular-nums">
                    {value}
                  </span>
                </div>
              </div>

              {/* プログレスバー */}
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-700`}
                  style={{ width: `${barPct}%` }}
                />
              </div>

              {/* ホバーで説明表示 */}
              <div className="text-xs text-slate-700 font-mono mt-0.5 h-0 overflow-hidden group-hover:h-auto transition-all duration-200">
                {description}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-slate-800 font-mono text-center pt-1">
        行動を記録してステータスを育てよう
      </p>
    </div>
  );
}
