'use client';

import { useEffect, useState } from 'react';
import OneSignal from 'react-onesignal';

interface PushButtonProps {
  appId: string;
  // 通知許可をリクエストするタイミングを制御するオプション
  requestTiming?: 'button-click' | 'delayed' | 'scroll' | 'custom';
  delayMs?: number; // delayed の場合の遅延時間（ミリ秒）
  onRequestPermission?: () => void; // カスタムタイミング用のコールバック
  onSubscribeSuccess?: (playerId: string) => void; // 通知許可成功時のコールバック
  redirectUrl?: string; // 通知許可後のリダイレクト先URL
}

export default function PushButton({ 
  appId, 
  requestTiming = 'button-click',
  delayMs = 3000,
  onRequestPermission,
  onSubscribeSuccess,
  redirectUrl
}: PushButtonProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    // OneSignal初期化
    const initOneSignal = async () => {
      try {
        OneSignal.initialize(appId, {
          allowLocalhostAsSecureOrigin: true,
          notificationClickHandlerMatch: 'origin',
          notificationClickHandlerAction: 'navigate',
          autoRegister: true, // Push Primerを自動表示
        });

        setIsInitialized(true);

        // 少し待ってから状態を取得とPush Primerを表示
        setTimeout(async () => {
          try {
            // 現在の購読状態を取得
            const subscription = await OneSignal.isPushNotificationsEnabled();
            setIsSubscribed(subscription);

            // まだ購読していない場合、Push Primerを表示
            if (!subscription) {
              try {
                // OneSignalのネイティブAPIからPush Primerを表示
                // window.OneSignalはreact-onesignalが初期化後に利用可能
                const oneSignalNative = (window as any).OneSignal;
                if (oneSignalNative && typeof oneSignalNative.showSlidedownPrompt === 'function') {
                  await oneSignalNative.showSlidedownPrompt();
                  console.log('Push Primerを表示しました');
                } else {
                  // フォールバック: autoRegisterがtrueなら自動的に表示される
                  console.log('Push Primerは自動表示されます（autoRegister: true）');
                }
              } catch (promptErr) {
                console.log('Push Primer表示エラー（無視可能）:', promptErr);
              }
            }

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
        }, 2000); // Push Primerを表示するために少し長めに待つ
      } catch (err) {
        console.error('OneSignal初期化エラー:', err);
        setError('OneSignalの初期化に失敗しました');
      }
    };

    if (appId) {
      initOneSignal();
    }
  }, [appId]);

  // スクロール検知（scroll タイミングの場合）
  useEffect(() => {
    if (requestTiming === 'scroll' && typeof window !== 'undefined') {
      const handleScroll = () => {
        if (window.scrollY > 200 && !hasScrolled) {
          setHasScrolled(true);
          // スクロール後に通知許可をリクエスト
          handleSubscribe();
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [requestTiming, hasScrolled]);

  // 遅延タイミング（delayed の場合）
  useEffect(() => {
    if (requestTiming === 'delayed' && isInitialized && !isSubscribed) {
      const timer = setTimeout(() => {
        handleSubscribe();
      }, delayMs);

      return () => clearTimeout(timer);
    }
  }, [requestTiming, isInitialized, isSubscribed, delayMs]);

  // カスタムタイミング（外部から呼び出し可能）
  useEffect(() => {
    if (requestTiming === 'custom' && onRequestPermission) {
      // 外部から制御可能にする
      // 使用例: 親コンポーネントから onRequestPermission() を呼び出す
    }
  }, [requestTiming, onRequestPermission]);

  const handleSubscribe = async () => {
    if (!isInitialized) {
      setError('OneSignalが初期化されていません');
      return;
    }

    // 既に購読済みの場合は何もしない
    if (isSubscribed) {
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
              
              // 通知許可成功時のコールバックを実行
              if (onSubscribeSuccess) {
                onSubscribeSuccess(userId);
              }
              
              // リダイレクト先が指定されている場合は遷移
              if (redirectUrl) {
                setTimeout(() => {
                  // Player IDをURLパラメータとして渡す
                  const url = redirectUrl.includes('?') 
                    ? `${redirectUrl}&playerId=${userId}`
                    : `${redirectUrl}?playerId=${userId}`;
                  window.location.href = url;
                }, 1000); // 1秒待ってから遷移（ユーザーに成功メッセージを見せるため）
              }
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
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            プッシュ通知を有効にする
          </h2>
          <p className="text-gray-600 text-sm">
            最新情報をリアルタイムで受け取れます
          </p>
          {requestTiming === 'delayed' && !isSubscribed && (
            <p className="text-xs text-gray-500 mt-2">
              {Math.ceil(delayMs / 1000)}秒後に自動的に通知許可をリクエストします
            </p>
          )}
          {requestTiming === 'scroll' && !hasScrolled && (
            <p className="text-xs text-gray-500 mt-2">
              ページをスクロールすると通知許可をリクエストします
            </p>
          )}
        </div>

        {!isInitialized ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-blue-800 text-sm">初期化中...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {isSubscribed ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <p className="text-green-800 font-semibold mb-2">✓ 通知が有効になっています</p>
                  {playerId && (
                    <p className="text-green-700 text-xs font-mono break-all">
                      ID: {playerId}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleUnsubscribe}
                  disabled={isLoading}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
                >
                  {isLoading ? '処理中...' : '通知を無効にする'}
                </button>
              </div>
            ) : (
              <>
                {requestTiming === 'button-click' && (
                  <button
                    onClick={handleSubscribe}
                    disabled={isLoading || !isInitialized}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed text-lg"
                  >
                    {isLoading ? '処理中...' : '🔔 通知を許可する'}
                  </button>
                )}
                {requestTiming === 'delayed' && isLoading && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <p className="text-blue-800 text-sm">通知許可をリクエスト中...</p>
                  </div>
                )}
                {requestTiming === 'scroll' && !hasScrolled && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <p className="text-blue-800 text-sm">ページをスクロールしてください</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
