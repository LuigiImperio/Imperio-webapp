"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

type ImperioLogoProps = {
  className?: string
}

export function ImperioLogo({ className }: ImperioLogoProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <Link
      href="/"
      aria-label="Imperio Gépészet főoldal"
      className={cn(
        "group relative inline-flex size-[4rem] shrink-0 items-center justify-center",
        className
      )}
    >
      <motion.div
        className="relative h-full w-full"
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 4 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        whileHover={shouldReduceMotion ? undefined : { scale: 1.01 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
      >
        <Image
          fill
          priority
          src="/images/brand/logo1.0.svg"
          alt=""
          aria-hidden="true"
          sizes="(min-width: 1280px) 90px, (min-width: 1024px) 80px, (min-width: 640px) 76px, 70px"
          className="object-contain"
        />
      </motion.div>
    </Link>
  )
}
