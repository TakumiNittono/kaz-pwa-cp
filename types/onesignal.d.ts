// OneSignal Web SDK の型定義
declare global {
  interface Window {
    OneSignal: typeof OneSignal;
  }
}

export interface OneSignalOptions {
  appId: string;
  allowLocalhostAsSecureOrigin?: boolean;
  autoRegister?: boolean;
  promptOptions?: {
    slidedown?: {
      enabled?: boolean;
    };
  };
}

export interface OneSignalUser {
  Push: {
    enable(): Promise<void>;
    isEnabled(): Promise<boolean>;
  };
  getId(): Promise<string | null>;
}

export interface OneSignalSDK {
  init(options: OneSignalOptions): Promise<void>;
  User: OneSignalUser;
  initialized: boolean;
}

declare const OneSignal: OneSignalSDK;

export {};

