import { useState, useEffect, useRef } from 'react'

const DB_NAME = 'todo-backup-db'
const STORE = 'handles'
const HANDLE_KEY = 'dirHandle'

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function saveHandle(db, handle) {
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE, 'readwrite').objectStore(STORE).put(handle, HANDLE_KEY)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

function loadHandle(db) {
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE, 'readonly').objectStore(STORE).get(HANDLE_KEY)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function clearHandle(db) {
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE, 'readwrite').objectStore(STORE).delete(HANDLE_KEY)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

async function performBackup(handle, tasks) {
  const now = new Date()
  const dateStr = now.toISOString().slice(0, 10)
  const fileName = `todo-backup-${dateStr}.json`
  const content = JSON.stringify({ exportedAt: now.toISOString(), tasks }, null, 2)
  const fileHandle = await handle.getFileHandle(fileName, { create: true })
  const writable = await fileHandle.createWritable()
  await writable.write(content)
  await writable.close()
  return now
}

const isSupported = typeof window !== 'undefined' && 'showDirectoryPicker' in window

export default function useAutoBackup(tasks) {
  const [dirHandle, setDirHandle] = useState(null)
  const [lastBackupTime, setLastBackupTime] = useState(null)
  const dbRef = useRef(null)
  const tasksRef = useRef(tasks)

  useEffect(() => { tasksRef.current = tasks }, [tasks])

  // On mount: restore saved handle from IndexedDB if permission is still granted
  useEffect(() => {
    if (!isSupported) return
    openDB()
      .then(db => { dbRef.current = db; return loadHandle(db) })
      .then(handle => {
        if (!handle) return
        handle.queryPermission({ mode: 'readwrite' }).then(state => {
          if (state === 'granted') {
            setDirHandle(handle)
          } else {
            clearHandle(dbRef.current)
          }
        })
      })
      .catch(() => {})
  }, [])

  // Start backup interval whenever a directory handle becomes available
  useEffect(() => {
    if (!dirHandle) return
    const FOUR_HOURS = 4 * 60 * 60 * 1000
    performBackup(dirHandle, tasksRef.current).then(t => setLastBackupTime(t)).catch(() => {})
    const id = setInterval(() => {
      performBackup(dirHandle, tasksRef.current).then(t => setLastBackupTime(t)).catch(() => {})
    }, FOUR_HOURS)
    return () => clearInterval(id)
  }, [dirHandle])

  async function setFolder() {
    if (!isSupported) return
    let handle
    try {
      handle = await window.showDirectoryPicker({ mode: 'readwrite' })
    } catch {
      return
    }
    await saveHandle(dbRef.current, handle)
    setDirHandle(handle)
  }

  return { isSupported, lastBackupTime, setFolder }
}
