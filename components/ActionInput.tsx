"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

const TIME_OPTIONS: { label: string; value: string }[] = [
  { label: "10分",   value: "10分" },
  { label: "15分",   value: "15分" },
  { label: "30分",   value: "30分" },
  { label: "45分",   value: "45分" },
  { label: "1時間",  value: "1時間" },
  { label: "1.5h",   value: "1時間30分" },
  { label: "2時間",  value: "2時間" },
  { label: "3時間",  value: "3時間" },
  { label: "なし",   value: "" },
];

const ACTION_SHORTCUTS = [
  "仕事", "学習", "個人開発", "読書",
  "筋トレ", "散歩", "掃除", "料理",
];

const DEFAULT_TIME = "30分";

export default function ActionInput({ onSubmit, disabled }: Props) {
  const [action, setAction] = useState("");
  const [selectedTime, setSelectedTime] = useState(DEFAULT_TIME);

  function handleSubmit() {
    const trimmed = action.trim();
    if (!trimmed) return;
    const text = selectedTime ? `${trimmed} ${selectedTime}` : trimmed;
    onSubmit(text);
    setAction("");
    setSelectedTime(DEFAULT_TIME);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
      {/* ヘッダー */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <h2 className="text-sm font-mono text-slate-400 uppercase tracking-widest">
          Action Log
        </h2>
      </div>

      {/* 行動入力 */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono text-slate-500 tracking-wider">
          ▸ 行動
        </label>
        <input
          type="text"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="例: 副業 / 筋トレ / 掃除"
          className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 placeholder:text-slate-600 font-mono text-sm focus:outline-none focus:border-cyan-700 transition-colors"
          disabled={disabled}
        />
        {/* ショートカット */}
        <div className="grid grid-cols-4 gap-2 pt-0.5">
          {ACTION_SHORTCUTS.map((s) => (
            <button
              key={s}
              onClick={() => setAction(s)}
              className={`py-2.5 rounded border font-mono text-sm transition-colors ${
                action === s
                  ? "border-cyan-600 text-cyan-400 bg-cyan-900/30"
                  : "border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-400"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* 時間選択 */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono text-slate-500 tracking-wider">
          ▸ 時間
        </label>
        <div className="grid grid-cols-3 gap-2">
          {TIME_OPTIONS.map(({ label, value }) => (
            <button
              key={label}
              onClick={() => setSelectedTime(value)}
              className={`py-3 rounded text-sm font-mono border transition-all duration-150 ${
                selectedTime === value
                  ? "border-cyan-500 text-cyan-300 bg-cyan-900/40 shadow-[0_0_8px_rgba(34,211,238,0.2)]"
                  : "border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 記録ボタン */}
      <Button
        onClick={handleSubmit}
        disabled={disabled || !action.trim()}
        className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold font-mono tracking-wider transition-all duration-200 disabled:opacity-40"
      >
        ▶ 記録する
      </Button>
    </div>
  );
}
