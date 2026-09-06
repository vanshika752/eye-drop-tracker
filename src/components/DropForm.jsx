import React, { useState } from 'react'
import { makeId } from '../lib/storage.js'

function defaultTimes(count) {
  // No medical scheduling logic here - just placeholder slots for the
  // user to fill in with whatever their doctor prescribed.
  return Array.from({ length: count }, () => '')
}

export default function DropForm({ existing, onSave, onCancel, onDelete }) {
  const [name, setName] = useState(existing?.name || '')
  const [timesPerDay, setTimesPerDay] = useState(existing?.timesPerDay || 1)
  const [times, setTimes] = useState(existing?.times || defaultTimes(existing?.timesPerDay || 1))
  const [note, setNote] = useState(existing?.note || '')
  const [error, setError] = useState('')

  function handleTimesPerDayChange(value) {
    const n = Math.max(1, Math.min(10, parseInt(value, 10) || 1))
    setTimesPerDay(n)
    setTimes((prev) => {
      const next = prev.slice(0, n)
      while (next.length < n) next.push('')
      return next
    })
  }

  function handleTimeChange(index, value) {
    setTimes((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please enter the eye drop name.')
      return
    }
    if (times.some((t) => !t)) {
      setError('Please set a time for every dose.')
      return
    }
    setError('')
    onSave({
      id: existing?.id || makeId(),
      name: name.trim(),
      timesPerDay,
      times,
      note: note.trim()
    })
  }

  return (
    <div className="page">
      <h2>{existing ? 'Edit eye drop' : 'Add an eye drop'}</h2>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="drop-name">Eye drop name</label>
          <input
            id="drop-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Eye Drop A"
          />
        </div>

        <div className="field">
          <label htmlFor="times-per-day">Times per day (as prescribed)</label>
          <input
            id="times-per-day"
            type="number"
            min="1"
            max="10"
            value={timesPerDay}
            onChange={(e) => handleTimesPerDayChange(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Scheduled times</label>
          <div className="time-list">
            {times.map((t, i) => (
              <div className="time-row" key={i}>
                <span>{i + 1}.</span>
                <input
                  type="time"
                  value={t}
                  onChange={(e) => handleTimeChange(i, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="field">
          <label htmlFor="drop-note">Note (optional)</label>
          <textarea
            id="drop-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Left eye only, shake before use"
          />
        </div>

        {error && <p style={{ color: 'var(--danger)', fontSize: 14 }}>{error}</p>}

        <button type="submit" className="primary-btn">
          Save
        </button>
        <button type="button" className="secondary-btn" onClick={onCancel}>
          Cancel
        </button>
        {onDelete && (
          <button
            type="button"
            className="danger-btn"
            onClick={() => {
              if (confirm(`Remove "${existing.name}" from the routine?`)) {
                onDelete()
              }
            }}
          >
            Remove this eye drop
          </button>
        )}
      </form>
    </div>
  )
}
