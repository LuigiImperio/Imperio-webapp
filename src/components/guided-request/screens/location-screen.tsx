"use client"

import { useGuidedRequest } from "@/components/guided-request/guided-request-context"
import { propertyTypes } from "@/components/guided-request/guided-request-data"
import { LabeledInput } from "@/components/guided-request/shared/labeled-input"
import { OptionChip } from "@/components/shared/option-chip"

export function LocationScreen() {
  const { state, areaNote, setField } = useGuidedRequest()

  return (
    <div>
      <h2 className="text-white text-[1.4rem] font-bold tracking-tight sm:text-[1.95rem]">
        Hol és milyen ingatlan?
      </h2>
      <p className="mt-3 text-[15px] leading-6 text-zinc-400">
        Ebből látjuk, hogy a szolgáltatási területünkbe esik-e.
      </p>

      <p className="mt-6 mb-2.5 text-sm font-semibold text-zinc-200">Ingatlan típusa</p>
      <div className="flex flex-wrap gap-2">
        {propertyTypes.map((label) => (
          <OptionChip
            key={label}
            label={label}
            selected={state.form.propertyType === label}
            onClick={() => setField("propertyType", label)}
          />
        ))}
      </div>

      <div className="mt-5 grid gap-3">
        <LabeledInput
          label="Irányítószám"
          inputMode="numeric"
          maxLength={4}
          placeholder="7621"
          value={state.form.postalCode}
          onChange={(e) => setField("postalCode", e.target.value.replace(/\D/g, "").slice(0, 4))}
        />
        <LabeledInput
          label="Település"
          placeholder="Pl. Pécs"
          value={state.form.city}
          onChange={(e) => setField("city", e.target.value)}
        />
      </div>

      {areaNote ? (
        <p className="mt-3.5 rounded-xl border border-[#c89758]/18 bg-[#c89758]/7 px-3.5 py-3 text-[13px] leading-5 text-[#e3d6bd]">
          {areaNote}
        </p>
      ) : null}
    </div>
  )
}
