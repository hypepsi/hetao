/**
 * 喂养统计工具函数
 * 用于计算每日喂养的各项统计指标
 */

export interface FeedingRecord {
  startTime: string | Date
  amount: number
}

export interface DailyStats {
  totalCount: number
  averageAmount: number
  maxAmount: number               // 最大奶量
  minAmount: number               // 最小奶量
  averageInterval: number | null  // 分钟
  maxInterval: number | null      // 分钟
  minInterval: number | null      // 分钟
  shortIntervalCount: number      // <2小时的次数
  shortIntervalPercentage: number // 百分比（整数）
  hasData: boolean
}

const TWO_HOURS_IN_MINUTES = 120

/**
 * 计算每日喂养统计
 * @param feedings 当日喂养记录数组（已按时间升序排列）
 * @returns 统计结果对象
 */
export function calculateDailyStats(feedings: FeedingRecord[]): DailyStats {
  // 边界情况：无数据
  if (!feedings || feedings.length === 0) {
    return {
      totalCount: 0,
      averageAmount: 0,
      maxAmount: 0,
      minAmount: 0,
      averageInterval: null,
      maxInterval: null,
      minInterval: null,
      shortIntervalCount: 0,
      shortIntervalPercentage: 0,
      hasData: false,
    }
  }

  // 计算总次数和奶量统计
  const totalCount = feedings.length
  const amounts = feedings.map(f => f.amount)
  const totalAmount = amounts.reduce((sum, amt) => sum + amt, 0)
  const averageAmount = Math.round(totalAmount / totalCount)
  const maxAmount = Math.max(...amounts)
  const minAmount = Math.min(...amounts)

  // 边界情况：只有1条记录，无法计算间隔
  if (feedings.length === 1) {
    return {
      totalCount,
      averageAmount,
      maxAmount,
      minAmount,
      averageInterval: null,
      maxInterval: null,
      minInterval: null,
      shortIntervalCount: 0,
      shortIntervalPercentage: 0,
      hasData: true,
    }
  }

  // 计算时间间隔（单位：分钟）
  const intervals: number[] = []
  for (let i = 1; i < feedings.length; i++) {
    const prevTime = new Date(feedings[i - 1].startTime).getTime()
    const currTime = new Date(feedings[i].startTime).getTime()
    const intervalMinutes = (currTime - prevTime) / (1000 * 60)
    intervals.push(intervalMinutes)
  }

  // 计算间隔统计
  const averageInterval = Math.round(
    intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length
  )
  const maxInterval = Math.max(...intervals)
  const minInterval = Math.min(...intervals)

  // 计算短间隔（<2小时）统计
  const shortIntervals = intervals.filter(interval => interval < TWO_HOURS_IN_MINUTES)
  const shortIntervalCount = shortIntervals.length
  const shortIntervalPercentage = Math.round((shortIntervalCount / intervals.length) * 100)

  return {
    totalCount,
    averageAmount,
    maxAmount,
    minAmount,
    averageInterval: Math.round(averageInterval),
    maxInterval: Math.round(maxInterval),
    minInterval: Math.round(minInterval),
    shortIntervalCount,
    shortIntervalPercentage,
    hasData: true,
  }
}

/**
 * 格式化时间间隔为可读字符串
 * @param minutes 分钟数
 * @returns 格式化后的字符串，如 "1h 30m" 或 "45m"
 */
export function formatInterval(minutes: number | null): string {
  if (minutes === null) return '--'
  
  const hours = Math.floor(minutes / 60)
  const mins = Math.round(minutes % 60)
  
  if (hours > 0) {
    if (mins > 0) {
      return `${hours}h ${mins}m`
    }
    return `${hours}h`
  }
  
  return `${mins}m`
}

