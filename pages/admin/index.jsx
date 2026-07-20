import { withAdminAuth } from '@/middleware/adminAuth';

/**
 * Admin dashboard — placeholder for Phase 1.
 * Full dashboard cards (Total Bookings, Upcoming Appointments, Available
 * Slots, Team Members) with top-nav + collapsible drawer layout is built
 * in Phase 4.
 */
export default function AdminDashboardPage() {
  return (
    <main id="main-content" className="container py-5">
      <h1>Admin Dashboard</h1>
      <p className="text-muted-app">Dashboard UI arrives in Phase 4.</p>
    </main>
  );
}

export const getServerSideProps = withAdminAuth();
