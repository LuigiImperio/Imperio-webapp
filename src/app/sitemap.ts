import type { MetadataRoute } from "next"

import { getAbsoluteUrl, publicSitePaths } from "@/lib/seo/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return publicSitePaths.map((path) => ({
    url: getAbsoluteUrl(path),
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.8,
  }))
}
