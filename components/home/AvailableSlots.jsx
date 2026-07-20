import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format, addDays, getDay } from 'date-fns';
import styles from './AvailableSlots.module.scss';

const SLOT_TIMES = ['9:00 AM', '02:00 PM'];

/**
 * Builds a weekday-only illustrative preview. Saturday and Sunday are treated
 * as off days, so no booking availability is shown for them.
 */
function buildPreviewDays() {
  const today = new Date();
  const days = [];
  let cursor = new Date(today);

  while (days.length < 5) {
    const dayOfWeek = getDay(cursor);
    const isWorkingDay = dayOfWeek >= 1 && dayOfWeek <= 5;

    if (isWorkingDay) {
      const dayIndex = days.length;
      days.push({
        key: dayIndex,
        dayLabel: format(cursor, 'EEE'),
        dateLabel: format(cursor, 'd MMM'),
        slots: SLOT_TIMES.map((time, slotIndex) => ({
          time,
          taken: slotIndex === 0 && dayIndex % 3 === 0,
        })),
      });
    }

    cursor = addDays(cursor, 1);
  }

  return days;
}

export default function AvailableSlots() {
  const [days, setDays] = useState(null);

  useEffect(() => {
    setDays(buildPreviewDays());
  }, []);

  return (
    <section id="slots" className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <span className={styles.eyebrow}>Available slots overview</span>
            <h2 className={styles.title}>Weekday slots only</h2>
            <p className={styles.subtitle}>
              Bookings are available Monday through Friday only. Saturday and
              Sunday are off days, so no booking availability is shown for
              those dates.
            </p>
          </div>
          <Link href="/booking" className={styles.cta}>
            See full calendar
          </Link>
        </div>

        <div className={styles.scrollArea}>
          <div className={styles.grid}>
            {(days ?? Array.from({ length: 5 })).map((day, i) => (
              <div className={styles.dayCard} key={day?.key ?? i}>
                {day ? (
                  <>
                    <div className={styles.dayHead}>
                      <span className={styles.dayLabel}>{day.dayLabel}</span>
                      <span className={styles.dateLabel}>{day.dateLabel}</span>
                    </div>
                    <div className={styles.slotList}>
                      {day.slots.map((slot) => (
                        <span
                          key={slot.time}
                          className={`${styles.slotPill} ${
                            slot.taken ? styles.slotPillTaken : styles.slotPillOpen
                          }`}
                        >
                          {!slot.taken && <span className={styles.pulseDot} aria-hidden="true" />}
                          {slot.time}
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className={styles.skeleton} aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
