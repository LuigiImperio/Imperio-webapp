import {
  businessAlternateName,
  businessEmail,
  businessLogoPath,
  businessName,
  businessPhone,
  defaultSocialImageAlt,
  defaultSocialImagePath,
} from "@/lib/business"
import { homepageStructuredDescription } from "@/lib/contact"
import { getAppBaseUrl } from "@/lib/config/server-env"
import { faqItems } from "@/lib/content/faqs"
import { publicLegalPaths } from "@/lib/legal"
import { primaryServiceAreaCities } from "@/lib/service-area"

export const siteName = businessName
export const siteLocale = "hu_HU"
export const siteCategory = "épületgépészet"
export const defaultSiteDescription =
  "Épületgépészeti megoldások Pécsen és környékén: vízszerelés, gázszerelés, fűtésszerelés, csőtörés, kazánjavítás, hőszivattyús előkészítés, hibabejelentés és komplett gépészeti kivitelezés."

export const publicSitePaths = [
  "/",
  ...publicLegalPaths,
  "/szolgaltatasok/csotores-szivargas",
  "/szolgaltatasok/hoszivattyu-telepites",
  "/szolgaltatasok/kazancsere",
  "/szolgaltatasok/futeskorszerusites",
  "/szolgaltatasok/hibabejelentes",
  "/szolgaltatasok/komplett-epuletgepeszeti-kivitelezes",
  "/szolgaltatasok/vizszereles",
] as const

const serviceCatalogItems = [
  {
    name: "Csőtörés, vízszivárgás és beázás",
    description:
      "Gyors helyzetfelmérés csőtöréshez, vízszivárgáshoz, nedvesedéshez és beázási helyzetekhez.",
    path: "/szolgaltatasok/csotores-szivargas",
  },
  {
    name: "Sürgős gépészeti hibabejelentés",
    description:
      "Gyors bejelentési útvonal sürgős víz-, gáz- és fűtési problémákhoz, leállásokhoz és bizonytalan hibákhoz.",
    path: "/szolgaltatasok/hibabejelentes",
  },
  {
    name: "Kazánjavítás, kazáncsere és kazános hibák",
    description:
      "Kazánjavításhoz, kazáncseréhez, hibakódos vagy nem induló kazánokhoz készült megkeresési oldal.",
    path: "/szolgaltatasok/kazancsere",
  },
  {
    name: "Fűtésszerelés, radiátor és padlófűtés",
    description:
      "Radiátoros, padlófűtéses és központi fűtési rendszerekhez kapcsolódó javítási, karbantartási és korszerűsítési megkeresés.",
    path: "/szolgaltatasok/futeskorszerusites",
  },
  {
    name: "Vízszerelés és gázszerelés",
    description:
      "Csapcsere, lefolyóprobléma, szaniterek, vízvezetékek, gázvezetékek és gázkészülékhez kapcsolódó munkák strukturált megkeresése.",
    path: "/szolgaltatasok/vizszereles",
  },
  {
    name: "Hőszivattyú telepítés és rendszerkiépítés",
    description:
      "Hőszivattyús projektek előkészítése új építéshez, rendszerátalakításhoz és korszerűsítési igényekhez.",
    path: "/szolgaltatasok/hoszivattyu-telepites",
  },
  {
    name: "Komplett épületgépészeti kivitelezés és felújítás",
    description:
      "Komplex gépészeti kivitelezési oldal családi házhoz, felújításhoz, fürdőszobai gépészeti munkához és több rendszert érintő projektekhez.",
    path: "/szolgaltatasok/komplett-epuletgepeszeti-kivitelezes",
  },
  {
    name: "Csapcsere, lefolyóprobléma és szanitercsere",
    description:
      "Hétköznapi lakossági vízszerelési panaszok és javítási igények rendezett megkeresése.",
    path: "/szolgaltatasok/vizszereles",
  },
  {
    name: "Radiátor nem meleg, levegős rendszer, padlófűtés nem fűt",
    description:
      "Komfort- és működési panaszokhoz kapcsolódó fűtésszerelési és beszabályozási megkeresések.",
    path: "/szolgaltatasok/futeskorszerusites",
  },
  {
    name: "Családi ház gépészet és fürdőszobai gépészeti munka",
    description:
      "Projektalapú, teljesebb épületgépészeti kivitelezések és felújítások megkeresése.",
    path: "/szolgaltatasok/komplett-epuletgepeszeti-kivitelezes",
  },
] as const

export function getSiteUrl() {
  return getAppBaseUrl()
}

export function getAbsoluteUrl(path: string) {
  return new URL(path, getSiteUrl()).toString()
}

export function getDefaultOpenGraphImages() {
  return [
    {
      url: getAbsoluteUrl(defaultSocialImagePath),
      width: 2560,
      height: 1920,
      alt: defaultSocialImageAlt,
    },
  ]
}

export const serviceAreaStructuredData = [
  ...primaryServiceAreaCities.map((city) => ({
    "@type": "City",
    name: city,
  })),
  {
    "@type": "AdministrativeArea",
    name: "Baranya megye",
  },
] as const

export function createHomepageStructuredData() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteName,
      alternateName: businessAlternateName,
      url: getAbsoluteUrl("/"),
      inLanguage: "hu-HU",
      description: defaultSiteDescription,
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: siteName,
      alternateName: businessAlternateName,
      url: getAbsoluteUrl("/"),
      logo: getAbsoluteUrl(businessLogoPath),
      image: getAbsoluteUrl(defaultSocialImagePath),
      email: businessEmail,
      telephone: businessPhone,
      description: `${defaultSiteDescription} ${homepageStructuredDescription}`,
      areaServed: serviceAreaStructuredData,
      availableLanguage: ["hu-HU"],
      contactPoint: [
        {
          "@type": "ContactPoint",
          name: "Kapcsolatfelvétel és megkeresések",
          telephone: businessPhone,
          email: businessEmail,
          contactType: "customer service",
          description:
            "Telefonos és e-mailes kapcsolatfelvétel strukturált víz-, gáz-, fűtési és épületgépészeti megkeresésekhez.",
          availableLanguage: ["hu-HU"],
          areaServed: serviceAreaStructuredData,
        },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Épületgépészeti szolgáltatások",
        itemListElement: serviceCatalogItems.map((service, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Service",
            name: service.name,
            url: getAbsoluteUrl(service.path),
            description: service.description,
          },
        })),
      },
      knowsAbout: serviceCatalogItems.map((service) => service.name),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ]
}

export function createServiceStructuredData({
  name,
  description,
  path,
}: {
  name: string
  description: string
  path: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType: name,
    category: siteCategory,
    description,
    url: getAbsoluteUrl(path),
    areaServed: serviceAreaStructuredData,
    availableLanguage: ["hu-HU"],
    provider: {
      "@type": "LocalBusiness",
      name: siteName,
      alternateName: businessAlternateName,
      url: getAbsoluteUrl("/"),
      email: businessEmail,
      telephone: businessPhone,
      logo: getAbsoluteUrl(businessLogoPath),
      image: getAbsoluteUrl(defaultSocialImagePath),
      description: defaultSiteDescription,
    },
  }
}

export function createFaqStructuredData(
  items: ReadonlyArray<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}

export function createBreadcrumbStructuredData(
  items: ReadonlyArray<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getAbsoluteUrl(item.path),
    })),
  }
}
