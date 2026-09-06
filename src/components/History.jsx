import React from 'react'
import { dosesForDay, formatTime, formatTimestamp, formatDateLong, dateKey } from '../lib/schedule.js'
import { exportJSON, exportCSV } from '../lib/exportData.js'

export default function History({ drops, confirmations }) {
  const today = dateKey()
  const doses = dosesForDay(drops)

  // Every date that has at least one confirmation, plus today, newest first.
  const dates = Array.from(new Set([...Object.keys(confirmations), today]))
    .filter((d) => d !== today || doses.length > 0)
    .sort()
    .reverse()

  return (
    <div className="page">
      <h2>History</h2>

      <div className="export-row">
        <button
          type="button"
          className="secondary-btn"
          style={{ marginTop: 0 }}
          onClick={() => exportCSV(drops, confirmations)}
        >
          Export CSV
        </button>
        <button
          type="button"
          className="secondary-btn"
          style={{ marginTop: 0 }}
          onClick={() => exportJSON(drops, confirmations)}
        >
          Export JSON
        </button>
      </div>

      {doses.length === 0 ? (
        <p className="empty-state" style={{ margin: 0 }}>
          Nothing to show yet. Add eye drops in the "Manage" tab first.
        </p>
      ) : (
        dates.map((date) => {
          const dayConfirmations = confirmations[date] || {}
          return (
            <div className="history-day" key={date}>
              <h3>{formatDateLong(date)}</h3>
              {doses.map((dose) => {
                const confirmedAt = dayConfirmations[dose.key]
                return (
                  <div className="history-row" key={dose.key}>
                    <div className="h-left">
                      <div className="h-name">{dose.dropName}</div>
                      <div className="h-time">Scheduled {formatTime(dose.time)}</div>
                    </div>
                    {confirmedAt ? (
                      <div className="history-status completed">
                        ✓ {formatTimestamp(confirmedAt)}
                      </div>
                    ) : (
                      <div className="history-status pending">Pending</div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })
      )}
    </div>
  )
}
