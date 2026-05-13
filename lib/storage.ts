import type { PlayerStatus } from "./types";
import { generateDailyQuests } from "./quests";
import { DEFAULT_PLAYER_STATS } from "./statEngine";
import { getTodayBoss } from "@/data/bosses";

const STORAGE_KEY = "life-rpg-player";

const DEFAULT_STATUS: PlayerStatus = {
  level: 1,
  exp: 0,
  hp: 80,
  maxHp: 100,
  focus: 50,
  strength: 10,
  intelligence: 10,
  streak: 0,
  lastLoginDate: "",
  titles: [],
  activeTitle: "",
  completedQuestIds: [],
  todayQuestIds: [],
  questRefreshCount: 0,
  logs: [],
  stats: { ...DEFAULT_PLAYER_STATS },
  gachaStones: 30,
  gachaTickets: 0,
  gachaHistory: [],
  inventory: {},
  bossHp: 0,
  bossMaxHp: 0,
  lastBossDate: "",
  bossDefeats: 0,
  shownQuestIds: [],
};

function migrateSaveData(status: PlayerStatus): PlayerStatus {
  if (!status.stats) status.stats = { ...DEFAULT_PLAYER_STATS };
  if (status.gachaStones === undefined) status.gachaStones = 30;
  if (status.gachaTickets === undefined) status.gachaTickets = 0;
  if (!status.gachaHistory) status.gachaHistory = [];
  if (!status.inventory) status.inventory = {};
  if (status.bossHp === undefined) status.bossHp = 0;
  if (status.bossMaxHp === undefined) status.bossMaxHp = 0;
  if (!status.lastBossDate) status.lastBossDate = "";
  if (status.bossDefeats === undefined) status.bossDefeats = 0;
  if (status.questRefreshCount === undefined) status.questRefreshCount = 0;
  if (!status.shownQuestIds) status.shownQuestIds = [];
  return status;
}

export function loadStatus(): PlayerStatus {
  if (typeof window === "undefined") return DEFAULT_STATUS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initNewPlayer();
    const status: PlayerStatus = migrateSaveData(JSON.parse(raw));
    return checkDailyReset(status);
  } catch {
    return initNewPlayer();
  }
}

export function saveStatus(status: PlayerStatus): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(status));
}

export function initNewPlayer(): PlayerStatus {
  const today = todayString();
  const quests = generateDailyQuests();
  const boss = getTodayBoss(1);
  const status: PlayerStatus = {
    ...DEFAULT_STATUS,
    lastLoginDate: today,
    streak: 1,
    todayQuestIds: quests.map((q) => q.id),
    bossHp: boss.baseHp,
    bossMaxHp: boss.baseHp,
    lastBossDate: today,
  };
  saveStatus(status);
  return status;
}

function checkDailyReset(status: PlayerStatus): PlayerStatus {
  const today = todayString();
  if (status.lastLoginDate === today) return status;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const wasYesterday = status.lastLoginDate === yesterday.toISOString().slice(0, 10);
  const newStreak = wasYesterday ? status.streak + 1 : 1;

  const quests = generateDailyQuests();
  const boss = getTodayBoss(status.level);

  const updated: PlayerStatus = {
    ...status,
    lastLoginDate: today,
    streak: newStreak,
    completedQuestIds: [],
    todayQuestIds: quests.map((q) => q.id),
    questRefreshCount: 0,
    shownQuestIds: [],
    hp: Math.min(status.maxHp, status.hp + 20),
    // デイリーログインボーナス石
    gachaStones: status.gachaStones + 10,
    // ボスリセット
    bossHp: boss.baseHp,
    bossMaxHp: boss.baseHp,
    lastBossDate: today,
  };
  saveStatus(updated);
  return updated;
}

export function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function resetAllData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function hasSaveData(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) !== null;
}

export function initAndLoadNewPlayer(): PlayerStatus {
  resetAllData();
  return initNewPlayer();
}
