import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { APP_TIMEZONE } from '@/lib/timezone';

export const DATE_KEY_FORMAT = 'yyyy-MM-dd';

/** 'YYYY-MM-DD' key for a JS Date, expressed in APP_TIMEZONE. */
export function toDateKey(date) {
  return formatInTimeZone(date, APP_TIMEZONE, DATE_KEY_FORMAT);
}

/** Today's date key ('YYYY-MM-DD') in APP_TIMEZONE — safe to call on server or client. */
export function todayKey() {
  return toDateKey(new Date());
}

/**
 * 'YYYY-MM-DD' -> 'DD MMM YYYY' (e.g. '20 Jul 2026'), the display format
 * required across the app. Parsed manually rather than with `new Date()`
 * to avoid any local-timezone off-by-one on the calendar day.
 */
export function formatDateKeyForDisplay(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return format(date, 'dd MMM yyyy');
}

export function dateKeyToLocalDate(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}
