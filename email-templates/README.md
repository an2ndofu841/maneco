# 📧 メールテンプレート

マネコの認証メール（Supabase Auth）用のHTMLテンプレートです。
受信者がパッと見て「何をすればいいか」がわかり、ブランド体験を損なわないデザインに統一しています。

## ファイル構成

| ファイル | 用途 | 対応するSupabaseテンプレート |
|---|---|---|
| `confirm-signup.html` | **登録時の確認メール**（最重要） | Confirm signup |
| `magic-link.html` | パスワードレスログイン用 | Magic Link |
| `recovery.html` | パスワード再設定 | Reset Password |
| `email-change.html` | メールアドレス変更の確認 | Change Email Address |

## デザインのポイント

- **モバイルファースト**: 600px幅、テーブルレイアウトで全メールクライアント対応（Outlook含む）
- **インラインCSS**: `<style>` ブロックを使わず、すべての装飾をinlineで指定
- **CTA最優先**: 確認ボタンを最初のスクロールで必ず見える位置に配置
- **代替URL表示**: ボタンが動かない場合のフォールバックURLを必ず提示
- **セキュリティ注意書き**: 心当たりがない受信者向けの説明を明示
- **登録メールのみ特別扱い**: 「+1ptプレゼント」のお得感バナーで開封→クリック率を上げる

## Supabase Dashboard への適用手順

### 1. Supabase Dashboard にログイン
https://supabase.com/dashboard

### 2. プロジェクトを選択し、左メニューから:
**Authentication → Email Templates**

### 3. 各テンプレートを編集

| Dashboard上のラベル | 貼り付ける `.html` の内容 |
|---|---|
| **Confirm signup** | `confirm-signup.html` |
| **Magic Link** | `magic-link.html` |
| **Reset Password** | `recovery.html` |
| **Change Email Address** | `email-change.html` |

それぞれ以下を編集します:

- **Subject heading**: 件名を以下に変更（推奨）
  - Confirm signup: `【マネコ】メールアドレスの確認をお願いします 🐱`
  - Magic Link: `【マネコ】1タップでログインできます 🔗`
  - Reset Password: `【マネコ】パスワードの再設定 🔑`
  - Change Email: `【マネコ】新しいメールアドレスの確認 📧`

- **Message body (HTML)**: 該当する `.html` ファイルの中身を全部コピーしてペースト

- **Save** をクリック

### 4. (オプション) 送信元の設定
**Project Settings → Auth → SMTP Settings** で、独自ドメインの送信元を設定すると更にブランド感が上がります（例: `noreply@maneco.app`）。

設定しない場合はSupabaseのデフォルト送信元から届きます。

## テンプレート変数

Supabaseが自動で置換する変数（Goテンプレート構文）:

| 変数 | 説明 | 使用しているテンプレート |
|---|---|---|
| `{{ .ConfirmationURL }}` | 認証完了用のリンク | すべて |
| `{{ .Email }}` | 受信者のメールアドレス | confirm-signup |
| `{{ .NewEmail }}` | 変更後のメールアドレス | email-change |
| `{{ .SiteURL }}` | サイトのベースURL | （未使用、必要なら追加可） |
| `{{ .Token }}` | 6桁のOTPコード | （リンクではなくOTP方式に切替時用） |

## プレビューの確認方法

### ローカルでブラウザ確認
```bash
open email-templates/confirm-signup.html
```

`{{ .ConfirmationURL }}` などはそのまま表示されますが、レイアウト・色・余白の確認にはこれで十分です。

### 本物のメールクライアントで確認
1. Supabase Dashboard でテンプレートを保存
2. テスト用のメールアドレスで `/register` から登録
3. 受信トレイで実際の見た目を確認

主要メールクライアントでの見え方を確認することを推奨:
- Gmail (Web / iOS / Android)
- Apple Mail (iOS / macOS)
- Outlook (Web / Desktop)

## カスタマイズのコツ

- **件名**: 絵文字を1つだけ入れると開封率が上がる（入れすぎは逆効果）
- **プリヘッダー**: 各HTML冒頭の `display:none;` 部分が受信トレイのプレビューに表示される
- **ボタン色**: ブランドカラーは `linear-gradient(135deg,#4f46e5 0%,#4338ca 100%)` で統一
- **画像は最小限**: ロゴも絵文字で代替し、画像ブロック対策を兼ねている

## トラブルシューティング

**Q. ボタンが青いリンク色になる**
A. 一部メールクライアント（特にGmail）が `<a>` を自動でリンク色に上書きします。テンプレートでは `color:#ffffff !important` のような書き方を避けつつ、視認性を確保しています。

**Q. Outlookでレイアウトが崩れる**
A. 既に `<!--[if mso]>` の VML ボタンフォールバックを入れています。それでも崩れる場合は `<table>` のネスト構造を確認してください。

**Q. 文字が表示されない（迷惑メール扱い）**
A. SPF/DKIM 設定が必要です。Supabase の Custom SMTP 設定でドメイン認証を行ってください。
