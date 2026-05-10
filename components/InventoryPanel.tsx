"use client";

import { useState } from "react";
import { GACHA_ITEMS, RARITY_LABELS, RARITY_STYLES } from "@/data/gacha";
import type { GachaRarity } from "@/lib/types";

interface Props {
  inventory: Record<string, number>;
  onUse: (itemId: string) => void;
}

const RARITY_ORDER: GachaRarity[] = ["SUPER_RARE", "RARE", "UNCOMMON", "COMMON"];

interface ConfirmState {
  itemId: string;
  itemName: string;
  icon: string;
}

export default function InventoryPanel({ inventory, onUse }: Props) {
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

  const ownedItems = GACHA_ITEMS
    .filter((item) => (inventory[item.id] ?? 0) > 0)
    .sort((a, b) => RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity));

  const handleTap = (itemId: string, itemName: string, icon: string) => {
    setConfirm({ itemId, itemName, icon });
  };

  const handleConfirmYes = () => {
    if (!confirm) return;
    onUse(confirm.itemId);
    setConfirm(null);
  };

  return (
    <>
      {/* 確認ダイアログ */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-6">
          <div className="w-full max-w-xs bg-slate-900 border border-slate-600 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="text-5xl">{confirm.icon}</div>
              <p className="text-slate-200 font-mono text-sm font-bold leading-relaxed">
                「{confirm.itemName}」を<br />使用しますか？
              </p>
              <p className="text-slate-500 font-mono text-xs">
                使用すると所持数が1枚減ります
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setConfirm(null)}
                className="py-3 rounded-xl border-2 border-slate-600 text-slate-400 font-mono font-bold text-sm hover:border-slate-500 hover:text-slate-300 transition-all"
              >
                いいえ
              </button>
              <button
                onClick={handleConfirmYes}
                className="py-3 rounded-xl border-2 border-cyan-500 text-cyan-300 font-mono font-bold text-sm hover:bg-cyan-500/10 transition-all"
              >
                はい
              </button>
            </div>
          </div>
        </div>
      )}

      {/* インベントリ本体 */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-mono text-slate-400 tracking-widest">
            🎁 所持アイテム
          </h3>
          <span className="text-xs font-mono text-slate-600">
            {ownedItems.length}種 / 計{Object.values(inventory).reduce((a, b) => a + b, 0)}枚
          </span>
        </div>

        {ownedItems.length === 0 ? (
          <p className="text-slate-600 font-mono text-xs text-center py-4 italic">
            所持アイテムなし。ガチャを引いて入手しよう！
          </p>
        ) : (
          <div className="space-y-2">
            {ownedItems.map((item) => {
              const count = inventory[item.id] ?? 0;
              const s = RARITY_STYLES[item.rarity];
              return (
                <button
                  key={item.id}
                  onClick={() => handleTap(item.id, item.name, item.icon)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 ${s.border} ${s.bg} ${s.glow} text-left transition-all active:scale-[0.98] hover:brightness-110`}
                >
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold font-mono text-sm ${s.text} truncate`}>
                      {item.name}
                    </p>
                    <span className={`text-xs rounded px-1.5 py-0.5 font-bold ${s.badge}`}>
                      {RARITY_LABELS[item.rarity]}
                    </span>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-white font-black font-mono text-lg leading-none">{count}</p>
                    <p className="text-slate-500 font-mono text-xs">枚</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {ownedItems.length > 0 && (
          <p className="text-slate-600 font-mono text-xs text-center pt-1">
            アイテムをタップして使用
          </p>
        )}
      </div>
    </>
  );
}
