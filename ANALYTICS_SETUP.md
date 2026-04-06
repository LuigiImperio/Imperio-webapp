# Analitika események

Ez a projekt egy könnyű, bővíthető publikus eseménykövetési réteget használ a konverziós pontok mérésére. A belső hívási pontok megmaradnak a saját absztrakción belül, de most már környezeti változók alapján éles Google Tag Manager vagy közvetlen GA4 bekötést is tudnak használni.

## Hol van a megvalósítás?

- Központi eseménynevek: `src/lib/analytics/public-events.ts`
- Analitikai konfiguráció: `src/lib/analytics/config.ts`
- Általános kliensoldali küldés: `src/lib/analytics/tracker.ts`
- Űrlap-specifikus segéd: `src/lib/analytics/use-form-tracking.ts`
- Követett link komponens: `src/components/analytics/tracked-link.tsx`
- Provider és script bootstrap: `src/components/analytics/analytics-provider.tsx`
- App Router pageview követés: `src/components/analytics/pageview-tracker.tsx`

## Milyen környezeti változók vannak?

- `NEXT_PUBLIC_GTM_ID`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`

Az aktuálisan bekötött közvetlen GA4 mérési azonosító:

- `G-R8HXRY7MSV`

Bekötési logika:

1. ha `NEXT_PUBLIC_GTM_ID` be van állítva, a publikus események és a pageview-k elsődlegesen a `dataLayer` felé mennek
2. ha nincs GTM, de van `NEXT_PUBLIC_GA_MEASUREMENT_ID`, akkor közvetlen GA4 `gtag` küldés történik
3. ha egyik sincs beállítva, a publikus UX változatlan marad, fejlesztői környezetben pedig konzolos fallback marad elérhető

Ha mindkét változó ki van töltve, a kliensoldali event dispatch a GTM-et kezeli elsődleges providerként. Ez segít elkerülni a duplikált kliensoldali eseményküldést, ha a GA4 a GTM konténeren belül van konfigurálva.

A jelenlegi projektben a közvetlen GA4 mérés van használatban, ezért a `NEXT_PUBLIC_GTM_ID` üresen hagyható, a `NEXT_PUBLIC_GA_MEASUREMENT_ID` pedig `G-R8HXRY7MSV` értéket kap.

## Milyen események vannak most?

- `page_view`
- `cta_click`
- `form_started`
- `form_step_completed`
- `service_request_submitted`
- `faq_item_expanded`

Az eseményekhez, ahol releváns, kontextus is társulhat, például:

- `page_name`
- `page_type`
- `service_type`
- `source_page`
- `source_section`
- `entry_point`
- `cta_variant`
- `form_name`
- `step_index`
- `step_name`
- `next_step_index`
- `next_step_name`
- `total_steps`
- `milestone_name`
- `funnel_stage`

Az űrlap-eseményeknél a rendszer most már lépésnév-szintű kontextust is továbbít, így a GTM vagy GA4 riportokban nem csak a lépésszám, hanem a konkrét űrlap-szakasz is elemezhető.

## Hogyan működik a pageview követés?

Az App Router alatti pageview-k egy külön kliensoldali komponensen keresztül mennek, amely az útvonal- és query-változásokat figyeli.

Ez azért fontos, mert így:

- nincs szétszórt pageview-logika a publikus oldalakban
- nincs automatikus duplikált GA4 pageview a `gtag('config')` alapbeállításából
- route-váltáskor is következetes marad a mérés

Az aktuális megvalósítás a Google tag scriptet globálisan, az `AnalyticsProvider` komponensen keresztül tölti be, és csak akkor aktiválja, ha az analitikai hozzájárulás ezt engedi.

A küldött pageview kontextus tartalmazza:

- `page_path`
- `page_location`
- `page_title`

## Mi történik, ha nincs konfigurálva éles analitika?

Az eseményküldés továbbra is a belső absztrakción keresztül történik:

1. böngészőoldalon létrejön egy `imperio:analytics` egyedi esemény
2. ha van aktív provider bootstrap, a tracker eljuttatja az eseményt GTM vagy GA4 irányba
3. ha nincs aktív provider, fejlesztői környezetben konzolos fallback marad

Ez azt jelenti, hogy a publikus felület viselkedése nem változik akkor sem, ha még nincs bekötve végleges analitikai szolgáltató.

## Hogyan köthető rá később éles analitikai szolgáltató?

Két egyszerű út van:

- Google Tag Manager használata:
  - töltsd ki a `NEXT_PUBLIC_GTM_ID` változót
  - a publikus események `event` mezővel kerülnek a `dataLayer`-be
  - a GTM-ben ezekhez lehet triggert és GA4 / egyéb taget kötni
- Közvetlen Google Analytics 4 használata:
  - töltsd ki a `NEXT_PUBLIC_GA_MEASUREMENT_ID` változót
  - a tracker közvetlen `gtag` eseményeket küld
- Más szolgáltató esetén:
  - a `src/lib/analytics/tracker.ts` belső megvalósítása cserélhető
  - a publikus hívási pontok ettől nem változnak

Az eseménynevek és a hívási pontok már központosítva vannak, ezért a későbbi csere vagy bővítés minimális kódmódosítással megoldható.

## Hol van a riportálási logika összefoglalva?

Az üzleti funnel- és KPI-szempontú összefoglaló a `ANALYTICS_REPORTING.md` fájlban található.
