import dbConnect from '@/lib/dbConnect';
import Settings from '@/models/Settings';

/**
 * Returns the single Settings document, creating it with defaults on first
 * use (e.g. right after a fresh MongoDB Atlas deployment where no admin has
 * configured anything yet).
 */
export async function getSettings() {
  await dbConnect();
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
}

export async function updateSettings(patch) {
  await dbConnect();
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create(patch);
  } else {
    Object.assign(settings, patch);
    await settings.save();
  }
  return settings;
}
