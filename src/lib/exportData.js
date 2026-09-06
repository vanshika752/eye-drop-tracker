import { dosesForDay, formatTime, formatTimestamp } from './schedule.js'

function buildRows(drops, confirmations) {
  const dates = Object.keys(confirmations).sort()
  const doses = dosesForDay(drops)
  const rows = []
  for (const date of dates) {
    const dayConfirmations = confirmations[date]
    for (const dose of doses) {
      const confirmedAt = dayConfirmations[dose.key]
      if (!confirmedAt) continue // only export doses that were actually recorded that day
      rows.push({
        date,
        dropName: dose.dropName,
        scheduledTime: formatTime(dose.time),
        confirmedAtTime: formatTimestamp(confirmedAt),
        confirmedAtISO: confirmedAt,
        status: 'Completed'
      })
    }
  }
  return rows
}

function download(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function exportJSON(drops, confirmations) {
  const payload = { drops, confirmations, exportedAt: new Date().toISOString() }
  download('eye-drop-history.json', JSON.stringify(payload, null, 2), 'application/json')
}

export function exportCSV(drops, confirmations) {
  const rows = buildRows(drops, confirmations)
  const header = ['Date', 'Eye Drop', 'Scheduled Time', 'Given At', 'Given At (ISO)', 'Status']
  const lines = [header.join(',')]
  for (const row of rows) {
    lines.push(
      [row.date, row.dropName, row.scheduledTime, row.confirmedAtTime, row.confirmedAtISO, row.status]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    )
  }
  download('eye-drop-history.csv', lines.join('\n'), 'text/csv')
}
