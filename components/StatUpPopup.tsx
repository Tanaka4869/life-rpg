"use client";

import { useEffect, useState } from "react";
import { STAT_DEFINITIONS } from "@/data/statConfig";
import type { ActionResult, PlayerStats } from "@/lib/types";

const CATEGORY_COLOR: Record<string, string> = {
  WORK:     "text-cyan-400 border-cyan-700 bg-cyan-950/60",
  STUDY:    "text-violet-400 border-violet-700 bg-violet-950/60",
  EXERCISE: "text-orange-400 border-orange-700 bg-orange-950/60",
  MEDITATE: "text-blue-400 border-blue-700 bg-blue-950/60",
  SLEEP:    "text-indigo-400 border-indigo-700 bg-indigo-950/60",
  HOUSEWORK:"text-green-400 border-green-700 bg-green-950/60",
  COOKING:  "text-yellow-400 border-yellow-700 bg-yellow-950/60",
  DEBUFF:   "text-red-400 border-red-700 bg-red-950/60",
  UNKNOWN:  "text-slate-400 border-slate-700 bg-slate-900/60",
};

const CATEGORY_LABEL: Record<string, string> = {
  WORK:     "WORK",
  STUDY:    "STUDY",
  EXERCISE: "EXERCISE",
  MEDITATE: "MEDITATE",
  SLEEP:    "SLEEP",
  HOUSEWORK:"HOUSEWORK",
  COOKING:  "COOKING",
  DEBUFF:   "DEBUFF",
  UNKNOWN:  "ACTION",
};

interface Props {
  show: boolean;
  result: ActionResult | null;
  statDeltas: Partial<PlayerStats> | null;
  tierUpTickets?: number;
  onClose: () => void;
}

export default function StatUpPopup({ show, result, statDeltas, tierUpTickets = 0, onClose }: Props) {
  const [visible, setVisible] = useState(false);
  const [animIn, setAnimIn] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimIn(true));
      });
      const t = setTimeout(() => {
        setAnimIn(false);
        setTimeout(() => {
          setVisible(false);
          onClose();
        }, 300);
      }, 3500);
      return () => clearTimeout(t);
    } else {
      setAnimIn(false);
      const t = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(t);
    }
  }, [show, onClose]);

  if (!visible || !result) return null;

  const changedStats = STAT_DEFINITIONS.filter(
    (def) => statDeltas?.[def.key] !== undefined && statDeltas[def.key] !== 0
  );
  const categoryStyle = CATEGORY_COLOR[result.category] ?? CATEGORY_COLOR.UNKNOWN;
  const categoryLabel = CATEGORY_LABEL[result.category] ?? "ACTION";

  return (
    <div
      className={`fixed bottom-6 inset-x-0 z-40 flex justify-center px-4 pointer-events-none transition-all duration-300 ${
        animIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div
        className="pointer-events-auto w-full max-w-sm bg-slate-950 border border-slate-700 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden cursor-pointer"
        onClick={() => {
          setAnimIn(false);
          setTimeout(() => {
            setVisible(false);
            onClose();
          }, 300);
        }}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-slate-800">
          <span className={`text-xs font-mono font-bold tracking-widest px-2 py-0.5 rounded border ${categoryStyle}`}>
            {categoryLabel}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500">EXP</span>
            <span className={`text-sm font-black font-mono ${result.expGained >= 0 ? "text-yellow-400" : "text-red-400"}`}>
              {result.expGained >= 0 ? "+" : ""}{result.expGained}
            </span>
          </div>
        </div>

        {/* ステータス変化 */}
        <div className="px-4 py-3">
          {changedStats.length === 0 ? (
            <p className="text-xs font-mono text-slate-600 text-center">ステータス変化なし</p>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {changedStats.map((def) => {
                const delta = statDeltas![def.key]!;
                const isPositive = delta > 0;
                return (
                  <div key={def.key} className="flex items-center gap-1.5">
                    <span className="text-sm leading-none">{def.icon}</span>
                    <span className="text-xs font-mono text-slate-400 flex-1 truncate">{def.label}</span>
                    <span
                      className={`text-xs font-black font-mono min-w-[2rem] text-right ${
                        isPositive ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {isPositive ? "+" : ""}{delta}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {tierUpTickets > 0 && (
          <div className="mx-4 mb-3 px-3 py-2 rounded-lg border border-yellow-600 bg-yellow-950/60 flex items-center gap-2">
            <span className="text-base leading-none">🎫</span>
            <span className="text-xs font-mono text-yellow-300 font-bold">
              TIER UP! ガチャチケット ×{tierUpTickets} 獲得
            </span>
          </div>
        )}
        <div className="text-center pb-2">
          <span className="text-xs font-mono text-slate-700">TAP TO DISMISS</span>
        </div>
      </div>
    </div>
  );
}
