/**
 * ワンアクション定義。
 * 新しいワンアクションを追加するときはここにエントリを追加するだけでよい。
 * text は gameEngine に渡されるので「行動名 時間」形式を推奨。
 */
export interface OneAction {
  label: string;
  icon: string;
  text: string;
}

export const ONE_ACTIONS: OneAction[] = [
  { label: "腕立て",    icon: "💪", text: "腕立て 10分" },
  { label: "スクワット", icon: "🦵", text: "スクワット 10分" },
  { label: "腹筋",      icon: "🔥", text: "腹筋 10分" },
  { label: "睡眠 7h+",   icon: "🛌", text: "睡眠 7時間" },
  { label: "水を飲む",   icon: "💧", text: "水を飲む 5分" },
  { label: "薬を飲む",   icon: "💊", text: "薬を飲む 5分" },
  { label: "肌ケア",    icon: "✨", text: "肌ケア 10分" },
  { label: "ストレッチ", icon: "🤸", text: "ストレッチ 10分" },
  { label: "ゴミ捨て",  icon: "🗑️", text: "ゴミ捨て 5分" },
  { label: "深呼吸",    icon: "🌬️", text: "深呼吸 5分" },
  { label: "歯磨き",    icon: "🦷", text: "歯磨き 3分" },
  { label: "日光を浴びる", icon: "☀️", text: "日光浴び 5分" },
];
