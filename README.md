# Handwerker-Prototyp

A config-driven website + booking system for trade businesses (Handwerksbetriebe). The first configuration is based on [badsanierung-berlin.de](https://badsanierung-berlin.de/) (Stefan Sniegowski GmbH).

**To create it for another company, edit one file: [`site.config.js`](site.config.js)** — company data, services, reference projects, FAQ, section headings (`copy`), colours, opening hours and appointment types. Nothing else needs to change.

## Features

| Area | What it does |
| --- | --- |
| Website | Hero, services (with detail pages), about/advantages, 3-step process, reference gallery with filter, partner brands, FAQ, contact |
| Languages | German (default), English, Polish: `/de`, `/en`, `/pl` with a DE/EN/PL switcher. Booking flow, emails and `.ics` files follow the customer's language. Admin stays German |
| Online booking (`/<lang>/termin`) | Step-by-step: service → appointment type → day/time → details. Real availability from opening hours, lead time, buffers and existing bookings; double-booking is rejected |
| Two appointment types | **Besichtigung vor Ort** (on-site, needs address, confirmed by the company) and **Video-Beratung** (auto-confirmed) |
| Meeting link to both parties | Video calls get a meeting link that is emailed to the customer **and** the company. Either via **Calendly** (Calendly sends Zoom/Meet/Teams link to both) or, without Calendly, an automatic Jitsi link sent by the app |
| Customer self-service | Confirmation email with `.ics` calendar file and a private link (`/<lang>/buchung/<id>?t=…`) to view or cancel |
| Admin dashboard (`/admin`) | Open requests / upcoming / past / cancelled, search, confirm/cancel/done (customer is emailed automatically), internal notes, closed days (holidays), setup checklist (`/admin?setup=1`) |
| Demo safety | While `NEXT_PUBLIC_DEMO_MODE` isn't `false`: small "Prototyp-Version" line in the footer, `noindex`, and company notifications go **only** to `NOTIFY_EMAIL` – never to the real company address |

Stack: Next.js (App Router), plain CSS, no other dependencies. Optional services: Upstash Redis (storage), Resend (email), Calendly.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000 — admin: /admin (open, no login in demo mode)
npm test           # logic tests (slots, bookings, Calendly signature, .ics …)
```

Without any environment variables it runs fully in memory with sample bookings.

## Languages

Every public URL starts with the language: `/de`, `/en`, `/pl` (e.g. `/en/termin`, `/pl/referenzen`). `/` redirects to the visitor's language: the `lang` cookie set by the language switcher, else the first supported language in the browser's `Accept-Language`, else German. Unknown languages (`/fr/…`) show the not-found page. Old unprefixed links (`/termin`, `/buchung/<id>` from earlier emails) redirect to `/de/…`.

Where texts live:

- **UI strings** (navigation, buttons, booking wizard, validation, emails, 404): `lib/i18n/de.js`, `en.js`, `pl.js` — flat objects with identical keys. German is the source of truth; `npm test` fails if a key is missing or empty in any language.
- **Company content** (services, FAQ, hero, section headings under `copy` …): `site.config.js`, as `{ de, en, pl }` objects. A plain string is used as-is in every language, so an untranslated config still works.

Each booking stores the customer's `lang`. Customer emails, the `.ics` file and the link in the confirmation email use it; company notifications and the admin dashboard (`/admin`) stay German only.

**Adding a language** (e.g. French):

1. Add `"fr"` to `LANGS` and `LOCALES` (`"fr-FR"`) and its name to `LANG_NAMES` in `lib/i18n/config.js`.
2. Copy `lib/i18n/de.js` (the source of truth) to `fr.js`, translate the values, and register it in `lib/i18n/index.js`.
3. Add `fr` to every `{ de, en, pl }` text in `site.config.js` (missing entries fall back to German; `npm test` lists them).
4. Run `npm test` — the parity test checks keys, placeholders and empty values.

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
   - `ADMIN_PASSWORD` – dashboard password, applies once demo mode is off, see [Demo admin](#demo-admin)
   - `RESEND_API_KEY`, `MAIL_FROM`, `NOTIFY_EMAIL` – confirmation + meeting-link emails
   - `NEXT_PUBLIC_CALENDLY_URL` (+ `CALENDLY_TOKEN`, `CALENDLY_WEBHOOK_SIGNING_KEY`) – optional Calendly
4. Redeploy. Every push to `main` deploys automatically.

## Demo admin

While demo mode is on, `/admin` is open, whether or not `ADMIN_PASSWORD` is set: no login, and anyone with the URL can view and change bookings. Customer details are masked in that view (name `Jana B.`, email `j…@example.com`, phone `015…893`, street hidden; ZIP and city stay), while stored bookings, emails and the customer's `.ics` keep the real data. To lock it, set `NEXT_PUBLIC_DEMO_MODE=false` and redeploy; then `ADMIN_PASSWORD` applies and sessions from the demo phase end. This also switches off the other demo safeguards (see *Demo safety* above), so company notifications start going to the real company address.

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
app/[lang]/               ← public site (root layout per language) + not-found
app/[lang]/(site)/        ← public pages: home, leistungen/[slug], referenzen, termin, buchung/[id]
app/(root)/page.jsx       ← "/" → redirect to the visitor's language
app/admin/                ← dashboard + login (German only, own root layout)
app/api/                  ← slots, bookings, admin, calendly callback, calendly webhook
components/               ← BookingWizard, CalendlyEmbed, AdminDashboard, …
lib/                      ← slots, store (Redis/memory), mail (Resend), calendly, ics, auth, time
lib/i18n/                 ← dictionaries (de/en/pl), getDict, t(), withLang(), date formatting
scripts/calendly-webhook.mjs
tests/lib.test.js, tests/i18n.test.js, tests/open-demo-admin.test.js (+ tests/helpers/)
```

## Before going live for a real company

- Have a native speaker review the English and Polish texts (`lib/i18n/en.js`, `pl.js`, and the `en`/`pl` entries in `site.config.js`) — they were generated.
- Replace the placeholder reference projects and confirm image rights with the company.
- Set `NEXT_PUBLIC_DEMO_MODE=false`, `ADMIN_PASSWORD`, a verified `MAIL_FROM` domain and `NOTIFY_EMAIL`.
- Link to the company's own Impressum/Datenschutz (in `site.config.js`), and mention Calendly/Resend/Upstash in the privacy policy.
