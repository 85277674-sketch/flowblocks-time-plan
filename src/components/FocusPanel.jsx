import { BellOff, CircleStop, Focus, Play, TimerReset } from "lucide-react";

const durationOptions = [15, 25, 45, 60];

export default function FocusPanel({
  activeFocusSession,
  focusDuration,
  now,
  onChangeDuration,
  onFinish,
  onStart,
}) {
  const remainingSeconds = activeFocusSession
    ? Math.max(
        0,
        activeFocusSession.durationMinutes * 60 -
          Math.floor((now - activeFocusSession.startedAt) / 1000),
      )
    : focusDuration * 60;
  const progress = activeFocusSession
    ? 1 - remainingSeconds / (activeFocusSession.durationMinutes * 60)
    : 0;

  return (
    <section className="tool-screen section-enter" aria-labelledby="focus-title">
      <div className="screen-header">
        <p className="section-eyebrow">Focus Mode</p>
        <h1 id="focus-title">进入一段安静时间</h1>
        <p>开始后进入专注状态，把通知和分心先放到门外。</p>
      </div>

      <div className="focus-hero">
        <div
          className="focus-ring"
          style={{ "--focus-progress": `${Math.round(progress * 360)}deg` }}
        >
          <span>{formatCountdown(remainingSeconds)}</span>
          <small>{activeFocusSession ? "专注中" : "准备开始"}</small>
        </div>
        <div className={activeFocusSession ? "focus-system is-on" : "focus-system"}>
          <BellOff size={17} />
          {activeFocusSession ? "iOS 勿扰模式已联动" : "iOS 勿扰模式待启动"}
        </div>
      </div>

      <div className="settings-card">
        <div className="card-title-row">
          <TimerReset size={18} />
          <h2>设置专注时长</h2>
        </div>
        <div className="duration-grid">
          {durationOptions.map((minutes) => (
            <button
              className={focusDuration === minutes ? "duration-button is-selected" : "duration-button"}
              disabled={Boolean(activeFocusSession)}
              key={minutes}
              type="button"
              onClick={() => onChangeDuration(minutes)}
            >
              {minutes}m
            </button>
          ))}
        </div>
        <label className="duration-slider">
          <span>{focusDuration} 分钟</span>
          <input
            disabled={Boolean(activeFocusSession)}
            max="120"
            min="5"
            step="5"
            type="range"
            value={focusDuration}
            onChange={(event) => onChangeDuration(Number(event.target.value))}
          />
        </label>
      </div>

      {activeFocusSession ? (
        <button className="primary-button focus-action danger-soft" type="button" onClick={onFinish}>
          <CircleStop size={18} />
          结束专注
        </button>
      ) : (
        <button className="primary-button focus-action" type="button" onClick={onStart}>
          <Play size={18} />
          开始专注
        </button>
      )}

      <div className="soft-note">
        <Focus size={16} />
        Web 原型会记录专注时间；正式 iOS App 可接入系统 Focus/勿扰能力。
      </div>
    </section>
  );
}

function formatCountdown(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
