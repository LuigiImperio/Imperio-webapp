"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"

import { publicAnalyticsEventNames } from "@/lib/analytics/public-events"
import { trackPublicEvent } from "@/lib/analytics/tracker"

export function PageviewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lastTrackedPathRef = useRef<string | null>(null)

  useEffect(() => {
    const search = searchParams.toString()
    const pagePath = search ? `${pathname}?${search}` : pathname

    if (lastTrackedPathRef.current === pagePath) {
      return
    }

    lastTrackedPathRef.current = pagePath

    trackPublicEvent(publicAnalyticsEventNames.pageView, {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
    })
  }, [pathname, searchParams])

  return null
}
