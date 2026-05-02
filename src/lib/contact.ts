import {
  businessEmail,
  businessPhone,
  businessPhoneDisplay,
} from "@/lib/business"
import { supportedServiceAreaShortLabel } from "@/lib/service-area"

export const publicBusinessScopeSummary =
  "Az Imperio Gépészet Pécsen és környékén végez vízszerelési, gázszerelési, fűtésszerelési, csőtöréshez kapcsolódó, kazános, hőszivattyús és komplett épületgépészeti megkeresésekhez illeszkedő munkákat."

export const publicCustomerScopeSummary =
  "A weboldal lakások, családi házak, felújítások, új rendszerkiépítések és hitelesen projektjellegű, nagyobb gépészeti munkák induló egyeztetését támogatja."

export const homepageContactTitle =
  "Kapcsolatfelvétel, szolgáltatási terület és indulási irányok"

export const homepageContactIntro =
  `${publicBusinessScopeSummary} ${publicCustomerScopeSummary} Ha a feladat már körvonalazódott, a megfelelő szolgáltatásoldalról indított megkeresés adja a legtisztább indulást.`

export const publicDirectContactIntro =
  "Ha a feladat már beazonosítható, a szolgáltatásoldali megkeresés a legjobb kiindulópont. Rövid közvetlen egyeztetéshez az alábbi elérhetőségek használhatók."

export const publicServiceAreaSummary = `Elsődleges szolgáltatási területünk ${supportedServiceAreaShortLabel}. Budapest esetén elsősorban nagyobb projektek vállalhatók, egyedi egyeztetéssel.`

export const publicServiceAreaExtendedSummary =
  "Pécs mellett a közeli baranyai települések, például Kozármisleny, Pellérd, Keszü, Gyód, Orfű, Abaliget, Hosszúhetény és Komló felől érkező megkeresések is természetes helyi lefedésként jelennek meg."

export const publicContactResponseSummary =
  "A beérkezett megkeresést a feladat és a helyszín alapján nézzük át, majd telefonon vagy e-mailben jelezzük a következő egyeztetési lépést."

export const publicUrgentContactSummary =
  "Sürgős hibánál a hibabejelentés a leggyorsabb belépési pont."

export const homepageMetaDescription =
  "Épületgépészet, víz-, gáz- és fűtésszerelés, csőtörés, kazánjavítás, hőszivattyú és komplett gépészeti megkeresések Pécsen és környékén, lakossági és projektjellegű feladatokhoz."

export const homepageStructuredDescription = `${publicBusinessScopeSummary} ${publicCustomerScopeSummary} ${publicServiceAreaSummary} ${publicContactResponseSummary}`

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
    href: "/#szolgaltatasok",
    linkLabel: "Szolgáltatásoldalak áttekintése",
  },
  {
    label: "Nagyobb projektek",
    value: "Budapest",
    description:
      "Összetettebb épületgépészeti és kivitelezési feladatokhoz, külön egyeztetéssel.",
    href: "/szolgaltatasok/komplett-epuletgepeszeti-kivitelezes",
    linkLabel: "Projektoldal megnyitása",
  },
] as const

export const publicContactProcessSteps = [
  "Válassza ki a megfelelő szolgáltatást, vagy írjon közvetlenül.",
  "Átnézzük a feladatot és a helyszínt, szükség esetén pontosítunk.",
  "Telefonon vagy e-mailben jelezzük a következő lépést.",
] as const
