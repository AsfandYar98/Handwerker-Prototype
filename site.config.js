/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SITE CONFIG — everything company-specific lives in this one file.
 *
 *  To spin up the prototype for another Handwerksbetrieb, copy this file,
 *  replace company / services / projects / theme / availability, and deploy.
 *  Nothing else in the codebase needs to change.
 *
 *  This first config is based on badsanierung-berlin.de (Stefan Sniegowski GmbH).
 * ─────────────────────────────────────────────────────────────────────────────
 */

const IMG = "https://badsanierung-berlin.de/wp-content/uploads";

export const siteConfig = {
  /** Used as storage key prefix, so several companies can share one Redis DB. */
  slug: "badsanierung-berlin",
  locale: "de-DE",
  timezone: "Europe/Berlin",

  /**
   * Demo mode: shows a "Prototyp" banner, sets noindex, and never sends
   * notifications to the real company address (only to NOTIFY_EMAIL).
   * Set NEXT_PUBLIC_DEMO_MODE=false once the company has signed off.
   */
  demo: {
    enabled: process.env.NEXT_PUBLIC_DEMO_MODE !== "false",
    bannerText:
      "Prototyp – Buchungen auf dieser Seite sind Testdaten und werden nicht an den Betrieb weitergeleitet.",
  },

  company: {
    brand: "Badsanierung Berlin",
    legalName: "Stefan Sniegowski GmbH",
    trade: "Meisterbetrieb Sanitär",
    since: 1997,
    logoUrl: `${IMG}/2020/02/cropped-logozusatz.webp`,
    phone: "030 / 97608603",
    phoneHref: "+493097608603",
    fax: "030 / 97608604",
    email: "mail@heizungsprofi.info",
    address: { street: "Verdener Gasse 14", zip: "13055", city: "Berlin" },
    serviceArea: "Berlin und Umgebung",
    openingHours: "Mo–Do, 08:00–18:00 Uhr",
    legalLinks: [
      { label: "Impressum", href: "https://badsanierung-berlin.de/index.php/impressum/" },
      { label: "Datenschutz", href: "https://badsanierung-berlin.de/index.php/datenschutzerklaerung/" },
    ],
    privacyUrl: "https://badsanierung-berlin.de/index.php/datenschutzerklaerung/",
  },

  seo: {
    title: "Badsanierung Berlin – Meisterbetrieb für Ihr neues Bad",
    description:
      "Badsanierung in Berlin aus einer Hand: Planung, Umbau und Endreinigung vom Meisterbetrieb. Besichtigung oder Video-Beratung direkt online buchen.",
  },

  /** Colours are injected as CSS variables, so each company gets its own look. */
  theme: {
    tile: "#F6F8F7", // page background, the "tile"
    grout: "#DCE3E1", // grid lines / borders
    ink: "#1C2A2E", // text
    primary: "#0E4D5C", // petrol – buttons, headings
    primarySoft: "#E3EEEF",
    accent: "#B5863A", // brass – used sparingly
  },

  hero: {
    title: "Badsanierung Berlin",
    lead:
      "Ihr neues Bad vom Berliner Meisterbetrieb – geplant, gebaut und sauber übergeben. Alles aus einer Hand, mit Festpreis vor Baubeginn.",
    image: `${IMG}/2026/08/hochwertiges-bad-e1787817444372-1024x683.webp`,
    imageAlt: "Modernes Bad mit großzügiger Walk-in-Dusche",
  },

  trustPoints: [
    { title: "Meisterbetrieb seit 1997", text: "Geprüfte Handwerksqualität aus Berlin." },
    { title: "5 Jahre Garantie", text: "Auf unsere Handwerksleistung – schriftlich." },
    { title: "Alles aus einer Hand", text: "Von der Planung bis zur Endreinigung." },
  ],

  services: [
    {
      slug: "standard-bad",
      name: "Standard Bad",
      short: "Solide, pflegeleichte Ausstattung – sauber geplant und zügig umgesetzt.",
      image: `${IMG}/2026/08/standard-bad-1024x683.webp`,
      points: [
        "Einfache Konstruktionen nach Maß",
        "Praktische Einrichtung, abgestimmt vor Ort",
        "Planung und Ausführung komplett aus einer Hand",
      ],
      body:
        "Für Mietwohnungen, Zweitbäder oder alle, die ein funktionales Bad ohne Schnickschnack möchten. Wir nehmen Maß, schlagen robuste Materialien vor und setzen alles termingerecht um.",
      typicalDuration: "ca. 2–3 Wochen",
    },
    {
      slug: "hochwertiges-bad",
      name: "Hochwertiges Bad",
      short: "Großzügige Duschen, Designarmaturen und Materialien, die lange schön bleiben.",
      image: `${IMG}/2026/08/hochwertiges-bad-e1787817444372-1024x683.webp`,
      points: [
        "Individuelle Planung mit Markenherstellern",
        "Moderne, luxuriöse Ausstattung",
        "Komplette Sanierung inklusive aller Gewerke",
      ],
      body:
        "Walk-in-Dusche, bodentiefe Fliesen, wandhängende Keramik: Wir planen Ihr Bad gemeinsam mit Ihnen und koordinieren alle Gewerke bis zur Übergabe.",
      typicalDuration: "ca. 3–5 Wochen",
    },
    {
      slug: "seniorengerechtes-bad",
      name: "Seniorengerechtes Bad",
      short: "Bodengleiche Dusche, Haltegriffe, mehr Bewegungsfreiheit – barrierearm umgebaut.",
      image: `${IMG}/2026/08/seniorengerechtes-bad-e1787817358326.webp`,
      points: [
        "Strukturierte Planung der Anpassungen",
        "Mehr Sicherheit und Mobilität im Alltag",
        "Direkte Abrechnung ohne Zusatzkosten",
      ],
      body:
        "Wir prüfen, was Ihr Bad im Alltag sicherer macht – vom bodengleichen Einstieg bis zum unterfahrbaren Waschtisch – und unterstützen bei der Abrechnung mit der Pflegekasse.",
      typicalDuration: "ca. 1–2 Wochen",
    },
    {
      slug: "badezimmer-renovieren",
      name: "Badezimmer renovieren",
      short: "Teilsanierung nach technischer Beurteilung – nur erneuern, was wirklich nötig ist.",
      image: `${IMG}/2026/08/vorteile-sanierung-1-1024x683.webp`,
      points: [
        "Inspektion der vorhandenen Einrichtung",
        "Gezielter Austausch einzelner Elemente",
        "Staubarme Ausführung in bewohnten Wohnungen",
      ],
      body:
        "Nicht jedes Bad muss komplett raus. Nach einer Besichtigung sagen wir Ihnen ehrlich, was noch gut ist und was ersetzt werden sollte.",
      typicalDuration: "wenige Tage bis 2 Wochen",
    },
  ],

  advantages: [
    {
      title: "Staubarm, auch wenn Sie dort wohnen",
      text: "Wir schützen Ihre Wohnung während der Sanierung und hinterlassen sie sauber – grobe und feine Verschmutzungen inklusive.",
    },
    {
      title: "Festpreis und Festzeit",
      text: "Sie kennen Preis und Zeitplan, bevor wir anfangen. Termine, die wir zusagen, halten wir.",
    },
    {
      title: "Ehrliche Teilsanierung",
      text: "Auf Wunsch prüfen wir vorab, welche Teile Ihres Bades noch gut sind – und erneuern nur den Rest.",
    },
  ],

  process: [
    {
      title: "Inspiration",
      text: "Wir sehen uns Ihr Bad an, hören zu und zeigen passende Ideen. Sie wählen Ihren Stil.",
      image: `${IMG}/2026/08/inspiration.webp`,
    },
    {
      title: "Planung",
      text: "Wir planen Maße, Materialien und Ablauf und stimmen jede Änderung mit Ihnen ab.",
      image: `${IMG}/2026/08/planung-1-1024x683.webp`,
    },
    {
      title: "Beratung und Start",
      text: "Im finalen Gespräch prüfen Sie alles noch einmal. Danach erhalten Sie Festpreis und Starttermin.",
      image: `${IMG}/2026/08/beratung-1.webp`,
    },
  ],

  /**
   * Reference projects ("see their work"). Placeholder entries for the demo —
   * replace with the company's real projects and photos.
   */
  projects: [
    {
      title: "Walk-in-Dusche im Altbau",
      district: "Prenzlauer Berg",
      service: "hochwertiges-bad",
      duration: "4 Wochen",
      year: 2026,
      image: `${IMG}/2026/08/hochwertiges-bad-e1787817444372-1024x683.webp`,
      text: "Wanne raus, bodengleiche Dusche mit Glaswand rein. Neue Leitungen, großformatige Fliesen.",
    },
    {
      title: "Barrierearmes Bad für zwei",
      district: "Hohenschönhausen",
      service: "seniorengerechtes-bad",
      duration: "8 Arbeitstage",
      year: 2026,
      image: `${IMG}/2026/08/seniorengerechtes-bad-e1787817358326.webp`,
      text: "Bodengleicher Einstieg, Haltegriffe, unterfahrbarer Waschtisch – abgerechnet mit der Pflegekasse.",
    },
    {
      title: "Mietbad, schnell erneuert",
      district: "Lichtenberg",
      service: "standard-bad",
      duration: "12 Arbeitstage",
      year: 2025,
      image: `${IMG}/2026/08/standard-bad-1024x683.webp`,
      text: "Komplettsanierung zwischen zwei Mietverhältnissen mit pflegeleichter Ausstattung.",
    },
    {
      title: "Teilsanierung im bewohnten Haus",
      district: "Weißensee",
      service: "badezimmer-renovieren",
      duration: "5 Arbeitstage",
      year: 2025,
      image: `${IMG}/2026/08/vorteile-sanierung-1-1024x683.webp`,
      text: "Neue Armaturen, WC und Waschtisch – Fliesen blieben. Staubschutz während der ganzen Bauzeit.",
    },
    {
      title: "Planung mit Musterflächen",
      district: "Pankow",
      service: "hochwertiges-bad",
      duration: "5 Wochen",
      year: 2025,
      image: `${IMG}/2026/08/planung-1-1024x683.webp`,
      text: "Drei Varianten vor Ort verglichen, dann Umsetzung mit Markenarmaturen und Einbauschrank.",
    },
    {
      title: "Kleines Bad, neu gedacht",
      district: "Marzahn",
      service: "standard-bad",
      duration: "2 Wochen",
      year: 2024,
      image: `${IMG}/2026/08/inspiration.webp`,
      text: "Auf 4 m² mehr Stauraum durch Vorwandinstallation und wandhängende Keramik.",
    },
  ],

  partners: [
    "Viega", "Hansa", "Hansgrohe", "Keramag", "Dornbracht", "HSK", "Keuco",
    "Villeroy & Boch", "Hüppe", "Duravit", "Dallmer", "Geberit", "Grohe",
  ],

  faq: [
    {
      q: "Was kostet eine Badsanierung?",
      a: "Das hängt vom Umfang ab: Kleine Anpassungen sind günstig, Grundrissänderungen deutlich aufwendiger. Nach einer kostenlosen Besichtigung erhalten Sie ein Angebot mit Festpreis.",
    },
    {
      q: "Wie läuft eine Badsanierung ab?",
      a: "Erst ein Vorgespräch (gern per Video), dann ein Termin vor Ort. Sobald Sie die Planung freigeben, starten Installation und Montage – alle Gewerke koordinieren wir.",
    },
    {
      q: "Wie lange dauert der Umbau?",
      a: "Kleinere Arbeiten dauern wenige Tage, Komplettsanierungen mehrere Wochen. Eine verlässliche Einschätzung bekommen Sie nach der Besichtigung.",
    },
    {
      q: "Was muss ich vorbereiten?",
      a: "Kaum etwas: Räumen Sie Schränke und Ablagen leer. Putzen müssen Sie nicht – die Endreinigung übernehmen wir.",
    },
    {
      q: "Kann ich online einen Termin buchen?",
      a: "Ja. Wählen Sie eine kostenlose Besichtigung bei Ihnen zu Hause oder eine 30-minütige Video-Beratung. Den Link zum Gespräch bekommen Sie und wir automatisch per E-Mail.",
    },
  ],

  /**
   * Bookable appointment types.
   * mode "onsite": own slot calendar, needs an address, confirmed by the company.
   * mode "call":   video call. Uses Calendly if NEXT_PUBLIC_CALENDLY_URL is set,
   *                otherwise own slots + an auto-generated Jitsi link that is
   *                emailed to both parties.
   */
  bookingTypes: [
    {
      key: "besichtigung",
      name: "Besichtigung vor Ort",
      description: "Wir kommen zu Ihnen, messen auf und beraten direkt im Bad.",
      durationMinutes: 60,
      mode: "onsite",
      autoConfirm: false,
      price: "kostenlos",
    },
    {
      key: "beratung",
      name: "Video-Beratung",
      description: "30 Minuten per Video – den Link bekommen Sie per E-Mail.",
      durationMinutes: 30,
      mode: "call",
      autoConfirm: true,
      price: "kostenlos",
    },
  ],

  availability: {
    /** 0 = Sunday … 6 = Saturday. Times are local (timezone above). */
    weeklyHours: {
      1: ["08:00", "18:00"],
      2: ["08:00", "18:00"],
      3: ["08:00", "18:00"],
      4: ["08:00", "18:00"],
    },
    slotStepMinutes: 30,
    bufferMinutes: 30,
    leadTimeHours: 24,
    horizonDays: 42,
  },

  calendly: {
    /** e.g. https://calendly.com/your-company/video-beratung */
    url: process.env.NEXT_PUBLIC_CALENDLY_URL || "",
  },

  meeting: {
    /** Fallback meeting links when Calendly is not used. */
    baseUrl: "https://meet.jit.si",
  },
};

export function getService(slug) {
  return siteConfig.services.find((s) => s.slug === slug) || null;
}

export function getBookingType(key) {
  return siteConfig.bookingTypes.find((t) => t.key === key) || null;
}

export function usesCalendly(type) {
  return Boolean(type && type.mode === "call" && siteConfig.calendly.url);
}
