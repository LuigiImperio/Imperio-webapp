import {
  businessAlternateName,
  businessEmail,
  businessLogoPath,
  businessName,
  businessPhone,
  defaultSocialImageAlt,
  defaultSocialImagePath,
} from "@/lib/business"
import { getAppBaseUrl } from "@/lib/config/server-env"
import { faqItems } from "@/lib/content/faqs"
import { publicLegalPaths } from "@/lib/legal"
import { supportedServiceAreaCities, supportedServiceAreaLabel } from "@/lib/service-area"

export const siteName = businessName
export const siteLocale = "hu_HU"
export const siteCategory = "épületgépészet"
export const defaultSiteDescription =
  "Épületgépészeti megoldások Pécsen és agglomerációjában, valamint nagyobb budapesti projektekhez: víz-, gáz- és fűtéstechnikai feladatok, kazános megkeresések, hőszivattyús előkészítés és hibabejelentés."

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
    name: "Csőtörés / szivárgás",
    description:
      "Gyors helyzetfelmérésre és célzott hibabejelentésre szolgáló megkeresési oldal csőtöréshez és szivárgáshoz.",
    path: "/szolgaltatasok/csotores-szivargas",
  },
  {
    name: "Hőszivattyú telepítés",
    description:
      "Előminősítő megkeresés hőszivattyús projektekhez, műszaki háttérrel és helyszíni alapadatokkal.",
    path: "/szolgaltatasok/hoszivattyu-telepites",
  },
  {
    name: "Kazánjavítás / kazáncsere",
    description:
      "Kazánjavításhoz és kazáncseréhez kialakított megkeresési oldal műszaki és kapcsolati adatokkal.",
    path: "/szolgaltatasok/kazancsere",
  },
  {
    name: "Fűtési rendszerek",
    description:
      "Fűtésszerelési, karbantartási és optimalizálási feladatok strukturált megkeresése.",
    path: "/szolgaltatasok/futeskorszerusites",
  },
  {
    name: "Hibabejelentés",
    description:
      "Gyors hibajelzés sürgősséggel, rövid leírással és opcionális képfeltöltéssel.",
    path: "/szolgaltatasok/hibabejelentes",
  },
  {
    name: "Komplett épületgépészeti kivitelezés",
    description:
      "Komplexebb felújítási és kivitelezési projektek strukturált megkeresése.",
    path: "/szolgaltatasok/komplett-epuletgepeszeti-kivitelezes",
  },
  {
    name: "Víz- és gázszerelés",
    description:
      "Víz- és gázszerelési munkákhoz készült megkeresési oldal sürgősséggel és alapadatokkal.",
    path: "/szolgaltatasok/vizszereles",
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

export const serviceAreaStructuredData = supportedServiceAreaCities.map((city) => ({
  "@type": "City",
  name: city,
}))

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
      description: `${defaultSiteDescription} Kiemelt szolgáltatási terület: ${supportedServiceAreaLabel}.`,
      areaServed: serviceAreaStructuredData,
      availableLanguage: ["hu-HU"],
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: businessPhone,
          email: businessEmail,
          contactType: "customer service",
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
    },
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
