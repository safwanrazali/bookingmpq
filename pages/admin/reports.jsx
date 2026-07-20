import { withAdminAuth } from '@/middleware/adminAuth';

export default function AdminReportsPage() {
  return (
    <main id="main-content" className="container py-5">
      <h1>Admin — reports</h1>
      <p className="text-muted-app">Built in Phase 4/5.</p>
    </main>
  );
}

export const getServerSideProps = withAdminAuth();
