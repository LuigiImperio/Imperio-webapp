import {
  businessAlternateName,
  businessEmail,
  businessLogoPath,
  businessName,
  businessPhone,
  defaultSocialImageAlt,
  defaultSocialImagePath,
} from "@/lib/business"
import {
  homepageStructuredDescription,
  publicBusinessScopeSummary,
  publicCustomerScopeSummary,
} from "@/lib/contact"
import { getAppBaseUrl } from "@/lib/config/server-env"
import { featuredReferenceProjectImages } from "@/lib/content/reference-project-images"
import { faqItems } from "@/lib/content/faqs"
import { publicLegalPaths } from "@/lib/legal"
import { primaryServiceAreaCities } from "@/lib/service-area"

export const siteName = businessName
export const siteLocale = "hu_HU"
export const siteCategory = "épületgépészet"
export const siteLanguage = "hu-HU"
export const defaultSiteDescription =
  "Az Imperio Gépészet Pécsen és környékén végez vízszerelési, gázszerelési, fűtésszerelési, csőtöréshez kapcsolódó, kazános, hőszivattyús és komplett épületgépészeti kivitelezési munkákat."

export const defaultSiteKeywords = [
  "épületgépészet Pécs",
  "épületgépész Pécs",
  "vízszerelés Pécs",
  "gázszerelés Pécs",
  "fűtésszerelés Pécs",
  "csőtörés Pécs",
  "kazánjavítás Pécs",
  "hőszivattyú telepítés Pécs",
] as const

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

const businessIntentSignals = [
  "csőtörés",
  "vízszivárgás",
  "beázás",
  "kazán nem indul",
  "kazáncsere",
  "radiátor nem meleg",
  "padlófűtés nem fűt",
  "csapcsere",
  "lefolyóprobléma",
  "gázkészülék szerelés",
  "hőszivattyú telepítés",
  "családi ház gépészet",
] as const

const baseAreaServedStructuredData = [
  {
    "@type": "AdministrativeArea",
    name: "Pécsi agglomeráció",
  },
  ...primaryServiceAreaCities.map((city) => ({
    "@type": "City",
    name: city,
  })),
  {
    "@type": "AdministrativeArea",
    name: "Baranya megye",
  },
] as const

const budapestProjectAreaStructuredData = {
  "@type": "City",
  name: "Budapest",
  description: "Nagyobb, hitelesen projektjellegű megkeresésekhez.",
} as const

export function getSiteUrl() {
  return getAppBaseUrl()
}

export function getAbsoluteUrl(path: string) {
  return new URL(path, getSiteUrl()).toString()
}

function getStructuredDataId(path: string, fragment: string) {
  return getAbsoluteUrl(`${path}#${fragment}`)
}

function getStructuredDataReference(path: string, fragment: string) {
  return { "@id": getStructuredDataId(path, fragment) }
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

export function mergeMetadataKeywords(
  keywords: readonly string[] | undefined
) {
  return Array.from(
    new Set([...(defaultSiteKeywords as readonly string[]), ...(keywords ?? [])])
  )
}

export function createAreaServedStructuredData({
  includeBudapestProjects = false,
}: {
  includeBudapestProjects?: boolean
} = {}) {
  return includeBudapestProjects
    ? [...baseAreaServedStructuredData, budapestProjectAreaStructuredData]
    : [...baseAreaServedStructuredData]
}

export const serviceAreaStructuredData = createAreaServedStructuredData()

function createOfferCatalogStructuredData() {
  return {
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
        provider: getStructuredDataReference("/", "localbusiness"),
      },
    })),
  }
}

export function createHomepageStructuredData() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": getStructuredDataId("/", "website"),
      name: siteName,
      alternateName: businessAlternateName,
      url: getAbsoluteUrl("/"),
      inLanguage: siteLanguage,
      description: defaultSiteDescription,
      publisher: getStructuredDataReference("/", "localbusiness"),
      about: getStructuredDataReference("/", "localbusiness"),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": getStructuredDataId("/", "webpage"),
      url: getAbsoluteUrl("/"),
      name: "Épületgépészet Pécsen és környékén",
      description: `${publicBusinessScopeSummary} ${publicCustomerScopeSummary}`,
      inLanguage: siteLanguage,
      isPartOf: getStructuredDataReference("/", "website"),
      about: getStructuredDataReference("/", "localbusiness"),
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: getAbsoluteUrl(defaultSocialImagePath),
      },
      keywords: mergeMetadataKeywords([
        "lakossági gépészeti megkeresés",
        "családi ház gépészet",
        "épületgépészeti kivitelezés",
      ]).join(", "),
      mainEntity: getStructuredDataReference("/", "localbusiness"),
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": getStructuredDataId("/", "localbusiness"),
      name: siteName,
      alternateName: businessAlternateName,
      url: getAbsoluteUrl("/"),
      logo: getAbsoluteUrl(businessLogoPath),
      image: getAbsoluteUrl(defaultSocialImagePath),
      email: businessEmail,
      telephone: businessPhone,
      description: `${defaultSiteDescription} ${homepageStructuredDescription}`,
      areaServed: createAreaServedStructuredData(),
      availableLanguage: [siteLanguage],
      contactPoint: [
        {
          "@type": "ContactPoint",
          name: "Kapcsolatfelvétel és megkeresések",
          telephone: businessPhone,
          email: businessEmail,
          contactType: "customer service",
          description:
            "Telefonos és e-mailes kapcsolatfelvétel strukturált víz-, gáz-, fűtési és épületgépészeti megkeresésekhez.",
          availableLanguage: [siteLanguage],
          areaServed: createAreaServedStructuredData(),
        },
      ],
      hasOfferCatalog: createOfferCatalogStructuredData(),
      knowsAbout: [
        ...serviceCatalogItems.map((service) => service.name),
        ...businessIntentSignals,
      ],
      mainEntityOfPage: getStructuredDataReference("/", "webpage"),
    },
    createFaqStructuredData(faqItems),
  ]
}

export function createServiceStructuredData({
  name,
  description,
  path,
  keywords,
  includeBudapestProjects = false,
}: {
  name: string
  description: string
  path: string
  keywords?: readonly string[]
  includeBudapestProjects?: boolean
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": getStructuredDataId(path, "service"),
    name,
    serviceType: name,
    category: siteCategory,
    description,
    url: getAbsoluteUrl(path),
    areaServed: createAreaServedStructuredData({ includeBudapestProjects }),
    availableLanguage: [siteLanguage],
    provider: getStructuredDataReference("/", "localbusiness"),
    keywords: mergeMetadataKeywords(keywords).join(", "),
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
  items: ReadonlyArray<{ name: string; path: string }>,
  id?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    ...(id ? { "@id": id } : {}),
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getAbsoluteUrl(item.path),
    })),
  }
}

export function createServicePageStructuredData({
  pageTitle,
  pageDescription,
  path,
  serviceName,
  serviceDescription,
  faqs,
  breadcrumbName,
  keywords,
  includeBudapestProjects = false,
}: {
  pageTitle: string
  pageDescription: string
  path: string
  serviceName: string
  serviceDescription: string
  faqs: ReadonlyArray<{ question: string; answer: string }>
  breadcrumbName: string
  keywords?: readonly string[]
  includeBudapestProjects?: boolean
}) {
  const pageId = getStructuredDataId(path, "webpage")
  const breadcrumbId = getStructuredDataId(path, "breadcrumb")

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": pageId,
      url: getAbsoluteUrl(path),
      name: pageTitle,
      description: pageDescription,
      inLanguage: siteLanguage,
      isPartOf: getStructuredDataReference("/", "website"),
      about: [
        getStructuredDataReference("/", "localbusiness"),
        getStructuredDataReference(path, "service"),
      ],
      breadcrumb: {
        "@id": breadcrumbId,
      },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: getAbsoluteUrl(defaultSocialImagePath),
      },
      keywords: mergeMetadataKeywords(keywords).join(", "),
      mainEntity: getStructuredDataReference(path, "service"),
    },
    createServiceStructuredData({
      name: serviceName,
      description: serviceDescription,
      path,
      keywords,
      includeBudapestProjects,
    }),
    createFaqStructuredData(faqs),
    createBreadcrumbStructuredData(
      [
        { name: "Főoldal", path: "/" },
        { name: breadcrumbName, path },
      ],
      breadcrumbId
    ),
  ]
}

export const publicSiteImageMap: Partial<
  Record<(typeof publicSitePaths)[number], readonly string[]>
> = {
  "/": [
    defaultSocialImagePath,
    ...featuredReferenceProjectImages.map((image) => image.src),
  ],
  "/szolgaltatasok/csotores-szivargas": [defaultSocialImagePath],
  "/szolgaltatasok/hibabejelentes": [defaultSocialImagePath],
  "/szolgaltatasok/kazancsere": [defaultSocialImagePath],
  "/szolgaltatasok/vizszereles": [defaultSocialImagePath],
  "/szolgaltatasok/futeskorszerusites": [defaultSocialImagePath],
  "/szolgaltatasok/hoszivattyu-telepites": [defaultSocialImagePath],
  "/szolgaltatasok/komplett-epuletgepeszeti-kivitelezes": [
    defaultSocialImagePath,
  ],
}
