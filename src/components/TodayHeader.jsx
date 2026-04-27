import { Bell, Sparkles } from "lucide-react";

export default function TodayHeader({ todayLabel }) {
  return (
    <header className="today-header section-enter">
      <div>
        <p className="date-label">{todayLabel}</p>
        <h1>今天先把节奏排好</h1>
        <p className="header-copy">
          把要做的事丢进来，我帮你排成一张可执行的时间表。
        </p>
        <span className="ai-status">
          <Sparkles size={15} />
          AI Ready
        </span>
      </div>
      <div className="header-actions" aria-label="今日状态">
        <button className="icon-button" type="button" aria-label="通知">
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
}
