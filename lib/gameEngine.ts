import type { ActionCategory, ActionResult } from "./types";
import { calcStatDeltas } from "./statEngine";

// ----- Keyword maps -----
// STUDY は WORK より前に定義する（「個人開発」を STUDY で捕捉するため）
const CATEGORY_KEYWORDS: Record<ActionCategory, string[]> = {
  STUDY: [
    "読書", "勉強", "学習", "個人開発", "リサーチ", "調査", "授業", "講義",
    "セミナー", "英語", "資格", "プログラミング学習", "動画学習",
  ],
  WORK: [
    "副業", "バイト", "仕事", "作業", "プログラミング", "コーディング",
    "ライティング", "ブログ", "執筆", "デザイン", "営業", "クライアント",
  ],
  EXERCISE: [
    "運動", "筋トレ", "ジム", "ランニング", "ウォーキング", "ヨガ",
    "サイクリング", "水泳", "ストレッチ", "スクワット", "腹筋", "腕立て",
    "散歩",
  ],
  MEDITATE: [
    "瞑想", "休憩", "リラックス", "マインドフルネス", "深呼吸", "ひとり時間",
  ],
  SLEEP: ["睡眠", "仮眠", "昼寝", "就寝", "寝た", "ねた"],
  HOUSEWORK: [
    "掃除", "洗濯", "片付け", "整理整頓", "大掃除", "洗い物", "掃き掃除",
    "拭き掃除", "ゴミ捨て", "アイロン", "干した", "たたんだ",
  ],
  COOKING: [
    "料理", "自炊", "調理", "炊事", "弁当", "お弁当", "クッキング",
    "仕込み", "作り置き", "下ごしらえ", "献立",
  ],
  DEBUFF: [
    "夜更かし", "徹夜", "飲酒", "お酒", "ゲーム", "SNS", "だらだら",
    "サボり", "怠惰", "暴飲暴食", "ジャンクフード",
  ],
  UNKNOWN: [],
};

// ----- Comment pools -----
const COMMENTS: Record<ActionCategory, string[]> = {
  WORK: [
    "副業経験値を獲得した！着実に前進している。",
    "いい仕事をした。継続が力となる。",
    "スキルが磨かれている。このペースで行こう。",
    "報酬は後からついてくる。今は種を蒔け。",
    "冒険者よ、今日も戦場に立った。その姿勢が未来を変える。",
  ],
  EXERCISE: [
    "肉体が鍛えられた。HPが回復している。",
    "体を動かすことで、心も強くなる。",
    "継続は力なり。筋肉は裏切らない。",
    "今日の汗が、明日の強さになる。",
    "戦士よ、その鍛錬を忘れるな。",
  ],
  STUDY: [
    "知識が増えた。賢者への道を歩んでいる。",
    "学びは最大の投資だ。INTが上昇している。",
    "無知は最大の敵。今日もひとつ倒した。",
    "その本が、いつかあなたを救う武器になる。",
    "学習は静かな革命だ。気づいた時には別の人間になっている。",
  ],
  MEDITATE: [
    "心が落ち着いた。集中力が回復している。",
    "休むことも戦略だ。英雄は消耗しない。",
    "静寂の中に答えがある。",
    "内なる平和を見つけた。それは最強の盾だ。",
  ],
  HOUSEWORK: [
    "家が整った。環境が整えば、心も整う。",
    "家事力が上昇した。生活の土台を固めた。",
    "清潔な空間が最高の回復地点だ。",
    "縁の下の力持ち。その努力が土台を支える。",
  ],
  COOKING: [
    "自炊した。体は自分が食べたもので作られる。",
    "料理スキルが磨かれた。健康の源は食にある。",
    "手料理は最高の健康投資だ。",
    "自炊力が上昇した。外食に頼らない力を手に入れた。",
  ],
  SLEEP: [
    "十分な睡眠は最強の回復魔法だ。",
    "眠りは戦士の権利。HPが全回復した。",
    "明日の冒険に備えよ。",
  ],
  DEBUFF: [
    "…今日は怠惰だったようだ。明日は取り返そう。",
    "デバフを受けた。しかし、まだ遅くはない。",
    "深夜の魔物に取り憑かれたか。気をつけろ。",
    "全ての英雄には黒歴史がある。明日こそ立ち上がれ。",
  ],
  UNKNOWN: [
    "行動を記録した。積み重ねが力になる。",
    "今日も一歩前進した。",
    "小さな行動が大きな変化を生む。",
    "記録することで、自分を客観視できる。",
  ],
};

// ----- Time extraction -----
function extractMinutes(text: string): number {
  // 「X時間Y分」
  const hourMin = text.match(/(\d+(?:\.\d+)?)時間(\d+)分/);
  if (hourMin) {
    return Math.round(parseFloat(hourMin[1]) * 60 + parseInt(hourMin[2]));
  }
  // 「X時間」
  const hours = text.match(/(\d+(?:\.\d+)?)時間/);
  if (hours) return Math.round(parseFloat(hours[1]) * 60);
  // 「X分」
  const mins = text.match(/(\d+)分/);
  if (mins) return parseInt(mins[1]);
  // 「Xh」
  const h = text.match(/(\d+(?:\.\d+)?)h/i);
  if (h) return Math.round(parseFloat(h[1]) * 60);
  // 「Xmin」
  const min = text.match(/(\d+)\s*min/i);
  if (min) return parseInt(min[1]);

  return 30; // デフォルト30分
}

// ----- Category detection -----
function detectCategory(text: string): ActionCategory {
  const t = text.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (cat === "UNKNOWN") continue;
    if (keywords.some((kw) => t.includes(kw))) {
      return cat as ActionCategory;
    }
  }
  return "UNKNOWN";
}

// ----- EXP and stat calculation -----
// 基準: 仕事 1時間 = 学習/個人開発/読書 30分 = 筋トレ/掃除/料理 10分 = 瞑想 3分
const EXP_PER_HOUR: Record<ActionCategory, number> = {
  WORK: 150,
  STUDY: 100,
  EXERCISE: 300,
  MEDITATE: 1000,
  SLEEP: 10,
  HOUSEWORK: 300,
  COOKING: 300,
  DEBUFF: -20,
  UNKNOWN: 15,
};

function calcLegacyDeltas(
  category: ActionCategory,
  minutes: number
): Pick<ActionResult, "hpDelta" | "focusDelta" | "strengthDelta" | "intelligenceDelta"> {
  const factor = minutes / 60;
  switch (category) {
    case "WORK":
      return { hpDelta: 0, focusDelta: Math.round(8 * factor), strengthDelta: Math.round(6 * factor), intelligenceDelta: Math.round(10 * factor) };
    case "EXERCISE":
      return { hpDelta: Math.round(5 * factor), focusDelta: Math.round(2 * factor), strengthDelta: Math.round(5 * factor), intelligenceDelta: 0 };
    case "STUDY":
      return { hpDelta: 0, focusDelta: Math.round(3 * factor), strengthDelta: 0, intelligenceDelta: Math.round(5 * factor) };
    case "MEDITATE":
      return { hpDelta: Math.round(3 * factor), focusDelta: Math.round(5 * factor), strengthDelta: 0, intelligenceDelta: Math.round(1 * factor) };
    case "SLEEP":
      return { hpDelta: Math.round(10 * factor), focusDelta: Math.round(8 * factor), strengthDelta: Math.round(2 * factor), intelligenceDelta: Math.round(2 * factor) };
    case "HOUSEWORK":
      return { hpDelta: Math.round(1 * factor), focusDelta: Math.round(1 * factor), strengthDelta: 0, intelligenceDelta: 0 };
    case "COOKING":
      return { hpDelta: Math.round(2 * factor), focusDelta: 0, strengthDelta: 0, intelligenceDelta: Math.round(1 * factor) };
    case "DEBUFF":
      return { hpDelta: -Math.round(5 * factor), focusDelta: -Math.round(8 * factor), strengthDelta: 0, intelligenceDelta: 0 };
    default:
      return { hpDelta: 0, focusDelta: Math.round(1 * factor), strengthDelta: 0, intelligenceDelta: Math.round(1 * factor) };
  }
}

function pickComment(category: ActionCategory): string {
  const pool = COMMENTS[category];
  return pool[Math.floor(Math.random() * pool.length)];
}

// ----- Main parse function -----
export function parseAction(text: string): ActionResult {
  const category = detectCategory(text);
  const minutes = extractMinutes(text);
  const expPerHour = EXP_PER_HOUR[category];
  const expGained = Math.max(Math.round((expPerHour * minutes) / 60), category === "DEBUFF" ? -20 : 1);
  const stats = calcLegacyDeltas(category, minutes);
  const statDeltas = calcStatDeltas(category, minutes, text);
  const comment = pickComment(category);

  return { category, minutes, expGained, ...stats, statDeltas, comment };
}

// ----- Level calculation -----
export function expForNextLevel(level: number): number {
  return level * 100;
}

export function calcLevel(totalExp: number): { level: number; currentExp: number; nextLevelExp: number } {
  let level = 1;
  let remaining = totalExp;
  while (remaining >= expForNextLevel(level)) {
    remaining -= expForNextLevel(level);
    level++;
  }
  return { level, currentExp: remaining, nextLevelExp: expForNextLevel(level) };
}
