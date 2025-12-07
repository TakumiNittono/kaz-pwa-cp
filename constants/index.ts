/**
 * アプリケーション定数
 */

export const APP_CONFIG = {
  TITLE: '日本語学習 - プッシュ通知登録',
  DESCRIPTION: '日本語学習のコツや新しい教材の更新情報をプッシュ通知でお届けします',
  SHORT_NAME: '日本語学習',
} as const;

export const STEPS = {
  INSTALL: 1,
  NOTIFICATION: 2,
  SUCCESS: 3,
} as const;

export type Step = typeof STEPS[keyof typeof STEPS];

