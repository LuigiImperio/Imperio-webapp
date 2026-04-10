"use client"

import Script from "next/script"
import { Suspense, useEffect, useRef, useState } from "react"

import { PageviewTracker } from "@/components/analytics/pageview-tracker"
import { useConsent } from "@/components/privacy/consent-context"
import { analyticsConfig } from "@/lib/analytics/config"
import { markAnalyticsReady } from "@/lib/analytics/tracker"

function ensureAnalyticsQueue() {
  window.dataLayer = window.dataLayer || []

  return window.dataLayer
}

function ensureGtag() {
  ensureAnalyticsQueue()

  if (typeof window.gtag === "function") {
    return window.gtag
  }

  window.gtag = ((...args: unknown[]) => {
    ensureAnalyticsQueue().push(args)
  }) as Window["gtag"]

  return window.gtag
}

export function AnalyticsProvider() {
  const { consentRecord, hasResolved, preferences, requiresConsent } =
    useConsent()
  const [readySessionKey, setReadySessionKey] = useState<string | null>(null)
  const bootstrappedSessionKeyRef = useRef<string | null>(null)
  const shouldLoadAnalytics =
    !requiresConsent || (hasResolved && preferences.analytics)
  const analyticsSessionKey = shouldLoadAnalytics
    ? [
        analyticsConfig.mode,
        analyticsConfig.gtmId,
        analyticsConfig.gaMeasurementId,
        requiresConsent ? consentRecord?.updatedAt ?? "pending-consent" : "always-on",
      ].join(":")
    : null
  const isProviderReady =
    analyticsSessionKey !== null && readySessionKey === analyticsSessionKey

  useEffect(() => {
    if (!analyticsSessionKey) {
      bootstrappedSessionKeyRef.current = null
      return
    }

    ensureAnalyticsQueue()

    if (
      analyticsConfig.mode === "ga4" &&
      analyticsConfig.gaMeasurementId &&
      bootstrappedSessionKeyRef.current !== analyticsSessionKey
    ) {
      const gtag = ensureGtag()

      if (typeof gtag === "function") {
        gtag("js", new Date())
        gtag("config", analyticsConfig.gaMeasurementId, {
          send_page_view: false,
        })
      }

      bootstrappedSessionKeyRef.current = analyticsSessionKey
    }
  }, [analyticsSessionKey])

  function handleProviderReady() {
    if (!analyticsSessionKey) {
      return
    }

    markAnalyticsReady()
    setReadySessionKey(analyticsSessionKey)
  }

  function handleProviderError(scriptName: string) {
    if (analyticsSessionKey) {
      setReadySessionKey((currentReadySessionKey) =>
        currentReadySessionKey === analyticsSessionKey
          ? null
          : currentReadySessionKey
      )
    }

    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[analytics] A(z) ${scriptName} betöltése nem sikerült, ezért a kliensoldali mérés nem aktiválódott.`
      )
    }
  }

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
          onReady={handleProviderReady}
          onError={() => handleProviderError("Google Tag Manager")}
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
        onReady={handleProviderReady}
        onError={() => handleProviderError("Google Analytics")}
      />
      {isProviderReady ? (
        <Suspense fallback={null}>
          <PageviewTracker />
        </Suspense>
      ) : null}
    </>
  )
}
