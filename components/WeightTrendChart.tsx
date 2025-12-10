"use client"

import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { format, differenceInDays } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { WHO_GIRLS_WEIGHT_0_12M } from '@/lib/constants'

const BIRTH_DATE = new Date('2025-12-01')
const TIMEZONE = 'Asia/Shanghai'

// 动态导入图表组件，禁用 SSR
const ComposedChart = dynamic(
  () => import('recharts').then((mod) => mod.ComposedChart),
  { ssr: false }
)

const Area = dynamic(
  () => import('recharts').then((mod) => mod.Area),
  { ssr: false }
)

const Line = dynamic(
  () => import('recharts').then((mod) => mod.Line),
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

interface WeightTrendChartProps {
  weights: Array<{
    id: string
    kg: number
    createdAt: string
  }>
}

// 线性插值函数：根据精确月龄计算 WHO 标准值
function interpolateWHO(monthAge: number): { p3: number; p50: number; p97: number } {
  if (monthAge <= 0) {
    return WHO_GIRLS_WEIGHT_0_12M[0]
  }
  if (monthAge >= 12) {
    return WHO_GIRLS_WEIGHT_0_12M[12]
  }
  
  const lowerMonth = Math.floor(monthAge)
  const upperMonth = Math.ceil(monthAge)
  const lower = WHO_GIRLS_WEIGHT_0_12M[lowerMonth]
  const upper = WHO_GIRLS_WEIGHT_0_12M[upperMonth]
  
  // 线性插值
  const t = monthAge - lowerMonth
  return {
    p3: lower.p3 + (upper.p3 - lower.p3) * t,
    p50: lower.p50 + (upper.p50 - lower.p50) * t,
    p97: lower.p97 + (upper.p97 - lower.p97) * t,
  }
}

// 计算精确月龄（从出生日期到记录日期）
function calculateMonthAge(recordDate: Date): number {
  const beijingRecord = toZonedTime(recordDate, TIMEZONE)
  const birthDateBeijing = toZonedTime(BIRTH_DATE, TIMEZONE)
  
  const recordStart = new Date(beijingRecord)
  recordStart.setHours(0, 0, 0, 0)
  
  const birthStart = new Date(birthDateBeijing)
  birthStart.setHours(0, 0, 0, 0)
  
  const days = differenceInDays(recordStart, birthStart)
  return days / 30.44 // 平均每月天数
}

export default function WeightTrendChart({ weights }: WeightTrendChartProps) {
  const chartData = useMemo(() => {
    // 取最近7次记录（已经是按时间顺序排列的）
    const recentWeights = weights.slice(-7)
    
    return recentWeights.map((weight) => {
      const recordDate = new Date(weight.createdAt)
      const monthAge = calculateMonthAge(recordDate)
      const whoData = interpolateWHO(monthAge)
      
      return {
        date: format(recordDate, 'MM-dd'),
        weight: weight.kg,
        whoP3: whoData.p3,
        whoP50: whoData.p50,
        whoP97: whoData.p97,
      }
    })
  }, [weights])

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-stone-400">
        暂无数据
      </div>
    )
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fb7185" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#fb7185" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: '#78716c' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#78716c' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #fce7f3',
              borderRadius: '12px',
              padding: '8px 12px',
            }}
            labelStyle={{ color: '#78716c', fontSize: '12px' }}
            formatter={(value: any, name: any) => {
              if (name === 'weight') {
                return [`${value} kg`, '实测']
              } else if (name === 'whoP50') {
                return [`${typeof value === 'number' ? value.toFixed(2) : value} kg`, 'WHO标准(P50)']
              }
              return null
            }}
          />
          {/* WHO 参考区间 (P3-P97) - 极度淡雅 */}
          {/* 先绘制 P97 区域 */}
          <Area
            type="monotone"
            dataKey="whoP97"
            stroke="none"
            fill="#e7e5e4"
            fillOpacity={0.15}
            stackId="who-range"
          />
          {/* 再用白色覆盖 P3 以下部分，只显示 P3-P97 区间 */}
          <Area
            type="monotone"
            dataKey="whoP3"
            stroke="none"
            fill="#fff"
            fillOpacity={1}
            stackId="who-range"
          />
          {/* WHO 平均线 (P50) - 细虚线 */}
          <Line
            type="monotone"
            dataKey="whoP50"
            stroke="#d6d3d1"
            strokeWidth={1}
            strokeDasharray="3 3"
            dot={false}
            activeDot={false}
          />
          {/* 宝宝实测数据 - 最上层，保持原有样式 */}
          <Area 
            type="monotone"
            dataKey="weight" 
            stroke="#fb7185"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorWeight)"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}





