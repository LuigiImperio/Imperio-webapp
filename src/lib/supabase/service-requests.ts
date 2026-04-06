import { fetchWithTimeout } from "@/lib/network/fetch-with-timeout"
import { PublicConfigurationError } from "@/lib/config/public-env"
import type { ServiceRequestType } from "@/lib/service-requests/service-request-types"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import {
  buildServiceRequestImagePath,
  serviceRequestMaxImageCount,
  serviceRequestMaxImageSizeBytes,
  serviceRequestImagesBucket,
  type ServiceRequestAttachmentInsert,
} from "@/lib/supabase/service-request-media"
import {
  type BuildingServicesInquiryData,
  type BoilerReplacementInquiryData,
  type FaultReportInquiryData,
  type HeatingModernizationInquiryData,
  type HeatPumpInstallationInquiryData,
  type LeakRequestInquiryData,
  type PlumbingRequestInquiryData,
} from "@/lib/service-requests/service-request-payloads"

export type {
  BuildingServicesInquiryData,
  BoilerReplacementInquiryData,
  FaultReportInquiryData,
  HeatingModernizationInquiryData,
  HeatPumpInstallationInquiryData,
  LeakRequestInquiryData,
  PlumbingRequestInquiryData,
}

type ServiceRequestSubmissionResponse = {
  requestId: string
  notificationSent: boolean
  customerConfirmationSent: boolean
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isServiceRequestSubmissionResponse(
  value: unknown
): value is ServiceRequestSubmissionResponse {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.requestId === "string" &&
    typeof value.notificationSent === "boolean" &&
    typeof value.customerConfirmationSent === "boolean"
  )
}

function normalizeSubmissionError(error: unknown) {
  if (error instanceof Error && error.name === "AbortError") {
    return new Error(
      "Az ajánlatkérés elküldése túl sokáig tartott. Kérjük, próbálja újra."
    )
  }

  if (error instanceof TypeError) {
    return new Error(
      "A kapcsolat megszakadt a beküldés közben. Kérjük, ellenőrizze a hálózatot, majd próbálja újra."
    )
  }

  return error
}

function normalizeUploadError(error: unknown) {
  if (error instanceof PublicConfigurationError) {
    return new Error(
      "A képfeltöltés jelenleg nem érhető el. Az ajánlatkérés ettől függetlenül még elküldhető."
    )
  }

  if (error instanceof Error && error.name === "AbortError") {
    return new Error(
      "A képfeltöltés túl sokáig tartott. Kérjük, próbálja újra kisebb vagy kevesebb képpel."
    )
  }

  if (error instanceof TypeError) {
    return new Error(
      "A kapcsolat megszakadt a képfeltöltés közben. Kérjük, ellenőrizze a hálózatot, majd próbálja újra."
    )
  }

  return new Error(
    "Az ajánlatkérés rögzítve lett, de a képek csatolása most nem sikerült."
  )
}

function validateSelectedFiles(files: File[]) {
  if (files.length > serviceRequestMaxImageCount) {
    throw new Error(
      `Legfeljebb ${serviceRequestMaxImageCount} kép tölthető fel egy megkereséshez.`
    )
  }

  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      throw new Error("Csak képfájlok tölthetők fel.")
    }

    if (file.size > serviceRequestMaxImageSizeBytes) {
      throw new Error("Egy kép mérete legfeljebb 8 MB lehet.")
    }
  }
}

async function submitServiceRequest({
  requestId,
  serviceType,
  formData,
}: {
  requestId: string
  serviceType: ServiceRequestType
  formData:
    | BuildingServicesInquiryData
    | BoilerReplacementInquiryData
    | HeatingModernizationInquiryData
    | HeatPumpInstallationInquiryData
    | FaultReportInquiryData
    | LeakRequestInquiryData
    | PlumbingRequestInquiryData
}) {
  let response: Response

  try {
    response = await fetchWithTimeout(
      "/api/service-requests",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId,
          serviceType,
          formData,
        }),
      },
      15000
    )
  } catch (error) {
    throw normalizeSubmissionError(error)
  }

  const data: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(
      isRecord(data) && typeof data.error === "string"
        ? data.error
        : "Az ajánlatkérés rögzítése nem sikerült."
    )
  }

  const submissionData = isServiceRequestSubmissionResponse(data) ? data : null

  return {
    requestId: submissionData?.requestId ?? requestId,
    notificationSent: submissionData?.notificationSent ?? false,
    customerConfirmationSent: submissionData?.customerConfirmationSent ?? false,
  }
}

export async function submitBoilerReplacementServiceRequest({
  requestId,
  formData,
}: {
  requestId: string
  formData: BoilerReplacementInquiryData
}) {
  return submitServiceRequest({
    requestId,
    serviceType: "kazancsere",
    formData,
  })
}

export async function submitHeatingModernizationServiceRequest({
  requestId,
  formData,
}: {
  requestId: string
  formData: HeatingModernizationInquiryData
}) {
  return submitServiceRequest({
    requestId,
    serviceType: "futeskorszerusites",
    formData,
  })
}

export async function submitFaultReportServiceRequest({
  requestId,
  formData,
}: {
  requestId: string
  formData: FaultReportInquiryData
}) {
  return submitServiceRequest({
    requestId,
    serviceType: "hibabejelentes",
    formData,
  })
}

export async function submitLeakRequestServiceRequest({
  requestId,
  formData,
}: {
  requestId: string
  formData: LeakRequestInquiryData
}) {
  return submitServiceRequest({
    requestId,
    serviceType: "csotores_szivargas",
    formData,
  })
}

export async function submitPlumbingServiceRequest({
  requestId,
  formData,
}: {
  requestId: string
  formData: PlumbingRequestInquiryData
}) {
  return submitServiceRequest({
    requestId,
    serviceType: "vizszereles",
    formData,
  })
}

export async function submitHeatPumpInstallationServiceRequest({
  requestId,
  formData,
}: {
  requestId: string
  formData: HeatPumpInstallationInquiryData
}) {
  return submitServiceRequest({
    requestId,
    serviceType: "hoszivattyu_telepites",
    formData,
  })
}

export async function submitBuildingServicesServiceRequest({
  requestId,
  formData,
}: {
  requestId: string
  formData: BuildingServicesInquiryData
}) {
  return submitServiceRequest({
    requestId,
    serviceType: "komplett_epuletgepeszeti_kivitelezes",
    formData,
  })
}

export async function uploadServiceRequestImages({
  requestId,
  serviceType,
  files,
}: {
  requestId: string
  serviceType: ServiceRequestType
  files: File[]
}) {
  validateSelectedFiles(files)

  let supabase: ReturnType<typeof getSupabaseBrowserClient>

  try {
    supabase = getSupabaseBrowserClient()
  } catch (error) {
    throw normalizeUploadError(error)
  }

  const attachments: ServiceRequestAttachmentInsert[] = []
  const uploadedPaths: string[] = []
  let hasCleanedUp = false

  async function cleanupUploadedFiles() {
    if (hasCleanedUp || uploadedPaths.length === 0) {
      return
    }

    hasCleanedUp = true

    await supabase.storage
      .from(serviceRequestImagesBucket)
      .remove(uploadedPaths)
      .catch(() => undefined)
  }

  try {
    for (const [index, file] of files.entries()) {
      const storagePath = buildServiceRequestImagePath({
        serviceType,
        requestId,
        fileName: file.name,
        index,
      })

      const { error } = await supabase.storage
        .from(serviceRequestImagesBucket)
        .upload(storagePath, file, {
          upsert: false,
          contentType: file.type || undefined,
        })

      if (error) {
        throw error
      }

      uploadedPaths.push(storagePath)
      attachments.push({
        service_request_id: requestId,
        bucket_name: serviceRequestImagesBucket,
        storage_path: storagePath,
        file_name: file.name,
        content_type: file.type || "application/octet-stream",
        file_size_bytes: file.size,
      })
    }

    if (attachments.length === 0) {
      return []
    }

    const { error } = await supabase
      .from("service_request_attachments")
      .insert(attachments)

    if (error) {
      await cleanupUploadedFiles()
      throw error
    }

    return attachments
  } catch (error) {
    await cleanupUploadedFiles()
    throw normalizeUploadError(error)
  }
}

export async function uploadBoilerReplacementImages({
  requestId,
  files,
}: {
  requestId: string
  files: File[]
}) {
  return uploadServiceRequestImages({
    requestId,
    serviceType: "kazancsere",
    files,
  })
}
