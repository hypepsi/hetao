import { NextRequest, NextResponse } from 'next/server'
import { login } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const { birthTime } = await request.json()

  if (!birthTime) {
    return NextResponse.json({ success: false, error: '请选择出生时间' }, { status: 400 })
  }

  const success = await login(birthTime)
  if (!success) {
    return NextResponse.json(
      { success: false, error: '时间不对哦，再想想宝宝是哪一刻出生的？' },
      { status: 401 }
    )
  }

  return NextResponse.json({ success: true })
}
