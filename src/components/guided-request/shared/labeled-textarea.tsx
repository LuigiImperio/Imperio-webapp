"use client"

import type { TextareaHTMLAttributes } from "react"

import { cn } from "@/lib/utils"

type LabeledTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  optional?: boolean
}

export function LabeledTextarea({ label, optional, className, ...props }: LabeledTextareaProps) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-medium text-zinc-300">
        {label}{" "}
        {optional ? <span className="font-normal text-zinc-500">(opcionális)</span> : null}
      </label>
      <textarea
        {...props}
        className={cn(
          "min-h-20 w-full resize-y rounded-[13px] border border-white/12 bg-white/[0.04] px-3.5 py-3 font-sans text-base text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-[#c89758]/60 focus:bg-white/[0.06]",
          className
        )}
      />
    </div>
  )
}
