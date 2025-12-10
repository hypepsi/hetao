import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const { startTime, endTime, amount } = await request.json()
    
    const feeding = await prisma.feeding.update({
      where: { id: params.id },
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
    console.error('Error updating feeding:', error)
    return NextResponse.json({ error: '更新失败' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    await prisma.feeding.delete({
      where: { id: params.id },
    })

    // 清除缓存
    const { revalidateTag } = await import('next/cache')
    revalidateTag('dashboard-stats')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting feeding:', error)
    return NextResponse.json({ error: '删除失败' }, { status: 500 })
  }
}

