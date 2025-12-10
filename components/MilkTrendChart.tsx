"use client"

import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { getTodayStart } from '@/lib/date-utils'
import { format } from 'date-fns'

// 动态导入图表组件，禁用 SSR
const BarChart = dynamic(
  () => import('recharts').then((mod) => mod.BarChart),
  { ssr: false }
)

const Bar = dynamic(
  () => import('recharts').then((mod) => mod.Bar),
  { ssr: false }
)

const XAxis = dynamic(
  () => import('recharts').then((mod) => mod.XAxis),
  { ssr: false }
)

const YAxis = dynamic(
  () => import('recharts').then((mod) => mod.YAxis),
  { ssr: false }
)

const ResponsiveContainer = dynamic(
  () => import('recharts').then((mod) => mod.ResponsiveContainer),
  { ssr: false }
)

const Tooltip = dynamic(
  () => import('recharts').then((mod) => mod.Tooltip),
  { ssr: false }
)

interface MilkTrendChartProps {
  feedings: Array<{
    startTime: string
    amount: number
  }>
}

export default function MilkTrendChart({ feedings }: MilkTrendChartProps) {
  const chartData = useMemo(() => {
    const todayStart = getTodayStart()
    const days = []
    
    // 生成近7天的日期数组（从6天前到今天）
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(todayStart)
      dayStart.setDate(dayStart.getDate() - i)
      dayStart.setHours(6, 0, 0, 0)
      
      const dayEnd = new Date(dayStart)
      dayEnd.setDate(dayEnd.getDate() + 1)
      
      // 计算这一天（6:00-次日6:00）的总奶量
      let totalAmount = 0
      feedings.forEach((feeding) => {
        const feedingTime = new Date(feeding.startTime)
        // 如果喂奶时间在这个时间段内
        if (feedingTime >= dayStart && feedingTime < dayEnd) {
          totalAmount += feeding.amount
        }
      })
      
      days.push({
        date: format(dayStart, 'MM-dd'),
        amount: totalAmount,
      })
    }
    
    return days
  }, [feedings])

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: '#78716c' }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#78716c' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            cursor={false}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #fce7f3',
              borderRadius: '12px',
              padding: '8px 12px',
            }}
            labelStyle={{ color: '#78716c', fontSize: '12px' }}
            formatter={(value: any) => [`${value} ml`, '奶量']}
          />
          <Bar 
            dataKey="amount" 
            fill="#fb7185" 
            radius={[8, 8, 0, 0]}
            activeBar={{ 
              fill: '#f43f5e', 
              stroke: '#fda4af', 
              strokeWidth: 2,
              opacity: 1
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

