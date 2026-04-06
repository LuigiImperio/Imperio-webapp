"use client"

import Link from "next/link"
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type MouseEvent,
} from "react"

import { trackPublicEvent } from "@/lib/analytics/tracker"
import type {
  PublicAnalyticsEventName,
  PublicAnalyticsEventPayload,
} from "@/lib/analytics/public-events"

type TrackedLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> & {
  href: string
  eventName: PublicAnalyticsEventName
  eventPayload?: PublicAnalyticsEventPayload
}

export const TrackedLink = forwardRef<HTMLAnchorElement, TrackedLinkProps>(
  function TrackedLink(
    { href, eventName, eventPayload, onClick, children, ...props },
    ref
  ) {
    function handleClick(event: MouseEvent<HTMLAnchorElement>) {
      onClick?.(event)

      if (!event.defaultPrevented) {
        trackPublicEvent(eventName, eventPayload)
      }
    }

    if (href.startsWith("#")) {
      return (
        <a ref={ref} href={href} onClick={handleClick} {...props}>
          {children}
        </a>
      )
    }

    return (
      <Link ref={ref} href={href} onClick={handleClick} {...props}>
        {children}
      </Link>
    )
  }
)
