import "server-only"

import { getRequiredServerEnv } from "@/lib/config/server-env"
import { getServiceAreaStatusLabel } from "@/lib/service-area"
import {
  getPreferredContactTime,
  getStoredPostalCode,
  getStoredSchedulingInfo,
  getStoredServiceAreaInfo,
} from "@/lib/service-requests/request-metadata"
import type { ServiceRequestInsert } from "@/lib/service-requests/service-request-payloads"
import {
  buildTechnicalSummary,
  escapeHtml,
  formatDate,
  formatServiceType,
  sendResendEmail,
} from "@/lib/email/service-request-email-shared"

function buildAdminRequestsUrl(baseUrl: string) {
  return `${baseUrl.replace(/\/$/, "")}/admin/ajanlatkeresek`
}

function buildEmailText({
  payload,
  submittedAt,
  adminRequestsUrl,
}: {
  payload: ServiceRequestInsert
  submittedAt: string
  adminRequestsUrl: string
}) {
  const preferredContactTime = getPreferredContactTime(payload.form_data_json)
  const postalCode = getStoredPostalCode(payload.form_data_json)
  const serviceAreaStatus = getServiceAreaStatusLabel(
    getStoredServiceAreaInfo(payload.form_data_json)
  )
  const schedulingInfo = getStoredSchedulingInfo(payload.form_data_json)

  return [
    `Új ajánlatkérés érkezett: ${formatServiceType(payload.service_type)}`,
    "",
    `Szolgáltatás: ${formatServiceType(payload.service_type)}`,
    `Név: ${payload.full_name}`,
    `Telefonszám: ${payload.phone}`,
    `E-mail: ${payload.email}`,
    `Irányítószám: ${postalCode ?? "Nincs megadva"}`,
    `Település: ${payload.city}`,
    `Legkönnyebben kereshető: ${preferredContactTime ?? "Nincs megadva"}`,
    `Szolgáltatási terület: ${serviceAreaStatus}`,
    `Szükséges lehet helyszíni felmérés: ${schedulingInfo?.siteVisitNeed ?? "Nincs megadva"}`,
    `Megfelelő egyeztetési sáv: ${schedulingInfo?.appointmentWindow ?? "Nincs megadva"}`,
    ...(schedulingInfo?.schedulingNote
      ? [`Kapcsolódó egyeztetési megjegyzés: ${schedulingInfo.schedulingNote}`]
      : []),
    `Beküldés ideje: ${formatDate(submittedAt)}`,
    `Rövid műszaki összefoglaló: ${buildTechnicalSummary(payload)}`,
    "",
    `Admin oldal: ${adminRequestsUrl}`,
    "A megnyitáshoz a belső hozzáférési token továbbra is szükséges.",
  ].join("\n")
}

function buildEmailHtml({
  payload,
  submittedAt,
  adminRequestsUrl,
}: {
  payload: ServiceRequestInsert
  submittedAt: string
  adminRequestsUrl: string
}) {
  const serviceType = escapeHtml(formatServiceType(payload.service_type))
  const technicalSummary = escapeHtml(buildTechnicalSummary(payload))
  const preferredContactTime = escapeHtml(
    getPreferredContactTime(payload.form_data_json) ?? "Nincs megadva"
  )
  const postalCode = escapeHtml(
    getStoredPostalCode(payload.form_data_json) ?? "Nincs megadva"
  )
  const serviceAreaStatus = escapeHtml(
    getServiceAreaStatusLabel(getStoredServiceAreaInfo(payload.form_data_json))
  )
  const schedulingInfo = getStoredSchedulingInfo(payload.form_data_json)
  const siteVisitNeed = escapeHtml(
    schedulingInfo?.siteVisitNeed ?? "Nincs megadva"
  )
  const appointmentWindow = escapeHtml(
    schedulingInfo?.appointmentWindow ?? "Nincs megadva"
  )
  const schedulingNote = schedulingInfo?.schedulingNote
    ? escapeHtml(schedulingInfo.schedulingNote)
    : null

  return `
    <div style="font-family: Arial, sans-serif; background: #09090b; color: #fafafa; padding: 24px;">
      <div style="max-width: 680px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; background: rgba(255,255,255,0.04); overflow: hidden;">
        <div style="padding: 28px; border-bottom: 1px solid rgba(255,255,255,0.08);">
          <div style="display: inline-block; padding: 6px 12px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.12); color: #d4d4d8; font-size: 12px;">
            Új ajánlatkérés
          </div>
          <h1 style="margin: 18px 0 0; font-size: 28px; color: #ffffff;">${serviceType}</h1>
          <p style="margin: 12px 0 0; color: #a1a1aa; line-height: 1.7;">
            Új érdeklődés került rögzítésre a rendszerben.
          </p>
        </div>
        <div style="padding: 28px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              <tr><td style="padding: 8px 0; color: #71717a;">Szolgáltatás</td><td style="padding: 8px 0; color: #fafafa;">${serviceType}</td></tr>
              <tr><td style="padding: 8px 0; color: #71717a;">Név</td><td style="padding: 8px 0; color: #fafafa;">${escapeHtml(payload.full_name)}</td></tr>
              <tr><td style="padding: 8px 0; color: #71717a;">Telefonszám</td><td style="padding: 8px 0; color: #fafafa;">${escapeHtml(payload.phone)}</td></tr>
              <tr><td style="padding: 8px 0; color: #71717a;">E-mail</td><td style="padding: 8px 0; color: #fafafa;">${escapeHtml(payload.email)}</td></tr>
              <tr><td style="padding: 8px 0; color: #71717a;">Irányítószám</td><td style="padding: 8px 0; color: #fafafa;">${postalCode}</td></tr>
              <tr><td style="padding: 8px 0; color: #71717a;">Település</td><td style="padding: 8px 0; color: #fafafa;">${escapeHtml(payload.city)}</td></tr>
              <tr><td style="padding: 8px 0; color: #71717a;">Legkönnyebben kereshető</td><td style="padding: 8px 0; color: #fafafa;">${preferredContactTime}</td></tr>
              <tr><td style="padding: 8px 0; color: #71717a;">Szolgáltatási terület</td><td style="padding: 8px 0; color: #fafafa;">${serviceAreaStatus}</td></tr>
              <tr><td style="padding: 8px 0; color: #71717a;">Szükséges lehet helyszíni felmérés</td><td style="padding: 8px 0; color: #fafafa;">${siteVisitNeed}</td></tr>
              <tr><td style="padding: 8px 0; color: #71717a;">Megfelelő egyeztetési sáv</td><td style="padding: 8px 0; color: #fafafa;">${appointmentWindow}</td></tr>
              ${
                schedulingNote
                  ? `<tr><td style="padding: 8px 0; color: #71717a;">Kapcsolódó egyeztetési megjegyzés</td><td style="padding: 8px 0; color: #fafafa;">${schedulingNote}</td></tr>`
                  : ""
              }
              <tr><td style="padding: 8px 0; color: #71717a;">Beküldés ideje</td><td style="padding: 8px 0; color: #fafafa;">${escapeHtml(formatDate(submittedAt))}</td></tr>
              <tr><td style="padding: 8px 0; color: #71717a;">Rövid műszaki összefoglaló</td><td style="padding: 8px 0; color: #fafafa;">${technicalSummary}</td></tr>
            </tbody>
          </table>

          <div style="margin-top: 24px; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 18px; background: rgba(0,0,0,0.18);">
            <p style="margin: 0; color: #a1a1aa; line-height: 1.7;">
              Az admin oldal megnyitásához a belső hozzáférési token továbbra is szükséges.
            </p>
            <p style="margin: 16px 0 0;">
              <a href="${escapeHtml(adminRequestsUrl)}" style="display: inline-block; padding: 12px 18px; border-radius: 12px; background: #ffffff; color: #09090b; text-decoration: none; font-weight: 600;">
                Admin oldal megnyitása
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `
}

export async function sendAdminServiceRequestNotification({
  payload,
  submittedAt,
  baseUrl,
}: {
  payload: ServiceRequestInsert
  submittedAt: string
  baseUrl: string
}) {
  const adminNotificationEmail = getRequiredServerEnv(
    "ADMIN_NOTIFICATION_EMAIL",
    "Admin értesítő e-mail"
  )

  const adminRequestsUrl = buildAdminRequestsUrl(baseUrl)
  const subject = `Új ajánlatkérés érkezett: ${formatServiceType(
    payload.service_type
  )}`

  await sendResendEmail({
    to: [adminNotificationEmail],
    subject,
    text: buildEmailText({
      payload,
      submittedAt,
      adminRequestsUrl,
    }),
    html: buildEmailHtml({
      payload,
      submittedAt,
      adminRequestsUrl,
    }),
  })
}
