import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import {
  adminAccessCookieMaxAgeSeconds,
  adminAccessCookieName,
  adminAccessCookiePath,
  createAdminAccessCookieValue,
  isAdminPath,
} from "@/lib/admin/admin-session"
import { canonicalProductionHosts, getCanonicalRequestUrl } from "@/lib/seo/domain"

function getAdminAccessCookieOptions(requestUrl: URL) {
  const isProductionHost = canonicalProductionHosts.has(requestUrl.hostname)

  return {
    httpOnly: true,
    maxAge: adminAccessCookieMaxAgeSeconds,
    path: adminAccessCookiePath,
    sameSite: "lax" as const,
    secure: requestUrl.protocol === "https:" || isProductionHost,
    ...(isProductionHost ? { domain: ".imperiogepeszet.hu" } : {}),
  }
}

export async function proxy(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const canonicalUrl = getCanonicalRequestUrl(requestUrl)
  const shouldRedirectToCanonical = canonicalUrl.toString() !== requestUrl.toString()

  if (isAdminPath(requestUrl.pathname) && requestUrl.searchParams.has("token")) {
    const providedToken = requestUrl.searchParams.get("token")?.trim()
    const expectedToken = process.env.ADMIN_ACCESS_TOKEN?.trim()
    const redirectUrl = shouldRedirectToCanonical
      ? canonicalUrl
      : new URL(request.url)

    redirectUrl.searchParams.delete("token")

    const response = NextResponse.redirect(redirectUrl)
    const cookieOptions = getAdminAccessCookieOptions(requestUrl)

    if (expectedToken && providedToken === expectedToken) {
      response.cookies.set(
        adminAccessCookieName,
        await createAdminAccessCookieValue(providedToken),
        cookieOptions
      )
    } else {
      response.cookies.set(adminAccessCookieName, "", {
        ...cookieOptions,
        maxAge: 0,
      })
    }

    return response
  }

  if (!canonicalProductionHosts.has(requestUrl.hostname)) {
    return NextResponse.next()
  }

  if (!shouldRedirectToCanonical) {
    return NextResponse.next()
  }

  return NextResponse.redirect(canonicalUrl, 308)
}
