import type { MetadataRoute } from "next"

import { getAbsoluteUrl, publicSitePaths } from "@/lib/seo/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return publicSitePaths.map((path) => ({
    url: getAbsoluteUrl(path),
    lastModified,
    changeFrequency:
      path === "/"
        ? "weekly"
        : path.startsWith("/szolgaltatasok/")
          ? "monthly"
          : "yearly",
    priority:
      path === "/" ? 1 : path.startsWith("/szolgaltatasok/") ? 0.9 : 0.3,
  }))
}
