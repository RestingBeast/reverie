export interface TimeSlot {
  id: string;
  label: string;
  loadingLabel: string;
  group: "today" | "yesterday";
  getAfter: () => number;
}

function dayRange(startHour: number, endHour: number, dayOffset = 0) {
  const now = Date.now();
  const midnight = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() + dayOffset,
  ).getTime();

  const after = midnight + startHour * 60 * 60 * 1000;
  const windowEnd = midnight + endHour * 60 * 60 * 1000;
  return Math.min(after, Math.min(windowEnd, now));
}

function slot(s: {
  id: string;
  label: string;
  loadingLabel: string;
  group: "today" | "yesterday";
  startHour: number;
  endHour: number;
  dayOffset?: number;
}): TimeSlot {
  return {
    id: s.id,
    label: s.label,
    loadingLabel: s.loadingLabel,
    group: s.group,
    getAfter: () => dayRange(s.startHour, s.endHour, s.dayOffset),
  };
}

export const TIME_SLOTS: TimeSlot[] = [
  // Today
  slot({
    id: "today-full",
    label: "💫 Full Day",
    loadingLabel: "full day",
    group: "today",
    startHour: 0,
    endHour: 24,
  }),
  slot({
    id: "today-morning",
    label: "☀️ Morning",
    loadingLabel: "morning",
    group: "today",
    startHour: 6,
    endHour: 12,
  }),
  slot({
    id: "today-afternoon",
    label: "🌤 Afternoon",
    loadingLabel: "afternoon",
    group: "today",
    startHour: 12,
    endHour: 17,
  }),
  slot({
    id: "today-evening",
    label: "🌆 Evening",
    loadingLabel: "evening",
    group: "today",
    startHour: 17,
    endHour: 22,
  }),
  slot({
    id: "today-late",
    label: "🌙 Late Night",
    loadingLabel: "late night",
    group: "today",
    startHour: 22,
    endHour: 26,
  }),

  // Yesterday
  slot({
    id: "yesterday-full",
    label: "💫 Full Day",
    loadingLabel: "full day",
    group: "yesterday",
    startHour: 0,
    endHour: 24,
    dayOffset: -1,
  }),
  slot({
    id: "yesterday-morning",
    label: "☀️ Morning",
    loadingLabel: "morning",
    group: "yesterday",
    startHour: 6,
    endHour: 12,
    dayOffset: -1,
  }),
  slot({
    id: "yesterday-afternoon",
    label: "🌤 Afternoon",
    loadingLabel: "afternoon",
    group: "yesterday",
    startHour: 12,
    endHour: 17,
    dayOffset: -1,
  }),
  slot({
    id: "yesterday-evening",
    label: "🌆 Evening",
    loadingLabel: "evening",
    group: "yesterday",
    startHour: 17,
    endHour: 22,
    dayOffset: -1,
  }),
];
