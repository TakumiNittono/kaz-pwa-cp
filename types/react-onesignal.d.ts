// react-onesignal の型定義
declare module 'react-onesignal' {
  interface OneSignalOptions {
    safari_web_id?: string;
    subdomainName?: string;
    allowLocalhostAsSecureOrigin?: boolean;
    requiresUserPrivacyConsent?: boolean;
    persistNotification?: boolean;
    autoResubscribe?: boolean;
    autoRegister?: boolean;
    notificationClickHandlerMatch?: string;
    notificationClickHandlerAction?: string;
    notifyButton?: {
      enable?: boolean;
      size?: 'small' | 'medium' | 'large';
      position?: 'bottom-left' | 'bottom-right';
      showCredit?: boolean;
      prenotify?: boolean;
      theme?: 'default' | 'inverse';
      offset?: {
        bottom?: string;
        right?: string;
        left?: string;
      };
      text?: {
        [key: string]: string;
      };
      colors?: {
        [key: string]: string;
      };
    };
  }

  interface OneSignal {
    initialize(appId: string, options?: OneSignalOptions): void;
    isPushNotificationsEnabled(): Promise<boolean>;
    registerForPushNotifications(): Promise<any>;
    getNotificationPermission(): Promise<string>;
    isPushNotificationsSupported(): boolean;
    setSubscription(unmute: boolean): Promise<any>;
    getPlayerId(): Promise<string>;
    getUserId(): Promise<string>;
    initialized: boolean;
    notificationPermission: string[];
  }

  const OneSignal: OneSignal;
  export default OneSignal;
}

