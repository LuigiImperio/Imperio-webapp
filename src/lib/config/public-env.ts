const publicEnvWarningCache = new Set<string>()

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

export function getOptionalPublicEnv(name: string) {
  const value = process.env[name]?.trim()

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
