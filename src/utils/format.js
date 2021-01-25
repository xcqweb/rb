/**
 * 格式化相关的
 */
import moment, { months } from 'moment'

//获取一年的天数
const getYearDays = function() {
  let y = new Date().getFullYear()
  let isLeap = ((0 === y % 4) && (0 === y % 100) || (0 === y % 400))
  return isLeap ? 366 : 365;
}
//时长换算成中文
export const formatDuration = function(duration = +new Date()) {
  const time = moment.duration(duration)
  const y = time.years() || ''
  const m = time.months() || ''
  const w = time.weeks() || ''
  const d = time.days() || ''
  const h = time.hours() || ''
  const mi = time.minutes() || ''
  const s = time.seconds() || ''
  return `${y && y + '年'}${m && m + '月'}${w && w + '周'}${d && d + '天'}${h && h + '小时'}${mi && mi + '分'}${(s ? s : 0) + '秒'}`
}