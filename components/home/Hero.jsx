import Link from 'next/link';
import { ArrowRight, CalendarCheck2, CheckCircle2 } from 'lucide-react';
import styles from './Hero.module.scss';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.blobOne} aria-hidden="true" />
      <div className={styles.blobTwo} aria-hidden="true" />

      <div className={`container ${styles.container}`}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>
            <CalendarCheck2 size={14} /> Appointment scheduling, simplified
          </span>

          <h1 className={styles.headline}>
            Book Your Appointment <span className="gradient-brand-text">With Our Team</span>
          </h1>

          <p className={styles.subhead}>
            Pick an open slot, share a few details, and you&apos;re confirmed —
            no account, no back-and-forth emails. Two thoughtfully-spaced
            slots a day, so every meeting gets the attention it deserves.
          </p>

          <div className={styles.actions}>
            <Link href="/booking" className={`btn btn-primary btn-lg ${styles.primaryCta}`}>
              Book Appointment <ArrowRight size={18} />
            </Link>
            <Link href="#how-it-works" className={`btn btn-lg ${styles.secondaryCta}`}>
              Learn More
            </Link>
          </div>

          <div className={styles.trust}>
            <CheckCircle2 size={16} className={styles.trustIcon} />
            No login required for guests
          </div>
        </div>

        <div className={styles.mockWrap}>
          <div className={styles.mockCard}>
            <div className={styles.mockHeader}>
              <span className={styles.mockDate}>Tue, 22 Jul 2026</span>
              <span className={styles.mockTz}>Asia/Kuala_Lumpur</span>
            </div>

            <button type="button" className={`${styles.slot} ${styles.slotTaken}`} disabled>
              <span>9:00 AM</span>
              <span className={styles.slotStatus}>Booked</span>
            </button>

            <button type="button" className={`${styles.slot} ${styles.slotOpen}`}>
              <span>02:00 PM</span>
              <span className={styles.slotStatus}>
                <span className={styles.pulseDot} aria-hidden="true" />
                Open
              </span>
            </button>

            <div className={styles.mockFooterNote}>
              Live availability shown on the booking page
            </div>
          </div>

          <div className={styles.mockCardBack} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
