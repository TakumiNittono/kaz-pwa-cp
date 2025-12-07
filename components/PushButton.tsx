'use client';

import { useEffect, useState } from 'react';
import OneSignal from 'react-onesignal';

interface PushButtonProps {
  appId: string;
  redirectUrl?: string;
}

export default function PushButton({ appId, redirectUrl }: PushButtonProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ------------------------------------------------------
  // OneSignal 初期化（Primer を完全 OFF）
  // ------------------------------------------------------
  useEffect(() => {
    if (!appId) return;

    const init = async () => {
      try {
        // react-onesignalの実際のAPIを使用
        OneSignal.initialize(appId, {
          allowLocalhostAsSecureOrigin: true,
          autoRegister: false, // Push Primerを完全にOFF
        });

        setIsInitialized(true);

        // 少し待ってから初期購読状態を取得
        setTimeout(async () => {
          try {
            const enabled = await OneSignal.isPushNotificationsEnabled();
            setIsSubscribed(enabled);

            if (enabled) {
              const id = await OneSignal.getPlayerId();
              if (id) setPlayerId(id);
            }
          } catch (err) {
            console.error('状態取得エラー:', err);
          }
        }, 1000);
      } catch (err) {
        console.error('OneSignal init error:', err);
        setError('OneSignal初期化に失敗しました');
      }
    };

    init();
  }, [appId]);

  // ------------------------------------------------------
  // 通知許可ボタン
  // ------------------------------------------------------
  const handleSubscribe = async () => {
    if (!isInitialized) return;

    setLoading(true);
    setError(null);

    try {
      // react-onesignalの実際のAPIを使用
      await OneSignal.registerForPushNotifications();

      // 許可されたか確認（複数回チェック）
      const checkEnabled = async (attempts = 0, maxAttempts = 10) => {
        if (attempts >= maxAttempts) {
          setLoading(false);
          setError("通知許可の確認に時間がかかりすぎています");
          return;
        }

        try {
          const enabled = await OneSignal.isPushNotificationsEnabled();
          
          if (enabled) {
            setIsSubscribed(true);
            setLoading(false);

            // Player IDを取得
            const id = await OneSignal.getPlayerId();
            console.log("Player ID:", id);

            if (id) {
              setPlayerId(id);

              // リダイレクト指定がある場合
              if (redirectUrl) {
                const url = redirectUrl.includes("?")
                  ? `${redirectUrl}&playerId=${id}`
                  : `${redirectUrl}?playerId=${id}`;
                window.location.href = url;
              }
            }
          } else {
            // まだ許可されていない場合、少し待ってから再チェック
            setTimeout(() => checkEnabled(attempts + 1, maxAttempts), 500);
          }
        } catch (err) {
          console.error("状態確認エラー:", err);
          setTimeout(() => checkEnabled(attempts + 1, maxAttempts), 500);
        }
      };

      // 少し待ってから初回チェックを開始
      setTimeout(() => {
        checkEnabled();
      }, 500);
    } catch (e) {
      console.error("Enable error:", e);
      setError("通知の許可に失敗しました");
      setLoading(false);
    }
  };

  // ------------------------------------------------------
  // 通知解除
  // ------------------------------------------------------
  const handleUnsubscribe = async () => {
    try {
      await OneSignal.setSubscription(false);
      setIsSubscribed(false);
      setPlayerId(null);
    } catch (err) {
      console.error("Disable error:", err);
      setError("通知解除に失敗しました");
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-300 p-4 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h2 className="text-lg font-bold text-center mb-4">プッシュ通知設定</h2>

        {!isInitialized ? (
          <div className="text-center text-gray-600">初期化中...</div>
        ) : isSubscribed ? (
          <div className="text-center space-y-4">
            <p className="text-green-700 font-semibold">✓ 通知が有効です</p>
            {playerId && (
              <p className="text-xs font-mono break-all text-green-600">
                ID: {playerId}
              </p>
            )}
            <button
              onClick={handleUnsubscribe}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded"
            >
              通知を無効にする
            </button>
          </div>
        ) : (
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-lg"
          >
            {loading ? "処理中..." : "🔔 通知を許可する"}
          </button>
        )}
      </div>
    </div>
  );
}
