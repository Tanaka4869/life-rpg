"use client";

import { useEffect, useState } from "react";
import type { ActionResult } from "@/lib/types";

interface Props {
  result: ActionResult | null;
  levelUp: boolean;
  newTitles: string[];
}

const CATEGORY_LABELS: Record<string, string> = {
  WORK: "[ 副業 ]",
  EXERCISE: "[ 運動 ]",
  STUDY: "[ 学習 ]",
  MEDITATE: "[ 瞑想 ]",
  SLEEP: "[ 睡眠 ]",
  DEBUFF: "[ デバフ ]",
  UNKNOWN: "[ 行動 ]",
};

export default function CommentBox({ result, levelUp, newTitles }: Props) {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!result) return;
    setVisible(false);
    const t = setTimeout(() => {
      setText(result.comment);
      setVisible(true);
    }, 100);
    return () => clearTimeout(t);
  }, [result]);

  if (!result && !levelUp && newTitles.length === 0) {
    return (
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 min-h-[80px] flex items-center">
        <p className="text-slate-600 font-mono text-sm italic">
          &gt; 待機中... 行動を入力せよ
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* New title banners */}
      {newTitles.map((tid) => (
        <div key={tid} className="bg-purple-950 border border-purple-500 rounded-xl p-3">
          <p className="text-purple-300 font-mono text-sm text-center">
            🏅 新称号解除: <span className="text-purple-100 font-bold">{tid}</span>
          </p>
        </div>
      ))}

      {/* Main comment */}
      {result && (
        <div
          className={`bg-slate-950 border border-cyan-900 rounded-xl p-4 transition-all duration-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <div className="flex items-start gap-2 mb-2">
            <span className="text-cyan-600 font-mono text-xs">
              {CATEGORY_LABELS[result.category]}
            </span>
            <span className="text-slate-500 font-mono text-xs">
              {result.minutes}分
            </span>
          </div>

          <p className="text-slate-200 font-mono text-sm leading-relaxed">
            &gt; {text}
          </p>

          {/* EXP indicator */}
          <div className="mt-3 flex gap-3 text-xs font-mono flex-wrap">
            <span className={result.expGained >= 0 ? "text-cyan-400" : "text-red-400"}>
              EXP {result.expGained >= 0 ? "+" : ""}{result.expGained}
            </span>
            {result.hpDelta !== 0 && (
              <span className={result.hpDelta > 0 ? "text-green-400" : "text-red-400"}>
                HP {result.hpDelta > 0 ? "+" : ""}{result.hpDelta}
              </span>
            )}
            {result.intelligenceDelta > 0 && (
              <span className="text-blue-400">INT +{result.intelligenceDelta}</span>
            )}
            {result.strengthDelta > 0 && (
              <span className="text-orange-400">STR +{result.strengthDelta}</span>
            )}
            {result.focusDelta !== 0 && (
              <span className={result.focusDelta > 0 ? "text-indigo-400" : "text-red-400"}>
                FOC {result.focusDelta > 0 ? "+" : ""}{result.focusDelta}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
