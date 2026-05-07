import type { Title, PlayerStatus } from "@/lib/types";

export const ALL_TITLES: Title[] = [
  {
    id: "beginner",
    name: "駆け出し冒険者",
    description: "初めてのログを記録した",
    condition: (s) => s.logs.length >= 1,
  },
  {
    id: "logger_10",
    name: "記録者",
    description: "10回行動を記録した",
    condition: (s) => s.logs.length >= 10,
  },
  {
    id: "logger_50",
    name: "熟練の記録者",
    description: "50回行動を記録した",
    condition: (s) => s.logs.length >= 50,
  },
  {
    id: "level5",
    name: "冒険者",
    description: "レベル5に到達した",
    condition: (s) => s.level >= 5,
  },
  {
    id: "level10",
    name: "ベテラン戦士",
    description: "レベル10に到達した",
    condition: (s) => s.level >= 10,
  },
  {
    id: "level20",
    name: "英雄",
    description: "レベル20に到達した",
    condition: (s) => s.level >= 20,
  },
  {
    id: "streak_3",
    name: "継続者",
    description: "3日連続ログインした",
    condition: (s) => s.streak >= 3,
  },
  {
    id: "streak_7",
    name: "七日の誓い",
    description: "7日連続ログインした",
    condition: (s) => s.streak >= 7,
  },
  {
    id: "streak_30",
    name: "鋼の意志",
    description: "30日連続ログインした",
    condition: (s) => s.streak >= 30,
  },
  {
    id: "worker",
    name: "副業初心者",
    description: "副業ログを5回記録した",
    condition: (s) => s.logs.filter((l) => l.category === "WORK").length >= 5,
  },
  {
    id: "scholar",
    name: "修行僧",
    description: "学習ログを10回記録した",
    condition: (s) => s.logs.filter((l) => l.category === "STUDY").length >= 10,
  },
  {
    id: "athlete",
    name: "鍛錬の人",
    description: "運動ログを10回記録した",
    condition: (s) => s.logs.filter((l) => l.category === "EXERCISE").length >= 10,
  },
  {
    id: "night_warrior",
    name: "深夜の戦士",
    description: "夜更かしを記録したが、それでも続けている",
    condition: (s) =>
      s.logs.some((l) => l.category === "DEBUFF") && s.streak >= 3,
  },
  {
    id: "int_master",
    name: "知の巨人",
    description: "知力が100を超えた",
    condition: (s) => s.intelligence >= 100,
  },
  {
    id: "hp_master",
    name: "鉄の肉体",
    description: "HPが150を超えた",
    condition: (s) => s.maxHp >= 150,
  },
];

export function checkNewTitles(status: PlayerStatus): string[] {
  return ALL_TITLES.filter(
    (t) => !status.titles.includes(t.id) && t.condition(status)
  ).map((t) => t.id);
}

export function getTitleById(id: string): Title | undefined {
  return ALL_TITLES.find((t) => t.id === id);
}
