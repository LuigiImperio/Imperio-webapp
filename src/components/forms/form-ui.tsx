"use client"

import Link from "next/link"
import { useId, useState } from "react"

import { privacyPolicyPath } from "@/lib/legal"
import { cn } from "@/lib/utils"

export function getFormInputClassName({
  filled,
  invalid,
}: {
  filled: boolean
  invalid: boolean
}) {
  return cn(
    "border-white/12 bg-zinc-950/78 text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] placeholder:text-zinc-400 transition-[border-color,background-color,box-shadow,color] duration-200 focus-visible:border-white/22 focus-visible:bg-zinc-950 focus-visible:text-white focus-visible:shadow-[0_0_0_4px_rgba(255,255,255,0.05)] focus-visible:ring-0 disabled:border-white/8 disabled:bg-zinc-950/50 disabled:text-zinc-400 disabled:placeholder:text-zinc-500 disabled:shadow-none [color-scheme:dark] [&:-webkit-autofill]:[-webkit-text-fill-color:#f4f4f5] [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgba(9,9,11,0.94)] [&:-webkit-autofill:hover]:shadow-[inset_0_0_0px_1000px_rgba(9,9,11,0.94)] [&:-webkit-autofill:focus]:shadow-[inset_0_0_0px_1000px_rgba(9,9,11,0.94)]",
    filled && !invalid && "border-white/16 bg-zinc-900/82 text-zinc-50",
    invalid &&
      "border-rose-400/55 bg-rose-950/35 text-rose-50 placeholder:text-rose-200/70 focus-visible:border-rose-300 focus-visible:bg-rose-950/40 focus-visible:shadow-[0_0_0_4px_rgba(244,63,94,0.16)]"
  )
}

export function FormFieldLabel({
  label,
  required = false,
}: {
  label: string
  required?: boolean
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium leading-6 tracking-tight text-zinc-50">
        {label}
      </span>
      <span
        className={cn(
          "rounded-full border px-2 py-0.5 text-[11px] tracking-wide",
          required
            ? "border-white/12 bg-white/[0.07] text-zinc-200"
            : "border-white/10 bg-white/[0.04] text-zinc-400"
        )}
      >
        {required ? "Kötelező" : "Opcionális"}
      </span>
    </div>
  )
}

export function FormFieldMessage({
  message,
  tone = "error",
}: {
  message: string
  tone?: "error" | "muted"
}) {
  return (
    <p
      className={cn(
        "text-sm leading-6",
        tone === "error" ? "text-rose-200" : "text-zinc-300"
      )}
    >
      {message}
    </p>
  )
}

export function useRequiredPrivacyConsent() {
  const [privacyConsentAccepted, setPrivacyConsentAcceptedState] = useState(false)
  const [privacyConsentError, setPrivacyConsentError] = useState<string | null>(
    null
  )

  function setPrivacyConsentAccepted(nextValue: boolean) {
    setPrivacyConsentAcceptedState(nextValue)

    if (nextValue) {
      setPrivacyConsentError(null)
    }
  }

  function validatePrivacyConsent() {
    if (privacyConsentAccepted) {
      setPrivacyConsentError(null)
      return true
    }

    setPrivacyConsentError(
      "A küldéshez fogadja el az adatkezelési tájékoztatót."
    )

    return false
  }

  return {
    privacyConsentAccepted,
    privacyConsentError,
    setPrivacyConsentAccepted,
    validatePrivacyConsent,
  }
}

export function FormPrivacyConsentField({
  checked,
  error,
  disabled = false,
  onCheckedChange,
}: {
  checked: boolean
  error?: string | null
  disabled?: boolean
  onCheckedChange: (nextValue: boolean) => void
}) {
  const consentId = useId()

  return (
    <div className="rounded-[1.35rem] border border-white/10 bg-zinc-950/52 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] md:rounded-3xl md:p-5">
      <div className="flex items-start gap-3">
        <input
          id={consentId}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          onChange={(event) => onCheckedChange(event.target.checked)}
          className={cn(
            "mt-1 size-4 rounded border border-white/18 bg-zinc-950/90 accent-[#f0dfbe] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 disabled:cursor-not-allowed disabled:opacity-60",
            error && "border-rose-400/60 accent-rose-200"
          )}
        />

        <div className="space-y-2">
          <div className="text-sm leading-6 text-zinc-200">
            <label htmlFor={consentId} className="cursor-pointer">
              Elfogadom az{" "}
            </label>
            <Link
              href={privacyPolicyPath}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors hover:text-zinc-100 hover:decoration-white/60"
            >
              adatkezelési tájékoztatót
            </Link>
            <label htmlFor={consentId} className="cursor-pointer">
              .
            </label>
          </div>

          <p className="text-sm leading-6 text-zinc-300">
            Az adatait csak a megkereséshez használjuk, és nem adjuk tovább.
          </p>
        </div>
      </div>

      {error ? (
        <div className="mt-3">
          <FormFieldMessage message={error} />
        </div>
      ) : null}
    </div>
  )
}

export function FormUploadPrivacyNote() {
  return (
    <p className="text-sm leading-6 text-zinc-300">
      Csak a feladathoz tartozó képeket töltse fel. Ezeket csak a megkereséshez
      használjuk.
    </p>
  )
}

export function FormOptionGroup({
  label,
  options,
  value,
  error,
  required = false,
  disabled = false,
  onChange,
}: {
  label: string
  options: readonly string[]
  value: string
  error?: string
  required?: boolean
  disabled?: boolean
  onChange: (nextValue: string) => void
}) {
  return (
    <div className="space-y-3">
      <FormFieldLabel label={label} required={required} />
      <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
        {options.map((option) => {
          const isActive = value === option

          return (
            <button
              key={option}
              type="button"
              aria-pressed={isActive}
              disabled={disabled}
              onClick={() => onChange(option)}
              className={cn(
                "rounded-[1.15rem] border px-3.5 py-3 text-left text-sm font-medium leading-6 transition-[border-color,background-color,color,transform,box-shadow] duration-300 disabled:cursor-not-allowed disabled:border-white/8 disabled:bg-zinc-950/40 disabled:text-zinc-500 sm:px-4",
                isActive
                  ? "border-white/28 bg-white/[0.96] text-zinc-950 shadow-[0_14px_30px_rgba(255,255,255,0.08)]"
                  : "border-white/10 bg-zinc-950/48 text-zinc-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] hover:-translate-y-0.5 hover:border-white/18 hover:bg-white/[0.06] hover:text-white",
                error &&
                  !isActive &&
                  "border-rose-400/40 bg-rose-950/25 text-rose-100"
              )}
            >
              {option}
            </button>
          )
        })}
      </div>
      {error ? <FormFieldMessage message={error} /> : null}
    </div>
  )
}

export const formSubtlePanelClassName =
  "rounded-[1.35rem] border border-white/10 bg-[linear-gradient(180deg,rgba(39,39,42,0.52),rgba(24,24,27,0.68))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] md:rounded-3xl md:p-5"

export const formMutedPanelClassName =
  "rounded-[1.35rem] border border-white/10 bg-zinc-950/52 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] md:rounded-3xl md:p-5"

export const formDashedInfoClassName =
  "rounded-2xl border border-dashed border-white/10 bg-zinc-950/55 px-4 py-3 text-sm leading-6 text-zinc-200"

export const formFileCardClassName =
  "rounded-2xl border border-white/10 bg-zinc-950/60 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"

export const formFileMetaTextClassName = "mt-1 text-sm text-zinc-300"

export const formAsideCardClassName =
  "overflow-hidden border-white/10 bg-[linear-gradient(180deg,rgba(39,39,42,0.88),rgba(24,24,27,0.82))] text-white shadow-[0_20px_60px_rgba(0,0,0,0.26)] backdrop-blur-xl"

export const formMainCardClassName =
  "overflow-hidden border-white/10 bg-[linear-gradient(180deg,rgba(39,39,42,0.9),rgba(24,24,27,0.86))] text-white shadow-[0_22px_70px_rgba(0,0,0,0.3)] backdrop-blur-xl"

export const formEyebrowClassName =
  "inline-flex w-fit rounded-full border border-amber-100/15 bg-amber-100/[0.08] px-3 py-1 text-xs tracking-wide text-amber-50/90"

export const formStepEyebrowClassName =
  "inline-flex rounded-full border border-amber-100/15 bg-amber-100/[0.08] px-3 py-1 text-xs tracking-wide text-amber-50/90"

export const formLeadTextClassName = "text-sm leading-6 text-zinc-300"

export const formSectionBodyTextClassName =
  "mt-2 text-sm leading-6 text-zinc-300"

export const formSupportPanelClassName =
  "rounded-2xl border border-white/10 bg-zinc-950/56 px-4 py-3 text-sm leading-6 text-zinc-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"

export const formProgressMetaClassName =
  "flex flex-wrap items-center justify-between gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-300/85"

export const formProgressTrackClassName =
  "h-2 overflow-hidden rounded-full bg-white/7"

export const formStepCardActiveClassName =
  "border-white/18 bg-[linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_16px_34px_rgba(0,0,0,0.14)]"

export const formStepCardIdleClassName =
  "border-white/10 bg-zinc-950/46 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"

export const formStepDescriptionClassName =
  "mt-1 text-[0.8rem] leading-5 text-zinc-300 md:text-sm md:leading-6"

export const formCounterPillClassName =
  "inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-zinc-950/56 px-3.5 py-1.5 text-[0.88rem] text-zinc-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:px-4 md:py-2 md:text-sm"

export const formSummaryLabelClassName =
  "text-xs uppercase tracking-[0.18em] text-zinc-300/75"

export const formWarningPanelClassName =
  "rounded-[1.35rem] border border-amber-300/25 bg-[linear-gradient(180deg,rgba(251,191,36,0.14),rgba(251,191,36,0.08))] p-4 md:rounded-3xl md:p-5"

export const formWarningTextClassName =
  "mt-2 text-sm leading-6 text-amber-50/90"

export const formWarningListClassName =
  "mt-3 space-y-2 text-sm leading-6 text-amber-50/90"

export const formInfoPanelClassName =
  "rounded-[1.35rem] border border-white/10 bg-zinc-950/52 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] md:rounded-3xl md:p-5"

export const formBusyPanelClassName =
  "rounded-[1.35rem] border border-white/10 bg-zinc-950/56 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] md:rounded-3xl md:p-6"

export const formSuccessPanelClassName =
  "rounded-[1.35rem] border border-emerald-400/30 bg-[linear-gradient(135deg,rgba(52,211,153,0.18),rgba(5,150,105,0.1))] p-4 shadow-[0_18px_46px_rgba(16,185,129,0.1)] md:rounded-3xl md:p-6"

export const formSuccessBodyTextClassName =
  "mt-2 text-sm leading-6 text-emerald-50/90"

export const formErrorPanelClassName =
  "rounded-[1.35rem] border border-rose-400/25 bg-[linear-gradient(180deg,rgba(244,63,94,0.14),rgba(225,29,72,0.08))] p-4 md:rounded-3xl md:p-6"

export const formErrorTextClassName =
  "mt-2 text-sm leading-6 text-rose-50/90"

export const formFileRemoveButtonClassName =
  "inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-zinc-200 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"

export const formUploadButtonClassName =
  "inline-flex w-full cursor-pointer items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-zinc-100 transition-colors hover:border-white/30 hover:bg-white/[0.08] hover:text-white sm:w-fit"

export const formSelectedFileRowClassName =
  "flex flex-col gap-3 rounded-2xl border border-white/10 bg-zinc-950/56 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:flex-row sm:items-center sm:justify-between"

export const formSecondaryButtonClassName =
  "min-h-10 w-full rounded-2xl border-white/15 bg-white/[0.03] text-[0.92rem] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white sm:min-h-11 sm:w-auto sm:text-sm"
