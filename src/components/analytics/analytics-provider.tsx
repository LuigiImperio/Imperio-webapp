"use client"

import Script from "next/script"
import { Suspense, useEffect, useState } from "react"

import { PageviewTracker } from "@/components/analytics/pageview-tracker"
import { useConsent } from "@/components/privacy/consent-context"
import { analyticsConfig } from "@/lib/analytics/config"
import { markAnalyticsReady } from "@/lib/analytics/tracker"

export function AnalyticsProvider() {
  const { hasResolved, preferences, requiresConsent } = useConsent()
  const [isProviderReady, setIsProviderReady] = useState(false)
  const shouldLoadAnalytics =
    !requiresConsent || (hasResolved && preferences.analytics)

  useEffect(() => {
    if (!shouldLoadAnalytics) {
      return
    }

    window.dataLayer = window.dataLayer || []

    if (analyticsConfig.mode === "ga4" && typeof window.gtag !== "function") {
      window.gtag = ((...args: unknown[]) => {
        window.dataLayer?.push(args)
      }) as Window["gtag"]
    }
  }, [shouldLoadAnalytics])

  if (analyticsConfig.mode === "none" || !shouldLoadAnalytics) {
    return null
  }

  if (analyticsConfig.mode === "gtm") {
    return (
      <>
        <Script
          id="gtm-script"
          src={`https://www.googletagmanager.com/gtm.js?id=${analyticsConfig.gtmId}`}
          strategy="afterInteractive"
          onLoad={() => {
            markAnalyticsReady()
            setIsProviderReady(true)
          }}
          onError={() => {
            markAnalyticsReady()
            setIsProviderReady(true)
          }}
        />
        {isProviderReady ? (
          <Suspense fallback={null}>
            <PageviewTracker />
          </Suspense>
        ) : null}
      </>
    )
  }

  return (
    <>
      <Script
        id="ga4-script"
        src={`https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.gaMeasurementId}`}
        strategy="afterInteractive"
        onLoad={() => {
          if (typeof window.gtag === "function") {
            window.gtag("js", new Date())
            window.gtag("config", analyticsConfig.gaMeasurementId, {
              send_page_view: false,
            })
          }

          markAnalyticsReady()
          setIsProviderReady(true)
        }}
        onError={() => {
          markAnalyticsReady()
          setIsProviderReady(true)
        }}
      />
      {isProviderReady ? (
        <Suspense fallback={null}>
          <PageviewTracker />
        </Suspense>
      ) : null}
    </>
  )
}
