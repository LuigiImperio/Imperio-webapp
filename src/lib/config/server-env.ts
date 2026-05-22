import "server-only"

import { normalizeCanonicalBaseUrl } from "@/lib/seo/domain"

const localAppBaseUrl = "http://localhost:3000"
const productionAppBaseUrl = "https://www.imperiogepeszet.hu"
const serverEnvWarningCache = new Set<string>()

function warnServerEnv(message: string) {
  if (serverEnvWarningCache.has(message)) {
    return
  }

  serverEnvWarningCache.add(message)
  console.warn(`[config] ${message}`)
}

function getDefaultAppBaseUrl() {
  return process.env.NODE_ENV === "production"
    ? productionAppBaseUrl
    : localAppBaseUrl
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
      return normalizeCanonicalBaseUrl(new URL(configuredBaseUrl))
    } catch {
      warnServerEnv(
        "Az APP_BASE_URL értéke érvénytelen, ezért a rendszer a biztonságos alapértelmezett URL-re áll vissza."
      )
    }
  } else if (process.env.NODE_ENV === "production") {
    warnServerEnv(
      "Az APP_BASE_URL nincs beállítva, ezért a rendszer a publikus HTTPS alapértelmezett URL-t használja. Éles környezetben ezt mindenképpen állítsa be."
    )
  }

  if (requestUrl) {
    try {
      return normalizeCanonicalBaseUrl(new URL(requestUrl))
    } catch {
      warnServerEnv(
        "A kérésszintű alap URL nem volt értelmezhető, ezért a rendszer a biztonságos alapértelmezett URL-re áll vissza."
      )
    }
  }

  return new URL(getDefaultAppBaseUrl())
}
