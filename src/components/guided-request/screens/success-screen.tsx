"use client"

import { Check, Phone } from "lucide-react"

import { useGuidedRequest } from "@/components/guided-request/guided-request-context"
import { businessPhone } from "@/lib/business"

export function SuccessScreen() {
  const { close } = useGuidedRequest()

  return (
    <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
      <span className="inline-flex size-[76px] items-center justify-center rounded-full border border-[#c89758]/30 bg-[#c89758]/12 text-[#f2e2bc]">
        <Check className="size-9" />
      </span>
      <h2 className="mt-6 text-white text-[1.5rem] font-bold tracking-tight sm:text-[2.1rem]">
        Köszönjük a megkeresést!
      </h2>
      <p className="mt-3.5 max-w-[30rem] text-[15px] leading-6 text-zinc-400">
        Megnyílt az e-mail küldője az összesített adatokkal. Amint küldte, átnézzük, és
        telefonon vagy e-mailben jelentkezünk a következő lépéssel.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2.5">
        <a
          href={`tel:${businessPhone}`}
          className="public-button-primary inline-flex h-[50px] items-center gap-2 rounded-2xl px-5 text-[15px] font-semibold"
        >
          <Phone className="size-4" />
          Hívás most
        </a>
        <button
          type="button"
          onClick={close}
          className="inline-flex h-[50px] items-center gap-2 rounded-2xl border border-white/12 bg-white/[0.04] px-5 text-[15px] font-semibold text-white"
        >
          Bezárás
        </button>
      </div>
    </div>
  )
}
