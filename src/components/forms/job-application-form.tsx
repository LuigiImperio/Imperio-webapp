"use client"

import { type ChangeEvent, useState } from "react"

import {
  FormFieldLabel,
  FormFieldMessage,
  formBusyPanelClassName,
  formDashedInfoClassName,
  formErrorPanelClassName,
  formErrorTextClassName,
  formFileMetaTextClassName,
  formFileRemoveButtonClassName,
  formInfoPanelClassName,
  formMainCardClassName,
  formSuccessBodyTextClassName,
  formSuccessPanelClassName,
  formUploadButtonClassName,
  getFormInputClassName,
} from "@/components/forms/form-ui"
import {
  jobApplicationMaxCvSizeBytes,
  validateJobApplicationCvFile,
} from "@/lib/job-applications/job-application-media"
import {
  submitJobApplication,
  type JobApplicationFormData,
} from "@/lib/job-applications/job-applications"
import { getUserFacingErrorMessage, logClientError } from "@/lib/logging"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type FieldName =
  | "fullName"
  | "email"
  | "phone"
  | "motivationText"
  | "interestArea"
  | "note"
  | "cvFile"

type SubmitStatus = "idle" | "submitting" | "success" | "error"
type ErrorState = Partial<Record<FieldName, string>>

const initialFormData: JobApplicationFormData = {
  fullName: "",
  email: "",
  phone: "",
  motivationText: "",
  interestArea: "",
  note: "",
}

function formatFileSize(fileSizeBytes: number) {
  if (fileSizeBytes >= 1024 * 1024) {
    return `${(fileSizeBytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return `${Math.max(1, Math.round(fileSizeBytes / 1024))} KB`
}

function validateFormData(formData: JobApplicationFormData, cvFile: File | null) {
  const nextErrors: ErrorState = {}

  if (!formData.fullName.trim()) {
    nextErrors.fullName = "A név megadása kötelező."
  }

  if (!formData.email.trim()) {
    nextErrors.email = "Az e-mail cím megadása kötelező."
  } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
    nextErrors.email = "Kérjük, valós e-mail címet adjon meg."
  }

  if (!formData.phone.trim()) {
    nextErrors.phone = "A telefonszám megadása kötelező."
  }

  if (!formData.motivationText.trim()) {
    nextErrors.motivationText = "A motivációs szöveg megadása kötelező."
  }

  if (!cvFile) {
    nextErrors.cvFile = "Az önéletrajz feltöltése kötelező."
  }

  return nextErrors
}

export function JobApplicationForm() {
  const [formData, setFormData] = useState<JobApplicationFormData>(initialFormData)
  const [selectedCv, setSelectedCv] = useState<File | null>(null)
  const [errors, setErrors] = useState<ErrorState>({})
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle")
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(
    null
  )
  const [customerConfirmationSent, setCustomerConfirmationSent] =
    useState(false)

  const isSubmitting = submitStatus === "submitting"
  const isSuccess = submitStatus === "success"
  const isError = submitStatus === "error"

  function clearFeedback() {
    setSubmitStatus("idle")
    setSubmitErrorMessage(null)
    setCustomerConfirmationSent(false)
  }

  function updateField(field: keyof JobApplicationFormData, value: string) {
    clearFeedback()
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }))
  }

  function handleCvSelection(event: ChangeEvent<HTMLInputElement>) {
    clearFeedback()

    const file = event.target.files?.[0] ?? null

    if (!file) {
      return
    }

    try {
      validateJobApplicationCvFile(file)
      setSelectedCv(file)
      setErrors((current) => ({
        ...current,
        cvFile: undefined,
      }))
    } catch (error) {
      setSelectedCv(null)
      setErrors((current) => ({
        ...current,
        cvFile: getUserFacingErrorMessage(
          error,
          "Az önéletrajz feltöltése most nem sikerült."
        ),
      }))
    } finally {
      event.target.value = ""
    }
  }

  function removeSelectedCv() {
    clearFeedback()
    setSelectedCv(null)
  }

  async function handleSubmit() {
    if (isSubmitting || isSuccess) {
      return
    }

    const nextErrors = validateFormData(formData, selectedCv)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0 || !selectedCv) {
      return
    }

    try {
      setSubmitStatus("submitting")
      setSubmitErrorMessage(null)

      const submission = await submitJobApplication({
        formData,
        cvFile: selectedCv,
      })

      setCustomerConfirmationSent(submission.customerConfirmationSent)
      setSubmitStatus("success")
    } catch (error) {
      logClientError("Munkajelentkezés beküldési hiba", error)
      setSubmitStatus("error")
      setSubmitErrorMessage(
        getUserFacingErrorMessage(
          error,
          "A jelentkezés elküldése most nem sikerült. Kérjük, próbálja meg újra."
        )
      )
    }
  }

  function getFieldState(field: FieldName) {
    if (field === "cvFile") {
      return {
        filled: Boolean(selectedCv),
        invalid: Boolean(errors.cvFile),
      }
    }

    const value = formData[field as keyof JobApplicationFormData]

    return {
      filled: Boolean(value.trim()),
      invalid: Boolean(errors[field]),
    }
  }

  return (
    <Card className={formMainCardClassName}>
      <CardHeader className="border-b border-white/10 p-4 sm:p-6">
        <CardTitle className="text-[1.35rem] text-white sm:text-2xl">Jelentkezés elküldése</CardTitle>
        <p className="mt-2 max-w-2xl text-[0.92rem] leading-6 text-zinc-300 sm:text-sm">
          Akkor is elküldheti jelentkezését, ha jelenleg nincs nyitott pozíció.
          Ha később megfelelő lehetőség nyílik, a most beérkezett anyag is
          előkerülhet.
        </p>
      </CardHeader>

      <CardContent className="space-y-5 pt-4 sm:space-y-6 sm:pt-6">
        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          <div className="space-y-2">
            <FormFieldLabel label="Név" required />
            <Input
              value={formData.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              disabled={isSubmitting}
              className={getFormInputClassName(getFieldState("fullName"))}
            />
            {errors.fullName ? <FormFieldMessage message={errors.fullName} /> : null}
          </div>

          <div className="space-y-2">
            <FormFieldLabel label="E-mail" required />
            <Input
              type="email"
              value={formData.email}
              onChange={(event) => updateField("email", event.target.value)}
              disabled={isSubmitting}
              className={getFormInputClassName(getFieldState("email"))}
            />
            {errors.email ? <FormFieldMessage message={errors.email} /> : null}
          </div>

          <div className="space-y-2">
            <FormFieldLabel label="Telefonszám" required />
            <Input
              value={formData.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              disabled={isSubmitting}
              className={getFormInputClassName(getFieldState("phone"))}
            />
            {errors.phone ? <FormFieldMessage message={errors.phone} /> : null}
          </div>

          <div className="space-y-2">
            <FormFieldLabel label="Milyen terület érdekelné" />
            <Input
              value={formData.interestArea}
              onChange={(event) =>
                updateField("interestArea", event.target.value)
              }
              disabled={isSubmitting}
              className={getFormInputClassName(getFieldState("interestArea"))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <FormFieldLabel label="Motivációs levél vagy rövid motivációs szöveg" required />
          <Textarea
            value={formData.motivationText}
            onChange={(event) =>
              updateField("motivationText", event.target.value)
            }
            disabled={isSubmitting}
            className={cn(
              "min-h-36",
              getFormInputClassName(getFieldState("motivationText"))
            )}
          />
          {errors.motivationText ? (
            <FormFieldMessage message={errors.motivationText} />
          ) : null}
        </div>

        <div className="space-y-2">
          <FormFieldLabel label="Megjegyzés" />
          <Textarea
            value={formData.note}
            onChange={(event) => updateField("note", event.target.value)}
            disabled={isSubmitting}
            className={cn("min-h-28", getFormInputClassName(getFieldState("note")))}
          />
        </div>

        <div className="space-y-3 rounded-[1.35rem] border border-white/10 bg-zinc-950/45 p-4 md:rounded-3xl md:p-5">
          <div className="space-y-2">
            <FormFieldLabel label="Önéletrajz feltöltése" required />
            <p className="text-sm leading-6 text-zinc-400">
              PDF, DOC, DOCX, ODT vagy RTF fájl tölthető fel, legfeljebb{" "}
              {Math.round(jobApplicationMaxCvSizeBytes / (1024 * 1024))} MB
              méretben.
            </p>
          </div>

          <label className={formUploadButtonClassName}>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.odt,.rtf,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text,application/rtf,text/rtf"
              disabled={isSubmitting}
              onChange={handleCvSelection}
              className="sr-only"
            />
            Önéletrajz kiválasztása
          </label>

          {selectedCv ? (
            <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-zinc-950/56 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-100">
                  {selectedCv.name}
                </p>
                <p className={formFileMetaTextClassName}>
                  {formatFileSize(selectedCv.size)}
                </p>
              </div>

              <button
                type="button"
                onClick={removeSelectedCv}
                disabled={isSubmitting}
                className={formFileRemoveButtonClassName}
              >
                Eltávolítás
              </button>
            </div>
          ) : (
            <div className={formDashedInfoClassName}>
              Jelenleg nincs kiválasztott önéletrajz.
            </div>
          )}

          {errors.cvFile ? <FormFieldMessage message={errors.cvFile} /> : null}
        </div>

        {isSubmitting ? (
          <div className={formBusyPanelClassName}>
            <div className="flex items-start gap-4">
              <div className="mt-1 h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              <div>
                <p className="text-base font-medium text-white">
                  A jelentkezés és az önéletrajz feldolgozása folyamatban van.
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  A megadott adatok és a csatolt önéletrajz mentése most történik.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {isSuccess ? (
          <div className="space-y-4">
            <div className={formSuccessPanelClassName}>
              <p className="text-base font-medium text-emerald-50">
                A jelentkezés sikeresen beérkezett.
              </p>
              <p className={formSuccessBodyTextClassName}>
                Jelentkezését rögzítettük, és a későbbiekben is figyelembe
                vehetjük, ha megfelelő lehetőség nyílik.
              </p>
            </div>

            <div className={formInfoPanelClassName}>
              <p className="text-sm font-medium text-white">
                Visszaigazolás
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                {customerConfirmationSent
                  ? "A megadott e-mail címre visszaigazolást is küldtünk."
                  : "Ha a visszaigazoló e-mail nem érkezik meg rövid időn belül, attól a jelentkezés még sikeresen beérkezhetett."}
              </p>
            </div>
          </div>
        ) : null}

        {isError ? (
          <div className={formErrorPanelClassName}>
            <p className="text-base font-medium text-rose-50">
              A jelentkezés elküldése most nem sikerült.
            </p>
            <p className={formErrorTextClassName}>
              {submitErrorMessage ??
                "Kérjük, próbálja meg újra néhány perc múlva."}
            </p>
          </div>
        ) : null}

        {!isSubmitting && !isSuccess && !isError ? (
          <div className={formInfoPanelClassName}>
            <p className="text-sm font-medium text-white">
              Egyszerű, közvetlen jelentkezési csatorna
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              Ha most még nincs is nyitott lehetőség, a beérkezett anyag később
              is előkerülhet, amikor releváns szakmai igény merül fel.
            </p>
          </div>
        ) : null}

        <div className="flex justify-end border-t border-white/10 pt-5 sm:pt-6">
          <Button
            type="button"
            size="lg"
            onClick={handleSubmit}
            disabled={isSubmitting || isSuccess}
            className="min-h-10 w-full rounded-2xl bg-white px-4 text-[0.92rem] text-zinc-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-200 sm:min-h-11 sm:w-auto sm:px-5 sm:text-sm"
          >
            {isSubmitting
              ? "Jelentkezés küldése..."
              : isSuccess
                ? "Jelentkezés rögzítve"
                : isError
                  ? "Újrapróbálás"
                  : "Jelentkezés elküldése"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
