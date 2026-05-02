import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { canonicalProductionHosts, getCanonicalRequestUrl } from "@/lib/seo/domain"

export function proxy(request: NextRequest) {
  const requestUrl = new URL(request.url)

  if (!canonicalProductionHosts.has(requestUrl.hostname)) {
    return NextResponse.next()
  }

  const canonicalUrl = getCanonicalRequestUrl(requestUrl)

  if (canonicalUrl.toString() === requestUrl.toString()) {
    return NextResponse.next()
  }

  return NextResponse.redirect(canonicalUrl, 308)
}
