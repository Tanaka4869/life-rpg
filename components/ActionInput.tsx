"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

const EXAMPLES = [
  "副業 1時間",
  "散歩 30分",
  "読書 45分",
  "筋トレ 1時間",
  "瞑想 10分",
  "夜更かし",
];

export default function ActionInput({ onSubmit, disabled }: Props) {
  const [text, setText] = useState("");

  function handleSubmit() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setText("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <h2 className="text-sm font-mono text-slate-400 uppercase tracking-widest">
          Action Log
        </h2>
      </div>

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={"今日の行動を入力...\n例: 副業 1時間 / 散歩 30分"}
        className="bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-600 font-mono text-sm resize-none focus:border-cyan-700 focus:ring-0 min-h-[80px]"
        disabled={disabled}
      />

      <div className="flex flex-wrap gap-1.5">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => setText(ex)}
            className="text-xs px-2 py-0.5 rounded border border-slate-700 text-slate-500 hover:border-cyan-700 hover:text-cyan-400 transition-colors font-mono"
          >
            {ex}
          </button>
        ))}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={disabled || !text.trim()}
        className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold font-mono tracking-wider transition-all duration-200 disabled:opacity-40"
      >
        ▶ 記録する
      </Button>
    </div>
  );
}
