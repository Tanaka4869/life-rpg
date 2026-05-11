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

  // ─── レベル高ミルストーン ─────────────────────────
  {
    id: "level30",
    name: "伝説の勇者",
    description: "レベル30に到達した",
    condition: (s) => s.level >= 30,
  },
  {
    id: "level50",
    name: "神話の存在",
    description: "レベル50に到達した",
    condition: (s) => s.level >= 50,
  },

  // ─── 記録数高ミルストーン ────────────────────────
  {
    id: "logger_100",
    name: "年代記作者",
    description: "100回行動を記録した",
    condition: (s) => s.logs.length >= 100,
  },
  {
    id: "logger_200",
    name: "記録の伝説",
    description: "200回行動を記録した",
    condition: (s) => s.logs.length >= 200,
  },

  // ─── ストリーク高ミルストーン ─────────────────────
  {
    id: "streak_14",
    name: "二週間の誓い",
    description: "14日連続ログインした",
    condition: (s) => s.streak >= 14,
  },
  {
    id: "streak_100",
    name: "不屈の魂",
    description: "100日連続ログインした",
    condition: (s) => s.streak >= 100,
  },

  // ─── カテゴリ特化 ────────────────────────────────
  {
    id: "meditator",
    name: "静寂の求道者",
    description: "瞑想を5回記録した",
    condition: (s) =>
      s.logs.filter((l) => l.category === "MEDITATE").length >= 5,
  },
  {
    id: "cook",
    name: "自炊の達人",
    description: "料理を5回記録した",
    condition: (s) =>
      s.logs.filter((l) => l.category === "COOKING").length >= 5,
  },
  {
    id: "housekeeper",
    name: "清掃の騎士",
    description: "家事を5回記録した",
    condition: (s) =>
      s.logs.filter((l) => l.category === "HOUSEWORK").length >= 5,
  },
  {
    id: "good_sleeper",
    name: "良眠の守護者",
    description: "睡眠を5回記録した",
    condition: (s) =>
      s.logs.filter((l) => l.category === "SLEEP").length >= 5,
  },
  {
    id: "worker_pro",
    name: "副業の覇者",
    description: "仕事ログを20回記録した",
    condition: (s) =>
      s.logs.filter((l) => l.category === "WORK").length >= 20,
  },
  {
    id: "scholar_pro",
    name: "叡智の探求者",
    description: "学習ログを20回記録した",
    condition: (s) =>
      s.logs.filter((l) => l.category === "STUDY").length >= 20,
  },
  {
    id: "athlete_pro",
    name: "肉体の錬磨師",
    description: "運動ログを20回記録した",
    condition: (s) =>
      s.logs.filter((l) => l.category === "EXERCISE").length >= 20,
  },
  {
    id: "all_rounder",
    name: "万能プレイヤー",
    description: "仕事・学習・運動・瞑想をすべて経験した",
    condition: (s) =>
      ["WORK", "STUDY", "EXERCISE", "MEDITATE"].every((cat) =>
        s.logs.some((l) => l.category === cat)
      ),
  },

  // ─── ステータス高達成 ───────────────────────────
  {
    id: "stamina_master",
    name: "体力自慢",
    description: "体力(stamina)が100を超えた",
    condition: (s) => (s.stats?.stamina ?? 0) >= 100,
  },
  {
    id: "muscular_master",
    name: "鉄の筋肉",
    description: "筋力(muscular)が100を超えた",
    condition: (s) => (s.stats?.muscular ?? 0) >= 100,
  },
  {
    id: "execution_master",
    name: "実行の鬼",
    description: "実行力(execution)が100を超えた",
    condition: (s) => (s.stats?.execution ?? 0) >= 100,
  },
  {
    id: "engineer_master",
    name: "エンジニアの極み",
    description: "エンジニア力(engineering)が100を超えた",
    condition: (s) => (s.stats?.engineering ?? 0) >= 100,
  },
  {
    id: "health_master",
    name: "健康の化身",
    description: "健康力(health)が100を超えた",
    condition: (s) => (s.stats?.health ?? 0) >= 100,
  },

  // ─── ボス討伐 ───────────────────────────────────
  {
    id: "boss_debut",
    name: "ボス討伐者",
    description: "初めてボスを倒した",
    condition: (s) => (s.bossDefeats ?? 0) >= 1,
  },
  {
    id: "boss_hunter",
    name: "ボスハンター",
    description: "5体のボスを倒した",
    condition: (s) => (s.bossDefeats ?? 0) >= 5,
  },

  // ─── ガチャ ──────────────────────────────────────
  {
    id: "gacha_debut",
    name: "ガチャの誘惑",
    description: "初めてガチャを引いた",
    condition: (s) => (s.gachaHistory?.length ?? 0) >= 1,
  },
  {
    id: "gacha_addict",
    name: "石割り職人",
    description: "10回ガチャを引いた",
    condition: (s) => (s.gachaHistory?.length ?? 0) >= 10,
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
