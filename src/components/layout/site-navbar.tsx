"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useEffect, useState } from "react"

import { ImperioLogo } from "@/components/branding/ImperioLogo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigationItems = [
  { label: "Szolgáltatások", href: "/#szolgaltatasok" },
  { label: "Rólunk", href: "/#rolunk" },
  { label: "Dolgozz velünk", href: "/#dolgozz-velunk" },
  { label: "Referenciák", href: "/#referenciak" },
  { label: "GYIK", href: "/#gyik" },
  { label: "Kapcsolat", href: "/#kapcsolat" },
]

export function SiteNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow

    function handleResize() {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("resize", handleResize)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("resize", handleResize)
    }
  }, [isMobileMenuOpen])

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/88 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2.5 px-3.5 sm:h-[4.5rem] sm:gap-3 sm:px-6 md:px-10">
        <ImperioLogo className="size-[4rem] sm:size-[4.2rem] lg:size-[4rem] xl:size-[4.35rem]" />

        <nav className="hidden items-center gap-6 lg:flex 2xl:gap-7">
          {navigationItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm text-zinc-300 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <Button
            asChild
            size="sm"
            className="public-button-primary h-9 shrink-0 rounded-xl px-3 text-[0.76rem] sm:h-10 sm:px-4 sm:text-[0.82rem] lg:h-11 lg:px-4 lg:text-sm"
          >
            <Link href="/#szolgaltatasok">
              <span className="sm:hidden">Megkeresés</span>
              <span className="hidden sm:inline">Megkeresés indítása</span>
            </Link>
          </Button>

          <button
            type="button"
            aria-expanded={isMobileMenuOpen}
            aria-label={
              isMobileMenuOpen ? "Mobil navigáció bezárása" : "Mobil navigáció megnyitása"
            }
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-200 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 lg:hidden"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
          >
            {isMobileMenuOpen ? (
              <X className="h-[1.125rem] w-[1.125rem]" />
            ) : (
              <Menu className="h-[1.125rem] w-[1.125rem]" />
            )}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "grid overflow-hidden border-t border-white/10 bg-zinc-950/95 transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden",
          isMobileMenuOpen
            ? "[grid-template-rows:1fr] opacity-100"
            : "[grid-template-rows:0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="mx-auto max-w-7xl px-3.5 py-3.5 sm:px-6">
            <nav className="grid gap-1.5">
              {navigationItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-2xl border border-transparent px-3.5 py-3 text-sm text-zinc-200 transition-colors hover:border-white/10 hover:bg-white/[0.05] hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
