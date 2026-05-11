"use client";

import { useState, useEffect, useCallback } from "react";
import StatusPanel from "@/components/StatusPanel";
import ActionInput from "@/components/ActionInput";
import CommentBox from "@/components/CommentBox";
import QuestPanel from "@/components/QuestPanel";
import TitlePanel from "@/components/TitlePanel";
import LogHistory from "@/components/LogHistory";
import HintPanel from "@/components/HintPanel";
import StatGrowthPanel from "@/components/StatGrowthPanel";
import OneActionPanel from "@/components/OneActionPanel";
import GachaPanel from "@/components/GachaPanel";
import BattlePanel from "@/components/BattlePanel";
import InventoryPanel from "@/components/InventoryPanel";
import LevelUpModal from "@/components/LevelUpModal";
import StatUpPopup from "@/components/StatUpPopup";
import { parseAction, calcLevel } from "@/lib/gameEngine";
import { loadStatus, saveStatus, hasSaveData, resetAllData, initNewPlayer } from "@/lib/storage";
import { applyStatDeltas } from "@/lib/statEngine";
import { checkQuestCompletion, getQuestById } from "@/lib/quests";
import { checkNewTitles, getTitleById } from "@/data/titles";
import type { PlayerStatus, ActionResult, PlayerStats, GachaRecord } from "@/lib/types";

type Tab = "home" | "status" | "task" | "battle" | "gacha" | "achievement" | "history";
type Screen = "title" | "menu" | "game";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "home",        label: "ホーム",  icon: "🏠" },
  { id: "status",      label: "ステータス", icon: "⚡" },
  { id: "task",        label: "タスク",  icon: "📋" },
  { id: "battle",      label: "バトル",  icon: "⚔️" },
  { id: "gacha",       label: "ガチャ",  icon: "🔮" },
  { id: "achievement", label: "実績",    icon: "🏅" },
  { id: "history",     label: "履歴",    icon: "📜" },
];

export default function Home() {
  const [screen, setScreen] = useState<Screen>("title");
  const [hasSave, setHasSave] = useState(false);
  const [pushPulse, setPushPulse] = useState(true);

  const [status, setStatus] = useState<PlayerStatus | null>(null);
  const [lastResult, setLastResult] = useState<ActionResult | null>(null);
  const [lastStatDeltas, setLastStatDeltas] = useState<Partial<PlayerStats> | null>(null);
  const [levelUp, setLevelUp] = useState(false);
  const [newTitleIds, setNewTitleIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [processing, setProcessing] = useState(false);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [showStatPopup, setShowStatPopup] = useState(false);

  useEffect(() => {
    setHasSave(hasSaveData());
  }, []);

  const handlePush = useCallback(() => {
    setPushPulse(false);
    setScreen("menu");
  }, []);

  const handleContinue = useCallback(() => {
    setStatus(loadStatus());
    setScreen("game");
  }, []);

  const handleNewGame = useCallback(() => {
    resetAllData();
    setStatus(initNewPlayer());
    setScreen("game");
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
          stats: applyStatDeltas(status.stats, result.statDeltas),
          // ガチャ石獲得 (EXP×10%、最低1)
          gachaStones: status.gachaStones + Math.max(1, Math.floor(Math.abs(result.expGained) * 0.1)),
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

        updated.maxHp = 100 + Math.floor(updated.strength / 5) * 10;
        updated.hp = Math.min(updated.hp, updated.maxHp);

        const newLevel = calcLevel(updated.exp).level;
        if (newLevel > prevLevel) {
          setLevelUp(true);
          setShowLevelUpModal(true);
          updated.maxHp += 10;
          updated.hp = updated.maxHp;
          // レベルアップボーナス
          updated.gachaStones += 50;
        }
        updated.level = newLevel;

        const newCompletedIds = [...status.completedQuestIds];
        let questBonus = 0;
        let questStones = 0;
        for (const qid of status.todayQuestIds) {
          if (newCompletedIds.includes(qid)) continue;
          if (checkQuestCompletion(qid, result.category, result.minutes)) {
            newCompletedIds.push(qid);
            const q = getQuestById(qid);
            if (q) {
              questBonus += q.reward;
              questStones += 20;
            }
          }
        }
        if (questBonus > 0) {
          updated.exp += questBonus;
          updated.level = calcLevel(updated.exp).level;
          updated.gachaStones += questStones;
        }
        updated.completedQuestIds = newCompletedIds;

        const gained = checkNewTitles(updated);
        if (gained.length > 0) {
          updated.titles = [...updated.titles, ...gained];
          if (!updated.activeTitle) updated.activeTitle = gained[0];
          setNewTitleIds(gained.map((id) => getTitleById(id)?.name ?? id).filter(Boolean));
        }

        saveStatus(updated);
        setStatus(updated);
        setLastResult(result);
        setLastStatDeltas({ ...result.statDeltas });
        setShowStatPopup(true);
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

  const handleGachaRoll = useCallback(
    (results: GachaRecord[], cost: { stones: number; tickets: number }) => {
      if (!status) return;
      const newInventory = { ...status.inventory };
      for (const r of results) {
        newInventory[r.itemId] = (newInventory[r.itemId] ?? 0) + 1;
      }
      const updated: PlayerStatus = {
        ...status,
        gachaStones: status.gachaStones - cost.stones,
        gachaTickets: status.gachaTickets - cost.tickets,
        gachaHistory: [...status.gachaHistory, ...results].slice(-200),
        inventory: newInventory,
      };
      saveStatus(updated);
      setStatus(updated);
    },
    [status]
  );

  const handleUseItem = useCallback(
    (itemId: string) => {
      if (!status) return;
      const current = status.inventory[itemId] ?? 0;
      if (current <= 0) return;
      const newInventory = { ...status.inventory };
      if (current === 1) {
        delete newInventory[itemId];
      } else {
        newInventory[itemId] = current - 1;
      }
      const updated: PlayerStatus = { ...status, inventory: newInventory };
      saveStatus(updated);
      setStatus(updated);
    },
    [status]
  );

  const handleBattleResult = useCallback(
    (hpDelta: number, focusDelta: number, expGained: number, stonesGained: number, newBossHp: number, defeated: boolean) => {
      if (!status) return;
      const updated: PlayerStatus = {
        ...status,
        hp: Math.max(0, Math.min(status.maxHp, status.hp + hpDelta)),
        focus: Math.max(0, Math.min(100, status.focus + focusDelta)),
        exp: status.exp + expGained,
        gachaStones: status.gachaStones + stonesGained,
        bossHp: newBossHp,
        bossDefeats: defeated ? status.bossDefeats + 1 : status.bossDefeats,
      };
      updated.level = calcLevel(updated.exp).level;
      saveStatus(updated);
      setStatus(updated);
    },
    [status]
  );

  // ── タイトル画面 ──────────────────────────────────────────────
  if (screen === "title") {
    return (
      <div
        className="min-h-screen bg-slate-950 flex flex-col items-center justify-center cursor-pointer select-none"
        onClick={handlePush}
      >
        <div className="text-center space-y-6 px-8">
          <div className="space-y-2">
            <h1 className="text-6xl font-black font-mono text-cyan-400 tracking-widest drop-shadow-[0_0_24px_rgba(34,211,238,0.5)]">
              LIFE RPG
            </h1>
            <p className="text-slate-500 font-mono text-sm tracking-widest">
              人生をゲームとして生きろ
            </p>
          </div>
          <div className="pt-8">
            <div
              className={`text-cyan-300 font-mono text-lg tracking-[0.3em] transition-opacity duration-700 ${
                pushPulse ? "animate-pulse" : "opacity-0"
              }`}
            >
              ── PUSH START ──
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 text-slate-700 font-mono text-xs tracking-widest">
          TAP ANYWHERE TO START
        </div>
      </div>
    );
  }

  // ── スタートメニュー画面 ─────────────────────────────────────
  if (screen === "menu") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-full max-w-sm px-8 space-y-8">
          <div className="text-center space-y-1">
            <h1 className="text-3xl font-black font-mono text-cyan-400 tracking-widest">
              LIFE RPG
            </h1>
            <p className="text-slate-600 font-mono text-xs tracking-widest">
              人生をゲームとして生きろ
            </p>
          </div>
          <div className="space-y-4">
            <button
              onClick={handleContinue}
              disabled={!hasSave}
              className={`w-full py-4 font-mono font-bold text-lg tracking-widest border-2 transition-all duration-200 rounded-sm ${
                hasSave
                  ? "border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_16px_rgba(34,211,238,0.3)]"
                  : "border-slate-700 text-slate-600 cursor-not-allowed"
              }`}
            >
              つづきから
              {!hasSave && (
                <span className="block text-xs text-slate-700 font-normal tracking-normal mt-1">
                  セーブデータなし
                </span>
              )}
            </button>
            <button
              onClick={handleNewGame}
              className="w-full py-4 font-mono font-bold text-lg tracking-widest border-2 border-red-700 text-red-400 hover:bg-red-700/10 hover:shadow-[0_0_16px_rgba(239,68,68,0.3)] transition-all duration-200 rounded-sm"
            >
              はじめから
              {hasSave && (
                <span className="block text-xs text-red-700 font-normal tracking-normal mt-1">
                  ※ セーブデータは削除されます
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── ゲーム画面 ───────────────────────────────────────────────
  if (!status) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-cyan-400 font-mono animate-pulse tracking-widest">LOADING...</div>
      </div>
    );
  }

  const { currentExp, nextLevelExp } = calcLevel(status.exp);
  const expPct = Math.round((currentExp / nextLevelExp) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <LevelUpModal
        show={showLevelUpModal}
        newLevel={status.level}
        onClose={() => setShowLevelUpModal(false)}
      />
      <StatUpPopup
        show={showStatPopup}
        result={lastResult}
        statDeltas={lastStatDeltas}
        onClose={() => setShowStatPopup(false)}
      />
      {/* ── Header ── */}
      <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-2 flex items-center justify-between">
          <div>
            <h1 className="text-base font-black font-mono text-cyan-400 tracking-widest">LIFE RPG</h1>
            <div className="flex gap-2 text-xs font-mono text-slate-500 mt-0.5">
              <span className="text-yellow-400">💎 {status.gachaStones}</span>
              <span className="text-cyan-500">🎫 {status.gachaTickets}</span>
            </div>
          </div>
          <div className="text-right font-mono">
            <div className="text-xs text-slate-500">LV.{status.level}</div>
            <div className="mt-0.5 w-28">
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full transition-all duration-700"
                  style={{ width: `${expPct}%` }}
                />
              </div>
              <div className="text-right text-xs text-cyan-700 mt-0.5">{currentExp}/{nextLevelExp}</div>
            </div>
          </div>
        </div>

        {/* Tab bar — scrollable on small screens */}
        <div className="max-w-2xl mx-auto px-2 flex border-t border-slate-900 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex flex-col items-center px-3 py-2 text-xs font-mono font-medium transition-all ${
                activeTab === tab.id
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-slate-600 hover:text-slate-400"
              }`}
            >
              <span className="text-base leading-none">{tab.icon}</span>
              <span className="mt-0.5 tracking-wide" style={{ fontSize: "9px" }}>{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="max-w-2xl mx-auto px-4 py-4 space-y-4 pb-8">

        {/* ホーム */}
        {activeTab === "home" && (
          <>
            {/* Mini status strip */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-red-400">HP</span>
                  <span className="text-slate-300">{status.hp}/{status.maxHp}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-700 to-rose-400 rounded-full transition-all duration-700"
                    style={{ width: `${Math.round((status.hp / status.maxHp) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-blue-400">FOCUS</span>
                  <span className="text-slate-300">{status.focus}/100</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-700 to-blue-400 rounded-full transition-all duration-700"
                    style={{ width: `${status.focus}%` }}
                  />
                </div>
              </div>
              <div className="text-center">
                <div className="text-yellow-400 font-bold font-mono">🔥</div>
                <div className="text-yellow-400 font-bold font-mono text-xs">{status.streak}日</div>
              </div>
            </div>

            <ActionInput onSubmit={handleAction} disabled={processing} />
            <OneActionPanel onSubmit={handleAction} disabled={processing} />
            <CommentBox result={lastResult} levelUp={levelUp} newTitles={newTitleIds} />
          </>
        )}

        {/* ステータス */}
        {activeTab === "status" && (
          <>
            <StatusPanel status={status} />
            <StatGrowthPanel stats={status.stats} lastDeltas={lastStatDeltas} />
            <HintPanel />
          </>
        )}

        {/* タスク */}
        {activeTab === "task" && (
          <>
            <QuestPanel
              questIds={status.todayQuestIds}
              completedIds={status.completedQuestIds}
            />
            <OneActionPanel onSubmit={handleAction} disabled={processing} />
          </>
        )}

        {/* バトル */}
        {activeTab === "battle" && (
          <BattlePanel status={status} onBattleResult={handleBattleResult} />
        )}

        {/* ガチャ */}
        {activeTab === "gacha" && (
          <>
            <GachaPanel
              stones={status.gachaStones}
              tickets={status.gachaTickets}
              onRoll={handleGachaRoll}
            />
            <InventoryPanel
              inventory={status.inventory}
              onUse={handleUseItem}
            />
          </>
        )}

        {/* 実績 */}
        {activeTab === "achievement" && (
          <>
            <TitlePanel status={status} onSelectTitle={handleSelectTitle} />
            {/* Boss defeat record */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h3 className="text-sm font-mono text-slate-400 tracking-widest mb-3">ACHIEVEMENTS</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "ボス撃破数", value: status.bossDefeats, icon: "⚔️", color: "text-red-400" },
                  { label: "ガチャ回数", value: status.gachaHistory.length, icon: "🔮", color: "text-purple-400" },
                  { label: "総ログ数", value: status.logs.length, icon: "📝", color: "text-cyan-400" },
                  { label: "称号数", value: status.titles.length, icon: "🏅", color: "text-yellow-400" },
                ].map((a) => (
                  <div key={a.label} className="bg-slate-800/60 rounded-lg p-3 text-center">
                    <div className="text-2xl">{a.icon}</div>
                    <div className={`font-black font-mono text-lg ${a.color}`}>{a.value}</div>
                    <div className="text-slate-500 text-xs font-mono">{a.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* 履歴 */}
        {activeTab === "history" && (
          <>
            <LogHistory logs={status.logs} />
            {/* Gacha history */}
            {status.gachaHistory.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <h3 className="text-sm font-mono text-slate-400 tracking-widest mb-3">GACHA HISTORY</h3>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {[...status.gachaHistory].reverse().slice(0, 30).map((r) => {
                    const rarityColor: Record<string, string> = {
                      COMMON: "text-slate-400",
                      UNCOMMON: "text-emerald-400",
                      RARE: "text-yellow-400",
                      SUPER_RARE: "text-purple-400",
                    };
                    return (
                      <div key={r.id} className="flex items-center gap-2 text-xs font-mono">
                        <span className={rarityColor[r.rarity]}>[{r.rarity === "SUPER_RARE" ? "SR" : r.rarity.slice(0, 2)}]</span>
                        <span className="text-slate-300 flex-1">{r.itemName}</span>
                        <span className="text-slate-600">{new Date(r.timestamp).toLocaleDateString("ja-JP")}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
