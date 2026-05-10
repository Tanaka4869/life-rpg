"use client";

import { useState } from "react";
import { ONE_ACTIONS } from "@/data/oneActions";

interface Props {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

export default function OneActionPanel({ onSubmit, disabled }: Props) {
  const [doneLabel, setDoneLabel] = useState<string | null>(null);

  function handleTap(label: string, text: string) {
    if (disabled) return;
    setDoneLabel(label);
    onSubmit(text);
    setTimeout(() => setDoneLabel(null), 1500);
  }

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
        <h2 className="text-sm font-mono text-slate-400 uppercase tracking-widest">
          Quick Action
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {ONE_ACTIONS.map(({ label, icon, text }) => {
          const isDone = doneLabel === label;
          return (
            <button
              key={label}
              onClick={() => handleTap(label, text)}
              disabled={disabled}
              className={`flex items-center gap-2.5 px-3 py-3.5 rounded-lg border font-mono text-sm transition-all duration-200 active:scale-95 disabled:opacity-40 ${
                isDone
                  ? "border-green-500 text-green-400 bg-green-900/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]"
                  : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
              }`}
            >
              <span className="text-xl w-6 text-center leading-none">
                {isDone ? "✓" : icon}
              </span>
              <span className="leading-tight">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
