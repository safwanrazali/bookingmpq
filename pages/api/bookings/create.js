import dbConnect from '@/lib/dbConnect';
import Booking from '@/models/Booking';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { fullName, agency, email, contactNumber, address, notes } = req.body;

    // Validate required fields
    if (!fullName || !agency || !email) {
      return res.status(400).json({
        message: 'Full name, agency/organization, and email are required',
      });
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    // Create booking
    const booking = new Booking({
      name: fullName,
      email,
      date: new Date(),
      slot: null, // Will be assigned when user selects a slot
      agency,
      contactNumber,
      address,
      notes,
      status: 'pending',
    });

    await booking.save();

    return res.status(201).json({
      message: 'Booking created successfully',
      booking: {
        id: booking._id,
        name: booking.name,
        email: booking.email,
      },
    });
  } catch (error) {
    console.error('Booking creation error:', error);

    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({
        message: 'A booking with this email already exists',
      });
    }

    return res.status(500).json({
      message: 'Failed to create booking. Please try again later.',
    });
  }
}
