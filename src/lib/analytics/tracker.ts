"use client"

import { analyticsConfig } from "@/lib/analytics/config"
import type {
  PublicAnalyticsEventName,
  PublicAnalyticsEventPayload,
} from "@/lib/analytics/public-events"
import { buildPublicAnalyticsPayload } from "@/lib/analytics/reporting"
import { hasAnalyticsConsent } from "@/lib/privacy/consent"

declare global {
  type GtagFunction = {
    (
      command: "event",
      eventName: string,
      params?: Record<string, unknown>
    ): void
    (
      command: "config",
      targetId: string,
      params?: Record<string, unknown>
    ): void
    (command: "js", date: Date): void
  }

  interface Window {
    dataLayer?: Array<Record<string, unknown> | IArguments | unknown[]>
    gtag?: GtagFunction
  }
}

let isAnalyticsReady = false
const maxQueuedEvents = 50
const queuedEvents: Array<{
  eventName: PublicAnalyticsEventName
  payload: Record<string, string | number | boolean | null>
}> = []

function dispatchToAnalyticsProvider(
  eventName: PublicAnalyticsEventName,
  payload: Record<string, string | number | boolean | null>
) {
  if (analyticsConfig.mode === "gtm" && Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: eventName,
      ...payload,
    })
    return true
  }

  if (
    analyticsConfig.mode === "ga4" &&
    analyticsConfig.gaMeasurementId &&
    typeof window.gtag === "function"
  ) {
    window.gtag("event", eventName, payload)
    return true
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: eventName,
      ...payload,
    })
    return true
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, payload)
    return true
  }

  return false
}

export function markAnalyticsReady() {
  if (typeof window === "undefined" || isAnalyticsReady) {
    return
  }

  isAnalyticsReady = true

  while (queuedEvents.length > 0) {
    const queuedEvent = queuedEvents.shift()

    if (!queuedEvent) {
      continue
    }

    dispatchToAnalyticsProvider(queuedEvent.eventName, queuedEvent.payload)
  }
}

export function resetAnalyticsRuntime() {
  isAnalyticsReady = false
  queuedEvents.length = 0
}

export function trackPublicEvent(
  eventName: PublicAnalyticsEventName,
  payload: PublicAnalyticsEventPayload = {}
) {
  if (typeof window === "undefined") {
    return
  }

  if (analyticsConfig.mode !== "none" && !hasAnalyticsConsent()) {
    return
  }

  const normalizedPayload = buildPublicAnalyticsPayload(eventName, payload)

  if (analyticsConfig.mode !== "none" && !isAnalyticsReady) {
    if (queuedEvents.length >= maxQueuedEvents) {
      queuedEvents.shift()
    }

    queuedEvents.push({
      eventName,
      payload: normalizedPayload,
    })
    return
  }

  if (dispatchToAnalyticsProvider(eventName, normalizedPayload)) {
    return
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics]", eventName, normalizedPayload)
  }
}
