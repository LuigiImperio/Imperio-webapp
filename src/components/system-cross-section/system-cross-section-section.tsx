"use client"

import { useState } from "react"

import { Reveal } from "@/components/motion/reveal"
import { SystemScene } from "@/components/system-cross-section/system-scene"
import { SystemPartsList } from "@/components/system-cross-section/system-parts-list"
import type { PartKey } from "@/components/system-cross-section/system-parts-data"

export function SystemCrossSectionSection() {
  const [selectedPart, setSelectedPart] = useState<PartKey>("cso")

  return (
    <section
      id="rendszer"
      className="relative border-t border-white/10 bg-gradient-to-b from-zinc-950 to-[#07090d] scroll-mt-24"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 md:px-10 md:py-20">
        <Reveal className="max-w-2xl" variant="soft">
          <div className="public-pill inline-flex px-3.5 py-1 text-xs sm:px-4 sm:text-sm">
            Hogyan működik
          </div>
          <h2 className="mt-5 text-white text-[1.8rem] font-bold tracking-tight sm:text-[2.4rem] md:text-[2.7rem]">
            Hőszivattyús padlófűtés — rétegről rétegre
          </h2>
          <p className="mt-4 text-[1rem] leading-6 text-zinc-400 sm:text-[1.12rem] sm:leading-7">
            Forgassa el a metszetet, és koppintson az elemekre. Így látszik, mi hol van, és miért
            hatékony ez a rendszer.
          </p>
        </Reveal>

        <Reveal className="mt-7 grid gap-4 lg:grid-cols-2" variant="card" delayMs={80}>
          <SystemScene selectedPart={selectedPart} />
          <SystemPartsList selectedPart={selectedPart} onSelect={setSelectedPart} />
        </Reveal>
      </div>
    </section>
  )
}
