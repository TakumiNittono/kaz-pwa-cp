/**
 * デバイス判定ユーティリティ
 */

export interface DeviceInfo {
  isIOS: boolean;
  isAndroid: boolean;
  isStandalone: boolean;
}

/**
 * デバイス情報を取得
 */
export function getDeviceInfo(): DeviceInfo {
  if (typeof window === 'undefined') {
    return {
      isIOS: false,
      isAndroid: false,
      isStandalone: false,
    };
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const isIOS = 
    /iphone|ipad|ipod/.test(userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /android/.test(userAgent);
  
  const isStandalone = 
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://');

  return {
    isIOS,
    isAndroid,
    isStandalone,
  };
}

