# 日本語学習 - プッシュ通知許可専用ミニサイト

日本語学習向けのプッシュ通知登録用ランディングページです。

## 機能

1. **PWA対応**: スマホのホーム画面に追加可能
2. **3ステップフロー**:
   - STEP 1: ホーム画面に追加してもらう
   - STEP 2: プッシュ通知を許可する
   - STEP 3: 成功画面からLPへ遷移

## 技術スタック

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- OneSignal Web SDK (最新API)
- PWA対応

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成し、以下の環境変数を設定してください：

```env
NEXT_PUBLIC_ONESIGNAL_APP_ID=your-onesignal-app-id
NEXT_PUBLIC_JP_LEARNING_LP_URL=https://your-learning-lp-url.com
```

### 3. PWAアイコンの追加

`public/` ディレクトリに以下のアイコンファイルを追加してください：

- `icon-192.png` (192x192px)
- `icon-512.png` (512x512px)

これらのアイコンは、PWAとしてインストールされた際にホーム画面に表示されます。

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## プロジェクト構造

```
├── app/
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx            # メインページ（3ステップの画面切り替え）
│   └── globals.css         # グローバルスタイル
├── components/
│   ├── NotificationPermission.tsx  # 通知許可コンポーネント
│   ├── OneSignalScript.tsx         # OneSignal SDK読み込み
│   └── ServiceWorkerRegistration.tsx  # Service Worker登録
├── public/
│   ├── manifest.json       # PWAマニフェスト
│   ├── sw.js              # Service Worker
│   ├── OneSignalSDKWorker.js
│   └── OneSignalSDKUpdaterWorker.js
└── types/
    └── onesignal.d.ts     # OneSignal型定義
```

## OneSignal設定

このプロジェクトでは、OneSignalの最新API (`User.Push.enable`, `User.getId`) を使用しています。

- Push Primerは無効化されています (`promptOptions.slidedown.enabled = false`)
- `autoRegister: false` で自動登録を無効化
- ユーザーがボタンを押したときにのみ通知許可をリクエスト

## ビルド

```bash
npm run build
npm start
```

## ライセンス

Private

