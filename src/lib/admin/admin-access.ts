import "server-only"

import { cookies } from "next/headers"

import {
  adminAccessCookieName,
  createAdminAccessCookieValue,
} from "@/lib/admin/admin-session"
import { getOptionalServerEnv } from "@/lib/config/server-env"

export async function resolveAdminAccessFromCookie() {
  const cookieStore = await cookies()
  const expectedToken = getOptionalServerEnv("ADMIN_ACCESS_TOKEN")
  const providedCookieValue = cookieStore.get(adminAccessCookieName)?.value
  const expectedCookieValue = expectedToken
    ? await createAdminAccessCookieValue(expectedToken)
    : undefined
  const hasConfiguredProtection = Boolean(expectedToken)
  const hasProvidedToken = Boolean(providedCookieValue)
  const hasAccess =
    hasConfiguredProtection &&
    hasProvidedToken &&
    providedCookieValue === expectedCookieValue

  return {
    hasConfiguredProtection,
    hasAccess,
    reason: !hasConfiguredProtection
      ? "missing_config"
      : !hasProvidedToken
        ? "missing_token"
        : hasAccess
          ? "authorized"
          : "invalid_token",
  }
}
