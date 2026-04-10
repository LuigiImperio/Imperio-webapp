import {
  businessEmail,
  businessPhone,
  businessPhoneDisplay,
} from "@/lib/business"
import { supportedServiceAreaShortLabel } from "@/lib/service-area"

export const homepageContactTitle = "Kapcsolatfelvétel Pécsen és környékén"

export const homepageContactIntro =
  "Telefonon és e-mailben is elérhetőek vagyunk, de ha a feladat már körvonalazódott, a megfelelő szolgáltatásoldalról indított megkeresés adja a legtisztább indulást. Víz-, gáz-, fűtés- és tágabb épületgépészeti munkáknál elsődlegesen Pécs és környéke tartozik a fókuszterülethez, nagyobb budapesti projekteknél pedig a feladat jellege alapján egyeztetünk."

export const publicDirectContactIntro =
  "Ha a feladat már beazonosítható, a szolgáltatásoldali megkeresés a legjobb kiindulópont. Közvetlen egyeztetéshez az alábbi elérhetőségek használhatók."

export const publicServiceAreaSummary = `Elsődleges szolgáltatási területünk ${supportedServiceAreaShortLabel}. Budapest esetén elsősorban nagyobb projektek vállalhatók, egyedi egyeztetéssel.`

export const publicServiceAreaExtendedSummary =
  "Pécs mellett a közeli baranyai települések, például Kozármisleny, Pellérd, Keszü, Gyód, Orfű, Abaliget, Hosszúhetény és Komló felől érkező megkeresések is természetes helyi lefedésként jelennek meg."

export const publicContactResponseSummary =
  "A beérkezett megkeresést a feladat és a helyszín alapján nézzük át, majd telefonon vagy e-mailben jelezzük a következő egyeztetési lépést."

export const publicUrgentContactSummary =
  "Sürgős hibánál a hibabejelentés a leggyorsabb belépési pont."

export const homepageMetaDescription =
  "Épületgépészet, vízszerelés, gázszerelés, fűtésszerelés, csőtörés, kazánjavítás és komplett gépészeti megkeresések Pécsen és környékén, strukturált kapcsolatfelvétellel."

export const homepageStructuredDescription = `${publicServiceAreaSummary} ${publicContactResponseSummary}`

export const publicContactChannels = [
  {
    key: "phone",
    label: "Telefon",
    value: businessPhoneDisplay,
    href: `tel:${businessPhone}`,
    description: "Közvetlen egyeztetéshez és rövid pontosításhoz.",
  },
  {
    key: "email",
    label: "E-mail",
    value: businessEmail,
    href: `mailto:${businessEmail}`,
    description:
      "Ha röviden leírná a feladatot, vagy előre elküldené a részleteket.",
  },
] as const

export const publicServiceAreaDetails = [
  {
    label: "Elsődleges körzet",
    value: supportedServiceAreaShortLabel,
    description:
      "Pécs, Kozármisleny, Pellérd, Keszü, Gyód, Orfű, Abaliget, Hosszúhetény, Komló és a közeli baranyai települések felől érkező megkeresések tartoznak ide.",
  },
  {
    label: "Nagyobb projektek",
    value: "Budapest",
    description:
      "Összetettebb épületgépészeti és kivitelezési feladatokhoz, külön egyeztetéssel.",
  },
] as const

export const publicContactProcessSteps = [
  "Válassza ki a megfelelő szolgáltatást, vagy írjon közvetlenül.",
  "Átnézzük a feladatot és a helyszínt, szükség esetén pontosítunk.",
  "Telefonon vagy e-mailben jelezzük a következő lépést.",
] as const
