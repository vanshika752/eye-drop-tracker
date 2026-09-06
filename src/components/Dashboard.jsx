import React from 'react'
import { dosesForDay, formatTime, formatTimestamp, dateKey, formatDateLong } from '../lib/schedule.js'

export default function Dashboard({ drops, confirmations, onConfirm, onUndo }) {
  const today = dateKey()
  const doses = dosesForDay(drops)
  const todaysConfirmations = confirmations[today] || {}

  const completedCount = doses.filter((d) => todaysConfirmations[d.key]).length
  const total = doses.length
  const pct = total === 0 ? 0 : Math.round((completedCount / total) * 100)

  return (
    <div>
      <header className="app-header">
        <h1>Mum's eye drops</h1>
        <p className="subtitle">{formatDateLong(today)}</p>
      </header>

      {total > 0 && (
        <div className="progress-block">
          <div className="progress-row">
            <span>Today's progress</span>
            <strong>
              {completedCount} / {total} doses given
            </strong>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      {total === 0 ? (
        <div className="empty-state">
          <p>No eye drops set up yet.</p>
          <p>Go to the "Manage" tab to add the routine exactly as prescribed.</p>
        </div>
      ) : (
        <div className="dose-list">
          {doses.map((dose) => {
            const confirmedAt = todaysConfirmations[dose.key]
            return (
              <div key={dose.key} className={`dose-card${confirmedAt ? ' completed' : ''}`}>
                <div className="dose-info">
                  <div className="dose-time">{formatTime(dose.time)}</div>
                  <div className="dose-name">{dose.dropName}</div>
                  {dose.note && <div className="dose-note">{dose.note}</div>}
                </div>

                {confirmedAt ? (
                  <div className="done-pill">
                    <div className="dose-confirmed">✓ Given at {formatTimestamp(confirmedAt)}</div>
                    <button
                      type="button"
                      className="dose-undo"
                      onClick={() => onUndo(today, dose.key)}
                    >
                      Undo
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="confirm-btn"
                    onClick={() => onConfirm(today, dose.key)}
                  >
                    ✓ Confirm
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
