"use client"

import Image from "next/image"
import { ArrowRight, Check, Phone } from "lucide-react"

import { useGuidedRequest } from "@/components/guided-request/guided-request-context"
import { Reveal } from "@/components/motion/reveal"
import { businessPhone, businessPhoneDisplay } from "@/lib/business"

const trustBadges = ["Helyi csapat", "Gyors visszajelzés", "Lakossági és projekt"]

const steps = [
  "Kiválasztja, mire van szüksége",
  "Megad pár fontos adatot",
  "Telefonon vagy e-mailben jelzünk vissza",
]

export function HeroSection() {
  const { openGeneral } = useGuidedRequest()

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-zinc-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(200,151,88,0.14),transparent_38%),radial-gradient(circle_at_92%_80%,rgba(121,83,38,0.12),transparent_46%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:120px_120px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]"
      />

      <div className="relative z-[1] mx-auto grid max-w-7xl items-center gap-11 px-4 py-14 sm:px-6 sm:py-16 md:px-10 lg:grid-cols-2 lg:py-20">
        <Reveal variant="hero" className="max-w-[40rem]">
          <div className="public-pill-accent inline-flex items-center gap-2 px-4 py-1.5 text-[12.5px]">
            <span className="size-1.5 rounded-full bg-[#e8d0a0]" />
            Víz · gáz · fűtés · épületgépészet
          </div>

          <h1 className="mt-5 text-[2.3rem] leading-[1.04] font-bold tracking-[-0.02em] text-balance sm:text-5xl lg:text-6xl">
            <span className="block text-white">Megbízható gépészet,</span>
            <span className="mt-1.5 block bg-gradient-to-r from-[#f2e2bc] via-[#cd9d60] to-[#8f6534] bg-clip-text pb-1 text-transparent">
              Pécsen és környékén
            </span>
          </h1>

          <p className="mt-5 max-w-[30rem] text-base leading-7 text-zinc-300 sm:text-lg">
            Sürgős hibától a teljes felújításig. Mondja el pár kattintással, mire van szüksége —
            gyorsan visszajelzünk.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={openGeneral}
              className="public-button-primary inline-flex h-[54px] items-center gap-2.5 rounded-2xl px-6 text-[15.5px] font-semibold"
            >
              Megkeresés indítása
              <ArrowRight className="size-[18px]" />
            </button>
            <a
              href={`tel:${businessPhone}`}
              className="inline-flex h-[54px] items-center gap-2.5 rounded-2xl border border-white/12 bg-white/[0.04] px-6 text-[15.5px] font-semibold text-white transition-colors hover:border-white/20 hover:bg-white/[0.08]"
            >
              <Phone className="size-[17px]" />
              {businessPhoneDisplay}
            </a>
          </div>

          <div className="mt-7 flex flex-wrap gap-2.5">
            {trustBadges.map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#c89758]/16 bg-[#c89758]/7 px-3.5 py-2 text-[13px] text-zinc-100"
              >
                <Check className="size-3.5 text-[#e8d0a0]" strokeWidth={2.4} />
                {label}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal variant="card" delayMs={100} className="relative">
          <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.022] shadow-[0_30px_80px_rgba(0,0,0,0.4)] backdrop-blur-md">
            <div className="relative aspect-4/3 overflow-hidden">
              <Image
                src="/images/about/work-04.jpg"
                alt="Padlófűtés-szerelés egy Imperio Gépészet projektből"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[rgba(5,7,11,0)] to-[rgba(5,7,11,0.72)]" />
              <div className="absolute bottom-3.5 left-4 inline-flex items-center gap-2 rounded-full border border-white/14 bg-black/35 px-3.5 py-1.5 text-xs text-[#f0dfbe] backdrop-blur-sm">
                Valós munkáink Baranyában
              </div>
            </div>
            <div className="p-5 pt-4">
              <p className="mb-3.5 text-[11px] tracking-[0.22em] text-[#c89758] uppercase">
                Így indul a megkeresés
              </p>
              <div className="grid gap-2.5">
                {steps.map((label, index) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="inline-flex size-[30px] shrink-0 items-center justify-center rounded-full border border-[#c89758]/20 bg-[#c89758]/10 text-[13px] font-semibold text-[#f1dfbc]">
                      {index + 1}
                    </span>
                    <span className="text-sm text-zinc-200">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
