import type { ServiceRequestType } from "@/lib/service-requests/service-request-types"

export const serviceRequestImagesBucket = "service-request-images"
export const serviceRequestMaxImageCount = 3
export const serviceRequestMaxImageSizeBytes = 8 * 1024 * 1024

export type ServiceRequestAttachmentInsert = {
  service_request_id: string
  bucket_name: string
  storage_path: string
  file_name: string
  content_type: string
  file_size_bytes: number
}

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase()
}

export function buildServiceRequestImagePath({
  serviceType,
  requestId,
  fileName,
  index,
}: {
  serviceType: ServiceRequestType
  requestId: string
  fileName: string
  index: number
}) {
  const timestamp = Date.now()
  const normalizedName = sanitizeFileName(fileName)

  return `${serviceType}/${requestId}/${timestamp}-${index + 1}-${normalizedName}`
}
