import Accordion from 'react-bootstrap/Accordion';
import styles from './FAQ.module.scss';

const FAQS = [
  {
    question: 'Do I need to create an account to book?',
    answer:
      'No. Guest booking is on by default — just pick a slot and fill in your details. An admin can require accounts later if that ever changes.',
  },
  {
    question: 'How many appointment slots are available per day?',
    answer:
      'Two by default: 10:00 AM and 02:00 PM. Admins can add, remove, or change slots at any time from the settings page.',
  },
  {
    question: 'What happens if two people try to book the same slot?',
    answer:
      'The first submission wins. The slot is re-checked immediately before saving, and the database itself refuses a duplicate booking — so double-booking is not possible even under heavy traffic.',
  },
  {
    question: 'Can I cancel or reschedule my appointment?',
    answer:
      'Reach out using the contact details below and our team can cancel or move your booking. Cancelling a slot immediately frees it up for someone else.',
  },
  {
    question: 'What timezone are the appointment times shown in?',
    answer:
      'All dates and times are shown in Asia/Kuala_Lumpur time, regardless of where you\u2019re booking from.',
  },
];

export default function FAQ() {
  return (
    <section id="faq" className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.eyebrow}>FAQ</span>
          <h2 className={styles.title}>Good to know</h2>
        </div>

        <Accordion className={styles.accordion} defaultActiveKey="0">
          {FAQS.map((faq, index) => (
            <Accordion.Item eventKey={String(index)} key={faq.question} className={styles.item}>
              <Accordion.Header>{faq.question}</Accordion.Header>
              <Accordion.Body className={styles.body}>{faq.answer}</Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
