/**
 * Date formatting and .ics calendar generation utilities
 */

import { ClubEventItem } from '../types/store';

export function formatEventDateTimeRange(startDateStr: string, endDateStr: string): string {
  try {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    const sameDay = 
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth() &&
      start.getDate() === end.getDate();

    const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
    const startDay = start.getDate();
    const startYear = start.getFullYear();
    const startTime = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
    const endDay = end.getDate();
    const endYear = end.getFullYear();
    const endTime = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    if (sameDay) {
      return `${startDay} ${startMonth} ${startYear}, ${startTime} – ${endTime}`;
    }

    if (startYear === endYear) {
      return `${startDay} ${startMonth}, ${startTime} to ${endDay} ${endMonth}, ${endTime}`;
    }

    return `${startDay} ${startMonth} ${startYear}, ${startTime} to ${endDay} ${endMonth} ${endYear}, ${endTime}`;
  } catch {
    return `${startDateStr} to ${endDateStr}`;
  }
}

export function formatShortDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function downloadCalendarIcs(event: ClubEventItem): void {
  const start = new Date(event.startDateTime);
  const end = new Date(event.endDateTime);

  const formatIcsDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GrowWithGit Club//Event Pass//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}-${Date.now()}@growwithgit.charusat.ac.in`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    `SUMMARY:${event.title} - GrowWithGit Club`,
    `DESCRIPTION:${event.description.replace(/\n/g, ' ')}`,
    `LOCATION:${event.venue || 'CSPIT Campus, CHARUSAT'}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${event.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_pass.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
