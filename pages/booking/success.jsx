import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { CheckCircle2, CalendarDays, Clock3, Building2 } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import { formatDateKeyForDisplay } from '@/lib/dateUtils';
import styles from './success.module.scss';

function BookingSuccessPage() {
  const router = useRouter();
  const { id } = router.query;

  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;

    if (!id) {
      setLoading(false);
      setError('No booking reference was provided.');
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const { data } = await axios.get(`/api/bookings/${id}`);
        if (!cancelled) setBooking(data);
      } catch (err) {
        if (!cancelled) {
          setError(err?.response?.data?.error || 'We could not find that booking.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router.isReady, id]);

  return (
    <main id="main-content" className={styles.page}>
      <div className="container">
        {loading && <p className={styles.loading}>Loading your confirmation…</p>}

        {!loading && error && (
          <div className={styles.card}>
            <h1 className={styles.title}>We couldn&apos;t load that booking</h1>
            <p className={styles.subtitle}>{error}</p>
            <Link href="/booking" className="btn btn-primary">
              Back to booking
            </Link>
          </div>
        )}

        {!loading && !error && booking && (
          <div className={styles.card}>
            <div className={styles.iconWrap}>
              <CheckCircle2 size={32} />
            </div>
            <h1 className={styles.title}>Booking Confirmed</h1>
            <p className={styles.subtitle}>
              Thanks, {booking.name.split(' ')[0]} — we&apos;ve saved your slot. A summary
              is below for your records.
            </p>

            <dl className={styles.summary}>
              <div className={styles.row}>
                <dt><CalendarDays size={16} /> Date</dt>
                <dd>{formatDateKeyForDisplay(booking.appointmentDate)}</dd>
              </div>
              <div className={styles.row}>
                <dt><Clock3 size={16} /> Time</dt>
                <dd>{booking.appointmentTime}</dd>
              </div>
              {booking.organization && (
                <div className={styles.row}>
                  <dt><Building2 size={16} /> Organization</dt>
                  <dd>{booking.organization}</dd>
                </div>
              )}
              <div className={styles.row}>
                <dt>Reference</dt>
                <dd className={styles.mono}>{booking.bookingId}</dd>
              </div>
              <div className={styles.row}>
                <dt>Status</dt>
                <dd className={styles.status}>{booking.status}</dd>
              </div>
            </dl>

            <Link href="/" className="btn btn-primary">
              Back to homepage
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

BookingSuccessPage.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default BookingSuccessPage;
