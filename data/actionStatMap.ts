import type { ActionCategory, StatKey } from "@/lib/types";

export type StatEffect = Partial<Record<StatKey, number>>;

/**
 * カテゴリごとのステータス変化レート（1時間あたり）。
 * 新カテゴリを追加するときはここに1エントリ追加する。
 */
export const CATEGORY_STAT_EFFECTS: Record<ActionCategory, StatEffect> = {
  WORK:     { concentration: 8, execution: 16, intelligence: 6, engineering: 3 },
  EXERCISE: { stamina: 3, muscular: 5, health: 2 },
  STUDY:    { intelligence: 4, concentration: 2 },
  MEDITATE: { concentration: 5, health: 1 },
  SLEEP:    { health: 2, stamina: 1 },
  HOUSEWORK: { housework: 10, cleanliness: 10, execution: 1 },
  COOKING:   { cooking: 13, health: 1 },
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
    effects: { muscular: 15, stamina: 3 },
  },
  {
    keywords: ["ランニング", "ジョギング", "マラソン"],
    effects: { stamina: 6, health: 3 },
  },
  {
    keywords: ["散歩", "ウォーキング"],
    effects: { health: 4, stamina: 2 },
  },
  {
    keywords: ["読書", "本を読"],
    effects: { intelligence: 5, concentration: 2 },
  },
  {
    keywords: ["英語", "語学", "英単語", "TOEIC", "toeic"],
    effects: { intelligence: 6, concentration: 3 },
  },
  {
    keywords: ["勉強", "学習", "授業", "講義"],
    effects: { intelligence: 5, concentration: 3 },
  },
  {
    keywords: ["瞑想", "マインドフルネス"],
    effects: { concentration: 8, health: 3 },
  },
  {
    keywords: ["プログラミング", "コーディング", "開発", "コード"],
    effects: { intelligence: 12, concentration: 10, execution: 10, engineering: 24 },
  },
  {
    keywords: ["副業", "ライティング", "ブログ", "執筆"],
    effects: { execution: 20, intelligence: 10 },
  },
  {
    keywords: ["掃除", "片付け", "整理整頓", "大掃除", "拭き掃除"],
    effects: { cleanliness: 20, housework: 10 },
  },
  {
    keywords: ["洗濯", "干した", "たたんだ", "アイロン"],
    effects: { cleanliness: 15, housework: 10 },
  },
  {
    keywords: ["ヨガ", "ストレッチ"],
    effects: { health: 4, concentration: 3, stamina: 2 },
  },
  {
    keywords: ["サイクリング", "自転車"],
    effects: { stamina: 5, health: 3 },
  },
  {
    keywords: ["水を飲む", "水を飲", "水分補給", "水飲む"],
    effects: { health: 12 },
  },
  {
    keywords: ["薬を飲む", "薬を飲", "服薬"],
    effects: { health: 12 },
  },
  {
    keywords: ["肌ケア", "スキンケア", "保湿"],
    effects: { cleanliness: 30, health: 6 },
  },
  {
    keywords: ["歯磨き", "歯ブラシ"],
    effects: { cleanliness: 50, health: 6 },
  },
  {
    keywords: ["日光浴び", "日光浴", "日光を浴"],
    effects: { health: 12, stamina: 6 },
  },
  {
    keywords: ["深呼吸", "腹式呼吸"],
    effects: { concentration: 12, health: 6 },
  },
  {
    keywords: ["ゴミ捨て"],
    effects: { cleanliness: 30, housework: 30 },
  },
];
