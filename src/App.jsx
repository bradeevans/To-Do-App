import { useState, useEffect, useCallback } from 'react'
import {
  DndContext,
  closestCorners,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import AddTaskBar from './components/AddTaskBar'
import Column from './components/Column'
import BackupStatus from './components/BackupStatus'
import useAutoBackup from './hooks/useAutoBackup'

const COLUMN_IDS = ['today', 'this-week', 'later', 'done']
const COLUMN_LABELS = {
  today: 'Today',
  'this-week': 'This Week',
  later: 'Later',
  done: 'Done',
}

const STORAGE_KEY = 'todo-app-tasks'

function loadTasks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export default function App() {
  const [tasks, setTasks] = useState(loadTasks)
  const [activeTask, setActiveTask] = useState(null)
  const backup = useAutoBackup(tasks)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  )

  const addTask = useCallback(({ title, description, column }) => {
    setTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title,
        description,
        column,
      },
    ])
  }, [])

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const updateTask = useCallback((id, updates) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    )
  }, [])

  const clearDone = useCallback(() => {
    setTasks((prev) => prev.filter((t) => t.column !== 'done'))
  }, [])

  function handleDragStart(event) {
    const task = tasks.find((t) => t.id === event.active.id)
    setActiveTask(task ?? null)
  }

  function handleDragOver(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    // Only handle cross-column moves here (over a task card in a different column)
    if (COLUMN_IDS.includes(over.id)) return
    setTasks((prev) => {
      const activeTask = prev.find((t) => t.id === active.id)
      const overTask = prev.find((t) => t.id === over.id)
      if (!activeTask || !overTask || activeTask.column === overTask.column) return prev
      const updated = prev.map((t) =>
        t.id === active.id ? { ...t, column: overTask.column } : t
      )
      const activeIndex = updated.findIndex((t) => t.id === active.id)
      const overIndex = updated.findIndex((t) => t.id === over.id)
      return arrayMove(updated, activeIndex, overIndex)
    })
  }

  function handleDragEnd(event) {
    const { active, over } = event
    setActiveTask(null)
    if (!over || active.id === over.id) return
    // Drop onto a column directly (empty column or column header area)
    if (COLUMN_IDS.includes(over.id)) {
      setTasks((prev) =>
        prev.map((t) => (t.id === active.id ? { ...t, column: over.id } : t))
      )
      return
    }
    // Same-column reorder
    setTasks((prev) => {
      const activeTask = prev.find((t) => t.id === active.id)
      const overTask = prev.find((t) => t.id === over.id)
      if (!activeTask || !overTask || activeTask.column !== overTask.column) return prev
      const activeIndex = prev.findIndex((t) => t.id === active.id)
      const overIndex = prev.findIndex((t) => t.id === over.id)
      return arrayMove(prev, activeIndex, overIndex)
    })
  }

  function handleDragCancel() {
    setActiveTask(null)
  }

  return (
    <div className="app">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <AddTaskBar onAdd={addTask} />
        <div className="board">
          {COLUMN_IDS.map((colId) => (
            <Column
              key={colId}
              id={colId}
              label={COLUMN_LABELS[colId]}
              tasks={tasks.filter((t) => t.column === colId)}
              onDelete={deleteTask}
              onUpdate={updateTask}
              onClearDone={colId === 'done' ? clearDone : undefined}
            />
          ))}
        </div>
        <BackupStatus
          isSupported={backup.isSupported}
          lastBackupTime={backup.lastBackupTime}
          setFolder={backup.setFolder}
        />
        <DragOverlay dropAnimation={{ duration: 180, easing: 'ease' }}>
          {activeTask ? (
            <div className="task-card drag-overlay-card">
              <p className="task-title">{activeTask.title}</p>
              {activeTask.description && (
                <p className="task-desc">{activeTask.description}</p>
              )}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
