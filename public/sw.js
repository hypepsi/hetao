// HetaoLog Service Worker - 简化版
const CACHE_NAME = 'hetalog-v1'

// 安装事件
self.addEventListener('install', (event) => {
  console.log('[SW] Install')
  self.skipWaiting()
})

// 激活事件
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate')
  event.waitUntil(self.clients.claim())
})

// 拦截请求：仅记录，不缓存（避免复杂问题）
self.addEventListener('fetch', (event) => {
  // 直接放行所有请求
  return
})

console.log('[SW] Service Worker ready')
