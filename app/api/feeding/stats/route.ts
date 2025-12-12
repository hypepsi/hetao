import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateDailyStats } from '@/lib/feeding-stats-utils'
import { getStatsDate } from '@/lib/date-utils'

export async function GET() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    // 获取所有喂养记录
    const allFeedings = await prisma.feeding.findMany({
      orderBy: {
        startTime: 'asc',
      },
      select: {
        startTime: true,
        amount: true,
      },
    })

    if (allFeedings.length === 0) {
      return NextResponse.json({ dailyStats: [] })
    }

    // 按统计日分组（B轨逻辑：06:00-次日06:00）
    const feedingsByDate = new Map<string, Array<{ startTime: Date; amount: number }>>()

    allFeedings.forEach((feeding) => {
      // 使用 B轨逻辑获取统计日期
      // 例如：12月11日02:00的记录 → 归属到12月10日统计日（因为<6点）
      const dateKey = getStatsDate(feeding.startTime)

      if (!feedingsByDate.has(dateKey)) {
        feedingsByDate.set(dateKey, [])
      }

      feedingsByDate.get(dateKey)!.push({
        startTime: feeding.startTime,
        amount: feeding.amount,
      })
    })

    // 计算每天的统计数据
    const dailyStats = Array.from(feedingsByDate.entries())
      .map(([date, feedings]) => {
        const stats = calculateDailyStats(
          feedings.map((f) => ({
            startTime: f.startTime.toISOString(),
            amount: f.amount,
          }))
        )

        return {
          date,
          ...stats,
        }
      })
      // 按日期倒序排列（最近的在前）
      .sort((a, b) => b.date.localeCompare(a.date))

    return NextResponse.json({ dailyStats })
  } catch (error) {
    console.error('Error fetching feeding stats:', error)
    return NextResponse.json({ error: '获取统计数据失败' }, { status: 500 })
  }
}

