"use client"

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toZonedTime } from 'date-fns-tz'
import { differenceInMonths } from 'date-fns'
import { Lightbulb, TrendingUp } from 'lucide-react'

const BIRTH_DATE = new Date('2025-12-01')
const TIMEZONE = 'Asia/Shanghai'
const GLOBAL_MAX = 1000 // 每日奶量上限（ml）

interface SmartFeedingCardProps {
  todayTotalAmount: number // 今日已喝奶量（B轨统计）
  latestWeight?: {
    kg: number
    createdAt: Date
  }
}

export default function SmartFeedingCard({ 
  todayTotalAmount, 
  latestWeight 
}: SmartFeedingCardProps) {
  // 计算当前月龄
  const monthAge = useMemo(() => {
    const now = new Date()
    const beijingNow = toZonedTime(now, TIMEZONE)
    const birthDateBeijing = toZonedTime(BIRTH_DATE, TIMEZONE)
    
    // 获取今天北京时间的 00:00:00
    const todayNaturalStart = new Date(beijingNow)
    todayNaturalStart.setHours(0, 0, 0, 0)
    
    // 获取出生日期北京时间的 00:00:00
    const birthNaturalStart = new Date(birthDateBeijing)
    birthNaturalStart.setHours(0, 0, 0, 0)
    
    return differenceInMonths(todayNaturalStart, birthNaturalStart)
  }, [])

  // 计算建议奶量
  const suggestion = useMemo(() => {
    if (!latestWeight) {
      return null
    }

    const weight = latestWeight.kg
    
    // 根据月龄选择系数
    const volumePerKg = monthAge < 6 ? 150 : 120
    
    // 计算目标奶量
    const calculatedTarget = weight * volumePerKg
    
    // 应用安全封顶
    const finalTarget = Math.min(calculatedTarget, GLOBAL_MAX)
    
    return {
      weight,
      volumePerKg,
      finalTarget,
    }
  }, [latestWeight, monthAge])

  // 计算进度条相关数据
  const progressData = useMemo(() => {
    if (!suggestion) {
      return null
    }

    const { finalTarget } = suggestion
    const maxValue = finalTarget * 1.2 // 留出20%溢出空间
    const currentValue = todayTotalAmount
    const percentage = (currentValue / finalTarget) * 100

    // 确定颜色
    let color = 'bg-yellow-400' // 默认黄色（< 80%）
    let statusText = '加油'
    
    if (percentage >= 80 && percentage <= 100) {
      color = 'bg-green-500' // 绿色（80-100%）
      statusText = '完美'
    } else if (percentage > 100) {
      color = 'bg-orange-500' // 橙色（> 100%）
      statusText = '注意'
    }

    return {
      maxValue,
      currentValue,
      finalTarget,
      percentage: Math.min(percentage, 120), // 限制在120%以内显示
      color,
      statusText,
    }
  }, [suggestion, todayTotalAmount])

  if (!latestWeight) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm shadow-md rounded-3xl border-rose-100">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 rounded-2xl">
              <Lightbulb className="h-6 w-6 text-rose-500" />
            </div>
            <CardTitle className="text-xl font-bold text-stone-700">智能建议</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-stone-400 text-center py-4">
            请记录一次体重以激活建议
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!suggestion || !progressData) {
    return null
  }

  const { weight, volumePerKg } = suggestion
  const { currentValue, finalTarget, percentage, color, statusText } = progressData

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-md rounded-3xl border-rose-100">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-50 rounded-2xl">
            <Lightbulb className="h-6 w-6 text-rose-500" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-stone-700">
              今日建议 (体重 {weight.toFixed(2)} kg)
            </CardTitle>
            <p className="text-xs text-stone-400 mt-1">
              {monthAge < 6 
                ? '每公斤约 150ml' 
                : '每公斤约 120ml (含辅食)'}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* 进度条 */}
          <div className="relative">
            <div className="w-full h-6 bg-stone-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${color} transition-all duration-300 rounded-full flex items-center justify-end pr-2`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              >
                {percentage > 15 && (
                  <span className="text-xs font-medium text-white">
                    {statusText}
                  </span>
                )}
              </div>
            </div>
            {percentage > 100 && (
              <div
                className="absolute top-0 h-6 bg-orange-500 rounded-full flex items-center justify-end pr-2"
                style={{ 
                  left: '100%',
                  width: `${Math.min(percentage - 100, 20)}%`,
                  maxWidth: '20%'
                }}
              >
                {percentage > 115 && (
                  <span className="text-xs font-medium text-white">
                    超出
                  </span>
                )}
              </div>
            )}
          </div>

          {/* 数值反馈 */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-stone-400" />
              <span className="text-stone-600">
                已喝 <span className="font-bold text-stone-700">{currentValue}</span> ml
              </span>
            </div>
            <div className="text-stone-400">
              目标 <span className="font-bold text-stone-600">{Math.round(finalTarget)}</span> ml
            </div>
          </div>

          {/* 完成度百分比 */}
          <div className="text-center">
            <span className={`text-xs font-medium ${
              percentage < 80 
                ? 'text-yellow-600' 
                : percentage <= 100 
                ? 'text-green-600' 
                : 'text-orange-600'
            }`}>
              完成度: {percentage.toFixed(1)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

