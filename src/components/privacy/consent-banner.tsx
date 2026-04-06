"use client"

import { ShieldCheck, SlidersHorizontal } from "lucide-react"
import { useEffect, useState } from "react"

import { useConsent } from "@/components/privacy/consent-context"
import { Button } from "@/components/ui/button"

function ConsentPreferencesDialog({
  initialAnalyticsEnabled,
  onClose,
  onAcceptNecessaryOnly,
  onSavePreferences,
}: {
  initialAnalyticsEnabled: boolean
  onClose: () => void
  onAcceptNecessaryOnly: () => void
  onSavePreferences: (analyticsEnabled: boolean) => void
}) {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(
    initialAnalyticsEnabled
  )

  return (
    <div className="fixed inset-0 z-[60] flex items-end bg-black/65 p-2.5 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6">
      <button
        aria-label="Beállítások bezárása"
        className="absolute inset-0"
        type="button"
        onClick={onClose}
      />

      <div className="public-surface-strong relative z-10 max-h-[calc(100dvh-1rem)] w-full max-w-2xl overflow-y-auto overscroll-contain border-[rgba(232,208,160,0.16)] bg-[linear-gradient(180deg,rgba(28,24,18,0.98),rgba(16,14,11,0.98))] p-4 text-white shadow-[0_28px_90px_rgba(0,0,0,0.48)] sm:p-7">
        <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(232,208,160,0.32)] to-transparent" />

        <div className="relative">
          <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.7rem] font-medium tracking-[0.22em] text-[#f0dfbe] uppercase">
            Süti- és adatvédelmi beállítások
          </div>

          <h2 className="mt-4 text-[1.45rem] font-semibold tracking-tight text-white sm:mt-5 sm:text-[2rem]">
            Válassza ki, milyen mérésekhez járul hozzá
          </h2>

          <p className="mt-3.5 max-w-2xl text-[0.92rem] leading-6 text-zinc-300 sm:mt-4 sm:text-sm">
            A szükséges sütik a weboldal alapvető működését támogatják. Az
            analitikai sütik segítenek megérteni, hogyan használják a
            látogatók az oldalt, így ezek kizárólag hozzájárulás után
            aktiválódnak.
          </p>

          <div className="mt-6 space-y-3.5 sm:mt-8 sm:space-y-4">
            <div className="rounded-[1.35rem] border border-white/10 bg-black/20 p-4 sm:rounded-[1.5rem] sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="max-w-xl">
                  <p className="text-base font-semibold text-white">
                    Szükséges sütik
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    Az oldal alapfunkcióihoz és a választott beállítások
                    megőrzéséhez szükségesek, ezért ezek mindig aktívak.
                  </p>
                </div>

                <span className="inline-flex shrink-0 rounded-full border border-[rgba(232,208,160,0.18)] bg-[rgba(200,151,88,0.12)] px-3 py-1 text-xs font-medium text-[#f0dfbe]">
                  Mindig aktív
                </span>
              </div>
            </div>

            <div className="rounded-[1.35rem] border border-white/10 bg-black/20 p-4 sm:rounded-[1.5rem] sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="max-w-xl">
                  <p className="text-base font-semibold text-white">
                    Analitikai sütik
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    Ezek a mérések anonimizált használati információk alapján
                    segítenek finomítani a publikus felületet és a
                    megkeresési folyamatokat.
                  </p>
                </div>

                <button
                  aria-pressed={analyticsEnabled}
                  className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border transition-colors duration-300 ${
                    analyticsEnabled
                      ? "border-[rgba(232,208,160,0.26)] bg-[linear-gradient(135deg,rgba(232,208,160,0.42),rgba(200,151,88,0.34))]"
                      : "border-white/12 bg-white/[0.06]"
                  }`}
                  type="button"
                  onClick={() => setAnalyticsEnabled((current) => !current)}
                >
                  <span
                    className={`h-6 w-6 rounded-full bg-white shadow-[0_8px_18px_rgba(0,0,0,0.28)] transition-transform duration-300 ${
                      analyticsEnabled
                        ? "translate-x-[1.45rem]"
                        : "translate-x-1"
                    }`}
                  />
                  <span className="sr-only">
                    Analitikai sütik engedélyezése
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2.5 sm:mt-7 sm:flex-row sm:justify-end">
            <Button
              type="button"
              size="lg"
              variant="ghost"
              className="min-h-10 rounded-2xl px-4 text-[0.92rem] text-zinc-200 hover:bg-white/[0.06] hover:text-white sm:min-h-11 sm:px-5 sm:text-sm"
              onClick={onClose}
            >
              Mégse
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              className="min-h-10 rounded-2xl border-white/15 bg-white/[0.03] px-4 text-[0.92rem] text-white hover:bg-white/[0.06] hover:text-white sm:min-h-11 sm:px-5 sm:text-sm"
              onClick={onAcceptNecessaryOnly}
            >
              Csak a szükségesek
            </Button>
            <Button
              type="button"
              size="lg"
              className="public-button-primary min-h-10 rounded-2xl px-4 text-[0.92rem] sm:min-h-11 sm:px-5 sm:text-sm"
              onClick={() => onSavePreferences(analyticsEnabled)}
            >
              Beállítások mentése
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ConsentBanner() {
  const {
    preferences,
    hasResolved,
    hasDecision,
    isPreferencesOpen,
    acceptAll,
    acceptNecessaryOnly,
    savePreferences,
    openPreferences,
    closePreferences,
  } = useConsent()

  useEffect(() => {
    if (!isPreferencesOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closePreferences()
      }
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeydown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeydown)
    }
  }, [closePreferences, isPreferencesOpen])

  const shouldShowBanner = hasResolved && !hasDecision

  return (
    <>
      {shouldShowBanner ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-2.5 pb-[calc(env(safe-area-inset-bottom)+0.9rem)] sm:px-6 sm:pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
          <div className="pointer-events-auto relative mx-auto max-w-4xl overflow-hidden rounded-[1.6rem] border border-[rgba(232,208,160,0.16)] bg-[linear-gradient(180deg,rgba(27,24,18,0.96),rgba(16,14,11,0.98))] text-white shadow-[0_24px_80px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,248,232,0.08)] backdrop-blur-xl sm:rounded-[2rem]">
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(232,208,160,0.35)] to-transparent" />
            <div className="relative flex flex-col gap-4 p-3.5 sm:p-6 md:flex-row md:items-end md:justify-between md:gap-8 md:p-7">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.7rem] font-medium tracking-[0.22em] text-[#f0dfbe] uppercase">
                  <ShieldCheck className="size-3.5" />
                  Adatvédelmi beállítások
                </div>
                <p className="mt-3 text-[0.98rem] font-semibold tracking-tight text-white md:mt-4 md:text-xl">
                  A gördülékeny működéshez szükséges sütiket mindig használjuk,
                  az analitikai mérést viszont csak az Ön hozzájárulásával
                  indítjuk el.
                </p>
                <p className="mt-2.5 max-w-xl text-[0.88rem] leading-6 text-zinc-300 md:mt-3 md:text-sm">
                  A beállítások bármikor újranyithatók, így később is egyszerűen
                  módosítható, hogy engedélyezi-e az analitikai mérést.
                </p>
              </div>

              <div className="flex flex-col gap-2.5 sm:flex-row md:flex-col md:items-stretch lg:flex-row">
                <Button
                  type="button"
                  size="lg"
                  className="public-button-primary min-h-10 rounded-2xl px-4 text-[0.92rem] sm:min-h-11 sm:px-5 sm:text-sm"
                  onClick={acceptAll}
                >
                  Összes elfogadása
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  className="min-h-10 rounded-2xl border-white/15 bg-white/[0.03] px-4 text-[0.92rem] text-white hover:bg-white/[0.06] hover:text-white sm:min-h-11 sm:px-5 sm:text-sm"
                  onClick={acceptNecessaryOnly}
                >
                  Csak a szükségesek
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="ghost"
                  className="min-h-10 rounded-2xl px-4 text-[0.92rem] text-zinc-200 hover:bg-white/[0.06] hover:text-white sm:min-h-11 sm:px-5 sm:text-sm"
                  onClick={openPreferences}
                >
                  <SlidersHorizontal className="size-4" />
                  Beállítások
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isPreferencesOpen ? (
        <ConsentPreferencesDialog
          key={preferences.analytics ? "analytics-on" : "analytics-off"}
          initialAnalyticsEnabled={preferences.analytics}
          onAcceptNecessaryOnly={acceptNecessaryOnly}
          onClose={closePreferences}
          onSavePreferences={(analyticsEnabled) =>
            savePreferences({ analytics: analyticsEnabled })
          }
        />
      ) : null}
    </>
  )
}
