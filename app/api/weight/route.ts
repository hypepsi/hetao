import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'

async function getWeightData() {
  // 获取最新一次体重记录
  const latestWeight = await prisma.weightRecord.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
  })

  // 获取最近7次体重记录（用于趋势图）
  const recentWeights = await prisma.weightRecord.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: 7,
    select: {
      id: true,
      kg: true,
      createdAt: true,
    },
  })

  return {
    latestWeight,
    recentWeights: recentWeights.reverse(), // 反转以便按时间顺序显示
  }
}

// 使用缓存包装数据获取函数
const getCachedWeightData = unstable_cache(
  getWeightData,
  ['weight-stats'],
  {
    tags: ['dashboard-stats'],
    revalidate: 60,
  }
)

export async function GET() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const data = await getCachedWeightData()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching weight data:', error)
    return NextResponse.json({ error: '获取数据失败' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const { kg, note } = await request.json()
    
    const weightRecord = await prisma.weightRecord.create({
      data: {
        kg: parseFloat(kg),
        note: note || null,
      },
    })

    // 清除缓存
    const { revalidateTag } = await import('next/cache')
    revalidateTag('dashboard-stats')

    return NextResponse.json({ success: true, weightRecord })
  } catch (error) {
    console.error('Error creating weight record:', error)
    return NextResponse.json({ error: '保存失败' }, { status: 500 })
  }
}
