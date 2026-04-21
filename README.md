# SoundReady Site — Deployment Guide

Static React site built with Vite. No server, no database — forms go through **Formspree**, which emails you and can auto-fill a Google Sheet.

\---

## 1\. Set up Formspree (do this first)

You need two forms — one for the contact page, one for the trial booking.

1. Go to **https://formspree.io** and sign up (free tier: 50 submissions/month per form).
2. Create a form called **"Contact"**. Copy its endpoint URL — looks like `https://formspree.io/f/abcd1234`.
3. Create a second form called **"Trial Booking"**. Copy its endpoint.
4. Open `src/config.ts` and paste both endpoints:

```ts
   formspree: {
     contact: "https://formspree.io/f/YOUR\_CONTACT\_ID",
     booking: "https://formspree.io/f/YOUR\_BOOKING\_ID",
   },
   ```

5. In each Formspree form's dashboard → **Integrations** → enable **Google Sheets**. Connect your Google account and pick (or create) a spreadsheet. Every submission now writes a row automatically.

That's the whole backend. Emails come to `sgvaldezjr@gmail.com` (change in `src/config.ts` if needed — but the actual delivery address is controlled in the Formspree dashboard, not in code).

\---

## 2\. Build the site

```bash
npm install
npm run build
```

The `dist/` folder now contains the entire production site — three files:

```
dist/
├── index.html
└── assets/
    ├── index-\[hash].css
    └── index-\[hash].js
```

That's what you upload.

\---

## 3\. Deploy to Spaceship

1. Log into Spaceship → cPanel → **File Manager**.
2. Navigate to `public\_html/` (or the folder tied to `sound-ready.com`).
3. Upload **the contents of `dist/`** (not the folder itself) — so `index.html` sits directly in `public\_html/`.
4. **Important:** create a file called `.htaccess` in the same folder with this content so client-side routing (`/sergio`, `/contact`, etc.) works:

```apache
   <IfModule mod\_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\\.html$ - \[L]
     RewriteCond %{REQUEST\_FILENAME} !-f
     RewriteCond %{REQUEST\_FILENAME} !-d
     RewriteRule . /index.html \[L]
   </IfModule>
   ```

   Without this, refreshing on `/sergio` gives a 404.

   \---

   ## 4\. Point the domain

   In Spaceship's domain panel, make sure `sound-ready.com` (and `www.sound-ready.com`) point to the hosting where you uploaded the files. If you bought the domain and hosting together through Spaceship, this is usually already wired — just confirm the A record / nameservers match the hosting account.

   Wait 5–60 minutes for DNS to propagate, then visit `https://www.sound-ready.com`.

   \---

   ## 5\. Test the forms

* Open `/contact`, submit a test message — check your Gmail and the connected Google Sheet.
* Open `/` and `/sergio`, submit a test booking — same check.

  If nothing arrives: in the Formspree dashboard, open the form → **Submissions** tab. Formspree always shows submissions there even if email delivery hiccupped.

  \---

  ## 6\. Editing content later

* **Text:** edit the `.tsx` files in `src/pages/`. Run `npm run build` again, re-upload `dist/`.
* **Email address:** `src/config.ts`.
* **Formspree IDs:** `src/config.ts`.
* **Analytics:** uncomment the Plausible or GA4 block in `index.html` and paste your ID.

  \---

  ## Future automation (optional)

  Everything below is ready to plug in when you want it — nothing needs rebuilding.

* **Auto-reply to bookers (bilingual EN/ZH):** Formspree paid tier ($10/mo) has autoresponders. Alternative: in Pabbly Connect, catch the Formspree webhook → branch on `language` field → send a Gmail reply with the right template. Keeps the bilingual confirmation you had on the Manus version, for free if you're already on Pabbly.
* **Booking → calendar hold:** Pabbly scenario — Formspree webhook → create Google Calendar event with the `preferredDate` + `preferredTime` fields. Optional tentative hold until you confirm.
* **Booking → draft reply in Gmail:** Pabbly → Gmail "create draft" action with a pre-filled reply. You click send, no typing from scratch.
* **Booking → Slack/Discord/Telegram ping:** Formspree has native Slack; anything else via Pabbly.
* **CMS for editing content without code:** swap page text into JSON files, then point at Notion (via super.so), Sanity, or Contentful free tier. \~1 evening of work when you want it.
* **Analytics:** Plausible (\~$9/mo, privacy-friendly, simple) or GA4 (free, more complex). Both drop into `index.html` — no rebuild needed beyond that edit.
* **A/B testing the hero:** Plausible supports goals and custom events; you can test CTA variants without new tooling.
* **If you ever need the admin dashboard back:** the React code is untouched. You'd add a back-end on Render or Railway, switch the forms from Formspree fetches to your own API, and restore the admin routes. Estimate: 1–2 days. Nothing in the current codebase blocks this.

  \---

  ## File map (for reference)

  ```
src/
├── config.ts                    ← edit Formspree IDs, email, analytics here
├── App.tsx                      ← routes
├── main.tsx                     ← entry point
├── index.css                    ← global styles
├── pages/
│   ├── SoundReady.tsx           ← homepage
│   ├── Sergio.tsx               ← tutor page
│   ├── Contact.tsx              ← contact form
│   ├── PrivacyPolicy.tsx
│   ├── TermsOfService.tsx
│   └── NotFound.tsx
├── components/
│   ├── CookieConsentBanner.tsx
│   ├── ErrorBoundary.tsx
│   └── ui/                      ← shadcn components
├── contexts/
│   ├── LanguageContext.tsx      ← EN/ZH toggle logic
│   └── ThemeContext.tsx
├── hooks/
└── lib/
    ├── translations.ts          ← EN/ZH copy
    └── utils.ts
index.html                       ← SEO meta tags, analytics placeholders
package.json
vite.config.ts
tsconfig.json
```

  Last updated: April 22, 2026

