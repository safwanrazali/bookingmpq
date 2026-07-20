import mongoose from 'mongoose';

const { Schema, models, model } = mongoose;

/**
 * Settings is a singleton collection — there should only ever be one
 * document. Use the static `getSingleton()` helper (see services/settingsService.js)
 * instead of querying this model directly, so a document is always
 * guaranteed to exist with sensible defaults.
 */
const SettingsSchema = new Schema(
  {
    organizationName: {
      type: String,
      default: 'Our Organization',
      trim: true,
    },
    bookingSlots: {
      type: [String], // e.g. ['10:00 AM', '02:00 PM']
      default: ['10:00 AM', '02:00 PM'],
    },
    timezone: {
      type: String,
      default: 'Asia/Kuala_Lumpur',
    },
    allowGuestBooking: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default models.Settings || model('Settings', SettingsSchema);
