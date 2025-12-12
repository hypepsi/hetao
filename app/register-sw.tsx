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
    
    // 关键修复：监听页面恢复，强制重置滚动和样式
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // PWA从后台恢复时
        setTimeout(() => {
          window.scrollTo(0, 0) // 滚动到顶部
          // 强制重新应用theme-color
          let metaTheme = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement
          if (metaTheme) {
            metaTheme.content = '#ffffff'
          }
        }, 10)
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return null
}

