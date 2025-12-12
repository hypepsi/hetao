"use client"

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, AlertCircle, History } from 'lucide-react'
import { calculateDailyStats, formatInterval } from '@/lib/feeding-stats-utils'
import Link from 'next/link'

interface DailyFeedingStatsProps {
  feedings: Array<{
    startTime: string
    amount: number
  }>
}

export default function DailyFeedingStats({ feedings }: DailyFeedingStatsProps) {
  const stats = useMemo(() => {
    if (!feedings || feedings.length === 0) {
      return null
    }
    
    // 按时间升序排序
    const sortedFeedings = [...feedings].sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    )
    
    return calculateDailyStats(sortedFeedings)
  }, [feedings])

  // 无数据时不显示
  if (!stats || !stats.hasData) {
    return null
  }

  // 判断是否需要高亮短间隔警告（超过30%）
  const isHighFrequency = stats.shortIntervalPercentage > 30

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-md rounded-3xl border-rose-100">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 rounded-2xl">
              <Activity className="h-6 w-6 text-rose-500" />
            </div>
            <CardTitle className="text-xl font-bold text-stone-700">今日喂养统计</CardTitle>
          </div>
          <Link 
            href="/history/feeding-stats" 
            className="flex items-center gap-1 px-3 py-2 text-xs text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
          >
            <History className="h-4 w-4" />
            历史
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 第一行：奶量统计（2x2网格） */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-rose-50 rounded-2xl p-3">
              <p className="text-xs text-stone-500 mb-1">总次数</p>
              <p className="text-xl font-bold text-rose-900">{stats.totalCount} 次</p>
            </div>
            <div className="bg-rose-50 rounded-2xl p-3">
              <p className="text-xs text-stone-500 mb-1">平均奶量</p>
              <p className="text-xl font-bold text-rose-900">{stats.averageAmount} ml</p>
            </div>
            <div className="bg-rose-50 rounded-2xl p-3">
              <p className="text-xs text-stone-500 mb-1">最大奶量</p>
              <p className="text-xl font-bold text-rose-900">{stats.maxAmount} ml</p>
            </div>
            <div className="bg-rose-50 rounded-2xl p-3">
              <p className="text-xs text-stone-500 mb-1">最小奶量</p>
              <p className="text-xl font-bold text-rose-900">{stats.minAmount} ml</p>
            </div>
          </div>

          {/* 第二行：间隔极值 */}
          {stats.averageInterval !== null && (
            <div className="pt-4 border-t border-rose-100">
              <p className="text-xs text-stone-400 mb-3">喂养间隔</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-rose-50 rounded-2xl p-3 text-center">
                  <p className="text-xs text-stone-500 mb-1">平均</p>
                  <p className="text-lg font-semibold text-rose-700">
                    {formatInterval(stats.averageInterval)}
                  </p>
                </div>
                <div className="bg-rose-50 rounded-2xl p-3 text-center">
                  <p className="text-xs text-stone-500 mb-1">最长</p>
                  <p className="text-lg font-semibold text-rose-700">
                    {formatInterval(stats.maxInterval)}
                  </p>
                </div>
                <div className="bg-rose-50 rounded-2xl p-3 text-center">
                  <p className="text-xs text-stone-500 mb-1">最短</p>
                  <p className="text-lg font-semibold text-rose-700">
                    {formatInterval(stats.minInterval)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 第三行：短间隔分析（始终显示） */}
          {stats.averageInterval !== null && (
            <div 
              className={`
                pt-4 border-t border-rose-100 rounded-2xl p-4
                ${isHighFrequency 
                  ? 'bg-orange-50 border-2 border-orange-200' 
                  : 'bg-stone-50'
                }
              `}
            >
              <div className="flex items-center gap-2 mb-2">
                {isHighFrequency && (
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                )}
                <p className={`text-sm font-medium ${isHighFrequency ? 'text-orange-600' : 'text-stone-600'}`}>
                  频繁喂养 (&lt;2h)
                </p>
              </div>
              <p className={`text-xl font-bold ${isHighFrequency ? 'text-orange-700' : 'text-stone-700'}`}>
                {stats.shortIntervalCount} 次
                <span className="text-base font-normal ml-2">
                  ({stats.shortIntervalPercentage}%)
                </span>
              </p>
              {isHighFrequency && (
                <p className="text-xs text-orange-600 mt-2">
                  频繁喂养次数较多，宝宝可能需要更多关注
                </p>
              )}
            </div>
          )}

          {/* 只有1条记录时的提示 */}
          {stats.totalCount === 1 && (
            <div className="pt-4 border-t border-rose-100">
              <p className="text-sm text-stone-400 text-center">
                今日仅有 1 次喂养记录，暂无间隔数据
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

