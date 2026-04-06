import "server-only"

import type { ServiceRequestInsert } from "@/lib/service-requests/service-request-payloads"

import {
  buildTechnicalSummary,
  escapeHtml,
  formatServiceType,
  sendResendEmail,
} from "@/lib/email/service-request-email-shared"

function buildCustomerEmailText(payload: ServiceRequestInsert) {
  const serviceType = formatServiceType(payload.service_type)
  const summary = buildTechnicalSummary(payload)

  return [
    `Tisztelt ${payload.full_name}!`,
    "",
    "Köszönjük megkeresését, a beküldött kérését sikeresen rögzítettük rendszerünkben.",
    "",
    `Szolgáltatás: ${serviceType}`,
    `Név: ${payload.full_name}`,
    `Település: ${payload.city}`,
    `Rövid összefoglaló: ${summary}`,
    "",
    "A megadott adatok segítenek abban, hogy a következő kapcsolatfelvétel szakmailag jobban előkészíthető legyen.",
    "",
    "Üdvözlettel,",
    "Az épületgépészeti csapat",
  ].join("\n")
}

function buildCustomerEmailHtml(payload: ServiceRequestInsert) {
  const serviceType = escapeHtml(formatServiceType(payload.service_type))
  const fullName = escapeHtml(payload.full_name)
  const city = escapeHtml(payload.city)
  const summary = escapeHtml(buildTechnicalSummary(payload))

  return `
    <div style="font-family: Arial, sans-serif; background: #09090b; color: #fafafa; padding: 24px;">
      <div style="max-width: 680px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; background: rgba(255,255,255,0.04); overflow: hidden;">
        <div style="padding: 28px; border-bottom: 1px solid rgba(255,255,255,0.08);">
          <div style="display: inline-block; padding: 6px 12px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.12); color: #d4d4d8; font-size: 12px;">
            Visszaigazolás
          </div>
          <h1 style="margin: 18px 0 0; font-size: 28px; color: #ffffff;">Köszönjük megkeresését</h1>
          <p style="margin: 12px 0 0; color: #a1a1aa; line-height: 1.7;">
            A beküldött kérését sikeresen rögzítettük rendszerünkben.
          </p>
        </div>
        <div style="padding: 28px;">
          <p style="margin: 0; color: #fafafa; line-height: 1.8;">
            Tisztelt ${fullName}!
          </p>
          <p style="margin: 16px 0 0; color: #d4d4d8; line-height: 1.8;">
            Köszönjük megkeresését. Az alábbi szolgáltatási kérés sikeresen beérkezett hozzánk.
          </p>

          <table style="width: 100%; border-collapse: collapse; margin-top: 24px;">
            <tbody>
              <tr><td style="padding: 8px 0; color: #71717a;">Szolgáltatás</td><td style="padding: 8px 0; color: #fafafa;">${serviceType}</td></tr>
              <tr><td style="padding: 8px 0; color: #71717a;">Név</td><td style="padding: 8px 0; color: #fafafa;">${fullName}</td></tr>
              <tr><td style="padding: 8px 0; color: #71717a;">Település</td><td style="padding: 8px 0; color: #fafafa;">${city}</td></tr>
              <tr><td style="padding: 8px 0; color: #71717a;">Rövid összefoglaló</td><td style="padding: 8px 0; color: #fafafa;">${summary}</td></tr>
            </tbody>
          </table>

          <div style="margin-top: 24px; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 18px; background: rgba(0,0,0,0.18);">
            <p style="margin: 0; color: #d4d4d8; line-height: 1.8;">
              A megadott részletek segítenek abban, hogy a következő kapcsolatfelvétel szakmailag jobban előkészíthető legyen.
            </p>
          </div>

          <p style="margin: 24px 0 0; color: #d4d4d8; line-height: 1.8;">
            Üdvözlettel,<br />
            Az épületgépészeti csapat
          </p>
        </div>
      </div>
    </div>
  `
}

export async function sendCustomerServiceRequestConfirmation({
  payload,
}: {
  payload: ServiceRequestInsert
}) {
  const recipientEmail = payload.email.trim()

  if (!recipientEmail) {
    throw new Error("Az ügyfél visszaigazoló e-mail cím hiányzik.")
  }

  const subject = `Visszaigazolás: ${formatServiceType(
    payload.service_type
  )} kérés rögzítve`

  await sendResendEmail({
    to: [recipientEmail],
    subject,
    text: buildCustomerEmailText(payload),
    html: buildCustomerEmailHtml(payload),
  })
}
