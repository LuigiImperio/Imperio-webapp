import Link from "next/link"

import { updateJobApplicationStatusAction } from "@/app/admin/jelentkezesek/actions"
import { AdminFormSubmitButton } from "@/components/admin/admin-form-submit-button"
import { SiteNavbar } from "@/components/layout/site-navbar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { resolveAdminAccess } from "@/lib/admin/admin-access"
import { logServerError } from "@/lib/logging"
import {
  getJobApplications,
  getJobApplicationStatusLabel,
  isJobApplicationStatus,
  jobApplicationStatuses,
  type JobApplicationStatus,
} from "@/lib/supabase/job-applications-admin"

const statusFilterOptions = [
  { value: "osszes", label: "Összes" },
  { value: "uj", label: "Új" },
  { value: "atnezve", label: "Átnézve" },
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

function formatFileSize(fileSizeBytes: number) {
  if (fileSizeBytes >= 1024 * 1024) {
    return `${(fileSizeBytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return `${Math.max(1, Math.round(fileSizeBytes / 1024))} KB`
}

function getStatusBadgeClassName(status: JobApplicationStatus) {
  switch (status) {
    case "uj":
      return "border-sky-400/20 bg-sky-400/10 text-sky-100"
    case "atnezve":
      return "border-amber-400/20 bg-amber-400/10 text-amber-100"
    case "kapcsolat_felveve":
      return "border-violet-400/20 bg-violet-400/10 text-violet-100"
    case "lezarva":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
  }
}

function buildFilterHref(token: string | undefined, status: string) {
  const searchParams = new URLSearchParams()

  if (token) {
    searchParams.set("token", token)
  }

  if (status !== "osszes") {
    searchParams.set("status", status)
  }

  return searchParams.size
    ? `/admin/jelentkezesek?${searchParams.toString()}`
    : "/admin/jelentkezesek"
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
        text: "A jelentkezés státuszának mentése sikeresen megtörtént.",
      }
    case "status_error":
      return {
        tone: "error" as const,
        text: "A státusz mentése most nem sikerült. Kérjük, próbálja újra.",
      }
    case "status_invalid":
      return {
        tone: "error" as const,
        text: "A mentéshez szükséges belső adatok hiányosak voltak.",
      }
    case "unauthorized":
      return {
        tone: "error" as const,
        text: "A művelethez érvényes admin hozzáférés szükséges.",
      }
    default:
      return null
  }
}

export default async function AdminJobApplicationsPage({
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
  const resultParam = Array.isArray(resolvedSearchParams.result)
    ? resolvedSearchParams.result[0]
    : resolvedSearchParams.result
  const activeStatusFilter = isJobApplicationStatus(requestedStatus)
    ? requestedStatus
    : null
  const resultMessage = getAdminResultMessage(resultParam)

  let jobApplications = await Promise.resolve([] as Awaited<
    ReturnType<typeof getJobApplications>
  >)
  let loadError = false

  if (hasAccess) {
    try {
      jobApplications = await getJobApplications(activeStatusFilter ?? undefined)
    } catch (error) {
      logServerError("Admin munkajelentkezések betöltési hiba", error, {
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
              Beérkezett jelentkezések
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-7 text-zinc-300 md:text-lg">
              Ez a belső lista a “Dolgozz velünk” szekción keresztül beérkezett
              jelentkezéseket mutatja, külön a szolgáltatási megkeresésektől.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        {!hasConfiguredProtection ? (
          <AccessState
            title="Az admin hozzáférés még nincs konfigurálva"
            description="A belső jelentkezési lista használatához állítsa be az `ADMIN_ACCESS_TOKEN` környezeti változót, majd a megfelelő tokennel nyissa meg az oldalt."
          />
        ) : !hasAccess ? (
          <AccessState
            title={
              accessState.reason === "missing_token"
                ? "A belső jelentkezési lista tokennel védett"
                : "A megadott admin token nem érvényes"
            }
            description={
              accessState.reason === "missing_token"
                ? "A jelentkezések megtekintéséhez érvényes hozzáférési token szükséges."
                : "A megadott token nem egyezik a beállított `ADMIN_ACCESS_TOKEN` értékkel, ezért a lista nem nyitható meg."
            }
          />
        ) : loadError ? (
          <AccessState
            title="A jelentkezések most nem tölthetők be"
            description="Az adatbázis oldali olvasás során hiba történt. Ellenőrizze a szerveroldali konfigurációt és a Supabase kapcsolatot."
          />
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
                  A jelentkezési lista gyorsan szűrhető a jelenlegi feldolgozási
                  állapot alapján.
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

            {jobApplications.length === 0 ? (
              <AccessState
                title="Még nincs a szűrésnek megfelelő jelentkezés"
                description="Amint érkezik jelentkezés a publikus felületről, itt jelennek meg a beérkezett adatok és az önéletrajz elérése."
              />
            ) : (
              jobApplications.map((application) => (
                <Card
                  key={application.id}
                  className="border-white/10 bg-white/[0.04] text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl"
                >
                  <CardHeader className="border-b border-white/10">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs tracking-wide text-zinc-300">
                          Dolgozz velünk
                        </div>
                        <CardTitle className="mt-4 text-2xl">
                          {application.full_name}
                        </CardTitle>
                        <CardDescription className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
                          {application.interest_area?.trim()
                            ? `Érdeklődési terület: ${application.interest_area}`
                            : "Konkrét érdeklődési terület nem lett megadva."}
                        </CardDescription>
                      </div>

                      <div className="flex flex-col items-start gap-3 lg:items-end">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs tracking-wide ${getStatusBadgeClassName(
                            application.status
                          )}`}
                        >
                          {getJobApplicationStatusLabel(application.status)}
                        </span>
                        <span className="text-sm text-zinc-400">
                          Beküldve: {formatDate(application.created_at)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6 pt-6">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                          E-mail
                        </p>
                        <p className="mt-3 text-sm leading-6 text-zinc-200">
                          {application.email}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                          Telefonszám
                        </p>
                        <p className="mt-3 text-sm leading-6 text-zinc-200">
                          {application.phone}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                          Önéletrajz fájl
                        </p>
                        <p className="mt-3 text-sm leading-6 text-zinc-200">
                          {application.cv_file_name}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                          Fájlméret
                        </p>
                        <p className="mt-3 text-sm leading-6 text-zinc-200">
                          {formatFileSize(application.cv_file_size_bytes)}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                          <h2 className="text-base font-medium text-white">
                            Motiváció
                          </h2>
                          <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                            Jelentkezés
                          </span>
                        </div>

                        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-zinc-200">
                          {application.motivation_text}
                        </p>

                        <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                            Megjegyzés
                          </p>
                          <p className="mt-3 text-sm leading-6 text-zinc-200">
                            {application.note?.trim()
                              ? application.note
                              : "Külön megjegyzés nem érkezett."}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                            <h2 className="text-base font-medium text-white">
                              Önéletrajz
                            </h2>
                            <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                              Dokumentum
                            </span>
                          </div>

                          <p className="mt-4 text-sm leading-6 text-zinc-300">
                            A feltöltött önéletrajz külön lapon nyitható meg.
                          </p>

                          {application.signed_cv_url ? (
                            <a
                              href={application.signed_cv_url}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl border border-white/20 bg-white px-4 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
                            >
                              Önéletrajz megnyitása
                            </a>
                          ) : (
                            <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm leading-6 text-zinc-400">
                              Az önéletrajz közvetlen megnyitása most nem érhető el.
                            </div>
                          )}
                        </div>

                        <form
                          action={updateJobApplicationStatusAction}
                          className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
                        >
                          <input
                            type="hidden"
                            name="applicationId"
                            value={application.id}
                          />
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

                          <div className="space-y-4">
                            <div>
                              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                                Állapot frissítése
                              </p>
                              <p className="mt-2 text-sm leading-6 text-zinc-400">
                                A jelentkezés belső státusza külön kezelhető a
                                szolgáltatási megkeresésektől.
                              </p>
                            </div>

                            <select
                              name="status"
                              defaultValue={application.status}
                              className="h-11 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 text-sm text-white outline-none transition-colors focus:border-white/30"
                            >
                              {jobApplicationStatuses.map((status) => (
                                <option
                                  key={status}
                                  value={status}
                                  className="bg-zinc-950 text-white"
                                >
                                  {getJobApplicationStatusLabel(status)}
                                </option>
                              ))}
                            </select>

                            <AdminFormSubmitButton
                              idleLabel="Státusz mentése"
                              pendingLabel="Mentés folyamatban..."
                              className="w-full"
                            />
                          </div>
                        </form>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </section>
    </main>
  )
}
