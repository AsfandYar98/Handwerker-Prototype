// EN and PL copy generated; have a native speaker review before going live.
/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SITE CONFIG — everything company-specific lives in this one file.
 *
 *  To spin up the prototype for another Handwerksbetrieb, copy this file,
 *  replace company / services / projects / theme / availability, and deploy.
 *  Nothing else in the codebase needs to change.
 *
 *  Texts shown on the public site are either a plain string (same in every
 *  language) or { de, en, pl } (German is used where a language is missing).
 *  Slugs, phone numbers, addresses and image URLs are never translated.
 *
 *  This first config is based on badsanierung-berlin.de (Stefan Sniegowski GmbH).
 * ─────────────────────────────────────────────────────────────────────────────
 */

const IMG = "https://badsanierung-berlin.de/wp-content/uploads";

export const siteConfig = {
  /** Used as storage key prefix, so several companies can share one Redis DB. */
  slug: "badsanierung-berlin",
  /** Locale of the company side (admin dashboard, company emails). Customers get their language's locale. */
  locale: "de-DE",
  timezone: "Europe/Berlin",

  /**
   * Demo mode: shows a small "Prototyp-Version" line in the footer, sets
   * noindex, and never sends notifications to the real company address (only
   * to NOTIFY_EMAIL). Set NEXT_PUBLIC_DEMO_MODE=false once the company has signed off.
   */
  demo: {
    enabled: process.env.NEXT_PUBLIC_DEMO_MODE !== "false",
  },

  company: {
    brand: "Badsanierung Berlin",
    legalName: "Stefan Sniegowski GmbH",
    trade: { de: "Meisterbetrieb Sanitär", en: "Master plumbers", pl: "Mistrz instalacji sanitarnych" },
    since: 1997,
    logoUrl: `${IMG}/2020/02/cropped-logozusatz.webp`,
    phone: "030 / 97608603",
    phoneHref: "+493097608603",
    fax: "030 / 97608604",
    email: "mail@heizungsprofi.info",
    address: { street: "Verdener Gasse 14", zip: "13055", city: "Berlin" },
    serviceArea: { de: "Berlin und Umgebung", en: "Berlin and the surrounding area", pl: "Berlin i okolice" },
    openingHours: { de: "Mo–Do, 08:00–18:00 Uhr", en: "Mon–Thu, 08:00–18:00", pl: "pon.–czw., godz. 8:00–18:00" },
    legalLinks: [
      {
        label: { de: "Impressum", en: "Legal notice", pl: "Nota prawna" },
        href: "https://badsanierung-berlin.de/index.php/impressum/",
      },
      {
        label: { de: "Datenschutz", en: "Privacy policy", pl: "Polityka prywatności" },
        href: "https://badsanierung-berlin.de/index.php/datenschutzerklaerung/",
      },
    ],
    privacyUrl: "https://badsanierung-berlin.de/index.php/datenschutzerklaerung/",
  },

  seo: {
    title: {
      de: "Badsanierung Berlin – Meisterbetrieb für Ihr neues Bad",
      en: "Bathroom renovation in Berlin – master craftsmen for your new bathroom",
      pl: "Remont łazienki w Berlinie – nowa łazienka od mistrza rzemiosła",
    },
    description: {
      de: "Badsanierung in Berlin aus einer Hand: Planung, Umbau und Endreinigung vom Meisterbetrieb. Besichtigung oder Video-Beratung direkt online buchen.",
      en: "Bathroom renovation in Berlin from a single team: planning, refurbishment and final cleaning by master craftsmen. Book an on-site visit or a video consultation online.",
      pl: "Kompleksowy remont łazienki w Berlinie: projekt, przebudowa i sprzątanie końcowe – wszystko od jednej firmy z tytułem mistrza rzemiosła. Wizytę na miejscu lub konsultację wideo mogą Państwo zarezerwować online.",
    },
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
    title: { de: "Badsanierung Berlin", en: "Bathroom renovation in Berlin", pl: "Remonty łazienek w Berlinie" },
    lead: {
      de: "Ihr neues Bad vom Berliner Meisterbetrieb – geplant, gebaut und sauber übergeben. Alles aus einer Hand, mit Festpreis vor Baubeginn.",
      en: "Your new bathroom from Berlin master craftsmen – planned, built and handed over spotless. Everything from a single team, with a fixed price before work begins.",
      pl: "Państwa nowa łazienka od berlińskiego mistrza rzemiosła – zaprojektowana, wykonana i oddana w czystości. Wszystko od jednej firmy, ze stałą ceną ustaloną przed rozpoczęciem prac.",
    },
    image: `${IMG}/2026/08/hochwertiges-bad-e1787817444372-1024x683.webp`,
    imageAlt: {
      de: "Modernes Bad mit großzügiger Walk-in-Dusche",
      en: "Modern bathroom with a spacious walk-in shower",
      pl: "Nowoczesna łazienka z przestronnym prysznicem typu walk-in",
    },
  },

  trustPoints: [
    {
      title: { de: "Meisterbetrieb seit 1997", en: "Master craftsmen since 1997", pl: "Mistrz rzemiosła od 1997 roku" },
      text: {
        de: "Geprüfte Handwerksqualität aus Berlin.",
        en: "Certified craftsmanship from Berlin.",
        pl: "Sprawdzona jakość rzemieślnicza z Berlina.",
      },
    },
    {
      title: { de: "5 Jahre Garantie", en: "5-year guarantee", pl: "5 lat gwarancji" },
      text: {
        de: "Auf unsere Handwerksleistung – schriftlich.",
        en: "On our workmanship – in writing.",
        pl: "Na naszą pracę – na piśmie.",
      },
    },
    {
      title: { de: "Alles aus einer Hand", en: "All from a single team", pl: "Wszystko od jednej firmy" },
      text: {
        de: "Von der Planung bis zur Endreinigung.",
        en: "From planning to final cleaning.",
        pl: "Od projektu po sprzątanie końcowe.",
      },
    },
  ],

  services: [
    {
      slug: "standard-bad",
      name: { de: "Standard Bad", en: "Standard bathroom", pl: "Łazienka standardowa" },
      short: {
        de: "Solide, pflegeleichte Ausstattung – sauber geplant und zügig umgesetzt.",
        en: "Solid, easy-care fittings – carefully planned and completed quickly.",
        pl: "Solidne, łatwe w utrzymaniu wyposażenie – starannie zaplanowane i sprawnie wykonane.",
      },
      image: `${IMG}/2026/08/standard-bad-1024x683.webp`,
      points: [
        { de: "Einfache Konstruktionen nach Maß", en: "Simple made-to-measure construction", pl: "Proste konstrukcje na wymiar" },
        {
          de: "Praktische Einrichtung, abgestimmt vor Ort",
          en: "Practical fittings, agreed on site",
          pl: "Praktyczne wyposażenie uzgodnione na miejscu",
        },
        {
          de: "Planung und Ausführung komplett aus einer Hand",
          en: "Planning and execution entirely from one team",
          pl: "Projekt i wykonanie w całości od jednej firmy",
        },
      ],
      body: {
        de: "Für Mietwohnungen, Zweitbäder oder alle, die ein funktionales Bad ohne Schnickschnack möchten. Wir nehmen Maß, schlagen robuste Materialien vor und setzen alles termingerecht um.",
        en: "For rented flats, second bathrooms or anyone who wants a functional bathroom without frills. We take measurements, suggest durable materials and complete everything on schedule.",
        pl: "Dla mieszkań na wynajem, drugich łazienek i wszystkich, którzy chcą funkcjonalnej łazienki bez zbędnych dodatków. Wykonujemy pomiary, proponujemy trwałe materiały i realizujemy wszystko zgodnie z harmonogramem.",
      },
      typicalDuration: { de: "ca. 2–3 Wochen", en: "approx. 2–3 weeks", pl: "ok. 2–3 tygodnie" },
    },
    {
      slug: "hochwertiges-bad",
      name: { de: "Hochwertiges Bad", en: "Premium bathroom", pl: "Łazienka premium" },
      short: {
        de: "Großzügige Duschen, Designarmaturen und Materialien, die lange schön bleiben.",
        en: "Spacious showers, designer fittings and materials that stay beautiful for years.",
        pl: "Przestronne prysznice, designerska armatura i materiały, które długo zachowują piękny wygląd.",
      },
      image: `${IMG}/2026/08/hochwertiges-bad-e1787817444372-1024x683.webp`,
      points: [
        {
          de: "Individuelle Planung mit Markenherstellern",
          en: "Individual planning with brand-name manufacturers",
          pl: "Indywidualny projekt z produktami renomowanych producentów",
        },
        { de: "Moderne, luxuriöse Ausstattung", en: "Modern, luxurious fittings", pl: "Nowoczesne, luksusowe wyposażenie" },
        {
          de: "Komplette Sanierung inklusive aller Gewerke",
          en: "Complete renovation including all trades",
          pl: "Kompleksowy remont obejmujący wszystkie prace",
        },
      ],
      body: {
        de: "Walk-in-Dusche, bodentiefe Fliesen, wandhängende Keramik: Wir planen Ihr Bad gemeinsam mit Ihnen und koordinieren alle Gewerke bis zur Übergabe.",
        en: "Walk-in shower, full-height tiling, wall-hung ceramics: we plan your bathroom together with you and coordinate all trades through to handover.",
        pl: "Prysznic walk-in, płytki na całą wysokość, ceramika podwieszana: projektujemy łazienkę wspólnie z Państwem i koordynujemy wszystkie prace aż do odbioru.",
      },
      typicalDuration: { de: "ca. 3–5 Wochen", en: "approx. 3–5 weeks", pl: "ok. 3–5 tygodni" },
    },
    {
      slug: "seniorengerechtes-bad",
      name: { de: "Seniorengerechtes Bad", en: "Senior-friendly bathroom", pl: "Łazienka dla seniorów" },
      short: {
        de: "Bodengleiche Dusche, Haltegriffe, mehr Bewegungsfreiheit – barrierearm umgebaut.",
        en: "Level-access shower, grab rails, more room to move – converted for easy access.",
        pl: "Prysznic bez progu, uchwyty, więcej swobody ruchu – przebudowa ograniczająca bariery.",
      },
      image: `${IMG}/2026/08/seniorengerechtes-bad-e1787817358326.webp`,
      points: [
        {
          de: "Strukturierte Planung der Anpassungen",
          en: "Structured planning of the adaptations",
          pl: "Przemyślane zaplanowanie adaptacji",
        },
        {
          de: "Mehr Sicherheit und Mobilität im Alltag",
          en: "More safety and mobility in everyday life",
          pl: "Więcej bezpieczeństwa i swobody na co dzień",
        },
        {
          de: "Direkte Abrechnung ohne Zusatzkosten",
          en: "Direct billing at no extra cost",
          pl: "Bezpośrednie rozliczenie bez dodatkowych kosztów",
        },
      ],
      body: {
        de: "Wir prüfen, was Ihr Bad im Alltag sicherer macht – vom bodengleichen Einstieg bis zum unterfahrbaren Waschtisch – und unterstützen bei der Abrechnung mit der Pflegekasse.",
        en: "We check what will make your bathroom safer in daily use – from a level-access entry to a wheelchair-accessible washbasin – and help with billing the long-term care insurance (Pflegekasse).",
        pl: "Sprawdzamy, co uczyni Państwa łazienkę bezpieczniejszą na co dzień – od wejścia bez progu po umywalkę dostępną dla wózka – i pomagamy w rozliczeniu z kasą ubezpieczenia pielęgnacyjnego (Pflegekasse).",
      },
      typicalDuration: { de: "ca. 1–2 Wochen", en: "approx. 1–2 weeks", pl: "ok. 1–2 tygodnie" },
    },
    {
      slug: "badezimmer-renovieren",
      name: { de: "Badezimmer renovieren", en: "Bathroom refurbishment", pl: "Renowacja łazienki" },
      short: {
        de: "Teilsanierung nach technischer Beurteilung – nur erneuern, was wirklich nötig ist.",
        en: "Partial renovation after a technical assessment – only replacing what really needs it.",
        pl: "Częściowy remont po ocenie technicznej – wymieniamy tylko to, co naprawdę trzeba.",
      },
      image: `${IMG}/2026/08/vorteile-sanierung-1-1024x683.webp`,
      points: [
        {
          de: "Inspektion der vorhandenen Einrichtung",
          en: "Inspection of the existing fittings",
          pl: "Przegląd istniejącego wyposażenia",
        },
        {
          de: "Gezielter Austausch einzelner Elemente",
          en: "Targeted replacement of individual parts",
          pl: "Wymiana wybranych elementów",
        },
        {
          de: "Staubarme Ausführung in bewohnten Wohnungen",
          en: "Low-dust work in occupied homes",
          pl: "Prace z ograniczeniem pyłu w zamieszkanych lokalach",
        },
      ],
      body: {
        de: "Nicht jedes Bad muss komplett raus. Nach einer Besichtigung sagen wir Ihnen ehrlich, was noch gut ist und was ersetzt werden sollte.",
        en: "Not every bathroom needs ripping out completely. After a visit, we will tell you honestly what is still in good shape and what should be replaced.",
        pl: "Nie każdą łazienkę trzeba remontować od zera. Po oględzinach szczerze powiemy Państwu, co jest jeszcze w dobrym stanie, a co warto wymienić.",
      },
      typicalDuration: { de: "wenige Tage bis 2 Wochen", en: "a few days to 2 weeks", pl: "od kilku dni do 2 tygodni" },
    },
  ],

  advantages: [
    {
      title: {
        de: "Staubarm, auch wenn Sie dort wohnen",
        en: "Low dust, even while you live there",
        pl: "Mało pyłu, nawet gdy Państwo tam mieszkają",
      },
      text: {
        de: "Wir schützen Ihre Wohnung während der Sanierung und hinterlassen sie sauber – grobe und feine Verschmutzungen inklusive.",
        en: "We protect your home during the renovation and leave it clean – coarse and fine dirt included.",
        pl: "Chronimy Państwa mieszkanie podczas remontu i zostawiamy je czyste – usuwamy zarówno grube, jak i drobne zabrudzenia.",
      },
    },
    {
      title: { de: "Festpreis und Festzeit", en: "Fixed price, fixed schedule", pl: "Stała cena i stały harmonogram" },
      text: {
        de: "Sie kennen Preis und Zeitplan, bevor wir anfangen. Termine, die wir zusagen, halten wir.",
        en: "You know the price and the timetable before we start. Dates we commit to, we keep.",
        pl: "Znają Państwo cenę i harmonogram, zanim zaczniemy. Dotrzymujemy uzgodnionych terminów.",
      },
    },
    {
      title: { de: "Ehrliche Teilsanierung", en: "Honest partial renovation", pl: "Uczciwy remont częściowy" },
      text: {
        de: "Auf Wunsch prüfen wir vorab, welche Teile Ihres Bades noch gut sind – und erneuern nur den Rest.",
        en: "On request, we check beforehand which parts of your bathroom are still good – and only renew the rest.",
        pl: "Na życzenie sprawdzamy wcześniej, które elementy Państwa łazienki są jeszcze w dobrym stanie – i wymieniamy tylko resztę.",
      },
    },
  ],

  process: [
    {
      title: { de: "Inspiration", en: "Inspiration", pl: "Inspiracja" },
      text: {
        de: "Wir sehen uns Ihr Bad an, hören zu und zeigen passende Ideen. Sie wählen Ihren Stil.",
        en: "We look at your bathroom, listen and show you suitable ideas. You choose your style.",
        pl: "Oglądamy Państwa łazienkę, słuchamy i pokazujemy pasujące pomysły. Państwo wybierają styl.",
      },
      image: `${IMG}/2026/08/inspiration.webp`,
    },
    {
      title: { de: "Planung", en: "Planning", pl: "Projekt" },
      text: {
        de: "Wir planen Maße, Materialien und Ablauf und stimmen jede Änderung mit Ihnen ab.",
        en: "We plan dimensions, materials and the sequence of work, and agree every change with you.",
        pl: "Planujemy wymiary, materiały i przebieg prac, a każdą zmianę uzgadniamy z Państwem.",
      },
      image: `${IMG}/2026/08/planung-1-1024x683.webp`,
    },
    {
      title: { de: "Beratung und Start", en: "Consultation and start", pl: "Konsultacja i start" },
      text: {
        de: "Im finalen Gespräch prüfen Sie alles noch einmal. Danach erhalten Sie Festpreis und Starttermin.",
        en: "In a final meeting you check everything once more. Then you receive a fixed price and a start date.",
        pl: "Podczas końcowej rozmowy sprawdzają Państwo wszystko jeszcze raz. Następnie otrzymują Państwo stałą cenę i datę rozpoczęcia prac.",
      },
      image: `${IMG}/2026/08/beratung-1.webp`,
    },
  ],

  /**
   * Reference projects ("see their work"). Placeholder entries for the demo —
   * replace with the company's real projects and photos.
   */
  projects: [
    {
      title: { de: "Walk-in-Dusche im Altbau", en: "Walk-in shower in a period building", pl: "Prysznic walk-in w starej kamienicy" },
      district: "Prenzlauer Berg",
      service: "hochwertiges-bad",
      duration: { de: "4 Wochen", en: "4 weeks", pl: "4 tygodnie" },
      year: 2026,
      image: `${IMG}/2026/08/hochwertiges-bad-e1787817444372-1024x683.webp`,
      text: {
        de: "Wanne raus, bodengleiche Dusche mit Glaswand rein. Neue Leitungen, großformatige Fliesen.",
        en: "Bathtub out, level-access shower with a glass panel in. New pipework, large-format tiles.",
        pl: "Zamiast wanny prysznic bez progu ze szklaną ścianką. Nowe instalacje, płytki wielkoformatowe.",
      },
    },
    {
      title: { de: "Barrierearmes Bad für zwei", en: "Easy-access bathroom for two", pl: "Łazienka bez barier dla dwojga" },
      district: "Hohenschönhausen",
      service: "seniorengerechtes-bad",
      duration: { de: "8 Arbeitstage", en: "8 working days", pl: "8 dni roboczych" },
      year: 2026,
      image: `${IMG}/2026/08/seniorengerechtes-bad-e1787817358326.webp`,
      text: {
        de: "Bodengleicher Einstieg, Haltegriffe, unterfahrbarer Waschtisch – abgerechnet mit der Pflegekasse.",
        en: "Level-access entry, grab rails, wheelchair-accessible washbasin – billed via the Pflegekasse.",
        pl: "Wejście bez progu, uchwyty, umywalka dostępna dla wózka – rozliczone z Pflegekasse.",
      },
    },
    {
      title: { de: "Mietbad, schnell erneuert", en: "Rental bathroom, quickly renewed", pl: "Łazienka na wynajem – szybka odnowa" },
      district: "Lichtenberg",
      service: "standard-bad",
      duration: { de: "12 Arbeitstage", en: "12 working days", pl: "12 dni roboczych" },
      year: 2025,
      image: `${IMG}/2026/08/standard-bad-1024x683.webp`,
      text: {
        de: "Komplettsanierung zwischen zwei Mietverhältnissen mit pflegeleichter Ausstattung.",
        en: "Complete renovation between two tenancies, with easy-care fittings.",
        pl: "Kompleksowy remont między dwoma najmami, z wyposażeniem łatwym w utrzymaniu.",
      },
    },
    {
      title: {
        de: "Teilsanierung im bewohnten Haus",
        en: "Partial renovation in an occupied house",
        pl: "Częściowy remont w zamieszkanym domu",
      },
      district: "Weißensee",
      service: "badezimmer-renovieren",
      duration: { de: "5 Arbeitstage", en: "5 working days", pl: "5 dni roboczych" },
      year: 2025,
      image: `${IMG}/2026/08/vorteile-sanierung-1-1024x683.webp`,
      text: {
        de: "Neue Armaturen, WC und Waschtisch – Fliesen blieben. Staubschutz während der ganzen Bauzeit.",
        en: "New taps, WC and washbasin – the tiles stayed. Dust protection throughout the works.",
        pl: "Nowa armatura, WC i umywalka – płytki pozostały. Ochrona przed pyłem przez cały czas prac.",
      },
    },
    {
      title: { de: "Planung mit Musterflächen", en: "Planning with sample surfaces", pl: "Projekt z próbkami materiałów" },
      district: "Pankow",
      service: "hochwertiges-bad",
      duration: { de: "5 Wochen", en: "5 weeks", pl: "5 tygodni" },
      year: 2025,
      image: `${IMG}/2026/08/planung-1-1024x683.webp`,
      text: {
        de: "Drei Varianten vor Ort verglichen, dann Umsetzung mit Markenarmaturen und Einbauschrank.",
        en: "Three options compared on site, then built with brand-name fittings and a built-in cabinet.",
        pl: "Trzy warianty porównane na miejscu, a potem realizacja z markową armaturą i szafką w zabudowie.",
      },
    },
    {
      title: { de: "Kleines Bad, neu gedacht", en: "Small bathroom, rethought", pl: "Mała łazienka na nowo" },
      district: "Marzahn",
      service: "standard-bad",
      duration: { de: "2 Wochen", en: "2 weeks", pl: "2 tygodnie" },
      year: 2024,
      image: `${IMG}/2026/08/inspiration.webp`,
      text: {
        de: "Auf 4 m² mehr Stauraum durch Vorwandinstallation und wandhängende Keramik.",
        en: "More storage on 4 m² thanks to a pre-wall installation and wall-hung ceramics.",
        pl: "Więcej miejsca do przechowywania na 4 m² dzięki stelażom podtynkowym i ceramice podwieszanej.",
      },
    },
  ],

  partners: [
    "Viega", "Hansa", "Hansgrohe", "Keramag", "Dornbracht", "HSK", "Keuco",
    "Villeroy & Boch", "Hüppe", "Duravit", "Dallmer", "Geberit", "Grohe",
  ],

  faq: [
    {
      q: { de: "Was kostet eine Badsanierung?", en: "How much does a bathroom renovation cost?", pl: "Ile kosztuje remont łazienki?" },
      a: {
        de: "Das hängt vom Umfang ab: Kleine Anpassungen sind günstig, Grundrissänderungen deutlich aufwendiger. Nach einer kostenlosen Besichtigung erhalten Sie ein Angebot mit Festpreis.",
        en: "It depends on the scope: small adjustments are inexpensive, layout changes considerably more involved. After a free on-site visit you receive a fixed-price quote.",
        pl: "To zależy od zakresu: drobne zmiany są niedrogie, zmiany układu łazienki – znacznie bardziej pracochłonne. Po bezpłatnych oględzinach otrzymają Państwo ofertę ze stałą ceną.",
      },
    },
    {
      q: { de: "Wie läuft eine Badsanierung ab?", en: "How does a bathroom renovation work?", pl: "Jak przebiega remont łazienki?" },
      a: {
        de: "Erst ein Vorgespräch (gern per Video), dann ein Termin vor Ort. Sobald Sie die Planung freigeben, starten Installation und Montage – alle Gewerke koordinieren wir.",
        en: "First an initial conversation (by video if you like), then an appointment on site. As soon as you approve the plan, installation and fitting begin – we coordinate all trades.",
        pl: "Najpierw rozmowa wstępna (chętnie przez wideo), potem spotkanie na miejscu. Gdy tylko zatwierdzą Państwo projekt, rozpoczynamy instalację i montaż – wszystkie prace koordynujemy my.",
      },
    },
    {
      q: { de: "Wie lange dauert der Umbau?", en: "How long does the work take?", pl: "Jak długo trwa przebudowa?" },
      a: {
        de: "Kleinere Arbeiten dauern wenige Tage, Komplettsanierungen mehrere Wochen. Eine verlässliche Einschätzung bekommen Sie nach der Besichtigung.",
        en: "Smaller jobs take a few days, complete renovations several weeks. You get a reliable estimate after the on-site visit.",
        pl: "Mniejsze prace trwają kilka dni, kompleksowe remonty – kilka tygodni. Rzetelną ocenę otrzymają Państwo po oględzinach.",
      },
    },
    {
      q: { de: "Was muss ich vorbereiten?", en: "What do I need to prepare?", pl: "Co należy przygotować?" },
      a: {
        de: "Kaum etwas: Räumen Sie Schränke und Ablagen leer. Putzen müssen Sie nicht – die Endreinigung übernehmen wir.",
        en: "Hardly anything: empty your cupboards and shelves. No need to clean – we take care of the final cleaning.",
        pl: "Niewiele: wystarczy opróżnić szafki i półki. Sprzątać nie trzeba – sprzątanie końcowe bierzemy na siebie.",
      },
    },
    {
      q: { de: "Kann ich online einen Termin buchen?", en: "Can I book an appointment online?", pl: "Czy mogę zarezerwować termin online?" },
      a: {
        de: "Ja. Wählen Sie eine kostenlose Besichtigung bei Ihnen zu Hause oder eine 30-minütige Video-Beratung. Den Link zum Gespräch bekommen Sie und wir automatisch per E-Mail.",
        en: "Yes. Choose a free on-site visit at your home or a 30-minute video consultation. You and we both receive the link to the call automatically by email.",
        pl: "Tak. Mogą Państwo wybrać bezpłatną wizytę u siebie w domu lub 30-minutową konsultację wideo. Link do rozmowy otrzymają Państwo i my automatycznie e-mailem.",
      },
    },
  ],

  /**
   * Section headings and intro texts of the public pages. {since} in
   * about.intro is replaced with company.since.
   */
  copy: {
    quickstart: { title: { de: "Was planen Sie?", en: "What are you planning?", pl: "Co Państwo planują?" } },
    services: {
      title: {
        de: "Sanierung nach Maß – aus einer Hand",
        en: "Tailored renovation – all from one team",
        pl: "Remont na miarę – od jednej firmy",
      },
      intro: {
        de: "Ein erfahrenes Team übernimmt alle Arbeiten rund ums Bad. Wählen Sie, was zu Ihnen passt – oder lassen Sie sich beraten.",
        en: "An experienced team handles all the work on your bathroom. Choose what suits you – or let us advise you.",
        pl: "Doświadczony zespół wykona wszystkie prace w łazience. Prosimy wybrać, co Państwu odpowiada – lub skorzystać z naszej porady.",
      },
    },
    about: {
      title: {
        de: "Ihr Berliner Handwerks- und Sanitärbetrieb",
        en: "Your Berlin craft and plumbing business",
        pl: "Państwa berliński zakład rzemieślniczy i instalacyjny",
      },
      intro: {
        de: "Seit {since} sanieren wir Bäder in Berlin und Umgebung. Seriös, transparent und fachgerecht – vom ersten Gespräch bis zur Endreinigung.",
        en: "We have been renovating bathrooms in Berlin and the surrounding area since {since}. Reliable, transparent and professional – from the first conversation to the final cleaning.",
        pl: "Od {since} roku remontujemy łazienki w Berlinie i okolicach. Rzetelnie, przejrzyście i fachowo – od pierwszej rozmowy po sprzątanie końcowe.",
      },
    },
    process: {
      title: {
        de: "In drei Schritten zum fertigen Bad",
        en: "Three steps to your finished bathroom",
        pl: "W trzech krokach do gotowej łazienki",
      },
      intro: {
        de: "Jedes Projekt läuft nach demselben festen Ablauf. Sie wissen immer, was als Nächstes passiert.",
        en: "Every project follows the same fixed process. You always know what happens next.",
        pl: "Każdy projekt przebiega według tego samego, stałego schematu. Zawsze wiedzą Państwo, co wydarzy się dalej.",
      },
    },
    references: {
      title: { de: "Bäder, die wir gebaut haben", en: "Bathrooms we have built", pl: "Łazienki, które wykonaliśmy" },
      intro: {
        de: "Ein Auszug aus unseren Projekten in Berlin.",
        en: "A selection of our projects in Berlin.",
        pl: "Wybrane realizacje w Berlinie.",
      },
    },
    partners: {
      title: {
        de: "Markenqualität von unseren Partnern",
        en: "Brand quality from our partners",
        pl: "Markowa jakość od naszych partnerów",
      },
      intro: {
        de: "Mit diesen Herstellern arbeiten wir zusammen. Welche zu Ihrem Bad passen, zeigen wir Ihnen in der Beratung.",
        en: "These are the manufacturers we work with. We will show you which suit your bathroom during the consultation.",
        pl: "Współpracujemy z tymi producentami. Które z nich pasują do Państwa łazienki, pokażemy podczas konsultacji.",
      },
    },
    faq: { title: { de: "Häufige Fragen", en: "Frequently asked questions", pl: "Najczęstsze pytania" } },
    contact: {
      title: { de: "Lassen Sie uns Ihr Bad planen", en: "Let's plan your bathroom", pl: "Zaplanujmy Państwa łazienkę" },
      intro: {
        de: "Buchen Sie eine kostenlose Besichtigung bei Ihnen zu Hause oder eine 30-minütige Video-Beratung. Sie bekommen sofort eine Bestätigung per E-Mail.",
        en: "Book a free on-site visit at your home or a 30-minute video consultation. You will receive a confirmation by email straight away.",
        pl: "Mogą Państwo zarezerwować bezpłatną wizytę u siebie w domu lub 30-minutową konsultację wideo. Potwierdzenie otrzymają Państwo od razu e-mailem.",
      },
    },
    bookingPage: {
      title: { de: "Termin buchen", en: "Book an appointment", pl: "Rezerwacja terminu" },
      intro: {
        de: "Kostenlose Besichtigung bei Ihnen zu Hause oder Video-Beratung – in wenigen Schritten, mit sofortiger Bestätigung.",
        en: "A free on-site visit at your home or a video consultation – in just a few steps, with instant confirmation.",
        pl: "Bezpłatna wizyta u Państwa w domu lub konsultacja wideo – w kilku krokach, z natychmiastowym potwierdzeniem.",
      },
    },
    referencesPage: {
      title: { de: "Referenzen", en: "Our projects", pl: "Nasze realizacje" },
      intro: {
        de: "Bäder, die wir in Berlin saniert haben – vom schnellen Mietbad bis zur barrierearmen Komplettsanierung.",
        en: "Bathrooms we have renovated in Berlin – from quick rental refits to complete easy-access renovations.",
        pl: "Łazienki, które wyremontowaliśmy w Berlinie – od szybkiej odnowy mieszkania na wynajem po kompleksowy remont bez barier.",
      },
    },
    referencesCta: {
      title: {
        de: "So ein Bad hätten Sie auch gern?",
        en: "Would you like a bathroom like this?",
        pl: "Chcieliby Państwo taką łazienkę?",
      },
      intro: {
        de: "Eine Besichtigung ist kostenlos und unverbindlich. Danach erhalten Sie einen Festpreis.",
        en: "An on-site visit is free and without obligation. Afterwards you receive a fixed price.",
        pl: "Wizyta na miejscu jest bezpłatna i niezobowiązująca. Następnie otrzymają Państwo stałą cenę.",
      },
    },
    servicePrice: {
      de: "Festpreis nach kostenloser Besichtigung",
      en: "Fixed price after a free on-site visit",
      pl: "Stała cena po bezpłatnych oględzinach",
    },
  },

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
      name: { de: "Besichtigung vor Ort", en: "On-site visit", pl: "Wizyta na miejscu" },
      description: {
        de: "Wir kommen zu Ihnen, messen auf und beraten direkt im Bad.",
        en: "We come to you, take measurements and advise you right there in your bathroom.",
        pl: "Przyjeżdżamy do Państwa, wykonujemy pomiary i doradzamy na miejscu, w łazience.",
      },
      durationMinutes: 60,
      mode: "onsite",
      autoConfirm: false,
      price: { de: "kostenlos", en: "free", pl: "bezpłatnie" },
    },
    {
      key: "beratung",
      name: { de: "Video-Beratung", en: "Video consultation", pl: "Konsultacja wideo" },
      description: {
        de: "30 Minuten per Video – den Link bekommen Sie per E-Mail.",
        en: "30 minutes by video – you will receive the link by email.",
        pl: "30 minut przez wideo – link otrzymają Państwo e-mailem.",
      },
      durationMinutes: 30,
      mode: "call",
      autoConfirm: true,
      price: { de: "kostenlos", en: "free", pl: "bezpłatnie" },
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
