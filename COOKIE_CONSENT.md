# Cookie Consent

## Tárolás

- A publikus consent döntés kliensoldalon, a `localStorage` alatt tárolódik.
- A kulcs neve: `imperio-cookie-consent`
- A tárolt érték JSON rekord, amely tartalmazza a verziót, a mentés idejét és a kategóriánkénti beállításokat.

## Jelenlegi kategóriák

- `necessary`
  - Mindig engedélyezett.
  - Az oldal alapműködéséhez és a consent döntés megőrzéséhez kell.
- `analytics`
  - Kizárólag opt-in alapon engedélyezhető.
  - Ehhez kötött a publikus analytics inicializáció és eseményküldés.

## Analytics kapuzás

- A publikus consent állapotot a `src/components/privacy/consent-provider.tsx` kezeli.
- Az analytics betöltése a `src/components/analytics/analytics-provider.tsx` fájlban csak akkor történik meg, ha az `analytics` kategória engedélyezett.
- Az eseményküldés második védelmi vonala a `src/lib/analytics/tracker.ts`, ahol consent nélkül az események nem kerülnek sorba állításra és nem jutnak el a providerhez.

## Hol érdemes bővíteni később

- Új kategóriák felvételéhez először a `src/lib/privacy/consent.ts` típusaiban és normalizáló logikájában érdemes bővíteni a modellt.
- Ezután a `src/components/privacy/consent-banner.tsx` beállítási felületén lehet megjeleníteni az új kapcsolót és leírást.
- Ha egy új kategória külső integrációt is vezérel, annak kapuzását központilag, a provider vagy az adott integrációs provider szintjén érdemes megoldani.
