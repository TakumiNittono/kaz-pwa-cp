'use client';

import { useEffect, useState } from 'react';
import OneSignal from 'react-onesignal';

interface PushButtonProps {
  appId: string;
}

export default function PushButton({ appId }: PushButtonProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // OneSignal初期化
    const initOneSignal = async () => {
      try {
        OneSignal.initialize(appId, {
          allowLocalhostAsSecureOrigin: true,
          notificationClickHandlerMatch: 'origin',
          notificationClickHandlerAction: 'navigate',
        });

        setIsInitialized(true);

        // 少し待ってから状態を取得
        setTimeout(async () => {
          try {
            // 現在の購読状態を取得
            const subscription = await OneSignal.isPushNotificationsEnabled();
            setIsSubscribed(subscription);

            // Player IDを取得
            if (subscription) {
              const userId = await OneSignal.getPlayerId();
              if (userId) {
                setPlayerId(userId);
              }
            }
          } catch (err) {
            console.error('状態取得エラー:', err);
          }
        }, 1000);
      } catch (err) {
        console.error('OneSignal初期化エラー:', err);
        setError('OneSignalの初期化に失敗しました');
      }
    };

    if (appId) {
      initOneSignal();
    }
  }, [appId]);

  const handleSubscribe = async () => {
    if (!isInitialized) {
      setError('OneSignalが初期化されていません');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 通知許可をリクエスト
      await OneSignal.registerForPushNotifications();

      // 少し待ってから状態を更新
      setTimeout(async () => {
        try {
          // 購読状態を更新
          const subscription = await OneSignal.isPushNotificationsEnabled();
          setIsSubscribed(subscription);

          // Player IDを取得
          if (subscription) {
            const userId = await OneSignal.getPlayerId();
            if (userId) {
              setPlayerId(userId);
            }
          }
        } catch (err) {
          console.error('状態更新エラー:', err);
        }
      }, 500);
    } catch (err) {
      console.error('通知登録エラー:', err);
      setError('通知の登録に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!isInitialized) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await OneSignal.setSubscription(false);
      setIsSubscribed(false);
      setPlayerId(null);
    } catch (err) {
      console.error('通知解除エラー:', err);
      setError('通知の解除に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  if (!appId) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <p className="text-yellow-800">
          OneSignal App IDが設定されていません。環境変数 NEXT_PUBLIC_ONESIGNAL_APP_ID
          を設定してください。
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Push通知設定
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              通知状態
            </h2>
            <p className="text-gray-600">
              <span className="font-medium">状態:</span>{' '}
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  isSubscribed
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {isSubscribed ? 'Subscribed' : 'Not Subscribed'}
              </span>
            </p>
          </div>

          {playerId && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Player ID (OneSignal ID)
              </h2>
              <p className="text-gray-600 break-all font-mono text-sm">
                {playerId}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            {!isSubscribed ? (
              <button
                onClick={handleSubscribe}
                disabled={isLoading || !isInitialized}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
              >
                {isLoading ? '処理中...' : 'Push通知を許可'}
              </button>
            ) : (
              <button
                onClick={handleUnsubscribe}
                disabled={isLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
              >
                {isLoading ? '処理中...' : '通知を解除'}
              </button>
            )}
          </div>

          {!isInitialized && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                OneSignalを初期化中...
              </p>
            </div>
          )}
        </div>

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
  );
}

