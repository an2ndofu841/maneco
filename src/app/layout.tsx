import type { Metadata, Viewport } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import './globals.css'

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'マネコ | AIマネーコンシェルジュ',
  description: '金欠から資産形成まで。お金の「どうしよう？」を0秒で解決するAIコンシェルジュ',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'マネコ',
  },
  openGraph: {
    title: 'マネコ | AIマネーコンシェルジュ',
    description: 'お金の悩みをAIに丸投げ。スキマ時間で稼いで、賢く使う次世代マネーアプリ',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.className} antialiased bg-gray-50`}>
        {children}
      </body>
    </html>
  )
}
