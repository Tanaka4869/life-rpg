# LIFE RPG — アプリケーション仕様書

**バージョン**: 2.3.0  
**作成日**: 2026-05-07  
**更新日**: 2026-05-13  
**対象環境**: PCブラウザ / Androidブラウザ（PWA対応）

---

## 1. プロジェクト概要

### 1.1 コンセプト

ユーザーの日々の行動をRPGゲームとして数値化し、経験値・レベル・ステータス・称号に変換することで、現実の行動を継続しやすくするライフログツール。

「タスク管理」ではなく **「人生をRPG化する体験」** を最優先とする。

### 1.2 対象ユーザー

- 副業・自己投資・健康改善を継続したいが続かない人
- ゲームのようなフィードバックがあると行動しやすい人

### 1.3 利用シナリオ

1. ユーザーが今日した行動を自由テキストで入力する
2. アプリが行動を自動解析し、EXP・ステータスへ変換する
3. レベルアップ・クエスト達成・称号取得などの演出でモチベーションを維持する
4. 毎日ログインし、連続日数（ストリーク）を伸ばす

---

## 2. 技術構成

| 項目 | 採用技術 |
|------|---------|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS v4 |
| UIコンポーネント | shadcn/ui |
| データ永続化 | LocalStorage |
| PWA | manifest.json |
| パッケージマネージャー | npm |

### 2.1 設計方針

- 外部サービス依存なし（Firebase等は使用しない）
- 初心者でも保守しやすいシンプルな構成
- AI化・バックエンド追加が容易な疎結合設計

---

## 3. ディレクトリ構成

```
life-rpg/
├── app/
│   ├── layout.tsx        # レイアウト・メタデータ・PWA設定
│   ├── page.tsx          # メインページ（状態管理・ゲームロジック統合）
│   └── globals.css       # グローバルスタイル（ダークRPGテーマ）
├── components/
│   ├── StatusPanel.tsx   # ステータス表示パネル（LV/EXP/HP/Focus）
│   ├── StatGrowthPanel.tsx # キャラクターステータス成長パネル（10種）
│   ├── ActionInput.tsx   # 行動入力フォーム
│   ├── CommentBox.tsx    # AIコメント・演出表示
│   ├── QuestPanel.tsx    # デイリークエスト一覧
│   ├── TitlePanel.tsx    # 称号一覧・装備
│   └── LogHistory.tsx    # 行動履歴（直近10件）
├── components/ui/        # shadcn/ui 自動生成コンポーネント
├── lib/
│   ├── types.ts          # 型定義（StatKey / PlayerStats 含む）
│   ├── gameEngine.ts     # 行動解析・EXP計算ロジック
│   ├── statEngine.ts     # ステータス計算・適用ロジック
│   ├── storage.ts        # LocalStorage管理・日次リセット
│   └── quests.ts         # クエスト定義・生成
├── data/
│   ├── statConfig.ts     # ステータス定義（表示名・アイコン・色）
│   ├── actionStatMap.ts  # 行動→ステータスマッピング設定
│   └── titles.ts         # 称号定義・解除条件
├── public/
│   └── manifest.json     # PWAマニフェスト
├── start.bat             # 開発サーバー起動スクリプト
└── README.md
```

---

## 4. データモデル

### 4.1 PlayerStatus（プレイヤー状態）

LocalStorageキー: `life-rpg-player`

```typescript
interface PlayerStatus {
  level: number;          // 現在レベル（1〜）
  exp: number;            // 総獲得EXP（累積）
  hp: number;             // 現在HP
  maxHp: number;          // 最大HP（STR成長で上昇）
  focus: number;          // 集中力（0〜100）
  strength: number;       // 体力（STR）
  intelligence: number;   // 知力（INT）
  streak: number;         // 連続ログイン日数
  lastLoginDate: string;  // 最終ログイン日（YYYY-MM-DD）
  titles: string[];       // 取得済み称号IDリスト
  activeTitle: string;    // 装備中称号ID
  completedQuestIds: string[]; // 当日完了クエストIDリスト
  todayQuestIds: string[];     // 当日のクエストIDリスト
  questRefreshCount: number;   // 当日のクエストリフレッシュ回数（日付変更時リセット）
  logs: ActionLog[];           // 行動ログ履歴
}
```

### 4.2 ActionLog（行動ログ）

```typescript
interface ActionLog {
  id: string;             // タイムスタンプベースのID
  text: string;           // ユーザー入力テキスト
  category: ActionCategory;
  expGained: number;      // 獲得EXP（マイナスも有）
  comment: string;        // 表示されたコメント
  timestamp: string;      // ISO 8601形式
}
```

### 4.2.5 PlayerStats（キャラクターステータス）

`PlayerStatus.stats` に格納。`Record<StatKey, number>` 型。

| StatKey | 表示名 | 主な成長源 |
|---------|--------|-----------|
| `concentration` | 集中力 | WORK / STUDY / MEDITATE |
| `intelligence` | 知力 | STUDY / プログラミング / 読書 |
| `stamina` | 体力 | EXERCISE / SLEEP |
| `health` | 健康力 | SLEEP / 料理 / 散歩 |
| `housework` | 家事力 | 掃除 / 洗濯 |
| `cooking` | 自炊力 | 料理 / 自炊 |
| `muscular` | 筋力 | 筋トレ / 腕立て |
| `execution` | 実行力 | WORK / あらゆる行動 |
| `cleanliness` | 綺麗さ | 掃除 / 洗濯 / 整理整頓 |
| `engineering` | エンジニア力 | プログラミング / 開発 |

増加量は `data/actionStatMap.ts` で定義。入力時間（分）に比例してスケール。

---

### 4.3 ActionCategory（行動カテゴリ）

```typescript
type ActionCategory =
  | "WORK"      // 副業・仕事
  | "EXERCISE"  // 運動
  | "STUDY"     // 学習・読書
  | "MEDITATE"  // 瞑想・休憩
  | "SLEEP"     // 睡眠
  | "HOUSEWORK" // 家事
  | "COOKING"   // 料理・自炊
  | "DEBUFF"    // 夜更かし等
  | "UNKNOWN";  // 不明
```

### 4.4 Quest（クエスト）

```typescript
interface Quest {
  id: string;
  title: string;
  description: string;
  category: ActionCategory;
  targetMinutes: number;  // 達成に必要な時間（分）
  reward: number;         // 達成報酬EXP
  completed: boolean;
}
```

### 4.5 Title（称号）

```typescript
interface Title {
  id: string;
  name: string;
  description: string;
  condition: (status: PlayerStatus) => boolean;  // 解除条件関数
}
```

---

## 5. ゲームシステム仕様

### 5.1 行動解析（gameEngine.ts）

入力テキストから以下を自動推定する。

#### カテゴリ判定（キーワードマッチング）

| カテゴリ | 検出キーワード（例） |
|---------|-------------------|
| STUDY | 読書、勉強、学習、個人開発、英語、資格、リサーチ（WORK より先に判定） |
| WORK | 仕事、副業、作業、プログラミング、コーディング、ライティング、ブログ |
| EXERCISE | 運動、筋トレ、ジム、ランニング、ヨガ、スクワット |
| MEDITATE | 瞑想、休憩、リラックス、マインドフルネス |
| SLEEP | 睡眠、仮眠、昼寝、就寝 |
| HOUSEWORK | 掃除、洗濯、片付け、整理整頓、大掃除、ゴミ捨て、アイロン |
| COOKING | 料理、自炊、調理、炊事、弁当、クッキング、作り置き |
| DEBUFF | 夜更かし、徹夜、飲酒、SNS、だらだら、サボり |

#### 時間抽出（正規表現）

| 形式 | 例 |
|------|---|
| X時間Y分 | `副業 1時間30分` → 90分 |
| X時間 | `散歩 2時間` → 120分 |
| X分 | `読書 45分` → 45分 |
| Xh | `作業 2h` → 120分 |
| Xmin | `ストレッチ 15min` → 15分 |
| 指定なし | `読書` → デフォルト30分 |

### 5.2 EXP計算

```
EXP = (カテゴリのEXP/時間レート) × (入力時間 / 60分)
```

| カテゴリ | EXP/時間レート | 備考 |
|---------|--------------|------|
| WORK | 150 EXP/h | 仕事 1時間 = 学習の1.5倍 |
| STUDY | 100 EXP/h | 学習・個人開発・読書 30分 = 基準 |
| EXERCISE | 300 EXP/h | 筋トレ 10分 = 基準 |
| HOUSEWORK | 300 EXP/h | 掃除 10分 = 基準 |
| COOKING | 300 EXP/h | 料理 10分 = 基準 |
| MEDITATE | 1000 EXP/h | 瞑想 3分 = 基準、**1日3回まで有効** |
| SLEEP | 10 EXP/h | |
| DEBUFF | −20 EXP（固定ペナルティ） | |
| UNKNOWN | 15 EXP/h | |

**例**: `仕事 1時間` → 150 EXP / `学習 30分` → 50 EXP / `瞑想 3分` → 50 EXP（3回/日上限）

### 5.3 ステータス変化

各行動により以下が変化する（時間に比例）。

| カテゴリ | HP | 集中力 | STR体力 | INT知力 |
|---------|-----|--------|--------|--------|
| WORK | — | +8/h | +6/h | +10/h |
| EXERCISE | +5/h | +2/h | +5/h | — |
| STUDY | — | +3/h | — | +5/h |
| MEDITATE | +3/h | +5/h | — | +1/h |
| SLEEP | +2/h | — | +1/h | — |
| DEBUFF | −5/h | −8/h | — | — |

### 5.4 レベルシステム

**レベルアップ必要EXP**:
```
次のレベルに必要なEXP = 現在レベル × 150
```

| レベル | 必要EXP（累計） |
|--------|--------------|
| 1 → 2 | 150 |
| 2 → 3 | 300（累計450） |
| 3 → 4 | 450（累計900） |
| 5 → 6 | 750（累計2,250） |
| 10 → 11 | 1,500（累計8,250） |

**レベルアップ時の効果**:
- HP全回復
- MaxHP +10

**MaxHPの成長**:
```
MaxHP = 100 + floor(STR / 5) × 10
```

### 5.5 デイリーリセット

毎日最初のアクセス時に以下が実行される。

- 当日のクエストを新しく3つ生成
- 完了クエストリストをリセット
- HP +20 回復（翌日ボーナス）
- 連続ログイン判定:
  - 前日にログインしていた → streak +1
  - 途切れた → streak = 1

### 5.6 ストレージ関数（lib/storage.ts）

| 関数 | 説明 |
|------|------|
| `loadStatus()` | LocalStorageから読み込み（なければ新規初期化） |
| `saveStatus(status)` | LocalStorageへ保存 |
| `hasSaveData()` | セーブデータの有無を返す（boolean） |
| `resetAllData()` | LocalStorageのデータを削除 |
| `initNewPlayer()` | 新規プレイヤーを初期化して保存・返却 |

---

## 6. クエストシステム

### 6.1 デイリークエスト生成

- 毎日、クエストプールから **3つ** をランダム選択
- ランダムシードは **日付 + リフレッシュ回数** ベース（全達成後に別セットを生成可能）
- 全クエスト達成後、「新しいミッションを受ける」ボタンが表示され、何度でも新セットに更新できる
- リフレッシュ回数（`questRefreshCount`）は日付変更時に 0 にリセット

### 6.2 クエストプール（全25種）

| ID | タイトル | カテゴリ | 目標時間 | 報酬 |
|----|---------|---------|---------|------|
| q_work_30 | 仕事に取り組む | WORK | 30分 | 30 EXP |
| q_work_60 | 仕事の時間 | WORK | 60分 | 60 EXP |
| q_work_90 | 集中の90分 | WORK | 90分 | 90 EXP |
| q_work_120 | 長丁場の作業 | WORK | 120分 | 120 EXP |
| q_exercise_15 | 軽く体を動かす | EXERCISE | 15分 | 15 EXP |
| q_exercise_30 | 体を動かせ | EXERCISE | 30分 | 25 EXP |
| q_exercise_60 | 肉体鍛錬 | EXERCISE | 60分 | 50 EXP |
| q_exercise_90 | ガチ勢の汗 | EXERCISE | 90分 | 75 EXP |
| q_walk_20 | 散歩タイム | EXERCISE | 20分 | 18 EXP |
| q_study_15 | 知の扉 | STUDY | 15分 | 20 EXP |
| q_study_30 | 学習者 | STUDY | 30分 | 40 EXP |
| q_study_60 | 修行の時間 | STUDY | 60分 | 80 EXP |
| q_study_90 | 探求者 | STUDY | 90分 | 110 EXP |
| q_study_120 | 知識の塔 | STUDY | 120分 | 140 EXP |
| q_meditate_10 | 静寂の時 | MEDITATE | 10分 | 15 EXP |
| q_meditate_20 | 心を鎮める | MEDITATE | 20分 | 25 EXP |
| q_meditate_30 | 禅の境地 | MEDITATE | 30分 | 35 EXP |
| q_sleep_360 | 戦士の休息 | SLEEP | 360分 | 30 EXP |
| q_sleep_420 | 勇者の眠り | SLEEP | 420分 | 40 EXP |
| q_sleep_480 | 深い眠り | SLEEP | 480分 | 55 EXP |
| q_housework_10 | 家を整える | HOUSEWORK | 10分 | 20 EXP |
| q_housework_20 | きれいな部屋 | HOUSEWORK | 20分 | 35 EXP |
| q_housework_30 | 大掃除 | HOUSEWORK | 30分 | 50 EXP |
| q_cooking_15 | 自炊する | COOKING | 15分 | 20 EXP |
| q_cooking_30 | 丁寧な食事作り | COOKING | 30分 | 35 EXP |

### 6.3 クエスト達成判定

行動入力のたびに、**当日の同カテゴリの合計時間**がクエスト条件を満たしているか判定。1回の行動では不足でも、複数回の合算で達成できる。達成時に追加EXPを即時付与。

---

## 7. 称号システム

### 7.1 全称号一覧（全39種）

| ID | 称号名 | 解除条件 |
|----|--------|---------|
| beginner | 駆け出し冒険者 | ログを1回記録 |
| logger_10 | 記録者 | ログを10回記録 |
| logger_50 | 熟練の記録者 | ログを50回記録 |
| logger_100 | 年代記作者 | ログを100回記録 |
| logger_200 | 記録の伝説 | ログを200回記録 |
| level5 | 冒険者 | レベル5到達 |
| level10 | ベテラン戦士 | レベル10到達 |
| level20 | 英雄 | レベル20到達 |
| level30 | 伝説の勇者 | レベル30到達 |
| level50 | 神話の存在 | レベル50到達 |
| streak_3 | 継続者 | 3日連続ログイン |
| streak_7 | 七日の誓い | 7日連続ログイン |
| streak_14 | 二週間の誓い | 14日連続ログイン |
| streak_30 | 鋼の意志 | 30日連続ログイン |
| streak_100 | 不屈の魂 | 100日連続ログイン |
| worker | 副業初心者 | 仕事ログを5回記録 |
| worker_pro | 副業の覇者 | 仕事ログを20回記録 |
| scholar | 修行僧 | 学習ログを10回記録 |
| scholar_pro | 叡智の探求者 | 学習ログを20回記録 |
| athlete | 鍛錬の人 | 運動ログを10回記録 |
| athlete_pro | 肉体の錬磨師 | 運動ログを20回記録 |
| meditator | 静寂の求道者 | 瞑想ログを5回記録 |
| cook | 自炊の達人 | 料理ログを5回記録 |
| housekeeper | 清掃の騎士 | 家事ログを5回記録 |
| good_sleeper | 良眠の守護者 | 睡眠ログを5回記録 |
| all_rounder | 万能プレイヤー | 仕事・学習・運動・瞑想をすべて経験 |
| night_warrior | 深夜の戦士 | デバフあり＋streak≥3 |
| int_master | 知の巨人 | INT 100超 |
| hp_master | 鉄の肉体 | MaxHP 150超 |
| stamina_master | 体力自慢 | stamina 100超 |
| muscular_master | 鉄の筋肉 | muscular 100超 |
| execution_master | 実行の鬼 | execution 100超 |
| engineer_master | エンジニアの極み | engineering 100超 |
| health_master | 健康の化身 | health 100超 |
| boss_debut | ボス討伐者 | ボスを1体倒した |
| boss_hunter | ボスハンター | ボスを5体倒した |
| gacha_debut | ガチャの誘惑 | 初めてガチャを引いた |
| gacha_addict | 石割り職人 | ガチャを10回引いた |

### 7.2 称号の装備

取得した称号はプロフィールに装備できる。装備中の称号はステータスパネルのレベル横に表示される。

---

## 8. UI仕様

### 8.1 デザイン方針

- **テーマ**: ダーク / サイバーパンク / RPG風
- **カラーパレット**:
  - 背景: `slate-950` (#020617)
  - アクセント: `cyan-400` (#22d3ee)
  - EXPバー: cyan グラデーション
  - HPバー: rose グラデーション
  - 集中力バー: blue グラデーション
  - 警告/デバフ: red
  - 称号: purple
  - ストリーク: yellow
- **フォント**: Geist Mono（モノスペース）
- **レイアウト**: 最大幅 `max-w-2xl`、中央寄せ

### 8.2 画面遷移フロー

起動後は以下の順で画面が遷移する。

```
[ タイトル画面 ] → (タップ) → [ スタートメニュー ] → (選択) → [ ゲーム画面 ]
```

#### タイトル画面

```
┌─────────────────────────────┐
│                             │
│        LIFE RPG             │  ← 大タイトル（cyan・グロー）
│   人生をゲームとして生きろ     │  ← サブタイトル
│                             │
│     ── PUSH START ──        │  ← 点滅アニメーション
│                             │
│   TAP ANYWHERE TO START     │  ← 画面下部ヒント
└─────────────────────────────┘
```

- 画面のどこでもタップ/クリックで次へ進む

#### スタートメニュー画面

```
┌─────────────────────────────┐
│         LIFE RPG            │
│                             │
│  ┌───────────────────────┐  │
│  │     つづきから         │  │  ← セーブデータあり: cyan / なし: グレーアウト
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │     はじめから         │  │  ← 常に赤（危険表示）
│  │ ※セーブデータは削除されます │  │  ← セーブデータがある場合のみ表示
│  └───────────────────────┘  │
└─────────────────────────────┘
```

| ボタン | 動作 | 条件 |
|--------|------|------|
| つづきから | LocalStorageから読み込んでゲーム開始 | セーブデータが存在する場合のみ有効 |
| はじめから | LocalStorageを削除して新規プレイヤーを生成し開始 | 常に有効 |

#### ゲーム画面

```
┌─────────────────────────────┐
│  LIFE RPG         LV.{n}    │  ← ヘッダー（固定）
│  人生をゲームとして生きろ  ████░ │  ← EXPバー（現在/次レベル）
├─────────────────────────────┤
│ ✏️ACTION ⚡STATUS 📋QUEST 🏅TITLES │  ← タブナビゲーション
├─────────────────────────────┤
│  [ タブコンテンツ ]            │  ← タブ切替
└─────────────────────────────┘
```

- 起動時は **ACTION タブ** がデフォルトで開く
- 行動入力フォーム・コメントは ACTION タブ内にのみ表示（他タブでは非表示）

### 8.3 各タブ内容

**ACTION タブ**（起動時デフォルト）
- 行動入力フォーム
- AIコメント・演出表示（入力後に表示）
- 行動履歴（Battle Log）: 直近10件をカテゴリ別カラーで表示

**STATUS タブ**
- レベル・装備中称号
- 総EXP・EXPバー（次レベルまで）
- HPバー・集中力バー
- STR / INT / 称号数 / ログ数 チップ
- ストリーク日数
- **HINTパネル**（折りたたみ式）: ステータスごとの育て方一覧

**QUEST タブ**
- 当日の3クエスト
- 達成済み: 打ち消し線・緑表示
- 未達成: 通常表示・報酬EXP表示

**TITLES タブ**
- 取得済み称号（クリックで装備切替）
- 未取得称号（???で伏せ表示・最大6件）

### 8.4 レスポンシブ対応

- モバイルファースト設計
- `max-w-2xl` + padding で全サイズ対応
- タブUI でスマホでの縦スクロールを最小化

### 8.5 演出

| イベント | 演出 |
|---------|------|
| 行動入力後 | 300msのローディング後にコメント表示 |
| コメント表示 | フェードイン + スライドアップ |
| レベルアップ | 黄色バナー（animate-pulse） |
| 称号取得 | 紫バナー表示 |
| クエスト達成 | 緑ハイライト |

---

## 9. PWA仕様

`/public/manifest.json` により以下を実現:

| 項目 | 値 |
|------|---|
| 表示名 | LIFE RPG |
| テーマカラー | #020617 |
| display | standalone |
| orientation | portrait-primary |

Androidの「ホーム画面に追加」でアプリ風に利用可能。

---

## 10. 将来の拡張案

### Phase 4（未実装）

| 機能 | 概要 |
|------|------|
| AI行動解析 | Claude API連携でより精度高い解析 |
| グラフ表示 | EXP・ステータスの推移グラフ |
| パーティシステム | 複数ユーザーで競い合う |
| バックエンド | Supabase等でクラウド同期 |
| 通知 | PWAプッシュ通知でデイリーリマインド |
| 週次レポート | 1週間の行動サマリー |
| 装備・スキルツリー | ゲーム要素の深化 |

### AI化の準備

`lib/gameEngine.ts` の `parseAction()` 関数は、将来的にAPI呼び出しに差し替えられる設計になっている。現状はルールベースで動作しており、外部依存なし。

```typescript
// 現在: ルールベース
export function parseAction(text: string): ActionResult { ... }

// 将来: AI置き換え（インターフェースは同一）
export async function parseAction(text: string): Promise<ActionResult> {
  return await callClaudeAPI(text);
}
```

---

## 11. 起動・開発手順

```bash
# リポジトリに移動
cd C:\my-factory\life-rpg

# 依存パッケージインストール（初回のみ）
npm install

# 開発サーバー起動
npm run dev
# → http://localhost:3000

# プロダクションビルド
npm run build
npm start
```

または `start.bat` をダブルクリックで開発サーバー起動。

---

*本仕様書はv1.0実装に基づく。機能追加時は本書を更新すること。*
