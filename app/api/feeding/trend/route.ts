import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getTodayStart } from '@/lib/date-utils'
import { toZonedTime, fromZonedTime } from 'date-fns-tz'

const TIMEZONE = 'Asia/Shanghai'
const STATS_DAY_START_HOUR = 6

export async function GET() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    // 使用B轨逻辑：获取7个统计日前的开始时间（基于06:00换日点）
    const todayStart = getTodayStart() // 今天统计日的开始时间（06:00）
    
    // 计算7个统计日前的开始时间
    const beijingTodayStart = toZonedTime(todayStart, TIMEZONE)
    const sevenStatsDaysAgo = new Date(beijingTodayStart)
    sevenStatsDaysAgo.setDate(sevenStatsDaysAgo.getDate() - 7)
    
    // 转换为UTC时间用于数据库查询
    const sevenStatsDaysAgoUTC = fromZonedTime(sevenStatsDaysAgo, TIMEZONE)

    const feedings = await prisma.feeding.findMany({
      where: {
        startTime: {
          gte: sevenStatsDaysAgoUTC,
        },
      },
      orderBy: {
        startTime: 'asc',
      },
      select: {
        startTime: true,
        amount: true,
      },
    })

    return NextResponse.json({ feedings })
  } catch (error) {
    console.error('Error fetching feeding trend:', error)
    return NextResponse.json({ error: '获取数据失败' }, { status: 500 })
  }
}





