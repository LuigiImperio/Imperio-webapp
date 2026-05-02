import type { Metadata } from "next"

import { getAppBaseUrl } from "@/lib/config/server-env"
import {
  defaultSiteDescription,
  defaultSiteKeywords,
  getAbsoluteUrl,
  getDefaultOpenGraphImages,
  mergeMetadataKeywords,
  siteCategory,
  siteLocale,
  siteName,
} from "@/lib/seo/site"

export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
  openGraphTitle,
  openGraphDescription,
}: {
  title: string
  description: string
  path: string
  keywords?: readonly string[]
  openGraphTitle?: string
  openGraphDescription?: string
}): Metadata {
  const resolvedOpenGraphTitle = openGraphTitle ?? title
  const resolvedOpenGraphDescription = openGraphDescription ?? description

  return {
    title,
    description,
    keywords: mergeMetadataKeywords(keywords),
    category: siteCategory,
    creator: siteName,
    publisher: siteName,
    authors: [{ name: siteName, url: getAbsoluteUrl("/") }],
    referrer: "origin-when-cross-origin",
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
    authors: [{ name: siteName, url: getAbsoluteUrl("/") }],
    referrer: "origin-when-cross-origin",
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: defaultSiteDescription,
    keywords: [...defaultSiteKeywords],
    category: siteCategory,
    manifest: "/site.webmanifest",
    icons: {
      shortcut: ["/favicon.ico"],
      icon: [
        {
          url: "/favicon.ico",
          type: "image/x-icon",
          sizes: "48x48",
        },
        {
          url: "/favicon-48x48.png",
          type: "image/png",
          sizes: "48x48",
        },
        {
          url: "/favicon-96x96.png",
          type: "image/png",
          sizes: "96x96",
        },
      ],
      apple: [
        {
          url: "/apple-touch-icon.png",
          type: "image/png",
          sizes: "180x180",
        },
      ],
    },
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
