# Go-Live ellenőrzőlista

Ez a rövid lista az élesítés előtti utolsó technikai ellenőrzéshez készült. A cél nem új funkció bevezetése, hanem annak biztosítása, hogy a publikus ajánlatkérő, a belső admin nézet és a kapcsolódó külső szolgáltatások stabilan működjenek.

## Kötelező környezeti változók

Az alkalmazás teljes működéséhez ezeknek az értékeknek be kell lenniük állítva:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_ACCESS_TOKEN=
RESEND_API_KEY=
ADMIN_NOTIFICATION_EMAIL=
ADMIN_NOTIFICATION_FROM_EMAIL=
APP_BASE_URL=
```

Publikus analitikához legalább az egyik legyen kitöltve:

```env
NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

Megjegyzés:

- Az `APP_BASE_URL` éles környezetben kötelezően ajánlott. Ha hiányzik, a rendszer biztonságos helyi alap URL-re áll vissza, de ez hibás canonical URL-eket, sitemap URL-eket és admin linkeket eredményezhet.
- A `NEXT_PUBLIC_SUPABASE_URL` és `NEXT_PUBLIC_SUPABASE_ANON_KEY` hiánya nem nyers publikus hibával kell, hogy találkozzon, de a képfeltöltés és a böngészős storage műveletek nem fognak működni.

## Külső szolgáltatások és setup

- Supabase projekt:
  a publikus request mentéshez és az admin olvasáshoz működő projekt szükséges.
- Supabase SQL:
  a [service_requests.sql](/Users/imperioluigi/imperio-webapp/supabase/service_requests.sql) és a [job_applications.sql](/Users/imperioluigi/imperio-webapp/supabase/job_applications.sql) fájlokat le kell futtatni a célprojektben.
- Supabase Storage:
  létre kell hozni a `service-request-images` és a `job-application-files` buckete(ke)t. A szolgáltatási képek publikus böngészős feltöltése policy-t igényel, a jelentkezési önéletrajzok feltöltése szerveroldalon történik.
- Resend:
  működő API kulcs, hitelesített feladó domain/cím, és fogadó admin cím szükséges.
- Google Tag Manager vagy GA4:
  a publikus analitika opcionális, de ha használva van, legalább az egyik provider legyen helyesen konfigurálva.

## Képi assetek

A publikus felülethez ezeknek a fájloknak ténylegesen jelen kell lenniük a `public` mappában:

- `/images/about/vezeto-portrait.jpg`
- `/images/about/work-01.jpg` ... `/images/about/work-17.jpg`
- `/images/sponsor/OFA.svg`

Hiányzó asset esetén a felület fallbacket mutat, de éles indulás előtt ezeket célszerű végleges tartalommal feltölteni.

## Manuális tesztek élesítés előtt

- A főoldal és mind a 4 szolgáltatásoldal betölt hibamentesen.
- A publikus űrlapok mind a négy szolgáltatástípusnál végigvihetők.
- Kötelező mezőhiba esetén a felhasználó magyar, nyugodt és érthető visszajelzést kap.
- Sikeres kérésmentés esetén a sikerállapot stabilan megjelenik.
- Sikertelen kérésmentés esetén nem jelenik meg technikai hiba vagy Supabase részlet a publikus UI-ban.
- Képfeltöltés esetén:
  legfeljebb 3 kép tölthető fel, a túl nagy és nem kép típusú fájlok tiltva vannak, részleges feltöltési hiba esetén nem maradnak félkész csatolások.
- Ellenőrizze, hogy új kérésnél:
  a `service_requests` sor létrejön, a `service_request_attachments` metaadatok létrejönnek, és a storage objektumok megjelennek.
- Ellenőrizze, hogy új jelentkezésnél:
  a `job_applications` sor létrejön, az önéletrajz bekerül a `job-application-files` bucketbe, és az admin oldalon megnyitható.
- Ellenőrizze, hogy admin értesítő e-mail érkezik.
- Ellenőrizze, hogy ügyfél visszaigazoló e-mail érkezik, ha az űrlapon érvényes e-mail cím szerepel.
- Az `/admin`, `/admin/ajanlatkeresek` és `/admin/jelentkezesek` oldalak:
  token nélkül védettek, hibás tokennel nem nyílnak meg, helyes tokennel működnek.
- Az admin listákban a státusz mentése működik, a szolgáltatási megkereséseknél az admin megjegyzés mentése is, és hibánál is kontrollált belső visszajelzés látható.
- A sitemap és a robots végpont a tényleges éles domainre mutat.
- A GTM vagy GA4 oldalon megjelennek a pageview és CTA/form események, ha az analitika be van kapcsolva.

## Production működési megjegyzések

- Az admin és ügyfél e-mail küldési hiba nem blokkolja a request mentését.
- A munkajelentkezési e-mail küldési hiba sem blokkolja a sikeres adatmentést.
- A publikus request API szerveroldalon generikus hibát ad vissza, technikai részletek nélkül.
- A kliensoldali logolás visszafogottabb, productionben nem szór részletes Supabase hibaobjektumokat a konzolra.
- A storage metadata mentési hiba vagy részleges upload hiba esetén a rendszer best-effort takarítást végez.

## Ismert MVP korlátok

- Az admin védelem jelenleg query token alapú, nem teljes felhasználókezelés.
- Az admin oldalak nem audit trail vagy CRM rendszerként működnek, hanem belső MVP áttekintőként.
- A képfeltöltés publikus böngészős flowban történik, ezért a Supabase Storage policy-k helyessége kritikus.
- Az önéletrajz feltöltése szerveroldalon történik, ezért az alkalmazás futtatási környezetének fogadnia kell a nagyobb multipart kéréseket is.
- A Google Fontok build közben külső letöltést igényelhetnek, ezért a build környezetben kimenő hálózati hozzáférésre szükség lehet.
