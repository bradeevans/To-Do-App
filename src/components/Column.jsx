import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import TaskCard from './TaskCard'

export default function Column({ id, label, tasks, onDelete, onUpdate, onClearDone }) {
  const { setNodeRef, isOver } = useDroppable({ id })

  function handleClearDone() {
    if (window.confirm('Are you sure you want to remove all done items?')) {
      onClearDone()
    }
  }

  return (
    <div className={`column${isOver ? ' column--over' : ''}`} data-col={id}>
      <div className="column-header">
        <h2 className="column-title">{label}</h2>
        {onClearDone && tasks.length > 0 && (
          <button className="clear-done-btn" onClick={handleClearDone}>
            Clear All
          </button>
        )}
      </div>
      <div className="column-body" ref={setNodeRef}>
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isDone={id === 'done'}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="column-empty">Drop tasks here</div>
        )}
      </div>
    </div>
  )
}
