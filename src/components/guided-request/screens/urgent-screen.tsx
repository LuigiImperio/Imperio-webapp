"use client"

import { Phone } from "lucide-react"

import { useGuidedRequest } from "@/components/guided-request/guided-request-context"
import { urgentSymptoms } from "@/components/guided-request/guided-request-data"
import { LabeledInput } from "@/components/guided-request/shared/labeled-input"
import { LabeledTextarea } from "@/components/guided-request/shared/labeled-textarea"
import { OptionChip } from "@/components/shared/option-chip"
import { businessPhone, businessPhoneDisplay } from "@/lib/business"

export function UrgentScreen() {
  const { state, toggleSymptom, setField } = useGuidedRequest()

  return (
    <div>
      <div className="inline-flex items-center gap-2 rounded-full border border-[#d6845a]/32 bg-[#c45634]/14 px-3.5 py-1.5 text-[11.5px] font-semibold tracking-[0.14em] text-[#f3c3ab] uppercase">
        Sürgős hiba
      </div>
      <h2 className="mt-3.5 text-white text-[1.5rem] font-bold tracking-tight sm:text-[2.1rem]">
        A leggyorsabb a telefon
      </h2>
      <p className="mt-3 max-w-[34rem] text-[15px] leading-6 text-zinc-400">
        Sürgős esetben hívjon azonnal — élőben gyorsabban segítünk. Ha inkább írna, jelölje meg a
        hibát és hagyjon elérhetőséget, visszahívjuk.
      </p>

      <a
        href={`tel:${businessPhone}`}
        className="public-button-primary mt-5 flex h-[62px] items-center justify-center gap-2.5 rounded-2xl text-[18px] font-bold"
      >
        <Phone className="size-5" />
        Hívás most · {businessPhoneDisplay}
      </a>

      <div className="mt-6 flex items-center gap-3.5">
        <span className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-zinc-500">vagy küldje el írásban</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <p className="mt-5 mb-3 text-sm font-semibold text-zinc-200">Mi a hiba?</p>
      <div className="flex flex-wrap gap-2">
        {urgentSymptoms.map((label) => (
          <OptionChip
            key={label}
            label={label}
            selected={state.symptoms.includes(label)}
            onClick={() => toggleSymptom(label)}
          />
        ))}
      </div>

      <div className="mt-6 grid gap-3">
        <LabeledInput
          label="Név"
          placeholder="Az Ön neve"
          value={state.form.name}
          onChange={(e) => setField("name", e.target.value)}
        />
        <LabeledInput
          label="Telefonszám"
          type="tel"
          placeholder="+36 ..."
          value={state.form.phone}
          onChange={(e) => setField("phone", e.target.value)}
        />
        <LabeledInput
          label="Cím / település"
          placeholder="Pl. Pécs, utca, házszám"
          value={state.form.city}
          onChange={(e) => setField("city", e.target.value)}
        />
        <LabeledTextarea
          label="Rövid leírás"
          optional
          placeholder="Mi történt, mióta áll fenn?"
          value={state.form.freeText}
          onChange={(e) => setField("freeText", e.target.value)}
        />
      </div>
    </div>
  )
}
