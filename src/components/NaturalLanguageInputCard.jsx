import { ArrowUpRight, WandSparkles } from "lucide-react";
import QuickTaskChips from "./QuickTaskChips.jsx";

export default function NaturalLanguageInputCard({
  chips,
  onAutoSchedule,
  onChipClick,
  prompt,
  scheduleMeta,
  setPrompt,
}) {
  return (
    <section className="nl-card section-enter" aria-label="AI 自然语言输入面板">
      <div className="card-kicker">
        <WandSparkles size={16} />
        AI Command
      </div>
      <label className="input-label" htmlFor="task-prompt" id="input-title">
        告诉我今天要做什么
      </label>
      <textarea
        id="task-prompt"
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        placeholder="今天要做作品集 2 小时、健身 40 分钟、晚上 8 点开会……"
        rows={4}
      />
      <div className="input-footer">
        <QuickTaskChips chips={chips} onChipClick={onChipClick} />
        <div className="ai-parse-row" aria-live="polite">
          <span>已识别 {scheduleMeta?.parsedCount ?? 0} 件事</span>
          <span>{scheduleMeta?.fixedCount ?? 0} 个固定时间</span>
        </div>
        <button className="primary-button" type="button" onClick={onAutoSchedule}>
          自动排程
          <ArrowUpRight size={17} />
        </button>
      </div>
    </section>
  );
}
