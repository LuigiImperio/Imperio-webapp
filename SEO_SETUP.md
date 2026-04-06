# SEO alapok

Ez a projekt most már tartalmazza a nyilvános oldalak alapvető SEO-rétegét, a helyi szolgáltatási relevanciát támogató metadata-beállításokat, valamint könnyű strukturált adatot.

## Hol van a fő konfiguráció?

- Gyökér metadata: `src/app/layout.tsx`
- Oldalszintű metadata: `src/app/page.tsx` és a `src/app/szolgaltatasok/*/page.tsx` fájlok
- Közös SEO helper: `src/lib/seo/metadata.ts`
- Közös site/structured data helper: `src/lib/seo/site.ts`
- Strukturált adat komponens: `src/components/seo/structured-data.tsx`
- Technikai SEO fájlok:
  - `src/app/robots.ts`
  - `src/app/sitemap.ts`

## Kanonikus production domain

A publikus SEO-réteg alap URL-je az `APP_BASE_URL` változóból érkezik. Ennél a projektnél a kanonikus production domain:

- `https://www.imperiogepeszet.hu`

Ez az érték határozza meg a következőket is:

- canonical URL-ek
- Open Graph URL-ek
- `metadataBase`
- `robots.txt` sitemap hivatkozása
- `sitemap.xml` publikus URL-jei

Ha az `APP_BASE_URL` véletlenül a non-`www` domainre lenne állítva, a közös URL helper ezt a publikus SEO-rétegben automatikusan a `www` verzióra normalizálja.

## Mi lett hozzáadva?

- egyedi magyar title és description minden fő nyilvános oldalhoz
- canonical kezelés a publikus oldalakhoz
- Open Graph alapok a megoszthatósághoz
- `robots.txt` és `sitemap.xml` generálás a Next fájlkonvencióival
- minimális JSON-LD structured data a homepage-hez és a szolgáltatásoldalakhoz
- finomított helyi szolgáltatási terület-megjelenítés a publikus tartalomban

## Helyi relevancia

A jelenlegi kiemelt szolgáltatási terület a közös service-area konfigurációból érkezik, ezért a metadata és a publikus szöveg nem külön helyeken, szétszórva tartalmazza ezt az információt.

## Mi bővíthető később?

- külön Open Graph kép route vagy statikus OG képek
- részletesebb szervezeti és szolgáltatás-specifikus structured data
- keresési teljesítményhez igazított finomabb title/description tesztelés
- külön referencia- vagy esettanulmány-oldalak indexelhető metadata-val
