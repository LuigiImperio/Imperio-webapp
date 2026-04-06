"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { getAdminAccessState } from "@/lib/config/server-env"
import { logServerError } from "@/lib/logging"
import {
  isJobApplicationStatus,
  updateJobApplicationStatus,
} from "@/lib/supabase/job-applications-admin"

function getTextValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : ""
}

function buildRedirectUrl({
  token,
  activeFilter,
  result,
}: {
  token: string
  activeFilter: string
  result?: string
}) {
  const searchParams = new URLSearchParams()

  if (token) {
    searchParams.set("token", token)
  }

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
  const token = getTextValue(formData.get("token"))
  const activeFilter = getTextValue(formData.get("activeFilter"))

  if (!getAdminAccessState(token).hasAccess) {
    redirect(
      buildRedirectUrl({
        token: "",
        activeFilter,
        result: "unauthorized",
      })
    )
  }

  if (!applicationId || !isJobApplicationStatus(nextStatus)) {
    redirect(
      buildRedirectUrl({
        token,
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
        token,
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
        token,
        activeFilter,
        result: "status_error",
      })
    )
  }
}
