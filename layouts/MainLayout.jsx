import PropTypes from 'prop-types';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';

/**
 * Layout for all public-facing pages (homepage, booking flow, login).
 * Applied via `Page.getLayout` in `_app.jsx` rather than wrapping in every
 * page file, so a page can opt out (e.g. a future focused/no-chrome step)
 * simply by not setting `getLayout`.
 */
export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
