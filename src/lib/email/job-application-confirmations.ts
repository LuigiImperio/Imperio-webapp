import "server-only"

import {
  escapeHtml,
  sendResendEmail,
} from "@/lib/email/service-request-email-shared"
import type { JobApplicationInsert } from "@/lib/job-applications/job-application-payloads"

function buildJobApplicationConfirmationText(application: JobApplicationInsert) {
  return [
    `Tisztelt ${application.full_name}!`,
    "",
    "Köszönjük, hogy elküldte jelentkezését.",
    "",
    "Előfordulhat, hogy jelenleg nincs nyitott pozíció, ugyanakkor a beérkezett jelentkezéseket megőrizzük és szakmai szempontból áttekintjük.",
    "Ha a későbbiekben olyan lehetőség nyílik, amely illeszkedik a tapasztalatához és motivációjához, jelentkezése újra előkerülhet.",
    "",
    `Érdeklődési terület: ${application.interest_area ?? "Nincs megadva"}`,
    `Önéletrajz fájl: ${application.cv_file_name}`,
    "",
    "Üdvözlettel,",
    "Az IMPERIO VGF csapata",
  ].join("\n")
}

function buildJobApplicationConfirmationHtml(application: JobApplicationInsert) {
  return `
    <div style="font-family: Arial, sans-serif; background: #09090b; color: #fafafa; padding: 24px;">
      <div style="max-width: 680px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; background: rgba(255,255,255,0.04); overflow: hidden;">
        <div style="padding: 28px; border-bottom: 1px solid rgba(255,255,255,0.08);">
          <div style="display: inline-block; padding: 6px 12px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.12); color: #d4d4d8; font-size: 12px;">
            Jelentkezés rögzítve
          </div>
          <h1 style="margin: 18px 0 0; font-size: 28px; color: #ffffff;">Köszönjük jelentkezését</h1>
          <p style="margin: 12px 0 0; color: #a1a1aa; line-height: 1.7;">
            A beküldött jelentkezést és az önéletrajzot rögzítettük.
          </p>
        </div>
        <div style="padding: 28px;">
          <p style="margin: 0; color: #fafafa; line-height: 1.8;">
            Tisztelt ${escapeHtml(application.full_name)}!
          </p>
          <p style="margin: 16px 0 0; color: #d4d4d8; line-height: 1.8;">
            Előfordulhat, hogy jelenleg nincs nyitott pozíció, ugyanakkor a beérkezett jelentkezéseket megőrizzük és szakmai szempontból áttekintjük.
          </p>
          <p style="margin: 16px 0 0; color: #d4d4d8; line-height: 1.8;">
            Ha a későbbiekben olyan lehetőség nyílik, amely illeszkedik a tapasztalatához és motivációjához, jelentkezése újra előkerülhet.
          </p>

          <div style="margin-top: 24px; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 18px; background: rgba(0,0,0,0.18);">
            <p style="margin: 0; color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.16em;">Rögzített adatok</p>
            <p style="margin: 12px 0 0; color: #fafafa; line-height: 1.8;">
              Érdeklődési terület: ${escapeHtml(application.interest_area ?? "Nincs megadva")}<br />
              Önéletrajz fájl: ${escapeHtml(application.cv_file_name)}
            </p>
          </div>

          <p style="margin: 24px 0 0; color: #d4d4d8; line-height: 1.8;">
            Üdvözlettel,<br />
            Az IMPERIO VGF csapata
          </p>
        </div>
      </div>
    </div>
  `
}

export async function sendJobApplicationConfirmation({
  application,
}: {
  application: JobApplicationInsert
}) {
  const recipientEmail = application.email.trim()

  if (!recipientEmail) {
    throw new Error("A jelentkező e-mail címe hiányzik.")
  }

  await sendResendEmail({
    to: [recipientEmail],
    subject: "Visszaigazolás: jelentkezése rögzítve",
    text: buildJobApplicationConfirmationText(application),
    html: buildJobApplicationConfirmationHtml(application),
  })
}
