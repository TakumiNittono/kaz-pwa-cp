'use client';

import { useEffect } from 'react';

export default function OneSignalScript() {
  useEffect(() => {
    // OneSignal SDKを読み込む
    const script = document.createElement('script');
    script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // クリーンアップ
      const existingScript = document.querySelector('script[src*="OneSignalSDK"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return null;
}

