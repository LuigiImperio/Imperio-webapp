"use client"

import { useCallback, useRef } from "react"

const formStepScrollOffset = 96

export function useStepTransitionScroll<
  TElement extends HTMLElement = HTMLDivElement,
>() {
  const formTopRef = useRef<TElement | null>(null)

  const scrollToFormTop = useCallback(() => {
    if (typeof window === "undefined") {
      return
    }

    const performScroll = () => {
      const element = formTopRef.current

      if (!element) {
        return
      }

      const top = Math.max(
        element.getBoundingClientRect().top + window.scrollY - formStepScrollOffset,
        0
      )

      window.scrollTo({
        top,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      })
    }

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(performScroll)
    })
  }, [])

  return {
    formTopRef,
    scrollToFormTop,
  }
}
