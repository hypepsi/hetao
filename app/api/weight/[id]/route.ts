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
    const { kg, note } = await request.json()
    
    const weightRecord = await prisma.weightRecord.update({
      where: { id: params.id },
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
    console.error('Error updating weight record:', error)
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
    await prisma.weightRecord.delete({
      where: { id: params.id },
    })

    // 清除缓存
    const { revalidateTag } = await import('next/cache')
    revalidateTag('dashboard-stats')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting weight record:', error)
    return NextResponse.json({ error: '删除失败' }, { status: 500 })
  }
}

