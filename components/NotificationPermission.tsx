'use client';

import { useEffect } from 'react';
import { useOneSignal } from '@/hooks/useOneSignal';

interface NotificationPermissionProps {
  onSuccess: (playerId: string) => void;
}

export default function NotificationPermission({ onSuccess }: NotificationPermissionProps) {
  const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || '';

  const {
    isInitialized,
    isSubscribed,
    error,
    loading,
    playerId,
    enableNotifications,
  } = useOneSignal({
    appId,
    onAlreadySubscribed: (id) => {
      onSuccess(id);
    },
  });

  // 通知許可成功時にPlayer IDを取得してコールバック
  const handleEnable = async () => {
    const id = await enableNotifications();
    if (id) {
      onSuccess(id);
    }
  };

  // すでに購読済みの場合の処理
  useEffect(() => {
    if (isSubscribed && playerId) {
      onSuccess(playerId);
    }
  }, [isSubscribed, playerId, onSuccess]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            ② プッシュ通知を許可してください
          </h2>
          <p className="text-gray-600 mb-4">
            日本語学習のコツや、新しい教材の更新情報をプッシュ通知でお届けします。
          </p>
          <p className="text-sm text-gray-500">
            あと 1 回、通知を許可するだけで完了です。
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {!isInitialized ? (
          <div className="text-center text-gray-600 py-4">初期化中...</div>
        ) : isSubscribed ? (
          <div className="text-center">
            <p className="text-green-700 font-semibold mb-4">✓ 通知が有効になりました</p>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={handleEnable}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? '処理中...' : '🔔 通知を許可する'}
            </button>
            <p className="text-xs text-center text-gray-500">
              このボタンをタップすると、ブラウザの通知許可ダイアログが表示されます。
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
