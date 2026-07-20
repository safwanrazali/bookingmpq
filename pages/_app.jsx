import { SessionProvider } from 'next-auth/react';
import '@/styles/globals.scss';

/**
 * Global App shell.
 * - SessionProvider makes `useSession()` available in any page/component
 *   (used by the admin area to gate access).
 * - Bootstrap's JS bundle (for things like the collapsible drawer / navbar
 *   toggler) is loaded client-side only inside components that need it,
 *   to avoid `window is not defined` errors during SSR.
 */
export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <SessionProvider session={session}>
      {getLayout(<Component {...pageProps} />)}
    </SessionProvider>
  );
}
