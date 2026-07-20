import {
  UserX,
  ShieldCheck,
  Zap,
  FileSpreadsheet,
  Smartphone,
  Users,
} from 'lucide-react';
import styles from './Features.module.scss';

const FEATURES = [
  {
    icon: UserX,
    title: 'No login required',
    description: 'Guests book in under a minute — no account, no password, no friction.',
  },
  {
    icon: ShieldCheck,
    title: 'Zero double-bookings',
    description: 'Protected at the frontend, the API, and the database level — a slot is never handed out twice.',
  },
  {
    icon: Zap,
    title: 'Real-time availability',
    description: 'Booked slots vanish instantly for every visitor, no page refresh needed.',
  },
  {
    icon: Users,
    title: 'Team member assignment',
    description: 'Admins can route each booking to the right person on the team.',
  },
  {
    icon: FileSpreadsheet,
    title: 'One-click Excel export',
    description: 'Download bookings as a clean .xlsx report whenever you need it.',
  },
  {
    icon: Smartphone,
    title: 'Mobile-first design',
    description: 'Booking and admin screens are built for phones first, then scaled up.',
  },
];

export default function Features() {
  return (
    <section id="features" className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.eyebrow}>Features</span>
          <h2 className={styles.title}>Everything a booking flow needs, nothing it doesn&apos;t</h2>
        </div>

        <div className={styles.grid}>
          {FEATURES.map((feature) => (
            <div className={styles.card} key={feature.title}>
              <div className={styles.iconWrap}>
                <feature.icon size={20} />
              </div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
