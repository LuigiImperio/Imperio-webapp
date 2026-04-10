const publicEnvWarningCache = new Set<string>()

type KnownPublicEnvName =
  | "NEXT_PUBLIC_GTM_ID"
  | "NEXT_PUBLIC_GA_MEASUREMENT_ID"
  | "NEXT_PUBLIC_SUPABASE_URL"
  | "NEXT_PUBLIC_SUPABASE_ANON_KEY"

function warnPublicEnv(message: string) {
  if (process.env.NODE_ENV === "production") {
    return
  }

  if (publicEnvWarningCache.has(message)) {
    return
  }

  publicEnvWarningCache.add(message)
  console.warn(`[config] ${message}`)
}

const knownPublicEnvReaders: Record<KnownPublicEnvName, () => string | undefined> =
  {
    NEXT_PUBLIC_GTM_ID: () => process.env.NEXT_PUBLIC_GTM_ID,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: () =>
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    NEXT_PUBLIC_SUPABASE_URL: () => process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: () =>
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }

function readPublicEnv(name: string) {
  const knownReader =
    knownPublicEnvReaders[name as KnownPublicEnvName]

  if (knownReader) {
    return knownReader()
  }

  if (typeof window === "undefined") {
    return process.env[name]
  }

  if (name.startsWith("NEXT_PUBLIC_")) {
    warnPublicEnv(
      `Ismeretlen publikus környezeti változó dinamikus olvasása (${name}). Ez kliensoldalon nem lesz megbízhatóan beágyazva.`
    )
  }

  return undefined
}

export function getOptionalPublicEnv(name: string) {
  const value = readPublicEnv(name)?.trim()

  return value ? value : undefined
}

export class PublicConfigurationError extends Error {
  readonly envName?: string

  constructor(message: string, envName?: string) {
    super(message)
    this.name = "PublicConfigurationError"
    this.envName = envName
  }
}

export function getRequiredPublicEnv(name: string, context: string) {
  const value = getOptionalPublicEnv(name)

  if (!value) {
    const message = `${context}: hiányzó környezeti változó (${name}).`

    warnPublicEnv(message)
    throw new PublicConfigurationError(message, name)
  }

  return value
}
