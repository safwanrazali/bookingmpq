import dbConnect from '@/lib/dbConnect';

export default async function handler(req, res) {
  try {
    await dbConnect();
    res.status(200).json({ ok: true, db: 'connected' });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
