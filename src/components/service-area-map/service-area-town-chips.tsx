"use client"

import { towns } from "@/components/service-area-map/towns-data"
import { OptionChip } from "@/components/shared/option-chip"

type ServiceAreaTownChipsProps = {
  selectedTown: string
  onSelect: (name: string) => void
}

export function ServiceAreaTownChips({ selectedTown, onSelect }: ServiceAreaTownChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 lg:hidden">
      {towns.map((town) => (
        <OptionChip
          key={town.name}
          label={town.name}
          selected={selectedTown === town.name}
          onClick={() => onSelect(town.name)}
        />
      ))}
    </div>
  )
}
