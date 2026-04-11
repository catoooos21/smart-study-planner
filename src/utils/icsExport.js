// src/utils/icsExport.js

function formatICSDate(date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function escapeICSText(text = '') {
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

// Default study block start time (local time). Change if you want.
const DEFAULT_START_HOUR = 17; // 5:00 PM

function flattenSchedule(scheduleData) {
  if (!scheduleData) return [];

  // Handle the wrapper: { schedule: [...], summary: "..." }
  const days = Array.isArray(scheduleData)
    ? scheduleData
    : Array.isArray(scheduleData.schedule)
    ? scheduleData.schedule
    : [];

  const sessions = [];
  days.forEach((day) => {
    if (!day || !day.date || !Array.isArray(day.sessions)) return;
    let offsetMinutes = 0;
    day.sessions.forEach((s) => {
      sessions.push({
        date: day.date,
        offsetMinutes,
        durationMinutes: s.duration_minutes || 30,
        subject: s.subject_name || 'Study',
        task: s.task || 'Study session',
        reasoning: s.reasoning || '',
      });
      offsetMinutes += (s.duration_minutes || 30) + 15; // 15 min break between sessions
    });
  });
  return sessions;
}

function buildEvent(session, index) {
  // Parse the day (ISO string) and set the local start time
  const day = new Date(session.date);
  const start = new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    DEFAULT_START_HOUR,
    0,
    0
  );
  start.setMinutes(start.getMinutes() + session.offsetMinutes);

  const end = new Date(start.getTime() + session.durationMinutes * 60 * 1000);

  const uid = `${Date.now()}-${index}@smart-study-planner`;
  const dtstamp = formatICSDate(new Date());
  const summary = escapeICSText(`${session.subject}: ${session.task}`);
  const description = escapeICSText(session.reasoning);

  return [
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${formatICSDate(start)}`,
    `DTEND:${formatICSDate(end)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    'END:VEVENT',
  ].join('\r\n');
}

export function generateICS(scheduleData) {
  const sessions = flattenSchedule(scheduleData);
  const events = sessions.map((s, i) => buildEvent(s, i));

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Smart Study Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadICS(scheduleData, filename = 'study-schedule.ics') {
  const sessions = flattenSchedule(scheduleData);
  if (sessions.length === 0) {
    throw new Error('No sessions found in schedule');
  }

  const icsContent = generateICS(scheduleData);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return sessions.length;
}