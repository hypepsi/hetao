import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "./pwa-fix.css"
import { Toaster } from "@/components/ui/toaster"
import { SWRProvider } from "@/components/SWRProvider"
import { RegisterSW } from "./register-sw"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "核桃日记",
  description: "宝宝喂养记录",
  manifest: "/manifest.webmanifest",
  // iOS Safari PWA配置
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "核桃日记",
  },
  // 格式化为APP
  applicationName: "核桃日记",
  // Android Chrome PWA配置
  other: {
    'mobile-web-app-capable': 'yes',
  },
  // Apple Touch Icon
  icons: {
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover', // iOS刘海屏适配
  themeColor: '#ffffff', // PWA主题色（白色，与页面一体）
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" style={{ margin: 0, padding: 0, backgroundColor: '#ffffff' }}>
      <head>
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body 
        className={`${inter.className}`} 
        style={{ 
          margin: 0, 
          padding: 0, 
          backgroundColor: '#ffffff',
          borderTop: 'none',
          boxShadow: 'none'
        }}
      >
        <RegisterSW />
        <SWRProvider>
          <div 
            className="max-w-[430px] mx-auto min-h-screen"
            style={{
              backgroundColor: '#ffffff',
              marginTop: 0,
              paddingTop: 0,
              borderTop: 'none',
              boxShadow: 'none'
            }}
          >
            {children}
          </div>
        </SWRProvider>
        <Toaster />
      </body>
    </html>
  )
}
