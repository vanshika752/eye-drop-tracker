// Data lives in Firebase Realtime Database so both phones see the same
// routine and the same confirmations, live. A small localStorage cache is
// kept purely so the app has something to show immediately on load
// (including briefly offline) - Firebase is always the source of truth
// once it connects.
//
// Database shape (see database.rules.json for the matching security rules):
//
// /drops/<dropId>: { name, timesPerDay, times: [...], note }
// /confirmations/<YYYY-MM-DD>/<dropId>_<time>: "<ISO timestamp>"

import { ref, onValue, set, remove, runTransaction } from 'firebase/database'
import { db } from './firebase.js'

const DROPS_CACHE_KEY = 'eyedrop_cache_drops_v1'
const CONFIRMATIONS_CACHE_KEY = 'eyedrop_cache_confirmations_v1'

function readCache(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeCache(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or unavailable - safe to ignore, it's only a cache.
  }
}

export function getCachedDrops() {
  return readCache(DROPS_CACHE_KEY, [])
}

export function getCachedConfirmations() {
  return readCache(CONFIRMATIONS_CACHE_KEY, {})
}

// Subscribes to /drops in real time. Calls onData(dropsArray) immediately
// with cached data, then again every time Firebase pushes an update (from
// either phone). Returns an unsubscribe function.
export function subscribeToDrops(onData) {
  const dropsRef = ref(db, 'drops')
  return onValue(dropsRef, (snapshot) => {
    const value = snapshot.val() || {}
    const drops = Object.entries(value).map(([id, drop]) => ({
      id,
      ...drop,
      times: Array.isArray(drop.times) ? drop.times : Object.values(drop.times || {})
    }))
    writeCache(DROPS_CACHE_KEY, drops)
    onData(drops)
  })
}

// Subscribes to /confirmations in real time, same pattern as above.
export function subscribeToConfirmations(onData) {
  const confirmationsRef = ref(db, 'confirmations')
  return onValue(confirmationsRef, (snapshot) => {
    const value = snapshot.val() || {}
    writeCache(CONFIRMATIONS_CACHE_KEY, value)
    onData(value)
  })
}

// Tracks whether this device currently has a live connection to Firebase
// (not just the internet in general). Useful for a small "offline" banner.
export function subscribeToConnectionState(onChange) {
  const connectedRef = ref(db, '.info/connected')
  return onValue(connectedRef, (snapshot) => {
    onChange(snapshot.val() === true)
  })
}

export function saveDrop(drop) {
  const { id, ...data } = drop
  return set(ref(db, `drops/${id}`), data)
}

export function deleteDrop(id) {
  return remove(ref(db, `drops/${id}`))
}

// Writes the confirmation only if no confirmation already exists for this
// exact dose today. The transaction is atomic on Firebase's servers, so
// even if both phones tap "Confirm" on the same dose within the same
// second, only the first write wins and the second is silently dropped -
// no duplicate confirmation is possible.
export function confirmDose(date, key, isoTimestamp) {
  const doseRef = ref(db, `confirmations/${date}/${key}`)
  return runTransaction(doseRef, (current) => {
    if (current) return undefined // already confirmed - abort, don't overwrite
    return isoTimestamp
  })
}

export function undoConfirmation(date, key) {
  return remove(ref(db, `confirmations/${date}/${key}`))
}

export function makeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'id_' + Date.now() + '_' + Math.random().toString(16).slice(2)
}
