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
  FormPrivacyConsentField,
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
  FormUploadPrivacyNote,
  useRequiredPrivacyConsent,
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
  submitHeatPumpInstallationServiceRequest,
  type HeatPumpInstallationInquiryData,
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
    title: "Projekt és ingatlan",
    description:
      "Az alapadatokból látszik a projekt és a helyszín.",
  },
  {
    title: "Rendszer és műszaki háttér",
    description:
      "A rendszer és a fő feltételek gyors képet adnak.",
  },
  {
    title: "Kapcsolat és képek",
    description: "Az elérhetőség és a képek gyorsítják a visszajelzést.",
  },
  {
    title: "Összegzés",
    description: "Itt ellenőrizheti a megadott adatokat.",
  },
] as const

const projectModeOptions = [
  "Új építés",
  "Meglévő rendszer átalakítása",
  "Még egyeztetném",
] as const

const propertyTypeOptions = [
  "Lakás",
  "Családi ház",
  "Társasház / lakóépület",
  "Egyéb",
] as const

const heatEmitterTypeOptions = [
  "Radiátor",
  "Padlófűtés",
  "Vegyes",
  "Még nincs kialakítva",
  "Nem tudom",
] as const

const currentHeatSourceOptions = [
  "Gázkazán",
  "Vegyes tüzelés",
  "Villanykazán",
  "Nincs még rendszer",
  "Egyéb",
  "Nem tudom",
] as const

const hotWaterNeedOptions = [
  "Igen, szükséges",
  "Nem szükséges",
  "Még egyeztetném",
] as const

const electricalSetupOptions = [
  "1 fázis",
  "3 fázis",
  "Még nem ismert",
] as const

const projectStageOptions = [
  "Tervezés előtt",
  "Előkészítés alatt",
  "Kivitelezésre kész",
  "Felújítás közben",
  "Még egyeztetném",
] as const

type StepIndex = 0 | 1 | 2 | 3
type SubmitStatus = "idle" | "submitting" | "success" | "error"
type UploadStatus = "idle" | "uploading" | "success" | "error"

type FieldName =
  | "projectMode"
  | "propertyType"
  | "area"
  | "postalCode"
  | "city"
  | "heatEmitterType"
  | "currentHeatSource"
  | "hotWaterNeed"
  | "electricalSetup"
  | "projectStage"
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

const initialFormState: HeatPumpInstallationInquiryData = {
  property: {
    projectMode: "",
    propertyType: "",
    area: "",
    postalCode: "",
    city: "",
  },
  system: {
    heatEmitterType: "",
    currentHeatSource: "",
    hotWaterNeed: "",
    electricalSetup: "",
    projectStage: "",
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
  projectMode: "Új építés vagy meglévő rendszer átalakítás?",
  propertyType: "Ingatlan típusa",
  area: "Alapterület",
  postalCode: "Irányítószám",
  city: "Település",
  heatEmitterType: "Jelenlegi hőleadó oldal",
  currentHeatSource: "Jelenlegi hőtermelő",
  hotWaterNeed: "HMV-igény",
  electricalSetup: "Elektromos háttér",
  projectStage: "Projekt szakasza",
  requestDescription: "Rövid leírás",
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
  ["projectMode", "propertyType", "area", "postalCode", "city"],
  [
    "heatEmitterType",
    "currentHeatSource",
    "hotWaterNeed",
    "electricalSetup",
    "projectStage",
    "requestDescription",
  ],
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
    title: "Projekt és ingatlan",
    fields: ["projectMode", "propertyType", "area", "postalCode", "city"],
  },
  {
    title: "Rendszer és műszaki háttér",
    fields: [
      "heatEmitterType",
      "currentHeatSource",
      "hotWaterNeed",
      "electricalSetup",
      "projectStage",
      "requestDescription",
    ],
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
  formData: HeatPumpInstallationInquiryData,
  field: FieldName
) {
  switch (field) {
    case "projectMode":
      return formData.property.projectMode
    case "propertyType":
      return formData.property.propertyType
    case "area":
      return formData.property.area
    case "postalCode":
      return formData.property.postalCode
    case "city":
      return formData.property.city
    case "heatEmitterType":
      return formData.system.heatEmitterType
    case "currentHeatSource":
      return formData.system.currentHeatSource
    case "hotWaterNeed":
      return formData.system.hotWaterNeed
    case "electricalSetup":
      return formData.system.electricalSetup
    case "projectStage":
      return formData.system.projectStage
    case "requestDescription":
      return formData.system.requestDescription
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
  formData: HeatPumpInstallationInquiryData,
  field: FieldName,
  value: string
) {
  switch (field) {
    case "projectMode":
      return {
        ...formData,
        property: {
          ...formData.property,
          projectMode: value,
        },
      }
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
    case "heatEmitterType":
      return {
        ...formData,
        system: {
          ...formData.system,
          heatEmitterType: value,
        },
      }
    case "currentHeatSource":
      return {
        ...formData,
        system: {
          ...formData.system,
          currentHeatSource: value,
        },
      }
    case "hotWaterNeed":
      return {
        ...formData,
        system: {
          ...formData.system,
          hotWaterNeed: value,
        },
      }
    case "electricalSetup":
      return {
        ...formData,
        system: {
          ...formData.system,
          electricalSetup: value,
        },
      }
    case "projectStage":
      return {
        ...formData,
        system: {
          ...formData.system,
          projectStage: value,
        },
      }
    case "requestDescription":
      return {
        ...formData,
        system: {
          ...formData.system,
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
  formData: HeatPumpInstallationInquiryData
) {
  const value = getFieldValue(formData, field).trim()

  switch (field) {
    case "projectMode":
      return value ? "" : "Válassza ki a projekt indulási helyzetét."
    case "propertyType":
      return value ? "" : "Válassza ki az ingatlan típusát."
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
    case "heatEmitterType":
      return value ? "" : "Válassza ki a hőleadó oldalt."
    case "currentHeatSource":
      return value ? "" : "Válassza ki a jelenlegi hőtermelőt."
    case "hotWaterNeed":
      return value ? "" : "Jelölje, hogy szükséges-e HMV."
    case "electricalSetup":
      return value ? "" : "Jelölje az elektromos hátteret."
    case "projectStage":
      return value ? "" : "Válassza ki a projekt szakaszát."
    case "requestDescription":
      return value ? "" : "Írja le röviden a feladatot."
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
  formData: HeatPumpInstallationInquiryData
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

export function HeatPumpInstallationForm() {
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
    useState<HeatPumpInstallationInquiryData>(initialFormState)
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
      serviceType: "hoszivattyu_telepites",
      sourcePage: "hoszivattyu-telepites",
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
        nextErrors.projectMode ||
        nextErrors.propertyType ||
        nextErrors.area ||
        nextErrors.postalCode ||
        nextErrors.city
      ) {
        setCurrentStep(0)
      } else if (
        nextErrors.heatEmitterType ||
        nextErrors.currentHeatSource ||
        nextErrors.hotWaterNeed ||
        nextErrors.electricalSetup ||
        nextErrors.projectStage ||
        nextErrors.requestDescription
      ) {
        setCurrentStep(1)
      } else if (
        nextErrors.name ||
        nextErrors.phone ||
        nextErrors.email ||
        nextErrors.preferredContactTime ||
        nextErrors.siteVisitNeed ||
        nextErrors.appointmentWindow
      ) {
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

      await submitHeatPumpInstallationServiceRequest({
        requestId,
        formData,
      })

      if (selectedImages.length > 0) {
        try {
          const attachments = await uploadServiceRequestImages({
            requestId,
            serviceType: "hoszivattyu_telepites",
            files: selectedImages,
          })

          setUploadedAttachments(attachments)
          setUploadStatus("success")
        } catch (error) {
          logClientError("Hőszivattyú képfeltöltés hiba", error, {
            serviceType: "hoszivattyu_telepites",
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
      logClientError("Hőszivattyú mentési hiba", error, {
        serviceType: "hoszivattyu_telepites",
      })

      setSubmitStatus("error")
      setUploadStatus("idle")
      setSubmitErrorMessage(
        getUserFacingErrorMessage(
          error,
          "A hőszivattyús megkeresés rögzítése most nem sikerült. Kérjük, próbálja meg újra."
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
            <CardTitle className="text-xl">Hőszivattyús megkeresés</CardTitle>
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
                label="Új építés vagy meglévő rendszer átalakítás?"
                options={projectModeOptions}
                value={formData.property.projectMode}
                error={getFieldError("projectMode")}
                required
                disabled={isSubmitting}
                onChange={(value) => updateField("projectMode", value, { touch: true })}
              />

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
                    placeholder="Például: 7627"
                    value={formData.property.postalCode}
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
                  ) : null}
                </label>
              </div>

              {formData.property.city.trim() ? (
                <div className={formInfoPanelClassName}>
                  <p className="text-sm font-medium text-white">
                    Szolgáltatási terület ellenőrzése
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    {getServiceAreaUserMessage(serviceAreaAssessment)}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}

          {currentStep === 1 ? (
            <div className="space-y-6">
              <div className={formSubtlePanelClassName}>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-white">
                    Jelenlegi rendszer
                  </p>
                  <p className="max-w-2xl text-sm leading-6 text-zinc-300">
                    Itt adhatja meg, miből indul a projekt.
                  </p>
                </div>

                <div className="mt-5 grid gap-6 xl:grid-cols-2">
                  <FormOptionGroup
                    label="Jelenlegi hőleadó oldal"
                    options={heatEmitterTypeOptions}
                    value={formData.system.heatEmitterType}
                    error={getFieldError("heatEmitterType")}
                    required
                    disabled={isSubmitting}
                    onChange={(value) =>
                      updateField("heatEmitterType", value, { touch: true })
                    }
                  />

                  <FormOptionGroup
                    label="Jelenlegi hőtermelő"
                    options={currentHeatSourceOptions}
                    value={formData.system.currentHeatSource}
                    error={getFieldError("currentHeatSource")}
                    required
                    disabled={isSubmitting}
                    onChange={(value) =>
                      updateField("currentHeatSource", value, { touch: true })
                    }
                  />
                </div>
              </div>

              <div className={formSubtlePanelClassName}>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-white">
                    Projektfeltételek
                  </p>
                  <p className="max-w-2xl text-sm leading-6 text-zinc-300">
                    Pár alapadat elég a kiinduláshoz.
                  </p>
                </div>

                <div className="mt-5 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                  <FormOptionGroup
                    label="HMV-igény"
                    options={hotWaterNeedOptions}
                    value={formData.system.hotWaterNeed}
                    error={getFieldError("hotWaterNeed")}
                    required
                    disabled={isSubmitting}
                    onChange={(value) =>
                      updateField("hotWaterNeed", value, { touch: true })
                    }
                  />

                  <FormOptionGroup
                    label="Elektromos háttér"
                    options={electricalSetupOptions}
                    value={formData.system.electricalSetup}
                    error={getFieldError("electricalSetup")}
                    required
                    disabled={isSubmitting}
                    onChange={(value) =>
                      updateField("electricalSetup", value, { touch: true })
                    }
                  />

                  <FormOptionGroup
                    label="Projekt szakasza"
                    options={projectStageOptions}
                    value={formData.system.projectStage}
                    error={getFieldError("projectStage")}
                    required
                    disabled={isSubmitting}
                    onChange={(value) =>
                      updateField("projectStage", value, { touch: true })
                    }
                  />
                </div>
              </div>

              <label className="space-y-3">
                <FormFieldLabel label="Rövid leírás" required />
                <Textarea
                  placeholder="Röviden írja le, milyen kiinduló helyzetből indul a projekt, és mi a legfontosabb cél vagy kérdés."
                  value={formData.system.requestDescription}
                  onChange={(event) =>
                    updateField("requestDescription", event.target.value)
                  }
                  onBlur={() => handleFieldBlur("requestDescription")}
                  aria-invalid={getFieldState("requestDescription").invalid}
                  disabled={isSubmitting}
                  className={cn(
                    "min-h-32",
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
                    placeholder="Például: mikor lehet biztosan helyszíni egyeztetést tartani, van-e tervdokumentáció."
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

                <label className="space-y-3">
                  <FormFieldLabel label="Megjegyzés" />
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
                    message="Nem kötelező."
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
                      Legfeljebb {serviceRequestMaxImageCount} kép tölthető fel
                      a helyszínről vagy a jelenlegi rendszerről.
                    </p>
                  </div>
                  <span className={formSummaryLabelClassName}>Opcionális</span>
                </div>

                <div className="mt-4 flex flex-col gap-4">
                  <FormUploadPrivacyNote />

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
                      Nincs kiválasztott kép.
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
              <div>
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
                    <div key={section.title} className={formSubtlePanelClassName}>
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
                              (field === "requestDescription" ||
                                field === "notes" ||
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
                          ? "A hőszivattyús megkeresés és a képek feltöltése folyamatban van."
                          : "A hőszivattyús megkeresés rögzítése folyamatban van."}
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
                          A megkeresés sikeresen rögzítve lett.
                        </p>
                        <p className={formSuccessBodyTextClassName}>
                          A megkeresés beérkezett. Hamarosan visszajelzünk.
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
