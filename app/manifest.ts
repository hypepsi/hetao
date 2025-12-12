import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '核桃日记',
    short_name: '核桃日记',
    description: '宝宝喂养记录',
    start_url: '/',
    // ⭐ standalone 模式：像原生APP一样，没有浏览器地址栏
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    orientation: 'portrait',
    scope: '/',
    // APP图标配置
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  }
}

