"use client"

import { Phone, Send } from "lucide-react"

import { useGuidedRequest } from "@/components/guided-request/guided-request-context"
import { businessPhone } from "@/lib/business"

export function SummaryScreen() {
  const { summaryLines, mailHref, submit } = useGuidedRequest()

  return (
    <div>
      <div className="inline-flex items-center gap-2 rounded-full border border-[#c89758]/20 bg-[#c89758]/8 px-3.5 py-1.5 text-[11.5px] font-semibold tracking-[0.14em] text-[#f0dfbe] uppercase">
        Ezt küldjük el
      </div>
      <h2 className="mt-3.5 text-white text-[1.4rem] font-bold tracking-tight sm:text-[1.95rem]">
        Összegzés
      </h2>
      <p className="mt-3 text-[15px] leading-6 text-zinc-400">
        Nézze át, és küldje el e-mailben. Bármit visszamenőleg módosíthat.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        {summaryLines.map((row) => (
          <div
            key={row.label}
            className="flex gap-3.5 border-b border-white/[0.06] px-4 py-3.5 last:border-b-0"
          >
            <span className="w-[38%] max-w-[160px] shrink-0 text-[13px] text-zinc-500">
              {row.label}
            </span>
            <span className="flex-1 text-sm break-words text-zinc-100">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-2.5">
        <a
          href={mailHref}
          onClick={submit}
          className="public-button-primary flex h-[58px] items-center justify-center gap-2.5 rounded-[17px] text-[16.5px] font-bold"
        >
          <Send className="size-5" />
          Küldés e-mailben
        </a>
        <a
          href={`tel:${businessPhone}`}
          className="flex h-[52px] items-center justify-center gap-2.5 rounded-[17px] border border-white/12 bg-white/[0.04] text-[15px] font-semibold text-white"
        >
          <Phone className="size-[18px]" />
          Inkább telefonálok
        </a>
      </div>
    </div>
  )
}
