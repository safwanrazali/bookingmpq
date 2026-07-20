import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AlertCircle } from 'lucide-react';
import { bookingDetailsSchema } from '@/lib/validation/bookingSchema';
import styles from './BookingForm.module.scss';

export default function BookingForm({ disabled, submitting, serverError, onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(bookingDetailsSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      organization: '',
      purpose: '',
    },
  });

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-disabled={disabled}
    >
      <h3 className={styles.heading}>Your details</h3>

      {disabled && (
        <p className={styles.hint}>Select a date and time above to fill this in.</p>
      )}

      <fieldset disabled={disabled || submitting} className={styles.fieldset}>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>Full name</label>
          <input id="name" type="text" className="form-control" {...register('name')} />
          {errors.name && <span className={styles.error}>{errors.name.message}</span>}
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Email address</label>
            <input id="email" type="email" className="form-control" {...register('email')} />
            {errors.email && <span className={styles.error}>{errors.email.message}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="phone" className={styles.label}>Phone number</label>
            <input id="phone" type="tel" className="form-control" {...register('phone')} />
            {errors.phone && <span className={styles.error}>{errors.phone.message}</span>}
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="organization" className={styles.label}>
            Organization <span className={styles.optional}>(optional)</span>
          </label>
          <input id="organization" type="text" className="form-control" {...register('organization')} />
          {errors.organization && <span className={styles.error}>{errors.organization.message}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="purpose" className={styles.label}>Purpose of meeting</label>
          <textarea
            id="purpose"
            rows={4}
            className="form-control"
            {...register('purpose')}
          />
          {errors.purpose && <span className={styles.error}>{errors.purpose.message}</span>}
        </div>

        {serverError && (
          <div className={styles.serverError}>
            <AlertCircle size={16} />
            {serverError}
          </div>
        )}

        <button type="submit" className={`btn btn-primary ${styles.submit}`}>
          {submitting ? 'Confirming…' : 'Confirm Booking'}
        </button>
      </fieldset>
    </form>
  );
}

BookingForm.propTypes = {
  disabled: PropTypes.bool,
  submitting: PropTypes.bool,
  serverError: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
};

BookingForm.defaultProps = {
  disabled: false,
  submitting: false,
  serverError: null,
};
