import {
  BookOpen,
  Brush,
  Dumbbell,
  LaptopMinimal,
  Moon,
  Shirt,
  Sparkles,
  Video,
} from "lucide-react";

export const DAY_START_MINUTES = 8 * 60;
export const DAY_END_MINUTES = 23 * 60;
export const SNAP_MINUTES = 5;

export const initialPrompt =
  "今天要做作品集 2 小时、健身 40 分钟、洗衣服、晚上 8 点开会。";

export const quickTaskChips = [
  "作品集 2 小时",
  "健身 40 分钟",
  "复盘今天",
  "晚上 8 点开会",
];

const categoryRules = [
  {
    category: "fixed",
    icon: Video,
    status: "固定事件",
    duration: 45,
    keywords: ["会议", "开会", "面试", "上课", "电话", "直播", "约"],
  },
  {
    category: "creative",
    icon: Brush,
    status: "创作时间",
    duration: 90,
    keywords: ["设计", "画", "剪辑", "拍摄", "写作", "创作"],
  },
  {
    category: "focus",
    icon: LaptopMinimal,
    status: "深度专注",
    duration: 90,
    keywords: ["作品集", "项目", "作业", "方案", "代码", "开发"],
  },
  {
    category: "study",
    icon: BookOpen,
    status: "学习推进",
    duration: 60,
    keywords: ["学习", "阅读", "论文", "复习", "考试", "课程"],
  },
  {
    category: "life",
    icon: Shirt,
    status: "生活任务",
    duration: 35,
    keywords: ["洗", "买", "打扫", "收拾", "取", "做饭", "洗衣服"],
  },
  {
    category: "creative",
    icon: Dumbbell,
    status: "补充能量",
    duration: 40,
    keywords: ["健身", "运动", "跑步", "瑜伽", "散步"],
  },
  {
    category: "rest",
    icon: Moon,
    status: "柔和收尾",
    duration: 20,
    keywords: ["复盘", "休息", "冥想", "放松", "睡前"],
  },
];

const fallbackTask = {
  category: "focus",
  icon: Sparkles,
  status: "待安排",
  duration: 45,
};

export function createSuggestedSchedule(prompt = initialPrompt) {
  const parsedTasks = parseNaturalLanguageTasks(prompt);
  const scheduledTasks = autoScheduleTasks(parsedTasks);

  return {
    tasks: scheduledTasks,
    meta: {
      parsedCount: scheduledTasks.length,
      fixedCount: scheduledTasks.filter((task) => task.isFixed).length,
    },
  };
}

export function applyTimeToTask(task, startMinutes, endMinutes) {
  const safeStart = clamp(roundToStep(startMinutes), DAY_START_MINUTES, DAY_END_MINUTES - 15);
  const safeEnd = clamp(roundToStep(endMinutes), safeStart + 15, DAY_END_MINUTES);
  const durationMinutes = safeEnd - safeStart;

  return {
    ...task,
    startMinutes: safeStart,
    endMinutes: safeEnd,
    durationMinutes,
    duration: formatDuration(durationMinutes),
    timeRange: `${formatClock(safeStart)} - ${formatClock(safeEnd)}`,
  };
}

export function formatClock(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function formatDuration(minutes) {
  if (minutes % 60 === 0) {
    return `${minutes / 60}h`;
  }

  if (minutes > 60) {
    const hours = Math.floor(minutes / 60);
    const restMinutes = minutes % 60;
    return `${hours}h ${restMinutes}m`;
  }

  return `${minutes}m`;
}

export function roundToStep(value, step = SNAP_MINUTES) {
  return Math.round(value / step) * step;
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function parseNaturalLanguageTasks(prompt) {
  const normalizedPrompt = normalizePrompt(prompt);
  const clauses = normalizedPrompt
    .split(/[、,，。；;\n]+|(?:\s+和\s+)/)
    .map((clause) => clause.trim())
    .filter(Boolean);

  const tasks = clauses
    .map((clause, index) => parseClause(clause, index))
    .filter((task) => task.title.length > 0);

  if (tasks.length > 0) {
    return tasks;
  }

  return [parseClause("整理今日任务 25 分钟", 0)];
}

function parseClause(clause, index) {
  const startMinutes = parseTime(clause);
  const rule = pickCategoryRule(clause, startMinutes !== null);
  const durationMinutes = parseDuration(clause) ?? rule.duration;
  const title = cleanTitle(clause, rule);

  return {
    id: createTaskId(title, index),
    title,
    category: startMinutes !== null ? "fixed" : rule.category,
    icon: startMinutes !== null ? Video : rule.icon,
    completed: false,
    durationMinutes,
    startMinutes,
    endMinutes: startMinutes === null ? null : startMinutes + durationMinutes,
    isFixed: startMinutes !== null,
    status: startMinutes !== null ? "固定事件" : rule.status,
  };
}

function autoScheduleTasks(tasks) {
  const fixedTasks = tasks
    .filter((task) => task.startMinutes !== null)
    .map((task) =>
      applyTimeToTask(
        task,
        clamp(task.startMinutes, DAY_START_MINUTES, DAY_END_MINUTES - task.durationMinutes),
        clamp(task.startMinutes + task.durationMinutes, DAY_START_MINUTES + task.durationMinutes, DAY_END_MINUTES),
      ),
    )
    .sort((a, b) => a.startMinutes - b.startMinutes);

  const occupied = fixedTasks.map(({ startMinutes, endMinutes }) => ({
    startMinutes,
    endMinutes,
  }));

  const flexibleTasks = tasks.filter((task) => task.startMinutes === null);
  const scheduledFlexibleTasks = flexibleTasks.map((task) => {
    const preferredWindow = getPreferredWindow(task);
    const startMinutes =
      findOpenSlot(occupied, task.durationMinutes, preferredWindow.start, preferredWindow.end) ??
      findOpenSlot(occupied, task.durationMinutes, DAY_START_MINUTES + 60, DAY_END_MINUTES) ??
      DAY_START_MINUTES + occupied.length * 60;
    const scheduledTask = applyTimeToTask(task, startMinutes, startMinutes + task.durationMinutes);

    occupied.push({
      startMinutes: scheduledTask.startMinutes,
      endMinutes: scheduledTask.endMinutes,
    });
    occupied.sort((a, b) => a.startMinutes - b.startMinutes);

    return scheduledTask;
  });

  return [...fixedTasks, ...scheduledFlexibleTasks].sort((a, b) => a.startMinutes - b.startMinutes);
}

function getPreferredWindow(task) {
  if (task.title.includes("健身") || task.title.includes("运动") || task.title.includes("跑步")) {
    return { start: 16 * 60, end: 20 * 60 };
  }

  const windows = {
    focus: { start: 9 * 60 + 30, end: 13 * 60 },
    creative: { start: 14 * 60, end: 18 * 60 },
    study: { start: 9 * 60 + 30, end: 17 * 60 },
    life: { start: 13 * 60, end: 18 * 60 },
    rest: { start: 20 * 60 + 30, end: 22 * 60 + 30 },
    fixed: { start: DAY_START_MINUTES, end: DAY_END_MINUTES },
  };

  return windows[task.category] ?? windows.focus;
}

function findOpenSlot(occupied, durationMinutes, windowStart, windowEnd) {
  let cursor = roundToStep(Math.max(windowStart, DAY_START_MINUTES));
  const limit = Math.min(windowEnd, DAY_END_MINUTES);
  const sortedOccupied = [...occupied].sort((a, b) => a.startMinutes - b.startMinutes);

  for (const slot of sortedOccupied) {
    if (slot.endMinutes <= cursor) {
      continue;
    }

    if (cursor + durationMinutes <= Math.min(slot.startMinutes - 10, limit)) {
      return cursor;
    }

    cursor = roundToStep(Math.max(cursor, slot.endMinutes + 10));
  }

  return cursor + durationMinutes <= limit ? cursor : null;
}

function normalizePrompt(prompt) {
  return prompt
    .replace(/\s+/g, " ")
    .replace(/今天|今日|要做|需要做|我要|我想|安排一下|帮我|请/g, "")
    .trim();
}

function pickCategoryRule(text, hasFixedTime) {
  if (hasFixedTime) {
    return categoryRules[0];
  }

  return (
    categoryRules.find((rule) => rule.keywords.some((keyword) => text.includes(keyword))) ??
    fallbackTask
  );
}

function parseDuration(text) {
  const hourMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:个)?\s*(?:小时|h|H)/);
  const minuteMatch = text.match(/(\d+)\s*(?:分钟|分|min|m)/i);

  if (hourMatch && minuteMatch) {
    return Math.round(Number(hourMatch[1]) * 60 + Number(minuteMatch[1]));
  }

  if (hourMatch) {
    return Math.round(Number(hourMatch[1]) * 60);
  }

  if (minuteMatch) {
    return Number(minuteMatch[1]);
  }

  if (/半小时|半个小时/.test(text)) {
    return 30;
  }

  return null;
}

function parseTime(text) {
  const colonMatch = text.match(/(上午|早上|中午|下午|晚上|今晚|夜里)?\s*(\d{1,2})\s*[:：]\s*(\d{1,2})/);
  if (colonMatch) {
    return normalizeHour(Number(colonMatch[2]), colonMatch[1]) * 60 + Number(colonMatch[3]);
  }

  const pointMatch = text.match(/(上午|早上|中午|下午|晚上|今晚|夜里)?\s*(\d{1,2})\s*点\s*(半|\d{1,2}\s*分?)?/);
  if (!pointMatch) {
    return null;
  }

  const hour = normalizeHour(Number(pointMatch[2]), pointMatch[1]);
  const minuteToken = pointMatch[3] ?? "";
  const minutes = minuteToken.includes("半")
    ? 30
    : Number(minuteToken.replace(/\D/g, "") || 0);

  return hour * 60 + minutes;
}

function normalizeHour(hour, period = "") {
  if (["下午", "晚上", "今晚", "夜里"].includes(period) && hour < 12) {
    return hour + 12;
  }

  if (period === "中午" && hour < 11) {
    return hour + 12;
  }

  return hour;
}

function cleanTitle(clause, rule) {
  const cleaned = clause
    .replace(/(上午|早上|中午|下午|晚上|今晚|夜里)?\s*\d{1,2}\s*[:：]\s*\d{1,2}/g, "")
    .replace(/(上午|早上|中午|下午|晚上|今晚|夜里)?\s*\d{1,2}\s*点\s*(半|\d{1,2}\s*分?)?/g, "")
    .replace(/\d+(?:\.\d+)?\s*(?:个)?\s*(?:小时|h|H)/g, "")
    .replace(/\d+\s*(?:分钟|分|min|m)/gi, "")
    .replace(/半小时|半个小时/g, "")
    .replace(/^[的\s]+|[的\s]+$/g, "")
    .trim();

  if (cleaned) {
    return cleaned;
  }

  const keyword = rule.keywords?.find((item) => clause.includes(item));
  return keyword ?? "未命名任务";
}

function createTaskId(title, index) {
  const safeTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${safeTitle || "task"}-${index}`;
}
