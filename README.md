# マネコ 🐱 - AIマネーコンシェルジュ

> 金欠から資産形成まで。お金の「どうしよう？」を0秒で解決するAIコンシェルジュ

## セットアップ手順

### 1. 依存関係のインストール
```bash
npm install
```

### 2. Supabaseプロジェクトのセットアップ

1. [Supabase](https://supabase.com) でプロジェクトを作成
2. SQL Editorで `supabase-schema.sql` の内容を実行
3. Authentication > Providers で Email と Google を有効化

### 3. 環境変数の設定

`.env.local` に以下を設定:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. 開発サーバー起動
```bash
npm run dev
```

`http://localhost:3000` にアクセス

## 技術スタック

| 領域 | 技術 |
|------|------|
| フレームワーク | Next.js 16 (App Router) |
| スタイリング | Tailwind CSS v4 |
| データベース | Supabase (PostgreSQL) |
| 認証 | Supabase Auth |
| AI | OpenAI GPT-4o-mini |
| 状態管理 | Zustand |
| デプロイ | Vercel |

## 機能一覧

### 🏠 ダッシュボード
- キャラクター育成（レベルアップシステム）
- ポイント・節約額の可視化
- AIコンシェルジュチャット

### 💰 お金を増やす
- アンケート・リサーチ案件（BtoB）
- 不用品AIカメラ査定
- ポイント自動付与（トランザクション処理）

### 🛍️ 賢く使う
- パーソナライズクーポン一覧
- AIトラベルプランナー（予算内自動プラン生成）

### 👤 マイページ
- プロフィール・目標設定
- 実績・統計確認
- ログアウト

## データベース設計

```
users          - ユーザープロフィール・ポイント・キャラ情報
chat_history   - AIとの対話履歴
tasks_b2b      - 案件マスタ（企業依頼のアンケート等）
user_tasks     - ユーザーの案件参加・完了履歴
coupons        - クーポンマスタ
```

### セキュリティ
- Row Level Security (RLS) で自分のデータのみアクセス可
- ポイント付与はサーバーサイドのトランザクション処理

## Vercelへのデプロイ

```bash
# Vercel CLIでデプロイ
npx vercel --prod

# 環境変数をVercelに設定
npx vercel env add NEXT_PUBLIC_SUPABASE_URL
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
npx vercel env add OPENAI_API_KEY
```
