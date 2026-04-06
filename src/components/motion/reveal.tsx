"use client"

import {
  type CSSProperties,
  type ElementType,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react"

import { cn } from "@/lib/utils"

type RevealProps = {
  as?: ElementType
  children: ReactNode
  className?: string
  delayMs?: number
  variant?: "default" | "soft" | "card" | "hero"
}

export function Reveal({
  as: Component = "div",
  children,
  className,
  delayMs = 0,
  variant = "default",
}: RevealProps) {
  const elementRef = useRef<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = elementRef.current

    if (!element) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -8% 0px",
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <Component
      ref={elementRef}
      className={cn(
        "reveal-base",
        variant === "soft" && "reveal-soft",
        variant === "card" && "reveal-card",
        variant === "hero" && "reveal-hero",
        isVisible && "reveal-visible",
        className
      )}
      style={
        {
          transitionDelay: `${delayMs}ms`,
        } as CSSProperties
      }
    >
      {children}
    </Component>
  )
}
