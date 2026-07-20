import PropTypes from 'prop-types';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toDateKey, dateKeyToLocalDate } from '@/lib/dateUtils';
import styles from './BookingCalendar.module.scss';

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function BookingCalendar({
  currentMonth,
  onMonthChange,
  selectedDateKey,
  onSelectDate,
  daysMap,
  bookingSlots,
  loading,
}) {
  const todayLocal = dateKeyToLocalDate(toDateKey(new Date()));

  const gridStart = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
  const gridEnd = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const totalSlots = bookingSlots?.length ?? 0;

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.navButton}
          onClick={() => onMonthChange(subMonths(currentMonth, 1))}
          aria-label="Previous month"
        >
          <ChevronLeft size={18} />
        </button>

        <span className={styles.monthLabel}>{format(currentMonth, 'MMMM yyyy')}</span>

        <button
          type="button"
          className={styles.navButton}
          onClick={() => onMonthChange(addMonths(currentMonth, 1))}
          aria-label="Next month"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className={styles.weekdays}>
        {WEEKDAY_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className={`${styles.grid} ${loading ? styles.gridLoading : ''}`}>
        {days.map((day) => {
          const dateKey = toDateKey(day);
          const inMonth = isSameMonth(day, currentMonth);
          const isPast = isBefore(day, todayLocal) && !isSameDay(day, todayLocal);
          const takenCount = daysMap?.[dateKey]?.length ?? 0;
          const isFull = inMonth && totalSlots > 0 && takenCount >= totalSlots;
          const disabled = !inMonth || isPast || isFull;
          const isSelected = dateKey === selectedDateKey;
          const isToday = isSameDay(day, todayLocal);

          return (
            <button
              type="button"
              key={dateKey}
              disabled={disabled}
              onClick={() => onSelectDate(dateKey)}
              className={[
                styles.day,
                !inMonth && styles.dayOutside,
                isPast && styles.dayPast,
                isFull && styles.dayFull,
                isSelected && styles.daySelected,
                isToday && styles.dayToday,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span>{format(day, 'd')}</span>
              {inMonth && isFull && <span className={styles.dayBadge}>Full</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

BookingCalendar.propTypes = {
  currentMonth: PropTypes.instanceOf(Date).isRequired,
  onMonthChange: PropTypes.func.isRequired,
  selectedDateKey: PropTypes.string,
  onSelectDate: PropTypes.func.isRequired,
  daysMap: PropTypes.object,
  bookingSlots: PropTypes.arrayOf(PropTypes.string),
  loading: PropTypes.bool,
};

BookingCalendar.defaultProps = {
  selectedDateKey: null,
  daysMap: {},
  bookingSlots: [],
  loading: false,
};
