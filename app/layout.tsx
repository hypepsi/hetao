import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
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
    statusBarStyle: "black-translucent",
    title: "核桃",
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
    <html lang="zh-CN">
      <body className={`${inter.className} bg-[#FFF5F5]`}>
        <RegisterSW />
        <SWRProvider>
          <div className="max-w-[430px] mx-auto min-h-screen border-x border-rose-100 shadow-2xl bg-white/90 backdrop-blur-sm">
            {children}
          </div>
        </SWRProvider>
        <Toaster />
      </body>
    </html>
  )
}
