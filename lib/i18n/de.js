// UI strings of the public site. German is the source of truth: en.js and pl.js
// must have exactly these keys (tests/i18n.test.js checks it).
// {placeholders} are filled with fill() from lib/i18n/format.js.
// Company-specific copy (headings, services, FAQ …) lives in site.config.js.

const de = {
  // Formatting
  "format.dateTime": "{date}, {time} Uhr",
  "format.time": "{time} Uhr",

  // Layout & navigation
  "a11y.skipToContent": "Zum Inhalt springen",
  "brand.homeLabel": "{brand} – Startseite",
  "nav.main": "Hauptnavigation",
  "nav.mobile": "Hauptnavigation mobil",
  "nav.menu": "Menü",
  "nav.home": "Start",
  "nav.services": "Leistungen",
  "nav.references": "Referenzen",
  "nav.process": "Ablauf",
  "nav.contact": "Kontakt",
  "lang.label": "Sprache",

  // Calls to action
  "cta.book": "Termin buchen",
  "cta.bookFree": "Kostenlosen Termin buchen",
  "cta.bookVisit": "Besichtigung buchen",
  "cta.bookVideo": "Video-Beratung buchen",
  "cta.videoFirst": "Erst per Video beraten lassen",
  "cta.bookNew": "Neuen Termin buchen",
  "cta.home": "Zur Startseite",

  // Page titles
  "meta.booking": "Termin buchen",
  "meta.references": "Referenzen",
  "meta.manage": "Ihre Buchung",
  "meta.notFound": "Seite nicht gefunden",

  // Home page
  "home.serviceMore": "Details und Termin",
  "home.allReferences": "Alle Referenzen ansehen",
  "contact.address": "Adresse",
  "contact.phone": "Telefon",
  "contact.email": "E-Mail",
  "contact.hours": "Erreichbar",

  // Service detail page
  "service.duration": "Typische Dauer",
  "service.price": "Preis",
  "service.projects": "Projekte: {service}",

  // References page
  "refs.filter": "Nach Leistung filtern",
  "refs.all": "Alle",
  "refs.demoNotice": "Beispielinhalte für den Prototyp – hier erscheinen später die echten Projekte des Betriebs.",
  "refs.empty": "Zu dieser Leistung gibt es noch keine Referenzen.",

  // Footer
  "footer.phone": "Tel.",
  "footer.availability": "Erreichbarkeit",
  "footer.serviceArea": "Einsatzgebiet: {area}",
  "footer.legal": "Rechtliches",
  "footer.staffLogin": "Login für Mitarbeiter",
  "footer.demo": "Prototyp-Version",

  // 404
  "notFound.title": "Seite nicht gefunden",
  "notFound.text": "Diese Adresse gibt es nicht (mehr).",

  // Booking status
  "status.requested": "Angefragt",
  "status.confirmed": "Bestätigt",
  "status.done": "Erledigt",
  "status.cancelled": "Abgesagt",

  // Booking details (wizard, booking page, emails, calendar file)
  "booking.fallbackType": "Termin",
  "booking.ref": "Buchungsnummer",
  "booking.when": "Termin",
  "booking.date": "Datum",
  "booking.time": "Uhrzeit",
  "booking.kind": "Art",
  "booking.type": "Terminart",
  "booking.service": "Leistung",
  "booking.serviceOpen": "Noch offen",
  "booking.unsure": "Noch unsicher",
  "booking.duration": "Dauer",
  "booking.address": "Adresse",
  "booking.videoLink": "Video-Link",
  "booking.meetingLink": "Meeting-Link",
  "booking.seeCalendly": "Siehe Calendly-Bestätigung",
  "booking.joinCall": "Zum Video-Gespräch",
  "booking.addToCalendar": "Zum Kalender hinzufügen",
  "booking.manage": "Buchung verwalten",

  // Booking wizard
  "wizard.progress": "Fortschritt",
  "wizard.step.service": "Leistung",
  "wizard.step.type": "Terminart",
  "wizard.step.details": "Ihre Angaben",
  "wizard.step.slot": "Termin wählen",
  "wizard.back": "Zurück",
  "wizard.serviceTitle": "Worum geht es?",
  "wizard.serviceSub": "Wählen Sie die Leistung, die Sie interessiert. Unsicher? Kein Problem – wir beraten Sie.",
  "wizard.unsureText": "Wir finden gemeinsam heraus, was Ihr Bad braucht.",
  "wizard.typeTitle": "Wie möchten Sie starten?",
  "wizard.typeSub": "Beide Termine sind kostenlos und unverbindlich.",
  "wizard.slotTitle": "Wann passt es Ihnen?",
  "wizard.slotSub": "{type}, {duration}. Angezeigt werden alle freien Termine der nächsten vier Wochen.",
  "wizard.loadingDays": "Freie Termine werden geladen …",
  "wizard.daysError": "Termine konnten nicht geladen werden.",
  "wizard.timesError": "Uhrzeiten konnten nicht geladen werden.",
  "wizard.day": "Tag",
  "wizard.dayFull": "{date}, keine freien Termine",
  "wizard.dayFree": "{date}, freie Termine: {count}",
  "wizard.freeBadge": "{count} frei",
  "wizard.fullyBooked": "In den nächsten vier Wochen ist leider nichts mehr frei. Rufen Sie uns an:",
  "wizard.timeOn": "Uhrzeit am {date}",
  "wizard.loadingTimes": "Uhrzeiten werden geladen …",
  "wizard.timeTaken": "{time}, belegt",
  "wizard.toDetails": "Weiter zu Ihren Angaben",
  "wizard.detailsTitle": "Ihre Angaben",
  "wizard.detailsOnsite": "Wir kommen zu Ihnen. Die Adresse brauchen wir für die Anfahrt.",
  "wizard.detailsCall": "Den Link zur Video-Beratung schicken wir Ihnen und uns per E-Mail.",
  "wizard.detailsCalendly": "Im nächsten Schritt wählen Sie Ihren Termin. Ihre Angaben sind dort schon eingetragen.",
  "wizard.submitOnsite": "Besichtigung anfragen",
  "wizard.submitCall": "Video-Beratung buchen",
  "wizard.submitting": "Wird gebucht …",
  "wizard.submitFailed": "Die Buchung hat nicht geklappt.",
  "wizard.toCalendly": "Weiter zur Terminauswahl",
  "wizard.calendlyTitle": "Termin wählen",
  "wizard.calendlySub": "Wählen Sie einen freien Termin. Die Bestätigung mit dem Meeting-Link bekommen Sie und wir automatisch per E-Mail.",
  "wizard.summary": "Ihre Auswahl",
  "wizard.byPhone": "Lieber telefonisch?",

  // Booking form fields
  "field.name": "Vor- und Nachname",
  "field.email": "E-Mail",
  "field.emailHint": "Hierhin schicken wir die Bestätigung.",
  "field.phone": "Telefon",
  "field.phoneHint": "Falls wir kurzfristig etwas klären müssen.",
  "field.street": "Straße und Hausnummer",
  "field.zip": "PLZ",
  "field.city": "Ort",
  "field.choose": "Bitte wählen",
  "field.size": "Größe des Bades",
  "field.timeframe": "Wann soll es losgehen?",
  "field.message": "Was sollen wir vorab wissen? (optional)",
  "field.messagePlaceholder": "z. B. Wanne gegen Dusche tauschen, Altbau, 3. OG ohne Aufzug",
  "field.consent": "Ich habe die {link} gelesen und stimme zu, dass meine Angaben zur Bearbeitung meiner Anfrage gespeichert werden.",
  "field.privacy": "Datenschutzerklärung",
  // Select options: the key suffix is what the form sends; the company side
  // always stores the German label (lib/bookings.js).
  "option.size.small": "unter 6 m²",
  "option.size.medium": "6–10 m²",
  "option.size.large": "über 10 m²",
  "option.size.unknown": "Weiß ich nicht",
  "option.timeframe.asap": "So bald wie möglich",
  "option.timeframe.soon": "In 1–3 Monaten",
  "option.timeframe.later": "In 3–6 Monaten",
  "option.timeframe.flexible": "Flexibel",

  // Validation and booking errors (wizard and API)
  "error.type": "Bitte wählen Sie eine Terminart.",
  "error.calendlyType": "Diese Terminart wird über Calendly gebucht.",
  "error.service": "Unbekannte Leistung.",
  "error.dateTime": "Bitte wählen Sie Datum und Uhrzeit.",
  "error.name": "Bitte geben Sie Ihren Namen an.",
  "error.email": "Bitte geben Sie eine gültige E-Mail-Adresse an.",
  "error.phone": "Bitte geben Sie eine Telefonnummer an.",
  "error.street": "Bitte geben Sie Straße und Hausnummer an.",
  "error.zip": "Bitte geben Sie eine fünfstellige PLZ an.",
  "error.city": "Bitte geben Sie den Ort an.",
  "error.consent": "Bitte stimmen Sie der Datenverarbeitung zu.",
  "error.rejected": "Anfrage konnte nicht gesendet werden.",
  "error.slotTaken": "Dieser Termin ist leider gerade vergeben worden. Bitte wählen Sie eine andere Uhrzeit.",
  "error.notFound": "Buchung nicht gefunden.",
  "error.invalidLink": "Link ungültig.",
  "error.calendlyCancel": "Bitte sagen Sie diesen Termin über den Link in Ihrer Calendly-E-Mail ab.",
  "error.pastCancel": "Vergangene Termine können nicht mehr abgesagt werden.",
  "error.generic": "Unerwarteter Fehler. Bitte versuchen Sie es erneut.",

  // Wizard confirmation
  "done.callBooked": "Ihre Video-Beratung ist gebucht",
  "done.booked": "Ihr Termin ist gebucht",
  "done.requested": "Ihre Anfrage ist eingegangen",
  "done.calendlyText": "Calendly hat Ihnen gerade eine Bestätigung mit dem Meeting-Link an {email} geschickt. Wir haben dieselbe Einladung erhalten.",
  "done.confirmedText": "Wir haben Ihnen eine Bestätigung an {email} geschickt.",
  "done.confirmedCallText": "Wir haben Ihnen eine Bestätigung an {email} geschickt – mit dem Link zum Gespräch. Wir haben denselben Link erhalten.",
  "done.requestedText": "Wir prüfen den Termin und bestätigen ihn in der Regel innerhalb eines Werktags per E-Mail an {email}.",
  "done.saving": "Buchung wird gespeichert …",

  // Booking page (/buchung/<id>)
  "manage.notFoundTitle": "Buchung nicht gefunden",
  "manage.notFoundText": "Der Link ist unvollständig oder abgelaufen. Bitte nutzen Sie den Link aus Ihrer Bestätigungs-E-Mail oder rufen Sie uns an:",
  "manage.pending": "Wir prüfen Ihren Wunschtermin und bestätigen ihn per E-Mail, meist innerhalb eines Werktags.",
  "manage.changeTitle": "Termin passt nicht mehr?",
  "manage.changeText": "Sagen Sie ab und buchen Sie einfach einen neuen Termin. Wir bekommen automatisch Bescheid.",
  "manage.reschedule": "Termin verschieben",

  // Cancelling
  "cancel.button": "Termin absagen",
  "cancel.confirm": "Wirklich absagen? Der Termin wird für andere freigegeben.",
  "cancel.yes": "Ja, Termin absagen",
  "cancel.keep": "Termin behalten",
  "cancel.busy": "Wird abgesagt …",
  "cancel.failed": "Absage hat nicht geklappt.",

  // Calendly embed
  "calendly.loadError": "Calendly konnte nicht geladen werden. Bitte laden Sie die Seite neu oder rufen Sie uns an.",
  "calendly.frame": "Terminauswahl von Calendly",

  // Customer emails and calendar file
  "mail.greeting": "Guten Tag {name},",
  "mail.requestedSubject": "Anfrage erhalten: {ref}",
  "mail.requestedBody": "vielen Dank für Ihre Anfrage. Wir prüfen den Termin und bestätigen ihn in der Regel innerhalb eines Werktags.",
  "mail.viewBooking": "Buchung ansehen",
  "mail.confirmedTitle": "Ihr Termin ist bestätigt",
  "mail.confirmedBody": "Ihr Termin ist bestätigt. Wir kommen pünktlich zu Ihnen.",
  "mail.confirmedCallBody": "Ihre Video-Beratung ist gebucht. Zum vereinbarten Zeitpunkt öffnen Sie einfach den Link unten – im Browser, ohne Installation.",
  "mail.confirmedSubject": "Termin bestätigt: {when}",
  "mail.confirmedCallSubject": "Video-Beratung bestätigt: {when}",
  "mail.cancelledTitle": "Ihr Termin wurde abgesagt",
  "mail.cancelledBody": "der folgende Termin findet nicht statt. Sie können jederzeit einen neuen Termin buchen.",
  "mail.cancelledSubject": "Termin abgesagt: {ref}",
  "ics.file": "termin",
  "ics.fileCancelled": "termin-abgesagt",
  "ics.questions": "Fragen: {phone} · {email}",
};

export default de;
