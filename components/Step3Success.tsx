'use client';

interface Step3SuccessProps {
  playerId: string | null;
  lpUrl: string;
}

export default function Step3Success({ playerId, lpUrl }: Step3SuccessProps) {
  const handleGoToLP = () => {
    if (lpUrl) {
      window.location.href = lpUrl;
    } else {
      console.error('LP URLが設定されていません');
    }
  };

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

