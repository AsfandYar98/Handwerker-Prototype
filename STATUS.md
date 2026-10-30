# Status

## Repo access
- Madhu works on this repo exclusively via the GitHub account **madhugermany**
  (SSH alias `github-madhugermany`, repo-local user.name and user.email).
  Not via vahyoadmin or madhukarsollepura.
- Asfand: AsfandYar98 (owner).

## Log
- 2026-10-28: Initial prototype pushed by Asfand. Madhu granted push access and set up madhugermany locally.
- 2026-10-28: Polish – demo banner replaced by a "Prototyp-Version" footer line, header button hover fixed, "Was planen Sie?" moved into its own section below the hero, Next.js dev indicator hidden.
- 2026-10-29: Localisation – public site in German, English and Polish under /de, /en, /pl with a language switcher; booking flow, customer emails and .ics follow the booking's language; admin and company emails stay German.
- 2026-10-30: Open demo admin – with demo mode on and no ADMIN_PASSWORD, /admin and the admin API need no login ("Demo-Ansicht", no "Abmelden"); customer email, phone and street are masked in that view. Setting ADMIN_PASSWORD locks it again and ends sessions from the open phase.
- 2026-10-30: Admin is open whenever demo mode is on, regardless of ADMIN_PASSWORD; NEXT_PUBLIC_DEMO_MODE=false locks it (then ADMIN_PASSWORD applies).
- 2026-10-30: Dashboard – setup checklist only on /admin?setup=1; in the demo view customer names are shortened to first name + surname initial ("Jana B.").
