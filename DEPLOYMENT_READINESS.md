# Élesítési ellenőrzőlista

 Ez a projekt már több szolgáltatásos, Supabase-alapú ajánlatkérő és külön munkajelentkezési platformként működik. Élesítés előtt érdemes az alábbi pontokat végignézni.

## Kötelező környezeti változók

Az alkalmazás teljes működéséhez ezek a változók szükségesek:

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

Analitikához legalább az egyik legyen beállítva:

```env
NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

## Fő integrációk

- Supabase adatbázis:
  a `service_requests`, `service_request_attachments` és `job_applications` táblák tárolják a megkereséseket, képcsatolmányokat és a külön munkajelentkezéseket
- Supabase Storage:
  a `service-request-images` bucket fogadja az opcionális képfeltöltéseket, a `job-application-files` bucket pedig a feltöltött önéletrajzokat
- Resend:
  szerveroldali admin értesítő és ügyfél-visszaigazoló e-mail küldés
- Google Tag Manager vagy GA4:
  publikus konverziós események és pageview mérés

## Mit érdemes ellenőrizni deploy előtt?

- A `supabase/service_requests.sql` és a `supabase/job_applications.sql` lefutott a cél Supabase projektben.
- Az RLS szabályok és a storage bucket ténylegesen léteznek.
- Az admin oldal megnyitható a beállított `ADMIN_ACCESS_TOKEN` értékkel.
- A publikus ajánlatkérés mentése működik mind a négy szolgáltatástípusnál.
- A publikus munkajelentkezés mentése működik, és a kötelező önéletrajz feltöltése is sikeres.
- A képfeltöltés működik, és 3 képnél többet vagy túl nagy fájlt nem enged.
- Az önéletrajz feltöltése működik PDF/DOC/DOCX/ODT/RTF formátumokkal.
- Az admin értesítő e-mail és az ügyfél-visszaigazoló e-mail is megérkezik.
- A jelentkező visszaigazoló e-mail és a belső jelentkezési értesítő e-mail is megérkezik.
- Az `APP_BASE_URL` valós éles domainre mutat, így a SEO és az admin linkek helyesek.
- Az analitika ténylegesen kap eseményeket GTM vagy GA4 oldalon.

## Frissített stabilitási viselkedés

- Hiányzó kritikus szerveroldali konfiguráció esetén az alkalmazás nem nyers hibával áll le, hanem kontrolláltabban reagál.
- A külső e-mail és API hívások timeouttal futnak, így kisebb az elakadó kérés kockázata.
- Az analitikai eseménysor korlátozott méretű, ezért blokkolt script esetén sem nő korlátlanul.
- A képfeltöltés ellenőrzi a darabszámot, a fájltípust és a méretet.
- Az önéletrajz feltöltése szerveroldalon történik, így a jelentkezési rekord és a fájl egy tranzakciószerűbb, kontrolláltabb flowban kerül feldolgozásra.

## Ismert MVP korlátok

- Az admin védelem jelenleg tokenes, nem teljes hitelesítési rendszer.
- Az e-mail küldési hibák nem blokkolják a kérés mentését, ezért az adat megmarad, de az értesítés külön ellenőrizendő.
- A képfeltöltés publikus folyamatban történik, ezért a storage policy-k helyes beállítása különösen fontos.
- A státusz- és admin megjegyzéskezelés egyszerű belső workflow, nem teljes CRM vagy ticketing rendszer.
- A “Dolgozz velünk” jelentkezések külön admin listában jelennek meg, de ez továbbra is egyszerű belső MVP workflow, nem teljes HR rendszer.
