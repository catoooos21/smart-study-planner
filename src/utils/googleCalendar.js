// src/utils/googleCalendar.js
import { DEFAULT_START_HOUR } from './studyConfig';

// Use local time (no Z) so Google Calendar places the event at the correct
// local hour regardless of the user's timezone offset.
function formatGCalDate(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return (
    date.getFullYear() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    'T' +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
}

export function buildGoogleCalendarUrl(session, dayDate, offsetMinutes = 0) {
  const day = new Date(dayDate);
  const start = new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    DEFAULT_START_HOUR, 0, 0
  );
  start.setMinutes(start.getMinutes() + offsetMinutes);
  const end = new Date(start.getTime() + (session.duration_minutes || 30) * 60 * 1000);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${session.subject_name}: ${session.task}`,
    dates: `${formatGCalDate(start)}/${formatGCalDate(end)}`,
    details: session.reasoning || 'Study session from Smart Study Planner',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}