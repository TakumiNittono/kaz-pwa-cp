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
    const init = async () => {
      try {
        await OneSignal.init({
          appId,
          allowLocalhostAsSecureOrigin: true,
          autoRegister: false,
          promptOptions: {
            slidedown: { enabled: false } // ← 英語のやつ完全 OFF
          }
        });

        setIsInitialized(true);

        // 初期購読状態を取得
        const enabled = await OneSignal.User.Push.isEnabled();
        setIsSubscribed(enabled);

        if (enabled) {
          const id = await OneSignal.User.getId();
          if (id) setPlayerId(id);
        }
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
      // Safari 必須：ユーザー操作中に permission を発火
      await OneSignal.User.Push.enable();

      // 許可されたか確認
      const enabled = await OneSignal.User.Push.isEnabled();
      setIsSubscribed(enabled);

      if (enabled) {
        const id = await OneSignal.User.getId();
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
        setError("通知が許可されませんでした");
      }
    } catch (e) {
      console.error("Enable error:", e);
      setError("通知の許可に失敗しました");
    }

    setLoading(false);
  };

  // ------------------------------------------------------
  // 通知解除
  // ------------------------------------------------------
  const handleUnsubscribe = async () => {
    try {
      await OneSignal.User.Push.disable();
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
