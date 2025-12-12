// HetaoLog Service Worker
// 版本号：更新内容时修改此版本号
const CACHE_VERSION = 'hetalog-v1.0.0'
const CACHE_NAME = `hetalog-cache-${CACHE_VERSION}`

// 需要缓存的静态资源
const STATIC_CACHE_URLS = [
  '/',
  '/manifest.webmanifest',
  '/icon-192.png',
  '/icon-512.png',
]

// 安装事件：缓存静态资源
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...', CACHE_VERSION)
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets')
      return cache.addAll(STATIC_CACHE_URLS)
    }).then(() => {
      // 强制激活新的Service Worker
      return self.skipWaiting()
    })
  )
})

// 激活事件：清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...', CACHE_VERSION)
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      // 立即控制所有客户端
      return self.clients.claim()
    })
  )
})

// 拦截请求：网络优先策略（确保数据最新）
self.addEventListener('fetch', (event) => {
  const { request } = event
  
  // 跳过非GET请求
  if (request.method !== 'GET') {
    return
  }
  
  // 跳过Chrome扩展请求
  if (request.url.startsWith('chrome-extension://')) {
    return
  }
  
  event.respondWith(
    // 网络优先策略：先尝试网络请求，失败后使用缓存
    fetch(request)
      .then((response) => {
        // 如果是成功的响应，更新缓存
        if (response && response.status === 200) {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone)
          })
        }
        return response
      })
      .catch(() => {
        // 网络失败，尝试从缓存获取
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('[SW] Serving from cache:', request.url)
            return cachedResponse
          }
          // 如果缓存也没有，返回离线页面
          return new Response('离线模式：网络连接失败', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain; charset=utf-8',
            }),
          })
        })
      })
  )
})

// 监听消息（用于手动触发更新等）
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

console.log('[SW] Service Worker loaded:', CACHE_VERSION)

