import { useState, useRef, useEffect } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function TaskCard({ task, isDone, onDelete, onUpdate }) {
  const [editingTitle, setEditingTitle] = useState(false)
  const [editingDesc, setEditingDesc] = useState(false)
  const [titleVal, setTitleVal] = useState(task.title)
  const [descVal, setDescVal] = useState(task.description)
  const titleRef = useRef(null)
  const descRef = useRef(null)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  })

  // Keep local inputs in sync with parent state updates
  useEffect(() => { setTitleVal(task.title) }, [task.title])
  useEffect(() => { setDescVal(task.description) }, [task.description])

  useEffect(() => { if (editingTitle) titleRef.current?.focus() }, [editingTitle])
  useEffect(() => { if (editingDesc) descRef.current?.focus() }, [editingDesc])

  const cardStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  }

  function saveTitle() {
    const val = titleVal.trim()
    if (val) {
      onUpdate(task.id, { title: val })
    } else {
      setTitleVal(task.title) // revert if blank
    }
    setEditingTitle(false)
  }

  function saveDesc() {
    onUpdate(task.id, { description: descVal.trim() })
    setEditingDesc(false)
  }

  return (
    <div className={`task-card${isDone ? ' task-card--done' : ''}`} ref={setNodeRef} style={cardStyle}>
      {/* Drag handle */}
      <div className="task-drag-handle" {...listeners} {...attributes}>
        ⠿
      </div>

      {/* Delete button */}
      <button
        className="task-delete"
        onClick={() => onDelete(task.id)}
        title="Delete task"
      >
        ×
      </button>

      {/* Title */}
      {editingTitle ? (
        <input
          ref={titleRef}
          className="task-field-edit task-title-edit"
          value={titleVal}
          onChange={(e) => setTitleVal(e.target.value)}
          onBlur={saveTitle}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); saveTitle() }
            if (e.key === 'Escape') { setTitleVal(task.title); setEditingTitle(false) }
          }}
        />
      ) : (
        <p
          className="task-title"
          onClick={() => setEditingTitle(true)}
          title="Click to edit"
        >
          {task.title}
        </p>
      )}

      {/* Description */}
      {editingDesc ? (
        <textarea
          ref={descRef}
          className="task-field-edit task-desc-edit"
          value={descVal}
          onChange={(e) => setDescVal(e.target.value)}
          onBlur={saveDesc}
          onKeyDown={(e) => {
            if (e.key === 'Escape') { setDescVal(task.description); setEditingDesc(false) }
          }}
          rows={2}
        />
      ) : (
        <p
          className={`task-desc${!task.description ? ' task-desc--empty' : ''}`}
          onClick={() => setEditingDesc(true)}
          title="Click to add notes"
        >
          {task.description || '+ add notes'}
        </p>
      )}
    </div>
  )
}
