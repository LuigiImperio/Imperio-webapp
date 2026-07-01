"use client"

import Image from "next/image"
import { ArrowLeft, ArrowRight, X } from "lucide-react"

import { useGuidedRequest } from "@/components/guided-request/guided-request-context"
import { ProgressBar } from "@/components/guided-request/shared/progress-bar"
import { BranchScreen } from "@/components/guided-request/screens/branch-screen"
import { ContactScreen } from "@/components/guided-request/screens/contact-screen"
import { ExtraScreen } from "@/components/guided-request/screens/extra-screen"
import { LocationScreen } from "@/components/guided-request/screens/location-screen"
import { ScopeScreen } from "@/components/guided-request/screens/scope-screen"
import { SuccessScreen } from "@/components/guided-request/screens/success-screen"
import { SummaryScreen } from "@/components/guided-request/screens/summary-screen"
import { SymptomsScreen } from "@/components/guided-request/screens/symptoms-screen"
import { TopicScreen } from "@/components/guided-request/screens/topic-screen"
import { UrgentScreen } from "@/components/guided-request/screens/urgent-screen"

export function GuidedRequestModal() {
  const { screenKey, headerLabel, showFooterNav, showNext, backLabel, nextLabel, close, prev, next } =
    useGuidedRequest()

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Vezetett megkeresés"
      className="fixed inset-0 z-[100] flex items-stretch justify-center overflow-y-auto bg-[rgba(3,5,8,0.72)] backdrop-blur-sm"
    >
      <div className="relative flex min-h-full w-full max-w-[920px] flex-col">
        <div className="flex min-h-full flex-col border-x border-white/8 bg-[#0a0d12]">
          <div className="sticky top-0 z-[2] border-b border-white/8 bg-[rgba(10,13,18,0.92)] px-4 py-4 backdrop-blur-md">
            <div className="flex items-center justify-between gap-3.5">
              <div className="flex min-w-0 items-center gap-2.5">
                <Image
                  src="/images/brand/logo1.0.svg"
                  alt=""
                  aria-hidden="true"
                  width={34}
                  height={34}
                  className="shrink-0 object-contain"
                />
                <span className="truncate text-[13.5px] font-semibold text-zinc-200">
                  {headerLabel}
                </span>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Bezárás"
                className="inline-flex size-[38px] shrink-0 items-center justify-center rounded-[11px] border border-white/10 bg-white/[0.04] text-zinc-300 transition-colors hover:bg-white/[0.09] hover:text-white"
              >
                <X className="size-[18px]" />
              </button>
            </div>
            <ProgressBar />
          </div>

          <div className="flex flex-1 flex-col px-4 py-6 sm:px-10 sm:py-10">
            {screenKey === "branch" && <BranchScreen />}
            {screenKey === "urgent" && <UrgentScreen />}
            {screenKey === "topic" && <TopicScreen />}
            {screenKey === "symptoms" && <SymptomsScreen />}
            {screenKey === "scope" && <ScopeScreen />}
            {screenKey === "location" && <LocationScreen />}
            {screenKey === "contact" && <ContactScreen />}
            {screenKey === "extra" && <ExtraScreen />}
            {screenKey === "summary" && <SummaryScreen />}
            {screenKey === "success" && <SuccessScreen />}
          </div>

          {showFooterNav ? (
            <div className="sticky bottom-0 z-[2] flex items-center justify-between gap-3 border-t border-white/8 bg-[rgba(10,13,18,0.92)] px-4 py-3.5 pb-[calc(env(safe-area-inset-bottom)+14px)] backdrop-blur-md">
              <button
                type="button"
                onClick={prev}
                className="inline-flex h-12 items-center gap-1.5 rounded-[14px] border border-white/12 bg-white/[0.04] px-4 text-[14.5px] font-semibold text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white"
              >
                <ArrowLeft className="size-4" />
                {backLabel}
              </button>
              {showNext ? (
                <button
                  type="button"
                  onClick={next}
                  className="public-button-primary inline-flex h-12 items-center gap-2 rounded-[14px] px-6 text-[15px] font-semibold"
                >
                  {nextLabel}
                  <ArrowRight className="size-4" />
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
