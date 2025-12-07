'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const searchParams = useSearchParams();
  const [playerId, setPlayerId] = useState<string | null>(null);

  useEffect(() => {
    // URLパラメータからPlayer IDを取得
    const id = searchParams.get('playerId');
    if (id) {
      setPlayerId(id);
    }
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              通知が有効になりました！
            </h1>
            <p className="text-gray-600 text-sm">
              これで最新情報をリアルタイムで受け取れます
            </p>
          </div>

          {playerId && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Player ID</p>
              <p className="text-sm font-mono text-gray-700 break-all">
                {playerId}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              ホームに戻る
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-gray-600">読み込み中...</div>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}

