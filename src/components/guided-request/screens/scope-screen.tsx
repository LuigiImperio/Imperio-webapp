"use client"

import { useGuidedRequest } from "@/components/guided-request/guided-request-context"
import { scopeChoices } from "@/components/guided-request/guided-request-data"
import { LabeledTextarea } from "@/components/guided-request/shared/labeled-textarea"
import { OptionChip } from "@/components/shared/option-chip"

export function ScopeScreen() {
  const { state, setField } = useGuidedRequest()

  return (
    <div>
      <h2 className="text-white text-[1.4rem] font-bold tracking-tight sm:text-[1.95rem]">Milyen projekt?</h2>
      <p className="mt-3 text-[15px] leading-6 text-zinc-400">
        Válassza ki, mi áll a középpontban.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {scopeChoices.map((label) => (
          <OptionChip
            key={label}
            label={label}
            selected={state.form.scope === label}
            onClick={() => setField("scope", label)}
          />
        ))}
      </div>
      <div className="mt-6">
        <LabeledTextarea
          label="Rövid leírás a tervről"
          optional
          placeholder="Pl. új építés, hány négyzetméter, milyen rendszerek érintettek"
          value={state.form.freeText}
          onChange={(e) => setField("freeText", e.target.value)}
        />
      </div>
    </div>
  )
}
