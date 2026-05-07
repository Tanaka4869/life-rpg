"use client";

import { useState, useEffect, useCallback } from "react";
import StatusPanel from "@/components/StatusPanel";
import ActionInput from "@/components/ActionInput";
import CommentBox from "@/components/CommentBox";
import QuestPanel from "@/components/QuestPanel";
import TitlePanel from "@/components/TitlePanel";
import LogHistory from "@/components/LogHistory";
import HintPanel from "@/components/HintPanel";
import { parseAction, calcLevel } from "@/lib/gameEngine";
import { loadStatus, saveStatus } from "@/lib/storage";
import { checkQuestCompletion, getQuestById } from "@/lib/quests";
import { checkNewTitles, getTitleById } from "@/data/titles";
import type { PlayerStatus, ActionResult } from "@/lib/types";

type Tab = "action" | "status" | "quest" | "titles";

export default function Home() {
  const [status, setStatus] = useState<PlayerStatus | null>(null);
  const [lastResult, setLastResult] = useState<ActionResult | null>(null);
  const [levelUp, setLevelUp] = useState(false);
  const [newTitleIds, setNewTitleIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("action");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setStatus(loadStatus());
  }, []);

  const handleAction = useCallback(
    (text: string) => {
      if (!status) return;
      setProcessing(true);
      setLevelUp(false);
      setNewTitleIds([]);

      setTimeout(() => {
        const result = parseAction(text);
        const prevLevel = calcLevel(status.exp).level;

        let updated: PlayerStatus = {
          ...status,
          exp: Math.max(0, status.exp + result.expGained),
          hp: Math.min(status.maxHp, Math.max(0, status.hp + result.hpDelta)),
          focus: Math.min(100, Math.max(0, status.focus + result.focusDelta)),
          strength: Math.max(1, status.strength + result.strengthDelta),
          intelligence: Math.max(1, status.intelligence + result.intelligenceDelta),
          logs: [
            ...status.logs,
            {
              id: Date.now().toString(),
              text,
              category: result.category,
              expGained: result.expGained,
              comment: result.comment,
              timestamp: new Date().toISOString(),
            },
          ],
        };

        // MaxHP grows with strength
        updated.maxHp = 100 + Math.floor(updated.strength / 5) * 10;
        updated.hp = Math.min(updated.hp, updated.maxHp);

        const newLevel = calcLevel(updated.exp).level;
        if (newLevel > prevLevel) {
          setLevelUp(true);
          updated.maxHp += 10;
          updated.hp = updated.maxHp;
        }
        updated.level = newLevel;

        // Quest completion
        const newCompletedIds = [...status.completedQuestIds];
        let questBonus = 0;
        for (const qid of status.todayQuestIds) {
          if (newCompletedIds.includes(qid)) continue;
          if (checkQuestCompletion(qid, result.category, result.minutes)) {
            newCompletedIds.push(qid);
            const q = getQuestById(qid);
            if (q) questBonus += q.reward;
          }
        }
        if (questBonus > 0) {
          updated.exp += questBonus;
          updated.level = calcLevel(updated.exp).level;
        }
        updated.completedQuestIds = newCompletedIds;

        // Title check
        const gained = checkNewTitles(updated);
        if (gained.length > 0) {
          updated.titles = [...updated.titles, ...gained];
          if (!updated.activeTitle) updated.activeTitle = gained[0];
          setNewTitleIds(gained.map((id) => getTitleById(id)?.name ?? id).filter(Boolean));
        }

        saveStatus(updated);
        setStatus(updated);
        setLastResult(result);
        setProcessing(false);
      }, 300);
    },
    [status]
  );

  const handleSelectTitle = useCallback(
    (titleId: string) => {
      if (!status) return;
      const updated = { ...status, activeTitle: titleId };
      saveStatus(updated);
      setStatus(updated);
    },
    [status]
  );

  if (!status) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-cyan-400 font-mono animate-pulse tracking-widest">LOADING...</div>
      </div>
    );
  }

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "action", label: "ACTION", icon: "✏️" },
    { id: "status", label: "STATUS", icon: "⚡" },
    { id: "quest", label: "QUEST", icon: "📋" },
    { id: "titles", label: "TITLES", icon: "🏅" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold font-mono text-cyan-400 tracking-widest">
              LIFE RPG
            </h1>
            <p className="text-xs text-slate-600 font-mono">人生をゲームとして生きろ</p>
          </div>
          <div className="text-right font-mono min-w-[100px]">
            <div className="text-xs text-slate-500">PLAYER</div>
            <div className="text-sm text-slate-200">LV.{status.level}</div>
            {(() => {
              const { currentExp, nextLevelExp } = calcLevel(status.exp);
              const pct = Math.round((currentExp / nextLevelExp) * 100);
              return (
                <div className="mt-1 space-y-0.5">
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="text-xs text-cyan-700">{currentExp}/{nextLevelExp}</div>
                </div>
              );
            })()}
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 flex border-t border-slate-900">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 text-xs font-mono font-medium tracking-wider transition-all ${
                activeTab === tab.id
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-slate-600 hover:text-slate-400"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-4 space-y-4 pb-8">
        {activeTab === "action" && (
          <>
            <ActionInput onSubmit={handleAction} disabled={processing} />
            <CommentBox result={lastResult} levelUp={levelUp} newTitles={newTitleIds} />
            <LogHistory logs={status.logs} />
          </>
        )}
        {activeTab === "status" && (
          <>
            <StatusPanel status={status} />
            <HintPanel />
          </>
        )}
        {activeTab === "quest" && (
          <QuestPanel
            questIds={status.todayQuestIds}
            completedIds={status.completedQuestIds}
          />
        )}
        {activeTab === "titles" && (
          <TitlePanel status={status} onSelectTitle={handleSelectTitle} />
        )}
      </main>
    </div>
  );
}
