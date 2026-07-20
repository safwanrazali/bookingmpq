import { bookingSchema } from '@/lib/validation/bookingSchema';
import { createBooking, ConflictError } from '@/services/bookingService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let payload;
  try {
    payload = await bookingSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
  } catch (validationError) {
    return res.status(400).json({
      error: 'Please check the highlighted fields.',
      details: validationError.errors,
    });
  }

  try {
    const booking = await createBooking(payload);
    return res.status(201).json({
      bookingId: booking.bookingId,
      appointmentDate: booking.appointmentDate,
      appointmentTime: booking.appointmentTime,
      status: booking.status,
    });
  } catch (err) {
    if (err instanceof ConflictError) {
      return res.status(409).json({ error: err.message });
    }
    console.error('POST /api/bookings failed:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
