import { businessEmail } from "@/lib/business"
import { getServiceAreaAssessment, getServiceAreaUserMessage } from "@/lib/service-area"
import {
  branchTitles,
  topicMeta,
} from "@/components/guided-request/guided-request-data"
import type {
  GuidedRequestState,
  ScreenKey,
  SummaryLine,
} from "@/components/guided-request/guided-request-types"

export function getCurrentScreenKey(state: GuidedRequestState): ScreenKey {
  if (!state.formOpen) return "branch"
  if (state.submitted) return "success"
  if (state.branch === null) return "branch"
  return state.steps[state.step] ?? "summary"
}

export function getBranchLabelText(state: GuidedRequestState): string {
  if (state.branch === "surgos") return "Sürgős hiba"
  if (state.branch === "projekt") {
    return `Nagyobb projekt – ${state.form.scope || "gépészeti kivitelezés"}`
  }
  if (state.topic && topicMeta[state.topic]) return topicMeta[state.topic].label
  return "Hétköznapi probléma"
}

export function getHeaderLabel(state: GuidedRequestState): string {
  if (state.submitted) return "Megkeresés elküldve"
  if (state.branch !== null) return getBranchLabelText(state)
  return "Vezetett megkeresés"
}

export function getAreaNote(city: string): string {
  const trimmed = city.trim()
  if (!trimmed) return ""
  return getServiceAreaUserMessage(getServiceAreaAssessment(trimmed))
}

export function getSummaryLines(state: GuidedRequestState): SummaryLine[] {
  const { form } = state
  const lines: SummaryLine[] = []

  lines.push({
    label: "Megkeresés típusa",
    value: state.branch ? branchTitles[state.branch] : "Megkeresés",
  })
  if (state.topic && topicMeta[state.topic]) {
    lines.push({ label: "Terület", value: topicMeta[state.topic].label })
  }
  if (state.branch === "projekt" && form.scope) {
    lines.push({ label: "Fókusz", value: form.scope })
  }
  if (state.symptoms.length) {
    lines.push({ label: "Jellemzők", value: state.symptoms.join(", ") })
  }
  if (form.freeText.trim()) {
    lines.push({ label: "Leírás", value: form.freeText.trim() })
  }
  if (form.propertyType) {
    lines.push({ label: "Ingatlan", value: form.propertyType })
  }
  const location = [form.postalCode, form.city].filter(Boolean).join(" ")
  if (location.trim()) {
    lines.push({ label: "Helyszín", value: location.trim() })
  }
  if (form.name.trim()) {
    lines.push({ label: "Név", value: form.name.trim() })
  }
  if (form.phone.trim()) {
    lines.push({ label: "Telefon", value: form.phone.trim() })
  }
  if (form.email.trim()) {
    lines.push({ label: "E-mail", value: form.email.trim() })
  }
  if (form.contactTime) {
    lines.push({ label: "Mikor hívható", value: form.contactTime })
  }
  if (form.note.trim()) {
    lines.push({ label: "Megjegyzés", value: form.note.trim() })
  }
  if (state.photos.length) {
    lines.push({
      label: "Fotók",
      value: `${state.photos.length} db (${state.photos.map((p) => p.name).join(", ")})`,
    })
  }

  return lines
}

export function getMailHref(state: GuidedRequestState): string {
  const lines = getSummaryLines(state)
  const subject = `Megkeresés – Imperio Gépészet (${
    state.branch ? branchTitles[state.branch] : "megkeresés"
  })`
  const body =
    "Megkeresés az Imperio Gépészet weboldaláról\n\n" +
    lines.map((l) => `${l.label}: ${l.value}`).join("\n") +
    "\n\n(Ha fotót küld, kérjük csatolja ehhez az e-mailhez.)"

  return `mailto:${businessEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
