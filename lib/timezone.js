/**
 * The whole platform operates in a single timezone. Reading this from
 * env (with a hard-coded fallback) means Vercel's UTC-based serverless
 * functions and the browser both agree on what "today" and "10:00 AM" mean,
 * regardless of where the request actually comes from.
 */
export const APP_TIMEZONE = process.env.NEXT_PUBLIC_APP_TIMEZONE || 'Asia/Kuala_Lumpur';
