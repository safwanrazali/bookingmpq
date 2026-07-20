import PropTypes from 'prop-types';
import { CheckCircle2 } from 'lucide-react';
import { formatDateKeyForDisplay } from '@/lib/dateUtils';
import styles from './SlotPicker.module.scss';

export default function SlotPicker({
  selectedDateKey,
  bookingSlots,
  takenTimes,
  selectedTime,
  onSelectTime,
  loading,
}) {
  if (!selectedDateKey) {
    return (
      <div className={styles.empty}>
        Pick a date from the calendar to see available times.
      </div>
    );
  }

  const openSlots = bookingSlots.filter((time) => !takenTimes.includes(time));

  return (
    <div className={styles.panel}>
      <div className={styles.heading}>
        <span className={styles.label}>Available times</span>
        <span className={styles.date}>{formatDateKeyForDisplay(selectedDateKey)}</span>
      </div>

      {loading ? (
        <div className={styles.skeletonRow}>
          <span className={styles.skeletonPill} />
          <span className={styles.skeletonPill} />
        </div>
      ) : openSlots.length === 0 ? (
        <div className={styles.empty}>
          No slots left on this date — please choose another day.
        </div>
      ) : (
        <div className={styles.slots}>
          {bookingSlots.map((time) => {
            const taken = takenTimes.includes(time);
            const selected = time === selectedTime;
            return (
              <button
                type="button"
                key={time}
                disabled={taken}
                onClick={() => onSelectTime(time)}
                className={[
                  styles.slot,
                  taken && styles.slotTaken,
                  selected && styles.slotSelected,
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {selected && <CheckCircle2 size={16} />}
                {time}
                {taken && <span className={styles.slotTag}>Booked</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

SlotPicker.propTypes = {
  selectedDateKey: PropTypes.string,
  bookingSlots: PropTypes.arrayOf(PropTypes.string).isRequired,
  takenTimes: PropTypes.arrayOf(PropTypes.string),
  selectedTime: PropTypes.string,
  onSelectTime: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

SlotPicker.defaultProps = {
  selectedDateKey: null,
  takenTimes: [],
  selectedTime: null,
  loading: false,
};
