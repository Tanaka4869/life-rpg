import type { PlayerStatus } from "./types";
import { generateDailyQuests } from "./quests";

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
  logs: [],
};

export function loadStatus(): PlayerStatus {
  if (typeof window === "undefined") return DEFAULT_STATUS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initNewPlayer();
    const status: PlayerStatus = JSON.parse(raw);
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
  const status: PlayerStatus = {
    ...DEFAULT_STATUS,
    lastLoginDate: today,
    streak: 1,
    todayQuestIds: quests.map((q) => q.id),
  };
  saveStatus(status);
  return status;
}

function checkDailyReset(status: PlayerStatus): PlayerStatus {
  const today = todayString();
  if (status.lastLoginDate === today) return status;

  // 連続ログインチェック
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const wasYesterday = status.lastLoginDate === yesterday.toISOString().slice(0, 10);
  const newStreak = wasYesterday ? status.streak + 1 : 1;

  // デイリークエスト更新
  const quests = generateDailyQuests();

  const updated: PlayerStatus = {
    ...status,
    lastLoginDate: today,
    streak: newStreak,
    completedQuestIds: [],
    todayQuestIds: quests.map((q) => q.id),
    // HP若干回復
    hp: Math.min(status.maxHp, status.hp + 20),
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
