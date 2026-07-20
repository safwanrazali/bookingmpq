import dbConnect from '@/lib/dbConnect';
import Booking from '@/models/Booking';
import { getSettings } from '@/services/settingsService';

/** Thrown for any booking-creation failure that should surface as HTTP 409. */
export class ConflictError extends Error {}

/**
 * Availability for every date in [fromKey, toKey] (inclusive), in one query.
 * Returns only which slots are TAKEN per date — the caller derives "open"
 * slots as `bookingSlots - taken`, so the payload stays small and the
 * source of truth (which slots exist at all) always comes from Settings.
 */
export async function getAvailabilityRange(fromKey, toKey) {
  await dbConnect();
  const settings = await getSettings();

  const bookings = await Booking.find({
    appointmentDate: { $gte: fromKey, $lte: toKey },
    status: { $ne: 'cancelled' },
  })
    .select('appointmentDate appointmentTime -_id')
    .lean();

  const days = {};
  for (const booking of bookings) {
    if (!days[booking.appointmentDate]) {
      days[booking.appointmentDate] = [];
    }
    days[booking.appointmentDate].push(booking.appointmentTime);
  }

  return {
    timezone: settings.timezone,
    bookingSlots: settings.bookingSlots,
    allowGuestBooking: settings.allowGuestBooking,
    days,
  };
}

/**
 * Layer 2 of the 3-layer double-booking protection (see README/models for
 * layers 1 and 3). Re-checks the slot is free immediately before inserting.
 * Layer 3 (the partial unique index on Booking) is the final backstop for
 * the race-condition window between this check and the insert — its
 * duplicate-key error (11000) is caught below and turned into the same
 * user-facing message.
 */
export async function createBooking(payload) {
  await dbConnect();
  const settings = await getSettings();

  if (!settings.allowGuestBooking) {
    throw new ConflictError('Guest booking is currently disabled. Please contact us to schedule.');
  }

  if (!settings.bookingSlots.includes(payload.appointmentTime)) {
    throw new ConflictError('That time slot is no longer offered. Please select another slot.');
  }

  const existing = await Booking.findOne({
    appointmentDate: payload.appointmentDate,
    appointmentTime: payload.appointmentTime,
    status: { $ne: 'cancelled' },
  }).lean();

  if (existing) {
    throw new ConflictError('This time slot is no longer available. Please select another slot.');
  }

  try {
    return await Booking.create(payload);
  } catch (err) {
    if (err?.code === 11000) {
      throw new ConflictError('This time slot is no longer available. Please select another slot.');
    }
    throw err;
  }
}

export async function getBookingByPublicId(bookingId) {
  await dbConnect();
  return Booking.findOne({ bookingId }).lean();
}
