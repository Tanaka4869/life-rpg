"use client";

import type { ActionLog } from "@/lib/types";

interface Props {
  logs: ActionLog[];
}

const CATEGORY_COLOR: Record<string, string> = {
  WORK: "text-cyan-400",
  EXERCISE: "text-green-400",
  STUDY: "text-blue-400",
  MEDITATE: "text-indigo-400",
  SLEEP: "text-purple-400",
  DEBUFF: "text-red-400",
  UNKNOWN: "text-slate-400",
};

const CATEGORY_LABEL: Record<string, string> = {
  WORK: "副業",
  EXERCISE: "運動",
  STUDY: "学習",
  MEDITATE: "瞑想",
  SLEEP: "睡眠",
  DEBUFF: "デバフ",
  UNKNOWN: "その他",
};

export default function LogHistory({ logs }: Props) {
  const recent = [...logs].reverse().slice(0, 10);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-slate-500" />
        <h2 className="text-sm font-mono text-slate-400 uppercase tracking-widest">
          Battle Log
        </h2>
      </div>

      {recent.length === 0 ? (
        <p className="text-slate-600 font-mono text-xs italic">
          記録なし。今日の行動を入力せよ。
        </p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
          {recent.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-2 text-xs font-mono border-b border-slate-900 pb-2"
            >
              <span className={`shrink-0 ${CATEGORY_COLOR[log.category]}`}>
                [{CATEGORY_LABEL[log.category]}]
              </span>
              <span className="text-slate-300 flex-1 leading-relaxed">{log.text}</span>
              <span className={`shrink-0 ${log.expGained >= 0 ? "text-cyan-500" : "text-red-500"}`}>
                {log.expGained >= 0 ? "+" : ""}{log.expGained}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
