import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import MainLayout from '@/layouts/MainLayout';
import styles from '@/styles/BookingForm.module.scss';

const bookingSchema = yup.object().shape({
  fullName: yup.string().required('Full name is required').min(2, 'Full name must be at least 2 characters'),
  agency: yup.string().required('Agency/Organization is required').min(2, 'Agency/Organization must be at least 2 characters'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  contactNumber: yup.string().matches(/^[0-9\-\+\s()]*$/, 'Invalid contact number'),
  address: yup.string(),
  notes: yup.string(),
});

function BookingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(bookingSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create booking');
      }

      reset();
      router.push('/booking/success');
    } catch (error) {
      setSubmitError(error.message || 'An error occurred. Please try again.');
      console.error('Booking submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main id="main-content" className={styles.bookingPage}>
      {/* Banner */}
      <div className={styles.banner}>
        <img src="/ptpkm-nacsa-banner.png" alt="PTPKM NACSA" className={styles.bannerImage} />
      </div>

      <div className="container py-5">
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <h1>Book an Appointment</h1>
            <p className={styles.subtitle}>Please fill in your details below to schedule an appointment</p>
          </div>

          {submitError && (
            <div className={`alert alert-danger ${styles.alert}`} role="alert">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            {/* Full Name */}
            <div className={styles.formGroup}>
              <label htmlFor="fullName" className={styles.label}>
                Full Name <span className={styles.required}>*</span>
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                {...register('fullName')}
              />
              {errors.fullName && (
                <div className={styles.errorMessage}>{errors.fullName.message}</div>
              )}
            </div>

            {/* Agency/Organization */}
            <div className={styles.formGroup}>
              <label htmlFor="agency" className={styles.label}>
                Agency/Organization <span className={styles.required}>*</span>
              </label>
              <input
                id="agency"
                type="text"
                placeholder="Enter your agency or organization name"
                className={`form-control ${errors.agency ? 'is-invalid' : ''}`}
                {...register('agency')}
              />
              {errors.agency && (
                <div className={styles.errorMessage}>{errors.agency.message}</div>
              )}
            </div>

            {/* Email */}
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email <span className={styles.required}>*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email address"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                {...register('email')}
              />
              {errors.email && (
                <div className={styles.errorMessage}>{errors.email.message}</div>
              )}
            </div>

            {/* Contact Number */}
            <div className={styles.formGroup}>
              <label htmlFor="contactNumber" className={styles.label}>
                Contact Number
              </label>
              <input
                id="contactNumber"
                type="tel"
                placeholder="Enter your contact number"
                className={`form-control ${errors.contactNumber ? 'is-invalid' : ''}`}
                {...register('contactNumber')}
              />
              {errors.contactNumber && (
                <div className={styles.errorMessage}>{errors.contactNumber.message}</div>
              )}
            </div>

            {/* Address */}
            <div className={styles.formGroup}>
              <label htmlFor="address" className={styles.label}>
                Address
              </label>
              <textarea
                id="address"
                placeholder="Enter your address"
                rows="3"
                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                {...register('address')}
              />
              {errors.address && (
                <div className={styles.errorMessage}>{errors.address.message}</div>
              )}
            </div>

            {/* Notes */}
            <div className={styles.formGroup}>
              <label htmlFor="notes" className={styles.label}>
                Additional Notes
              </label>
              <textarea
                id="notes"
                placeholder="Any additional information for your booking"
                rows="3"
                className={`form-control ${errors.notes ? 'is-invalid' : ''}`}
                {...register('notes')}
              />
              {errors.notes && (
                <div className={styles.errorMessage}>{errors.notes.message}</div>
              )}
            </div>

            {/* Submit Button */}
            <div className={styles.formActions}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Booking...' : 'Book Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

BookingPage.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default BookingPage;
