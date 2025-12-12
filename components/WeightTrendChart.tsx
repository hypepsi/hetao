"use client"

import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { format, differenceInDays } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { WHO_GIRLS_WEIGHT_0_12M } from '@/lib/constants'

// 统一图表组件（禁用 SSR）
const ComposedChart = dynamic(() => import('recharts').then((mod) => mod.ComposedChart), { ssr: false })
const Bar = dynamic(() => import('recharts').then((mod) => mod.Bar), { ssr: false })
const Line = dynamic(() => import('recharts').then((mod) => mod.Line), { ssr: false })
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false })
const CartesianGrid = dynamic(() => import('recharts').then((mod) => mod.CartesianGrid), { ssr: false })
const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false })

const BIRTH_DATE = new Date('2025-12-01')
const TIMEZONE = 'Asia/Shanghai'

type TooltipPayload = {
  value: number
  dataKey: string
}

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || payload.length === 0) return null
  const entries = payload as TooltipPayload[]
  const weight = entries.find((p) => p.dataKey === 'weight')?.value
  const p50 = entries.find((p) => p.dataKey === 'p50')?.value

  return (
    <div className="rounded-2xl bg-white/95 px-4 py-3 shadow-xl">
      <div className="text-xs text-stone-400 mb-1">{label}</div>
      {typeof weight === 'number' && (
        <div className="text-sm font-semibold text-rose-500">宝宝：{weight.toFixed(2)} kg</div>
      )}
      {typeof p50 === 'number' && (
        <div className="text-xs text-stone-400 mt-1">标准：{p50.toFixed(2)} kg</div>
      )}
    </div>
  )
}

interface WeightTrendChartProps {
  weights: Array<{
    id: string
    kg: number
    createdAt: string
  }>
}

function interpolateP50(monthAge: number) {
  if (monthAge <= 0) return WHO_GIRLS_WEIGHT_0_12M[0].p50
  if (monthAge >= 12) return WHO_GIRLS_WEIGHT_0_12M[12].p50

  const lowerMonth = Math.floor(monthAge)
  const upperMonth = Math.ceil(monthAge)
  const lower = WHO_GIRLS_WEIGHT_0_12M[lowerMonth]
  const upper = WHO_GIRLS_WEIGHT_0_12M[upperMonth]
  const t = monthAge - lowerMonth
  return lower.p50 + (upper.p50 - lower.p50) * t
}

function calculateMonthAge(recordDate: Date) {
  const beijingRecord = toZonedTime(recordDate, TIMEZONE)
  const beijingBirth = toZonedTime(BIRTH_DATE, TIMEZONE)

  const recordStart = new Date(beijingRecord)
  recordStart.setHours(0, 0, 0, 0)
  const birthStart = new Date(beijingBirth)
  birthStart.setHours(0, 0, 0, 0)

  const days = differenceInDays(recordStart, birthStart)
  return days / 30.44
}

export default function WeightTrendChart({ weights }: WeightTrendChartProps) {
  const chartData = useMemo(() => {
    const recentWeights = weights.slice(-7)
    return recentWeights.map((weight) => {
      const recordDate = new Date(weight.createdAt)
      const monthAge = calculateMonthAge(recordDate)
      const p50 = interpolateP50(monthAge)

      return {
        date: format(recordDate, 'MM-dd'),
        weight: weight.kg,
        p50,
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
    <div className="w-full h-64 outline-none focus:outline-none ring-0" tabIndex={-1}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
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
          />
          <YAxis
            domain={['dataMin - 0.2', 'auto']}
            tickCount={6}
            tick={{ fontSize: 12, fill: '#78716c' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value.toFixed(2)}`}
          />
          <Tooltip cursor={false} content={<ChartTooltip />} />
          <Bar
            dataKey="weight"
            name="宝宝"
            barSize={24}
            fill="#f43f5e"
            radius={[4, 4, 0, 0]}
            activeBar={{ fill: '#be123c' }}
          />
          {/* WHO 标准以圆点呈现，避免与柱子拥挤 */}
          <Line
            type="monotone"
            dataKey="p50"
            name="标准"
            stroke="none"
            dot={{ r: 4, fill: '#a8a29e' }}
            activeDot={{ r: 6, fill: '#be123c' }}
            legendType="none"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
