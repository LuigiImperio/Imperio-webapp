import {
  publicContactResponseSummary,
  publicServiceAreaExtendedSummary,
  publicServiceAreaSummary,
  publicUrgentContactSummary,
} from "@/lib/contact"

export const faqItems = [
  {
    question: "Hogyan működik a strukturált megkeresés?",
    answer:
      "A kiválasztott szolgáltatás oldalán rövid, lépésenként felépített űrlap segít összegyűjteni a legfontosabb műszaki és kapcsolattartási adatokat. A folyamat gyakorlati célja, hogy a következő egyeztetés rendezettebb alapból indulhasson, nem pedig az, hogy feleslegesen hosszú legyen.",
  },
  {
    question: "Milyen adatokat érdemes megadni?",
    answer:
      "Nem szükséges, hogy az első körben minden részlet ismert legyen. A feladat rövid leírása, a sürgősség, valamint az irányítószám és a település már sokat segít a pontosabb előkészítésben. A teljes, pontos cím általában csak később szükséges, ha a munka és a további egyeztetés ezt indokolja.",
  },
  {
    question: "Mikor lehet számítani kapcsolatfelvételre?",
    answer:
      `${publicContactResponseSummary} ${publicUrgentContactSummary}`,
  },
  {
    question:
      "Kihez érdemes fordulni, ha nem meleg a radiátor vagy nem indul a kazán?",
    answer:
      "Ha a probléma egyértelműen a kazán működéséhez kapcsolódik, a kazános megkeresés ad tisztább indulást. Ha inkább a teljes fűtési rendszer, a radiátorok vagy a padlófűtés működése a kérdés, a fűtési oldal a jobb belépési pont. Bizonytalan vagy sürgős helyzetnél a hibabejelentés a leggyorsabb út.",
  },
  {
    question: "Mit érdemes tenni, ha csőtörés, szivárgás vagy beázás látszik?",
    answer:
      "Érdemes röviden jelezni, hogy aktív-e még a szivárgás, melyik terület érintett, és sikerült-e elzárni a vizet. Ha a helyzet sürgős, a csőtörés / szivárgás oldal vagy a hibabejelentés segít a leggyorsabban rendezett formában elindítani az egyeztetést.",
  },
  {
    question: "Mi történik a képfeltöltés után?",
    answer:
      "A csatolt képek a megkeresés részévé válnak, így a helyszín vagy a probléma jellege jobban átlátható már az első áttekintéskor. Ez segíthet abban, hogy a következő kapcsolatfelvétel kevesebb pontosító körrel induljon. A képfeltöltés mindenhol opcionális.",
  },
  {
    question:
      "Milyen munkák tartozhatnak a víz-, gáz- és fűtésszerelési megkeresésekhez?",
    answer:
      "A tipikus lakossági megkeresések közé tartozhat a csapcsere, szanitercsere, lefolyó körüli probléma, vízvezeték-javítás, gázvezeték- vagy gázkészülékhez kapcsolódó munka, radiátorhiba, padlófűtéses panasz vagy teljes fűtési rendszerrel kapcsolatos kérdés.",
  },
  {
    question: "Mely területeken vállalunk munkát?",
    answer:
      `${publicServiceAreaSummary} ${publicServiceAreaExtendedSummary} Más településekről érkező megkeresést is rögzítünk, és a munka jellege alapján jelezzük a lehetőségeket, illetve az esetleges kiszállási feltételeket.`,
  },
  {
    question:
      "Komplett felújításnál, családi ház gépészetnél vagy nagyobb budapesti projektnél is lehet megkeresést indítani?",
    answer:
      "Igen. Ha a feladat nem egyetlen javítás, hanem nagyobb felújítás, komplett rendszerkiépítés vagy összetettebb épületgépészeti kivitelezés, a komplett gépészeti megkeresés a legjobb indulás. Budapesti helyszín főként nagyobb, hitelesen projektjellegű munkáknál releváns.",
  },
] as const
