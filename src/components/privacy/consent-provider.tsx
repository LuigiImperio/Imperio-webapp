"use client"

import { usePathname } from "next/navigation"
import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react"

import { ConsentBanner } from "@/components/privacy/consent-banner"
import {
  ConsentContext,
  type ConsentContextValue,
} from "@/components/privacy/consent-context"
import { ConsentPreferencesButton } from "@/components/privacy/consent-preferences-button"
import {
  createConsentRecord,
  defaultConsentPreferences,
  persistConsent,
  readStoredConsent,
  setRuntimeConsentPreferences,
  type ConsentPreferences,
  type ConsentRecord,
} from "@/lib/privacy/consent"
import { resetAnalyticsRuntime } from "@/lib/analytics/tracker"

const unrestrictedPreferences: ConsentPreferences = {
  necessary: true,
  analytics: true,
}

function subscribeToHydration() {
  return () => {}
}

function getClientHydrationSnapshot() {
  return true
}

function getServerHydrationSnapshot() {
  return false
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [consentRecordOverride, setConsentRecordOverride] = useState<
    ConsentRecord | null | undefined
  >(undefined)
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot
  )
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false)
  const requiresConsent = !pathname?.startsWith("/admin")
  const consentRecord = useMemo(() => {
    if (!requiresConsent || !isHydrated) {
      return null
    }

    if (typeof consentRecordOverride !== "undefined") {
      return consentRecordOverride
    }

    return readStoredConsent()
  }, [consentRecordOverride, isHydrated, requiresConsent])
  const hasResolved = !requiresConsent || isHydrated
  const preferences = useMemo(
    () =>
      requiresConsent
        ? consentRecord?.preferences ?? defaultConsentPreferences
        : unrestrictedPreferences,
    [consentRecord, requiresConsent]
  )

  useEffect(() => {
    setRuntimeConsentPreferences(preferences)

    if (requiresConsent && !preferences.analytics) {
      resetAnalyticsRuntime()
    }
  }, [preferences, requiresConsent])

  function saveConsent(preferencesDraft: Partial<ConsentPreferences>) {
    const nextConsentRecord = createConsentRecord(preferencesDraft)

    persistConsent(nextConsentRecord)
    setConsentRecordOverride(nextConsentRecord)
    setIsPreferencesOpen(false)
  }

  const value = useMemo<ConsentContextValue>(
    () => ({
      requiresConsent,
      consentRecord: consentRecord ?? null,
      preferences,
      hasResolved,
      hasDecision: !requiresConsent || consentRecord !== null,
      isPreferencesOpen,
      acceptAll: () => saveConsent({ analytics: true }),
      acceptNecessaryOnly: () => saveConsent({ analytics: false }),
      savePreferences: saveConsent,
      openPreferences: () => setIsPreferencesOpen(true),
      closePreferences: () => setIsPreferencesOpen(false),
    }),
    [consentRecord, hasResolved, isPreferencesOpen, preferences, requiresConsent]
  )

  return (
    <ConsentContext.Provider value={value}>
      {children}
      {requiresConsent ? <ConsentBanner /> : null}
      <ConsentPreferencesButton />
    </ConsentContext.Provider>
  )
}
