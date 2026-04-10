"use client"

import { PhoneCall, PhoneIncoming, TriangleAlert } from "lucide-react"
import { useEffect, useState } from "react"

import { TrackedLink } from "@/components/analytics/tracked-link"
import { useConsent } from "@/components/privacy/consent-context"
import { Button } from "@/components/ui/button"
import { publicAnalyticsEventNames } from "@/lib/analytics/public-events"
import { trackPublicEvent } from "@/lib/analytics/tracker"
import { businessPhone } from "@/lib/business"
import { cn } from "@/lib/utils"

const MOBILE_CTA_SCROLL_OFFSET = 220

export function MobileStickyCtaBar() {
  const {
    requiresConsent,
    hasResolved,
    hasDecision,
    isPreferencesOpen,
  } = useConsent()
  const [hasScrolledEnough, setHasScrolledEnough] = useState(false)
  const [isContactSectionVisible, setIsContactSectionVisible] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setHasScrolledEnough(window.scrollY >= MOBILE_CTA_SCROLL_OFFSET)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    const contactSection = document.getElementById("kapcsolat")

    if (!contactSection) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsContactSectionVisible(entry.isIntersecting)
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -12% 0px",
      }
    )

    observer.observe(contactSection)

    return () => {
      observer.disconnect()
    }
  }, [])

  const shouldHideForConsent =
    requiresConsent && (!hasResolved || !hasDecision || isPreferencesOpen)
  const shouldReserveCookieSpace =
    requiresConsent && hasResolved && hasDecision && !isPreferencesOpen
  const isVisible =
    hasScrolledEnough && !isContactSectionVisible && !shouldHideForConsent

  function handleCallClick() {
    trackPublicEvent(publicAnalyticsEventNames.ctaClick, {
      source_page: "homepage",
      source_section: "mobile_sticky_cta",
      cta_variant: "primary",
      cta_label: "Hívás most",
      destination_path: `tel:${businessPhone}`,
      entry_point: "homepage_mobile_sticky_call",
    })
  }

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-30 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden",
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-6 opacity-0"
      )}
      aria-hidden={!isVisible}
    >
      <div
        className={cn(
          "px-3 pb-[calc(env(safe-area-inset-bottom)+0.85rem)]",
          shouldReserveCookieSpace && "pr-[4.75rem]"
        )}
      >
        <nav
          aria-label="Gyors mobil műveletek"
          className="pointer-events-auto mx-auto w-full max-w-md overflow-hidden rounded-[1.6rem] border border-[rgba(232,208,160,0.14)] bg-[linear-gradient(180deg,rgba(24,24,27,0.94),rgba(9,9,11,0.98))] p-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl"
        >
          <div className="grid gap-2">
            <div className="grid grid-cols-2 gap-2">
              <Button
                asChild
                size="sm"
                className="public-button-primary h-12 rounded-[1rem] px-3 text-[0.82rem] font-medium"
              >
                <a href={`tel:${businessPhone}`} onClick={handleCallClick}>
                  <PhoneCall className="size-4" />
                  Hívás most
                </a>
              </Button>

              <Button
                asChild
                size="sm"
                variant="outline"
                className="h-12 rounded-[1rem] border-[#c89758]/18 bg-[#c89758]/[0.08] px-3 text-[0.82rem] font-medium text-[#f2e2bc] hover:border-[#c89758]/30 hover:bg-[#c89758]/[0.14] hover:text-[#f7ebcf]"
              >
                <TrackedLink
                  href="/szolgaltatasok/hibabejelentes"
                  eventName={publicAnalyticsEventNames.ctaClick}
                  eventPayload={{
                    source_page: "homepage",
                    source_section: "mobile_sticky_cta",
                    service_type: "hibabejelentes",
                    cta_variant: "secondary",
                    cta_label: "Hibabejelentés",
                    destination_path: "/szolgaltatasok/hibabejelentes",
                    entry_point: "homepage_mobile_sticky_fault_report",
                  }}
                >
                  <TriangleAlert className="size-4" />
                  Hibabejelentés
                </TrackedLink>
              </Button>
            </div>

            <Button
              asChild
              size="sm"
              variant="ghost"
              className="h-11 rounded-[1rem] border border-white/10 bg-white/[0.04] px-3 text-[0.82rem] font-medium text-zinc-100 hover:border-white/16 hover:bg-white/[0.08] hover:text-white"
            >
              <TrackedLink
                href="#lakossagi-gyakori-munkak"
                eventName={publicAnalyticsEventNames.ctaClick}
                eventPayload={{
                  source_page: "homepage",
                  source_section: "mobile_sticky_cta",
                  cta_variant: "supporting",
                  cta_label: "Visszahívást kérek",
                  destination_path: "/#lakossagi-gyakori-munkak",
                  entry_point: "homepage_mobile_sticky_callback_request",
                }}
              >
                <PhoneIncoming className="size-4" />
                Visszahívást kérek
              </TrackedLink>
            </Button>
          </div>
        </nav>
      </div>
    </div>
  )
}
