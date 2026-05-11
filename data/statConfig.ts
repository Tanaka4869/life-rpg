import type { StatKey } from "@/lib/types";

export interface StatDef {
  key: StatKey;
  label: string;
  labelEn: string;
  icon: string;
  color: string;
  description: string;
}

/**
 * ステータス定義リスト。
 * 新ステータスを追加するときはここに1エントリ追加するだけでよい。
 */
export const STAT_DEFINITIONS: StatDef[] = [
  {
    key: "concentration",
    label: "集中力",
    labelEn: "FOCUS",
    icon: "🎯",
    color: "from-blue-700 to-blue-400",
    description: "作業・学習・瞑想で成長",
  },
  {
    key: "intelligence",
    label: "知力",
    labelEn: "INT",
    icon: "📚",
    color: "from-violet-700 to-violet-400",
    description: "学習・読書・開発で成長",
  },
  {
    key: "stamina",
    label: "体力",
    labelEn: "VIT",
    icon: "🏃",
    color: "from-orange-700 to-orange-400",
    description: "運動・睡眠で成長",
  },
  {
    key: "health",
    label: "健康力",
    labelEn: "HEALTH",
    icon: "❤️",
    color: "from-rose-700 to-rose-400",
    description: "睡眠・瞑想・自炊・運動で成長",
  },
  {
    key: "housework",
    label: "家事力",
    labelEn: "HOME",
    icon: "🏠",
    color: "from-green-700 to-green-400",
    description: "掃除・洗濯・片付けで成長",
  },
  {
    key: "cooking",
    label: "自炊力",
    labelEn: "COOK",
    icon: "🍳",
    color: "from-yellow-600 to-yellow-400",
    description: "料理・自炊・調理で成長",
  },
  {
    key: "muscular",
    label: "筋力",
    labelEn: "STR",
    icon: "⚡",
    color: "from-red-700 to-red-500",
    description: "筋トレ・腕立て・スクワットで成長",
  },
  {
    key: "execution",
    label: "実行力",
    labelEn: "ACT",
    icon: "🚀",
    color: "from-cyan-700 to-cyan-400",
    description: "あらゆる行動記録で成長",
  },
  {
    key: "cleanliness",
    label: "綺麗さ",
    labelEn: "CLEAN",
    icon: "✨",
    color: "from-sky-700 to-sky-400",
    description: "掃除・洗濯・片付け・整理整頓で成長",
  },
  {
    key: "engineering",
    label: "エンジニア力",
    labelEn: "ENG",
    icon: "💻",
    color: "from-emerald-700 to-emerald-400",
    description: "プログラミング・開発・コーディングで成長",
  },
];
