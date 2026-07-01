"use client"

import { useGuidedRequest } from "@/components/guided-request/guided-request-context"
import { contactTimes } from "@/components/guided-request/guided-request-data"
import { LabeledInput } from "@/components/guided-request/shared/labeled-input"
import { OptionChip } from "@/components/shared/option-chip"

export function ContactScreen() {
  const { state, setField } = useGuidedRequest()

  return (
    <div>
      <h2 className="text-white text-[1.4rem] font-bold tracking-tight sm:text-[1.95rem]">
        Hogyan érjük el?
      </h2>
      <p className="mt-3 text-[15px] leading-6 text-zinc-400">
        Csak a lényeg. A részleteket telefonon is egyeztethetjük.
      </p>

      <div className="mt-6 grid gap-3">
        <LabeledInput
          label="Név"
          placeholder="Az Ön neve"
          value={state.form.name}
          onChange={(e) => setField("name", e.target.value)}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <LabeledInput
            label="Telefonszám"
            type="tel"
            placeholder="+36 ..."
            value={state.form.phone}
            onChange={(e) => setField("phone", e.target.value)}
          />
          <LabeledInput
            label="E-mail"
            optional
            type="email"
            placeholder="nev@example.hu"
            value={state.form.email}
            onChange={(e) => setField("email", e.target.value)}
          />
        </div>
        <div>
          <p className="mb-2.5 text-sm font-medium text-zinc-300">Mikor a legkönnyebb hívni?</p>
          <div className="flex flex-wrap gap-2">
            {contactTimes.map((label) => (
              <OptionChip
                key={label}
                label={label}
                selected={state.form.contactTime === label}
                onClick={() => setField("contactTime", label)}
              />
            ))}
          </div>
        </div>
      </div>

      {state.contactError ? (
        <p className="mt-3.5 text-[13px] text-[#f0a58a]">{state.contactError}</p>
      ) : null}
    </div>
  )
}
