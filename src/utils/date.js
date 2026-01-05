export function pad2(value) {
  return String(value).padStart(2, '0')
}

export function toISODateString(date) {
  const year = date.getFullYear()
  const month = pad2(date.getMonth() + 1)
  const day = pad2(date.getDate())
  return `${year}-${month}-${day}`
}

export function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function endOfDay(date) {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

export function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function isSameISODate(aISO, bISO) {
  return aISO === bISO
}

export function formatShortDate(isoDate) {
  if (!isoDate) return ''
  const [y, m, d] = isoDate.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

export function formatLongDate(isoDate) {
  if (!isoDate) return ''
  const [y, m, d] = isoDate.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function getTodayISO() {
  return toISODateString(new Date())
}

export function getWeekStartISO(date = new Date()) {
  const d = startOfDay(date)
  const day = d.getDay() // 0 Sunday
  const diff = (day + 6) % 7 // Monday start
  const monday = addDays(d, -diff)
  return toISODateString(monday)
}

export function getLastNWeekStartsISO(weeksCount) {
  const starts = []
  const currentWeekStart = new Date(getWeekStartISO())
  for (let i = weeksCount - 1; i >= 0; i -= 1) {
    const weekStart = addDays(currentWeekStart, -7 * i)
    starts.push(toISODateString(weekStart))
  }
  return starts
}
