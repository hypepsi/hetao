import { differenceInDays, differenceInWeeks, format, intervalToDuration } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { toZonedTime, fromZonedTime } from 'date-fns-tz'

const BIRTH_DATE = new Date('2025-12-01')
const STATS_DAY_START_HOUR = 6 // B轨：医院统计逻辑，早晨 6:00 为新一天的分割线
const TIMEZONE = 'Asia/Shanghai' // 北京时间 UTC+8

/**
 * A轨：自然日历逻辑
 * 用途：计算宝宝的出生天数、月龄
 * 换日点：北京时间 00:00（自然日）
 * 只要过了半夜 12 点，宝宝的"出生天数"必须立即 +1
 */
export function getBabyAge() {
  const now = new Date()
  const beijingNow = toZonedTime(now, TIMEZONE)
  
  // 获取今天北京时间的 00:00:00
  const todayNaturalStart = new Date(beijingNow)
  todayNaturalStart.setHours(0, 0, 0, 0)
  
  // 获取出生日期北京时间的 00:00:00
  const birthDateBeijing = toZonedTime(BIRTH_DATE, TIMEZONE)
  const birthNaturalStart = new Date(birthDateBeijing)
  birthNaturalStart.setHours(0, 0, 0, 0)
  
  // 计算自然日天数差（基于 00:00 换日点）
  // 注意：differenceInDays 计算的是两个日期之间的完整天数差
  // 例如 12月1日到12月2日是1天，但出生当天算第1天，所以需要+1
  const days = differenceInDays(todayNaturalStart, birthNaturalStart) + 1
  const weeks = differenceInWeeks(todayNaturalStart, birthNaturalStart)
  const remainingDays = days % 7

  return {
    days,
    weeks,
    remainingDays,
  }
}

/**
 * 获取详细年龄显示（X个月 + X周 + X天）
 * 基于A轨自然日历逻辑
 */
export function getDetailedBabyAge(): string {
  const now = new Date()
  const beijingNow = toZonedTime(now, TIMEZONE)
  
  // 获取今天北京时间的 00:00:00
  const todayNaturalStart = new Date(beijingNow)
  todayNaturalStart.setHours(0, 0, 0, 0)
  
  // 获取出生日期北京时间的 00:00:00
  const birthDateBeijing = toZonedTime(BIRTH_DATE, TIMEZONE)
  const birthNaturalStart = new Date(birthDateBeijing)
  birthNaturalStart.setHours(0, 0, 0, 0)
  
  // 使用 intervalToDuration 计算详细的月、周、天
  const duration = intervalToDuration({
    start: birthNaturalStart,
    end: todayNaturalStart,
  })
  
  const months = duration.months || 0
  const years = duration.years || 0
  
  // intervalToDuration 不返回 weeks，需要手动计算
  // 先计算总天数
  const totalDays = differenceInDays(todayNaturalStart, birthNaturalStart)
  
  // 计算剩余天数（减去已计算的年、月）
  // 创建一个临时日期，加上已计算的年、月
  const tempDate = new Date(birthNaturalStart)
  tempDate.setFullYear(tempDate.getFullYear() + years)
  tempDate.setMonth(tempDate.getMonth() + months)
  const remainingDays = differenceInDays(todayNaturalStart, tempDate)
  
  // 从剩余天数计算周和天
  const weeks = Math.floor(remainingDays / 7)
  const days = remainingDays % 7
  
  const parts: string[] = []
  if (months > 0) {
    parts.push(`${months}个月`)
  }
  if (weeks > 0) {
    parts.push(`${weeks}周`)
  }
  if (days > 0) {
    parts.push(`${days}天`)
  }
  
  // 如果所有都是0，说明是出生当天
  if (parts.length === 0) {
    return '0天'
  }
  
  return parts.join(' + ')
}

/**
 * B轨：医院统计逻辑
 * 用途：统计"今日喂奶量"、"今日大便次数"以及"历史趋势图"
 * 换日点：北京时间 06:00
 * 逻辑：
 *   - 如果当前时间 < 06:00，属于"昨天统计日"
 *   - 如果当前时间 >= 06:00，属于"今天统计日"
 * 返回 UTC 时间，用于数据库查询
 */
export function getTodayStart(): Date {
  // 获取当前北京时间
  const now = new Date()
  const beijingNow = toZonedTime(now, TIMEZONE)
  
  // 创建今天北京时间 06:00
  const todayStartBeijing = new Date(beijingNow)
  todayStartBeijing.setHours(STATS_DAY_START_HOUR, 0, 0, 0)
  todayStartBeijing.setMinutes(0)
  todayStartBeijing.setSeconds(0)
  todayStartBeijing.setMilliseconds(0)
  
  // 如果当前北京时间的小时 < 6，则 DayStart = 昨天北京时间 06:00
  if (beijingNow.getHours() < STATS_DAY_START_HOUR) {
    todayStartBeijing.setDate(todayStartBeijing.getDate() - 1)
  }
  
  // 将北京时间转换为 UTC 时间返回（用于数据库查询）
  return fromZonedTime(todayStartBeijing, TIMEZONE)
}

export function formatDuration(startTime: Date, endTime?: Date): string {
  const end = endTime || new Date()
  const start = new Date(startTime)
  
  // 如果开始时间晚于结束时间，返回"刚刚"
  if (start > end) {
    return '刚刚'
  }
  
  const diffMs = end.getTime() - start.getTime()
  
  // 如果时间差为负数或接近0，返回"刚刚"
  if (diffMs <= 0) {
    return '刚刚'
  }
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 0) {
    return `${hours}小时${minutes}分`
  }
  return `${minutes}分钟`
}

export function formatDateTime(date: Date): string {
  return format(date, 'yyyy-MM-dd HH:mm', { locale: zhCN })
}

export function formatTimeAgo(date: Date): string {
  const now = new Date()
  const beijingNow = toZonedTime(now, TIMEZONE)
  const beijingDate = toZonedTime(date, TIMEZONE)
  
  const days = differenceInDays(beijingNow, beijingDate)
  
  if (days === 0) {
    return '今天'
  } else if (days === 1) {
    return '1天前'
  } else {
    return `${days}天前`
  }
}
