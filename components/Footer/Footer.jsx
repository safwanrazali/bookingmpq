import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import styles from './Footer.module.scss';
import Logo from '../Logo/logo';

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <Link href="/" >
              <Logo />
            </Link>
            <p className={styles.tagline}>
              A calmer way to schedule time with our team — no account,
              no back-and-forth emails, just an open slot.
            </p>
          </div>

          <div className={styles.col}>
            <h3 className={styles.colTitle}>Navigate</h3>
            <Link href="/#how-it-works" className={styles.link}>How it works</Link>
            <Link href="/#slots" className={styles.link}>Availability</Link>
            <Link href="/#features" className={styles.link}>Features</Link>
            <Link href="/#faq" className={styles.link}>FAQ</Link>
          </div>

          <div className={styles.col}>
            <h3 className={styles.colTitle}>Get in touch</h3>
            <a href="mailto:hello@bookmyslot.app" className={styles.link}>
              <Mail size={15} /> hello@bookmyslot.app
            </a>
            <a href="tel:+60312345678" className={styles.link}>
              <Phone size={15} /> +60 3-1234 5678
            </a>
            <span className={styles.link}>
              <MapPin size={15} /> Kuala Lumpur, Malaysia
            </span>
          </div>

          <div className={styles.col}>
            <h3 className={styles.colTitle}>Admin</h3>
            <Link href="/login" className={styles.link}>Admin login</Link>
            <Link href="/booking" className={styles.link}>Book an appointment</Link>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© {year} BookMySlot. All rights reserved.</span>
          <span className={styles.timezone}>
            Scheduling shown in Asia/Kuala_Lumpur time
          </span>
        </div>
      </div>
    </footer>
  );
}
