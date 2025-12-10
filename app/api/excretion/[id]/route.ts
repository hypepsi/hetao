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
    const { type, color, texture, note } = await request.json()
    
    const excretion = await prisma.excretion.update({
      where: { id: params.id },
      data: {
        type,
        color: color || null,
        texture: texture || null,
        note: note || null,
      },
    })

    // 清除缓存
    const { revalidateTag } = await import('next/cache')
    revalidateTag('dashboard-stats')

    return NextResponse.json({ success: true, excretion })
  } catch (error) {
    console.error('Error updating excretion:', error)
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
    await prisma.excretion.delete({
      where: { id: params.id },
    })

    // 清除缓存
    const { revalidateTag } = await import('next/cache')
    revalidateTag('dashboard-stats')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting excretion:', error)
    return NextResponse.json({ error: '删除失败' }, { status: 500 })
  }
}

