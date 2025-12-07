'use client';

import { useEffect, useState } from 'react';

interface NotificationPermissionProps {
  onSuccess: (playerId: string) => void;
}

export default function NotificationPermission({ onSuccess }: NotificationPermissionProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || '';

  // OneSignal初期化
  useEffect(() => {
    if (!appId || typeof window === 'undefined') return;

    const init = async () => {
      try {
        // OneSignal SDKが読み込まれるまで待つ
        const checkOneSignal = () => {
          if (window.OneSignal) {
            return true;
          }
          return false;
        };

        // 最大10秒待つ
        let attempts = 0;
        const maxAttempts = 20;
        const checkInterval = setInterval(() => {
          attempts++;
          if (checkOneSignal() || attempts >= maxAttempts) {
            clearInterval(checkInterval);
            if (checkOneSignal()) {
              initializeOneSignal();
            } else {
              setError('OneSignal SDKの読み込みに失敗しました');
            }
          }
        }, 500);
      } catch (err) {
        console.error('OneSignal init error:', err);
        setError('OneSignal初期化に失敗しました');
      }
    };

    const initializeOneSignal = async () => {
      try {
        await window.OneSignal.init({
          appId: appId,
          allowLocalhostAsSecureOrigin: true,
          autoRegister: false,
          promptOptions: {
            slidedown: { enabled: false }, // Push Primer 完全 OFF
          },
        });

        setIsInitialized(true);

        // すでに通知が有効かチェック
        try {
          const enabled = await window.OneSignal.User.Push.isEnabled();
          if (enabled) {
            setIsSubscribed(true);
            const id = await window.OneSignal.User.getId();
            if (id) {
              onSuccess(id);
            }
          }
        } catch (err) {
          console.error('状態取得エラー:', err);
        }
      } catch (err) {
        console.error('OneSignal初期化エラー:', err);
        setError('OneSignal初期化に失敗しました');
      }
    };

    init();
  }, [appId, onSuccess]);

  // 通知許可ボタン
  const handleEnableNotifications = async () => {
    if (!isInitialized) {
      setError('OneSignalが初期化されていません');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 通知を有効化
      await window.OneSignal.User.Push.enable();

      // 許可されたか確認（複数回チェック）
      const checkEnabled = async (attempts = 0, maxAttempts = 10) => {
        if (attempts >= maxAttempts) {
          setLoading(false);
          setError('通知許可の確認に時間がかかりすぎています');
          return;
        }

        try {
          const enabled = await window.OneSignal.User.Push.isEnabled();

          if (enabled) {
            setIsSubscribed(true);
            setLoading(false);

            const id = await window.OneSignal.User.getId();
            if (id) {
              onSuccess(id);
            } else {
              setError('Player IDの取得に失敗しました');
            }
          } else {
            // まだ許可されていない場合、少し待ってから再チェック
            setTimeout(() => checkEnabled(attempts + 1, maxAttempts), 500);
          }
        } catch (err) {
          console.error('状態確認エラー:', err);
          setTimeout(() => checkEnabled(attempts + 1, maxAttempts), 500);
        }
      };

      // 少し待ってから初回チェックを開始
      setTimeout(() => {
        checkEnabled();
      }, 500);
    } catch (e: any) {
      console.error('Enable error:', e);
      
      // ユーザーが通知を拒否した場合
      if (e?.message?.includes('denied') || e?.message?.includes('permission')) {
        setError('通知が拒否されました。ブラウザの設定から通知を許可することができます。');
      } else {
        setError('通知の許可に失敗しました');
      }
      setLoading(false);
    }
  };

  return (
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
        <div className="text-center text-gray-600 py-4">
          初期化中...
        </div>
      ) : isSubscribed ? (
        <div className="text-center">
          <p className="text-green-700 font-semibold mb-4">
            ✓ 通知が有効になりました
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <button
            onClick={handleEnableNotifications}
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
  );
}

