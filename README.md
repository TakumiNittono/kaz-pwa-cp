# PWA Push Notification App

Next.js + TypeScript + Tailwind CSS + OneSignal を使ったプッシュ通知対応のPWAアプリケーションです。

## 機能

- ✅ スマホ・PCにインストール可能なPWA
- ✅ OneSignal SDKによるプッシュ通知
- ✅ 通知許可ボタンと登録状況の表示
- ✅ Player ID（OneSignal ID）の表示
- ✅ Service Worker自動登録
- ✅ manifest.jsonによるPWA設定

## 技術スタック

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **OneSignal Web SDK** (react-onesignal)

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. OneSignal App IDの設定

1. [OneSignalダッシュボード](https://app.onesignal.com)にアクセス
2. 新しいアプリを作成（または既存のアプリを選択）
3. **Settings > Keys & IDs** から **App ID** をコピー
4. `.env.local` ファイルを作成し、以下のように設定：

```bash
cp .env.example .env.local
```

`.env.local` を編集：

```
NEXT_PUBLIC_ONESIGNAL_APP_ID=your-onesignal-app-id-here
```

### 3. PWAアイコンの準備（オプション）

`public` フォルダに以下のアイコンファイルを追加してください：

- `icon-192.png` (192x192px)
- `icon-512.png` (512x512px)

アイコンがない場合でもアプリは動作しますが、PWAインストール時にデフォルトアイコンが表示されます。

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## PWAインストール方法

### iPhone (Safari)

1. Safariでアプリを開く
2. 共有ボタン（□↑）をタップ
3. 「ホーム画面に追加」を選択
4. アプリ名を確認して「追加」をタップ

### Android (Chrome/Edge)

1. ブラウザでアプリを開く
2. メニュー（⋮）をタップ
3. 「ホーム画面に追加」または「アプリをインストール」を選択
4. 確認ダイアログで「インストール」をタップ

### PC (Chrome/Edge)

1. ブラウザでアプリを開く
2. アドレスバーのインストールアイコン（⊕）をクリック
3. 「インストール」をクリック

## プッシュ通知のテスト

1. アプリを開き、「Push通知を許可」ボタンをクリック
2. ブラウザの通知許可ダイアログで「許可」を選択
3. Player IDが表示されることを確認
4. OneSignalダッシュボードからテスト通知を送信

## プロジェクト構造

```
pwa-cp/
├── app/
│   ├── layout.tsx          # ルートレイアウト（manifest設定含む）
│   ├── page.tsx            # メインページ
│   └── globals.css         # グローバルスタイル
├── components/
│   └── PushButton.tsx      # プッシュ通知設定コンポーネント
├── public/
│   ├── manifest.json       # PWAマニフェスト
│   ├── sw.js               # Service Worker Wrapper
│   ├── OneSignalSDKWorker.js        # OneSignal Service Worker
│   └── OneSignalSDKUpdaterWorker.js # OneSignal Updater Worker
├── next.config.js          # Next.js設定
├── tailwind.config.js      # Tailwind CSS設定
├── tsconfig.json           # TypeScript設定
└── package.json            # 依存関係
```

## OneSignal設定

### Web Push設定

OneSignalダッシュボードで以下を設定してください：

1. **Settings > Platforms > Web Push**
2. **Web Push Configuration** を開く
3. **Site URL** を設定（例: `http://localhost:3000` または本番URL）
4. **Default Notification Icon** をアップロード（推奨: 192x192px以上）

### 本番環境での注意事項

本番環境では、OneSignalダッシュボードから提供される実際のService Worker URLを使用することを推奨します。

`public/OneSignalSDKWorker.js` と `public/OneSignalSDKUpdaterWorker.js` は、OneSignalダッシュボードの設定に従って更新してください。

## ビルドとデプロイ

```bash
# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm start
```

## トラブルシューティング

### 通知が表示されない

- ブラウザの通知許可が有効になっているか確認
- HTTPS（またはlocalhost）でアクセスしているか確認
- OneSignal App IDが正しく設定されているか確認
- ブラウザのコンソールでエラーを確認

### Service Workerが登録されない

- `next.config.js` のService Worker設定を確認
- ブラウザの開発者ツール > Application > Service Workers で状態を確認

### PWAがインストールできない

- `manifest.json` が正しく読み込まれているか確認
- アイコンファイル（`/icon-192.png`, `/icon-512.png`）が存在するか確認
- HTTPS（またはlocalhost）でアクセスしているか確認

## ライセンス

MIT

