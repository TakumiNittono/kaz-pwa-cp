'use client';

import { useState, useEffect } from 'react';
import NotificationPermission from '@/components/NotificationPermission';

type Step = 1 | 2 | 3;

export default function Home() {
  const [step, setStep] = useState<Step>(1);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [playerId, setPlayerId] = useState<string | null>(null);

  const lpUrl = process.env.NEXT_PUBLIC_JP_LEARNING_LP_URL || '';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // デバイス判定
      const userAgent = navigator.userAgent.toLowerCase();
      const iOS = /iphone|ipad|ipod/.test(userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const android = /android/.test(userAgent);

      setIsIOS(iOS);
      setIsAndroid(android);

      // PWAとしてインストール済みかチェック
      const standalone = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');

      setIsStandalone(standalone);

      // PWAとして起動している場合は自動的にSTEP 2へ
      if (standalone) {
        setStep(2);
      }
    }
  }, []);

  // STEP 2完了時のコールバック
  const handleNotificationSuccess = (id: string) => {
    setPlayerId(id);
    setStep(3);
  };

  // STEP 3: LPへの遷移
  const handleGoToLP = () => {
    if (lpUrl) {
      window.location.href = lpUrl;
    } else {
      console.error('LP URLが設定されていません');
    }
  };

  // STEP 1: ホーム画面に追加してもらう画面
  if (step === 1) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                ① ホーム画面に追加してください
              </h1>
              <p className="text-gray-600 text-lg">
                このサイトをスマホのホーム画面に追加して、アプリとして使用してください
              </p>
            </div>

            <div className="space-y-6 mb-8">
              {isIOS ? (
                // iPhone (Safari) の手順
                <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">📱</span>
                    iPhone (Safari) の場合
                  </h2>
                  <ol className="space-y-4 text-left">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                      <div>
                        <p className="font-semibold text-gray-800">画面下の「共有」アイコン（□に↑）をタップ</p>
                        <p className="text-sm text-gray-600 mt-1">Safariブラウザの画面下部中央にある共有ボタンをタップしてください</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                      <div>
                        <p className="font-semibold text-gray-800">「ホーム画面に追加」を選ぶ</p>
                        <p className="text-sm text-gray-600 mt-1">共有メニューの中から「ホーム画面に追加」を選択してください</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                      <div>
                        <p className="font-semibold text-gray-800">「追加」を押す</p>
                        <p className="text-sm text-gray-600 mt-1">確認画面が表示されたら、右上の「追加」ボタンをタップしてください</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
                      <div>
                        <p className="font-semibold text-gray-800">ホーム画面からこのアプリを開いてください</p>
                        <p className="text-sm text-gray-600 mt-1">ホーム画面に追加されたアプリアイコンをタップして起動してください</p>
                      </div>
                    </li>
                  </ol>
                </div>
              ) : isAndroid ? (
                // Android (Chrome) の手順
                <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🤖</span>
                    Android (Chrome) の場合
                  </h2>
                  <ol className="space-y-4 text-left">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                      <div>
                        <p className="font-semibold text-gray-800">右上の「︙」メニューをタップ</p>
                        <p className="text-sm text-gray-600 mt-1">Chromeブラウザの右上にあるメニューボタンをタップしてください</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                      <div>
                        <p className="font-semibold text-gray-800">「ホーム画面に追加」または「インストール」を選ぶ</p>
                        <p className="text-sm text-gray-600 mt-1">メニューの中から「ホーム画面に追加」または「インストール」を選択してください</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                      <div>
                        <p className="font-semibold text-gray-800">指示に従って追加</p>
                        <p className="text-sm text-gray-600 mt-1">確認画面が表示されたら、指示に従って追加を完了してください</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
                      <div>
                        <p className="font-semibold text-gray-800">ホーム画面からこのアプリを開いてください</p>
                        <p className="text-sm text-gray-600 mt-1">ホーム画面に追加されたアプリアイコンをタップして起動してください</p>
                      </div>
                    </li>
                  </ol>
                </div>
              ) : (
                // PC/その他のデバイスの場合
                <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    💻 PC/その他のデバイスの場合
                  </h2>
                  <p className="text-gray-700">
                    このアプリはスマートフォン向けに最適化されています。スマートフォンからアクセスしてください。
                  </p>
                </div>
              )}
            </div>

            {/* 「すでにホーム画面に追加した」ボタン */}
            <div className="text-center">
              <button
                onClick={() => setStep(2)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-8 rounded-xl transition-colors"
              >
                すでにホーム画面に追加した
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // STEP 2: 通知を許可させる画面
  if (step === 2) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <NotificationPermission onSuccess={handleNotificationSuccess} />
      </main>
    );
  }

  // STEP 3: Success! ボタンと LP への遷移画面
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-md w-full text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          ③ 登録が完了しました！
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          準備が整いました。下のボタンから日本語学習ページへ進んでください。
        </p>
        {playerId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-xs text-gray-500 mb-1">Player ID:</p>
            <p className="text-sm font-mono break-all text-gray-700">{playerId}</p>
          </div>
        )}
        <button
          onClick={handleGoToLP}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg transition-all transform hover:scale-105"
        >
          Success! 学習ページへ進む
        </button>
      </div>
    </main>
  );
}

