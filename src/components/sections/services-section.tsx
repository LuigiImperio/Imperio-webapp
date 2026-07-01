"use client"

import {
  ArrowRight,
  Bath,
  Droplet,
  Flame,
  Gauge,
  LayoutGrid,
  MessageSquarePlus,
  Thermometer,
  Wind,
  type LucideIcon,
} from "lucide-react"

import { useGuidedRequest } from "@/components/guided-request/guided-request-context"
import { Reveal } from "@/components/motion/reveal"
import { topicMeta } from "@/components/guided-request/guided-request-data"
import type { TopicKey } from "@/components/guided-request/guided-request-types"

const tileIcons: Record<TopicKey, LucideIcon> = {
  viz: Droplet,
  gaz: Flame,
  futes: Thermometer,
  kazan: Gauge,
  hoszivattyu: Wind,
  furdo: Bath,
  komplett: LayoutGrid,
}

const tileOrder: TopicKey[] = ["viz", "gaz", "futes", "kazan", "hoszivattyu", "furdo", "komplett"]

export function ServicesSection() {
  const { openGeneral, openTopic } = useGuidedRequest()

  return (
    <section id="szolgaltatasok" className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-18 md:px-10 md:py-[4.5rem] scroll-mt-24">
      <Reveal variant="soft" className="max-w-[45rem]">
        <div className="public-pill inline-flex px-3.5 py-1 text-xs sm:px-4 sm:text-sm">
          Szolgáltatások
        </div>
        <h2 className="mt-4 text-white text-[1.9rem] font-bold tracking-tight sm:text-[2.2rem] md:text-5xl">
          Válassza ki, miben segíthetünk
        </h2>
        <p className="mt-4 text-base leading-6 text-zinc-300 sm:text-[1.12rem] sm:leading-[1.55]">
          Néhány tiszta kategória. Mindegyik ugyanazt a vezetett megkeresést indítja — pár
          kattintás, minimális gépelés.
        </p>
      </Reveal>

      <Reveal
        variant="card"
        delayMs={60}
        className="mt-7 overflow-hidden rounded-[24px] border border-[#c89758]/22 bg-gradient-to-br from-[#c89758]/10 to-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
      >
        <div className="grid items-center gap-4 p-6 sm:grid-cols-[1fr_auto] sm:p-8">
          <div>
            <h3 className="text-white text-xl font-bold tracking-tight sm:text-2xl">
              Nem biztos, melyik kell?
            </h3>
            <p className="mt-2.5 max-w-[38rem] text-[15px] leading-6 text-zinc-300">
              Írja le pár szóval a helyzetet, és a vezetett megkeresés végigvezeti — mi pedig a
              megfelelő irányból jelentkezünk.
            </p>
          </div>
          <button
            type="button"
            onClick={openGeneral}
            className="public-button-primary inline-flex h-[52px] items-center gap-2.5 rounded-2xl px-6 text-[15px] font-semibold justify-self-start"
          >
            <MessageSquarePlus className="size-[18px]" />
            Leírom a helyzetet
            <ArrowRight className="size-[18px]" />
          </button>
        </div>
      </Reveal>

      <Reveal
        variant="card"
        delayMs={120}
        className="mt-4 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {tileOrder.map((topic) => {
          const Icon = tileIcons[topic]
          const meta = topicMeta[topic]
          const isWide = topic === "komplett"

          return (
            <button
              key={topic}
              type="button"
              onClick={() => openTopic(topic)}
              className={`public-card-hover flex flex-col gap-3 rounded-[20px] border border-white/10 bg-white/[0.035] p-5 text-left ${isWide ? "sm:col-span-2 lg:col-span-3" : ""}`}
            >
              <span className="inline-flex size-11 items-center justify-center rounded-[13px] border border-[#c89758]/20 bg-[#c89758]/8 text-[#f0dfbe]">
                <Icon className="size-[22px]" strokeWidth={1.7} />
              </span>
              <span className="text-[17px] font-semibold text-white">{meta.label}</span>
              <span className="text-[13.5px] leading-5 text-zinc-400">{meta.desc}</span>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-[13px] font-semibold text-[#e8d0a0]">
                Megkeresés indítása
                <ArrowRight className="size-[15px]" strokeWidth={2.2} />
              </span>
            </button>
          )
        })}
      </Reveal>
    </section>
  )
}
