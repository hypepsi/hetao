import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '小核桃成长记录',
    short_name: '核桃日记',
    description: '极简宝宝喂养记录工具 - 专为新手父母设计',
    start_url: '/',
    // ⭐ standalone 模式：像原生APP一样，没有浏览器地址栏
    display: 'standalone',
    background_color: '#fff1f2',
    theme_color: '#f43f5e',
    orientation: 'portrait',
    scope: '/',
    // APP图标配置
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    // iOS 启动画面
    screenshots: [],
    // 类别
    categories: ['health', 'lifestyle'],
  }
}

