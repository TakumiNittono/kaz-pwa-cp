'use client';

import { useState, useEffect } from 'react';
import PushButton from '@/components/PushButton';

export default function Home() {
  // 環境変数からOneSignal App IDを取得
  const oneSignalAppId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || '';
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // iOSデバイスかどうかを判定
      const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      setIsIOS(iOS);

      // スタンドアロンモード（PWAとしてインストール済み）かどうかを判定
      const standalone = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
      setIsStandalone(standalone);
    }
  }, []);

  // PWAとしてインストール済みの場合は通知許可画面のみ表示
  if (isStandalone) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">無料特典アプリ</h1>
              <p className="text-gray-600">プッシュ通知を有効にして特典を受け取りましょう</p>
            </div>
            <PushButton appId={oneSignalAppId} redirectUrl="/success" />
          </div>
        </div>
      </main>
    );
  }

  // iOSデバイスで、まだインストールされていない場合：インストール方法を説明
  if (isIOS) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        {/* ヒーローセクション */}
        <div className="pt-12 pb-8 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              無料特典アプリ
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              ホーム画面に追加して
            </p>
            <p className="text-xl text-gray-600 font-semibold">
              最新の特典情報を受け取りましょう
            </p>
          </div>
        </div>

        {/* インストール手順セクション */}
        <div className="px-4 pb-12">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  📱 インストール方法
                </h2>
                <p className="text-gray-600">簡単3ステップで完了</p>
              </div>

              <div className="space-y-8">
                {/* ステップ1 */}
                <div className="relative">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg">
                        1
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        共有ボタンをタップ
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        Safariブラウザの画面下部中央にある
                        <span className="inline-block mx-1 px-3 py-1 bg-gray-100 rounded-lg text-sm font-mono border border-gray-300">□↑</span>
                        アイコン（共有ボタン）をタップしてください
                      </p>
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-200">
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                          </div>
                          <span className="text-lg font-semibold text-gray-700">共有</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {!isStandalone && (
                    <div className="hidden md:block absolute left-8 top-16 w-0.5 h-8 bg-gradient-to-b from-blue-500 to-blue-400"></div>
                  )}
                </div>

                {/* ステップ2 */}
                <div className="relative">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg">
                        2
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        「ホーム画面に追加」を選択
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        共有メニューが開いたら、スクロールして
                        <span className="inline-block mx-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg font-semibold border border-blue-300">ホーム画面に追加</span>
                        をタップしてください
                      </p>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="text-lg font-semibold text-blue-700">ホーム画面に追加</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {!isStandalone && (
                    <div className="hidden md:block absolute left-8 top-16 w-0.5 h-8 bg-gradient-to-b from-indigo-500 to-indigo-400"></div>
                  )}
                </div>

                {/* ステップ3 */}
                <div className="relative">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg">
                        ✓
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        完了！アプリを起動
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        確認画面で
                        <span className="inline-block mx-1 px-3 py-1 bg-green-100 text-green-800 rounded-lg font-semibold border border-green-300">追加</span>
                        をタップしたら、ホーム画面に追加されたアプリアイコンをタップして起動してください
                      </p>
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <span className="text-lg font-semibold text-green-700">インストール完了</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 重要なお知らせ */}
              <div className="mt-10 pt-8 border-t-2 border-gray-200">
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-5 border-2 border-yellow-300">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-yellow-900 mb-1">重要</p>
                      <p className="text-sm text-yellow-800 leading-relaxed">
                        Safariブラウザで開いている必要があります。Chromeなどの他のブラウザでは「ホーム画面に追加」が表示されない場合があります。
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 次のステップ */}
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                <p className="text-center text-blue-900 font-bold text-lg">
                  ✨ インストール後は、ホーム画面からアプリを起動して<br className="md:hidden" />プッシュ通知を有効にしてください
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // その他のデバイス（Android、PCなど）の場合：通常の通知許可画面
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">無料特典アプリ</h1>
            <p className="text-gray-600">プッシュ通知を有効にして特典を受け取りましょう</p>
          </div>
          <PushButton appId={oneSignalAppId} redirectUrl="/success" />
        </div>
      </div>
    </main>
  );
}

