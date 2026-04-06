"use client"

import { SlidersHorizontal } from "lucide-react"

import { useConsent } from "@/components/privacy/consent-context"

export function ConsentPreferencesButton() {
  const {
    requiresConsent,
    hasResolved,
    hasDecision,
    isPreferencesOpen,
    openPreferences,
  } = useConsent()

  if (!requiresConsent || !hasResolved || !hasDecision || isPreferencesOpen) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom)+1rem)] sm:px-6 sm:pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
      <div className="mx-auto flex max-w-7xl justify-end sm:justify-start">
        <button
          aria-label="Sütibeállítások"
          className="group pointer-events-auto relative inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(24,24,27,0.9),rgba(9,9,11,0.94))] text-zinc-300 shadow-[0_12px_28px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md transition-all duration-300 hover:border-[rgba(232,208,160,0.2)] hover:text-[#f0dfbe] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(232,208,160,0.22)] sm:size-11"
          title="Sütibeállítások"
          type="button"
          onClick={openPreferences}
        >
          <SlidersHorizontal className="size-[1.05rem]" />
          <span className="sr-only">Sütibeállítások</span>
          <span className="pointer-events-none absolute left-full ml-3 hidden -translate-x-1 rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(24,24,27,0.96),rgba(9,9,11,0.98))] px-3 py-1.5 text-xs font-medium whitespace-nowrap text-zinc-200 opacity-0 shadow-[0_14px_32px_rgba(0,0,0,0.28)] transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 sm:block">
            Sütibeállítások
          </span>
        </button>
      </div>
    </div>
  )
}
