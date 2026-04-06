"use client"

import { useFormStatus } from "react-dom"

import { cn } from "@/lib/utils"

export function AdminFormSubmitButton({
  idleLabel,
  pendingLabel,
  className,
}: {
  idleLabel: string
  pendingLabel: string
  className?: string
}) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-xl border border-white/20 bg-white px-4 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-zinc-200/60 disabled:text-zinc-700",
        className
      )}
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  )
}
