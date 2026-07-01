"use client"

import { useState } from "react"

import { Reveal } from "@/components/motion/reveal"
import { ServiceAreaMapCanvas } from "@/components/service-area-map/service-area-map-canvas"
import { ServiceAreaSelectedCard } from "@/components/service-area-map/service-area-selected-card"
import { ServiceAreaTownChips } from "@/components/service-area-map/service-area-town-chips"

export function ServiceAreaMapSection() {
  const [selectedTown, setSelectedTown] = useState("Pécs")

  return (
    <section
      id="terulet"
      className="relative border-t border-white/10 bg-zinc-950 scroll-mt-24"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 md:px-10 md:py-20">
        <Reveal className="max-w-[42.5rem]" variant="soft">
          <div className="public-pill inline-flex px-3.5 py-1 text-xs sm:px-4 sm:text-sm">
            Szolgáltatási terület
          </div>
          <h2 className="mt-5 text-white text-[1.8rem] font-bold tracking-tight sm:text-[2.4rem] md:text-[2.7rem]">
            Pécs és környéke — itt dolgozunk
          </h2>
          <p className="mt-4 text-[1rem] leading-6 text-zinc-400 sm:text-[1.12rem] sm:leading-7">
            Válasszon települést a térképen, vagy nézze a listát. Az elsődleges baranyai
            területen gyorsabban tudunk reagálni.
          </p>
        </Reveal>

        <Reveal className="mt-7 grid gap-4 lg:grid-cols-[1.4fr_1fr]" variant="card" delayMs={80}>
          <div className="grid gap-4">
            <ServiceAreaMapCanvas selectedTown={selectedTown} onSelect={setSelectedTown} />
            <ServiceAreaTownChips selectedTown={selectedTown} onSelect={setSelectedTown} />
          </div>
          <ServiceAreaSelectedCard selectedTown={selectedTown} />
        </Reveal>
      </div>
    </section>
  )
}
