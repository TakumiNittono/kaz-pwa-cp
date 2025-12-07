'use client';

import PushButton from '@/components/PushButton';

export default function Home() {
  // 環境変数からOneSignal App IDを取得
  const oneSignalAppId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || '';

  // 常に通知許可画面を表示
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="w-full max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              無料特典アプリ
            </h1>
            <p className="text-gray-600">
              プッシュ通知を有効にして、最新情報を受け取りましょう
            </p>
          </div>

          {/* OneSignal統合エリア */}
          <PushButton 
            appId={oneSignalAppId} 
            redirectUrl="/success" // 通知許可後に自動的に成功ページに遷移
          />
        </div>
      </div>
    </main>
  );
}

