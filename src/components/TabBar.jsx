import React from 'react'

const TABS = [
  { id: 'today', label: 'Today', icon: '✓' },
  { id: 'manage', label: 'Manage', icon: '✎' },
  { id: 'history', label: 'History', icon: '≡' }
]

export default function TabBar({ active, onChange }) {
  return (
    <nav className="tab-bar">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={tab.id === active ? 'active' : ''}
          onClick={() => onChange(tab.id)}
        >
          <span className="tab-icon">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
