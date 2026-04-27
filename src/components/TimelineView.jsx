import { useEffect, useMemo, useRef, useState } from "react";
import { Clock3, GripVertical } from "lucide-react";
import TimeBlockCard from "./TimeBlockCard.jsx";
import {
  DAY_END_MINUTES,
  DAY_START_MINUTES,
  clamp,
  formatClock,
  roundToStep,
} from "../data/schedule.js";

const PIXELS_PER_MINUTE = 1.05;
const MIN_TASK_MINUTES = 15;

export default function TimelineView({
  activeTaskId,
  onSelectTask,
  onToggleComplete,
  onUpdateTaskTime,
  tasks,
}) {
  const trackRef = useRef(null);
  const [interaction, setInteraction] = useState(null);

  const timelineHeight = (DAY_END_MINUTES - DAY_START_MINUTES) * PIXELS_PER_MINUTE;
  const timeLabels = useMemo(() => {
    const labels = [];
    for (let minutes = DAY_START_MINUTES; minutes <= DAY_END_MINUTES; minutes += 120) {
      labels.push(minutes);
    }
    return labels;
  }, []);

  useEffect(() => {
    if (!interaction) {
      return undefined;
    }

    function handlePointerMove(event) {
      if (!trackRef.current) {
        return;
      }

      const deltaMinutes = roundToStep((event.clientY - interaction.startY) / PIXELS_PER_MINUTE);

      if (interaction.type === "move") {
        const duration = interaction.originalEnd - interaction.originalStart;
        const nextStart = clamp(
          interaction.originalStart + deltaMinutes,
          DAY_START_MINUTES,
          DAY_END_MINUTES - duration,
        );
        onUpdateTaskTime(interaction.taskId, nextStart, nextStart + duration);
      }

      if (interaction.type === "resize") {
        const nextEnd = clamp(
          interaction.originalEnd + deltaMinutes,
          interaction.originalStart + MIN_TASK_MINUTES,
          DAY_END_MINUTES,
        );
        onUpdateTaskTime(interaction.taskId, interaction.originalStart, nextEnd);
      }
    }

    function handlePointerUp() {
      setInteraction(null);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [interaction, onUpdateTaskTime]);

  function startInteraction(event, task, type) {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    onSelectTask(task.id);
    setInteraction({
      taskId: task.id,
      type,
      startY: event.clientY,
      originalStart: task.startMinutes,
      originalEnd: task.endMinutes,
    });
  }

  return (
    <section className="timeline-section section-enter" aria-labelledby="timeline-title">
      <div className="section-heading">
        <div>
          <p className="section-eyebrow">AI Timeline</p>
          <h2 id="timeline-title">今日时间表</h2>
        </div>
        <div className="timeline-hint">
          <GripVertical size={15} />
          拖动到时间
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-timeline">
          <Clock3 size={20} />
          还没有安排。输入几件事，我会帮你生成今日时间表。
        </div>
      ) : (
        <div className="timeline-canvas" style={{ "--timeline-height": `${timelineHeight}px` }}>
          <div className="timeline-scale" aria-hidden="true">
            {timeLabels.map((minutes) => (
              <time
                className="time-label"
                dateTime={formatClock(minutes)}
                key={minutes}
                style={{
                  top: `${(minutes - DAY_START_MINUTES) * PIXELS_PER_MINUTE}px`,
                }}
              >
                {formatClock(minutes)}
              </time>
            ))}
          </div>

          <div className="timeline-track" ref={trackRef}>
            {timeLabels.map((minutes) => (
              <span
                className="timeline-hour-line"
                key={minutes}
                style={{
                  top: `${(minutes - DAY_START_MINUTES) * PIXELS_PER_MINUTE}px`,
                }}
              />
            ))}
            {tasks.map((task) => (
              <TimeBlockCard
                height={Math.max(62, task.durationMinutes * PIXELS_PER_MINUTE - 4)}
                isActive={activeTaskId === task.id}
                isDragging={interaction?.taskId === task.id}
                key={task.id}
                onMoveStart={(event) => startInteraction(event, task, "move")}
                onResizeStart={(event) => startInteraction(event, task, "resize")}
                onSelect={() => onSelectTask(task.id)}
                onToggleComplete={() => onToggleComplete(task.id)}
                task={task}
                top={(task.startMinutes - DAY_START_MINUTES) * PIXELS_PER_MINUTE}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
