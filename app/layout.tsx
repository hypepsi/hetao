import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { SWRProvider } from "@/components/SWRProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "小核桃成长记录",
  description: "极简宝宝记录工具",
  manifest: "/manifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "核桃日记",
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#fff1f2',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} bg-[#FFF5F5]`}>
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
