"use client"

import { systemParts, type PartKey } from "@/components/system-cross-section/system-parts-data"
import { cn } from "@/lib/utils"

type SystemPartsListProps = {
  selectedPart: PartKey
  onSelect: (part: PartKey) => void
}

export function SystemPartsList({ selectedPart, onSelect }: SystemPartsListProps) {
  const active = systemParts.find((part) => part.key === selectedPart) ?? systemParts[0]

  return (
    <div className="flex flex-col gap-3.5">
      <div className="grid gap-2">
        {systemParts.map((part) => {
          const selected = part.key === selectedPart

          return (
            <button
              key={part.key}
              type="button"
              onClick={() => onSelect(part.key)}
              className={cn(
                "flex w-full items-center gap-3.5 rounded-2xl px-3.5 py-3 text-left",
                selected
                  ? "border border-[#e8d0a0]/50 bg-[#c89758]/14"
                  : "border border-white/10 bg-white/[0.03]"
              )}
            >
              <span
                className={cn(
                  "inline-flex size-[26px] shrink-0 items-center justify-center rounded-full text-[13px] font-bold",
                  selected
                    ? "bg-gradient-to-br from-[#f2e2bc] to-[#c89758] text-[#181109]"
                    : "border border-[#c89758]/30 bg-[#c89758]/10 text-[#f0dfbe]"
                )}
              >
                {part.n}
              </span>
              <span className="text-[14.5px] font-semibold text-white">{part.label}</span>
            </button>
          )
        })}
      </div>

      <div className="rounded-[18px] border border-[#c89758]/20 bg-gradient-to-br from-[#c89758]/10 to-white/[0.02] p-5">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex size-[30px] items-center justify-center rounded-full bg-gradient-to-br from-[#f2e2bc] to-[#c89758] text-sm font-bold text-[#181109]">
            {active.n}
          </span>
          <div className="text-lg font-bold text-white">{active.label}</div>
        </div>
        <p className="mt-3 text-sm leading-6 text-zinc-300">{active.desc}</p>
      </div>
    </div>
  )
}
