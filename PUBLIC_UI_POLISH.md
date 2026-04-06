# Nyilvános vizuális finomítások

Ebben a körben a fókusz nem új backend funkció volt, hanem a nyilvános felület vizuális minőségének, ritmusának és visszafogott motion használatának javítása.

## Hol vannak a közös minták?

- Nyilvános reveal animáció: `src/components/motion/reveal.tsx`
- Egységes szolgáltatásoldal-hero minta: `src/components/sections/service-page-hero.tsx`
- Alap animációs és reveal class-ek: `src/app/globals.css`

## Mi javult?

- rétegzettebb, prémiumabb homepage hero
- egységesebb szolgáltatáskártya-kezelés
- kiforrottabb trust / references / FAQ / closing CTA ritmus
- egységesebb szolgáltatásoldal-hősfelületek
- finomabb hover és belépési animációk
- tisztább, mobilon is jobban használható formhéjak

## Irányelvek

- a motion maradjon visszafogott és teljesítménybarát
- az interaktív részeknél csak ott legyen kliensoldali réteg, ahol tényleg kell
- a nyilvános sötét vizuális nyelv maradjon konzisztens a teljes szolgáltatáscsaládban
