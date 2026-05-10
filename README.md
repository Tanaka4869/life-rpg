# LIFE RPG

人生をRPGとして記録するライフログツール。

## 起動方法

```bash
npm run dev
# -> http://localhost:3000
```

または `start.bat` をダブルクリック。

## 機能

- **行動ログ入力**: 自由テキストで今日の行動を記録
- **EXP・レベルシステム**: 行動に応じて経験値を獲得、レベルアップ
- **ステータス**: HP / 集中力 / 体力 / 知力
- **AIコメント**: 行動後にゲーム風コメントを表示
- **デイリークエスト**: 毎日3つのクエストを達成して追加報酬
- **称号システム**: 条件達成で称号を解除・装備可能

## 入力例

```
副業 1時間
散歩 30分
読書 45分
筋トレ 1時間
瞑想 10分
夜更かし
```

## カテゴリと効果

| カテゴリ | キーワード例 | 効果 |
|---------|------------|------|
| 副業 | 副業、作業、開発、プログラミング | EXP+、INT+、STR+ |
| 運動 | 運動、筋トレ、散歩、ランニング | HP+、STR+ |
| 学習 | 読書、勉強、英語、資格 | INT+、集中力+ |
| 瞑想 | 瞑想、休憩、リラックス | HP+、集中力+ |
| 睡眠 | 睡眠、仮眠、昼寝 | HP大回復 |
| デバフ | 夜更かし、SNS、だらだら | HP-、集中力- |

## データ保存

LocalStorage に保存。ブラウザのデータをクリアするとリセットされる。

## 技術構成

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- LocalStorage（外部依存なし）

---

## ステータスシステム

### ステータス構造

`PlayerStatus.stats` に以下の8種を `Record<StatKey, number>` で保持する。

| キー | 表示名 | 説明 |
|------|--------|------|
| `concentration` | 集中力 | 作業・学習・瞑想で成長 |
| `intelligence` | 知力 | 学習・読書・開発で成長 |
| `stamina` | 体力 | 運動・睡眠で成長 |
| `health` | 健康力 | 睡眠・瞑想・自炊・運動で成長 |
| `housework` | 家事力 | 掃除・洗濯・片付けで成長 |
| `cooking` | 自炊力 | 料理・自炊・調理で成長 |
| `muscular` | 筋力 | 筋トレ・腕立て・スクワットで成長 |
| `execution` | 実行力 | あらゆる行動記録で成長 |

### ステータスの追加方法

1. `lib/types.ts` の `StatKey` に新しいキーを追加する
2. `data/statConfig.ts` の `STAT_DEFINITIONS` に表示定義を追加する
3. `data/actionStatMap.ts` の `CATEGORY_STAT_EFFECTS` / `KEYWORD_STAT_EFFECTS` に効果を追加する
4. `lib/statEngine.ts` の `DEFAULT_PLAYER_STATS` にデフォルト値（0）を追加する

### 行動とステータスの紐付け方法

`data/actionStatMap.ts` を編集する。

**カテゴリ単位で設定**（`CATEGORY_STAT_EFFECTS`）:

```ts
STUDY: { intelligence: 4, concentration: 2 }  // 1時間あたりの増加量
```

**キーワード単位で追加設定**（`KEYWORD_STAT_EFFECTS`）:

```ts
{
  keywords: ["料理", "自炊", "調理"],
  effects: { cooking: 5, health: 1 },  // カテゴリ効果に加算される（1時間あたり）
}
```

実際の増加量は入力時間に比例してスケールされる（例：30分 → 効果の半分）。

### 今後の拡張ポイント

| 場所 | 拡張内容 |
|------|---------|
| `lib/types.ts` | ステータスキーの追加 |
| `data/statConfig.ts` | 表示名・アイコン・バー色の変更 |
| `data/actionStatMap.ts` | 新行動キーワードの追加・効果値の調整 |
| `components/StatGrowthPanel.tsx` | UI演出の強化（アニメーション等） |
| `lib/statEngine.ts` | 計算ロジックの変更（上限・乗数・ティアなど） |
