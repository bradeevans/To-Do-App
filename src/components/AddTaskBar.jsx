import { useState } from 'react'

export default function AddTaskBar({ onAdd }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [column, setColumn] = useState('today')

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({ title: title.trim(), description: description.trim(), column })
    setTitle('')
    setDescription('')
  }

  return (
    <header className="add-task-bar">
      <form className="add-task-form" onSubmit={handleSubmit}>
        <div className="add-task-fields">
          <input
            className="add-task-input"
            type="text"
            placeholder="What needs doing?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoComplete="off"
          />
          <textarea
            className="add-task-desc"
            placeholder="Optional notes…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>
        <div className="add-task-actions">
          <select
            className="add-task-select"
            value={column}
            onChange={(e) => setColumn(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="this-week">This Week</option>
            <option value="later">Later</option>
          </select>
          <button type="submit" className="add-task-btn">
            Add
          </button>
        </div>
      </form>
    </header>
  )
}
