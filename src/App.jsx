import React, { useEffect, useState } from 'react'
import Dashboard from './components/Dashboard.jsx'
import ManageDrops from './components/ManageDrops.jsx'
import History from './components/History.jsx'
import TabBar from './components/TabBar.jsx'
import {
  subscribeToDrops,
  subscribeToConfirmations,
  subscribeToConnectionState,
  getCachedDrops,
  getCachedConfirmations,
  saveDrop,
  deleteDrop,
  confirmDose,
  undoConfirmation
} from './lib/storage.js'

export default function App() {
  const [tab, setTab] = useState('today')

  // Hydrate instantly from the last-synced local cache (so the screen
  // isn't blank while Firebase connects, or if briefly offline), then let
  // the live Firebase subscriptions take over below.
  const [drops, setDrops] = useState(() => getCachedDrops())
  const [confirmations, setConfirmations] = useState(() => getCachedConfirmations())
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const unsubDrops = subscribeToDrops(setDrops)
    const unsubConfirmations = subscribeToConfirmations(setConfirmations)
    const unsubConnection = subscribeToConnectionState(setIsOnline)

    return () => {
      unsubDrops()
      unsubConfirmations()
      unsubConnection()
    }
  }, [])

  function handleSaveDrop(drop) {
    saveDrop(drop).catch((err) => alert('Could not save: ' + err.message))
  }

  function handleDeleteDrop(id) {
    deleteDrop(id).catch((err) => alert('Could not delete: ' + err.message))
  }

  // The timestamp is generated right here, from this device's clock, the
  // instant the button is pressed - not typed in, not server-side.
  function handleConfirm(date, key) {
    const now = new Date().toISOString()

    // Optimistic local update so the tap feels instant even before the
    // round trip to Firebase completes; the transaction below still runs
    // as the real, authoritative duplicate-prevention check.
    setConfirmations((prev) => {
      const day = prev[date] || {}
      if (day[key]) return prev
      return { ...prev, [date]: { ...day, [key]: now } }
    })

    confirmDose(date, key, now).catch((err) => {
      console.error('Could not confirm dose:', err)
    })
  }

  function handleUndo(date, key) {
    setConfirmations((prev) => {
      const day = { ...(prev[date] || {}) }
      delete day[key]
      return { ...prev, [date]: day }
    })
    undoConfirmation(date, key).catch((err) => {
      console.error('Could not undo confirmation:', err)
    })
  }

  return (
    <div className="app">
      {!isOnline && (
        <div className="offline-banner">Offline - showing last synced data. Will update when back online.</div>
      )}

      {tab === 'today' && (
        <Dashboard
          drops={drops}
          confirmations={confirmations}
          onConfirm={handleConfirm}
          onUndo={handleUndo}
        />
      )}
      {tab === 'manage' && (
        <ManageDrops drops={drops} onSave={handleSaveDrop} onDelete={handleDeleteDrop} />
      )}
      {tab === 'history' && <History drops={drops} confirmations={confirmations} />}

      <TabBar active={tab} onChange={setTab} />
    </div>
  )
}
