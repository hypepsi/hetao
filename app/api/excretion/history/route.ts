import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    // 只查询大便记录（小便功能已移除）
    const excretions = await prisma.excretion.findMany({
      where: {
        type: '大便',
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ excretions })
  } catch (error) {
    console.error('Error fetching excretion history:', error)
    return NextResponse.json({ error: '获取数据失败' }, { status: 500 })
  }
}





