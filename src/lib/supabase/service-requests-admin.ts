import "server-only"

import {
  serviceRequestTypes,
  type ServiceRequestType,
} from "@/lib/service-requests/service-request-types"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export const serviceRequestStatuses = [
  "uj",
  "folyamatban",
  "kapcsolat_felveve",
  "lezarva",
] as const

export type ServiceRequestStatus = (typeof serviceRequestStatuses)[number]

export type ServiceRequestServiceType = ServiceRequestType

export type ServiceRequestAttachmentRecord = {
  id: string
  service_request_id: string
  bucket_name: string
  storage_path: string
  file_name: string
  content_type: string
  file_size_bytes: number
  created_at: string
  signed_url: string | null
}

export type ServiceRequestRecord = {
  id: string
  service_type: ServiceRequestServiceType | string
  status: ServiceRequestStatus
  admin_note: string | null
  full_name: string
  phone: string
  email: string
  city: string
  property_type: string
  property_area: string
  current_boiler_type: string
  boiler_status: string
  replacement_reason: string
  message: string | null
  created_at: string
  form_data_json: Record<string, unknown>
  attachments: ServiceRequestAttachmentRecord[]
}

type ServiceRequestAttachmentRow = Omit<ServiceRequestAttachmentRecord, "signed_url">

export type ServiceRequestLatestPreview = {
  id: string
  service_type: ServiceRequestServiceType | string
  full_name: string
  city: string
  status: ServiceRequestStatus
  created_at: string
}

export type ServiceRequestDashboardSummary = {
  totalCount: number
  statusCounts: Record<ServiceRequestStatus, number>
  serviceTypeCounts: Record<ServiceRequestServiceType, number>
  latestRequests: ServiceRequestLatestPreview[]
}

export function isServiceRequestStatus(
  value: string | undefined
): value is ServiceRequestStatus {
  return serviceRequestStatuses.includes(value as ServiceRequestStatus)
}

export function getServiceRequestStatusLabel(status: ServiceRequestStatus) {
  switch (status) {
    case "uj":
      return "Új"
    case "folyamatban":
      return "Folyamatban"
    case "kapcsolat_felveve":
      return "Kapcsolat felvéve"
    case "lezarva":
      return "Lezárva"
  }
}

function createEmptyStatusCounts(): Record<ServiceRequestStatus, number> {
  return {
    uj: 0,
    folyamatban: 0,
    kapcsolat_felveve: 0,
    lezarva: 0,
  }
}

function createEmptyServiceTypeCounts(): Record<ServiceRequestServiceType, number> {
  return Object.fromEntries(
    serviceRequestTypes.map((serviceType) => [serviceType, 0])
  ) as Record<ServiceRequestServiceType, number>
}

async function getSignedAttachments(
  attachments: ServiceRequestAttachmentRow[],
  supabase: ReturnType<typeof getSupabaseServerClient>
) {
  const attachmentsWithSignedUrls = await Promise.all(
    attachments.map(async (attachment) => {
      const { data, error } = await supabase.storage
        .from(attachment.bucket_name)
        .createSignedUrl(attachment.storage_path, 60 * 60)

      return {
        ...attachment,
        signed_url: error ? null : data.signedUrl,
      }
    })
  )

  return attachmentsWithSignedUrls.reduce<
    Record<string, ServiceRequestAttachmentRecord[]>
  >((accumulator, attachment) => {
    if (!accumulator[attachment.service_request_id]) {
      accumulator[attachment.service_request_id] = []
    }

    accumulator[attachment.service_request_id].push(attachment)
    return accumulator
  }, {})
}

export async function getServiceRequests(status?: ServiceRequestStatus) {
  const supabase = getSupabaseServerClient()

  let query = supabase
    .from("service_requests")
    .select(
      "id, service_type, status, admin_note, full_name, phone, email, city, property_type, property_area, current_boiler_type, boiler_status, replacement_reason, message, created_at, form_data_json"
    )
    .order("created_at", { ascending: false })

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  const requests = (data ?? []) as Omit<ServiceRequestRecord, "attachments">[]

  if (requests.length === 0) {
    return []
  }

  const requestIds = requests.map((request) => request.id)

  const { data: attachmentRows, error: attachmentError } = await supabase
    .from("service_request_attachments")
    .select(
      "id, service_request_id, bucket_name, storage_path, file_name, content_type, file_size_bytes, created_at"
    )
    .in("service_request_id", requestIds)
    .order("created_at", { ascending: true })

  if (attachmentError) {
    throw attachmentError
  }

  const attachmentsByRequestId = await getSignedAttachments(
    (attachmentRows ?? []) as ServiceRequestAttachmentRow[],
    supabase
  )

  return requests.map((request) => ({
    ...request,
    attachments: attachmentsByRequestId[request.id] ?? [],
  }))
}

export async function getServiceRequestDashboardSummary(): Promise<ServiceRequestDashboardSummary> {
  const supabase = getSupabaseServerClient()

  const [{ data: countRows, error: countError }, { data: latestRows, error: latestError }] =
    await Promise.all([
      supabase
        .from("service_requests")
        .select("status, service_type"),
      supabase
        .from("service_requests")
        .select("id, service_type, full_name, city, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5),
    ])

  if (countError) {
    throw countError
  }

  if (latestError) {
    throw latestError
  }

  const statusCounts = createEmptyStatusCounts()
  const serviceTypeCounts = createEmptyServiceTypeCounts()
  const normalizedCountRows = (countRows ?? []) as Array<{
    status: ServiceRequestStatus
    service_type: ServiceRequestServiceType | string
  }>

  for (const row of normalizedCountRows) {
    if (row.status in statusCounts) {
      statusCounts[row.status] += 1
    }

    if (serviceRequestTypes.includes(row.service_type as ServiceRequestServiceType)) {
      serviceTypeCounts[row.service_type as ServiceRequestServiceType] += 1
    }
  }

  return {
    totalCount: normalizedCountRows.length,
    statusCounts,
    serviceTypeCounts,
    latestRequests: (latestRows ?? []) as ServiceRequestLatestPreview[],
  }
}

export async function updateServiceRequestStatus(
  requestId: string,
  status: ServiceRequestStatus
) {
  const supabase = getSupabaseServerClient()

  const { error } = await supabase
    .from("service_requests")
    .update({ status })
    .eq("id", requestId)

  if (error) {
    throw error
  }
}

export async function updateServiceRequestAdminNote(
  requestId: string,
  adminNote: string
) {
  const supabase = getSupabaseServerClient()
  const trimmedAdminNote = adminNote.trim()

  const { error } = await supabase
    .from("service_requests")
    .update({
      admin_note: trimmedAdminNote ? trimmedAdminNote : null,
    })
    .eq("id", requestId)

  if (error) {
    throw error
  }
}
