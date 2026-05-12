import type { GachaItem, GachaRarity } from "@/lib/types";

export const GACHA_ITEMS: GachaItem[] = [
  // COMMON (60%)
  { id: "c001", name: "コンビニスイーツ券", rarity: "COMMON", icon: "🍰" },
  { id: "c002", name: "アニメ券", rarity: "COMMON", icon: "📺" },
  { id: "c003", name: "カラオケ券", rarity: "COMMON", icon: "🎤" },
  { id: "c004", name: "お菓子券", rarity: "COMMON", icon: "🍬" },
  { id: "c005", name: "コンビニスナック券", rarity: "COMMON", icon: "🍟" },
  { id: "c006", name: "ゲーセン券", rarity: "COMMON", icon: "🕹️" },
  { id: "c007", name: "100均グッズ券", rarity: "COMMON", icon: "🛒" },
  // UNCOMMON (29%)
  { id: "u001", name: "Uber Eats券", rarity: "UNCOMMON", icon: "🛵" },
  { id: "u002", name: "肉券", rarity: "UNCOMMON", icon: "🥩" },
  { id: "u003", name: "外食券", rarity: "UNCOMMON", icon: "🍽️" },
  { id: "u004", name: "映画券", rarity: "UNCOMMON", icon: "🎬" },
  { id: "u005", name: "ゲーム券", rarity: "UNCOMMON", icon: "🎮" },
  { id: "u006", name: "銭湯券", rarity: "UNCOMMON", icon: "♨️" },
  { id: "u007", name: "Amazon1000円券", rarity: "UNCOMMON", icon: "📦" },
  // RARE (8%)
  { id: "r001", name: "服券", rarity: "RARE", icon: "👕" },
  { id: "r002", name: "パチンコ3000円券", rarity: "RARE", icon: "🎰" },
  { id: "r003", name: "Amazon3000円券", rarity: "RARE", icon: "🛍️" },
  // SUPER_RARE (2%)
  { id: "sr001", name: "パチンコ5000円券", rarity: "SUPER_RARE", icon: "💎" },
  // ULTRA_RARE (1%)
  { id: "ur001", name: "パチンコ10000円券", rarity: "ULTRA_RARE", icon: "👑" },
];

export const RARITY_WEIGHTS: Record<GachaRarity, number> = {
  COMMON: 60,
  UNCOMMON: 29,
  RARE: 8,
  SUPER_RARE: 2,
  ULTRA_RARE: 1,
};

export const RARITY_LABELS: Record<GachaRarity, string> = {
  COMMON: "コモン",
  UNCOMMON: "アンコモン",
  RARE: "レア ★",
  SUPER_RARE: "スーパーレア ★★",
  ULTRA_RARE: "ウルトラレア ★★★",
};

export const RARITY_STYLES: Record<GachaRarity, {
  border: string;
  glow: string;
  text: string;
  bg: string;
  badge: string;
}> = {
  COMMON: {
    border: "border-slate-500",
    glow: "",
    text: "text-slate-300",
    bg: "bg-slate-800",
    badge: "bg-slate-700 text-slate-300",
  },
  UNCOMMON: {
    border: "border-emerald-500",
    glow: "shadow-[0_0_14px_rgba(16,185,129,0.45)]",
    text: "text-emerald-300",
    bg: "bg-emerald-950/40",
    badge: "bg-emerald-800 text-emerald-200",
  },
  RARE: {
    border: "border-yellow-400",
    glow: "shadow-[0_0_22px_rgba(250,204,21,0.65)]",
    text: "text-yellow-300",
    bg: "bg-yellow-950/40",
    badge: "bg-yellow-700 text-yellow-100",
  },
  SUPER_RARE: {
    border: "border-purple-400",
    glow: "shadow-[0_0_32px_rgba(192,132,252,0.85)]",
    text: "text-purple-200",
    bg: "bg-purple-950/50",
    badge: "bg-purple-700 text-purple-100",
  },
  ULTRA_RARE: {
    border: "border-amber-300",
    glow: "shadow-[0_0_40px_rgba(251,191,36,1)]",
    text: "text-amber-200",
    bg: "bg-amber-950/60",
    badge: "bg-amber-500 text-black",
  },
};

export const GACHA_COST_STONE = 30;
export const GACHA_10_COST_STONE = 270;
export const GACHA_COST_TICKET = 1;
export const GACHA_10_COST_TICKET = 10;
