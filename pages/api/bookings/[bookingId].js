import { getBookingByPublicId } from '@/services/bookingService';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { bookingId } = req.query;

  try {
    const booking = await getBookingByPublicId(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    // Only expose what a confirmation screen needs - never the raw _id.
    return res.status(200).json({
      bookingId: booking.bookingId,
      name: booking.name,
      organization: booking.organization,
      purpose: booking.purpose,
      appointmentDate: booking.appointmentDate,
      appointmentTime: booking.appointmentTime,
      status: booking.status,
    });
  } catch (err) {
    console.error('GET /api/bookings/[bookingId] failed:', err);
    return res.status(500).json({ error: 'Failed to load booking.' });
  }
}
