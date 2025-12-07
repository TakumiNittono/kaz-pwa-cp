// react-onesignal の型定義
declare module 'react-onesignal' {
  interface OneSignalInitOptions {
    appId: string;
    allowLocalhostAsSecureOrigin?: boolean;
    autoRegister?: boolean;
    promptOptions?: {
      slidedown?: {
        enabled?: boolean;
      };
    };
  }

  interface OneSignalUserPush {
    isEnabled(): Promise<boolean>;
    enable(): Promise<void>;
    disable(): Promise<void>;
  }

  interface OneSignalUser {
    Push: OneSignalUserPush;
    getId(): Promise<string | null>;
  }

  interface OneSignal {
    init(options: OneSignalInitOptions): Promise<void>;
    User: OneSignalUser;
    // 旧API（後方互換性のため）
    initialize?(appId: string, options?: any): void;
    isPushNotificationsEnabled?(): Promise<boolean>;
    registerForPushNotifications?(): Promise<any>;
    getNotificationPermission?(): Promise<string>;
    isPushNotificationsSupported?(): boolean;
    setSubscription?(unmute: boolean): Promise<any>;
    getPlayerId?(): Promise<string>;
    getUserId?(): Promise<string>;
    showSlidedownPrompt?(options?: any): Promise<void>;
    initialized?: boolean;
    notificationPermission?: string[];
  }

  const OneSignal: OneSignal;
  export default OneSignal;
}

