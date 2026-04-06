"use client"

import { createContext, useContext } from "react"

import type {
  ConsentPreferences,
  ConsentRecord,
} from "@/lib/privacy/consent"

export type ConsentContextValue = {
  requiresConsent: boolean
  consentRecord: ConsentRecord | null
  preferences: ConsentPreferences
  hasResolved: boolean
  hasDecision: boolean
  isPreferencesOpen: boolean
  acceptAll: () => void
  acceptNecessaryOnly: () => void
  savePreferences: (preferences: Partial<ConsentPreferences>) => void
  openPreferences: () => void
  closePreferences: () => void
}

export const ConsentContext = createContext<ConsentContextValue | null>(null)

export function useConsent() {
  const context = useContext(ConsentContext)

  if (!context) {
    throw new Error("useConsent must be used within ConsentProvider")
  }

  return context
}
