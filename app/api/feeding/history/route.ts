import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const feedings = await prisma.feeding.findMany({
      orderBy: {
        startTime: 'desc',
      },
    })

    return NextResponse.json({ feedings })
  } catch (error) {
    console.error('Error fetching feeding history:', error)
    return NextResponse.json({ error: '获取数据失败' }, { status: 500 })
  }
}






