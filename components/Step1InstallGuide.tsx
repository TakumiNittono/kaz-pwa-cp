'use client';

import { DeviceInfo } from '@/utils/device';

interface Step1InstallGuideProps {
  deviceInfo: DeviceInfo;
  onSkip: () => void;
}

export default function Step1InstallGuide({ deviceInfo, onSkip }: Step1InstallGuideProps) {
  const { isIOS, isAndroid } = deviceInfo;

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
              <IOSInstallSteps />
            ) : isAndroid ? (
              <AndroidInstallSteps />
            ) : (
              <OtherDeviceMessage />
            )}
          </div>

          <div className="text-center">
            <button
              onClick={onSkip}
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

function IOSInstallSteps() {
  const steps = [
    {
      number: 1,
      title: '画面下の「共有」アイコン（□に↑）をタップ',
      description: 'Safariブラウザの画面下部中央にある共有ボタンをタップしてください',
    },
    {
      number: 2,
      title: '「ホーム画面に追加」を選ぶ',
      description: '共有メニューの中から「ホーム画面に追加」を選択してください',
    },
    {
      number: 3,
      title: '「追加」を押す',
      description: '確認画面が表示されたら、右上の「追加」ボタンをタップしてください',
    },
    {
      number: 4,
      title: 'ホーム画面からこのアプリを開いてください',
      description: 'ホーム画面に追加されたアプリアイコンをタップして起動してください',
      isLast: true,
    },
  ];

  return (
    <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">📱</span>
        iPhone (Safari) の場合
      </h2>
      <ol className="space-y-4 text-left">
        {steps.map((step) => (
          <li key={step.number} className="flex gap-3">
            <span
              className={`flex-shrink-0 w-8 h-8 ${
                step.isLast ? 'bg-green-600' : 'bg-blue-600'
              } text-white rounded-full flex items-center justify-center font-bold`}
            >
              {step.number}
            </span>
            <div>
              <p className="font-semibold text-gray-800">{step.title}</p>
              <p className="text-sm text-gray-600 mt-1">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function AndroidInstallSteps() {
  const steps = [
    {
      number: 1,
      title: '右上の「︙」メニューをタップ',
      description: 'Chromeブラウザの右上にあるメニューボタンをタップしてください',
    },
    {
      number: 2,
      title: '「ホーム画面に追加」または「インストール」を選ぶ',
      description: 'メニューの中から「ホーム画面に追加」または「インストール」を選択してください',
    },
    {
      number: 3,
      title: '指示に従って追加',
      description: '確認画面が表示されたら、指示に従って追加を完了してください',
    },
    {
      number: 4,
      title: 'ホーム画面からこのアプリを開いてください',
      description: 'ホーム画面に追加されたアプリアイコンをタップして起動してください',
      isLast: true,
    },
  ];

  return (
    <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">🤖</span>
        Android (Chrome) の場合
      </h2>
      <ol className="space-y-4 text-left">
        {steps.map((step) => (
          <li key={step.number} className="flex gap-3">
            <span
              className={`flex-shrink-0 w-8 h-8 ${
                step.isLast ? 'bg-green-600' : 'bg-green-600'
              } text-white rounded-full flex items-center justify-center font-bold`}
            >
              {step.number}
            </span>
            <div>
              <p className="font-semibold text-gray-800">{step.title}</p>
              <p className="text-sm text-gray-600 mt-1">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function OtherDeviceMessage() {
  return (
    <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">💻 PC/その他のデバイスの場合</h2>
      <p className="text-gray-700">
        このアプリはスマートフォン向けに最適化されています。スマートフォンからアクセスしてください。
      </p>
    </div>
  );
}

