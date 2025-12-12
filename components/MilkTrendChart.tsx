"use client"

import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { getTodayStart } from '@/lib/date-utils'
import { format } from 'date-fns'

// 动态导入图表组件，禁用 SSR
const BarChart = dynamic(() => import('recharts').then((mod) => mod.BarChart), { ssr: false })
const Bar = dynamic(() => import('recharts').then((mod) => mod.Bar), { ssr: false })
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false })
const CartesianGrid = dynamic(
  () => import('recharts').then((mod) => mod.CartesianGrid),
  { ssr: false }
)
const ResponsiveContainer = dynamic(
  () => import('recharts').then((mod) => mod.ResponsiveContainer),
  { ssr: false }
)
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false })

type TooltipPayload = {
  value: number
  dataKey: string
}

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || payload.length === 0) return null
  const first = payload[0] as TooltipPayload

  return (
    <div className="rounded-2xl bg-white/95 px-4 py-3 shadow-xl">
      <div className="text-xs text-stone-400 mb-1">{label}</div>
      <div className="text-sm font-semibold text-rose-500">
        奶量：{Number(first.value).toFixed(0)} ml
      </div>
    </div>
  )
}

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
        if (feedingTime >= dayStart && feedingTime < dayEnd) {
          totalAmount += feeding.amount
        }
      })
      
      days.push({
        date: format(dayStart, 'MM-dd'),
        amount: totalAmount,
      })
    }
    
    // 过滤掉前面所有数据为0的日期，只保留从第一个有数据的日期开始
    let firstDataIndex = days.findIndex(day => day.amount > 0)
    if (firstDataIndex === -1) {
      // 如果没有任何数据，返回空数组
      return []
    }
    
    // 从第一个有数据的日期开始返回
    return days.slice(firstDataIndex)
  }, [feedings])

  return (
    <div 
      className="w-full h-64 select-none outline-none focus:outline-none focus-visible:outline-none" 
      tabIndex={-1}
      style={{
        WebkitTapHighlightColor: 'transparent',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={chartData} 
          margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
          barCategoryGap="20%"
        >
          <CartesianGrid stroke="#f4d5dc" strokeDasharray="3 3" vertical={false} />
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
          {/* 去除默认灰色遮罩，仅柱子高亮 */}
          <Tooltip cursor={false} content={<ChartTooltip />} />
          <Bar 
            dataKey="amount" 
            barSize={24}
            fill="#fb7185"
            radius={[4, 4, 0, 0]}
            activeBar={{ fill: '#be123c' }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
