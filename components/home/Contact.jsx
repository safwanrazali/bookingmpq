import Link from 'next/link';
import { Mail, Phone, Clock } from 'lucide-react';
import styles from './Contact.module.scss';

export default function Contact() {
  return (
    <section id="contact" className={styles.section}>
      <div className={`container ${styles.card}`}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>Contact</span>
          <h2 className={styles.title}>Prefer to talk to someone first?</h2>
          <p className={styles.subtitle}>
            Reach out with questions before you book, or if you need help
            rescheduling an existing appointment.
          </p>

          <ul className={styles.list}>
            <li>
              <Mail size={16} /> hello@bookmyslot.app
            </li>
            <li>
              <Phone size={16} /> +60 3-1234 5678
            </li>
            <li>
              <Clock size={16} /> Mon&ndash;Fri, 9:00 AM&ndash;6:00 PM (Asia/Kuala_Lumpur)
            </li>
          </ul>
        </div>

        <div className={styles.ctaBox}>
          <p className={styles.ctaText}>Ready when you are.</p>
          <Link href="/booking" className={`btn btn-primary btn-lg ${styles.ctaButton}`}>
            Book Appointment
          </Link>
        </div>
      </div>
    </section>
  );
}
