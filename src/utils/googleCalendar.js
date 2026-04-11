// src/utils/googleCalendar.js

function formatGCalDate(date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export function buildGoogleCalendarUrl(session, dayDate) {
  const day = new Date(dayDate);
  const start = new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    17, 0, 0
  );
  const end = new Date(start.getTime() + (session.duration_minutes || 30) * 60 * 1000);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${session.subject_name}: ${session.task}`,
    dates: `${formatGCalDate(start)}/${formatGCalDate(end)}`,
    details: session.reasoning || 'Study session from Smart Study Planner',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}