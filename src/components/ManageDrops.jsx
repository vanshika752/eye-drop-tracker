import React, { useState } from 'react'
import { formatTime } from '../lib/schedule.js'
import DropForm from './DropForm.jsx'

export default function ManageDrops({ drops, onSave, onDelete }) {
  // null = showing the list, 'new' = adding, or a drop id = editing that drop
  const [editingId, setEditingId] = useState(null)

  if (editingId !== null) {
    const existing = editingId === 'new' ? null : drops.find((d) => d.id === editingId)
    return (
      <DropForm
        existing={existing}
        onCancel={() => setEditingId(null)}
        onSave={(drop) => {
          onSave(drop)
          setEditingId(null)
        }}
        onDelete={
          existing
            ? () => {
                onDelete(existing.id)
                setEditingId(null)
              }
            : null
        }
      />
    )
  }

  return (
    <div className="page">
      <h2>Manage eye drops</h2>

      {drops.length === 0 && (
        <p className="empty-state" style={{ margin: '0 0 20px' }}>
          Nothing added yet. Add each eye drop exactly as your mother's doctor prescribed it.
        </p>
      )}

      <div className="drop-list">
        {drops.map((drop) => (
          <button
            key={drop.id}
            type="button"
            className="drop-list-item"
            onClick={() => setEditingId(drop.id)}
          >
            <div>
              <div className="name">{drop.name}</div>
              <div className="meta">
                {drop.timesPerDay}x daily · {drop.times.map(formatTime).join(', ')}
              </div>
            </div>
            <span className="chevron">›</span>
          </button>
        ))}
      </div>

      <button type="button" className="add-new-btn" onClick={() => setEditingId('new')}>
        + Add an eye drop
      </button>
    </div>
  )
}
