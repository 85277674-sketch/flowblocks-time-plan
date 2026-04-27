import { AlertCircle, CheckCircle2, Clock3, NotebookPen } from "lucide-react";

export default function ReviewPanel({ focusStats, lateTasks, reviewNote, setReviewNote }) {
  return (
    <section className="tool-screen section-enter" aria-labelledby="review-title">
      <div className="screen-header">
        <p className="section-eyebrow">Daily Review</p>
        <h1 id="review-title">看看今天的节奏</h1>
        <p>不是为了责备自己，是为了知道明天怎么更顺。</p>
      </div>

      <div className="review-stats">
        <div className="review-stat-card">
          <Clock3 size={19} />
          <span>{focusStats.label}</span>
          <small>累计专注</small>
        </div>
        <div className="review-stat-card">
          <CheckCircle2 size={19} />
          <span>{focusStats.sessionCount}</span>
          <small>专注次数</small>
        </div>
      </div>

      <div className="settings-card">
        <div className="card-title-row">
          <AlertCircle size={18} />
          <h2>节奏偏移</h2>
        </div>
        {lateTasks.length > 0 ? (
          <div className="late-list">
            {lateTasks.map((task) => (
              <article className="late-item" key={task.id}>
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.timeRange}</p>
                </div>
                <span>慢了 {task.lateLabel}</span>
              </article>
            ))}
          </div>
        ) : (
          <p className="empty-copy">目前没有发现晚勾选的任务，节奏保持得不错。</p>
        )}
      </div>

      <div className="review-input-card">
        <div className="card-title-row">
          <NotebookPen size={18} />
          <h2>复盘总结</h2>
        </div>
        <textarea
          aria-label="复盘总结"
          placeholder="今天哪里顺？哪里卡住？明天可以给自己少一点阻力……"
          value={reviewNote}
          onChange={(event) => setReviewNote(event.target.value)}
        />
      </div>
    </section>
  );
}
