import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

/**
 * Loads availability for [fromKey, toKey] from GET /api/bookings/availability.
 * Re-fetches whenever the range changes, and exposes `refetch` so callers
 * can force a refresh after a 409 conflict (someone else just took a slot).
 */
export default function useAvailability(fromKey, toKey) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAvailability = useCallback(async () => {
    if (!fromKey || !toKey) return;
    setLoading(true);
    setError(null);
    try {
      const { data: response } = await axios.get('/api/bookings/availability', {
        params: { from: fromKey, to: toKey },
      });
      setData(response);
    } catch (err) {
      setError(
        err?.response?.data?.error || 'Failed to load availability. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [fromKey, toKey]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  return { data, loading, error, refetch: fetchAvailability };
}
