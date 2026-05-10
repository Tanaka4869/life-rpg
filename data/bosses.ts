import type { BossEnemy } from "@/lib/types";

export const DAILY_BOSSES: BossEnemy[] = [
  {
    id: "laziness",
    name: "怠惰の魔王",
    icon: "😴",
    description: "行動力を根こそぎ奪う闇の王。動くことを全力で妨害してくる。",
    baseHp: 60,
    attack: 8,
    reward: { exp: 80, stones: 30 },
  },
  {
    id: "procrastination",
    name: "先延ばし魔",
    icon: "⏰",
    description: "「あとでやろう」の呪いをかけてくる。スキルが無効化される。",
    baseHp: 80,
    attack: 10,
    reward: { exp: 100, stones: 35 },
  },
  {
    id: "distraction",
    name: "誘惑の悪魔",
    icon: "📱",
    description: "SNS・スマホ依存を引き起こす。集中力を削ってくる。",
    baseHp: 70,
    attack: 12,
    reward: { exp: 90, stones: 32 },
  },
  {
    id: "negativity",
    name: "否定思考の呪い",
    icon: "💭",
    description: "自己否定の嵐を巻き起こす。精神力を破壊しようとしてくる。",
    baseHp: 90,
    attack: 15,
    reward: { exp: 120, stones: 40 },
  },
  {
    id: "overeating",
    name: "暴食の鬼",
    icon: "🍔",
    description: "食欲を暴走させ体力を奪う。健康状態を悪化させてくる。",
    baseHp: 75,
    attack: 11,
    reward: { exp: 95, stones: 33 },
  },
  {
    id: "insomnia",
    name: "不眠の呪い",
    icon: "🌙",
    description: "良質な睡眠を妨害する闇の力。HPの自然回復を封じる。",
    baseHp: 65,
    attack: 9,
    reward: { exp: 85, stones: 30 },
  },
  {
    id: "stress",
    name: "ストレス魔神",
    icon: "😤",
    description: "精神的プレッシャーで全ステータスを下げてくる最強の敵。",
    baseHp: 100,
    attack: 18,
    reward: { exp: 150, stones: 50 },
  },
];

export function getTodayBoss(level: number): BossEnemy {
  const dayOfWeek = new Date().getDay();
  const base = DAILY_BOSSES[dayOfWeek];
  const scaling = Math.floor(level / 5);
  return {
    ...base,
    baseHp: base.baseHp + scaling * 20,
    attack: base.attack + scaling * 2,
    reward: {
      exp: base.reward.exp + scaling * 10,
      stones: base.reward.stones + scaling * 5,
    },
  };
}
