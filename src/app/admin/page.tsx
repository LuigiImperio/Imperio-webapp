import Link from "next/link"

import { logServerError } from "@/lib/logging"
import { SiteNavbar } from "@/components/layout/site-navbar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { resolveAdminAccess } from "@/lib/admin/admin-access"
import { getServiceRequestTypeLabel } from "@/lib/service-requests/service-request-types"
import {
  getServiceRequestDashboardSummary,
  getServiceRequestStatusLabel,
  type ServiceRequestServiceType,
  type ServiceRequestStatus,
} from "@/lib/supabase/service-requests-admin"

function formatDate(value: string) {
  return new Intl.DateTimeFormat("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}

function formatServiceType(serviceType: ServiceRequestServiceType | string) {
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

function buildRequestsHref(token: string | undefined) {
  if (!token) {
    return "/admin/ajanlatkeresek"
  }

  return `/admin/ajanlatkeresek?token=${encodeURIComponent(token)}`
}

function buildJobApplicationsHref(token: string | undefined) {
  if (!token) {
    return "/admin/jelentkezesek"
  }

  return `/admin/jelentkezesek?token=${encodeURIComponent(token)}`
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

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    token?: string | string[] | undefined
  }>
}) {
  const resolvedSearchParams = await searchParams
  const accessState = resolveAdminAccess(resolvedSearchParams.token)
  const { providedToken, hasConfiguredProtection, hasAccess } = accessState

  let loadError = false
  let summary = null as Awaited<
    ReturnType<typeof getServiceRequestDashboardSummary>
  > | null

  if (hasAccess) {
    try {
      summary = await getServiceRequestDashboardSummary()
    } catch (error) {
      logServerError("Admin dashboard betöltési hiba", error)
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
              Admin áttekintés
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-7 text-zinc-300 md:text-lg">
              Ez a belső oldal gyors áttekintést ad a jelenlegi ajánlatkérések
              állapotáról, megoszlásáról és a legfrissebb beérkezésekről.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        {!hasConfiguredProtection ? (
          <AccessState
            title="Az admin hozzáférés még nincs konfigurálva"
            description="A belső áttekintés használatához állítsa be az `ADMIN_ACCESS_TOKEN` környezeti változót, majd a megfelelő tokennel nyissa meg az oldalt."
          />
        ) : !hasAccess ? (
          <AccessState
            title={
              accessState.reason === "missing_token"
                ? "A belső dashboard tokennel védett"
                : "A megadott admin token nem érvényes"
            }
            description={
              accessState.reason === "missing_token"
                ? "A belső dashboard megtekintéséhez érvényes hozzáférési token szükséges. Helyi használatnál az oldal `?token=` paraméterrel nyitható meg."
                : "A belső dashboardhoz megadott token nem egyezik a beállított `ADMIN_ACCESS_TOKEN` értékkel, ezért a hozzáférés nem engedélyezett."
            }
          />
        ) : loadError || !summary ? (
          <AccessState
            title="Az admin áttekintés most nem tölthető be"
            description="Az adatbázis oldali olvasás során hiba történt. Ellenőrizze a szerveroldali konfigurációt és a Supabase kapcsolatot."
          />
        ) : (
          <div className="space-y-8">
            {summary.totalCount === 0 ? (
              <Card className="border-white/10 bg-white/[0.04] text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-xl">
                    A belső dashboard működik, de még nincs adat
                  </CardTitle>
                  <CardDescription className="max-w-3xl text-sm leading-6 text-zinc-400">
                    Az admin hozzáférés rendben van, a Supabase kapcsolat él, de
                    jelenleg még nem érkezett be ajánlatkérés a rendszerbe.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <Card className="border-white/10 bg-white/[0.04] text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                <CardHeader>
                  <CardDescription className="text-sm text-zinc-400">
                    Összes ajánlatkérés
                  </CardDescription>
                  <CardTitle className="text-4xl">{summary.totalCount}</CardTitle>
                </CardHeader>
              </Card>

              <Card className="border-white/10 bg-white/[0.04] text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                <CardHeader>
                  <CardDescription className="text-sm text-zinc-400">
                    Új státuszú kérések
                  </CardDescription>
                  <CardTitle className="text-4xl">
                    {summary.statusCounts.uj}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="border-white/10 bg-white/[0.04] text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                <CardHeader>
                  <CardDescription className="text-sm text-zinc-400">
                    Folyamatban lévő kérések
                  </CardDescription>
                  <CardTitle className="text-4xl">
                    {summary.statusCounts.folyamatban}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="border-white/10 bg-white/[0.04] text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                <CardHeader>
                  <CardDescription className="text-sm text-zinc-400">
                    Kapcsolat felvéve
                  </CardDescription>
                  <CardTitle className="text-4xl">
                    {summary.statusCounts.kapcsolat_felveve}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="border-white/10 bg-white/[0.04] text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                <CardHeader>
                  <CardDescription className="text-sm text-zinc-400">
                    Lezárt kérések
                  </CardDescription>
                  <CardTitle className="text-4xl">
                    {summary.statusCounts.lezarva}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
              <Card className="border-white/10 bg-white/[0.04] text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-xl">
                    Szolgáltatásonkénti megoszlás
                  </CardTitle>
                  <CardDescription className="text-sm leading-6 text-zinc-400">
                    A jelenleg támogatott szolgáltatástípusok egyszerű bontása.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                      Kazánjavítás / kazáncsere
                    </p>
                    <p className="mt-4 text-3xl font-semibold text-white">
                      {summary.serviceTypeCounts.kazancsere}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                      Fűtési rendszerek
                    </p>
                    <p className="mt-4 text-3xl font-semibold text-white">
                      {summary.serviceTypeCounts.futeskorszerusites}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                      Hibabejelentés
                    </p>
                    <p className="mt-4 text-3xl font-semibold text-white">
                      {summary.serviceTypeCounts.hibabejelentes}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                      Víz- és gázszerelés
                    </p>
                    <p className="mt-4 text-3xl font-semibold text-white">
                      {summary.serviceTypeCounts.vizszereles}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                      Csőtörés / szivárgás
                    </p>
                    <p className="mt-4 text-3xl font-semibold text-white">
                      {summary.serviceTypeCounts.csotores_szivargas}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                      Hőszivattyú telepítés
                    </p>
                    <p className="mt-4 text-3xl font-semibold text-white">
                      {summary.serviceTypeCounts.hoszivattyu_telepites}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                      Komplett épületgépészeti kivitelezés
                    </p>
                    <p className="mt-4 text-3xl font-semibold text-white">
                      {
                        summary.serviceTypeCounts
                          .komplett_epuletgepeszeti_kivitelezes
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/[0.04] text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-xl">Gyors navigáció</CardTitle>
                  <CardDescription className="text-sm leading-6 text-zinc-400">
                    Innen egy lépésben megnyitható a részletes belső
                    ajánlatkéréslista.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-zinc-400">
                    A részletes listában a státuszok, a képek és a belső admin
                    megjegyzések is kezelhetők.
                  </div>

                  <Button asChild className="w-full bg-white text-zinc-950 hover:bg-zinc-200">
                    <Link href={buildRequestsHref(providedToken)}>
                      Beérkezett ajánlatkérések megnyitása
                    </Link>
                  </Button>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-zinc-400">
                    A külön munkajelentkezések külön belső listában jelennek
                    meg, elkülönítve a szolgáltatási megkeresésektől.
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-white/15 bg-white/[0.04] text-white hover:bg-white/10 hover:text-white"
                  >
                    <Link href={buildJobApplicationsHref(providedToken)}>
                      Beérkezett jelentkezések megnyitása
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="border-white/10 bg-white/[0.04] text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-xl">
                  Legfrissebb ajánlatkérések
                </CardTitle>
                <CardDescription className="text-sm leading-6 text-zinc-400">
                  Az utolsó 5 beérkezett kérés gyors áttekintése.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {summary.latestRequests.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 px-4 py-5 text-sm leading-6 text-zinc-500">
                    Jelenleg még nincs beérkezett ajánlatkérés.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {summary.latestRequests.map((request) => (
                      <div
                        key={request.id}
                        className="grid gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-4 md:grid-cols-[1.3fr_1fr_1fr_auto] md:items-center"
                      >
                        <div>
                          <p className="text-sm font-medium text-white">
                            {formatServiceType(request.service_type)}
                          </p>
                          <p className="mt-1 text-sm text-zinc-400">
                            {request.full_name}
                          </p>
                        </div>
                        <div className="text-sm text-zinc-300">
                          {request.city}
                        </div>
                        <div>
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs tracking-wide ${getStatusBadgeClassName(
                              request.status
                            )}`}
                          >
                            {getServiceRequestStatusLabel(request.status)}
                          </span>
                        </div>
                        <div className="text-sm text-zinc-400">
                          {formatDate(request.created_at)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </section>
    </main>
  )
}
