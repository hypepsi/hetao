import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getTodayStart } from '@/lib/date-utils'
import { unstable_cache } from 'next/cache'

async function getExcretionData(type: string | null) {
  const todayStart = getTodayStart()

  // 构建查询条件
  const where: any = {
    createdAt: {
      gte: todayStart,
    },
  }

  // 只查询大便类型（小便功能已移除）
  where.type = '大便'

  // 获取今日大便记录（仅统计大便）
  const todayExcretions = await prisma.excretion.findMany({
    where: {
      ...where,
      type: '大便', // 只查询大便记录
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return {
    todayExcretions,
    todayCount: todayExcretions.length,
  }
}

// 使用缓存包装数据获取函数
const getCachedExcretionData = unstable_cache(
  async (type: string | null) => getExcretionData(type),
  ['excretion-stats'],
  {
    tags: ['dashboard-stats'],
    revalidate: 60,
  }
)

export async function GET(request: NextRequest) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    const data = await getCachedExcretionData(type)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching excretion data:', error)
    return NextResponse.json({ error: '获取数据失败' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const { type, time, color, texture, note } = await request.json()
    
    // 如果提供了时间，使用该时间；否则使用当前时间
    const createdAt = time ? new Date(time) : new Date()
    
    const excretion = await prisma.excretion.create({
      data: {
        type,
        color: color || null,
        texture: texture || null,
        note: note || null,
        createdAt, // 使用前端传来的时间，确保历史记录里的时间点绝对真实
      },
    })

    // 清除缓存
    const { revalidateTag } = await import('next/cache')
    revalidateTag('dashboard-stats')

    return NextResponse.json({ success: true, excretion })
  } catch (error) {
    console.error('Error creating excretion:', error)
    return NextResponse.json({ error: '保存失败' }, { status: 500 })
  }
}
