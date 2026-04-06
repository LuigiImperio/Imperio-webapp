import "server-only"

import { jobApplicationFilesBucket } from "@/lib/job-applications/job-application-media"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export const jobApplicationStatuses = [
  "uj",
  "atnezve",
  "kapcsolat_felveve",
  "lezarva",
] as const

export type JobApplicationStatus = (typeof jobApplicationStatuses)[number]

export type JobApplicationRecord = {
  id: string
  full_name: string
  email: string
  phone: string
  motivation_text: string
  interest_area: string | null
  note: string | null
  cv_file_path: string
  cv_file_name: string
  cv_content_type: string
  cv_file_size_bytes: number
  status: JobApplicationStatus
  created_at: string
  signed_cv_url: string | null
}

type JobApplicationRow = Omit<JobApplicationRecord, "signed_cv_url">

export function isJobApplicationStatus(
  value: string | undefined
): value is JobApplicationStatus {
  return jobApplicationStatuses.includes(value as JobApplicationStatus)
}

export function getJobApplicationStatusLabel(status: JobApplicationStatus) {
  switch (status) {
    case "uj":
      return "Új"
    case "atnezve":
      return "Átnézve"
    case "kapcsolat_felveve":
      return "Kapcsolat felvéve"
    case "lezarva":
      return "Lezárva"
  }
}

async function withSignedCvUrl(application: JobApplicationRow) {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase.storage
    .from(jobApplicationFilesBucket)
    .createSignedUrl(application.cv_file_path, 60 * 60)

  return {
    ...application,
    signed_cv_url: error ? null : data.signedUrl,
  }
}

export async function getJobApplications(status?: JobApplicationStatus) {
  const supabase = getSupabaseServerClient()

  let query = supabase
    .from("job_applications")
    .select(
      "id, full_name, email, phone, motivation_text, interest_area, note, cv_file_path, cv_file_name, cv_content_type, cv_file_size_bytes, status, created_at"
    )
    .order("created_at", { ascending: false })

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return Promise.all(
    ((data ?? []) as JobApplicationRow[]).map((application) =>
      withSignedCvUrl(application)
    )
  )
}

export async function updateJobApplicationStatus(
  applicationId: string,
  status: JobApplicationStatus
) {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase
    .from("job_applications")
    .update({ status })
    .eq("id", applicationId)

  if (error) {
    throw error
  }
}
