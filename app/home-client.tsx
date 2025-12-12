"use client"

import { Suspense, useState } from 'react'
import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getBabyAge, getDetailedBabyAge, formatTimeAgo } from '@/lib/date-utils'
import FeedingSheet from '@/components/FeedingSheet'
import PooSheet from '@/components/PooSheet'
import WeightSheet from '@/components/WeightSheet'
import MilkTrendChart from '@/components/MilkTrendChart'
import WeightTrendChart from '@/components/WeightTrendChart'
import { FeedingCard } from '@/components/FeedingCard'
import { DashboardSkeleton } from '@/components/DashboardSkeleton'
import SmartFeedingCard from '@/components/SmartFeedingCard'
import DailyFeedingStats from '@/components/DailyFeedingStats'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Baby, Wind, LogOut, History, TrendingUp, Scale } from 'lucide-react'

export default function HomePageClient() {
  const router = useRouter()
  const { data: feedingData, mutate: mutateFeeding } = useSWR('/api/feeding', {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 30000, // 每30秒自动刷新
  })
  const { data: trendData } = useSWR('/api/feeding/trend', {
    revalidateOnFocus: true,
    refreshInterval: 30000,
  })
  const { data: weightData, mutate: mutateWeight } = useSWR('/api/weight', {
    revalidateOnFocus: true,
    refreshInterval: 30000,
  })
  const { data: pooData, mutate: mutatePoo } = useSWR('/api/excretion?type=大便', {
    revalidateOnFocus: true,
    refreshInterval: 30000,
  })

  const [isFeedingSheetOpen, setIsFeedingSheetOpen] = useState(false)
  const [isPooSheetOpen, setIsPooSheetOpen] = useState(false)
  const [isWeightSheetOpen, setIsWeightSheetOpen] = useState(false)

  const babyAge = getBabyAge()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen px-4 pb-8">
      {/* 顶部：宝宝年龄 */}
      <div className="text-center pt-6 pb-6">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Baby className="h-8 w-8 text-stone-600" />
          <h1 className="text-3xl font-bold text-stone-700">
            小核桃已出生 {babyAge.days} 天
          </h1>
        </div>
        <p className="text-base text-stone-400">
          {getDetailedBabyAge()}
        </p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <div className="space-y-4">
          {/* 卡片 0：智能建议 */}
          <SmartFeedingCard
            todayTotalAmount={feedingData?.todayTotalAmount || 0}
            latestWeight={weightData?.latestWeight ? {
              kg: weightData.latestWeight.kg,
              createdAt: new Date(weightData.latestWeight.createdAt)
            } : undefined}
          />

          {/* 卡片 1：喂奶 */}
          <FeedingCard 
            feedingData={feedingData}
            onClick={() => setIsFeedingSheetOpen(true)}
          />

          {/* 新增：每日喂养统计 */}
          {feedingData?.todayFeedings && feedingData.todayFeedings.length > 0 && (
            <DailyFeedingStats feedings={feedingData.todayFeedings} />
          )}

          {/* 卡片 2：大便 */}
          <Card 
            className="bg-white/90 backdrop-blur-sm shadow-md cursor-pointer hover:shadow-lg transition-shadow active:scale-[0.98] rounded-3xl border-rose-100"
            onClick={() => setIsPooSheetOpen(true)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-50 rounded-2xl">
                    <Wind className="h-6 w-6 text-rose-500" />
                  </div>
                  <CardTitle className="text-xl font-bold text-stone-700">大便</CardTitle>
                </div>
                <Link 
                  href="/history/excretion?type=大便" 
                  className="flex items-center gap-1 px-3 py-2 text-xs text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <History className="h-4 w-4" />
                  历史
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-stone-400 mb-1">今日次数</p>
                  <p className="text-3xl font-bold text-rose-900">
                    {pooData?.todayCount ?? 0} 次
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 卡片 3：体重 */}
          <Card 
            className="bg-white/90 backdrop-blur-sm shadow-md cursor-pointer hover:shadow-lg transition-shadow active:scale-[0.98] rounded-3xl border-rose-100"
            onClick={() => setIsWeightSheetOpen(true)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-50 rounded-2xl">
                    <Scale className="h-6 w-6 text-rose-500" />
                  </div>
                  <CardTitle className="text-xl font-bold text-stone-700">体重</CardTitle>
                </div>
                <Link 
                  href="/history/weight" 
                  className="flex items-center gap-1 px-3 py-2 text-xs text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <History className="h-4 w-4" />
                  历史
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-stone-400 mb-1">最新体重</p>
                  <p className="text-3xl font-bold text-rose-900">
                    {weightData?.latestWeight ? `${weightData.latestWeight.kg} kg` : '暂无记录'}
                  </p>
                  {weightData?.latestWeight && (
                    <p className="text-sm text-stone-400 mt-1">
                      {formatTimeAgo(new Date(weightData.latestWeight.createdAt))}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 卡片 4：近7天奶量趋势 */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-md rounded-3xl border-rose-100">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-50 rounded-2xl">
                  <TrendingUp className="h-6 w-6 text-rose-500" />
                </div>
                <CardTitle className="text-xl font-bold text-stone-700">近7天奶量趋势</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {trendData?.feedings ? (
                <MilkTrendChart feedings={trendData.feedings} />
              ) : (
                <div className="h-64 flex items-center justify-center text-stone-400">
                  暂无数据
                </div>
              )}
            </CardContent>
          </Card>

          {/* 卡片 5：体重趋势 - 移至最底部，减少关注度 */}
          {weightData?.recentWeights && weightData.recentWeights.length > 0 && (
            <Card className="bg-white/90 backdrop-blur-sm shadow-md rounded-3xl border-rose-100">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-50 rounded-2xl">
                    <Scale className="h-6 w-6 text-rose-500" />
                  </div>
                  <CardTitle className="text-xl font-bold text-stone-700">体重趋势</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <WeightTrendChart weights={weightData.recentWeights} />
              </CardContent>
            </Card>
          )}

          {/* 退出按钮 - 放在所有内容最底部 - 强制验证版本 */}
          <div className="mt-32 mb-16 bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4">
            <div className="text-center text-sm font-bold text-yellow-800 mb-2">
              🔧 验证版本 - 如果你看到这个说明代码生效了
            </div>
            <Button 
              variant="ghost" 
              onClick={handleLogout} 
              className="w-full text-rose-600 font-bold flex items-center justify-center gap-2 hover:text-rose-700 hover:bg-rose-50"
            >
              <LogOut className="h-5 w-5" />
              退出当前账号 v2.0
            </Button>
          </div>
        </div>
      </Suspense>

      <FeedingSheet
        open={isFeedingSheetOpen}
        onOpenChange={setIsFeedingSheetOpen}
        onSuccess={() => {
          mutateFeeding()
          setIsFeedingSheetOpen(false)
        }}
      />

      <PooSheet
        open={isPooSheetOpen}
        onOpenChange={setIsPooSheetOpen}
        onSuccess={() => {
          mutatePoo()
          setIsPooSheetOpen(false)
        }}
      />

      <WeightSheet
        open={isWeightSheetOpen}
        onOpenChange={setIsWeightSheetOpen}
        onSuccess={() => {
          mutateWeight()
          setIsWeightSheetOpen(false)
        }}
      />
    </div>
  )
}
