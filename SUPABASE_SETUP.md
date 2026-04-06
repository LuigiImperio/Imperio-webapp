# Supabase beállítás

## Szükséges környezeti változók

A helyi `.env.local` fájlban add meg az alábbi változókat:

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

Az `APP_BASE_URL` opcionális. Ha nincs megadva, az admin értesítő e-mail a beérkező kérés aktuális domainje alapján építi fel az admin linket.

## Lefuttatandó SQL

A Supabase SQL Editor felületén futtasd le a következő fájlt:

- `supabase/service_requests.sql`

Ez a fájl a fő ajánlatkérés-táblát, a képcsatolmányok tábláját, az RLS szabályokat és a szükséges storage bucketet is létrehozza.

## Mit tárol a jelenlegi implementáció?

A jelenlegi megoldás a kazáncsere, a fűtéskorszerűsítés, a hibabejelentés és a vízszerelés ajánlatkéréseket a `service_requests` táblába menti.

Az opcionális képcsatolmányok metaadatai a `service_request_attachments` táblába kerülnek.

A belső admin oldalon használható utánkövetési megjegyzés a `service_requests.admin_note` mezőbe kerül.

A preferált kapcsolattartási idősáv, a helyszíni felmérés / egyeztetési preferenciák és az egyszerű szolgáltatási terület-besorolás a `form_data_json` mezőben tárolódik.

A feltöltött képek a `service-request-images` storage bucketbe kerülnek.

Az admin nézet ugyanezt a táblát olvassa szerveroldalon.

A szolgáltatástípusok a `service_type` mezőben különülnek el:

- `kazancsere`
- `futeskorszerusites`
- `hibabejelentes`
- `vizszereles`

Új kérés sikeres rögzítése után a rendszer admin értesítő e-mailt és ügyfél-visszaigazoló e-mailt is próbál küldeni.

Az opcionális képfeltöltés mind a négy flow esetén ugyanazt a `service-request-images` bucketet és a `service_request_attachments` táblát használja.

A publikus folyamatok most már azt is rögzítik, hogy a megkereső mikor kereshető a legkönnyebben, szükséges lehet-e helyszíni felmérés, mikor lenne megfelelő az egyeztetés vagy felmérés, és a település alapján kap egy egyszerű, nem blokkoló szolgáltatási terület-visszajelzést.

A tábla státuszmezőt is használ, az alábbi értékekkel:

- `uj`
- `folyamatban`
- `kapcsolat_felveve`
- `lezarva`

## Kell hozzá bejelentkezés?

Nem. Ez egy publikus ajánlatkérő folyamat, jelenleg hitelesítés nélkül működik.

Az admin értesítő e-mail küldése szerveroldalon történik, a publikus böngészős kliens nem kap hozzáférést az e-mail szolgáltató titkaihoz.

## Biztonsági beállítás

Az RLS engedélyezve van, és a publikus szabály szándékosan csak `insert` műveletet enged az anon szerepkör számára.

Ez a korlátozás a `service_requests` és a `service_request_attachments` táblára is érvényes.

A képfeltöltéshez a storage oldalon is csak a `service-request-images` bucketbe történő anon feltöltés van megnyitva.

A képek publikus olvasása nincs megnyitva. Az admin nézet szerveroldalon, aláírt linkekkel jeleníti meg őket.

## Belső admin nézet

Az admin dashboard helyi megnyitása:

- `/admin?token=SAJAT_TOKEN`

Az admin oldal helyi megnyitása:

- `/admin/ajanlatkeresek?token=SAJAT_TOKEN`

Ehhez az `ADMIN_ACCESS_TOKEN` változót is be kell állítani.

Ez jelenleg egy MVP belső oldal, nem kész hitelesítési rendszer.
Az olvasás szerveroldalon történik a `SUPABASE_SERVICE_ROLE_KEY` használatával, ezért nincs publikus, korlátlan böngészős olvasási hozzáférés.

Az admin dashboard ugyanazzal a tokenes védelemmel működik, mint a részletes ajánlatkéréslista.

Az admin nézetben a státuszok frissíthetők, és a lista állapot szerint szűrhető.
Ez továbbra is egy egyszerű belső MVP workflow, nem teljes ügykezelő rendszer.

Az admin nézet a csatolt képeket is meg tudja jeleníteni előnézettel vagy megnyitható hivatkozással, a többféle szolgáltatástípust külön, értelmes műszaki összefoglalóval kezeli, és mutatja a kapcsolattartási, egyeztetési és helyszíni felmérési preferenciákat is.

Az `admin_note` mező kizárólag belső admin használatra szolgál.
Ez nem része a publikus ajánlatkérő űrlapoknak, és a belső utánkövetéshez, egyeztetési megjegyzésekhez használható az admin oldalon.

## E-mail értesítések

Az admin értesítés és az ügyfél-visszaigazolás is Resend alapú szerveroldali e-mail küldéssel működik.

Szükséges változók:

- `RESEND_API_KEY`
- `ADMIN_NOTIFICATION_EMAIL`
- `ADMIN_NOTIFICATION_FROM_EMAIL`
- opcionálisan `APP_BASE_URL`

Sikeres ajánlatkérés-rögzítés után a rendszer admin e-mailt küld az új beérkezésről, benne a fő kapcsolattartási adatokkal, a szolgáltatástípussal, egy rövid műszaki összefoglalóval és az admin oldal linkjével.

A megkereső e-mail-címére a rendszer külön, magyar nyelvű visszaigazoló e-mailt is küld, amely megerősíti a rögzítést, tartalmazza a szolgáltatástípust, az alapadatokat és egy rövid összefoglalót a beküldött kérésről.

Az e-mail összefoglaló a preferált kapcsolattartási időt, a helyszíni felmérés / egyeztetési preferenciákat és az egyszerű szolgáltatási terület-státuszt is tartalmazza.

Fontos működés:

- ha az ajánlatkérés mentése sikeres, a rekord nem vész el
- ha az admin vagy az ügyfél e-mail küldése ezután hibázik, a kérés attól még rögzítve marad
- az e-mail hiba nem jelenik meg technikai részletekkel a publikus felhasználói felületen
