"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { resolveAdminAccessFromCookie } from "@/lib/admin/admin-access"
import { logServerError } from "@/lib/logging"
import {
  isJobApplicationStatus,
  updateJobApplicationStatus,
} from "@/lib/supabase/job-applications-admin"

function getTextValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : ""
}

function buildRedirectUrl({
  activeFilter,
  result,
}: {
  activeFilter: string
  result?: string
}) {
  const searchParams = new URLSearchParams()

  if (activeFilter && activeFilter !== "osszes") {
    searchParams.set("status", activeFilter)
  }

  if (result) {
    searchParams.set("result", result)
  }

  return searchParams.size
    ? `/admin/jelentkezesek?${searchParams.toString()}`
    : "/admin/jelentkezesek"
}

export async function updateJobApplicationStatusAction(formData: FormData) {
  const applicationId = getTextValue(formData.get("applicationId"))
  const nextStatus = getTextValue(formData.get("status"))
  const activeFilter = getTextValue(formData.get("activeFilter"))

  if (!(await resolveAdminAccessFromCookie()).hasAccess) {
    redirect(
      buildRedirectUrl({
        activeFilter,
        result: "unauthorized",
      })
    )
  }

  if (!applicationId || !isJobApplicationStatus(nextStatus)) {
    redirect(
      buildRedirectUrl({
        activeFilter,
        result: "status_invalid",
      })
    )
  }

  try {
    await updateJobApplicationStatus(applicationId, nextStatus)
    revalidatePath("/admin/jelentkezesek")
    redirect(
      buildRedirectUrl({
        activeFilter,
        result: "status_saved",
      })
    )
  } catch (error) {
    logServerError("Munkajelentkezés státuszmentési hiba", error, {
      applicationId,
      nextStatus,
    })
    redirect(
      buildRedirectUrl({
        activeFilter,
        result: "status_error",
      })
    )
  }
}
