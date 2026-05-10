import type { GachaItem, GachaRarity, GachaRecord } from "./types";
import { GACHA_ITEMS, RARITY_WEIGHTS } from "@/data/gacha";

function pickRarity(): GachaRarity {
  const total = Object.values(RARITY_WEIGHTS).reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;
  for (const [rarity, weight] of Object.entries(RARITY_WEIGHTS)) {
    rand -= weight;
    if (rand <= 0) return rarity as GachaRarity;
  }
  return "COMMON";
}

function pickItem(rarity: GachaRarity): GachaItem {
  const pool = GACHA_ITEMS.filter((item) => item.rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function rollGacha(count: number): GachaRecord[] {
  return Array.from({ length: count }, (_, i) => {
    const rarity = pickRarity();
    const item = pickItem(rarity);
    return {
      id: `${Date.now()}-${i}`,
      itemId: item.id,
      itemName: item.name,
      rarity,
      timestamp: new Date().toISOString(),
    };
  });
}

export function getHighestRarity(records: GachaRecord[]): GachaRarity {
  const order: GachaRarity[] = ["COMMON", "UNCOMMON", "RARE", "SUPER_RARE"];
  return records.reduce((best, r) => {
    return order.indexOf(r.rarity) > order.indexOf(best) ? r.rarity : best;
  }, "COMMON" as GachaRarity);
}

// Web Audio API でSE生成
export function playSE(rarity: GachaRarity): void {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();

    type Note = { freq: number; type: OscillatorType; start: number; dur: number; vol: number };
    const scheduleMap: Record<GachaRarity, Note[]> = {
      COMMON: [{ freq: 440, type: "sine", start: 0, dur: 0.18, vol: 0.25 }],
      UNCOMMON: [
        { freq: 440, type: "sine", start: 0, dur: 0.18, vol: 0.3 },
        { freq: 554, type: "sine", start: 0.15, dur: 0.22, vol: 0.3 },
      ],
      RARE: [
        { freq: 440, type: "triangle", start: 0, dur: 0.2, vol: 0.35 },
        { freq: 554, type: "triangle", start: 0.15, dur: 0.2, vol: 0.35 },
        { freq: 659, type: "triangle", start: 0.3, dur: 0.35, vol: 0.4 },
      ],
      SUPER_RARE: [
        { freq: 440, type: "sawtooth", start: 0, dur: 0.2, vol: 0.3 },
        { freq: 554, type: "sawtooth", start: 0.12, dur: 0.2, vol: 0.3 },
        { freq: 659, type: "sawtooth", start: 0.24, dur: 0.2, vol: 0.3 },
        { freq: 880, type: "sawtooth", start: 0.36, dur: 0.3, vol: 0.35 },
        { freq: 1100, type: "sawtooth", start: 0.48, dur: 0.5, vol: 0.35 },
      ],
    };
    const schedules = scheduleMap[rarity];

    schedules.forEach(({ freq, type, start, dur, vol }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type;
      osc.frequency.value = freq;
      const t = ctx.currentTime + start;
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.start(t);
      osc.stop(t + dur);
    });
  } catch {
    // AudioContext not available (SSR / policy blocked)
  }
}

export function vibrate(rarity: GachaRarity): void {
  if (typeof navigator === "undefined" || !navigator.vibrate) return;
  const patterns: Record<GachaRarity, number | number[]> = {
    COMMON: 50,
    UNCOMMON: [100, 50, 100],
    RARE: [200, 80, 200, 80, 300],
    SUPER_RARE: [300, 80, 300, 80, 500, 80, 500],
  };
  navigator.vibrate(patterns[rarity]);
}
