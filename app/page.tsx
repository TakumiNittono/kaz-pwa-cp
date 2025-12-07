'use client';

import { useState, useEffect } from 'react';
import { getDeviceInfo } from '@/utils/device';
import { STEPS, type Step } from '@/constants';
import Step1InstallGuide from '@/components/Step1InstallGuide';
import NotificationPermission from '@/components/NotificationPermission';
import Step3Success from '@/components/Step3Success';

export default function Home() {
  const [step, setStep] = useState<Step>(STEPS.INSTALL);
  const [deviceInfo, setDeviceInfo] = useState(getDeviceInfo());
  const [playerId, setPlayerId] = useState<string | null>(null);

  const lpUrl = process.env.NEXT_PUBLIC_JP_LEARNING_LP_URL || '';

  useEffect(() => {
    const info = getDeviceInfo();
    setDeviceInfo(info);

    // PWAとして起動している場合は自動的にSTEP 2へ
    if (info.isStandalone) {
      setStep(STEPS.NOTIFICATION);
    }
  }, []);

  const handleNotificationSuccess = (id: string) => {
    setPlayerId(id);
    setStep(STEPS.SUCCESS);
  };

  // STEP 1: ホーム画面に追加してもらう画面
  if (step === STEPS.INSTALL) {
    return <Step1InstallGuide deviceInfo={deviceInfo} onSkip={() => setStep(STEPS.NOTIFICATION)} />;
  }

  // STEP 2: 通知を許可させる画面
  if (step === STEPS.NOTIFICATION) {
    return <NotificationPermission onSuccess={handleNotificationSuccess} />;
  }

  // STEP 3: Success! ボタンと LP への遷移画面
  return <Step3Success playerId={playerId} lpUrl={lpUrl} />;
}
