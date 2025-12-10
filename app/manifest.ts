import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '核桃日记',
    short_name: '核桃日记',
    description: '小核桃的成长记录',
    start_url: '/',
    display: 'standalone', // 核心：这是隐藏地址栏的关键
    background_color: '#fff1f2',
    theme_color: '#fff1f2',
    orientation: 'portrait',
    // 即使没有 icon.png，也必须声明 icons 才能触发 PWA 安装逻辑
    // 这里我们复用 favicon 临时顶替
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}

