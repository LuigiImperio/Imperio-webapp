"use client"

import { MessagesSquare, PhoneCall } from "lucide-react"
import { useEffect, useState } from "react"

import { useGuidedRequest } from "@/components/guided-request/guided-request-context"
import { useConsent } from "@/components/privacy/consent-context"
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
  const { openGeneral } = useGuidedRequest()
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
      cta_label: "Hívás",
      destination_path: `tel:${businessPhone}`,
      entry_point: "homepage_mobile_sticky_call",
    })
  }

  function handleGuidedRequestClick() {
    trackPublicEvent(publicAnalyticsEventNames.ctaClick, {
      source_page: "homepage",
      source_section: "mobile_sticky_cta",
      cta_variant: "secondary",
      cta_label: "Megkeresés",
      entry_point: "homepage_mobile_sticky_guided_request",
    })
    openGeneral()
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
          className="pointer-events-auto mx-auto grid w-full max-w-[28.75rem] grid-cols-2 gap-2.5 overflow-hidden rounded-[1.6rem] border border-[rgba(232,208,160,0.16)] bg-[linear-gradient(180deg,rgba(24,24,27,0.94),rgba(9,9,11,0.98))] p-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl"
        >
          <a
            href={`tel:${businessPhone}`}
            onClick={handleCallClick}
            className="public-button-primary flex h-[50px] items-center justify-center gap-2 rounded-[14px] text-[14.5px] font-semibold"
          >
            <PhoneCall className="size-4" />
            Hívás
          </a>
          <button
            type="button"
            onClick={handleGuidedRequestClick}
            className="flex h-[50px] items-center justify-center gap-2 rounded-[14px] border border-[#c89758]/22 bg-[#c89758]/10 text-[14.5px] font-semibold text-[#f2e2bc]"
          >
            <MessagesSquare className="size-4" />
            Megkeresés
          </button>
        </nav>
      </div>
    </div>
  )
}
