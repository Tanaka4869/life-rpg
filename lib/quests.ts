import type { Quest, ActionCategory } from "./types";

const QUEST_POOL: Omit<Quest, "completed">[] = [
  { id: "q_work_30", title: "副業の一歩", description: "副業を30分行う", category: "WORK", targetMinutes: 30, reward: 30 },
  { id: "q_work_60", title: "副業戦士", description: "副業を1時間行う", category: "WORK", targetMinutes: 60, reward: 60 },
  { id: "q_exercise_30", title: "体を動かせ", description: "運動を30分行う", category: "EXERCISE", targetMinutes: 30, reward: 25 },
  { id: "q_exercise_60", title: "肉体鍛錬", description: "運動を1時間行う", category: "EXERCISE", targetMinutes: 60, reward: 50 },
  { id: "q_study_15", title: "知の扉", description: "読書・勉強を15分行う", category: "STUDY", targetMinutes: 15, reward: 20 },
  { id: "q_study_30", title: "学習者", description: "読書・勉強を30分行う", category: "STUDY", targetMinutes: 30, reward: 40 },
  { id: "q_study_60", title: "修行の時間", description: "読書・勉強を1時間行う", category: "STUDY", targetMinutes: 60, reward: 80 },
  { id: "q_meditate_10", title: "静寂の時", description: "瞑想・休憩を10分行う", category: "MEDITATE", targetMinutes: 10, reward: 15 },
  { id: "q_sleep_420", title: "勇者の眠り", description: "7時間以上睡眠する", category: "SLEEP", targetMinutes: 420, reward: 40 },
  { id: "q_walk_30", title: "散歩の習慣", description: "散歩を30分行う", category: "EXERCISE", targetMinutes: 30, reward: 25 },
];

export function generateDailyQuests(): Quest[] {
  // 毎日3つのクエストをランダムに選択（シードは日付）
  const today = new Date().toISOString().slice(0, 10);
  const seed = today.replace(/-/g, "").split("").reduce((a, c) => a + c.charCodeAt(0), 0);

  const shuffled = [...QUEST_POOL].sort((a, b) => {
    const ha = hashStr(a.id + seed);
    const hb = hashStr(b.id + seed);
    return ha - hb;
  });

  return shuffled.slice(0, 3).map((q) => ({ ...q, completed: false }));
}

export function getQuestById(id: string): Quest | undefined {
  const q = QUEST_POOL.find((q) => q.id === id);
  return q ? { ...q, completed: false } : undefined;
}

export function checkQuestCompletion(
  questId: string,
  category: ActionCategory,
  minutes: number
): boolean {
  const quest = getQuestById(questId);
  if (!quest) return false;
  return quest.category === category && minutes >= quest.targetMinutes;
}

function hashStr(s: string | number): number {
  const str = String(s);
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}
