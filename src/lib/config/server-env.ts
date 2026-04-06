import "server-only"

const defaultAppBaseUrl = "http://localhost:3000"
const serverEnvWarningCache = new Set<string>()
const canonicalProductionHost = "www.imperiogepeszet.hu"
const canonicalProductionHosts = new Set([
  "imperiogepeszet.hu",
  canonicalProductionHost,
])

function warnServerEnv(message: string) {
  if (serverEnvWarningCache.has(message)) {
    return
  }

  serverEnvWarningCache.add(message)
  console.warn(`[config] ${message}`)
}

export class ConfigurationError extends Error {
  readonly envName?: string
  readonly envNames?: string[]

  constructor(message: string, envName?: string | string[]) {
    super(message)
    this.name = "ConfigurationError"
    if (Array.isArray(envName)) {
      this.envNames = envName
      this.envName = envName[0]
    } else {
      this.envName = envName
      this.envNames = envName ? [envName] : undefined
    }
  }
}

export function getOptionalServerEnv(name: string) {
  const value = process.env[name]?.trim()

  return value ? value : undefined
}

function normalizeAppBaseUrl(url: URL) {
  const normalizedUrl = new URL(url.toString())

  if (canonicalProductionHosts.has(normalizedUrl.hostname)) {
    normalizedUrl.protocol = "https:"
    normalizedUrl.hostname = canonicalProductionHost
    normalizedUrl.port = ""
    normalizedUrl.pathname = "/"
    normalizedUrl.search = ""
    normalizedUrl.hash = ""
  }

  return normalizedUrl
}

export function getRequiredServerEnv(name: string, context: string) {
  const value = getOptionalServerEnv(name)

  if (!value) {
    throw new ConfigurationError(
      `${context}: hiányzó környezeti változó (${name}).`,
      name
    )
  }

  return value
}

export function getAppBaseUrl(requestUrl?: string) {
  const configuredBaseUrl = getOptionalServerEnv("APP_BASE_URL")

  if (configuredBaseUrl) {
    try {
      return normalizeAppBaseUrl(new URL(configuredBaseUrl))
    } catch {
      warnServerEnv(
        "Az APP_BASE_URL értéke érvénytelen, ezért a rendszer a biztonságos alapértelmezett URL-re áll vissza."
      )
    }
  } else if (process.env.NODE_ENV === "production") {
    warnServerEnv(
      "Az APP_BASE_URL nincs beállítva, ezért a rendszer biztonságos helyi alapértelmezett URL-t használ. Éles környezetben ezt mindenképpen állítsa be."
    )
  }

  if (requestUrl) {
    try {
      return normalizeAppBaseUrl(new URL(requestUrl))
    } catch {
      warnServerEnv(
        "A kérésszintű alap URL nem volt értelmezhető, ezért a rendszer a biztonságos alapértelmezett URL-re áll vissza."
      )
    }
  }

  return new URL(defaultAppBaseUrl)
}

export function getAdminAccessState(providedToken: string | undefined) {
  const expectedToken = getOptionalServerEnv("ADMIN_ACCESS_TOKEN")
  const hasConfiguredProtection = Boolean(expectedToken)
  const hasProvidedToken = Boolean(providedToken)
  const hasAccess =
    hasConfiguredProtection && hasProvidedToken && providedToken === expectedToken

  return {
    providedToken,
    hasConfiguredProtection,
    hasAccess,
    reason: !hasConfiguredProtection
      ? "missing_config"
      : !hasProvidedToken
        ? "missing_token"
        : hasAccess
          ? "authorized"
          : "invalid_token",
  }
}
