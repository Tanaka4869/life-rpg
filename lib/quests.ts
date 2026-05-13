import type { Quest, ActionCategory } from "./types";

const QUEST_POOL: Omit<Quest, "completed">[] = [
  // WORK
  { id: "q_work_30",  title: "仕事に取り組む",     description: "仕事を30分行う",       category: "WORK",      targetMinutes: 30,  reward: 30  },
  { id: "q_work_60",  title: "仕事の時間",          description: "仕事を1時間行う",       category: "WORK",      targetMinutes: 60,  reward: 60  },
  { id: "q_work_90",  title: "集中の90分",          description: "仕事を1時間半行う",     category: "WORK",      targetMinutes: 90,  reward: 90  },
  { id: "q_work_120", title: "長丁場の作業",        description: "仕事を2時間行う",       category: "WORK",      targetMinutes: 120, reward: 120 },

  // EXERCISE
  { id: "q_exercise_15", title: "軽く体を動かす",   description: "運動を15分行う",        category: "EXERCISE",  targetMinutes: 15,  reward: 15  },
  { id: "q_exercise_30", title: "体を動かせ",       description: "運動を30分行う",        category: "EXERCISE",  targetMinutes: 30,  reward: 25  },
  { id: "q_exercise_60", title: "肉体鍛錬",         description: "運動を1時間行う",       category: "EXERCISE",  targetMinutes: 60,  reward: 50  },
  { id: "q_exercise_90", title: "ガチ勢の汗",       description: "運動を1時間半行う",     category: "EXERCISE",  targetMinutes: 90,  reward: 75  },
  { id: "q_walk_20",     title: "散歩タイム",       description: "散歩を20分行う",        category: "EXERCISE",  targetMinutes: 20,  reward: 18  },

  // STUDY
  { id: "q_study_15",  title: "知の扉",             description: "学習・読書を15分行う",  category: "STUDY",     targetMinutes: 15,  reward: 20  },
  { id: "q_study_30",  title: "学習者",             description: "学習・読書を30分行う",  category: "STUDY",     targetMinutes: 30,  reward: 40  },
  { id: "q_study_60",  title: "修行の時間",         description: "個人開発・学習を1時間", category: "STUDY",     targetMinutes: 60,  reward: 80  },
  { id: "q_study_90",  title: "探求者",             description: "学習を1時間半行う",     category: "STUDY",     targetMinutes: 90,  reward: 110 },
  { id: "q_study_120", title: "知識の塔",           description: "学習を2時間行う",       category: "STUDY",     targetMinutes: 120, reward: 140 },

  // MEDITATE
  { id: "q_meditate_10", title: "静寂の時",         description: "瞑想・休憩を10分行う",  category: "MEDITATE",  targetMinutes: 10,  reward: 15  },
  { id: "q_meditate_20", title: "心を鎮める",       description: "瞑想・休憩を20分行う",  category: "MEDITATE",  targetMinutes: 20,  reward: 25  },
  { id: "q_meditate_30", title: "禅の境地",         description: "瞑想を30分行う",        category: "MEDITATE",  targetMinutes: 30,  reward: 35  },

  // SLEEP（7時間超えは現実的でないため上限7時間）
  { id: "q_sleep_360", title: "戦士の休息",         description: "6時間以上睡眠する",     category: "SLEEP",     targetMinutes: 360, reward: 30  },
  { id: "q_sleep_420", title: "勇者の眠り",         description: "7時間以上睡眠する",     category: "SLEEP",     targetMinutes: 420, reward: 40  },

  // HOUSEWORK
  { id: "q_housework_10", title: "家を整える",      description: "掃除を10分行う",        category: "HOUSEWORK", targetMinutes: 10,  reward: 20  },
  { id: "q_housework_20", title: "きれいな部屋",    description: "掃除を20分行う",        category: "HOUSEWORK", targetMinutes: 20,  reward: 35  },
  { id: "q_housework_30", title: "大掃除",          description: "掃除を30分行う",        category: "HOUSEWORK", targetMinutes: 30,  reward: 50  },

  // COOKING（1日1食分を想定）
  { id: "q_cooking_30", title: "今日の自炊",        description: "料理を1回する",         category: "COOKING",   targetMinutes: 30,  reward: 35  },

  // ONCE（クイックアクション）
  { id: "q_once_water",    title: "水分補給",       description: "水を飲む",           questType: "once" as const, matchText: "水を飲む",   category: "UNKNOWN" as const, targetMinutes: 0, reward: 10 },
  { id: "q_once_teeth",    title: "歯を磨く",       description: "歯磨きをする",       questType: "once" as const, matchText: "歯磨き",     category: "UNKNOWN" as const, targetMinutes: 0, reward: 10 },
  { id: "q_once_sunlight", title: "日光浴",         description: "日光を浴びる",       questType: "once" as const, matchText: "日光",       category: "UNKNOWN" as const, targetMinutes: 0, reward: 10 },
  { id: "q_once_breath",   title: "深呼吸する",     description: "深呼吸をする",       questType: "once" as const, matchText: "深呼吸",     category: "MEDITATE" as const, targetMinutes: 0, reward: 10 },
  { id: "q_once_stretch",  title: "ストレッチする", description: "ストレッチをする",   questType: "once" as const, matchText: "ストレッチ", category: "EXERCISE" as const, targetMinutes: 0, reward: 12 },
  { id: "q_once_trash",    title: "ゴミ捨て",       description: "ゴミを捨てる",       questType: "once" as const, matchText: "ゴミ捨て",   category: "HOUSEWORK" as const, targetMinutes: 0, reward: 12 },
  { id: "q_once_skincare", title: "スキンケア",     description: "肌ケアをする",       questType: "once" as const, matchText: "肌ケア",     category: "UNKNOWN" as const, targetMinutes: 0, reward: 10 },
];

export function generateDailyQuests(refreshCount = 0, excludeIds: string[] = []): Quest[] {
  const today = new Date().toISOString().slice(0, 10);
  const baseSeed = today.replace(/-/g, "").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const seed = baseSeed + refreshCount * 1337;

  const available = excludeIds.length > 0
    ? QUEST_POOL.filter((q) => !excludeIds.includes(q.id))
    : QUEST_POOL;

  // カテゴリ別にグループ化
  const byCategory = new Map<string, Omit<Quest, "completed">[]>();
  for (const q of available) {
    const cat = q.questType === "once" ? "__once__" : q.category;
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat)!.push(q);
  }

  // カテゴリをシャッフルして3つ選ぶ
  const cats = [...byCategory.keys()].sort((a, b) => hashStr(a + seed) - hashStr(b + seed));
  const selected: Quest[] = [];
  for (const cat of cats) {
    if (selected.length >= 3) break;
    const pool = byCategory.get(cat)!;
    const sorted = [...pool].sort((a, b) => hashStr(a.id + seed) - hashStr(b.id + seed));
    selected.push({ ...sorted[0], completed: false });
  }

  return selected;
}

export function getQuestById(id: string): Quest | undefined {
  const q = QUEST_POOL.find((q) => q.id === id);
  return q ? { ...q, completed: false } : undefined;
}

export function checkQuestCompletion(
  questId: string,
  category: ActionCategory,
  minutes: number,
  text?: string,
): boolean {
  const quest = getQuestById(questId);
  if (!quest) return false;
  if (quest.questType === "once") {
    return !!quest.matchText && !!text && text.includes(quest.matchText);
  }
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
