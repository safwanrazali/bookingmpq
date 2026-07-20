import mongoose from 'mongoose';
import crypto from 'crypto';

const { Schema, models, model } = mongoose;

/**
 * Design notes:
 * - `appointmentDate` is stored as a plain 'YYYY-MM-DD' string rather than a
 *   Date object. Since the whole platform operates in a single timezone
 *   (Asia/Kuala_Lumpur) this avoids UTC-shift bugs when comparing dates and
 *   makes the uniqueness index trivial to reason about.
 * - `appointmentTime` is stored exactly as displayed (e.g. "9:00 AM") since
 *   slots are a small, admin-managed set of strings (see Settings model).
 * - Double-booking prevention (layer 3 of 3, see below) is enforced with a
 *   partial unique compound index on {appointmentDate, appointmentTime} that
 *   only applies to bookings that are NOT cancelled. This lets a cancelled
 *   slot free up for a new booking while guaranteeing MongoDB itself will
 *   reject a race-condition double-insert with a duplicate key error (code
 *   11000), even if frontend/backend checks are somehow bypassed.
 *
 * Full double-booking protection stack:
 *   1. Frontend  -> already-booked slots are fetched and disabled in the UI
 *   2. Backend   -> POST /api/bookings re-checks availability before insert
 *   3. Database  -> partial unique index below is the final source of truth
 */

const BookingSchema = new Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      default: () => crypto.randomUUID(),
      immutable: true,
    },
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
      maxlength: 160,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      maxlength: 30,
    },
    organization: {
      type: String,
      trim: true,
      maxlength: 160,
      default: '',
    },
    purpose: {
      type: String,
      required: [true, 'Purpose of meeting is required'],
      trim: true,
      maxlength: 1000,
    },
    appointmentDate: {
      type: String, // 'YYYY-MM-DD' in Asia/Kuala_Lumpur
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    appointmentTime: {
      type: String, // e.g. '9:00 AM'
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    assignedMember: {
      type: Schema.Types.ObjectId,
      ref: 'TeamMember',
      default: null,
    },
  },
  { timestamps: true }
);

// Layer 3 double-booking protection: DB-enforced uniqueness.
// Cancelled bookings are excluded so a cancelled slot can be rebooked.
BookingSchema.index(
  { appointmentDate: 1, appointmentTime: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $ne: 'cancelled' } },
    name: 'unique_active_slot',
  }
);

BookingSchema.index({ email: 1 });
BookingSchema.index({ status: 1, appointmentDate: 1 });

export default models.Booking || model('Booking', BookingSchema);
