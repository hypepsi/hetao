"use client"

import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { format } from 'date-fns'

// 改用柱状图，避免线图在微小变化时显得平直
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

interface WeightTrendChartProps {
  weights: Array<{
    id: string
    kg: number
    createdAt: string
  }>
}

export default function WeightTrendChart({ weights }: WeightTrendChartProps) {
  const chartData = useMemo(() => {
    const recentWeights = weights.slice(-7)
    return recentWeights.map((weight) => {
      const recordDate = new Date(weight.createdAt)
      return {
        date: format(recordDate, 'MM-dd'),
        weight: weight.kg,
      }
    })
  }, [weights])

  // 计算Y轴范围，强力放大几十克的变化
  const yAxisDomain = useMemo(() => {
    if (chartData.length === 0) return undefined
    
    const weightValues = chartData.map((d) => d.weight)
    const minWeight = Math.min(...weightValues)
    const maxWeight = Math.max(...weightValues)
    const rawRange = maxWeight - minWeight

    // 强放大小波动：最小 0.02kg，放大 5 倍后再加边距
    const minSpan = 0.02
    const amplifyFactor = 5
    const targetRange = Math.max(minSpan, rawRange * amplifyFactor)
    const padding = (targetRange - rawRange) / 2

    const yMin = Math.max(0, minWeight - padding)
    const yMax = maxWeight + padding
    return [yMin, yMax]
  }, [chartData])

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
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: '#78716c' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            domain={yAxisDomain}
            tickCount={6}
            tick={{ fontSize: 12, fill: '#78716c' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value.toFixed(2)}`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #fce7f3',
              borderRadius: '12px',
              padding: '8px 12px',
            }}
            labelStyle={{ color: '#78716c', fontSize: '12px' }}
            formatter={(value: any) => [`${Number(value).toFixed(2)} kg`, '体重']}
          />
          <Bar
            dataKey="weight"
            fill="#fb7185"
            radius={[12, 12, 6, 6]}
            maxBarSize={72}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}





