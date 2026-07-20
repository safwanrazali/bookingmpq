import { useEffect, useState } from 'react';

/**
 * Returns `true` once the page has scrolled past `threshold` pixels.
 * Used by the Navbar to switch from a transparent hero-overlay style to a
 * solid, elevated bar once the user scrolls away from the top.
 */
export default function useScrollY(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}
