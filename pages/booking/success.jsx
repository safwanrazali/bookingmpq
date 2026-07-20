import MainLayout from '@/layouts/MainLayout';

function BookingSuccessPage() {
  return (
    <main id="main-content" className="container py-5">
      <h1>Booking Confirmed</h1>
      <p className="text-muted-app">Confirmation details UI arrives in Phase 3.</p>
    </main>
  );
}

BookingSuccessPage.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default BookingSuccessPage;
