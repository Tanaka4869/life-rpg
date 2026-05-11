"use client";

import { useState } from "react";

const HINTS = [
  {
    stat: "EXP",
    color: "text-cyan-400",
    icon: "✨",
    actions: [
      { label: "副業・作業・開発", value: "+50/h" },
      { label: "読書・勉強・学習", value: "+40/h" },
      { label: "料理・自炊", value: "+30/h" },
      { label: "運動・筋トレ・散歩", value: "+30/h" },
      { label: "家事・掃除・洗濯", value: "+25/h" },
      { label: "瞑想・休憩", value: "+20/h" },
      { label: "睡眠", value: "+10/h" },
      { label: "夜更かし・SNS", value: "−20（固定）" },
    ],
  },
  {
    stat: "HP",
    color: "text-rose-400",
    icon: "❤️",
    actions: [
      { label: "睡眠", value: "+10/h" },
      { label: "運動・散歩", value: "+5/h" },
      { label: "瞑想・休憩", value: "+3/h" },
      { label: "料理・自炊", value: "+2/h" },
      { label: "夜更かし", value: "−5/h" },
      { label: "翌日ログイン時", value: "+20（自動回復）" },
    ],
  },
  {
    stat: "集中力",
    color: "text-blue-400",
    icon: "🧠",
    actions: [
      { label: "瞑想・マインドフルネス", value: "+10/h" },
      { label: "プログラミング・開発", value: "+5/h" },
      { label: "副業・作業", value: "+2/h" },
      { label: "勉強・学習", value: "+4/h" },
      { label: "睡眠", value: "+3/h" },
      { label: "夜更かし・SNS", value: "−4/h" },
    ],
  },
  {
    stat: "知力",
    color: "text-purple-400",
    icon: "📚",
    actions: [
      { label: "英語・語学", value: "+8/h" },
      { label: "勉強・学習", value: "+7/h" },
      { label: "読書", value: "+7/h" },
      { label: "プログラミング・開発", value: "+4/h" },
      { label: "副業・作業", value: "+2/h" },
    ],
  },
  {
    stat: "体力",
    color: "text-orange-400",
    icon: "🏃",
    actions: [
      { label: "ランニング・ジョギング", value: "+7/h" },
      { label: "サイクリング", value: "+6/h" },
      { label: "筋トレ系", value: "+5/h" },
      { label: "運動全般", value: "+3/h" },
      { label: "睡眠", value: "+5/h" },
      { label: "夜更かし", value: "−1/h" },
    ],
  },
  {
    stat: "健康力",
    color: "text-emerald-400",
    icon: "💚",
    actions: [
      { label: "睡眠", value: "+9/h" },
      { label: "散歩・ウォーキング", value: "+5/h" },
      { label: "ヨガ・ストレッチ", value: "+5/h" },
      { label: "瞑想・マインドフルネス", value: "+3/h" },
      { label: "ランニング", value: "+4/h" },
      { label: "夜更かし", value: "−2/h" },
    ],
  },
  {
    stat: "筋力",
    color: "text-red-400",
    icon: "💪",
    actions: [
      { label: "筋トレ・腕立て・スクワット", value: "+6/h" },
      { label: "運動全般", value: "+2/h" },
    ],
  },
  {
    stat: "実行力",
    color: "text-yellow-400",
    icon: "⚡",
    actions: [
      { label: "副業・ライティング・ブログ", value: "+8/h" },
      { label: "副業・作業全般", value: "+4/h" },
      { label: "家事全般", value: "+1/h" },
    ],
  },
  {
    stat: "家事力",
    color: "text-teal-400",
    icon: "🏠",
    actions: [
      { label: "洗濯・干した・アイロン", value: "+7/h" },
      { label: "掃除・片付け・整理整頓", value: "+6/h" },
      { label: "家事全般", value: "+4/h" },
    ],
  },
  {
    stat: "自炊力",
    color: "text-amber-400",
    icon: "🍳",
    actions: [
      { label: "料理・自炊・調理", value: "+5/h" },
    ],
  },
  {
    stat: "綺麗さ",
    color: "text-pink-400",
    icon: "✨",
    actions: [
      { label: "掃除・片付け・整理整頓", value: "+9/h" },
      { label: "洗濯・干した", value: "+8/h" },
      { label: "家事全般", value: "+4/h" },
    ],
  },
  {
    stat: "エンジニア力",
    color: "text-indigo-400",
    icon: "💻",
    actions: [
      { label: "プログラミング・コーディング・開発", value: "+5/h" },
    ],
  },
];

export default function HintPanel() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-900 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-600" />
          <span className="text-sm font-mono text-slate-400 uppercase tracking-widest">
            Hint — ステータスの育て方
          </span>
        </div>
        <span className="text-slate-600 font-mono text-xs">{open ? "▲ 閉じる" : "▼ 開く"}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-slate-900">
          <p className="text-xs text-slate-600 font-mono pt-3">
            行動の時間が長いほど効果大。時間未記入はデフォルト30分で計算。
          </p>
          {HINTS.map((hint) => (
            <div key={hint.stat}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-sm">{hint.icon}</span>
                <span className={`text-xs font-bold font-mono ${hint.color}`}>{hint.stat}</span>
              </div>
              <div className="space-y-1">
                {hint.actions.map((a) => (
                  <div key={a.label} className="flex justify-between text-xs font-mono">
                    <span className="text-slate-500">{a.label}</span>
                    <span className={a.value.startsWith("−") ? "text-red-500" : "text-slate-300"}>
                      {a.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
