export type ActionCategory =
  | "WORK"
  | "EXERCISE"
  | "STUDY"
  | "MEDITATE"
  | "SLEEP"
  | "HOUSEWORK"
  | "COOKING"
  | "DEBUFF"
  | "UNKNOWN";

// ── 新ステータスシステム ─────────────────────────────────────────
export type StatKey =
  | "concentration" // 集中力
  | "intelligence"  // 知力
  | "stamina"       // 体力
  | "health"        // 健康力
  | "housework"     // 家事力
  | "cooking"       // 自炊力
  | "muscular"      // 筋力
  | "execution"     // 実行力
  | "cleanliness"   // 綺麗さ
  | "engineering";  // エンジニア力

export type PlayerStats = Record<StatKey, number>;

export interface ActionResult {
  category: ActionCategory;
  minutes: number;
  expGained: number;
  hpDelta: number;
  focusDelta: number;
  strengthDelta: number;
  intelligenceDelta: number;
  statDeltas: Partial<PlayerStats>;
  comment: string;
}

export interface ActionLog {
  id: string;
  text: string;
  category: ActionCategory;
  expGained: number;
  comment: string;
  timestamp: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: ActionCategory;
  targetMinutes: number;
  reward: number;
  completed: boolean;
}

export interface Title {
  id: string;
  name: string;
  description: string;
  condition: (status: PlayerStatus) => boolean;
}

// ── ガチャシステム ────────────────────────────────────────────────
export type GachaRarity = "COMMON" | "UNCOMMON" | "RARE" | "SUPER_RARE";

export interface GachaItem {
  id: string;
  name: string;
  rarity: GachaRarity;
  icon: string;
}

export interface GachaRecord {
  id: string;
  itemId: string;
  itemName: string;
  rarity: GachaRarity;
  timestamp: string;
}

// ── バトルシステム ────────────────────────────────────────────────
export interface BossEnemy {
  id: string;
  name: string;
  icon: string;
  description: string;
  baseHp: number;
  attack: number;
  reward: { exp: number; stones: number };
}

export interface PlayerStatus {
  level: number;
  exp: number;
  hp: number;
  maxHp: number;
  focus: number;
  strength: number;
  intelligence: number;
  streak: number;
  lastLoginDate: string;
  titles: string[];
  activeTitle: string;
  completedQuestIds: string[];
  todayQuestIds: string[];
  logs: ActionLog[];
  stats: PlayerStats;
  // ガチャ通貨
  gachaStones: number;
  gachaTickets: number;
  gachaHistory: GachaRecord[];
  // インベントリ (itemId -> 所持枚数)
  inventory: Record<string, number>;
  // バトル
  bossHp: number;
  bossMaxHp: number;
  lastBossDate: string;
  bossDefeats: number;
}
