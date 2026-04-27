import { useEffect, useMemo, useState } from "react";
import AppShell from "./components/AppShell.jsx";
import FocusPanel from "./components/FocusPanel.jsx";
import FloatingTabBar from "./components/FloatingTabBar.jsx";
import MorePanel from "./components/MorePanel.jsx";
import TodayHeader from "./components/TodayHeader.jsx";
import NaturalLanguageInputCard from "./components/NaturalLanguageInputCard.jsx";
import ReviewPanel from "./components/ReviewPanel.jsx";
import TimelineView from "./components/TimelineView.jsx";
import {
  applyTimeToTask,
  createSuggestedSchedule,
  formatDuration,
  initialPrompt,
  quickTaskChips,
} from "./data/schedule.js";

const wallpaperOptions = [
  { id: "midnight", name: "Midnight" },
  { id: "mist", name: "Blue Mist" },
  { id: "aurora", name: "Aurora" },
  { id: "deep", name: "Deep Sea" },
];

export default function App() {
  const initialSchedule = useMemo(() => createSuggestedSchedule(initialPrompt), []);
  const [activeTab, setActiveTab] = useState("today");
  const [wallpaper, setWallpaper] = useState("midnight");
  const [prompt, setPrompt] = useState(initialPrompt);
  const [tasks, setTasks] = useState(initialSchedule.tasks);
  const [scheduleMeta, setScheduleMeta] = useState(initialSchedule.meta);
  const [activeTaskId, setActiveTaskId] = useState(initialSchedule.tasks[0]?.id ?? null);
  const [focusDuration, setFocusDuration] = useState(25);
  const [activeFocusSession, setActiveFocusSession] = useState(null);
  const [focusSessions, setFocusSessions] = useState([]);
  const [reviewNote, setReviewNote] = useState("");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!activeFocusSession) {
      return;
    }

    const elapsedSeconds = Math.floor((now - activeFocusSession.startedAt) / 1000);
    if (elapsedSeconds >= activeFocusSession.durationMinutes * 60) {
      finishFocusSession();
    }
  }, [activeFocusSession, now]);

  const todayLabel = useMemo(() => {
    return new Intl.DateTimeFormat("zh-CN", {
      month: "long",
      day: "numeric",
      weekday: "long",
    }).format(new Date());
  }, []);

  function handleAutoSchedule() {
    const nextSchedule = createSuggestedSchedule(prompt);
    setTasks(nextSchedule.tasks);
    setScheduleMeta(nextSchedule.meta);
    setActiveTaskId(nextSchedule.tasks[0]?.id ?? null);
  }

  function handleChipClick(chip) {
    const trimmed = prompt.trim();
    setPrompt(trimmed ? `${trimmed}、${chip}` : chip);
  }

  function handleToggleComplete(taskId) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              completedAt: task.completed ? null : Date.now(),
            }
          : task,
      ),
    );
  }

  function handleUpdateTaskTime(taskId, startMinutes, endMinutes) {
    setTasks((currentTasks) =>
      currentTasks
        .map((task) =>
          task.id === taskId ? applyTimeToTask(task, startMinutes, endMinutes) : task,
        )
        .sort((a, b) => a.startMinutes - b.startMinutes),
    );
  }

  function handleTabChange(tabId) {
    setActiveTab(tabId);
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function startFocusSession() {
    setActiveFocusSession({
      id: `focus-${Date.now()}`,
      startedAt: Date.now(),
      durationMinutes: focusDuration,
    });
  }

  function finishFocusSession() {
    setActiveFocusSession((session) => {
      if (!session) {
        return null;
      }

      setFocusSessions((sessions) => [
        {
          ...session,
          endedAt: Date.now(),
          actualMinutes: Math.max(1, Math.round((Date.now() - session.startedAt) / 60000)),
        },
        ...sessions,
      ]);

      return null;
    });
  }

  const focusStats = useMemo(() => {
    const finishedMinutes = focusSessions.reduce(
      (total, session) => total + session.actualMinutes,
      0,
    );
    const activeMinutes = activeFocusSession
      ? Math.min(
          activeFocusSession.durationMinutes,
          Math.floor((now - activeFocusSession.startedAt) / 60000),
        )
      : 0;

    return {
      totalMinutes: finishedMinutes + activeMinutes,
      sessionCount: focusSessions.length + (activeFocusSession ? 1 : 0),
      label: formatDuration(finishedMinutes + activeMinutes),
    };
  }, [activeFocusSession, focusSessions, now]);

  const lateTasks = useMemo(() => {
    const currentMinutes = getMinutesOfDay(now);

    return tasks
      .map((task) => {
        const completedMinutes = task.completedAt ? getMinutesOfDay(task.completedAt) : null;
        const compareMinutes = completedMinutes ?? currentMinutes;
        const lateMinutes = compareMinutes - task.endMinutes;

        return {
          ...task,
          lateMinutes,
          lateLabel: formatDuration(Math.max(0, lateMinutes)),
        };
      })
      .filter((task) => task.lateMinutes > 0 && (!task.completed || task.completedAt))
      .sort((a, b) => b.lateMinutes - a.lateMinutes);
  }, [now, tasks]);

  let screenContent = null;

  if (activeTab === "today") {
    screenContent = (
      <>
        <TodayHeader todayLabel={todayLabel} />
        <NaturalLanguageInputCard
          chips={quickTaskChips}
          scheduleMeta={scheduleMeta}
          onAutoSchedule={handleAutoSchedule}
          onChipClick={handleChipClick}
          prompt={prompt}
          setPrompt={setPrompt}
        />
        <TimelineView
          activeTaskId={activeTaskId}
          onSelectTask={setActiveTaskId}
          onToggleComplete={handleToggleComplete}
          onUpdateTaskTime={handleUpdateTaskTime}
          tasks={tasks}
        />
      </>
    );
  }

  if (activeTab === "focus") {
    screenContent = (
      <FocusPanel
        activeFocusSession={activeFocusSession}
        focusDuration={focusDuration}
        now={now}
        onChangeDuration={setFocusDuration}
        onFinish={finishFocusSession}
        onStart={startFocusSession}
      />
    );
  }

  if (activeTab === "review") {
    screenContent = (
      <ReviewPanel
        focusStats={focusStats}
        lateTasks={lateTasks}
        reviewNote={reviewNote}
        setReviewNote={setReviewNote}
      />
    );
  }

  if (activeTab === "more") {
    screenContent = (
      <MorePanel
        onSelectWallpaper={setWallpaper}
        selectedWallpaper={wallpaper}
        wallpaperOptions={wallpaperOptions}
      />
    );
  }

  return (
    <AppShell wallpaper={wallpaper}>
      {screenContent}
      <FloatingTabBar activeTab={activeTab} onChange={handleTabChange} />
    </AppShell>
  );
}

function getMinutesOfDay(timestamp) {
  const date = new Date(timestamp);
  return date.getHours() * 60 + date.getMinutes();
}
