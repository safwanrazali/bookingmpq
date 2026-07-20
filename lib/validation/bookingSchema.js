import * as yup from 'yup';

/**
 * What the booking form itself collects. Kept separate from the full
 * schema below because the date/time aren't form inputs — they come from
 * the calendar + slot picker selections made earlier in the flow.
 */
export const bookingDetailsSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Full name is required')
    .max(120, 'Full name is too long'),
  email: yup
    .string()
    .trim()
    .email('Enter a valid email address')
    .required('Email address is required')
    .max(160, 'Email address is too long'),
  phone: yup
    .string()
    .trim()
    .required('Phone number is required')
    .max(30, 'Phone number is too long'),
  organization: yup.string().trim().max(160, 'Organization name is too long').default(''),
  purpose: yup
    .string()
    .trim()
    .required('Purpose of meeting is required')
    .max(1000, 'Purpose is too long (max 1000 characters)'),
});

/**
 * Full payload sent to POST /api/bookings. This is re-validated on the
 * server regardless of what the client already checked (defense in depth,
 * same principle as the double-booking protection).
 */
export const bookingSchema = bookingDetailsSchema.shape({
  appointmentDate: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Select a valid date')
    .required('Select a date'),
  appointmentTime: yup.string().required('Select a time slot'),
});
