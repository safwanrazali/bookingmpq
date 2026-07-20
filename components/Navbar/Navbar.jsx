import { useState } from 'react';
import Link from 'next/link';
import BsNavbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import useScrollY from '@/hooks/useScrollY';
import styles from './Navbar.module.scss';

const NAV_LINKS = [
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#slots', label: 'Availability' },
  { href: '/#features', label: 'Features' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/#contact', label: 'Contact' },
];

export default function Navbar() {
  const scrolled = useScrollY(24);
  const [expanded, setExpanded] = useState(false);

  return (
    <BsNavbar
      expand="lg"
      expanded={expanded}
      onToggle={setExpanded}
      className={`${styles.navbar} ${scrolled || expanded ? styles.scrolled : ''}`}
      fixed="top"
    >
      <Container className={styles.inner}>
        <Link
          href="/"
          className={styles.brand}
          onClick={() => setExpanded(false)}
        >
          <span className={styles.brandMark} aria-hidden="true" />
          BookMy<span className="gradient-brand-text">Slot</span>
        </Link>

        <BsNavbar.Toggle aria-controls="main-nav" className={styles.toggle} />

        <BsNavbar.Collapse id="main-nav">
          <Nav className={styles.links}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={styles.navLink}
                onClick={() => setExpanded(false)}
              >
                {link.label}
              </Link>
            ))}
          </Nav>

          <div className={styles.actions}>
            <Link
              href="/login"
              className={styles.loginLink}
              onClick={() => setExpanded(false)}
            >
              Admin login
            </Link>
            <Link
              href="/booking"
              className={`btn btn-primary ${styles.cta}`}
              onClick={() => setExpanded(false)}
            >
              Book Appointment
            </Link>
          </div>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}
