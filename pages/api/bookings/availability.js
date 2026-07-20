import { getAvailabilityRange } from '@/services/bookingService';

const DATE_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { from, to } = req.query;

  if (!from || !to || !DATE_KEY_RE.test(from) || !DATE_KEY_RE.test(to)) {
    return res.status(400).json({
      error: 'Query params "from" and "to" are required, in YYYY-MM-DD format.',
    });
  }

  if (from > to) {
    return res.status(400).json({ error: '"from" must not be after "to".' });
  }

  try {
    const data = await getAvailabilityRange(from, to);
    return res.status(200).json(data);
  } catch (err) {
    console.error('GET /api/bookings/availability failed:', err);
    return res.status(500).json({ error: 'Failed to load availability. Please try again.' });
  }
}
