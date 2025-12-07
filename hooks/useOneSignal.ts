import { useEffect, useState } from 'react';

interface UseOneSignalOptions {
  appId: string;
  onInitialized?: () => void;
  onAlreadySubscribed?: (playerId: string) => void;
}

interface UseOneSignalReturn {
  isInitialized: boolean;
  isSubscribed: boolean;
  error: string | null;
  loading: boolean;
  playerId: string | null;
  enableNotifications: () => Promise<string | null>;
}

const ONESIGNAL_SDK_URL = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
const MAX_INIT_ATTEMPTS = 20;
const INIT_CHECK_INTERVAL = 500;
const MAX_ENABLE_CHECK_ATTEMPTS = 10;
const ENABLE_CHECK_INTERVAL = 500;

/**
 * OneSignal SDKの初期化と通知許可管理のカスタムフック
 */
export function useOneSignal({
  appId,
  onInitialized,
  onAlreadySubscribed,
}: UseOneSignalOptions): UseOneSignalReturn {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [playerId, setPlayerId] = useState<string | null>(null);

  // OneSignal SDKが読み込まれているかチェック
  const checkOneSignalLoaded = (): boolean => {
    return typeof window !== 'undefined' && !!window.OneSignal;
  };

  // OneSignal初期化
  const initializeOneSignal = async () => {
    if (!checkOneSignalLoaded()) {
      setError('OneSignal SDKの読み込みに失敗しました');
      return;
    }

    try {
      await window.OneSignal.init({
        appId,
        allowLocalhostAsSecureOrigin: true,
        autoRegister: false,
        promptOptions: {
          slidedown: { enabled: false }, // Push Primer 完全 OFF
        },
      });

      setIsInitialized(true);
      onInitialized?.();

      // すでに通知が有効かチェック
      try {
        const enabled = await window.OneSignal.User.Push.isEnabled();
        if (enabled) {
          setIsSubscribed(true);
          const id = await window.OneSignal.User.getId();
          if (id) {
            setPlayerId(id);
            onAlreadySubscribed?.(id);
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

  // OneSignal SDKの読み込みを待つ
  useEffect(() => {
    if (!appId || typeof window === 'undefined') return;

    // すでに読み込まれている場合
    if (checkOneSignalLoaded()) {
      initializeOneSignal();
      return;
    }

    // SDKが読み込まれるまで待つ
    let attempts = 0;
    const checkInterval = setInterval(() => {
      attempts++;
      if (checkOneSignalLoaded() || attempts >= MAX_INIT_ATTEMPTS) {
        clearInterval(checkInterval);
        if (checkOneSignalLoaded()) {
          initializeOneSignal();
        } else {
          setError('OneSignal SDKの読み込みに失敗しました');
        }
      }
    }, INIT_CHECK_INTERVAL);

    return () => {
      clearInterval(checkInterval);
    };
  }, [appId]);

  // 通知許可を有効化
  const enableNotifications = async (): Promise<string | null> => {
    if (!isInitialized || !checkOneSignalLoaded()) {
      setError('OneSignalが初期化されていません');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      await window.OneSignal.User.Push.enable();

      // 許可されたか確認（複数回チェック）
      return new Promise((resolve) => {
        const checkEnabled = async (attempts = 0) => {
          if (attempts >= MAX_ENABLE_CHECK_ATTEMPTS) {
            setLoading(false);
            setError('通知許可の確認に時間がかかりすぎています');
            resolve(null);
            return;
          }

          try {
            const enabled = await window.OneSignal.User.Push.isEnabled();

            if (enabled) {
              setIsSubscribed(true);
              setLoading(false);
              
              // Player IDを取得
              const id = await window.OneSignal.User.getId();
              if (id) {
                setPlayerId(id);
                resolve(id);
              } else {
                resolve(null);
              }
            } else {
              setTimeout(() => checkEnabled(attempts + 1), ENABLE_CHECK_INTERVAL);
            }
          } catch (err) {
            console.error('状態確認エラー:', err);
            setTimeout(() => checkEnabled(attempts + 1), ENABLE_CHECK_INTERVAL);
          }
        };

        setTimeout(() => checkEnabled(), ENABLE_CHECK_INTERVAL);
      });
    } catch (e: any) {
      console.error('Enable error:', e);
      
      if (e?.message?.includes('denied') || e?.message?.includes('permission')) {
        setError('通知が拒否されました。ブラウザの設定から通知を許可することができます。');
      } else {
        setError('通知の許可に失敗しました');
      }
      setLoading(false);
      return null;
    }
  };

  return {
    isInitialized,
    isSubscribed,
    error,
    loading,
    playerId,
    enableNotifications,
  };
}

