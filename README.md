# Handwerker-Prototyp

A config-driven website + booking system for trade businesses (Handwerksbetriebe). The first configuration is based on [badsanierung-berlin.de](https://badsanierung-berlin.de/) (Stefan Sniegowski GmbH).

**To create it for another company, edit one file: [`site.config.js`](site.config.js)** — company data, services, reference projects, FAQ, colours, opening hours and appointment types. Nothing else needs to change.

## Features

| Area | What it does |
| --- | --- |
| Website | Hero, services (with detail pages), about/advantages, 3-step process, reference gallery with filter, partner brands, FAQ, contact |
| Online booking (`/termin`) | Step-by-step: service → appointment type → day/time → details. Real availability from opening hours, lead time, buffers and existing bookings; double-booking is rejected |
| Two appointment types | **Besichtigung vor Ort** (on-site, needs address, confirmed by the company) and **Video-Beratung** (auto-confirmed) |
| Meeting link to both parties | Video calls get a meeting link that is emailed to the customer **and** the company. Either via **Calendly** (Calendly sends Zoom/Meet/Teams link to both) or, without Calendly, an automatic Jitsi link sent by the app |
| Customer self-service | Confirmation email with `.ics` calendar file and a private link (`/buchung/<id>?t=…`) to view or cancel |
| Admin dashboard (`/admin`) | Open requests / upcoming / past / cancelled, search, confirm/cancel/done (customer is emailed automatically), internal notes, closed days (holidays), setup checklist |
| Demo safety | While `NEXT_PUBLIC_DEMO_MODE` isn't `false`: "Prototyp" banner, `noindex`, and company notifications go **only** to `NOTIFY_EMAIL` – never to the real company address |

Stack: Next.js (App Router), plain CSS, no other dependencies. Optional services: Upstash Redis (storage), Resend (email), Calendly.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000 — admin: /admin, password "demo"
npm test           # logic tests (slots, bookings, Calendly signature, .ics …)
```

Without any environment variables it runs fully in memory with sample bookings.

## Push to GitHub (your other account)

```bash
cd handwerker-prototype
git remote add origin https://github.com/<other-account>/handwerker-prototype.git
git push -u origin main
```

Create the empty repo on GitHub first (no README/licence, so the push isn't rejected). If your machine is logged in with your main account, use a personal access token of the other account when git asks for a password, or the GitHub CLI: `gh auth login` → pick the other account → `gh repo create handwerker-prototype --private --source . --push`.

## Deploy on Vercel

1. vercel.com → **Add New → Project** → import the repo (connect the other GitHub account under *Add GitHub Account* if needed). Framework is detected as Next.js; no settings to change.
2. **Storage:** Project → *Storage* (or Marketplace) → **Upstash for Redis** → connect. This sets `KV_REST_API_URL` / `KV_REST_API_TOKEN`. Without it, bookings live in memory and vanish on redeploy.
3. **Environment variables** (Project → Settings → Environment Variables), see [`.env.example`](.env.example):
   - `ADMIN_PASSWORD` – dashboard password
   - `RESEND_API_KEY`, `MAIL_FROM`, `NOTIFY_EMAIL` – confirmation + meeting-link emails
   - `NEXT_PUBLIC_CALENDLY_URL` (+ `CALENDLY_TOKEN`, `CALENDLY_WEBHOOK_SIGNING_KEY`) – optional Calendly
4. Redeploy. Every push to `main` deploys automatically.

## Calendly setup (optional)

1. In Calendly, create an event type "Video-Beratung" (30 min) with location **Google Meet / Zoom / Teams**. Calendly then emails the confirmation with the meeting link to both the customer and you.
2. Optional custom questions: question 1 "Telefon", question 2 "Worum geht es?" — the booking form pre-fills them.
3. Set `NEXT_PUBLIC_CALENDLY_URL` to the event link → the "Video-Beratung" step embeds Calendly.
4. Set `CALENDLY_TOKEN` (Integrations → API & Webhooks → Personal access token) so the dashboard shows date, time and meeting link of each call, and these calls block the same time for on-site visits.
5. For cancellations/reschedules to sync (paid Calendly plan): `CALENDLY_TOKEN=… npm run calendly:webhook -- https://<your-domain>/api/webhooks/calendly`, then put the printed `CALENDLY_WEBHOOK_SIGNING_KEY` into Vercel.

Without Calendly, video calls use the built-in calendar and a generated `meet.jit.si` link — no account needed.

## Project structure

```
site.config.js            ← everything company-specific
app/(site)/               ← public pages: home, leistungen/[slug], referenzen, termin, buchung/[id]
app/admin/                ← dashboard + login
app/api/                  ← slots, bookings, admin, calendly callback, calendly webhook
components/               ← BookingWizard, CalendlyEmbed, AdminDashboard, …
lib/                      ← slots, store (Redis/memory), mail (Resend), calendly, ics, auth, time
scripts/calendly-webhook.mjs
tests/lib.test.js
```

## Before going live for a real company

- Replace the placeholder reference projects and confirm image rights with the company.
- Set `NEXT_PUBLIC_DEMO_MODE=false`, `ADMIN_PASSWORD`, a verified `MAIL_FROM` domain and `NOTIFY_EMAIL`.
- Link to the company's own Impressum/Datenschutz (in `site.config.js`), and mention Calendly/Resend/Upstash in the privacy policy.
