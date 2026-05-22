"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { resolveAdminAccessFromCookie } from "@/lib/admin/admin-access"
import { logServerError } from "@/lib/logging"
import {
  isServiceRequestStatus,
  updateServiceRequestAdminNote,
  updateServiceRequestStatus,
} from "@/lib/supabase/service-requests-admin"

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
    ? `/admin/ajanlatkeresek?${searchParams.toString()}`
    : "/admin/ajanlatkeresek"
}

export async function updateServiceRequestStatusAction(formData: FormData) {
  const requestId = getTextValue(formData.get("requestId"))
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

  if (!requestId || !isServiceRequestStatus(nextStatus)) {
    redirect(
      buildRedirectUrl({
        activeFilter,
        result: "status_invalid",
      })
    )
  }

  try {
    await updateServiceRequestStatus(requestId, nextStatus)
    revalidatePath("/admin/ajanlatkeresek")
    redirect(
      buildRedirectUrl({
        activeFilter,
        result: "status_saved",
      })
    )
  } catch (error) {
    logServerError("Admin státuszmentési hiba", error, {
      requestId,
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

export async function updateServiceRequestAdminNoteAction(formData: FormData) {
  const requestId = getTextValue(formData.get("requestId"))
  const adminNote = getTextValue(formData.get("adminNote"))
  const activeFilter = getTextValue(formData.get("activeFilter"))

  if (!(await resolveAdminAccessFromCookie()).hasAccess) {
    redirect(
      buildRedirectUrl({
        activeFilter,
        result: "unauthorized",
      })
    )
  }

  if (!requestId) {
    redirect(
      buildRedirectUrl({
        activeFilter,
        result: "note_invalid",
      })
    )
  }

  try {
    await updateServiceRequestAdminNote(requestId, adminNote)
    revalidatePath("/admin/ajanlatkeresek")
    redirect(
      buildRedirectUrl({
        activeFilter,
        result: "note_saved",
      })
    )
  } catch (error) {
    logServerError("Admin megjegyzésmentési hiba", error, {
      requestId,
    })
    redirect(
      buildRedirectUrl({
        activeFilter,
        result: "note_error",
      })
    )
  }
}
