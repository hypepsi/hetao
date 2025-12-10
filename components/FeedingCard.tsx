"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDuration } from '@/lib/date-utils'
import Link from 'next/link'
import { Droplet, History } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface FeedingCardProps {
  feedingData: any
  onClick: () => void
}

export function FeedingCard({ feedingData, onClick }: FeedingCardProps) {
  const [feedingTime, setFeedingTime] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  // 客户端强制校准：组件挂载后立即计算时间
  useEffect(() => {
    setIsClient(true)
    
    const updateFeedingTime = () => {
      if (feedingData?.lastFeeding) {
        const lastFeeding = feedingData.lastFeeding
        const lastTime = lastFeeding.endTime 
          ? new Date(lastFeeding.endTime) 
          : new Date(lastFeeding.startTime)
        const now = new Date()
        
        // 如果时间在未来，显示"刚刚"
        if (lastTime > now) {
          setFeedingTime('刚刚')
          return
        }
        
        const duration = formatDuration(lastTime, now)
        if (!lastFeeding.endTime) {
          setFeedingTime('喂奶计时中...')
        } else {
          setFeedingTime(duration)
        }
      } else {
        setFeedingTime('暂无记录')
      }
    }

    // 立即执行一次
    updateFeedingTime()
    
    // 每分钟更新
    const interval = setInterval(updateFeedingTime, 60000)
    return () => clearInterval(interval)
  }, [feedingData])

  // 显示骨架屏直到客户端准备好
  if (!isClient || feedingTime === null) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm shadow-md rounded-3xl border-rose-100">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-2xl" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-10 w-48" />
            <div className="flex items-center gap-4 pt-2 border-t border-rose-100">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card 
      className="bg-white/90 backdrop-blur-sm shadow-md cursor-pointer hover:shadow-lg transition-shadow active:scale-[0.98] rounded-3xl border-rose-100"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 rounded-2xl">
              <Droplet className="h-6 w-6 text-rose-500" />
            </div>
            <CardTitle className="text-xl font-bold text-stone-700">喂奶</CardTitle>
          </div>
          <Link 
            href="/history/feeding" 
            className="text-xs text-stone-400 hover:text-rose-500 flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <History className="h-3 w-3" />
            历史
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <p className="text-xs text-stone-400 mb-1">距离上次喂奶</p>
            <p className="text-3xl font-bold text-rose-900">{feedingTime}</p>
          </div>
          {feedingData && (
            <div className="flex items-center gap-4 pt-2 border-t border-rose-100">
              <div>
                <span className="text-xs text-stone-400">今日</span>
                <span className="text-lg font-semibold text-stone-700 ml-1">
                  {feedingData.todayCount} 次
                </span>
              </div>
              <div>
                <span className="text-xs text-stone-400">累计</span>
                <span className="text-lg font-semibold text-stone-700 ml-1">
                  {feedingData.todayTotalAmount} ml
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}






