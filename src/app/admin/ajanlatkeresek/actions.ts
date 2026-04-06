"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { getAdminAccessState } from "@/lib/config/server-env"
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
    ? `/admin/ajanlatkeresek?${searchParams.toString()}`
    : "/admin/ajanlatkeresek"
}

export async function updateServiceRequestStatusAction(formData: FormData) {
  const requestId = getTextValue(formData.get("requestId"))
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

  if (!requestId || !isServiceRequestStatus(nextStatus)) {
    redirect(
      buildRedirectUrl({
        token,
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
        token,
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
        token,
        activeFilter,
        result: "status_error",
      })
    )
  }
}

export async function updateServiceRequestAdminNoteAction(formData: FormData) {
  const requestId = getTextValue(formData.get("requestId"))
  const adminNote = getTextValue(formData.get("adminNote"))
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

  if (!requestId) {
    redirect(
      buildRedirectUrl({
        token,
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
        token,
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
        token,
        activeFilter,
        result: "note_error",
      })
    )
  }
}
