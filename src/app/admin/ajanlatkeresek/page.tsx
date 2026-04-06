import Image from "next/image"
import Link from "next/link"

import {
  updateServiceRequestAdminNoteAction,
  updateServiceRequestStatusAction,
} from "@/app/admin/ajanlatkeresek/actions"
import { AdminFormSubmitButton } from "@/components/admin/admin-form-submit-button"
import { resolveAdminAccess } from "@/lib/admin/admin-access"
import { SiteNavbar } from "@/components/layout/site-navbar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getServiceAreaStatusLabel } from "@/lib/service-area"
import {
  getPreferredContactTime,
  getStoredPostalCode,
  getStoredSchedulingInfo,
  getStoredServiceAreaInfo,
} from "@/lib/service-requests/request-metadata"
import { getServiceRequestTypeLabel } from "@/lib/service-requests/service-request-types"
import {
  getServiceRequests,
  getServiceRequestStatusLabel,
  isServiceRequestStatus,
  type ServiceRequestRecord,
  type ServiceRequestStatus,
} from "@/lib/supabase/service-requests-admin"
import { logServerError } from "@/lib/logging"

const statusFilterOptions = [
  { value: "osszes", label: "Összes" },
  { value: "uj", label: "Új" },
  { value: "folyamatban", label: "Folyamatban" },
  { value: "kapcsolat_felveve", label: "Kapcsolat felvéve" },
  { value: "lezarva", label: "Lezárva" },
] as const

function formatDate(value: string) {
  return new Intl.DateTimeFormat("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}

function formatServiceType(serviceType: string) {
  return getServiceRequestTypeLabel(serviceType)
}

function getStatusBadgeClassName(status: ServiceRequestStatus) {
  switch (status) {
    case "uj":
      return "border-sky-400/20 bg-sky-400/10 text-sky-100"
    case "folyamatban":
      return "border-amber-400/20 bg-amber-400/10 text-amber-100"
    case "kapcsolat_felveve":
      return "border-violet-400/20 bg-violet-400/10 text-violet-100"
    case "lezarva":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
  }
}

function buildTechnicalSummary(request: ServiceRequestRecord) {
  if (request.service_type === "hibabejelentes") {
    return [
      request.current_boiler_type,
      request.boiler_status,
      request.city,
    ].join(" • ")
  }

  if (request.service_type === "csotores_szivargas") {
    return [
      request.current_boiler_type,
      request.boiler_status,
      request.replacement_reason,
    ].join(" • ")
  }

  if (request.service_type === "vizszereles") {
    return [
      request.current_boiler_type,
      request.boiler_status,
      request.city,
    ].join(" • ")
  }

  if (request.service_type === "futeskorszerusites") {
    return [
      request.property_type,
      `${request.property_area} m²`,
      request.current_boiler_type,
      request.replacement_reason,
    ].join(" • ")
  }

  if (request.service_type === "hoszivattyu_telepites") {
    return [
      request.property_type,
      `${request.property_area} m²`,
      request.current_boiler_type,
      request.boiler_status,
    ].join(" • ")
  }

  if (request.service_type === "komplett_epuletgepeszeti_kivitelezes") {
    return [
      request.property_type,
      `${request.property_area} m²`,
      request.current_boiler_type,
      request.replacement_reason,
    ].join(" • ")
  }

  return [
    request.property_type,
    `${request.property_area} m²`,
    request.boiler_status,
    request.replacement_reason,
  ].join(" • ")
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function getHeatingRequestDescription(request: ServiceRequestRecord) {
  if (!isRecord(request.form_data_json)) {
    return null
  }

  const modernization = request.form_data_json.modernization

  if (!isRecord(modernization)) {
    return null
  }

  const requestDescription = modernization.requestDescription

  if (typeof requestDescription !== "string") {
    return null
  }

  const trimmedRequestDescription = requestDescription.trim()

  return trimmedRequestDescription || null
}

function getFaultRequestDescription(request: ServiceRequestRecord) {
  if (!isRecord(request.form_data_json)) {
    return null
  }

  const fault = request.form_data_json.fault

  if (!isRecord(fault)) {
    return null
  }

  const description = fault.description

  if (typeof description !== "string") {
    return null
  }

  const trimmedDescription = description.trim()

  return trimmedDescription || null
}

function getLeakRequestDescription(request: ServiceRequestRecord) {
  if (!isRecord(request.form_data_json)) {
    return null
  }

  const issue = request.form_data_json.issue

  if (!isRecord(issue)) {
    return null
  }

  const description = issue.description

  if (typeof description !== "string") {
    return null
  }

  const trimmedDescription = description.trim()

  return trimmedDescription || null
}

function getPlumbingRequestDescription(request: ServiceRequestRecord) {
  if (!isRecord(request.form_data_json)) {
    return null
  }

  const plumbing = request.form_data_json.plumbing

  if (!isRecord(plumbing)) {
    return null
  }

  const description = plumbing.description

  if (typeof description !== "string") {
    return null
  }

  const trimmedDescription = description.trim()

  return trimmedDescription || null
}

function getHeatPumpRequestDescription(request: ServiceRequestRecord) {
  if (!isRecord(request.form_data_json)) {
    return null
  }

  const system = request.form_data_json.system

  if (!isRecord(system)) {
    return null
  }

  const requestDescription = system.requestDescription

  if (typeof requestDescription !== "string") {
    return null
  }

  const trimmedRequestDescription = requestDescription.trim()

  return trimmedRequestDescription || null
}

function getBuildingServicesRequestDescription(request: ServiceRequestRecord) {
  if (!isRecord(request.form_data_json)) {
    return null
  }

  const scope = request.form_data_json.scope

  if (!isRecord(scope)) {
    return null
  }

  const requestDescription = scope.requestDescription

  if (typeof requestDescription !== "string") {
    return null
  }

  const trimmedRequestDescription = requestDescription.trim()

  return trimmedRequestDescription || null
}

function getTechnicalDetails(request: ServiceRequestRecord) {
  if (request.service_type === "hibabejelentes") {
    return [
      { label: "Hiba típusa", value: request.current_boiler_type },
      { label: "Sürgősség", value: request.boiler_status },
    ]
  }

  if (request.service_type === "csotores_szivargas") {
    if (!isRecord(request.form_data_json)) {
      return [
        { label: "Érintett terület", value: request.current_boiler_type },
        { label: "Szivárgás állapota", value: request.boiler_status },
        {
          label: "Beázás vagy kárterület",
          value: request.replacement_reason,
          fullWidth: true,
        },
      ]
    }

    const issue = request.form_data_json.issue

    if (!isRecord(issue)) {
      return [
        { label: "Érintett terület", value: request.current_boiler_type },
        { label: "Szivárgás állapota", value: request.boiler_status },
        {
          label: "Beázás vagy kárterület",
          value: request.replacement_reason,
          fullWidth: true,
        },
      ]
    }

    return [
      {
        label: "Aktív-e még a szivárgás?",
        value:
          typeof issue.leakActive === "string"
            ? issue.leakActive
            : request.boiler_status,
      },
      {
        label: "Elzárható volt-e a víz?",
        value:
          typeof issue.waterShutOff === "string"
            ? issue.waterShutOff
            : "Nincs megadva",
      },
      {
        label: "Érintett terület",
        value:
          typeof issue.affectedArea === "string"
            ? issue.affectedArea
            : request.current_boiler_type,
      },
      {
        label: "A hiba jellege",
        value:
          typeof issue.leakVisibility === "string"
            ? issue.leakVisibility
            : "Nincs megadva",
      },
      {
        label: "Beázás vagy kárterület",
        value:
          typeof issue.damageLevel === "string"
            ? issue.damageLevel
            : request.replacement_reason,
        fullWidth: true,
      },
    ]
  }

  if (request.service_type === "vizszereles") {
    return [
      { label: "Munka típusa", value: request.current_boiler_type },
      { label: "Sürgősség", value: request.boiler_status },
    ]
  }

  if (request.service_type === "futeskorszerusites") {
    return [
      { label: "Ingatlan típusa", value: request.property_type },
      { label: "Alapterület", value: `${request.property_area} m²` },
      {
        label: "Jelenlegi fűtési rendszer",
        value: request.current_boiler_type,
      },
      {
        label: "Van működő hőtermelő?",
        value: request.boiler_status,
      },
      {
        label: "Korszerűsítés fő célja",
        value: request.replacement_reason,
        fullWidth: true,
      },
    ]
  }

  if (request.service_type === "hoszivattyu_telepites") {
    if (!isRecord(request.form_data_json)) {
      return [
        { label: "Ingatlan típusa", value: request.property_type },
        { label: "Alapterület", value: `${request.property_area} m²` },
        {
          label: "Jelenlegi hőleadó oldal",
          value: request.current_boiler_type,
        },
        {
          label: "Projekt indulási helyzete",
          value: request.boiler_status,
        },
        {
          label: "Projekt szakasza",
          value: request.replacement_reason,
          fullWidth: true,
        },
      ]
    }

    const property = request.form_data_json.property
    const system = request.form_data_json.system

    if (!isRecord(property) || !isRecord(system)) {
      return [
        { label: "Ingatlan típusa", value: request.property_type },
        { label: "Alapterület", value: `${request.property_area} m²` },
        {
          label: "Jelenlegi hőleadó oldal",
          value: request.current_boiler_type,
        },
        {
          label: "Projekt indulási helyzete",
          value: request.boiler_status,
        },
        {
          label: "Projekt szakasza",
          value: request.replacement_reason,
          fullWidth: true,
        },
      ]
    }

    return [
      {
        label: "Projekt indulási helyzete",
        value:
          typeof property.projectMode === "string"
            ? property.projectMode
            : request.boiler_status,
      },
      { label: "Ingatlan típusa", value: request.property_type },
      { label: "Alapterület", value: `${request.property_area} m²` },
      {
        label: "Jelenlegi hőleadó oldal",
        value:
          typeof system.heatEmitterType === "string"
            ? system.heatEmitterType
            : request.current_boiler_type,
      },
      {
        label: "Jelenlegi hőtermelő",
        value:
          typeof system.currentHeatSource === "string"
            ? system.currentHeatSource
            : "Nincs megadva",
      },
      {
        label: "HMV-igény",
        value:
          typeof system.hotWaterNeed === "string"
            ? system.hotWaterNeed
            : "Nincs megadva",
      },
      {
        label: "Elektromos háttér",
        value:
          typeof system.electricalSetup === "string"
            ? system.electricalSetup
            : "Nincs megadva",
      },
      {
        label: "Projekt szakasza",
        value:
          typeof system.projectStage === "string"
            ? system.projectStage
            : request.replacement_reason,
      },
    ]
  }

  if (request.service_type === "komplett_epuletgepeszeti_kivitelezes") {
    return [
      {
        label: "Projekt jellege",
        value: request.current_boiler_type,
      },
      { label: "Ingatlan típusa", value: request.property_type },
      { label: "Alapterület", value: `${request.property_area} m²` },
      {
        label: "Projekt szakasza",
        value: request.boiler_status,
      },
      {
        label: "Fő érintett terület",
        value: request.replacement_reason,
        fullWidth: true,
      },
    ]
  }

  return [
    { label: "Ingatlan típusa", value: request.property_type },
    { label: "Alapterület", value: `${request.property_area} m²` },
    {
      label: "Jelenlegi kazán típusa",
      value: request.current_boiler_type,
    },
    { label: "Kazán állapota", value: request.boiler_status },
    {
      label: "Csere oka",
      value: request.replacement_reason,
      fullWidth: true,
    },
  ]
}

function buildFilterHref(token: string | undefined, status: string) {
  const searchParams = new URLSearchParams()

  if (token) {
    searchParams.set("token", token)
  }

  if (status === "osszes") {
    return searchParams.size
      ? `/admin/ajanlatkeresek?${searchParams.toString()}`
      : "/admin/ajanlatkeresek"
  }

  searchParams.set("status", status)
  return `/admin/ajanlatkeresek?${searchParams.toString()}`
}

function AccessState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <Card className="border-white/10 bg-white/[0.04] text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="max-w-2xl text-sm leading-6 text-zinc-400">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

function getAdminResultMessage(result: string | undefined) {
  switch (result) {
    case "status_saved":
      return {
        tone: "success" as const,
        text: "A státusz mentése sikeresen megtörtént.",
      }
    case "note_saved":
      return {
        tone: "success" as const,
        text: "A belső admin megjegyzés mentése sikeresen megtörtént.",
      }
    case "status_error":
      return {
        tone: "error" as const,
        text: "A státusz mentése most nem sikerült. Kérjük, próbálja újra.",
      }
    case "note_error":
      return {
        tone: "error" as const,
        text: "A belső admin megjegyzés mentése most nem sikerült. Kérjük, próbálja újra.",
      }
    case "status_invalid":
    case "note_invalid":
      return {
        tone: "error" as const,
        text: "A mentéshez szükséges belső adatok hiányosak voltak, ezért a művelet nem futott le.",
      }
    case "unauthorized":
      return {
        tone: "error" as const,
        text: "A mentési művelethez érvényes admin hozzáférés szükséges.",
      }
    default:
      return null
  }
}

export default async function AdminServiceRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{
    token?: string | string[] | undefined
    status?: string | string[] | undefined
    result?: string | string[] | undefined
  }>
}) {
  const resolvedSearchParams = await searchParams
  const accessState = resolveAdminAccess(resolvedSearchParams.token)
  const { providedToken, hasConfiguredProtection, hasAccess } = accessState
  const requestedStatus = Array.isArray(resolvedSearchParams.status)
    ? resolvedSearchParams.status[0]
    : resolvedSearchParams.status
  const actionResult = Array.isArray(resolvedSearchParams.result)
    ? resolvedSearchParams.result[0]
    : resolvedSearchParams.result
  const activeStatusFilter = isServiceRequestStatus(requestedStatus)
    ? requestedStatus
    : null
  const resultMessage = getAdminResultMessage(actionResult)

  let requests: ServiceRequestRecord[] = []
  let loadError = false

  if (hasAccess) {
    try {
      requests = await getServiceRequests(activeStatusFilter ?? undefined)
    } catch (error) {
      logServerError("Admin ajánlatkérések betöltési hiba", error, {
        statusFilter: activeStatusFilter ?? "osszes",
      })
      loadError = true
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <SiteNavbar />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_42%)]" />
        <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-white/[0.04] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 md:px-10">
          <div className="max-w-4xl">
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-zinc-300 backdrop-blur-sm">
              Belső nézet
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
              Beérkezett ajánlatkérések
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-7 text-zinc-300 md:text-lg">
              Ez a belső nézet a jelenleg rögzített ajánlatkéréseket mutatja,
              hogy gyorsan áttekinthető legyen a beérkező érdeklődések állapota
              és műszaki háttere.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        {!hasConfiguredProtection ? (
          <AccessState
            title="Az admin hozzáférés még nincs konfigurálva"
            description="A belső nézet használatához állítsa be az `ADMIN_ACCESS_TOKEN` környezeti változót, majd a megfelelő tokennel nyissa meg az oldalt."
          />
        ) : !hasAccess ? (
          <AccessState
            title={
              accessState.reason === "missing_token"
                ? "A belső nézet tokennel védett"
                : "A megadott admin token nem érvényes"
            }
            description={
              accessState.reason === "missing_token"
                ? "A beérkezett ajánlatkérések megtekintéséhez érvényes hozzáférési token szükséges. Ez a nézet belső használatra készült, publikus listázás nélkül."
                : "A megadott token nem egyezik a beállított `ADMIN_ACCESS_TOKEN` értékkel, ezért a lista nem nyitható meg."
            }
          />
        ) : loadError ? (
          <AccessState
            title="A beérkezett ajánlatkérések most nem tölthetők be"
            description="Az adatbázis oldali olvasás során hiba történt. Ellenőrizze a szerveroldali konfigurációt és a Supabase kapcsolatot."
          />
        ) : requests.length === 0 ? (
          <div className="space-y-6">
            {resultMessage ? (
              <div
                className={`rounded-2xl border px-4 py-4 text-sm leading-6 ${
                  resultMessage.tone === "success"
                    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
                    : "border-rose-400/20 bg-rose-400/10 text-rose-100"
                }`}
              >
                {resultMessage.text}
              </div>
            ) : null}

            <Card className="border-white/10 bg-white/[0.04] text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-xl">Szűrés állapot szerint</CardTitle>
                <CardDescription className="max-w-3xl text-sm leading-6 text-zinc-400">
                  A listát gyorsan leszűkítheti a jelenlegi feldolgozási állapot
                  alapján.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                {statusFilterOptions.map((option) => {
                  const isActive =
                    option.value === "osszes"
                      ? activeStatusFilter === null
                      : activeStatusFilter === option.value

                  return (
                    <Link
                      key={option.value}
                      href={buildFilterHref(providedToken, option.value)}
                      className={
                        isActive
                          ? "rounded-full border border-white/30 bg-white px-4 py-2 text-sm text-zinc-950"
                          : "rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                      }
                    >
                      {option.label}
                    </Link>
                  )
                })}
              </CardContent>
            </Card>

            <AccessState
              title="Még nincs a szűrésnek megfelelő ajánlatkérés"
              description="Amint érkezik a kiválasztott állapothoz tartozó érdeklődés, itt jelennek meg a rögzített adatok és a fontos műszaki részletek."
            />
          </div>
        ) : (
          <div className="space-y-6">
            {resultMessage ? (
              <div
                className={`rounded-2xl border px-4 py-4 text-sm leading-6 ${
                  resultMessage.tone === "success"
                    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
                    : "border-rose-400/20 bg-rose-400/10 text-rose-100"
                }`}
              >
                {resultMessage.text}
              </div>
            ) : null}

            <Card className="border-white/10 bg-white/[0.04] text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-xl">Szűrés állapot szerint</CardTitle>
                <CardDescription className="max-w-3xl text-sm leading-6 text-zinc-400">
                  A listát gyorsan leszűkítheti a jelenlegi feldolgozási állapot
                  alapján.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                {statusFilterOptions.map((option) => {
                  const isActive =
                    option.value === "osszes"
                      ? activeStatusFilter === null
                      : activeStatusFilter === option.value

                  return (
                    <Link
                      key={option.value}
                      href={buildFilterHref(providedToken, option.value)}
                      className={
                        isActive
                          ? "rounded-full border border-white/30 bg-white px-4 py-2 text-sm text-zinc-950"
                          : "rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                      }
                    >
                      {option.label}
                    </Link>
                  )
                })}
              </CardContent>
            </Card>

            {requests.map((request) => (
              <Card
                key={request.id}
                className="border-white/10 bg-white/[0.04] text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl"
              >
                <CardHeader className="border-b border-white/10">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs tracking-wide text-zinc-300">
                        {formatServiceType(request.service_type)}
                      </div>
                      <CardTitle className="mt-4 text-2xl">
                        {request.full_name}
                      </CardTitle>
                      <CardDescription className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
                        {buildTechnicalSummary(request)}
                      </CardDescription>
                    </div>

                    <div className="flex flex-col items-start gap-3 lg:items-end">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs tracking-wide ${getStatusBadgeClassName(
                          request.status
                        )}`}
                      >
                        {getServiceRequestStatusLabel(request.status)}
                      </span>
                      <span className="text-sm text-zinc-400">
                        Beküldve: {formatDate(request.created_at)}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-8 pt-6">
                  {(() => {
                    const technicalDetails = getTechnicalDetails(request)
                    const heatingRequestDescription =
                      request.service_type === "futeskorszerusites"
                        ? getHeatingRequestDescription(request)
                        : null
                    const faultRequestDescription =
                      request.service_type === "hibabejelentes"
                        ? getFaultRequestDescription(request)
                        : null
                    const leakRequestDescription =
                      request.service_type === "csotores_szivargas"
                        ? getLeakRequestDescription(request)
                        : null
                    const plumbingRequestDescription =
                      request.service_type === "vizszereles"
                        ? getPlumbingRequestDescription(request)
                        : null
                    const heatPumpRequestDescription =
                      request.service_type === "hoszivattyu_telepites"
                        ? getHeatPumpRequestDescription(request)
                        : null
                    const buildingServicesRequestDescription =
                      request.service_type ===
                      "komplett_epuletgepeszeti_kivitelezes"
                        ? getBuildingServicesRequestDescription(request)
                        : null
                    const preferredContactTime = getPreferredContactTime(
                      request.form_data_json
                    )
                    const postalCode = getStoredPostalCode(request.form_data_json)
                    const serviceAreaInfo = getStoredServiceAreaInfo(
                      request.form_data_json
                    )
                    const schedulingInfo = getStoredSchedulingInfo(
                      request.form_data_json
                    )

                    return (
                      <>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                        Szolgáltatás
                      </p>
                      <p className="mt-3 text-sm leading-6 text-zinc-200">
                        {formatServiceType(request.service_type)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                        Telefonszám
                      </p>
                      <p className="mt-3 text-sm leading-6 text-zinc-200">
                        {request.phone}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                        E-mail
                      </p>
                      <p className="mt-3 text-sm leading-6 text-zinc-200">
                        {request.email}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                        Irányítószám
                      </p>
                      <p className="mt-3 text-sm leading-6 text-zinc-200">
                        {postalCode ?? "Nincs megadva"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                        Település
                      </p>
                      <p className="mt-3 text-sm leading-6 text-zinc-200">
                        {request.city}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                        Státusz
                      </p>
                      <p className="mt-3 text-sm leading-6 text-zinc-200">
                        {getServiceRequestStatusLabel(request.status)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                        Kereshetőség
                      </p>
                      <p className="mt-3 text-sm leading-6 text-zinc-200">
                        {preferredContactTime ?? "Nincs megadva"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                        Helyszíni felmérés
                      </p>
                      <p className="mt-3 text-sm leading-6 text-zinc-200">
                        {schedulingInfo?.siteVisitNeed ?? "Nincs megadva"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                        Egyeztetési sáv
                      </p>
                      <p className="mt-3 text-sm leading-6 text-zinc-200">
                        {schedulingInfo?.appointmentWindow ?? "Nincs megadva"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 md:col-span-2 xl:col-span-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                        Szolgáltatási terület
                      </p>
                      <p
                        className={`mt-3 text-sm leading-6 ${
                          serviceAreaInfo?.isWithinSupportedArea
                            ? "text-emerald-100"
                            : serviceAreaInfo
                              ? "text-amber-100"
                              : "text-zinc-200"
                        }`}
                      >
                        {getServiceAreaStatusLabel(serviceAreaInfo)}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                        <h2 className="text-base font-medium text-white">
                          Fontos műszaki adatok
                        </h2>
                        <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                          Részletek
                        </span>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        {technicalDetails.map((detail) => (
                          <div
                            key={detail.label}
                            className={`rounded-2xl border border-white/10 bg-black/20 p-4 ${
                              detail.fullWidth ? "md:col-span-2" : ""
                            }`}
                          >
                            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                              {detail.label}
                            </p>
                            <p className="mt-3 text-sm leading-6 text-zinc-200">
                              {detail.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                        <h2 className="text-base font-medium text-white">
                          Megjegyzés és összefoglaló
                        </h2>
                        <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                          Belső nézet
                        </span>
                      </div>

                      <div className="mt-4 space-y-4">
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                            Rövid összefoglaló
                          </p>
                          <p className="mt-3 text-sm leading-6 text-zinc-200">
                            {buildTechnicalSummary(request)}
                          </p>
                        </div>

                        {request.service_type === "futeskorszerusites" ? (
                          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                              Rövid leírás az igényről
                            </p>
                            <p className="mt-3 text-sm leading-6 text-zinc-200">
                              {heatingRequestDescription ??
                                "Külön igényleírás nem érkezett."}
                            </p>
                          </div>
                        ) : null}

                        {request.service_type === "hibabejelentes" ? (
                          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                              Rövid leírás
                            </p>
                            <p className="mt-3 text-sm leading-6 text-zinc-200">
                              {faultRequestDescription ??
                                "Külön hibaleírás nem érkezett."}
                            </p>
                          </div>
                        ) : null}

                        {request.service_type === "csotores_szivargas" ? (
                          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                              Rövid leírás
                            </p>
                            <p className="mt-3 text-sm leading-6 text-zinc-200">
                              {leakRequestDescription ??
                                "Külön leírás nem érkezett."}
                            </p>
                          </div>
                        ) : null}

                        {request.service_type === "vizszereles" ? (
                          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                              Rövid leírás
                            </p>
                            <p className="mt-3 text-sm leading-6 text-zinc-200">
                              {plumbingRequestDescription ??
                                "Külön munkaleírás nem érkezett."}
                            </p>
                          </div>
                        ) : null}

                        {request.service_type === "hoszivattyu_telepites" ? (
                          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                              Rövid leírás a feladatról
                            </p>
                            <p className="mt-3 text-sm leading-6 text-zinc-200">
                              {heatPumpRequestDescription ??
                                "Külön leírás nem érkezett."}
                            </p>
                          </div>
                        ) : null}

                        {request.service_type ===
                        "komplett_epuletgepeszeti_kivitelezes" ? (
                          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                              Rövid leírás a feladatról
                            </p>
                            <p className="mt-3 text-sm leading-6 text-zinc-200">
                              {buildingServicesRequestDescription ??
                                "Külön projekttleírás nem érkezett."}
                            </p>
                          </div>
                        ) : null}

                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                            Megjegyzés
                          </p>
                          <p className="mt-3 text-sm leading-6 text-zinc-200">
                            {request.message?.trim()
                              ? request.message
                              : "Külön megjegyzés nem érkezett."}
                          </p>
                        </div>

                        {schedulingInfo?.schedulingNote ? (
                          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                              Kapcsolódó egyeztetési megjegyzés
                            </p>
                            <p className="mt-3 text-sm leading-6 text-zinc-200">
                              {schedulingInfo.schedulingNote}
                            </p>
                          </div>
                        ) : null}

                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                            Csatolt képek
                          </p>

                          {request.attachments.length === 0 ? (
                            <p className="mt-3 text-sm leading-6 text-zinc-500">
                              Nincs csatolt kép.
                            </p>
                          ) : (
                            <div className="mt-3 grid gap-3">
                              {request.attachments.map((attachment) => (
                                <a
                                  key={attachment.id}
                                  href={attachment.signed_url ?? "#"}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-white/20 hover:bg-white/[0.06]"
                                >
                                  {attachment.signed_url ? (
                                    <Image
                                      src={attachment.signed_url}
                                      alt={attachment.file_name}
                                      width={640}
                                      height={320}
                                      className="h-40 w-full object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-40 items-center justify-center bg-black/20 px-4 text-center text-sm text-zinc-500">
                                      Az előnézet most nem érhető el.
                                    </div>
                                  )}

                                  <div className="px-4 py-3">
                                    <p className="text-sm font-medium text-zinc-100">
                                      {attachment.file_name}
                                    </p>
                                    <p className="mt-1 text-sm leading-6 text-zinc-500">
                                      Megnyitás külön lapon
                                    </p>
                                  </div>
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <form
                        action={updateServiceRequestStatusAction}
                        className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4"
                      >
                        <input type="hidden" name="requestId" value={request.id} />
                        <input
                          type="hidden"
                          name="token"
                          value={providedToken ?? ""}
                        />
                        <input
                          type="hidden"
                          name="activeFilter"
                          value={activeStatusFilter ?? "osszes"}
                        />

                        <div className="flex flex-col gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                              Állapot frissítése
                            </p>
                            <p className="mt-2 text-sm leading-6 text-zinc-400">
                              A státusz módosítása szerveroldalon történik, a
                              belső admin folyamat részeként.
                            </p>
                          </div>

                          <div className="flex flex-col gap-3 sm:flex-row">
                            <select
                              name="status"
                              defaultValue={request.status}
                              className="h-11 rounded-xl border border-white/10 bg-zinc-950 px-4 text-sm text-white outline-none transition-colors focus:border-white/30"
                            >
                              {statusFilterOptions
                                .filter((option) => option.value !== "osszes")
                                .map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                    className="bg-zinc-950 text-white"
                                  >
                                    {option.label}
                                  </option>
                                ))}
                            </select>

                            <AdminFormSubmitButton
                              idleLabel="Státusz mentése"
                              pendingLabel="Mentés folyamatban..."
                            />
                          </div>
                        </div>
                      </form>

                      <form
                        action={updateServiceRequestAdminNoteAction}
                        className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4"
                      >
                        <input type="hidden" name="requestId" value={request.id} />
                        <input
                          type="hidden"
                          name="token"
                          value={providedToken ?? ""}
                        />
                        <input
                          type="hidden"
                          name="activeFilter"
                          value={activeStatusFilter ?? "osszes"}
                        />

                        <div className="flex flex-col gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                              Belső admin megjegyzés
                            </p>
                            <p className="mt-2 text-sm leading-6 text-zinc-400">
                              Rövid belső utánkövetési jegyzet, amely nem jelenik
                              meg a publikus ajánlatkérő folyamatban.
                            </p>
                          </div>

                          <textarea
                            name="adminNote"
                            defaultValue={request.admin_note ?? ""}
                            placeholder="Például: visszahívás egyeztetve, helyszíni felmérés várható, további műszaki pontosítás szükséges."
                            className="min-h-28 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm leading-6 text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-white/30"
                          />

                          <div className="flex justify-end">
                            <AdminFormSubmitButton
                              idleLabel="Megjegyzés mentése"
                              pendingLabel="Mentés folyamatban..."
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                      </>
                    )
                  })()}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
