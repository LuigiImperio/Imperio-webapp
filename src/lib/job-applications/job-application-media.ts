const allowedJobApplicationCvMimeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.oasis.opendocument.text",
  "application/rtf",
  "text/rtf",
])

const allowedJobApplicationCvExtensions = [
  ".pdf",
  ".doc",
  ".docx",
  ".odt",
  ".rtf",
] as const

export const jobApplicationFilesBucket = "job-application-files"
export const jobApplicationMaxCvSizeBytes = 10 * 1024 * 1024

export type JobApplicationCvUpload = {
  cv_file_path: string
  cv_file_name: string
  cv_content_type: string
  cv_file_size_bytes: number
}

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase()
}

function hasAllowedExtension(fileName: string) {
  const normalizedFileName = fileName.toLowerCase()

  return allowedJobApplicationCvExtensions.some((extension) =>
    normalizedFileName.endsWith(extension)
  )
}

export function validateJobApplicationCvFile(file: File) {
  if (!file || file.size <= 0) {
    throw new Error("Az önéletrajz feltöltése kötelező.")
  }

  if (file.size > jobApplicationMaxCvSizeBytes) {
    throw new Error("Az önéletrajz mérete legfeljebb 10 MB lehet.")
  }

  if (
    file.type &&
    !allowedJobApplicationCvMimeTypes.has(file.type) &&
    !hasAllowedExtension(file.name)
  ) {
    throw new Error(
      "Az önéletrajz PDF, DOC, DOCX, ODT vagy RTF formátumban tölthető fel."
    )
  }

  if (!file.type && !hasAllowedExtension(file.name)) {
    throw new Error(
      "Az önéletrajz PDF, DOC, DOCX, ODT vagy RTF formátumban tölthető fel."
    )
  }
}

export function buildJobApplicationCvPath({
  applicationId,
  fileName,
}: {
  applicationId: string
  fileName: string
}) {
  const timestamp = Date.now()
  const normalizedName = sanitizeFileName(fileName)

  return `job-applications/${applicationId}/${timestamp}-${normalizedName}`
}
