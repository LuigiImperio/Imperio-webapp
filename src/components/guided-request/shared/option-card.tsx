"use client"

import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type OptionCardProps = {
  title: string
  description: string
  icon?: ReactNode
  selected?: boolean
  onClick: () => void
}

export function OptionCard({ title, description, icon, selected, onClick }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left font-sans transition-all duration-200",
        selected
          ? "border-[#e8d0a0]/50 bg-[#c89758]/14"
          : "border-white/10 bg-white/[0.035] hover:border-white/22 hover:bg-white/[0.06]"
      )}
    >
      {icon ? (
        <span className="flex size-12 shrink-0 items-center justify-center rounded-[14px] border border-[#c89758]/20 bg-[#c89758]/8 text-[#f0dfbe]">
          {icon}
        </span>
      ) : null}
      <span className="min-w-0">
        <span className="block text-[16.5px] font-semibold text-white">{title}</span>
        <span className="mt-1 block text-[13.5px] text-zinc-400">{description}</span>
      </span>
    </button>
  )
}
