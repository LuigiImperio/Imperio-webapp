import { getOptionalPublicEnv } from "@/lib/config/public-env"

const gtmId = getOptionalPublicEnv("NEXT_PUBLIC_GTM_ID") ?? ""
const gaMeasurementId =
  getOptionalPublicEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID") ?? ""

if (
  process.env.NODE_ENV !== "production" &&
  gtmId &&
  gaMeasurementId
) {
  console.warn(
    "[analytics] A NEXT_PUBLIC_GTM_ID és a NEXT_PUBLIC_GA_MEASUREMENT_ID egyszerre van beállítva. A kliensoldali mérés elsődlegesen a GTM irányt fogja használni."
  )
}

export const analyticsConfig = {
  gtmId,
  gaMeasurementId,
  mode: gtmId ? "gtm" : gaMeasurementId ? "ga4" : "none",
} as const

export function isAnalyticsConfigured() {
  return analyticsConfig.mode !== "none"
}
