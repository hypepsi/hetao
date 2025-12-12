"use client"

import { useEffect } from 'react'

export function RegisterSW() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('✅ Service Worker registered:', registration.scope)
            
            // 检查更新
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    console.log('🔄 New Service Worker available, will update on next visit')
                  }
                })
              }
            })
          })
          .catch((error) => {
            console.log('❌ Service Worker registration failed:', error)
          })
      })
    }
    
    // 小米MIUI PWA恢复修复
    const fixMIUIStatusBar = () => {
      if (document.visibilityState === 'visible') {
        // 立即执行
        window.scrollTo(0, 0)
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
        
        // 强制刷新viewport
        let viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement
        if (viewport) {
          const content = viewport.content
          viewport.content = 'width=1'
          setTimeout(() => {
            viewport.content = content
          }, 1)
        }
        
        // 强制重绘
        document.body.style.display = 'none'
        document.body.offsetHeight // 触发reflow
        document.body.style.display = ''
      }
    }
    
    // 监听多个恢复事件
    document.addEventListener('visibilitychange', fixMIUIStatusBar)
    window.addEventListener('pageshow', fixMIUIStatusBar)
    window.addEventListener('focus', fixMIUIStatusBar)
    
    return () => {
      document.removeEventListener('visibilitychange', fixMIUIStatusBar)
      window.removeEventListener('pageshow', fixMIUIStatusBar)
      window.removeEventListener('focus', fixMIUIStatusBar)
    }
  }, [])

  return null
}

