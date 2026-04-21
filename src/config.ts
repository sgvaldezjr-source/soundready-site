/**
 * SITE CONFIG
 * ===========
 * Edit this one file to change emails, Formspree IDs, or analytics.
 * Nothing else in the codebase should need touching for routine changes.
 */

export const config = {
  // Where form submissions are delivered (used in copy only — Formspree
  // controls the actual destination via its dashboard).
  contactEmail: "sgvaldezjr@gmail.com",

  // Formspree endpoints.
  // 1. Go to https://formspree.io and create two forms.
  // 2. Copy each form's endpoint (looks like https://formspree.io/f/abcd1234).
  // 3. Paste below.
  // 4. In each Formspree form's settings, enable the Google Sheets integration.
  formspree: {
    contact: "https://formspree.io/f/REPLACE_CONTACT_FORM_ID",
    booking: "https://formspree.io/f/REPLACE_BOOKING_FORM_ID",
  },

  // Analytics (optional). Paste your Plausible domain or GA4 ID later.
  // Then uncomment the matching <script> tag in index.html.
  analytics: {
    plausibleDomain: "", // e.g. "sound-ready.com"
    ga4MeasurementId: "", // e.g. "G-XXXXXXXXXX"
  },
} as const;
