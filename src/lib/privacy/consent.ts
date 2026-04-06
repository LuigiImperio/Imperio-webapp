export const consentStorageKey = "imperio-cookie-consent"
export const consentRecordVersion = 1

export type ConsentPreferences = {
  necessary: true
  analytics: boolean
}

export type ConsentRecord = {
  version: number
  updatedAt: string
  preferences: ConsentPreferences
}

export const defaultConsentPreferences: ConsentPreferences = {
  necessary: true,
  analytics: false,
}

let runtimeConsentPreferences: ConsentPreferences = defaultConsentPreferences

export function normalizeConsentPreferences(
  preferences?: Partial<ConsentPreferences> | null
): ConsentPreferences {
  return {
    necessary: true,
    analytics: Boolean(preferences?.analytics),
  }
}

export function createConsentRecord(
  preferences?: Partial<ConsentPreferences> | null
): ConsentRecord {
  return {
    version: consentRecordVersion,
    updatedAt: new Date().toISOString(),
    preferences: normalizeConsentPreferences(preferences),
  }
}

export function parseConsentRecord(rawValue: string | null): ConsentRecord | null {
  if (!rawValue) {
    return null
  }

  try {
    const parsedValue: unknown = JSON.parse(rawValue)

    if (!parsedValue || typeof parsedValue !== "object") {
      return null
    }

    const candidate = parsedValue as Partial<ConsentRecord>

    return {
      version:
        typeof candidate.version === "number"
          ? candidate.version
          : consentRecordVersion,
      updatedAt:
        typeof candidate.updatedAt === "string"
          ? candidate.updatedAt
          : new Date(0).toISOString(),
      preferences: normalizeConsentPreferences(candidate.preferences),
    }
  } catch {
    return null
  }
}

export function serializeConsentRecord(record: ConsentRecord) {
  return JSON.stringify(record)
}

export function readStoredConsent(): ConsentRecord | null {
  if (typeof window === "undefined") {
    return null
  }

  return parseConsentRecord(window.localStorage.getItem(consentStorageKey))
}

export function persistConsent(record: ConsentRecord) {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(
    consentStorageKey,
    serializeConsentRecord(record)
  )
}

export function setRuntimeConsentPreferences(preferences: ConsentPreferences) {
  runtimeConsentPreferences = normalizeConsentPreferences(preferences)
}

export function getRuntimeConsentPreferences() {
  return runtimeConsentPreferences
}

export function hasAnalyticsConsent() {
  return runtimeConsentPreferences.analytics
}
