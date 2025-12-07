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
      <main className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
        {/* 背景装飾 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-12">
          <div className="w-full max-w-4xl">
            {/* メインコンテンツ */}
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
              {/* ヒーローセクション */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 md:p-12 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
                
                <div className="relative z-10">
                  {/* アイコン */}
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl border-2 border-white/30 animate-pulse">
                    <svg className="w-12 h-12 md:w-16 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>

                  {/* タイトル */}
                  <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                    無料特典アプリ
                  </h1>
                  <p className="text-lg md:text-xl text-blue-100 mb-2">
                    ホーム画面に追加して
                  </p>
                  <p className="text-xl md:text-2xl font-semibold">
                    特別な特典を受け取ろう！
                  </p>
                </div>
              </div>

              {/* 機能説明セクション */}
              <div className="p-8 md:p-12">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">プッシュ通知</h3>
                    <p className="text-sm text-gray-600">最新情報をリアルタイムで受け取れます</p>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">無料特典</h3>
                    <p className="text-sm text-gray-600">限定の特典を毎日受け取れます</p>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">安全・安心</h3>
                    <p className="text-sm text-gray-600">セキュアな環境でご利用いただけます</p>
                  </div>
                </div>

                {/* CTAボタン */}
                <div className="space-y-4">
                  {deferredPrompt ? (
                    <button
                      onClick={handleInstallClick}
                      className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold py-5 px-8 rounded-2xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 text-lg md:text-xl relative overflow-hidden group"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        ホーム画面に追加する
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    </button>
                  ) : (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
                      <p className="text-blue-900 font-bold text-lg mb-4 text-center">📱 インストール方法</p>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl p-4 shadow-md">
                          <div className="text-2xl mb-2">🍎</div>
                          <p className="font-semibold text-gray-800 text-sm mb-1">iPhone</p>
                          <p className="text-xs text-gray-600">共有ボタン → 「ホーム画面に追加」</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-md">
                          <div className="text-2xl mb-2">🤖</div>
                          <p className="font-semibold text-gray-800 text-sm mb-1">Android</p>
                          <p className="text-xs text-gray-600">メニュー → 「ホーム画面に追加」</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-md">
                          <div className="text-2xl mb-2">💻</div>
                          <p className="font-semibold text-gray-800 text-sm mb-1">PC</p>
                          <p className="text-xs text-gray-600">アドレスバーのインストールアイコン</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* フッター */}
                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-500">
                    ⚡ インストールは無料です。数秒で完了します。
                  </p>
                </div>
              </div>
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
          <PushButton 
            appId={oneSignalAppId} 
            requestTiming="button-click"
            onSubscribeSuccess={(playerId) => {
              console.log('通知許可成功！Player ID:', playerId);
              // 通知許可成功時の処理（オプション）
            }}
            redirectUrl="/success" // 通知許可後に自動的に成功ページに遷移
          />

          {/* デバッグ用：開発環境でのみ表示 */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => {
                    localStorage.removeItem('pwa-installed');
                    setIsInstalled(false);
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 border border-gray-300 rounded"
                >
                  [デバッグ] インストール状態をリセット
                </button>
                <button
                  onClick={() => {
                    window.location.href = '/success?playerId=test-debug';
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 px-2 py-1 border border-blue-300 rounded"
                >
                  [デバッグ] 成功ページをテスト
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

