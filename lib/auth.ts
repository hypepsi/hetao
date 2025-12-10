import { cookies } from 'next/headers'
import { prisma } from './prisma'

const CORRECT_BIRTH_TIME = '2025-12-01T09:00' // 正确答案：2025-12-01 09:00
const COOKIE_NAME = 'hetaolog-auth'
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 // 30 days
const isProd = process.env.NODE_ENV === 'production'

export async function login(birthTime: string): Promise<boolean> {
  // 精确到分钟的比较
  // 前端提交的格式应该是 "2025-12-01T09:00" 或类似格式
  const normalizedInput = birthTime.replace(' ', 'T').substring(0, 16) // 取前16个字符，精确到分钟
  const normalizedCorrect = CORRECT_BIRTH_TIME.substring(0, 16)
  
  if (normalizedInput !== normalizedCorrect) {
    return false
  }

  // Create or get user
  const user = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: 'birth-auth', // 保留字段但不再使用
    },
  })

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, 'authenticated', {
    maxAge: COOKIE_MAX_AGE,
    httpOnly: true,
    // 生产环境默认加密传输；本地开发仍允许 HTTP 方便调试
    secure: isProd,
    sameSite: 'lax',
  })

  return true
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get(COOKIE_NAME)
  return authCookie?.value === 'authenticated'
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
