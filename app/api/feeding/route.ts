import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getTodayStart } from '@/lib/date-utils'
import { unstable_cache } from 'next/cache'

async function getFeedingData() {
  const todayStart = getTodayStart()

  // 获取今日喂奶记录
  const todayFeedings = await prisma.feeding.findMany({
    where: {
      startTime: {
        gte: todayStart,
      },
    },
    orderBy: {
      startTime: 'desc',
    },
  })

  // 获取最后一次喂奶记录
  const lastFeeding = await prisma.feeding.findFirst({
    orderBy: {
      startTime: 'desc',
    },
  })

  // 计算今日累计奶量
  const todayTotalAmount = todayFeedings.reduce((sum, f) => sum + f.amount, 0)

  return {
    lastFeeding,
    todayFeedings,
    todayCount: todayFeedings.length,
    todayTotalAmount,
  }
}

// 使用缓存包装数据获取函数
const getCachedFeedingData = unstable_cache(
  getFeedingData,
  ['feeding-stats'],
  {
    tags: ['dashboard-stats'],
    revalidate: 60, // 60秒后重新验证
  }
)

export async function GET() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const data = await getCachedFeedingData()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching feeding data:', error)
    return NextResponse.json({ error: '获取数据失败' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const { startTime, endTime, amount } = await request.json()
    
    const feeding = await prisma.feeding.create({
      data: {
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        amount: parseInt(amount),
      },
    })

    // 清除缓存
    const { revalidateTag } = await import('next/cache')
    revalidateTag('dashboard-stats')

    return NextResponse.json({ success: true, feeding })
  } catch (error) {
    console.error('Error creating feeding:', error)
    return NextResponse.json({ error: '保存失败' }, { status: 500 })
  }
}
