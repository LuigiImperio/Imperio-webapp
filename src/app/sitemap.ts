import type { MetadataRoute } from "next"

import {
  getAbsoluteUrl,
  publicSiteImageMap,
  publicSitePaths,
} from "@/lib/seo/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return publicSitePaths.map((path) => ({
    url: getAbsoluteUrl(path),
    lastModified,
    images: publicSiteImageMap[path]?.map((imagePath) => getAbsoluteUrl(imagePath)),
    changeFrequency:
      path === "/"
        ? "weekly"
        : path === "/szolgaltatasok/hibabejelentes" ||
            path === "/szolgaltatasok/csotores-szivargas"
          ? "weekly"
          : path.startsWith("/szolgaltatasok/")
            ? "monthly"
            : "yearly",
    priority:
      path === "/"
        ? 1
        : path === "/szolgaltatasok/hibabejelentes"
          ? 0.95
          : path.startsWith("/szolgaltatasok/")
            ? 0.9
            : 0.3,
  }))
}
