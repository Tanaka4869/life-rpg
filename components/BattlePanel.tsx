"use client";

import { useState, useCallback } from "react";
import type { PlayerStatus } from "@/lib/types";
import { getTodayBoss } from "@/data/bosses";
import { STAT_DEFINITIONS } from "@/data/statConfig";

interface Props {
  status: PlayerStatus;
  onBattleResult: (hpDelta: number, focusDelta: number, expGained: number, stonesGained: number, newBossHp: number, defeated: boolean) => void;
}

type BattleAnim = "idle" | "player-attack" | "boss-attack" | "victory" | "defeat";

function DamageFloat({ value, isPlayer }: { value: number; isPlayer: boolean }) {
  return (
    <div
      className={`absolute font-black text-lg anim-float-up pointer-events-none ${
        isPlayer ? "text-cyan-300 right-4 top-4" : "text-red-400 left-4 top-4"
      }`}
    >
      {isPlayer ? `+${value}` : `-${value}`}
    </div>
  );
}

export default function BattlePanel({ status, onBattleResult }: Props) {
  const boss = getTodayBoss(status.level);
  const [anim, setAnim] = useState<BattleAnim>("idle");

  const battleStatKey = status.todayBattleStat || "execution";
  const battleStatDef = STAT_DEFINITIONS.find((s) => s.key === battleStatKey) ?? STAT_DEFINITIONS[7];
  const todayGain = (status.todayStatGains?.[battleStatKey] ?? 0);
  const [floats, setFloats] = useState<{ id: number; value: number; isPlayer: boolean }[]>([]);
  const [floatId, setFloatId] = useState(0);
  const [log, setLog] = useState<string[]>([]);

  const isDefeated = status.bossHp <= 0;
  const bossHpPct = Math.max(0, Math.round((status.bossHp / status.bossMaxHp) * 100));

  const addFloat = useCallback((value: number, isPlayer: boolean) => {
    const id = floatId + 1;
    setFloatId(id);
    setFloats((prev) => [...prev, { id, value, isPlayer }]);
    setTimeout(() => setFloats((prev) => prev.filter((f) => f.id !== id)), 1000);
  }, [floatId]);

  const addLog = useCallback((msg: string) => {
    setLog((prev) => [msg, ...prev].slice(0, 8));
  }, []);

  const handleAttack = useCallback(() => {
    if (anim !== "idle" || isDefeated) return;
    if (status.focus < 5) {
      addLog("集中力が足りない！（5必要）");
      return;
    }

    setAnim("player-attack");

    setTimeout(() => {
      const playerAtk = Math.floor(todayGain / 2) + Math.floor(Math.random() * 10) + 3;
      const newBossHp = Math.max(0, status.bossHp - playerAtk);
      addFloat(playerAtk, false);

      if (newBossHp <= 0) {
        addLog(`${boss.name}を倒した！ EXP+${boss.reward.exp} 石+${boss.reward.stones}`);
        setAnim("victory");
        setTimeout(() => {
          onBattleResult(-0, -5, boss.reward.exp, boss.reward.stones, 0, true);
          setAnim("idle");
        }, 1200);
        return;
      }

      addLog(`攻撃！ ${boss.name}に ${playerAtk} ダメージ！`);

      // Boss counterattack
      setTimeout(() => {
        setAnim("boss-attack");
        const bossAtk = Math.floor(boss.attack * (0.7 + Math.random() * 0.6));
        addFloat(bossAtk, true);
        addLog(`${boss.name}の反撃！ ${bossAtk} ダメージを受けた`);

        setTimeout(() => {
          onBattleResult(-bossAtk, -5, 0, 0, newBossHp, false);
          setAnim("idle");
        }, 400);
      }, 600);
    }, 400);
  }, [anim, isDefeated, status, boss, addFloat, addLog, onBattleResult]);

  const handleSkillAttack = useCallback(() => {
    if (anim !== "idle" || isDefeated) return;
    if (status.focus < 20) {
      addLog("集中力が足りない！（20必要）");
      return;
    }

    setAnim("player-attack");

    setTimeout(() => {
      const playerAtk = todayGain + Math.floor(Math.random() * 15) + 5;
      const newBossHp = Math.max(0, status.bossHp - playerAtk);
      addFloat(playerAtk, false);
      addLog(`必殺技発動！ ${playerAtk} の大ダメージ！`);

      if (newBossHp <= 0) {
        addLog(`${boss.name}を倒した！ EXP+${boss.reward.exp} 石+${boss.reward.stones}`);
        setAnim("victory");
        setTimeout(() => {
          onBattleResult(0, -20, boss.reward.exp, boss.reward.stones, 0, true);
          setAnim("idle");
        }, 1200);
        return;
      }

      setTimeout(() => {
        onBattleResult(0, -20, 0, 0, newBossHp, false);
        setAnim("idle");
      }, 600);
    }, 400);
  }, [anim, isDefeated, status, boss, addFloat, addLog, onBattleResult]);

  const bossHpColor =
    bossHpPct > 50 ? "bg-red-500" : bossHpPct > 25 ? "bg-orange-500" : "bg-red-700";

  return (
    <div className="space-y-4">
      {/* Boss info */}
      <div className={`bg-slate-900 border rounded-xl p-4 relative overflow-hidden ${
        isDefeated ? "border-emerald-800" : "border-red-900/60"
      }`}>
        {anim === "victory" && (
          <div className="absolute inset-0 bg-yellow-500/10 animate-pulse rounded-xl pointer-events-none" />
        )}

        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs font-mono text-slate-500 tracking-wider">TODAY&apos;S BOSS</p>
            <h3 className={`text-lg font-black font-mono ${isDefeated ? "text-emerald-400" : "text-red-300"}`}>
              {boss.icon} {boss.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{boss.description}</p>
          </div>
          {isDefeated && (
            <span className="bg-emerald-800 text-emerald-200 text-xs font-bold px-2 py-1 rounded font-mono">
              DEFEATED
            </span>
          )}
        </div>

        {/* Boss HP */}
        <div className="space-y-1 mb-3">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-red-400">BOSS HP</span>
            <span className="text-slate-300">{status.bossHp} / {status.bossMaxHp}</span>
          </div>
          <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className={`h-full rounded-full transition-all duration-500 ${bossHpColor}`}
              style={{ width: `${bossHpPct}%` }}
            />
          </div>
        </div>

        {/* Rewards preview */}
        <div className="flex gap-3 text-xs font-mono text-slate-500">
          <span>撃破報酬:</span>
          <span className="text-cyan-400">EXP +{boss.reward.exp}</span>
          <span className="text-yellow-400">💎 +{boss.reward.stones}石</span>
        </div>
      </div>

      {/* Player vs Boss visual */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 relative">
        <div className="flex items-center justify-between relative">
          {/* Player */}
          <div className={`text-center ${anim === "player-attack" ? "anim-shake" : ""}`}>
            <div className="text-4xl">🧙‍♂️</div>
            <div className="text-xs font-mono text-cyan-400 mt-1">LV.{status.level}</div>
            <div className="text-xs font-mono text-slate-500">HP:{status.hp}</div>
            <div className="text-xs font-mono text-blue-400">Focus:{status.focus}</div>
            <div className="text-xs font-mono text-yellow-400 mt-1">{battleStatDef.icon}+{todayGain}</div>
          </div>

          {/* VS */}
          <div className="text-slate-600 font-black text-lg">VS</div>

          {/* Boss */}
          <div className={`text-center relative ${anim === "boss-attack" ? "anim-battle-hit" : ""}`}>
            {floats.map((f) => (
              <DamageFloat key={f.id} value={f.value} isPlayer={f.isPlayer} />
            ))}
            <div className={`text-5xl ${isDefeated ? "grayscale opacity-40" : ""}`}>{boss.icon}</div>
            {!isDefeated && <div className="text-xs font-mono text-red-400 mt-1">HP:{status.bossHp}</div>}
          </div>
        </div>

        {/* Attack buttons */}
        {!isDefeated ? (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={handleAttack}
              disabled={anim !== "idle" || status.focus < 5}
              className="py-3 rounded-lg font-mono font-bold text-sm border-2 border-cyan-700 text-cyan-300 disabled:opacity-40 hover:bg-cyan-900/20 transition-all active:scale-95"
            >
              ⚔️ 攻撃
              <br />
              <span className="text-xs font-normal text-cyan-600">Focus -5</span>
            </button>
            <button
              onClick={handleSkillAttack}
              disabled={anim !== "idle" || status.focus < 20}
              className="py-3 rounded-lg font-mono font-bold text-sm border-2 border-purple-700 text-purple-300 disabled:opacity-40 hover:bg-purple-900/20 transition-all active:scale-95"
            >
              ✨ 必殺技
              <br />
              <span className="text-xs font-normal text-purple-600">Focus -20</span>
            </button>
          </div>
        ) : (
          <div className="mt-4 text-center py-3 bg-emerald-900/30 rounded-lg border border-emerald-800">
            <p className="text-emerald-300 font-black font-mono tracking-wider">⚔️ BOSS DEFEATED! ⚔️</p>
            <p className="text-emerald-500 text-xs font-mono mt-1">次のボスは明日登場する</p>
          </div>
        )}
      </div>

      {/* Battle log */}
      {log.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 space-y-1">
          <p className="text-slate-500 text-xs font-mono tracking-wider mb-2">BATTLE LOG</p>
          {log.map((l, i) => (
            <p key={i} className={`text-xs font-mono ${i === 0 ? "text-slate-300" : "text-slate-600"}`}>
              {l}
            </p>
          ))}
        </div>
      )}

      {/* Today's battle stat info */}
      <div className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-3 space-y-1">
        <p className="text-slate-400 text-xs font-mono tracking-wider">TODAY&apos;S BATTLE STAT</p>
        <p className="text-yellow-300 text-sm font-mono font-bold">
          {battleStatDef.icon} {battleStatDef.label}（{battleStatDef.labelEn}）
        </p>
        <p className="text-slate-500 text-xs font-mono">
          本日の上昇量: <span className="text-yellow-400 font-bold">+{todayGain}</span>
        </p>
        <p className="text-slate-600 text-xs font-mono mt-1">
          攻撃 = {battleStatDef.labelEn}/2 + ランダム(3-12)　必殺技 = {battleStatDef.labelEn} + ランダム(5-19)
        </p>
      </div>
    </div>
  );
}
