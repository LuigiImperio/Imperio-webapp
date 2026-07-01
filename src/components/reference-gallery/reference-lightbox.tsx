"use client"

import Image from "next/image"
import { X } from "lucide-react"
import { useEffect } from "react"

type ReferenceLightboxProps = {
  src: string
  alt: string
  onClose: () => void
}

export function ReferenceLightbox({ src, alt, onClose }: ReferenceLightboxProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Kép nagy nézet"
      className="fixed inset-0 z-[110] flex items-center justify-center bg-[rgba(3,5,8,0.86)] p-6 backdrop-blur-md"
    >
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default"
      />
      <button
        type="button"
        onClick={onClose}
        aria-label="Bezárás"
        className="absolute top-4 right-4 z-[1] inline-flex size-11 items-center justify-center rounded-xl border border-white/14 bg-white/[0.06] text-white"
      >
        <X className="size-5" />
      </button>
      <div className="relative z-[1] max-h-[86vh] max-w-[min(1000px,92vw)] overflow-hidden rounded-2xl border border-white/14 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
        <Image
          src={src}
          alt={alt}
          width={1000}
          height={750}
          className="h-auto max-h-[86vh] w-auto object-contain"
          sizes="92vw"
        />
      </div>
    </div>
  )
}
