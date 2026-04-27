import { Check, GripVertical } from "lucide-react";

export default function TimeBlockCard({
  height,
  isActive,
  isDragging,
  onMoveStart,
  onResizeStart,
  onSelect,
  onToggleComplete,
  task,
  top,
}) {
  const Icon = task.icon;
  const cardClassName = [
    "time-block",
    `time-block-${task.category}`,
    task.completed ? "is-completed" : "",
    isActive ? "is-active" : "",
    isDragging ? "is-dragging" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article
      className={cardClassName}
      onClick={onSelect}
      onPointerDown={onMoveStart}
      style={{
        "--block-height": `${height}px`,
        "--block-top": `${top}px`,
      }}
    >
      <button
        className="complete-button"
        type="button"
        aria-label={task.completed ? "标记为未完成" : "标记为已完成"}
        onClick={(event) => {
          event.stopPropagation();
          onToggleComplete();
        }}
        onPointerDown={(event) => event.stopPropagation()}
      >
        {task.completed && <Check size={14} />}
      </button>
      <div className="block-icon" aria-hidden="true">
        <Icon size={19} />
      </div>
      <div className="block-content">
        <div className="block-title-row">
          <h3>{task.title}</h3>
          <span className="drag-handle" aria-hidden="true">
            <GripVertical size={16} />
          </span>
        </div>
        <p>
          {task.timeRange} · {task.duration}
        </p>
        <span className="status-pill">{task.status}</span>
      </div>
      <button
        className="resize-handle"
        type="button"
        aria-label={`调整 ${task.title} 时长`}
        onClick={(event) => event.stopPropagation()}
        onPointerDown={onResizeStart}
      />
    </article>
  );
}
