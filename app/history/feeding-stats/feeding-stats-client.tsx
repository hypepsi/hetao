"use client"

import { useState } from 'react'
import useSWR from 'swr'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Activity, AlertCircle } from 'lucide-react'
import { formatInterval } from '@/lib/feeding-stats-utils'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface DailyStatsData {
  date: string
  totalCount: number
  averageAmount: number
  maxAmount: number
  minAmount: number
  averageInterval: number | null
  maxInterval: number | null
  minInterval: number | null
  shortIntervalCount: number
  shortIntervalPercentage: number
  hasData: boolean
}

export default function FeedingStatsClient() {
  const { data, error } = useSWR('/api/feeding/stats', fetcher)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return format(date, 'MM月dd日 EEEE', { locale: zhCN })
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-12">
            <p className="text-stone-500">加载失败，请重试</p>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-stone-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-12">
            <p className="text-stone-400">加载中...</p>
          </div>
        </div>
      </div>
    )
  }

  const dailyStats: DailyStatsData[] = data.dailyStats || []

  return (
    <div className="min-h-screen bg-stone-50 p-4 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* 头部 */}
        <div className="flex items-center mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon" className="p-3">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold ml-4 text-stone-700">喂养统计历史</h1>
        </div>

        {/* 统计列表 */}
        {dailyStats.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-stone-400">暂无历史统计数据</p>
          </div>
        ) : (
          <div className="space-y-4">
            {dailyStats.map((stats) => {
              const isHighFrequency = stats.shortIntervalPercentage > 30
              const isToday = stats.date === format(new Date(), 'yyyy-MM-dd')

              return (
                <Card
                  key={stats.date}
                  className="bg-white/90 backdrop-blur-sm shadow-md rounded-3xl border-rose-100"
                >
                  <CardContent className="p-5">
                    {/* 日期标题 */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-rose-500" />
                        <h3 className="text-lg font-bold text-stone-700">
                          {formatDate(stats.date)}
                        </h3>
                      </div>
                      {isToday && (
                        <span className="text-xs px-2 py-1 bg-rose-100 text-rose-600 rounded-full">
                          今天
                        </span>
                      )}
                    </div>

                    {/* 核心数据 */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-rose-50 rounded-2xl p-3">
                        <p className="text-xs text-stone-500 mb-1">总次数</p>
                        <p className="text-lg font-bold text-rose-900">{stats.totalCount} 次</p>
                      </div>
                      <div className="bg-rose-50 rounded-2xl p-3">
                        <p className="text-xs text-stone-500 mb-1">平均奶量</p>
                        <p className="text-lg font-bold text-rose-900">{stats.averageAmount} ml</p>
                      </div>
                      <div className="bg-rose-50 rounded-2xl p-3">
                        <p className="text-xs text-stone-500 mb-1">最大奶量</p>
                        <p className="text-lg font-bold text-rose-900">{stats.maxAmount} ml</p>
                      </div>
                      <div className="bg-rose-50 rounded-2xl p-3">
                        <p className="text-xs text-stone-500 mb-1">最小奶量</p>
                        <p className="text-lg font-bold text-rose-900">{stats.minAmount} ml</p>
                      </div>
                    </div>

                    {/* 间隔统计 */}
                    {stats.averageInterval !== null ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-stone-50 rounded-2xl p-2 text-center">
                            <p className="text-xs text-stone-500">平均间隔</p>
                            <p className="text-sm font-semibold text-stone-700">
                              {formatInterval(stats.averageInterval)}
                            </p>
                          </div>
                          <div className="bg-stone-50 rounded-2xl p-2 text-center">
                            <p className="text-xs text-stone-500">最长</p>
                            <p className="text-sm font-semibold text-stone-700">
                              {formatInterval(stats.maxInterval)}
                            </p>
                          </div>
                          <div className="bg-stone-50 rounded-2xl p-2 text-center">
                            <p className="text-xs text-stone-500">最短</p>
                            <p className="text-sm font-semibold text-stone-700">
                              {formatInterval(stats.minInterval)}
                            </p>
                          </div>
                        </div>

                        {/* 频繁喂养提示 */}
                        <div
                          className={`
                            rounded-2xl p-3 flex items-center justify-between
                            ${isHighFrequency 
                              ? 'bg-orange-50 border border-orange-200' 
                              : 'bg-stone-50'
                            }
                          `}
                        >
                          <div className="flex items-center gap-2">
                            {isHighFrequency && (
                              <AlertCircle className="h-4 w-4 text-orange-500" />
                            )}
                            <span className={`text-sm font-medium ${isHighFrequency ? 'text-orange-600' : 'text-stone-600'}`}>
                              频繁喂养 (&lt;2h)
                            </span>
                          </div>
                          <span className={`text-base font-bold ${isHighFrequency ? 'text-orange-700' : 'text-stone-700'}`}>
                            {stats.shortIntervalCount} 次 ({stats.shortIntervalPercentage}%)
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-stone-50 rounded-2xl p-3 text-center">
                        <p className="text-sm text-stone-400">
                          当日仅1次记录，无间隔数据
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

