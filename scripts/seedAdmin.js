/* eslint-disable no-console */
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function run() {
  const { MONGODB_URI, SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD } = process.env;

  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not set in .env.local');
    process.exit(1);
  }
  if (!SEED_ADMIN_EMAIL || !SEED_ADMIN_PASSWORD) {
    console.error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in .env.local');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);

  const UserSchema = new mongoose.Schema(
    {
      name: String,
      email: { type: String, unique: true, lowercase: true },
      password: String,
      role: { type: String, default: 'admin' },
    },
    { timestamps: true }
  );

  const User = mongoose.models.User || mongoose.model('User', UserSchema);

  const existing = await User.findOne({ email: SEED_ADMIN_EMAIL.toLowerCase() });
  if (existing) {
    console.log(`Admin user ${SEED_ADMIN_EMAIL} already exists. Nothing to do.`);
    await mongoose.disconnect();
    return;
  }

  const hashed = await bcrypt.hash(SEED_ADMIN_PASSWORD, 10);

  await User.create({
    name: 'Administrator',
    email: SEED_ADMIN_EMAIL.toLowerCase(),
    password: hashed,
    role: 'superadmin',
  });

  console.log(`✔ Admin user created: ${SEED_ADMIN_EMAIL}`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
