import type { Metadata } from "next"

import { getAppBaseUrl } from "@/lib/config/server-env"
import {
  defaultSiteDescription,
  getAbsoluteUrl,
  getDefaultOpenGraphImages,
  siteCategory,
  siteLocale,
  siteName,
} from "@/lib/seo/site"

export function buildPageMetadata({
  title,
  description,
  path,
  openGraphTitle,
  openGraphDescription,
}: {
  title: string
  description: string
  path: string
  openGraphTitle?: string
  openGraphDescription?: string
}): Metadata {
  const resolvedOpenGraphTitle = openGraphTitle ?? title
  const resolvedOpenGraphDescription = openGraphDescription ?? description

  return {
    title,
    description,
    category: siteCategory,
    creator: siteName,
    publisher: siteName,
    alternates: {
      canonical: getAbsoluteUrl(path),
    },
    openGraph: {
      type: "website",
      locale: siteLocale,
      siteName,
      url: getAbsoluteUrl(path),
      title: resolvedOpenGraphTitle,
      description: resolvedOpenGraphDescription,
      images: getDefaultOpenGraphImages(),
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedOpenGraphTitle,
      description: resolvedOpenGraphDescription,
      images: getDefaultOpenGraphImages().map((image) => image.url),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  }
}

export function buildRootMetadata(): Metadata {
  return {
    metadataBase: getAppBaseUrl(),
    applicationName: siteName,
    creator: siteName,
    publisher: siteName,
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: defaultSiteDescription,
    category: siteCategory,
    alternates: {
      canonical: getAbsoluteUrl("/"),
    },
    openGraph: {
      type: "website",
      locale: siteLocale,
      siteName,
      url: getAbsoluteUrl("/"),
      title: siteName,
      description: defaultSiteDescription,
      images: getDefaultOpenGraphImages(),
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: defaultSiteDescription,
      images: getDefaultOpenGraphImages().map((image) => image.url),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  }
}
