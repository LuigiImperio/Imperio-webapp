"use client"

import type { InputHTMLAttributes } from "react"

import { cn } from "@/lib/utils"

type LabeledInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  optional?: boolean
}

export function LabeledInput({ label, optional, className, ...props }: LabeledInputProps) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-medium text-zinc-300">
        {label}{" "}
        {optional ? <span className="font-normal text-zinc-500">(opcionális)</span> : null}
      </label>
      <input
        {...props}
        className={cn(
          "h-12 w-full rounded-[13px] border border-white/12 bg-white/[0.04] px-3.5 font-sans text-base text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-[#c89758]/60 focus:bg-white/[0.06]",
          className
        )}
      />
    </div>
  )
}
