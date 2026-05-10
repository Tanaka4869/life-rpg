import type { ActionCategory, StatKey } from "@/lib/types";

export type StatEffect = Partial<Record<StatKey, number>>;

/**
 * カテゴリごとのステータス変化レート（1時間あたり）。
 * 新カテゴリを追加するときはここに1エントリ追加する。
 */
export const CATEGORY_STAT_EFFECTS: Record<ActionCategory, StatEffect> = {
  WORK:     { concentration: 2, execution: 4, intelligence: 1 },
  EXERCISE: { stamina: 3, muscular: 2, health: 2 },
  STUDY:    { intelligence: 4, concentration: 2 },
  MEDITATE: { concentration: 5, health: 1 },
  SLEEP:    { health: 4, stamina: 2, concentration: 1 },
  HOUSEWORK: { housework: 5, execution: 1 },
  COOKING:   { cooking: 5, health: 1 },
  DEBUFF:   { concentration: -4, health: -2, stamina: -1 },
  UNKNOWN:  { execution: 1 },
};

/**
 * キーワードごとの追加ステータス変化（1時間あたり）。
 * カテゴリ効果に加算される。
 * 新しい行動を追加するときはここにエントリを追加するだけでよい。
 */
export const KEYWORD_STAT_EFFECTS: Array<{
  keywords: string[];
  effects: StatEffect;
}> = [
  {
    keywords: ["筋トレ", "腕立て", "スクワット", "腹筋", "懸垂", "ダンベル", "バーベル", "筋肉"],
    effects: { muscular: 4, stamina: 2 },
  },
  {
    keywords: ["ランニング", "ジョギング", "マラソン"],
    effects: { stamina: 4, health: 2 },
  },
  {
    keywords: ["散歩", "ウォーキング"],
    effects: { health: 3, stamina: 1 },
  },
  {
    keywords: ["読書", "本を読"],
    effects: { intelligence: 3, concentration: 1 },
  },
  {
    keywords: ["英語", "語学", "英単語", "TOEIC", "toeic"],
    effects: { intelligence: 4, concentration: 2 },
  },
  {
    keywords: ["勉強", "学習", "授業", "講義"],
    effects: { intelligence: 3, concentration: 2 },
  },
  {
    keywords: ["瞑想", "マインドフルネス"],
    effects: { concentration: 5, health: 2 },
  },
  {
    keywords: ["プログラミング", "コーディング", "開発", "コード"],
    effects: { intelligence: 3, concentration: 3, execution: 2 },
  },
  {
    keywords: ["副業", "ライティング", "ブログ", "執筆"],
    effects: { execution: 4, intelligence: 1 },
  },
  {
    keywords: ["睡眠", "熟睡"],
    effects: { health: 5, stamina: 3, concentration: 2 },
  },
  {
    keywords: ["ヨガ", "ストレッチ"],
    effects: { health: 3, concentration: 2, stamina: 1 },
  },
  {
    keywords: ["サイクリング", "自転車"],
    effects: { stamina: 3, health: 2 },
  },
];
