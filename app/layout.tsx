import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import OneSignalScript from '@/components/OneSignalScript';
import { APP_CONFIG } from '@/constants';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: APP_CONFIG.TITLE,
  description: APP_CONFIG.DESCRIPTION,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_CONFIG.SHORT_NAME,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#3b82f6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={APP_CONFIG.SHORT_NAME} />
        <OneSignalScript />
      </head>
      <body className={inter.className}>
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}

