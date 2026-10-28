// Polish UI strings — same keys as de.js. Formal register: running text
// addresses the visitor as "Państwo"; short buttons use the usual imperative.
// Generated translation; have a native speaker review before going live.

const pl = {
  // Formatting
  "format.dateTime": "{date}, godz. {time}",
  "format.time": "godz. {time}",

  // Layout & navigation
  "a11y.skipToContent": "Przejdź do treści",
  "brand.homeLabel": "{brand} – strona główna",
  "nav.main": "Nawigacja główna",
  "nav.mobile": "Nawigacja główna (mobilna)",
  "nav.menu": "Menu",
  "nav.home": "Strona główna",
  "nav.services": "Usługi",
  "nav.references": "Realizacje",
  "nav.process": "Jak pracujemy",
  "nav.contact": "Kontakt",
  "lang.label": "Język",

  // Calls to action
  "cta.book": "Umów termin",
  "cta.bookFree": "Umów bezpłatny termin",
  "cta.bookVisit": "Umów wizytę na miejscu",
  "cta.bookVideo": "Umów konsultację wideo",
  "cta.videoFirst": "Najpierw konsultacja wideo",
  "cta.bookNew": "Umów nowy termin",
  "cta.home": "Do strony głównej",

  // Page titles
  "meta.booking": "Rezerwacja terminu",
  "meta.references": "Nasze realizacje",
  "meta.manage": "Państwa rezerwacja",
  "meta.notFound": "Nie znaleziono strony",

  // Home page
  "home.serviceMore": "Szczegóły i termin",
  "home.allReferences": "Zobacz wszystkie realizacje",
  "contact.address": "Adres",
  "contact.phone": "Telefon",
  "contact.email": "E-mail",
  "contact.hours": "Godziny pracy",

  // Service detail page
  "service.duration": "Typowy czas realizacji",
  "service.price": "Cena",
  "service.projects": "Realizacje: {service}",

  // References page
  "refs.filter": "Filtruj według usługi",
  "refs.all": "Wszystkie",
  "refs.demoNotice": "Przykładowe treści prototypu – w tym miejscu pojawią się później prawdziwe realizacje firmy.",
  "refs.empty": "Dla tej usługi nie ma jeszcze realizacji.",

  // Footer
  "footer.phone": "Tel.",
  "footer.availability": "Godziny pracy",
  "footer.serviceArea": "Obszar działania: {area}",
  "footer.legal": "Informacje prawne",
  "footer.staffLogin": "Logowanie dla pracowników",
  "footer.demo": "Wersja prototypowa",

  // 404
  "notFound.title": "Nie znaleziono strony",
  "notFound.text": "Ten adres nie istnieje lub został usunięty.",

  // Booking status
  "status.requested": "Do potwierdzenia",
  "status.confirmed": "Potwierdzony",
  "status.done": "Zrealizowany",
  "status.cancelled": "Odwołany",

  // Booking details (wizard, booking page, emails, calendar file)
  "booking.fallbackType": "Termin",
  "booking.ref": "Numer rezerwacji",
  "booking.when": "Termin",
  "booking.date": "Data",
  "booking.time": "Godzina",
  "booking.kind": "Rodzaj",
  "booking.type": "Rodzaj spotkania",
  "booking.service": "Usługa",
  "booking.serviceOpen": "Jeszcze nie ustalono",
  "booking.unsure": "Jeszcze nie wiem",
  "booking.duration": "Czas trwania",
  "booking.address": "Adres",
  "booking.videoLink": "Link do rozmowy wideo",
  "booking.meetingLink": "Link do spotkania",
  "booking.seeCalendly": "Zob. potwierdzenie z Calendly",
  "booking.joinCall": "Dołącz do rozmowy wideo",
  "booking.addToCalendar": "Dodaj do kalendarza",
  "booking.manage": "Zarządzaj rezerwacją",

  // Booking wizard
  "wizard.progress": "Postęp",
  "wizard.step.service": "Usługa",
  "wizard.step.type": "Rodzaj spotkania",
  "wizard.step.details": "Państwa dane",
  "wizard.step.slot": "Wybór terminu",
  "wizard.back": "Wstecz",
  "wizard.serviceTitle": "Czego dotyczy zapytanie?",
  "wizard.serviceSub": "Prosimy wybrać usługę, która Państwa interesuje. Nie są Państwo pewni? Żaden problem – doradzimy.",
  "wizard.unsureText": "Wspólnie ustalimy, czego potrzebuje Państwa łazienka.",
  "wizard.typeTitle": "Od czego chcieliby Państwo zacząć?",
  "wizard.typeSub": "Oba spotkania są bezpłatne i niezobowiązujące.",
  "wizard.slotTitle": "Jaki termin Państwu odpowiada?",
  "wizard.slotSub": "{type}, {duration}. Pokazujemy wszystkie wolne terminy z najbliższych czterech tygodni.",
  "wizard.loadingDays": "Wczytywanie wolnych terminów …",
  "wizard.daysError": "Nie udało się wczytać terminów.",
  "wizard.timesError": "Nie udało się wczytać godzin.",
  "wizard.day": "Dzień",
  "wizard.dayFull": "{date}, brak wolnych terminów",
  "wizard.dayFree": "{date}, wolne terminy: {count}",
  "wizard.freeBadge": "wolne: {count}",
  "wizard.fullyBooked": "W ciągu najbliższych czterech tygodni nie ma niestety wolnych terminów. Prosimy o kontakt telefoniczny:",
  "wizard.timeOn": "Dostępne godziny – {date}",
  "wizard.loadingTimes": "Wczytywanie godzin …",
  "wizard.timeTaken": "{time}, termin zajęty",
  "wizard.toDetails": "Dalej: Państwa dane",
  "wizard.detailsTitle": "Państwa dane",
  "wizard.detailsOnsite": "Przyjedziemy do Państwa. Adres jest nam potrzebny do dojazdu.",
  "wizard.detailsCall": "Link do konsultacji wideo wyślemy e-mailem Państwu i sobie.",
  "wizard.detailsCalendly": "W następnym kroku wybiorą Państwo termin. Państwa dane będą tam już wpisane.",
  "wizard.submitOnsite": "Wyślij zapytanie o wizytę",
  "wizard.submitCall": "Umów konsultację wideo",
  "wizard.submitting": "Rezerwowanie …",
  "wizard.submitFailed": "Rezerwacja nie powiodła się.",
  "wizard.toCalendly": "Dalej: wybór terminu",
  "wizard.calendlyTitle": "Wybór terminu",
  "wizard.calendlySub": "Prosimy wybrać wolny termin. Potwierdzenie z linkiem do spotkania otrzymają Państwo i my automatycznie e-mailem.",
  "wizard.summary": "Państwa wybór",
  "wizard.byPhone": "Wolą Państwo telefonicznie?",

  // Booking form fields
  "field.name": "Imię i nazwisko",
  "field.email": "E-mail",
  "field.emailHint": "Na ten adres wyślemy potwierdzenie.",
  "field.phone": "Telefon",
  "field.phoneHint": "Na wypadek, gdybyśmy musieli coś pilnie wyjaśnić.",
  "field.street": "Ulica i numer domu",
  "field.zip": "Kod pocztowy",
  "field.city": "Miejscowość",
  "field.choose": "Proszę wybrać",
  "field.size": "Wielkość łazienki",
  "field.timeframe": "Kiedy chcieliby Państwo rozpocząć?",
  "field.message": "Co powinniśmy wiedzieć wcześniej? (opcjonalnie)",
  "field.messagePlaceholder": "np. zamiana wanny na prysznic, stara kamienica, 3. piętro bez windy",
  "field.consent": "Akceptuję {link} i wyrażam zgodę na przechowywanie moich danych w celu obsługi zapytania.",
  "field.privacy": "politykę prywatności",
  "option.size.small": "poniżej 6 m²",
  "option.size.medium": "6–10 m²",
  "option.size.large": "powyżej 10 m²",
  "option.size.unknown": "Nie wiem",
  "option.timeframe.asap": "Jak najszybciej",
  "option.timeframe.soon": "Za 1–3 miesiące",
  "option.timeframe.later": "Za 3–6 miesięcy",
  "option.timeframe.flexible": "Elastycznie",

  // Validation and booking errors (wizard and API)
  "error.type": "Prosimy wybrać rodzaj spotkania.",
  "error.calendlyType": "Ten rodzaj spotkania rezerwuje się przez Calendly.",
  "error.service": "Nieznana usługa.",
  "error.dateTime": "Prosimy wybrać datę i godzinę.",
  "error.name": "Prosimy podać imię i nazwisko.",
  "error.email": "Prosimy podać prawidłowy adres e-mail.",
  "error.phone": "Prosimy podać numer telefonu.",
  "error.street": "Prosimy podać ulicę i numer domu.",
  "error.zip": "Prosimy podać pięciocyfrowy kod pocztowy.",
  "error.city": "Prosimy podać miejscowość.",
  "error.consent": "Prosimy wyrazić zgodę na przetwarzanie danych.",
  "error.rejected": "Nie udało się wysłać zapytania.",
  "error.slotTaken": "Niestety ten termin został właśnie zajęty. Prosimy wybrać inną godzinę.",
  "error.notFound": "Nie znaleziono rezerwacji.",
  "error.invalidLink": "Nieprawidłowy link.",
  "error.calendlyCancel": "Prosimy odwołać ten termin za pomocą linku z e-maila od Calendly.",
  "error.pastCancel": "Minionych terminów nie można już odwołać.",
  "error.generic": "Wystąpił nieoczekiwany błąd. Prosimy spróbować ponownie.",

  // Wizard confirmation
  "done.callBooked": "Konsultacja wideo została zarezerwowana",
  "done.booked": "Termin został zarezerwowany",
  "done.requested": "Otrzymaliśmy Państwa zapytanie",
  "done.calendlyText": "Calendly właśnie wysłało potwierdzenie z linkiem do spotkania na adres {email}. Otrzymaliśmy to samo zaproszenie.",
  "done.confirmedText": "Wysłaliśmy potwierdzenie na adres {email}.",
  "done.confirmedCallText": "Wysłaliśmy potwierdzenie na adres {email} – wraz z linkiem do rozmowy. Otrzymaliśmy ten sam link.",
  "done.requestedText": "Sprawdzimy termin i zwykle potwierdzimy go w ciągu jednego dnia roboczego e-mailem na adres {email}.",
  "done.saving": "Zapisywanie rezerwacji …",

  // Booking page (/buchung/<id>)
  "manage.notFoundTitle": "Nie znaleziono rezerwacji",
  "manage.notFoundText": "Link jest niekompletny lub wygasł. Prosimy skorzystać z linku z e-maila z potwierdzeniem lub zadzwonić do nas:",
  "manage.pending": "Sprawdzamy wybrany przez Państwa termin i potwierdzimy go e-mailem, zwykle w ciągu jednego dnia roboczego.",
  "manage.changeTitle": "Termin już Państwu nie odpowiada?",
  "manage.changeText": "Wystarczy odwołać termin i zarezerwować nowy. Otrzymamy automatyczne powiadomienie.",
  "manage.reschedule": "Zmień termin",

  // Cancelling
  "cancel.button": "Odwołaj termin",
  "cancel.confirm": "Czy na pewno odwołać? Termin zostanie udostępniony innym osobom.",
  "cancel.yes": "Tak, odwołaj termin",
  "cancel.keep": "Zachowaj termin",
  "cancel.busy": "Odwoływanie …",
  "cancel.failed": "Nie udało się odwołać terminu.",

  // Calendly embed
  "calendly.loadError": "Nie udało się wczytać Calendly. Prosimy odświeżyć stronę lub zadzwonić do nas.",
  "calendly.frame": "Wybór terminu w Calendly",

  // Customer emails and calendar file
  // No {name}: a Polish greeting with a name needs vocative case and gender.
  "mail.greeting": "Dzień dobry,",
  "mail.requestedSubject": "Otrzymaliśmy zapytanie: {ref}",
  "mail.requestedBody": "dziękujemy za Państwa zapytanie. Sprawdzimy termin i zwykle potwierdzimy go w ciągu jednego dnia roboczego.",
  "mail.viewBooking": "Zobacz rezerwację",
  "mail.confirmedTitle": "Termin został potwierdzony",
  "mail.confirmedBody": "Państwa termin został potwierdzony. Przyjedziemy punktualnie.",
  "mail.confirmedCallBody": "Państwa konsultacja wideo została zarezerwowana. W umówionym czasie wystarczy otworzyć poniższy link – w przeglądarce, bez instalowania czegokolwiek.",
  "mail.confirmedSubject": "Potwierdzenie terminu: {when}",
  "mail.confirmedCallSubject": "Potwierdzenie konsultacji wideo: {when}",
  "mail.cancelledTitle": "Termin został odwołany",
  "mail.cancelledBody": "poniższy termin się nie odbędzie. Nowy termin mogą Państwo zarezerwować w dowolnej chwili.",
  "mail.cancelledSubject": "Termin odwołany: {ref}",
  "ics.file": "termin",
  "ics.fileCancelled": "termin-odwolany",
  "ics.questions": "Pytania: {phone} · {email}",
};

export default pl;
