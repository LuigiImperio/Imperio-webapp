"use client"

import { useGuidedRequest } from "@/components/guided-request/guided-request-context"
import { symptomsByTopic } from "@/components/guided-request/guided-request-data"
import { LabeledTextarea } from "@/components/guided-request/shared/labeled-textarea"
import { OptionChip } from "@/components/shared/option-chip"

export function SymptomsScreen() {
  const { state, topicLabel, toggleSymptom, setField } = useGuidedRequest()
  const chips = (state.topic && symptomsByTopic[state.topic]) || []

  return (
    <div>
      <p className="text-[11.5px] tracking-[0.18em] text-[#c89758] uppercase">{topicLabel}</p>
      <h2 className="mt-2.5 text-white text-[1.4rem] font-bold tracking-tight sm:text-[1.95rem]">
        Mi a jellemző?
      </h2>
      <p className="mt-3 text-[15px] leading-6 text-zinc-400">
        Válasszon, ami illik — többet is jelölhet. Gépelni nem kötelező.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {chips.map((label) => (
          <OptionChip
            key={label}
            label={label}
            selected={state.symptoms.includes(label)}
            onClick={() => toggleSymptom(label)}
          />
        ))}
      </div>
      <div className="mt-6">
        <LabeledTextarea
          label="Bármi egyéb?"
          optional
          placeholder="Pár szóban a részletek"
          value={state.form.freeText}
          onChange={(e) => setField("freeText", e.target.value)}
        />
      </div>
    </div>
  )
}
