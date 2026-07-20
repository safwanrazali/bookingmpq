import { CalendarDays, ClipboardList, MailCheck } from 'lucide-react';
import styles from './HowItWorks.module.scss';

const STEPS = [
  {
    number: '01',
    icon: CalendarDays,
    title: 'Pick a date & slot',
    description:
      'Browse open dates on the calendar. Only two slots are offered per day — 10:00 AM and 02:00 PM — so booked slots disappear instantly.',
  },
  {
    number: '02',
    icon: ClipboardList,
    title: 'Share a few details',
    description:
      'Tell us your name, contact details, organization, and the purpose of the meeting. Takes under a minute.',
  },
  {
    number: '03',
    icon: MailCheck,
    title: 'Get instant confirmation',
    description:
      'Your slot is locked the moment you submit — our system re-checks availability the instant before saving, so it can never be double-booked.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.eyebrow}>How it works</span>
          <h2 className={styles.title}>Three steps. No account needed.</h2>
        </div>

        <div className={styles.steps}>
          {STEPS.map((step) => (
            <div className={styles.step} key={step.number}>
              <div className={styles.stepTop}>
                <span className={styles.stepNumber}>{step.number}</span>
                <step.icon size={20} className={styles.stepIcon} />
              </div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
