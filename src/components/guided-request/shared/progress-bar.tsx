"use client"

import { useGuidedRequest } from "@/components/guided-request/guided-request-context"

export function ProgressBar() {
  const { showProgress, stepLabel, stepCounter, progressPct } = useGuidedRequest()

  if (!showProgress) return null

  return (
    <div className="mt-3.5">
      <div className="mb-1.5 flex items-center justify-between text-[11.5px] tracking-wide text-zinc-500">
        <span>{stepLabel}</span>
        <span className="tabular-nums">{stepCounter}</span>
      </div>
      <div className="h-[5px] overflow-hidden rounded-full bg-white/[0.07]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#e8d0a0] to-[#c89758] transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ width: progressPct }}
        />
      </div>
    </div>
  )
}
