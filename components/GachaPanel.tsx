"use client";

import { useState, useEffect, useRef } from "react";
import type { GachaRecord, GachaRarity } from "@/lib/types";
import { rollGacha, getHighestRarity, playSE, vibrate } from "@/lib/gachaEngine";
import {
  GACHA_ITEMS,
  RARITY_LABELS,
  RARITY_STYLES,
  GACHA_COST_STONE,
  GACHA_10_COST_STONE,
  GACHA_COST_TICKET,
  GACHA_10_COST_TICKET,
} from "@/data/gacha";

interface Props {
  stones: number;
  tickets: number;
  onRoll: (results: GachaRecord[], cost: { stones: number; tickets: number }) => void;
}

type Phase = "idle" | "rolling" | "reveal";

function GachaCardItem({
  record,
  index,
}: {
  record: GachaRecord;
  index: number;
}) {
  const s = RARITY_STYLES[record.rarity];
  const isUR = record.rarity === "ULTRA_RARE";
  const isSR = record.rarity === "SUPER_RARE";
  const isRare = record.rarity === "RARE";

  return (
    <div
      className={`anim-gacha-card rounded-xl border-2 ${s.border} ${s.bg} ${
        isUR ? "anim-ur-glow" : isSR ? "anim-sr-glow" : isRare ? "anim-rare-glow" : s.glow
      } p-3 flex flex-col items-center gap-1 min-w-[88px]`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <span className="text-3xl">
        {GACHA_ITEMS.find((i) => i.id === record.itemId)?.icon ?? "🎁"}
      </span>
      <span
        className={`text-center text-xs font-bold leading-tight ${s.text}`}
        style={{ fontSize: "10px", maxWidth: "80px", wordBreak: "keep-all" }}
      >
        {record.itemName}
      </span>
      <span
        className={`text-xs rounded px-1 py-0.5 font-bold ${s.badge}`}
        style={{ fontSize: "9px" }}
      >
        {RARITY_LABELS[record.rarity]}
      </span>
    </div>
  );
}

function UROverlay({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90">
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, rgba(251,191,36,0.3) 0%, rgba(0,0,0,0.9) 70%)",
        }}
      />
      <div className="relative flex flex-col items-center gap-3">
        <div className="anim-shake text-8xl mb-2">👑</div>
        <div
          className="text-4xl font-black tracking-widest animate-pulse"
          style={{ color: "#fbbf24", textShadow: "0 0 30px #fbbf24, 0 0 60px #f59e0b" }}
        >
          ★★★ ULTRA RARE ★★★
        </div>
        <div className="text-amber-200 text-base mt-1 tracking-wider font-bold">
          🎊 おめでとうございます！！ 🎊
        </div>
        <div className="text-amber-400 text-sm tracking-widest animate-pulse">
          超激レア排出！
        </div>
      </div>
    </div>
  );
}

function SROverlay({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center anim-sr-bg">
      <div className="anim-shake text-7xl mb-4">💎</div>
      <div className="text-white text-2xl font-black tracking-widest drop-shadow-lg animate-pulse">
        ★★ SUPER RARE ★★
      </div>
      <div className="text-purple-200 text-sm mt-2 tracking-wider">おめでとうございます！</div>
    </div>
  );
}

export default function GachaPanel({ stones, tickets, onRoll }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [results, setResults] = useState<GachaRecord[]>([]);
  const [showUROverlay, setShowUROverlay] = useState(false);
  const [showSROverlay, setShowSROverlay] = useState(false);
  const orbRef = useRef<HTMLDivElement>(null);

  const canAfford = (useTicket: boolean, count: number) => {
    if (useTicket) {
      return tickets >= (count === 1 ? GACHA_COST_TICKET : GACHA_10_COST_TICKET);
    }
    return stones >= (count === 1 ? GACHA_COST_STONE : GACHA_10_COST_STONE);
  };

  const doRoll = (count: 1 | 10, useTicket: boolean) => {
    if (phase !== "idle") return;
    const stoneCost = !useTicket ? (count === 1 ? GACHA_COST_STONE : GACHA_10_COST_STONE) : 0;
    const ticketCost = useTicket ? (count === 1 ? GACHA_COST_TICKET : GACHA_10_COST_TICKET) : 0;

    setPhase("rolling");
    setResults([]);

    setTimeout(() => {
      const rolls = rollGacha(count);
      const best = getHighestRarity(rolls);
      playSE(best);
      vibrate(best);

      if (best === "ULTRA_RARE") {
        setShowUROverlay(true);
      } else if (best === "SUPER_RARE") {
        setShowSROverlay(true);
      }

      setResults(rolls);
      setPhase("reveal");
      onRoll(rolls, { stones: stoneCost, tickets: ticketCost });
    }, 1200);
  };

  const reset = () => {
    setPhase("idle");
    setResults([]);
  };

  const rarityBg: Record<GachaRarity, string> = {
    COMMON: "",
    UNCOMMON: "",
    RARE: "bg-yellow-950/30",
    SUPER_RARE: "bg-purple-950/40",
    ULTRA_RARE: "bg-amber-950/50",
  };

  const bestRarity = results.length > 0 ? getHighestRarity(results) : "COMMON";

  return (
    <>
      {showUROverlay && <UROverlay onDone={() => setShowUROverlay(false)} />}
      {showSROverlay && <SROverlay onDone={() => setShowSROverlay(false)} />}

      <div className="space-y-4">
        {/* Header */}
        <div className="bg-slate-900 border border-purple-900/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-black font-mono text-purple-300 tracking-widest">
              ✨ GACHA
            </h2>
            <div className="flex gap-3 text-xs font-mono">
              <span className="text-yellow-300 font-bold">💎 {stones}石</span>
              <span className="text-cyan-300 font-bold">🎫 {tickets}枚</span>
            </div>
          </div>

          {/* Orb */}
          <div className="flex justify-center my-4">
            {phase === "rolling" ? (
              <div
                ref={orbRef}
                className="anim-gacha-orb w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.8)]"
              >
                <span className="text-3xl">✨</span>
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-800/60 to-cyan-900/60 border border-purple-700/50 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                <span className="text-3xl">🔮</span>
              </div>
            )}
          </div>

          {/* Roll buttons */}
          {phase === "idle" && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => doRoll(1, false)}
                  disabled={!canAfford(false, 1)}
                  className="py-3 rounded-lg font-mono font-bold text-sm border-2 border-yellow-600 text-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-yellow-900/20 transition-all"
                >
                  1回ガチャ<br />
                  <span className="text-xs font-normal text-yellow-500">💎 {GACHA_COST_STONE}石</span>
                </button>
                <button
                  onClick={() => doRoll(1, true)}
                  disabled={!canAfford(true, 1)}
                  className="py-3 rounded-lg font-mono font-bold text-sm border-2 border-cyan-600 text-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cyan-900/20 transition-all"
                >
                  1回ガチャ<br />
                  <span className="text-xs font-normal text-cyan-500">🎫 チケット1枚</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => doRoll(10, false)}
                  disabled={!canAfford(false, 10)}
                  className="py-3 rounded-lg font-mono font-bold text-sm border-2 border-yellow-500 text-yellow-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-yellow-900/20 transition-all relative overflow-hidden"
                >
                  <span className="absolute top-1 right-1 text-xs bg-red-600 text-white px-1 rounded font-bold">10%OFF</span>
                  10連ガチャ<br />
                  <span className="text-xs font-normal text-yellow-400">💎 {GACHA_10_COST_STONE}石</span>
                </button>
                <button
                  onClick={() => doRoll(10, true)}
                  disabled={!canAfford(true, 10)}
                  className="py-3 rounded-lg font-mono font-bold text-sm border-2 border-cyan-500 text-cyan-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cyan-900/20 transition-all"
                >
                  10連ガチャ<br />
                  <span className="text-xs font-normal text-cyan-400">🎫 チケット10枚</span>
                </button>
              </div>
            </div>
          )}

          {phase === "rolling" && (
            <div className="text-center py-2 text-purple-300 font-mono text-sm animate-pulse tracking-widest">
              ガチャ演出中...
            </div>
          )}
        </div>

        {/* Results */}
        {phase === "reveal" && results.length > 0 && (
          <div className={`rounded-xl border-2 p-4 ${
            bestRarity === "ULTRA_RARE"
              ? "border-amber-400 bg-amber-950/30"
              : bestRarity === "SUPER_RARE"
              ? "border-purple-500 bg-purple-950/30"
              : bestRarity === "RARE"
              ? "border-yellow-500 bg-yellow-950/20"
              : "border-slate-700 bg-slate-900"
          } ${rarityBg[bestRarity]}`}>
            <div className="text-center mb-3">
              {bestRarity === "ULTRA_RARE" && (
                <p
                  className="font-black tracking-widest text-sm animate-pulse"
                  style={{ color: "#fbbf24", textShadow: "0 0 12px #fbbf24" }}
                >
                  ★★★ ULTRA RARE GET!!! ★★★
                </p>
              )}
              {bestRarity === "SUPER_RARE" && (
                <p className="text-purple-300 font-black tracking-widest text-sm animate-pulse">
                  ★★ SUPER RARE GET!! ★★
                </p>
              )}
              {bestRarity === "RARE" && (
                <p className="text-yellow-300 font-black tracking-widest text-sm">
                  ★ RARE GET! ★
                </p>
              )}
              {(bestRarity === "COMMON" || bestRarity === "UNCOMMON") && (
                <p className="text-slate-400 font-mono text-xs tracking-widest">
                  ガチャ結果
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {results.map((r, i) => (
                <GachaCardItem key={r.id} record={r} index={i} />
              ))}
            </div>

            <button
              onClick={reset}
              className="w-full mt-4 py-2 rounded-lg border border-slate-600 text-slate-400 hover:text-slate-200 hover:border-slate-500 font-mono text-sm transition-all"
            >
              もう一度
            </button>
          </div>
        )}

        {/* Probability table with item list */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3">
          <p className="text-slate-500 font-mono text-xs mb-2 tracking-wider">排出率・アイテム一覧</p>
          <div className="space-y-3">
            {(["ULTRA_RARE", "SUPER_RARE", "RARE", "UNCOMMON", "COMMON"] as GachaRarity[]).map((r) => {
              const s = RARITY_STYLES[r];
              const weights: Record<GachaRarity, number> = { COMMON: 60, UNCOMMON: 29, RARE: 8, SUPER_RARE: 2, ULTRA_RARE: 1 };
              const items = GACHA_ITEMS.filter((i) => i.rarity === r);
              return (
                <div key={r}>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className={`font-bold ${s.text}`}>{RARITY_LABELS[r]}</span>
                    <span className="text-slate-400">{weights[r]}%</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {items.map((item) => (
                      <span
                        key={item.id}
                        className={`text-xs px-1.5 py-0.5 rounded border ${s.border} ${s.bg} ${s.text} font-mono`}
                        style={{ fontSize: "10px" }}
                      >
                        {item.icon} {item.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stone earn guide */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3">
          <p className="text-slate-500 font-mono text-xs mb-2 tracking-wider">石の入手方法</p>
          <div className="space-y-1 text-xs font-mono text-slate-400">
            <div className="flex justify-between"><span>行動記録</span><span className="text-yellow-500">+石 (EXP×10%)</span></div>
            <div className="flex justify-between"><span>レベルアップ</span><span className="text-yellow-500">+50石</span></div>
            <div className="flex justify-between"><span>クエスト達成</span><span className="text-yellow-500">+20石</span></div>
            <div className="flex justify-between"><span>ボス撃破</span><span className="text-yellow-500">+30〜50石</span></div>
            <div className="flex justify-between"><span>デイリーログイン</span><span className="text-yellow-500">+10石</span></div>
          </div>
        </div>

        {/* History */}
        {/* (History is shown in 履歴 tab) */}
      </div>
    </>
  );
}
