// Helpers for turning "drops" (the prescribed routine) into a flat, sorted
// list of individual doses for a given day, and for formatting dates/times.

// Local calendar date as YYYY-MM-DD (not UTC), so "today" matches the
// device's clock, not GMT.
export function dateKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function doseKey(dropId, time) {
  return `${dropId}_${time}`
}

// "08:00" -> "8:00 AM"
export function formatTime(time24) {
  const [hStr, mStr] = time24.split(':')
  let h = parseInt(hStr, 10)
  const m = mStr || '00'
  const suffix = h >= 12 ? 'PM' : 'AM'
  h = h % 12
  if (h === 0) h = 12
  return `${h}:${m} ${suffix}`
}

// Format an ISO timestamp as a local time string, e.g. "8:07 AM"
export function formatTimestamp(isoString) {
  const d = new Date(isoString)
  let h = d.getHours()
  const m = String(d.getMinutes()).padStart(2, '0')
  const suffix = h >= 12 ? 'PM' : 'AM'
  h = h % 12
  if (h === 0) h = 12
  return `${h}:${m} ${suffix}`
}

export function formatDateLong(dKey) {
  const [y, m, d] = dKey.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })
}

// Build the flat, time-sorted list of doses for one calendar day from the
// list of prescribed drops. Each entry: { dropId, dropName, note, time, key }
export function dosesForDay(drops) {
  const doses = []
  for (const drop of drops) {
    for (const time of drop.times) {
      doses.push({
        dropId: drop.id,
        dropName: drop.name,
        note: drop.note,
        time,
        key: doseKey(drop.id, time)
      })
    }
  }
  doses.sort((a, b) => a.time.localeCompare(b.time))
  return doses
}
