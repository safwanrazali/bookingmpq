import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { endOfMonth, startOfMonth } from 'date-fns';
import { CalendarDays, Clock3, UserRound } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import BookingCalendar from '@/components/booking/BookingCalendar';
import SlotPicker from '@/components/booking/SlotPicker';
import BookingForm from '@/components/booking/BookingForm';
import useAvailability from '@/hooks/useAvailability';
import { toDateKey } from '@/lib/dateUtils';
import styles from './index.module.scss';

const DEFAULT_SLOTS = ['10:00 AM', '02:00 PM'];

function BookingPage() {
  const router = useRouter();

  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDateKey, setSelectedDateKey] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const rangeStart = useMemo(() => toDateKey(startOfMonth(currentMonth)), [currentMonth]);
  const rangeEnd = useMemo(() => toDateKey(endOfMonth(currentMonth)), [currentMonth]);

  const { data, loading, refetch } = useAvailability(rangeStart, rangeEnd);

  const bookingSlots = data?.bookingSlots ?? DEFAULT_SLOTS;
  const daysMap = data?.days ?? {};
  const takenTimes = selectedDateKey ? daysMap[selectedDateKey] ?? [] : [];

  const activeStep = !selectedDateKey ? 1 : !selectedTime ? 2 : 3;

  function handleSelectDate(dateKey) {
    setSelectedDateKey(dateKey);
    setSelectedTime(null);
    setServerError(null);
  }

  function handleSelectTime(time) {
    setSelectedTime(time);
    setServerError(null);
  }

  async function handleSubmit(details) {
    setSubmitting(true);
    setServerError(null);

    try {
      const { data: booking } = await axios.post('/api/bookings', {
        ...details,
        appointmentDate: selectedDateKey,
        appointmentTime: selectedTime,
      });
      router.push(`/booking/success?id=${booking.bookingId}`);
    } catch (err) {
      const message =
        err?.response?.data?.error || 'Something went wrong. Please try again.';
      setServerError(message);

      // The slot was likely just taken by someone else - refresh availability
      // and drop the stale selection so the picker reflects reality.
      if (err?.response?.status === 409) {
        setSelectedTime(null);
        refetch();
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main id="main-content" className={styles.page}>
      <div className="container">
        <div className={styles.intro}>
          <h1 className={styles.title}>Book an Appointment</h1>
          <p className={styles.subtitle}>
            Select a date, pick an open time, and share a few details — you&apos;ll get
            an instant confirmation.
          </p>

          <ol className={styles.steps}>
            <li className={activeStep >= 1 ? styles.stepActive : ''}>
              <CalendarDays size={16} /> Select date
            </li>
            <li className={activeStep >= 2 ? styles.stepActive : ''}>
              <Clock3 size={16} /> Select time
            </li>
            <li className={activeStep >= 3 ? styles.stepActive : ''}>
              <UserRound size={16} /> Your details
            </li>
          </ol>
        </div>

        <div className={styles.layout}>
          <div className={styles.calendarCol}>
            <BookingCalendar
              currentMonth={currentMonth}
              onMonthChange={setCurrentMonth}
              selectedDateKey={selectedDateKey}
              onSelectDate={handleSelectDate}
              daysMap={daysMap}
              bookingSlots={bookingSlots}
              loading={loading}
            />
          </div>

          <div className={styles.detailsCol}>
            <SlotPicker
              selectedDateKey={selectedDateKey}
              bookingSlots={bookingSlots}
              takenTimes={takenTimes}
              selectedTime={selectedTime}
              onSelectTime={handleSelectTime}
              loading={loading}
            />

            <BookingForm
              disabled={!selectedDateKey || !selectedTime}
              submitting={submitting}
              serverError={serverError}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

BookingPage.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default BookingPage;
