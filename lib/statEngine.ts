import {
  CATEGORY_STAT_EFFECTS,
  KEYWORD_STAT_EFFECTS,
  type StatEffect,
} from "@/data/actionStatMap";
import type { ActionCategory, StatKey, PlayerStats } from "./types";

export const DEFAULT_PLAYER_STATS: PlayerStats = {
  concentration: 0,
  intelligence: 0,
  stamina: 0,
  health: 0,
  housework: 0,
  cooking: 0,
  muscular: 0,
  execution: 0,
};

/**
 * アクションテキスト・カテゴリ・時間からステータス変化量を計算する。
 * カテゴリ効果（時間スケール）＋キーワード効果（時間スケール）を合算。
 */
export function calcStatDeltas(
  category: ActionCategory,
  minutes: number,
  text: string
): Partial<PlayerStats> {
  const factor = minutes / 60;
  const combined: StatEffect = { ...CATEGORY_STAT_EFFECTS[category] };

  const lower = text.toLowerCase();
  for (const { keywords, effects } of KEYWORD_STAT_EFFECTS) {
    if (keywords.some((kw) => lower.includes(kw))) {
      for (const [key, val] of Object.entries(effects) as [StatKey, number][]) {
        combined[key] = (combined[key] ?? 0) + val;
      }
    }
  }

  const result: Partial<PlayerStats> = {};
  for (const [key, val] of Object.entries(combined) as [StatKey, number][]) {
    const scaled = Math.round(val * factor);
    if (scaled !== 0) result[key as StatKey] = scaled;
  }
  return result;
}

/** ステータスにデルタを加算し、0未満にならないよう保護する */
export function applyStatDeltas(
  stats: PlayerStats,
  deltas: Partial<PlayerStats>
): PlayerStats {
  const updated = { ...stats };
  for (const [key, delta] of Object.entries(deltas) as [StatKey, number][]) {
    updated[key] = Math.max(0, (updated[key] ?? 0) + delta);
  }
  return updated;
}
