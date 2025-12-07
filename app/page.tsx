'use client';

import { useState, useEffect } from 'react';
import PushButton from '@/components/PushButton';

export default function Home() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  // 環境変数からOneSignal App IDを取得
  const oneSignalAppId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || '';

  useEffect(() => {
    // PWAインストール状態の確認
    if (typeof window !== 'undefined') {
      // スタンドアロンモードで実行されているか確認
      const checkInstalled = () => {
        // 複数の方法でPWAインストール状態を確認
        const isStandalone = 
          window.matchMedia('(display-mode: standalone)').matches ||
          (window.navigator as any).standalone === true ||
          document.referrer.includes('android-app://') ||
          window.location.search.includes('pwa=true'); // デバッグ用
        
        // ローカルストレージにも保存（リロード時の判定用）
        if (isStandalone) {
          localStorage.setItem('pwa-installed', 'true');
        }
        
        // ローカルストレージからも確認
        const stored = localStorage.getItem('pwa-installed') === 'true';
        const finalIsInstalled = isStandalone || stored;
        
        console.log('PWAインストール状態:', {
          standalone: window.matchMedia('(display-mode: standalone)').matches,
          navigatorStandalone: (window.navigator as any).standalone,
          referrer: document.referrer,
          stored,
          final: finalIsInstalled
        });
        
        setIsInstalled(finalIsInstalled);
        return finalIsInstalled;
      };

      // 初回チェック
      checkInstalled();

      // beforeinstallpromptイベントをキャッチ（Chrome/Edge用）
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      // インストール完了イベント（appinstalled）
      const handleAppInstalled = () => {
        console.log('PWAがインストールされました');
        localStorage.setItem('pwa-installed', 'true');
        setIsInstalled(true);
      };

      window.addEventListener('appinstalled', handleAppInstalled);

      // オンライン状態の監視
      setIsOnline(navigator.onLine);
      window.addEventListener('online', () => setIsOnline(true));
      window.addEventListener('offline', () => setIsOnline(false));

      // 定期的にインストール状態を確認（ページリロード時など）
      const interval = setInterval(checkInstalled, 500);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
        clearInterval(interval);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Chrome/Edgeのインストールプロンプトを表示
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      
      if (outcome === 'accepted') {
        // インストールが承認されたら、状態を更新
        localStorage.setItem('pwa-installed', 'true');
        setIsInstalled(true);
      }
      
      setDeferredPrompt(null);
    } else {
      // 他のブラウザの場合は手動インストール方法を案内
      alert('ブラウザのメニューから「ホーム画面に追加」または「アプリをインストール」を選択してください。\n\nインストール後、ページをリロードしてください。');
    }
  };

  // PWAがインストールされていない場合：インストールを促す画面
  if (!isInstalled) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                ホーム画面に追加
              </h1>
              <p className="text-gray-600 text-sm">
                このアプリをホーム画面に追加して、より快適にご利用ください
              </p>
            </div>

            <div className="space-y-4">
              {deferredPrompt ? (
                <button
                  onClick={handleInstallClick}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  ホーム画面に追加
                </button>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                  <p className="text-blue-800 text-sm font-semibold mb-2">インストール方法：</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• <strong>iPhone:</strong> 共有ボタン → 「ホーム画面に追加」</li>
                    <li>• <strong>Android:</strong> メニュー → 「ホーム画面に追加」</li>
                    <li>• <strong>PC:</strong> アドレスバーのインストールアイコン</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // PWAがインストールされている場合：通知許可画面
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="w-full max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              アプリがインストールされました！
            </h1>
            <p className="text-gray-600">
              プッシュ通知を有効にして、最新情報を受け取りましょう
            </p>
          </div>

          {/* OneSignal統合エリア */}
          <PushButton appId={oneSignalAppId} requestTiming="button-click" />

          {/* デバッグ用：開発環境でのみ表示 */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  localStorage.removeItem('pwa-installed');
                  setIsInstalled(false);
                }}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                [デバッグ] インストール状態をリセット
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

