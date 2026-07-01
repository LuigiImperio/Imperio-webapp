"use client"

import { Phone, TriangleAlert } from "lucide-react"

import { useGuidedRequest } from "@/components/guided-request/guided-request-context"
import { Reveal } from "@/components/motion/reveal"
import { businessPhone } from "@/lib/business"

const urgentTags = ["Csőtörés", "Szivárgás", "Beázás", "Leállt kazán", "Nincs meleg víz"]

export function UrgentCalloutSection() {
  const { openUrgent } = useGuidedRequest()

  return (
    <section
      id="surgos"
      className="relative border-b border-white/10 bg-gradient-to-b from-[#0a0907] to-zinc-950 scroll-mt-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(196,86,52,0.16),transparent_42%),radial-gradient(circle_at_88%_100%,rgba(200,151,88,0.1),transparent_46%)]"
      />
      <Reveal variant="soft" className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 md:px-10">
        <div className="overflow-hidden rounded-[28px] border border-[#d6845a]/26 bg-gradient-to-br from-[#c45634]/12 to-white/[0.02] p-6 shadow-[0_26px_70px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] sm:p-9 md:p-11">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-[#d6845a]/34 bg-[#c45634]/16 px-3.5 py-2 text-xs font-semibold tracking-[0.16em] text-[#f3c3ab] uppercase">
                <span className="relative inline-flex size-2.5">
                  <span className="animate-imperio-pingdot absolute inset-0 rounded-full bg-[#e8865a]" />
                  <span className="relative size-2.5 rounded-full bg-[#ef9b73]" />
                </span>
                Sürgős eset
              </div>
              <h2 className="mt-5 text-white text-[1.8rem] font-bold tracking-tight sm:text-[2.4rem] md:text-[2.75rem]">
                Csőtörés, beázás, leállt kazán?
              </h2>
              <p className="mt-4 max-w-[34rem] text-base leading-6 text-zinc-300 sm:text-[1.12rem] sm:leading-[1.55]">
                Ne keresgéljen a kategóriák között. Sürgős hibánál a leggyorsabb a telefon — vagy
                küldjön gyors hibabejelentést, és visszahívjuk.
              </p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {urgentTags.map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-[#d6845a]/22 bg-[#c45634]/10 px-3.5 py-1.5 text-[13px] text-[#f0e3da]"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={`tel:${businessPhone}`}
                className="public-button-primary flex h-16 items-center justify-center gap-2.5 rounded-2xl text-lg font-bold"
              >
                <Phone className="size-[22px]" />
                Hívás most
              </a>
              <button
                type="button"
                onClick={openUrgent}
                className="flex h-14 items-center justify-center gap-2.5 rounded-2xl border border-[#d6845a]/30 bg-[#c45634]/12 text-[15.5px] font-semibold text-[#f3c3ab] transition-colors hover:border-[#d6845a]/45 hover:bg-[#c45634]/20"
              >
                <TriangleAlert className="size-[19px]" />
                Gyors hibabejelentés
              </button>
              <p className="mt-0.5 text-center text-[12.5px] text-[#b6a89c]">
                Hétköznap és hétvégén is hívható
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
