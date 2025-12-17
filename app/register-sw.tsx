"use client"

import { useEffect } from 'react'
import { mutate } from 'swr'

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
    
    // PWA恢复处理：修复视觉问题 + 刷新数据
    const handlePWAResume = () => {
      if (document.visibilityState === 'visible') {
        // === 1. 视觉修复（MIUI状态栏等问题）===
        // 立即滚动到顶部
        window.scrollTo(0, 0)
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
        
        // 使用安全的重绘方式（不影响CSS）
        requestAnimationFrame(() => {
          // 强制重新计算样式，但不破坏布局
          const computedStyle = window.getComputedStyle(document.body)
          void computedStyle.transform // 读取一个样式值触发reflow
          
          // 临时添加/移除一个无害的class来触发重绘
          document.body.classList.add('pwa-restore-fix')
          setTimeout(() => {
            document.body.classList.remove('pwa-restore-fix')
          }, 10)
        })
        
        // 刷新viewport（延迟一点避免与重绘冲突）
        setTimeout(() => {
          const viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement
          if (viewport) {
            const content = viewport.content
            viewport.content = 'width=device-width, initial-scale=1.001'
            setTimeout(() => {
              viewport.content = content
            }, 10)
          }
        }, 50)
        
        // === 2. 数据刷新（核心修复）===
        // 主动刷新所有API数据，确保PWA恢复时看到最新数据
        console.log('🔄 PWA resumed - refreshing all data')
        mutate('/api/feeding')          // 喂奶数据
        mutate('/api/feeding/trend')    // 喂奶趋势
        mutate('/api/weight')           // 体重数据
        mutate('/api/excretion?type=大便') // 大便数据
      }
    }
    
    // 监听多个恢复事件
    document.addEventListener('visibilitychange', handlePWAResume)
    window.addEventListener('pageshow', handlePWAResume)
    window.addEventListener('focus', handlePWAResume)
    
    return () => {
      document.removeEventListener('visibilitychange', handlePWAResume)
      window.removeEventListener('pageshow', handlePWAResume)
      window.removeEventListener('focus', handlePWAResume)
    }
  }, [])

  return null
}
