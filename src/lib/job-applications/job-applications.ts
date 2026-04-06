import { fetchWithTimeout } from "@/lib/network/fetch-with-timeout"
import {
  validateJobApplicationCvFile,
  type JobApplicationCvUpload,
} from "@/lib/job-applications/job-application-media"
import type { JobApplicationFormData } from "@/lib/job-applications/job-application-payloads"

export type { JobApplicationFormData }

type JobApplicationSubmissionResponse = {
  applicationId: string
  notificationSent: boolean
  customerConfirmationSent: boolean
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isJobApplicationSubmissionResponse(
  value: unknown
): value is JobApplicationSubmissionResponse {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.applicationId === "string" &&
    typeof value.notificationSent === "boolean" &&
    typeof value.customerConfirmationSent === "boolean"
  )
}

function normalizeSubmissionError(error: unknown) {
  if (error instanceof Error && error.name === "AbortError") {
    return new Error(
      "A jelentkezés elküldése túl sokáig tartott. Kérjük, próbálja újra."
    )
  }

  if (error instanceof TypeError) {
    return new Error(
      "A kapcsolat megszakadt a jelentkezés beküldése közben. Kérjük, ellenőrizze a hálózatot, majd próbálja újra."
    )
  }

  return error
}

export async function submitJobApplication({
  formData,
  cvFile,
}: {
  formData: JobApplicationFormData
  cvFile: File
}) {
  validateJobApplicationCvFile(cvFile)

  const requestBody = new FormData()

  requestBody.set("fullName", formData.fullName)
  requestBody.set("email", formData.email)
  requestBody.set("phone", formData.phone)
  requestBody.set("motivationText", formData.motivationText)
  requestBody.set("interestArea", formData.interestArea)
  requestBody.set("note", formData.note)
  requestBody.set("cvFile", cvFile)

  let response: Response

  try {
    response = await fetchWithTimeout(
      "/api/job-applications",
      {
        method: "POST",
        body: requestBody,
      },
      30000
    )
  } catch (error) {
    throw normalizeSubmissionError(error)
  }

  const data: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(
      isRecord(data) && typeof data.error === "string"
        ? data.error
        : "A jelentkezés elküldése most nem sikerült."
    )
  }

  const submissionData = isJobApplicationSubmissionResponse(data) ? data : null

  return {
    applicationId: submissionData?.applicationId ?? "",
    notificationSent: submissionData?.notificationSent ?? false,
    customerConfirmationSent: submissionData?.customerConfirmationSent ?? false,
  }
}

export function buildJobApplicationCvUpload(
  filePath: string,
  file: File
): JobApplicationCvUpload {
  return {
    cv_file_path: filePath,
    cv_file_name: file.name,
    cv_content_type: file.type || "application/octet-stream",
    cv_file_size_bytes: file.size,
  }
}
