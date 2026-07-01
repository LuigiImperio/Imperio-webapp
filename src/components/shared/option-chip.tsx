"use client"

import { cn } from "@/lib/utils"

type OptionChipProps = {
  label: string
  selected: boolean
  onClick: () => void
}

export function OptionChip({ label, selected, onClick }: OptionChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200",
        selected
          ? "border border-[#e8d0a0]/50 bg-[#c89758]/18 text-[#f5e8ca]"
          : "border border-white/12 bg-white/[0.04] text-zinc-300 hover:border-white/20 hover:bg-white/[0.07]"
      )}
    >
      {label}
    </button>
  )
}
