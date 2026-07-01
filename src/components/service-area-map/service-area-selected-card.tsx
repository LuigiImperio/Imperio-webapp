"use client"

import { Phone } from "lucide-react"

import { useGuidedRequest } from "@/components/guided-request/guided-request-context"
import { towns } from "@/components/service-area-map/towns-data"
import { businessPhone } from "@/lib/business"

type ServiceAreaSelectedCardProps = {
  selectedTown: string
}

export function ServiceAreaSelectedCard({ selectedTown }: ServiceAreaSelectedCardProps) {
  const { openGeneral } = useGuidedRequest()
  const town = towns.find((t) => t.name === selectedTown) ?? towns[0]

  return (
    <div className="flex flex-col self-stretch rounded-[20px] border border-[#c89758]/20 bg-gradient-to-br from-[#c89758]/10 to-white/[0.02] p-5">
      <div className="text-[11.5px] tracking-[0.2em] text-[#c89758] uppercase">Kiválasztva</div>
      <div className="mt-2.5 text-2xl font-bold text-white">{town.name}</div>
      <p className="mt-2.5 text-sm leading-6 text-zinc-300">{town.note}</p>
      <div className="mt-auto flex flex-col gap-2.5 pt-4">
        <button
          type="button"
          onClick={openGeneral}
          className="public-button-primary h-[46px] rounded-[13px] text-[14.5px] font-semibold"
        >
          Megkeresés indítása
        </button>
        <a
          href={`tel:${businessPhone}`}
          className="flex h-11 items-center justify-center gap-2 rounded-[13px] border border-white/12 bg-white/[0.04] text-sm font-semibold text-white"
        >
          <Phone className="size-4" />
          Hívás most
        </a>
      </div>
    </div>
  )
}
