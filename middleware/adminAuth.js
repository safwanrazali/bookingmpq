import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

/**
 * Wraps a page's getServerSideProps with an admin-session check.
 * The root middleware.js already blocks unauthenticated navigation at the
 * edge; this is a second, server-rendered layer so that direct data
 * fetching (getServerSideProps) never runs for a signed-out request either.
 *
 * Usage:
 *   export const getServerSideProps = withAdminAuth(async (ctx, session) => {
 *     return { props: { ... } };
 *   });
 */
export function withAdminAuth(handler) {
  return async (ctx) => {
    const session = await getServerSession(ctx.req, ctx.res, authOptions);

    if (!session) {
      return {
        redirect: {
          destination: `/login?callbackUrl=${encodeURIComponent(ctx.resolvedUrl)}`,
          permanent: false,
        },
      };
    }

    if (handler) {
      return handler(ctx, session);
    }

    return { props: { session } };
  };
}
