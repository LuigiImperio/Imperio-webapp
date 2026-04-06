import "server-only"

import { getRequiredServerEnv } from "@/lib/config/server-env"
import {
  escapeHtml,
  formatDate,
  sendResendEmail,
} from "@/lib/email/service-request-email-shared"
import type { JobApplicationInsert } from "@/lib/job-applications/job-application-payloads"

function buildAdminApplicationsUrl(baseUrl: string) {
  return `${baseUrl.replace(/\/$/, "")}/admin/jelentkezesek`
}

function buildAdminJobApplicationText({
  application,
  submittedAt,
  adminApplicationsUrl,
}: {
  application: JobApplicationInsert
  submittedAt: string
  adminApplicationsUrl: string
}) {
  return [
    "Új munkajelentkezés érkezett.",
    "",
    `Név: ${application.full_name}`,
    `E-mail: ${application.email}`,
    `Telefonszám: ${application.phone}`,
    `Érdeklődési terület: ${application.interest_area ?? "Nincs megadva"}`,
    `Beküldés ideje: ${formatDate(submittedAt)}`,
    `Önéletrajz fájl: ${application.cv_file_name}`,
    "",
    "Motiváció:",
    application.motivation_text,
    ...(application.note ? ["", "Megjegyzés:", application.note] : []),
    "",
    `Admin oldal: ${adminApplicationsUrl}`,
    "A megnyitáshoz a belső hozzáférési token továbbra is szükséges.",
  ].join("\n")
}

function buildAdminJobApplicationHtml({
  application,
  submittedAt,
  adminApplicationsUrl,
}: {
  application: JobApplicationInsert
  submittedAt: string
  adminApplicationsUrl: string
}) {
  return `
    <div style="font-family: Arial, sans-serif; background: #09090b; color: #fafafa; padding: 24px;">
      <div style="max-width: 720px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; background: rgba(255,255,255,0.04); overflow: hidden;">
        <div style="padding: 28px; border-bottom: 1px solid rgba(255,255,255,0.08);">
          <div style="display: inline-block; padding: 6px 12px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.12); color: #d4d4d8; font-size: 12px;">
            Új jelentkezés
          </div>
          <h1 style="margin: 18px 0 0; font-size: 28px; color: #ffffff;">Dolgozz velünk</h1>
          <p style="margin: 12px 0 0; color: #a1a1aa; line-height: 1.7;">
            Új nyilvános munkajelentkezés érkezett a weboldalon keresztül.
          </p>
        </div>
        <div style="padding: 28px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              <tr><td style="padding: 8px 0; color: #71717a;">Név</td><td style="padding: 8px 0; color: #fafafa;">${escapeHtml(application.full_name)}</td></tr>
              <tr><td style="padding: 8px 0; color: #71717a;">E-mail</td><td style="padding: 8px 0; color: #fafafa;">${escapeHtml(application.email)}</td></tr>
              <tr><td style="padding: 8px 0; color: #71717a;">Telefonszám</td><td style="padding: 8px 0; color: #fafafa;">${escapeHtml(application.phone)}</td></tr>
              <tr><td style="padding: 8px 0; color: #71717a;">Érdeklődési terület</td><td style="padding: 8px 0; color: #fafafa;">${escapeHtml(application.interest_area ?? "Nincs megadva")}</td></tr>
              <tr><td style="padding: 8px 0; color: #71717a;">Beküldés ideje</td><td style="padding: 8px 0; color: #fafafa;">${escapeHtml(formatDate(submittedAt))}</td></tr>
              <tr><td style="padding: 8px 0; color: #71717a;">Önéletrajz fájl</td><td style="padding: 8px 0; color: #fafafa;">${escapeHtml(application.cv_file_name)}</td></tr>
            </tbody>
          </table>

          <div style="margin-top: 24px; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 18px; background: rgba(0,0,0,0.18);">
            <p style="margin: 0; color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.16em;">Motiváció</p>
            <p style="margin: 12px 0 0; color: #fafafa; line-height: 1.8;">${escapeHtml(application.motivation_text)}</p>
          </div>

          ${
            application.note
              ? `<div style="margin-top: 16px; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 18px; background: rgba(0,0,0,0.18);">
                  <p style="margin: 0; color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.16em;">Megjegyzés</p>
                  <p style="margin: 12px 0 0; color: #fafafa; line-height: 1.8;">${escapeHtml(application.note)}</p>
                </div>`
              : ""
          }

          <p style="margin: 24px 0 0;">
            <a href="${escapeHtml(adminApplicationsUrl)}" style="display: inline-block; padding: 12px 18px; border-radius: 12px; background: #ffffff; color: #09090b; text-decoration: none; font-weight: 600;">
              Admin oldal megnyitása
            </a>
          </p>
        </div>
      </div>
    </div>
  `
}

export async function sendAdminJobApplicationNotification({
  application,
  submittedAt,
  baseUrl,
}: {
  application: JobApplicationInsert
  submittedAt: string
  baseUrl: string
}) {
  const adminNotificationEmail = getRequiredServerEnv(
    "ADMIN_NOTIFICATION_EMAIL",
    "Admin jelentkezési értesítő e-mail"
  )

  const adminApplicationsUrl = buildAdminApplicationsUrl(baseUrl)

  await sendResendEmail({
    to: [adminNotificationEmail],
    subject: `Új munkajelentkezés érkezett: ${application.full_name}`,
    text: buildAdminJobApplicationText({
      application,
      submittedAt,
      adminApplicationsUrl,
    }),
    html: buildAdminJobApplicationHtml({
      application,
      submittedAt,
      adminApplicationsUrl,
    }),
  })
}
