# PROJEKT_CONTEXT

## Projekt célja

Ez egy modern, prémium megjelenésű, magyar nyelvű weboldal egy épületgépészeti vállalkozás számára.

A cél nem csak egy szebb bemutatkozó oldal, hanem egy olyan üzletileg hasznos, konverzióra optimalizált felület, amely később interaktív ajánlatkérő és ügyfél-előszűrő rendszerként is működik.

A weboldal fő feladatai:

- bizalomépítés
- professzionális első benyomás
- szolgáltatások átlátható bemutatása
- strukturált kapcsolatfelvétel
- később szolgáltatás-specifikus ajánlatkérő folyamatok támogatása

---

## Technológiai stack

A projekt jelenlegi technológiai alapja:

- Next.js 16
- TypeScript
- Tailwind CSS
- shadcn/ui
- Radix primitives

Későbbi tervezett bővítések:

- Supabase
- React Hook Form
- Zod
- Motion

---

## Nyelvi szabály

Nagyon fontos szabály:

- Minden felhasználó által látható UI szöveg magyar legyen.
- Ide tartoznak a gombok, címek, bekezdések, navigációs elemek, státuszszövegek, helper text-ek és CTA-k.
- Kód, komponensnév, fájlnév és technikai azonosító maradhat angolul.

Ha bármilyen angol UI szöveg maradt a projektben, azt magyarra kell fordítani.

---

## Design irány

A kívánt vizuális irány:

- prémium
- modern
- letisztult
- sötét témájú
- elegáns
- visszafogott, de magabiztos
- konverziófókuszú

A cél nem egy túlzsúfolt vagy látványoskodó oldal, hanem egy olyan professzionális felület, amely:

- megbízhatóságot sugall
- strukturált működést mutat
- korszerű szolgáltatói benyomást kelt

A vizuális nyelv legyen:

- sok levegővel dolgozó
- tiszta tipográfiájú
- finom kontrasztokra építő
- visszafogott motion/animáció irányba továbbvihető

---

## Jelenlegi állapot

A projekt frontend alapja elkészült.

A homepage jelenlegi fő elemei:

- SiteNavbar
- HeroSection
- ServicesSection
- WhyChooseUsSection

A layout/meta szövegek magyarosítva lettek.
A dokumentum nyelve `hu`.

A projekt célja most az, hogy a főoldalt fokozatosan továbbépítsük egy erősebb, üzletileg hasznosabb landing oldallá.

---

## Már elkészült szerkezeti elemek

A projektben már létrejöttek vagy használatban vannak az alábbi komponensek / fájlok:

- `src/components/layout/site-navbar.tsx`
- `src/components/sections/hero-section.tsx`
- `src/components/sections/services-section.tsx`
- `src/components/sections/why-choose-us-section.tsx`
- `src/app/page.tsx`

A projektben shadcn/ui komponensek is használatban vannak, például:

- Button
- Card
- Input
- Textarea

Segédfájl is létre lett hozva:

- `src/lib/utils.ts`

---

## Fejlesztési alapelvek

Minden további módosításnál ezeket az elveket kell követni:

1. Ne módosíts feleslegesen nem kapcsolódó fájlokat.
2. Ne vezess be indokolatlan új függőségeket.
3. Őrizd meg a TypeScript kompatibilitást.
4. Használd újra a meglévő shadcn komponenseket, ha lehetséges.
5. Tartsd tisztán a komponensstruktúrát.
6. A homepage szekciókat külön fájlokban érdemes kezelni.
7. A felhasználói szövegek mindig magyarul jelenjenek meg.
8. A dizájn maradjon konzisztens a meglévő prémium sötét iránnyal.

---

## Következő tervezett lépések

A várható következő fejlesztési lépések:

- referencia / bizalomépítő blokk
- kapcsolatfelvételi CTA szekció
- hero szekció vizuális finomítása
- később szolgáltatásoldalak
- később interaktív ajánlatkérő flow, elsőként valószínűleg kazáncserére

---

## Codex munkaszabály

Ha egy coding agent vagy Codex dolgozik a projekten, akkor először:

1. olvassa el ezt a fájlt
2. nézze át a homepage-hez kapcsolódó jelenlegi fájlokat
3. csak utána javasoljon vagy végezzen módosítást

A coding agent feladata nem az, hogy újraalkossa az egész projektet, hanem hogy a meglévő megoldást folytassa és fejlessze tovább.

## Read PROJEKT_CONTEXT.md first, then inspect the current homepage-related files before making changes. ## ez a promt codexnek kell majd néha néha ha már vagy bezártam és eltűnt a kontextus vagy elérte a limitet.
