import "server-only"

import { getRequiredServerEnv } from "@/lib/config/server-env"
import { getServiceRequestTypeLabel } from "@/lib/service-requests/service-request-types"
import { fetchWithTimeout } from "@/lib/network/fetch-with-timeout"
import type { ServiceRequestInsert } from "@/lib/service-requests/service-request-payloads"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function getLeakSummaryParts(formDataJson: unknown) {
  if (!isRecord(formDataJson)) {
    return null
  }

  const issue = formDataJson.issue

  if (!isRecord(issue)) {
    return null
  }

  const affectedArea = issue.affectedArea
  const leakActive = issue.leakActive
  const damageLevel = issue.damageLevel

  return [
    typeof affectedArea === "string" ? affectedArea : null,
    typeof leakActive === "string" ? leakActive : null,
    typeof damageLevel === "string" ? damageLevel : null,
  ].filter(Boolean) as string[]
}

function getHeatPumpSummaryParts(formDataJson: unknown) {
  if (!isRecord(formDataJson)) {
    return null
  }

  const property = formDataJson.property
  const system = formDataJson.system

  if (!isRecord(property) || !isRecord(system)) {
    return null
  }

  const propertyType = property.propertyType
  const area = property.area
  const projectMode = property.projectMode
  const heatEmitterType = system.heatEmitterType

  return [
    typeof propertyType === "string" ? propertyType : null,
    typeof area === "string" && area.trim() ? `${area.trim()} m²` : null,
    typeof heatEmitterType === "string" ? heatEmitterType : null,
    typeof projectMode === "string" ? projectMode : null,
  ].filter(Boolean) as string[]
}

export function getResendEnvironment() {
  const resendApiKey = getRequiredServerEnv(
    "RESEND_API_KEY",
    "Resend e-mail küldés"
  )
  const notificationFromEmail = getRequiredServerEnv(
    "ADMIN_NOTIFICATION_FROM_EMAIL",
    "Resend e-mail küldés"
  )

  return {
    resendApiKey,
    notificationFromEmail,
  }
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}

export function formatServiceType(serviceType: string) {
  return getServiceRequestTypeLabel(serviceType)
}

export function buildTechnicalSummary(payload: ServiceRequestInsert) {
  if (payload.service_type === "hibabejelentes") {
    return [payload.current_boiler_type, payload.boiler_status].join(" • ")
  }

  if (payload.service_type === "csotores_szivargas") {
    return (
      getLeakSummaryParts(payload.form_data_json)?.join(" • ") ||
      [payload.current_boiler_type, payload.boiler_status, payload.replacement_reason]
        .filter(Boolean)
        .join(" • ")
    )
  }

  if (payload.service_type === "vizszereles") {
    return [payload.current_boiler_type, payload.boiler_status].join(" • ")
  }

  if (payload.service_type === "futeskorszerusites") {
    return [
      payload.property_type,
      `${payload.property_area} m²`,
      payload.current_boiler_type,
      payload.replacement_reason,
    ].join(" • ")
  }

  if (payload.service_type === "hoszivattyu_telepites") {
    return (
      getHeatPumpSummaryParts(payload.form_data_json)?.join(" • ") ||
      [
        payload.property_type,
        `${payload.property_area} m²`,
        payload.current_boiler_type,
        payload.boiler_status,
      ].join(" • ")
    )
  }

  if (payload.service_type === "komplett_epuletgepeszeti_kivitelezes") {
    return [
      payload.property_type,
      `${payload.property_area} m²`,
      payload.current_boiler_type,
      payload.replacement_reason,
    ].join(" • ")
  }

  return [
    payload.property_type,
    `${payload.property_area} m²`,
    payload.current_boiler_type,
    payload.replacement_reason,
  ].join(" • ")
}

export async function sendResendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string[]
  subject: string
  text: string
  html: string
}) {
  const { resendApiKey, notificationFromEmail } = getResendEnvironment()

  let response: Response

  try {
    response = await fetchWithTimeout(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: notificationFromEmail,
          to,
          subject,
          text,
          html,
        }),
      },
      12000
    )
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Az e-mail szolgáltató nem válaszolt időben.")
    }

    throw new Error("Az e-mail szolgáltató elérése nem sikerült.")
  }

  if (!response.ok) {
    const errorBody = (await response.text())
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 280)

    throw new Error(
      errorBody
        ? `Az e-mail küldése nem sikerült: ${response.status} ${errorBody}`
        : `Az e-mail küldése nem sikerült: ${response.status}`
    )
  }
}
