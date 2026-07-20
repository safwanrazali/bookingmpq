import MainLayout from '@/layouts/MainLayout';

/**
 * Admin login — placeholder for Phase 2.
 * Full NextAuth credentials form (React Hook Form + Yup) is built in Phase 4
 * alongside the rest of the admin area.
 */
function LoginPage() {
  return (
    <main id="main-content" className="container py-5">
      <h1>Admin Login</h1>
      <p className="text-muted-app">Login form arrives with the admin dashboard in Phase 4.</p>
    </main>
  );
}

LoginPage.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default LoginPage;
