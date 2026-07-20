import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format, addDays } from 'date-fns';
import styles from './AvailableSlots.module.scss';

const SLOT_TIMES = ['10:00 AM', '02:00 PM'];

/**
 * Builds a 7-day illustrative preview. Every 3rd day has its morning slot
 * already taken, just to demonstrate that slots disappear as they fill up.
 * This is presentational only — the real, live availability (backed by
 * GET /api/bookings/availability) is wired up on the booking page in
 * Phase 3. Computed client-side in an effect to avoid any server/client
 * date-boundary mismatch during SSR.
 */
function buildPreviewDays() {
  const today = new Date();
  return Array.from({ length: 7 }).map((_, i) => {
    const date = addDays(today, i);
    return {
      key: i,
      dayLabel: format(date, 'EEE'),
      dateLabel: format(date, 'd MMM'),
      slots: SLOT_TIMES.map((time, slotIndex) => ({
        time,
        taken: slotIndex === 0 && i % 3 === 0,
      })),
    };
  });
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
            <h2 className={styles.title}>Two slots a day, always up to date</h2>
            <p className={styles.subtitle}>
              We keep it to one morning and one afternoon slot so every
              conversation gets proper focus. As soon as a slot is taken, it
              disappears here and on the booking page.
            </p>
          </div>
          <Link href="/booking" className={styles.cta}>
            See full calendar
          </Link>
        </div>

        <div className={styles.scrollArea}>
          <div className={styles.grid}>
            {(days ?? Array.from({ length: 7 })).map((day, i) => (
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
