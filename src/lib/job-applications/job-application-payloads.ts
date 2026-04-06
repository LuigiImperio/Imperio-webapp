import type { Database } from "@/lib/supabase/database.types"

export type JobApplicationFormData = {
  fullName: string
  email: string
  phone: string
  motivationText: string
  interestArea: string
  note: string
}

export type JobApplicationInsert =
  Database["public"]["Tables"]["job_applications"]["Insert"]

export function buildJobApplicationInsert({
  applicationId,
  formData,
  cvFilePath,
  cvFileName,
  cvContentType,
  cvFileSizeBytes,
}: {
  applicationId: string
  formData: JobApplicationFormData
  cvFilePath: string
  cvFileName: string
  cvContentType: string
  cvFileSizeBytes: number
}): JobApplicationInsert {
  const interestArea = formData.interestArea.trim()
  const note = formData.note.trim()

  return {
    id: applicationId,
    status: "uj",
    full_name: formData.fullName.trim(),
    email: formData.email.trim(),
    phone: formData.phone.trim(),
    motivation_text: formData.motivationText.trim(),
    interest_area: interestArea || null,
    note: note || null,
    cv_file_path: cvFilePath,
    cv_file_name: cvFileName.trim(),
    cv_content_type: cvContentType.trim(),
    cv_file_size_bytes: cvFileSizeBytes,
  }
}
