"use client"

import { type ChangeEvent, useState } from "react"

import {
  formAsideCardClassName,
  formBusyPanelClassName,
  formCounterPillClassName,
  formDashedInfoClassName,
  formErrorPanelClassName,
  formErrorTextClassName,
  formEyebrowClassName,
  formFileCardClassName,
  formFileMetaTextClassName,
  formFileRemoveButtonClassName,
  formInfoPanelClassName,
  FormFieldLabel,
  FormFieldMessage,
  formLeadTextClassName,
  formMainCardClassName,
  formProgressMetaClassName,
  formProgressTrackClassName,
  formSecondaryButtonClassName,
  formSelectedFileRowClassName,
  formStepCardActiveClassName,
  formStepCardIdleClassName,
  formStepDescriptionClassName,
  formStepEyebrowClassName,
  formSubtlePanelClassName,
  formSuccessBodyTextClassName,
  formSuccessPanelClassName,
  formSummaryLabelClassName,
  formSupportPanelClassName,
  formUploadButtonClassName,
  formWarningListClassName,
  formWarningPanelClassName,
  formWarningTextClassName,
  FormOptionGroup,
  getFormInputClassName,
} from "@/components/forms/form-ui"
import { useStepTransitionScroll } from "@/components/forms/use-step-transition-scroll"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useFormTracking } from "@/lib/analytics/use-form-tracking"
import { getUserFacingErrorMessage, logClientError } from "@/lib/logging"
import {
  appointmentWindowOptions,
  preferredContactTimeOptions,
  siteVisitNeedOptions,
} from "@/lib/service-requests/request-options"
import {
  submitLeakRequestServiceRequest,
  type LeakRequestInquiryData,
  uploadServiceRequestImages,
} from "@/lib/supabase/service-requests"
import {
  getServiceAreaAssessment,
  getServiceAreaUserMessage,
} from "@/lib/service-area"
import {
  serviceRequestMaxImageCount,
  type ServiceRequestAttachmentInsert,
} from "@/lib/supabase/service-request-media"
import { cn } from "@/lib/utils"

const steps = [
  {
    title: "Helyzetfelmérés",
    description:
      "Néhány gyors válasszal jobban látszik, mennyire sürgős a helyzet és melyik területet érinti a hiba.",
  },
  {
    title: "Helyszín és kapcsolat",
    description:
      "A helyszín, az elérhetőség és az opcionális képek segítenek a gyorsabb első visszajelzésben.",
  },
  {
    title: "Összegzés",
    description:
      "A véglegesítés előtt egy helyen áttekinthető minden megadott információ.",
  },
] as const

const leakActiveOptions = [
  "Igen, jelenleg is aktív",
  "Időszakos vagy bizonytalan",
  "Jelenleg nem aktív",
] as const

const waterShutOffOptions = [
  "Igen, sikerült elzárni",
  "Részben sikerült",
  "Nem sikerült",
  "Nem tudom",
] as const

const affectedAreaOptions = [
  "Fürdőszoba",
  "Konyha",
  "Kazánház vagy gépészeti tér",
  "Falban vagy padlóban",
  "Kültéri vezeték",
  "Nem tudom pontosan",
  "Egyéb",
] as const

const leakVisibilityOptions = [
  "Látható szivárgás",
  "Rejtettnek tűnik",
  "Mindkettő lehetséges",
  "Nem tudom megítélni",
] as const

const damageLevelOptions = [
  "Nincs látható kárterület",
  "Kisebb nedvesedés vagy beázás látható",
  "Jelentősebb kárterület is van",
  "Nem tudom megítélni",
] as const

type StepIndex = 0 | 1 | 2
type SubmitStatus = "idle" | "submitting" | "success" | "error"
type UploadStatus = "idle" | "uploading" | "success" | "error"

type FieldName =
  | "leakActive"
  | "waterShutOff"
  | "affectedArea"
  | "leakVisibility"
  | "damageLevel"
  | "description"
  | "postalCode"
  | "city"
  | "name"
  | "phone"
  | "email"
  | "preferredContactTime"
  | "siteVisitNeed"
  | "appointmentWindow"
  | "schedulingNote"
  | "notes"

type ErrorState = Partial<Record<FieldName, string>>
type TouchedState = Partial<Record<FieldName, boolean>>

const initialFormState: LeakRequestInquiryData = {
  issue: {
    leakActive: "",
    waterShutOff: "",
    affectedArea: "",
    leakVisibility: "",
    damageLevel: "",
    description: "",
  },
  location: {
    postalCode: "",
    city: "",
  },
  contact: {
    name: "",
    phone: "",
    email: "",
    preferredContactTime: "",
    notes: "",
  },
  scheduling: {
    siteVisitNeed: "",
    appointmentWindow: "",
    schedulingNote: "",
  },
}

const fieldLabels: Record<FieldName, string> = {
  leakActive: "Aktív-e még a szivárgás?",
  waterShutOff: "Elzárható volt-e a víz?",
  affectedArea: "Melyik helyiséget vagy rendszert érinti?",
  leakVisibility: "Látható vagy rejtett a hiba?",
  damageLevel: "Van-e beázás vagy kárterület?",
  description: "Rövid leírás",
  postalCode: "Irányítószám",
  city: "Település",
  name: "Név",
  phone: "Telefonszám",
  email: "E-mail",
  preferredContactTime: "Mikor kereshető a legkönnyebben?",
  siteVisitNeed: "Szükséges lehet helyszíni felmérés?",
  appointmentWindow: "Mikor lenne megfelelő az egyeztetés vagy felmérés?",
  schedulingNote: "Kapcsolódó megjegyzés",
  notes: "Opcionális megjegyzés",
}

const requiredFieldsByStep = [
  [
    "leakActive",
    "waterShutOff",
    "affectedArea",
    "leakVisibility",
    "damageLevel",
    "description",
  ],
  [
    "postalCode",
    "city",
    "name",
    "phone",
    "email",
    "preferredContactTime",
    "siteVisitNeed",
    "appointmentWindow",
  ],
  [],
] as const satisfies ReadonlyArray<ReadonlyArray<FieldName>>

const summarySections = [
  {
    title: "Helyzetfelmérés",
    fields: [
      "leakActive",
      "waterShutOff",
      "affectedArea",
      "leakVisibility",
      "damageLevel",
      "description",
    ],
  },
  {
    title: "Helyszín és kapcsolat",
    fields: [
      "postalCode",
      "city",
      "name",
      "phone",
      "email",
      "preferredContactTime",
      "notes",
    ],
  },
  {
    title: "Egyeztetés és felmérés",
    fields: ["siteVisitNeed", "appointmentWindow", "schedulingNote"],
  },
] as const satisfies ReadonlyArray<{
  title: string
  fields: ReadonlyArray<FieldName>
}>

function formatFileSize(fileSizeBytes: number) {
  if (fileSizeBytes >= 1024 * 1024) {
    return `${(fileSizeBytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return `${Math.max(1, Math.round(fileSizeBytes / 1024))} KB`
}

function getFieldValue(formData: LeakRequestInquiryData, field: FieldName) {
  switch (field) {
    case "leakActive":
      return formData.issue.leakActive
    case "waterShutOff":
      return formData.issue.waterShutOff
    case "affectedArea":
      return formData.issue.affectedArea
    case "leakVisibility":
      return formData.issue.leakVisibility
    case "damageLevel":
      return formData.issue.damageLevel
    case "description":
      return formData.issue.description
    case "postalCode":
      return formData.location.postalCode
    case "city":
      return formData.location.city
    case "name":
      return formData.contact.name
    case "phone":
      return formData.contact.phone
    case "email":
      return formData.contact.email
    case "preferredContactTime":
      return formData.contact.preferredContactTime
    case "siteVisitNeed":
      return formData.scheduling.siteVisitNeed
    case "appointmentWindow":
      return formData.scheduling.appointmentWindow
    case "schedulingNote":
      return formData.scheduling.schedulingNote
    case "notes":
      return formData.contact.notes
  }
}

function setFieldValue(
  formData: LeakRequestInquiryData,
  field: FieldName,
  value: string
) {
  switch (field) {
    case "leakActive":
      return {
        ...formData,
        issue: {
          ...formData.issue,
          leakActive: value,
        },
      }
    case "waterShutOff":
      return {
        ...formData,
        issue: {
          ...formData.issue,
          waterShutOff: value,
        },
      }
    case "affectedArea":
      return {
        ...formData,
        issue: {
          ...formData.issue,
          affectedArea: value,
        },
      }
    case "leakVisibility":
      return {
        ...formData,
        issue: {
          ...formData.issue,
          leakVisibility: value,
        },
      }
    case "damageLevel":
      return {
        ...formData,
        issue: {
          ...formData.issue,
          damageLevel: value,
        },
      }
    case "description":
      return {
        ...formData,
        issue: {
          ...formData.issue,
          description: value,
        },
      }
    case "postalCode":
      return {
        ...formData,
        location: {
          ...formData.location,
          postalCode: value,
        },
      }
    case "city":
      return {
        ...formData,
        location: {
          ...formData.location,
          city: value,
        },
      }
    case "name":
      return {
        ...formData,
        contact: {
          ...formData.contact,
          name: value,
        },
      }
    case "phone":
      return {
        ...formData,
        contact: {
          ...formData.contact,
          phone: value,
        },
      }
    case "email":
      return {
        ...formData,
        contact: {
          ...formData.contact,
          email: value,
        },
      }
    case "preferredContactTime":
      return {
        ...formData,
        contact: {
          ...formData.contact,
          preferredContactTime: value,
        },
      }
    case "siteVisitNeed":
      return {
        ...formData,
        scheduling: {
          ...formData.scheduling,
          siteVisitNeed: value,
        },
      }
    case "appointmentWindow":
      return {
        ...formData,
        scheduling: {
          ...formData.scheduling,
          appointmentWindow: value,
        },
      }
    case "schedulingNote":
      return {
        ...formData,
        scheduling: {
          ...formData.scheduling,
          schedulingNote: value,
        },
      }
    case "notes":
      return {
        ...formData,
        contact: {
          ...formData.contact,
          notes: value,
        },
      }
  }
}

function validateField(field: FieldName, formData: LeakRequestInquiryData) {
  const value = getFieldValue(formData, field).trim()

  switch (field) {
    case "leakActive":
      return value ? "" : "Jelölje, hogy aktív-e még a szivárgás."
    case "waterShutOff":
      return value ? "" : "Jelölje, hogy elzárható volt-e a víz."
    case "affectedArea":
      return value ? "" : "Válassza ki az érintett helyiséget vagy rendszert."
    case "leakVisibility":
      return value ? "" : "Jelölje, hogy látható vagy rejtett a hiba."
    case "damageLevel":
      return value ? "" : "Jelölje, hogy van-e beázás vagy kárterület."
    case "description":
      return value ? "" : "Írja le röviden a helyzetet."
    case "postalCode":
      if (!value) {
        return "Adja meg az irányítószámot."
      }

      return /^\d{4}$/.test(value)
        ? ""
        : "4 számjegyű irányítószámot adjon meg."
    case "city":
      return value ? "" : "Adja meg a települést."
    case "name":
      return value ? "" : "Adja meg a nevét."
    case "phone": {
      if (!value) {
        return "Adja meg a telefonszámát."
      }

      const digitsOnly = value.replace(/\D/g, "")

      return digitsOnly.length >= 7
        ? ""
        : "Adjon meg használható telefonszámot."
    }
    case "email": {
      if (!value) {
        return "Adja meg az e-mail-címét."
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      return emailPattern.test(value)
        ? ""
        : "Adjon meg érvényes e-mail-címet."
    }
    case "preferredContactTime":
      return value ? "" : "Válassza ki, mikor kereshető a legkönnyebben."
    case "siteVisitNeed":
      return value ? "" : "Jelölje, szükséges lehet-e helyszíni felmérés."
    case "appointmentWindow":
      return value
        ? ""
        : "Válassza ki, mikor lenne megfelelő az egyeztetés vagy felmérés."
    case "schedulingNote":
      return ""
    case "notes":
      return ""
  }
}

function validateFields(
  fields: readonly FieldName[],
  formData: LeakRequestInquiryData
) {
  return fields.reduce<ErrorState>((accumulator, field) => {
    const error = validateField(field, formData)

    if (error) {
      accumulator[field] = error
    }

    return accumulator
  }, {})
}

function getMergedErrors(
  currentErrors: ErrorState,
  fields: readonly FieldName[],
  nextErrors: ErrorState
) {
  const updatedErrors = { ...currentErrors }

  fields.forEach((field) => {
    delete updatedErrors[field]
  })

  return {
    ...updatedErrors,
    ...nextErrors,
  }
}

export function LeakRequestForm() {
  const [currentStep, setCurrentStep] = useState<StepIndex>(0)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle")
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle")
  const [uploadedAttachments, setUploadedAttachments] = useState<
    ServiceRequestAttachmentInsert[]
  >([])
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(
    null
  )
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(
    null
  )
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imageSelectionMessage, setImageSelectionMessage] = useState<
    string | null
  >(null)
  const [formData, setFormData] = useState<LeakRequestInquiryData>(initialFormState)
  const [errors, setErrors] = useState<ErrorState>({})
  const [touchedFields, setTouchedFields] = useState<TouchedState>({})
  const { trackFormStarted, trackStepCompleted, trackSubmitSuccess } =
    useFormTracking({
      serviceType: "csotores_szivargas",
      sourcePage: "csotores-szivargas",
      totalSteps: steps.length,
    })

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1
  const isSubmitting = submitStatus === "submitting"
  const isSuccess = submitStatus === "success"
  const isError = submitStatus === "error"
  const { formTopRef, scrollToFormTop } =
    useStepTransitionScroll<HTMLDivElement>()
  const hasSelectedImages = selectedImages.length > 0
  const progress = ((currentStep + 1) / steps.length) * 100
  const currentStepFields = requiredFieldsByStep[currentStep]
  const currentStepErrors = currentStepFields
    .filter((field) => Boolean(errors[field]))
    .map((field) => ({
      field,
      message: errors[field] ?? "",
    }))
  const serviceAreaAssessment = getServiceAreaAssessment(formData.location.city)

  function clearSubmissionFeedback() {
    setSubmitStatus("idle")
    setUploadStatus("idle")
    setUploadErrorMessage(null)
    setSubmitErrorMessage(null)
    setUploadedAttachments([])
  }

  function markFieldsTouched(fields: readonly FieldName[]) {
    setTouchedFields((current) => ({
      ...current,
      ...Object.fromEntries(fields.map((field) => [field, true])),
    }))
  }

  function updateField(
    field: FieldName,
    value: string,
    options?: { touch?: boolean }
  ) {
    trackFormStarted({
      step_index: currentStep + 1,
      step_name: steps[currentStep].title,
      interacted_field: field,
      source_section: "form",
    })
    clearSubmissionFeedback()

    const nextFormData = setFieldValue(formData, field, value)

    setFormData(nextFormData)

    if (options?.touch) {
      setTouchedFields((current) => ({
        ...current,
        [field]: true,
      }))
    }

    if (options?.touch || touchedFields[field] || errors[field]) {
      const nextError = validateField(field, nextFormData)

      setErrors((current) => ({
        ...current,
        [field]: nextError || undefined,
      }))
    }
  }

  function handleFieldBlur(field: FieldName) {
    setTouchedFields((current) => ({
      ...current,
      [field]: true,
    }))

    const nextError = validateField(field, formData)

    setErrors((current) => ({
      ...current,
      [field]: nextError || undefined,
    }))
  }

  function handleImageSelection(event: ChangeEvent<HTMLInputElement>) {
    clearSubmissionFeedback()

    const rawFiles = Array.from(event.target.files ?? [])

    if (rawFiles.length === 0) {
      setImageSelectionMessage(null)
      return
    }

    trackFormStarted({
      step_index: currentStep + 1,
      source_section: "form_images",
    })

    const pickedFiles = rawFiles.filter((file) => file.type.startsWith("image/"))
    const availableSlots = serviceRequestMaxImageCount - selectedImages.length
    const acceptedFiles = pickedFiles.slice(0, Math.max(availableSlots, 0))

    if (pickedFiles.length !== rawFiles.length) {
      setImageSelectionMessage(
        "Csak képfájlok választhatók ki a csatolmányokhoz."
      )
    }

    if (availableSlots <= 0) {
      setImageSelectionMessage(
        `Legfeljebb ${serviceRequestMaxImageCount} kép csatolható.`
      )
      event.target.value = ""
      return
    }

    if (pickedFiles.length > acceptedFiles.length) {
      setImageSelectionMessage(
        `Legfeljebb ${serviceRequestMaxImageCount} kép csatolható.`
      )
    } else if (pickedFiles.length === rawFiles.length) {
      setImageSelectionMessage(null)
    }

    setSelectedImages((current) => [...current, ...acceptedFiles])
    event.target.value = ""
  }

  function removeSelectedImage(indexToRemove: number) {
    clearSubmissionFeedback()
    setImageSelectionMessage(null)
    setSelectedImages((current) =>
      current.filter((_, index) => index !== indexToRemove)
    )
  }

  function goToPreviousStep() {
    clearSubmissionFeedback()
    setCurrentStep((current) => Math.max(current - 1, 0) as StepIndex)
  }

  function goToNextStep() {
    const nextErrors = validateFields(currentStepFields, formData)

    markFieldsTouched(currentStepFields)
    setErrors((current) => getMergedErrors(current, currentStepFields, nextErrors))
    clearSubmissionFeedback()

    if (Object.keys(nextErrors).length > 0) {
      scrollToFormTop()
      return
    }

    trackStepCompleted({
      currentStep: currentStep + 1,
      currentStepName: steps[currentStep].title,
      nextStep: currentStep + 2,
      nextStepName: steps[currentStep + 1]?.title,
    })

    setCurrentStep((current) =>
      Math.min(current + 1, steps.length - 1) as StepIndex
    )
    scrollToFormTop()
  }

  async function submitForm() {
    if (isSubmitting || isSuccess) {
      return
    }

    const allRequiredFields = requiredFieldsByStep.flat()
    const nextErrors = validateFields(allRequiredFields, formData)

    markFieldsTouched(allRequiredFields)
    setErrors((current) => getMergedErrors(current, allRequiredFields, nextErrors))

    if (Object.keys(nextErrors).length > 0) {
      if (
        nextErrors.leakActive ||
        nextErrors.waterShutOff ||
        nextErrors.affectedArea ||
        nextErrors.leakVisibility ||
        nextErrors.damageLevel ||
        nextErrors.description
      ) {
        setCurrentStep(0)
      } else {
        setCurrentStep(1)
      }

      setSubmitStatus("idle")
      scrollToFormTop()
      return
    }

    const requestId = crypto.randomUUID()

    try {
      setSubmitStatus("submitting")
      setUploadStatus(hasSelectedImages ? "uploading" : "idle")
      setUploadErrorMessage(null)
      setSubmitErrorMessage(null)

      await submitLeakRequestServiceRequest({
        requestId,
        formData,
      })

      if (selectedImages.length > 0) {
        try {
          const attachments = await uploadServiceRequestImages({
            requestId,
            serviceType: "csotores_szivargas",
            files: selectedImages,
          })

          setUploadedAttachments(attachments)
          setUploadStatus("success")
        } catch (error) {
          logClientError("Csőtörés képfeltöltés hiba", error, {
            serviceType: "csotores_szivargas",
          })

          setUploadStatus("error")
          setUploadErrorMessage(
            getUserFacingErrorMessage(
              error,
              "A megkeresés rögzítve lett, de a képek feltöltése nem sikerült."
            )
          )
        }
      }

      trackSubmitSuccess({
        has_images: hasSelectedImages,
        step_name: steps[steps.length - 1].title,
      })
      setSubmitStatus("success")
    } catch (error) {
      logClientError("Csőtörés mentési hiba", error, {
        serviceType: "csotores_szivargas",
      })

      setSubmitStatus("error")
      setUploadStatus("idle")
      setSubmitErrorMessage(
        getUserFacingErrorMessage(
          error,
          "A csőtöréshez kapcsolódó megkeresés rögzítése most nem sikerült. Kérjük, próbálja meg újra."
        )
      )
    }
  }

  function getFieldError(field: FieldName) {
    return touchedFields[field] ? errors[field] : undefined
  }

  function getFieldState(field: FieldName) {
    const value = getFieldValue(formData, field)
    const invalid = Boolean(getFieldError(field))

    return {
      filled: Boolean(value.trim()),
      invalid,
    }
  }

  const notesValue = formData.contact.notes.trim()
  const schedulingNoteValue = formData.scheduling.schedulingNote.trim()

  return (
    <div
      ref={formTopRef}
      className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-8"
    >
      <aside className="order-2 hidden self-start lg:order-1 lg:block lg:space-y-6 lg:sticky lg:top-24">
        <Card className={formAsideCardClassName}>
          <CardHeader className="space-y-4 p-5 sm:p-6">
            <div className={formEyebrowClassName}>Gyors triage-indítás</div>
            <CardTitle className="text-xl">Csőtörés gyors előszűrése</CardTitle>
            <CardDescription className={formLeadTextClassName}>
              A cél, hogy néhány rövid válaszból gyorsan látszódjon a helyzet
              sürgőssége, az érintett terület és a következő egyeztetéshez
              szükséges alapadat.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-5 pt-0 sm:space-y-5 sm:p-6 sm:pt-0">
            <div className={formSupportPanelClassName}>
              Ez a folyamat sürgősebb csőtöréses vagy szivárgásos helyzetek
              nyugodt, rendezett első rögzítésére készült.
            </div>
            <div className="space-y-2">
              <div className={formProgressMetaClassName}>
                <span>Előrehaladás</span>
                <span>
                  {currentStep + 1} / {steps.length}
                </span>
              </div>
              <div className={formProgressTrackClassName}>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-white via-zinc-200 to-zinc-400 transition-[width] duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              {steps.map((step, index) => {
                const isActive = currentStep === index
                const isCompleted = currentStep > index || (isSuccess && isLastStep)

                return (
                  <div
                    key={step.title}
                    className={cn(
                      "flex items-start gap-3 rounded-2xl border px-3.5 py-3.5 transition-colors sm:px-4 sm:py-4",
                      isActive
                        ? formStepCardActiveClassName
                        : formStepCardIdleClassName
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm",
                        isCompleted
                          ? "border-white/20 bg-white text-zinc-950"
                          : isActive
                            ? "border-white/20 bg-white/10 text-white"
                            : "border-white/10 bg-white/[0.06] text-zinc-200"
                      )}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-white">{step.title}</p>
                      <p className={formStepDescriptionClassName}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </aside>

      <Card className={cn(formMainCardClassName, "order-1 lg:order-2")}>
        <CardHeader className="border-b border-white/10 p-4 sm:p-6">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className={formStepEyebrowClassName}>Aktuális lépés</div>
                <CardTitle className="mt-4 text-2xl">
                  {steps[currentStep].title}
                </CardTitle>
                <CardDescription
                  className={cn("mt-2 max-w-2xl", formLeadTextClassName)}
                >
                  {steps[currentStep].description}
                </CardDescription>
              </div>

              <div className={formCounterPillClassName}>
                <span className="font-medium text-white">{currentStep + 1}</span>
                <span className="text-zinc-400">/</span>
                <span>{steps.length}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 pt-4 sm:space-y-7 sm:pt-5 md:space-y-8 md:pt-6">
          {currentStepErrors.length > 0 && !isLastStep ? (
            <div className={formWarningPanelClassName}>
              <p className="text-sm font-medium text-amber-100">
                A továbblépéshez ellenőrizze a kiemelt mezőket.
              </p>
              <ul className={formWarningListClassName}>
                {currentStepErrors.map(({ field, message }) => (
                  <li key={field}>
                    <span className="font-medium">{fieldLabels[field]}:</span>{" "}
                    {message}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {currentStep === 0 ? (
            <div className="space-y-6">
              <FormOptionGroup
                label="Aktív-e még a szivárgás?"
                options={leakActiveOptions}
                value={formData.issue.leakActive}
                error={getFieldError("leakActive")}
                required
                disabled={isSubmitting}
                onChange={(value) => updateField("leakActive", value, { touch: true })}
              />

              <FormOptionGroup
                label="Elzárható volt-e a víz?"
                options={waterShutOffOptions}
                value={formData.issue.waterShutOff}
                error={getFieldError("waterShutOff")}
                required
                disabled={isSubmitting}
                onChange={(value) =>
                  updateField("waterShutOff", value, { touch: true })
                }
              />

              <FormOptionGroup
                label="Melyik helyiséget vagy rendszert érinti?"
                options={affectedAreaOptions}
                value={formData.issue.affectedArea}
                error={getFieldError("affectedArea")}
                required
                disabled={isSubmitting}
                onChange={(value) =>
                  updateField("affectedArea", value, { touch: true })
                }
              />

              <div className="grid gap-6 xl:grid-cols-2">
                <FormOptionGroup
                  label="Látható vagy rejtett a hiba?"
                  options={leakVisibilityOptions}
                  value={formData.issue.leakVisibility}
                  error={getFieldError("leakVisibility")}
                  required
                  disabled={isSubmitting}
                  onChange={(value) =>
                    updateField("leakVisibility", value, { touch: true })
                  }
                />

                <FormOptionGroup
                  label="Van-e beázás vagy kárterület?"
                  options={damageLevelOptions}
                  value={formData.issue.damageLevel}
                  error={getFieldError("damageLevel")}
                  required
                  disabled={isSubmitting}
                  onChange={(value) =>
                    updateField("damageLevel", value, { touch: true })
                  }
                />
              </div>

              <label className="space-y-3">
                <FormFieldLabel label="Rövid leírás" required />
                <Textarea
                  placeholder="Röviden írja le, mikor kezdődött a probléma, mit tapasztal, és van-e valami, ami azonnal tudható a helyzetről."
                  value={formData.issue.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  onBlur={() => handleFieldBlur("description")}
                  aria-invalid={getFieldState("description").invalid}
                  disabled={isSubmitting}
                  className={cn(
                    "min-h-32",
                    getFormInputClassName(getFieldState("description"))
                  )}
                />
                {getFieldError("description") ? (
                  <FormFieldMessage message={getFieldError("description") ?? ""} />
                ) : (
                  <FormFieldMessage
                    tone="muted"
                    message="A rövid, tényszerű leírás segít a gyorsabb első visszajelzésben."
                  />
                )}
              </label>
            </div>
          ) : null}

          {currentStep === 1 ? (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <label className="space-y-3">
                  <FormFieldLabel label="Irányítószám" required />
                  <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="Például: 7627"
                    value={formData.location.postalCode}
                    onChange={(event) => updateField("postalCode", event.target.value)}
                    onBlur={() => handleFieldBlur("postalCode")}
                    aria-invalid={getFieldState("postalCode").invalid}
                    disabled={isSubmitting}
                    className={cn(
                      "h-12",
                      getFormInputClassName(getFieldState("postalCode"))
                    )}
                  />
                  {getFieldError("postalCode") ? (
                    <FormFieldMessage message={getFieldError("postalCode") ?? ""} />
                  ) : null}
                </label>

                <label className="space-y-3 md:col-span-2">
                  <FormFieldLabel label="Település" required />
                  <Input
                    type="text"
                    placeholder="Például: Pécs"
                    value={formData.location.city}
                    onChange={(event) => updateField("city", event.target.value)}
                    onBlur={() => handleFieldBlur("city")}
                    aria-invalid={getFieldState("city").invalid}
                    disabled={isSubmitting}
                    className={cn(
                      "h-12",
                      getFormInputClassName(getFieldState("city"))
                    )}
                  />
                  {getFieldError("city") ? (
                    <FormFieldMessage message={getFieldError("city") ?? ""} />
                  ) : null}
                </label>
              </div>

              {formData.location.city.trim() ? (
                <div className={formInfoPanelClassName}>
                  <p className="text-sm font-medium text-white">
                    Szolgáltatási terület ellenőrzése
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    {getServiceAreaUserMessage(serviceAreaAssessment)}
                  </p>
                </div>
              ) : null}

              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-3">
                  <FormFieldLabel label="Név" required />
                  <Input
                    type="text"
                    placeholder="Teljes név"
                    value={formData.contact.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    onBlur={() => handleFieldBlur("name")}
                    aria-invalid={getFieldState("name").invalid}
                    disabled={isSubmitting}
                    className={cn(
                      "h-12",
                      getFormInputClassName(getFieldState("name"))
                    )}
                  />
                  {getFieldError("name") ? (
                    <FormFieldMessage message={getFieldError("name") ?? ""} />
                  ) : null}
                </label>

                <label className="space-y-3">
                  <FormFieldLabel label="Telefonszám" required />
                  <Input
                    type="tel"
                    inputMode="tel"
                    placeholder="Például: +36 30 123 4567"
                    value={formData.contact.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                    onBlur={() => handleFieldBlur("phone")}
                    aria-invalid={getFieldState("phone").invalid}
                    disabled={isSubmitting}
                    className={cn(
                      "h-12",
                      getFormInputClassName(getFieldState("phone"))
                    )}
                  />
                  {getFieldError("phone") ? (
                    <FormFieldMessage message={getFieldError("phone") ?? ""} />
                  ) : null}
                </label>
              </div>

              <label className="space-y-3">
                <FormFieldLabel label="E-mail" required />
                <Input
                  type="email"
                  inputMode="email"
                  placeholder="pelda@domain.hu"
                  value={formData.contact.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  onBlur={() => handleFieldBlur("email")}
                  aria-invalid={getFieldState("email").invalid}
                  disabled={isSubmitting}
                  className={cn(
                    "h-12",
                    getFormInputClassName(getFieldState("email"))
                  )}
                />
                {getFieldError("email") ? (
                  <FormFieldMessage message={getFieldError("email") ?? ""} />
                ) : null}
              </label>

              <div className="grid gap-6 xl:grid-cols-2">
                <FormOptionGroup
                  label="Mikor kereshető a legkönnyebben?"
                  options={preferredContactTimeOptions}
                  value={formData.contact.preferredContactTime}
                  error={getFieldError("preferredContactTime")}
                  required
                  disabled={isSubmitting}
                  onChange={(value) =>
                    updateField("preferredContactTime", value, { touch: true })
                  }
                />

                <FormOptionGroup
                  label="Szükséges lehet helyszíni felmérés?"
                  options={siteVisitNeedOptions}
                  value={formData.scheduling.siteVisitNeed}
                  error={getFieldError("siteVisitNeed")}
                  required
                  disabled={isSubmitting}
                  onChange={(value) =>
                    updateField("siteVisitNeed", value, { touch: true })
                  }
                />
              </div>

              <FormOptionGroup
                label="Mikor lenne megfelelő az egyeztetés vagy felmérés?"
                options={appointmentWindowOptions}
                value={formData.scheduling.appointmentWindow}
                error={getFieldError("appointmentWindow")}
                required
                disabled={isSubmitting}
                onChange={(value) =>
                  updateField("appointmentWindow", value, { touch: true })
                }
              />

              <div className="grid gap-6 xl:grid-cols-2">
                <label className="space-y-3">
                  <FormFieldLabel label="Kapcsolódó megjegyzés" />
                  <Textarea
                    placeholder="Például: kapucsengő, megközelítés, mikor lehet biztosan bejutni."
                    value={formData.scheduling.schedulingNote}
                    onChange={(event) =>
                      updateField("schedulingNote", event.target.value)
                    }
                    onBlur={() => handleFieldBlur("schedulingNote")}
                    aria-invalid={getFieldState("schedulingNote").invalid}
                    disabled={isSubmitting}
                    className={cn(
                      "min-h-28",
                      getFormInputClassName(getFieldState("schedulingNote"))
                    )}
                  />
                  <FormFieldMessage
                    tone="muted"
                    message="Opcionálisan megadható minden, ami az egyeztetést vagy a helyszín elérését segíti."
                  />
                </label>

                <label className="space-y-3">
                  <FormFieldLabel label="Opcionális megjegyzés" />
                  <Textarea
                    placeholder="Ha van még fontos rövid információ, itt megadható."
                    value={formData.contact.notes}
                    onChange={(event) => updateField("notes", event.target.value)}
                    onBlur={() => handleFieldBlur("notes")}
                    aria-invalid={getFieldState("notes").invalid}
                    disabled={isSubmitting}
                    className={cn(
                      "min-h-28",
                      getFormInputClassName(getFieldState("notes"))
                    )}
                  />
                  <FormFieldMessage
                    tone="muted"
                    message="Ez a mező opcionális, a legfontosabb a gyors alaphelyzet tisztázása."
                  />
                </label>
              </div>

              <div className={formSubtlePanelClassName}>
                <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-base font-medium text-white">
                      Képek csatolása
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">
                      Ha a helyzet jobban érthető fotó alapján, itt legfeljebb{" "}
                      {serviceRequestMaxImageCount} kép tölthető fel.
                    </p>
                  </div>
                  <span className={formSummaryLabelClassName}>Opcionális</span>
                </div>

                <div className="mt-4 flex flex-col gap-4">
                  <label className={formUploadButtonClassName}>
                    <span>Képek kiválasztása</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={isSubmitting}
                      className="sr-only"
                      onChange={handleImageSelection}
                    />
                  </label>

                  {imageSelectionMessage ? (
                    <p className={formWarningTextClassName}>{imageSelectionMessage}</p>
                  ) : null}

                  {selectedImages.length === 0 ? (
                    <div className={formDashedInfoClassName}>
                      Nincs kiválasztott kép. Ez ennél a gyors folyamatnál
                      teljesen rendben van.
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {selectedImages.map((file, index) => (
                        <div
                          key={`${file.name}-${file.lastModified}-${index}`}
                          className={formSelectedFileRowClassName}
                        >
                          <div>
                            <p className="text-sm font-medium text-zinc-100">
                              {file.name}
                            </p>
                            <p className={formFileMetaTextClassName}>
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSelectedImage(index)}
                            disabled={isSubmitting}
                            className={formFileRemoveButtonClassName}
                          >
                            Eltávolítás
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {currentStep === 2 ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white">
                  Áttekintés a véglegesítés előtt
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-300">
                  Az alábbi adatok alapján már egy gyorsabban kezelhető első
                  visszajelzés és triage indulhat el.
                </p>
              </div>

              <div className="grid gap-5">
                {summarySections.map((section) => {
                  const visibleFields = section.fields.filter((field) => {
                    if (field !== "notes" && field !== "schedulingNote") {
                      return true
                    }

                    return field === "notes"
                      ? Boolean(notesValue)
                      : Boolean(schedulingNoteValue)
                  })

                  return (
                    <div
                      key={section.title}
                      className={formSubtlePanelClassName}
                    >
                      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                        <h3 className="text-base font-medium text-white">
                          {section.title}
                        </h3>
                        <span className={formSummaryLabelClassName}>
                          Összegzés
                        </span>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        {visibleFields.map((field) => (
                          <div
                            key={field}
                            className={cn(
                              formFileCardClassName,
                              (field === "description" ||
                                field === "notes" ||
                                field === "schedulingNote") &&
                                "md:col-span-2"
                            )}
                          >
                            <p className={formSummaryLabelClassName}>
                              {fieldLabels[field]}
                            </p>
                            <p className="mt-3 text-sm leading-6 text-zinc-200">
                              {getFieldValue(formData, field)}
                            </p>
                          </div>
                        ))}
                      </div>

                      {section.title === "Helyszín és kapcsolat" && !notesValue ? (
                        <div className={cn("mt-4", formDashedInfoClassName)}>
                          Külön megjegyzés nem érkezett.
                        </div>
                      ) : null}

                      {section.title === "Egyeztetés és felmérés" &&
                      !schedulingNoteValue ? (
                        <div className={cn("mt-4", formDashedInfoClassName)}>
                          Kapcsolódó egyeztetési megjegyzés nem érkezett.
                        </div>
                      ) : null}
                    </div>
                  )
                })}

                <div className={formSubtlePanelClassName}>
                  <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <h3 className="text-base font-medium text-white">
                      Csatolt képek
                    </h3>
                    <span className={formSummaryLabelClassName}>Opcionális</span>
                  </div>

                  {selectedImages.length === 0 ? (
                    <div className={cn("mt-4", formDashedInfoClassName)}>
                      Nincs csatolt kép kiválasztva.
                    </div>
                  ) : (
                    <div className="mt-4 grid gap-3">
                      {selectedImages.map((file, index) => (
                        <div
                          key={`${file.name}-${file.lastModified}-${index}`}
                          className={formFileCardClassName}
                        >
                          <p className="text-sm font-medium text-zinc-100">
                            {file.name}
                          </p>
                          <p className={formFileMetaTextClassName}>
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {isSubmitting ? (
                <div className={formBusyPanelClassName}>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    <div>
                      <p className="text-base font-medium text-white">
                        {hasSelectedImages
                          ? "A csőtöréshez kapcsolódó megkeresés és a képek feltöltése folyamatban van."
                          : "A csőtöréshez kapcsolódó megkeresés rögzítése folyamatban van."}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-zinc-300">
                        {hasSelectedImages
                          ? "A megadott adatok mentése és a csatolt képek feltöltése most történik."
                          : "A megadott adatok mentése most történik a rendszerben."}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              {isSuccess ? (
                <div className="space-y-4">
                  <div className={formSuccessPanelClassName}>
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-300/15 text-lg text-emerald-100">
                        ✓
                      </div>
                      <div>
                        <p className="text-base font-medium text-emerald-50">
                          A megkeresés sikeresen rögzítve lett.
                        </p>
                        <p className={formSuccessBodyTextClassName}>
                          A csőtöréshez vagy szivárgáshoz kapcsolódó alapadatok
                          bekerültek a rendszerbe, így a következő visszajelzés
                          gyorsabban előkészíthető.
                        </p>
                      </div>
                    </div>
                  </div>

                  {!hasSelectedImages ? (
                    <div className={formInfoPanelClassName}>
                      <p className="text-sm font-medium text-white">
                        Képfeltöltés nem történt
                      </p>
                      <p className="mt-2 text-sm leading-6 text-zinc-300">
                        A megkeresés kép nélkül került rögzítésre, ami ennél a
                        gyors triage-folyamatnál teljesen elfogadható.
                      </p>
                    </div>
                  ) : null}

                  {uploadStatus === "success" ? (
                    <div className={formInfoPanelClassName}>
                      <p className="text-sm font-medium text-white">
                        A csatolt képek sikeresen feltöltve
                      </p>
                      <p className="mt-2 text-sm leading-6 text-zinc-300">
                        {uploadedAttachments.length} kép kapcsolódott a
                        megkereséshez.
                      </p>
                    </div>
                  ) : null}

                  {uploadStatus === "error" ? (
                    <div className={formWarningPanelClassName}>
                      <p className="text-sm font-medium text-amber-100">
                        A képfeltöltés most nem sikerült
                      </p>
                      <p className={formWarningTextClassName}>
                        {uploadErrorMessage ??
                          "A megkeresés rögzítve lett, de a képek feltöltése nem sikerült."}
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {isError ? (
                <div className={formErrorPanelClassName}>
                  <p className="text-base font-medium text-rose-50">
                    A megkeresés rögzítése most nem sikerült.
                  </p>
                  <p className={formErrorTextClassName}>
                    {submitErrorMessage ??
                      "Kérjük, próbálja meg újra néhány perc múlva."}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={goToPreviousStep}
              disabled={isFirstStep || isSubmitting}
              className={formSecondaryButtonClassName}
            >
              Előző
            </Button>

            {isLastStep ? (
              <Button
                type="button"
                size="lg"
                onClick={submitForm}
                disabled={isSubmitting || isSuccess}
                className="min-h-12 w-full rounded-2xl bg-white text-zinc-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-200 sm:w-auto"
              >
                {isSubmitting
                  ? hasSelectedImages
                    ? "Mentés és képfeltöltés..."
                    : "Küldés folyamatban..."
                  : isSuccess
                    ? "Megkeresés rögzítve"
                    : isError
                      ? "Újrapróbálás"
                      : "Megkeresés elküldése"}
              </Button>
            ) : (
              <Button
                type="button"
                size="lg"
                onClick={goToNextStep}
                disabled={isSubmitting}
                className="bg-white text-zinc-950 hover:bg-zinc-200"
              >
                Következő
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
