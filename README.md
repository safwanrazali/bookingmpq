# Appointment Booking Platform — Phases 1–3

Phase 1 (foundation), Phase 2 (layouts/homepage), and Phase 3 (booking flow) are
complete. Phases 4–5 (admin dashboard, Excel export + deployment) build on this.

## What's included in Phase 3

| Area | Files | Notes |
|---|---|---|
| Date/timezone helpers | `lib/timezone.js`, `lib/dateUtils.js` | Single `APP_TIMEZONE` source of truth; date-key helpers used by client and server alike |
| Validation | `lib/validation/bookingSchema.js` | `bookingDetailsSchema` (client form) + `bookingSchema` (full server payload) — same rules enforced on both sides |
| Domain logic | `services/bookingService.js` | Availability calculation + `createBooking()` (the layer-2 double-booking re-check) |
| APIs | `pages/api/bookings/availability.js`, `pages/api/bookings/index.js`, `pages/api/bookings/[bookingId].js` | Range availability, guest booking creation, single-booking lookup for the confirmation page |
| Booking UI | `components/booking/*`, `pages/booking/index.jsx` | Calendar → slot picker → React Hook Form, in one flow |
| Confirmation | `pages/booking/success.jsx` | Fetches the booking by its (unguessable) `bookingId` and shows a summary |

## Architecture decisions

**Why availability is fetched as a range, not per-day.** The calendar needs to know,
for every visible day, whether it's fully booked (to grey it out) — fetching that
one day at a time would mean 30-plus requests per month view. `GET
/api/bookings/availability?from=...&to=...` returns only the *taken* times per date
in a single query; the client derives "open" slots as `bookingSlots - taken`, so the
list of slots that exist at all always comes from `Settings`, not from the
availability response itself.

**Where each double-booking layer actually lives now:**
1. **Frontend** — `SlotPicker` disables any time already present in that date's
   taken-times list, sourced from the availability fetch.
2. **Backend** — `services/bookingService.js#createBooking()` re-queries for an
   existing non-cancelled booking on that exact date+time immediately before
   inserting, and returns the specified message if one exists.
3. **Database** — the partial unique index from Phase 1 is the final backstop. If a
   second request slips past layer 2 in the race-condition window, MongoDB's
   duplicate-key error (`11000`) is caught in the same function and turned into the
   identical user-facing message — the client can't tell which layer caught it.

**Why the booking form only collects personal details, not date/time.** `BookingForm`
validates against `bookingDetailsSchema` (name/email/phone/organization/purpose)
only; the date and time come from state set by the calendar and slot picker
earlier in the flow. The full `bookingSchema` (adding `appointmentDate` +
`appointmentTime`) is what the *server* validates against — so the server is never
trusting client-assembled state for the fields that matter most for the
double-booking guarantee.

**Why the confirmation page re-fetches instead of reading query params directly.**
`/booking/success?id=<bookingId>` only carries the public `bookingId` (a UUID) in
the URL. The page calls `GET /api/bookings/[bookingId]` to load the authoritative
record — this means a stale or tampered-with query string can't misrepresent what
was actually saved, and it keeps the URL shareable/bookmarkable without leaking
anything beyond an unguessable identifier.

**Why calendar dates are compared as local `Date` objects instead of real
timestamps.** `dateKeyToLocalDate()` turns a `'YYYY-MM-DD'` key into a plain JS
`Date` at local midnight, used only for calendar-grid math (which weekday, is it
before today, is it in the displayed month). It's never used as a real-world
instant, so there's no timezone conversion to get wrong — the actual timezone
guarantee comes from `toDateKey()`, which always formats through `APP_TIMEZONE`.

---

# Phase 1 — Foundation

## What's included in Phase 1

| Area | Files | Notes |
|---|---|---|
| Project config | `package.json`, `next.config.js`, `jsconfig.json`, `.env.local.example`, `.gitignore` | Pages Router only, JS only (no TS), `@/*` import aliases |
| Database | `lib/dbConnect.js` | Cached connection pattern required for Mongoose in serverless/Vercel functions |
| Models | `models/User.js`, `models/TeamMember.js`, `models/Booking.js`, `models/Settings.js` | See "Double-booking protection" below |
| Services | `services/settingsService.js` | Singleton-settings fetch/create helper |
| Auth | `pages/api/auth/[...nextauth].js`, `middleware.js`, `middleware/adminAuth.js` | Credentials-based admin login, protected at the edge AND in `getServerSideProps` |
| Styles | `styles/variables.scss`, `styles/mixins.scss`, `styles/globals.scss` | Bootstrap 5 theme variables are overridden with the brief's color palette **before** Bootstrap's Sass is imported |
| Pages | `pages/index.jsx`, `pages/login.jsx`, `pages/booking/*`, `pages/admin/*` | Route stubs only — real UI lands in later phases |
| Seeding | `scripts/seedAdmin.js` | Creates the first admin user from `.env.local` |

## Architecture decisions

**Why Pages Router, not App Router.** Explicitly required by the brief. All data
fetching for admin pages uses `getServerSideProps` + `withAdminAuth()` rather than
Server Components, and all API routes live under `pages/api/*`.

**Why SCSS Modules + a shared `globals.scss`, not Tailwind/MUI/styled-components.**
Component-level styling will live in colocated `*.module.scss` files (added in Phase 2+).
`globals.scss` only holds: (1) Bootstrap's variable overrides so its components inherit
our palette instead of stock Bootstrap blue, and (2) a handful of truly global rules
(base body color, focus rings, the skip-link). Nothing component-specific goes here.

**Why `mongoose.connect` is cached on `global`.** Next.js API routes on Vercel run as
separate serverless functions that can be invoked many times per second. Without the
cache in `lib/dbConnect.js`, each invocation could open a brand-new connection to
MongoDB Atlas and quickly exhaust the Free Tier's connection limit.

**Double-booking protection (3 layers, per the brief):**
1. **Frontend** (Phase 3) — the booking page fetches already-taken slots for the
   selected date and disables them in the UI before the user can even submit.
2. **Backend** (Phase 3) — `POST /api/bookings` re-checks the slot is free inside the
   request handler immediately before inserting, closing most of the race-condition
   window.
3. **Database** (this phase) — `models/Booking.js` defines a **partial unique
   compound index** on `{ appointmentDate, appointmentTime }`, scoped to
   `status: { $ne: 'cancelled' }`. This is the real guarantee: even if two requests
   hit step 2 at the exact same millisecond, MongoDB itself will reject the second
   insert with a duplicate-key error (code `11000`), which the API layer will catch
   and turn into: *"This time slot is no longer available. Please select another
   slot."* Cancelling a booking doesn't delete it (for audit/history), it just flips
   `status`, and the partial index means a cancelled slot becomes bookable again.

**Why `appointmentDate` is a `'YYYY-MM-DD'` string, not a `Date`.** The whole platform
operates in a single timezone (`Asia/Kuala_Lumpur`). Storing dates as plain calendar
strings avoids an entire class of UTC-offset bugs (e.g. a booking made late at night
silently shifting to the wrong calendar day) and keeps the uniqueness index simple to
reason about. Formatting to `DD MMM YYYY` for display happens in the UI layer only,
using `date-fns` + `date-fns-tz` (added in Phase 3).

**Why `Settings` is a singleton.** There is exactly one organization-wide config
(slots, timezone, guest-booking toggle). `services/settingsService.js` guarantees a
document always exists via `getSettings()`, so admin-facing code (Phase 4/5) never has
to null-check it.

**Auth is checked twice.** `middleware.js` runs on the Edge and redirects
unauthenticated visitors before any admin page even starts rendering — fast, but it
only reads the JWT cookie. `middleware/adminAuth.js`'s `withAdminAuth()` wraps
`getServerSideProps` as a second, server-rendered check, so direct data-fetching code
never executes for a signed-out session either (defense in depth, same principle as
the double-booking protection above).

## Setup

```bash
npm install
cp .env.local.example .env.local
# then fill in MONGODB_URI, NEXTAUTH_SECRET, SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD

npm run seed:admin   # creates your first admin user
npm run dev          # http://localhost:3000
```

Verify the database connection any time at `GET /api/health`.

## Coming in later phases

- **Phase 4** — Admin dashboard shell (top nav + collapsible drawer), bookings CRUD,
  team members CRUD.
- **Phase 5** — Excel export (`xlsx` package) and Vercel deployment prep
  (environment variables, build checks, MongoDB Atlas network access).

---
*Say "continue with Phase 4" whenever you're ready.*
