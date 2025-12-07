'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // PWAインストール状態の確認
    if (typeof window !== 'undefined') {
      // スタンドアロンモードで実行されているか確認
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }

      // オンライン状態の監視
      setIsOnline(navigator.onLine);
      window.addEventListener('online', () => setIsOnline(true));
      window.addEventListener('offline', () => setIsOnline(false));
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="w-full max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            PWA Push Notification App
          </h1>

          {/* ステータス表示 */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                アプリ状態
              </h2>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">インストール状態:</span>{' '}
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      isInstalled
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {isInstalled ? 'インストール済み' : '未インストール'}
                  </span>
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">ネットワーク状態:</span>{' '}
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      isOnline
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {isOnline ? 'オンライン' : 'オフライン'}
                  </span>
                </p>
              </div>
            </div>

            {/* OneSignal統合エリア（後で実装） */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-700 mb-2">
                Push通知設定
              </h2>
              <p className="text-blue-600 text-sm">
                OneSignal統合は後で実装予定です
              </p>
            </div>
          </div>

          {/* PWAインストール方法 */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              PWAインストール方法
            </h2>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>
                <strong>iPhone:</strong> Safariで開き、共有ボタン →
                「ホーム画面に追加」
              </li>
              <li>
                <strong>Android:</strong> ブラウザのメニュー →
                「ホーム画面に追加」または「アプリをインストール」
              </li>
              <li>
                <strong>PC (Chrome/Edge):</strong> アドレスバーのインストールアイコンをクリック
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

