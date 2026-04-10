"use client"

import { type ChangeEvent, useState } from "react"

import {
  formAsideCardClassName,
  formBusyPanelClassName,
  formCounterPillClassName,
  FormPrivacyConsentField,
  FormFieldLabel,
  FormFieldMessage,
  FormOptionGroup,
  formDashedInfoClassName,
  formErrorPanelClassName,
  formErrorTextClassName,
  formEyebrowClassName,
  formFileCardClassName,
  formFileMetaTextClassName,
  formFileRemoveButtonClassName,
  formInfoPanelClassName,
  formLeadTextClassName,
  formMainCardClassName,
  formMutedPanelClassName,
  formProgressMetaClassName,
  formProgressTrackClassName,
  formSecondaryButtonClassName,
  formSectionBodyTextClassName,
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
  FormUploadPrivacyNote,
  useRequiredPrivacyConsent,
  formWarningListClassName,
  formWarningPanelClassName,
  formWarningTextClassName,
  getFormInputClassName,
} from "@/components/forms/form-ui"
import { useStepTransitionScroll } from "@/components/forms/use-step-transition-scroll"
import {
  serviceRequestMaxImageCount,
  type ServiceRequestAttachmentInsert,
} from "@/lib/supabase/service-request-media"
import { useFormTracking } from "@/lib/analytics/use-form-tracking"
import {
  getServiceAreaAssessment,
  getServiceAreaUserMessage,
} from "@/lib/service-area"
import {
  appointmentWindowOptions,
  preferredContactTimeOptions,
  siteVisitNeedOptions,
} from "@/lib/service-requests/request-options"
import type { HeatingModernizationInquiryData } from "@/lib/supabase/service-requests"
import {
  submitHeatingModernizationServiceRequest,
  uploadServiceRequestImages,
} from "@/lib/supabase/service-requests"
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
import { getUserFacingErrorMessage, logClientError } from "@/lib/logging"
import { cn } from "@/lib/utils"

const steps = [
  {
    title: "Ingatlan és jelenlegi rendszer",
    description:
      "Az alapadatokból látszik a helyszín és a jelenlegi rendszer.",
  },
  {
    title: "Korszerűsítési igény",
    description:
      "A fő igényből gyorsabban látszik, mire van szükség.",
  },
  {
    title: "Kapcsolatfelvétel és képek",
    description: "Az elérhetőség és a képek gyorsítják a visszajelzést.",
  },
  {
    title: "Összegzés",
    description: "Itt ellenőrizheti a megadott adatokat.",
  },
] as const

const propertyTypeOptions = ["Lakás", "Családi ház", "Egyéb"] as const
const currentHeatingSystemOptions = [
  "Radiátoros",
  "Padlófűtés",
  "Vegyes",
  "Nem tudom",
] as const
const modernizationGoalOptions = [
  "Alacsonyabb fogyasztás",
  "Komfortosabb működés",
  "Elavult rendszer cseréje",
  "Fűtésszerelés vagy helyreállítás",
  "Karbantartás vagy átvizsgálás",
  "Optimalizálás vagy beszabályozás",
  "Felújítással egybekötött korszerűsítés",
  "Egyéb",
] as const
const heatSourceStatusOptions = ["Igen", "Nem", "Nem tudom"] as const

type StepIndex = 0 | 1 | 2 | 3
type SubmitStatus = "idle" | "submitting" | "success" | "error"
type UploadStatus = "idle" | "uploading" | "success" | "error"

type FieldName =
  | "propertyType"
  | "area"
  | "postalCode"
  | "city"
  | "currentHeatingSystem"
  | "modernizationGoal"
  | "heatSourceStatus"
  | "requestDescription"
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

const initialFormState: HeatingModernizationInquiryData = {
  property: {
    propertyType: "",
    area: "",
    postalCode: "",
    city: "",
    currentHeatingSystem: "",
  },
  modernization: {
    modernizationGoal: "",
    heatSourceStatus: "",
    requestDescription: "",
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
  propertyType: "Ingatlan típusa",
  area: "Alapterület",
  postalCode: "Irányítószám",
  city: "Település",
  currentHeatingSystem: "Jelenlegi fűtési rendszer",
  modernizationGoal: "Mi a megkeresés fő iránya?",
  heatSourceStatus: "Van jelenleg működő hőtermelő?",
  requestDescription: "Rövid leírás az igényről",
  name: "Név",
  phone: "Telefonszám",
  email: "E-mail",
  preferredContactTime: "Mikor kereshető a legkönnyebben?",
  siteVisitNeed: "Szükséges lehet helyszíni felmérés?",
  appointmentWindow: "Mikor lenne megfelelő az egyeztetés vagy felmérés?",
  schedulingNote: "Kapcsolódó megjegyzés",
  notes: "Megjegyzés",
}

const requiredFieldsByStep = [
  ["propertyType", "area", "postalCode", "city", "currentHeatingSystem"],
  ["modernizationGoal", "heatSourceStatus", "requestDescription"],
  [
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
    title: "Ingatlan és jelenlegi rendszer",
    fields: ["propertyType", "area", "postalCode", "city", "currentHeatingSystem"],
  },
  {
    title: "Korszerűsítési igény",
    fields: ["modernizationGoal", "heatSourceStatus", "requestDescription"],
  },
  {
    title: "Kapcsolatfelvétel",
    fields: ["name", "phone", "email", "preferredContactTime", "notes"],
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

function getFieldValue(
  formData: HeatingModernizationInquiryData,
  field: FieldName
) {
  switch (field) {
    case "propertyType":
      return formData.property.propertyType
    case "area":
      return formData.property.area
    case "postalCode":
      return formData.property.postalCode
    case "city":
      return formData.property.city
    case "currentHeatingSystem":
      return formData.property.currentHeatingSystem
    case "modernizationGoal":
      return formData.modernization.modernizationGoal
    case "heatSourceStatus":
      return formData.modernization.heatSourceStatus
    case "requestDescription":
      return formData.modernization.requestDescription
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
  formData: HeatingModernizationInquiryData,
  field: FieldName,
  value: string
) {
  switch (field) {
    case "propertyType":
      return {
        ...formData,
        property: {
          ...formData.property,
          propertyType: value,
        },
      }
    case "area":
      return {
        ...formData,
        property: {
          ...formData.property,
          area: value,
        },
      }
    case "postalCode":
      return {
        ...formData,
        property: {
          ...formData.property,
          postalCode: value,
        },
      }
    case "city":
      return {
        ...formData,
        property: {
          ...formData.property,
          city: value,
        },
      }
    case "currentHeatingSystem":
      return {
        ...formData,
        property: {
          ...formData.property,
          currentHeatingSystem: value,
        },
      }
    case "modernizationGoal":
      return {
        ...formData,
        modernization: {
          ...formData.modernization,
          modernizationGoal: value,
        },
      }
    case "heatSourceStatus":
      return {
        ...formData,
        modernization: {
          ...formData.modernization,
          heatSourceStatus: value,
        },
      }
    case "requestDescription":
      return {
        ...formData,
        modernization: {
          ...formData.modernization,
          requestDescription: value,
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

function validateField(
  field: FieldName,
  formData: HeatingModernizationInquiryData
) {
  const value = getFieldValue(formData, field).trim()

  switch (field) {
    case "propertyType":
      return value ? "" : "Válasszon ingatlantípust."
    case "area": {
      if (!value) {
        return "Adja meg az alapterületet."
      }

      const parsedValue = Number(value)

      if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
        return "Pozitív alapterületet adjon meg."
      }

      return ""
    }
    case "postalCode":
      if (!value) {
        return "Adja meg az irányítószámot."
      }

      return /^\d{4}$/.test(value)
        ? ""
        : "4 számjegyű irányítószámot adjon meg."
    case "city":
      return value ? "" : "Adja meg a települést."
    case "currentHeatingSystem":
      return value ? "" : "Válassza ki a jelenlegi fűtési rendszert."
    case "modernizationGoal":
      return value ? "" : "Válassza ki a megkeresés fő irányát."
    case "heatSourceStatus":
      return value ? "" : "Jelölje, hogy van-e működő hőtermelő."
    case "requestDescription":
      return value ? "" : "Írja le röviden az igényt."
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
  formData: HeatingModernizationInquiryData
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

export function HeatingModernizationForm() {
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
  const [formData, setFormData] =
    useState<HeatingModernizationInquiryData>(initialFormState)
  const [errors, setErrors] = useState<ErrorState>({})
  const [touchedFields, setTouchedFields] = useState<TouchedState>({})
  const {
    privacyConsentAccepted,
    privacyConsentError,
    setPrivacyConsentAccepted,
    validatePrivacyConsent,
  } = useRequiredPrivacyConsent()
  const { trackFormStarted, trackStepCompleted, trackSubmitSuccess } =
    useFormTracking({
      serviceType: "futeskorszerusites",
      sourcePage: "futeskorszerusites",
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
  const serviceAreaAssessment = getServiceAreaAssessment(formData.property.city)

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
    options?: {
      touch?: boolean
    }
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
        nextErrors.propertyType ||
        nextErrors.area ||
        nextErrors.city ||
        nextErrors.currentHeatingSystem
      ) {
        setCurrentStep(0)
      } else if (
        nextErrors.modernizationGoal ||
        nextErrors.heatSourceStatus ||
        nextErrors.requestDescription
      ) {
        setCurrentStep(1)
      } else {
        setCurrentStep(2)
      }

      setSubmitStatus("idle")
      scrollToFormTop()
      return
    }

    if (!validatePrivacyConsent()) {
      setSubmitStatus("idle")
      return
    }

    const requestId = crypto.randomUUID()

    try {
      setSubmitStatus("submitting")
      setUploadStatus(hasSelectedImages ? "uploading" : "idle")
      setUploadErrorMessage(null)
      setSubmitErrorMessage(null)

      await submitHeatingModernizationServiceRequest({
        requestId,
        formData,
      })

      if (selectedImages.length > 0) {
        try {
          const attachments = await uploadServiceRequestImages({
            requestId,
            serviceType: "futeskorszerusites",
            files: selectedImages,
          })

          setUploadedAttachments(attachments)
          setUploadStatus("success")
        } catch (error) {
          logClientError("Fűtéskorszerűsítés képfeltöltés hiba", error, {
            serviceType: "futeskorszerusites",
          })

          setUploadStatus("error")
          setUploadErrorMessage(
            getUserFacingErrorMessage(
              error,
              "Az ajánlatkérés rögzítve lett, de a képek feltöltése nem sikerült."
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
      logClientError("Fűtéskorszerűsítés ajánlatkérés mentési hiba", error, {
        serviceType: "futeskorszerusites",
      })

      setSubmitStatus("error")
      setUploadStatus("idle")
      setSubmitErrorMessage(
        getUserFacingErrorMessage(
          error,
          "Az ajánlatkérés rögzítése most nem sikerült. Kérjük, próbálja meg újra."
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
      className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-8"
    >
      <aside className="order-2 hidden self-start lg:order-1 lg:block lg:space-y-6 lg:sticky lg:top-24">
        <Card className={formAsideCardClassName}>
          <CardHeader className="space-y-4 p-5 sm:p-6">
            <div className={formEyebrowClassName}>Megkeresés</div>
            <CardTitle className="text-xl">Fűtési megkeresés</CardTitle>
            <CardDescription className={formLeadTextClassName}>
              A fő adatok alapján könnyebb az első visszajelzés.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-5 pt-0 sm:space-y-5 sm:p-6 sm:pt-0">
            <div className={formSupportPanelClassName}>
              Amit most nem tud, később is megadhatja.
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
                <div className={formStepEyebrowClassName}>
                  Aktuális lépés
                </div>
                <CardTitle className="mt-4 text-2xl">
                  {steps[currentStep].title}
                </CardTitle>
                <CardDescription className={cn("mt-2 max-w-2xl", formLeadTextClassName)}>
                  {steps[currentStep].description}
                </CardDescription>
              </div>

              <div className={formCounterPillClassName}>
                <span className="font-medium text-white">{currentStep + 1}</span>
                <span className="text-zinc-400">/</span>
                <span>{steps.length}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className={formProgressMetaClassName}>
                <span>{steps[currentStep].title}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className={formProgressTrackClassName}>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-white via-zinc-200 to-zinc-400 transition-[width] duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 pt-4 sm:space-y-7 sm:pt-5 md:space-y-8 md:pt-6">
          {currentStepErrors.length > 0 && !isLastStep ? (
            <div className={formWarningPanelClassName}>
              <p className="text-sm font-medium text-amber-100">
                Ellenőrizze a kiemelt mezőket.
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
                label="Ingatlan típusa"
                options={propertyTypeOptions}
                value={formData.property.propertyType}
                error={getFieldError("propertyType")}
                required
                disabled={isSubmitting}
                onChange={(value) =>
                  updateField("propertyType", value, { touch: true })
                }
              />

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <label className="space-y-3">
                  <FormFieldLabel label="Alapterület" required />
                  <Input
                    type="number"
                    min="0"
                    inputMode="numeric"
                    placeholder="Például: 120"
                    value={formData.property.area}
                    onChange={(event) => updateField("area", event.target.value)}
                    onBlur={() => handleFieldBlur("area")}
                    aria-invalid={getFieldState("area").invalid}
                    disabled={isSubmitting}
                    className={cn(
                      "h-12",
                      getFormInputClassName(getFieldState("area"))
                    )}
                  />
                  {getFieldError("area") ? (
                    <FormFieldMessage message={getFieldError("area") ?? ""} />
                  ) : (
                    <FormFieldMessage
                      tone="muted"
                      message="Nagyjából megadva is jó."
                    />
                  )}
                </label>

                <label className="space-y-3">
                  <FormFieldLabel label="Irányítószám" required />
                  <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="Például: 7632"
                    value={formData.property.postalCode}
                    onChange={(event) =>
                      updateField("postalCode", event.target.value)
                    }
                    onBlur={() => handleFieldBlur("postalCode")}
                    aria-invalid={getFieldState("postalCode").invalid}
                    disabled={isSubmitting}
                    className={cn(
                      "h-12",
                      getFormInputClassName(getFieldState("postalCode"))
                    )}
                  />
                  {getFieldError("postalCode") ? (
                    <FormFieldMessage
                      message={getFieldError("postalCode") ?? ""}
                    />
                  ) : (
                    <FormFieldMessage
                      tone="muted"
                      message="Az első körben nem szükséges a teljes pontos cím."
                    />
                  )}
                </label>

                <label className="space-y-3">
                  <FormFieldLabel label="Település" required />
                  <Input
                    type="text"
                    placeholder="Például: Pécs"
                    value={formData.property.city}
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
                  ) : formData.property.city.trim() ? (
                    <p
                      className={cn(
                        "text-sm leading-6",
                        serviceAreaAssessment.isWithinSupportedArea
                          ? "text-emerald-200/80"
                          : "text-amber-200"
                      )}
                    >
                      {getServiceAreaUserMessage(serviceAreaAssessment)}
                    </p>
                  ) : (
                    <FormFieldMessage
                      tone="muted"
                      message="A település már elég az induláshoz."
                    />
                  )}
                </label>
              </div>

              <FormOptionGroup
                label="Jelenlegi fűtési rendszer"
                options={currentHeatingSystemOptions}
                value={formData.property.currentHeatingSystem}
                error={getFieldError("currentHeatingSystem")}
                required
                disabled={isSubmitting}
                onChange={(value) =>
                  updateField("currentHeatingSystem", value, { touch: true })
                }
              />
            </div>
          ) : null}

          {currentStep === 1 ? (
            <div className="space-y-6">
              <FormOptionGroup
                label="Mi a megkeresés fő iránya?"
                options={modernizationGoalOptions}
                value={formData.modernization.modernizationGoal}
                error={getFieldError("modernizationGoal")}
                required
                disabled={isSubmitting}
                onChange={(value) =>
                  updateField("modernizationGoal", value, { touch: true })
                }
              />

              <FormOptionGroup
                label="Van jelenleg működő hőtermelő?"
                options={heatSourceStatusOptions}
                value={formData.modernization.heatSourceStatus}
                error={getFieldError("heatSourceStatus")}
                required
                disabled={isSubmitting}
                onChange={(value) =>
                  updateField("heatSourceStatus", value, { touch: true })
                }
              />

              <label className="space-y-3">
                <FormFieldLabel label="Rövid leírás az igényről" required />
                <Textarea
                  placeholder="Röviden írja le, milyen karbantartási, szerelési, optimalizálási vagy korszerűsítési igényről van szó."
                  value={formData.modernization.requestDescription}
                  onChange={(event) =>
                    updateField("requestDescription", event.target.value)
                  }
                  onBlur={() => handleFieldBlur("requestDescription")}
                  aria-invalid={getFieldState("requestDescription").invalid}
                  disabled={isSubmitting}
                  className={cn(
                    "min-h-36",
                    getFormInputClassName(getFieldState("requestDescription"))
                  )}
                />
                {getFieldError("requestDescription") ? (
                  <FormFieldMessage
                    message={getFieldError("requestDescription") ?? ""}
                  />
                ) : (
                  <FormFieldMessage
                    tone="muted"
                    message="Pár mondat elég."
                  />
                )}
              </label>
            </div>
          ) : null}

          {currentStep === 2 ? (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-3">
                  <FormFieldLabel label="Név" required />
                  <Input
                    type="text"
                    placeholder="Például: Nagy András"
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
                    placeholder="Például: +36 20 555 1234"
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
                  placeholder="Például: kapcsolat@pelda.hu"
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

              <label className="space-y-3">
                <FormFieldLabel label="Megjegyzés" />
                <Textarea
                  placeholder="Ha van plusz helyszíni, időzítési vagy műszaki megjegyzése, itt röviden jelezheti."
                  value={formData.contact.notes}
                  onChange={(event) => updateField("notes", event.target.value)}
                  onBlur={() => handleFieldBlur("notes")}
                  aria-invalid={getFieldState("notes").invalid}
                  disabled={isSubmitting}
                  className={cn(
                    "min-h-36",
                    getFormInputClassName(getFieldState("notes"))
                  )}
                />
                <FormFieldMessage
                  tone="muted"
                  message="Nem kötelező."
                />
              </label>

              <div className={formSubtlePanelClassName}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-medium text-white">
                      Egyeztetés és felmérés
                    </h3>
                    <p className={formSectionBodyTextClassName}>
                      Jelezze, kellhet-e felmérés, és mikor lenne jó.
                    </p>
                  </div>

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

                  <label className="space-y-3">
                    <FormFieldLabel label="Kapcsolódó megjegyzés" />
                    <Textarea
                      placeholder="Ha van plusz időpont- vagy helyszíni információ, írja ide."
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
                      message="Nem kötelező."
                    />
                  </label>
                </div>
              </div>

              <div className={formSubtlePanelClassName}>
                <div className="flex flex-col gap-3">
                  <div>
                    <FormFieldLabel label="Opcionális képek" />
                    <p className={formSectionBodyTextClassName}>
                      Legfeljebb {serviceRequestMaxImageCount} kép. Például
                      kazánról vagy a helyszínről.
                    </p>
                  </div>

                  <FormUploadPrivacyNote />

                  <label className={formUploadButtonClassName}>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={
                        isSubmitting ||
                        selectedImages.length >= serviceRequestMaxImageCount
                      }
                      onChange={handleImageSelection}
                      className="sr-only"
                    />
                    Képek kiválasztása
                  </label>

                  {imageSelectionMessage ? (
                    <FormFieldMessage message={imageSelectionMessage} />
                  ) : null}

                  {selectedImages.length === 0 ? (
                    <div className={formDashedInfoClassName}>
                      Jelenleg nincs kiválasztott kép.
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

          {currentStep === 3 ? (
            <div className="space-y-6">
              <div className={formMutedPanelClassName}>
                <h3 className="text-lg font-medium text-white">
                  Áttekintés a véglegesítés előtt
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-300">
                  Itt ellenőrizheti a megadott adatokat.
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
                              field === "requestDescription" && "md:col-span-2",
                              (field === "notes" ||
                                field === "schedulingNote") &&
                                "md:col-span-2"
                            )}
                          >
                            <p className={formSummaryLabelClassName}>
                              {fieldLabels[field]}
                            </p>
                            <p className="mt-3 text-sm leading-6 text-zinc-200">
                              {field === "area"
                                ? `${getFieldValue(formData, field)} m²`
                                : getFieldValue(formData, field)}
                            </p>
                          </div>
                        ))}
                      </div>

                      {section.title === "Kapcsolatfelvétel" && !notesValue ? (
                        <div className={cn("mt-4", formDashedInfoClassName)}>
                          Nincs megjegyzés.
                        </div>
                      ) : null}

                      {section.title === "Egyeztetés és felmérés" &&
                      !schedulingNoteValue ? (
                        <div className={cn("mt-4", formDashedInfoClassName)}>
                          Nincs kapcsolódó megjegyzés.
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
                    <span className={formSummaryLabelClassName}>
                      Opcionális
                    </span>
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

              {!isSuccess ? (
                <FormPrivacyConsentField
                  checked={privacyConsentAccepted}
                  error={privacyConsentError}
                  disabled={isSubmitting}
                  onCheckedChange={setPrivacyConsentAccepted}
                />
              ) : null}

              {isSubmitting ? (
                <div className={formBusyPanelClassName}>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    <div>
                      <p className="text-base font-medium text-white">
                        {hasSelectedImages
                          ? "Az ajánlatkérés rögzítése és a képek feltöltése folyamatban van."
                          : "Az ajánlatkérés rögzítése folyamatban van."}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-zinc-300">
                        {hasSelectedImages
                          ? "A mentés és a képfeltöltés most történik."
                          : "A mentés most történik."}
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
                          Az ajánlatkérés sikeresen rögzítve lett.
                        </p>
                        <p className={formSuccessBodyTextClassName}>
                          Az adatok beérkeztek. Hamarosan visszajelzünk.
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
                        A megkeresés kép nélkül érkezett.
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
                          "Az ajánlatkérés rögzítve lett, de a képek feltöltése nem sikerült."}
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {isError ? (
                <div className={formErrorPanelClassName}>
                  <p className="text-base font-medium text-rose-50">
                    Az ajánlatkérés rögzítése most nem sikerült.
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
                    Minden rendben?
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    Ha igen, küldje el a megkeresést.
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
                    ? "Ajánlatkérés rögzítve"
                    : isError
                      ? "Újrapróbálás"
                      : "Ajánlatkérés elküldése"}
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
