export const canonicalProductionHost = "www.imperiogepeszet.hu"

export const canonicalProductionHosts = new Set([
  "imperiogepeszet.hu",
  canonicalProductionHost,
])

function normalizeCanonicalHost(url: URL) {
  const normalizedUrl = new URL(url.toString())

  if (canonicalProductionHosts.has(normalizedUrl.hostname)) {
    normalizedUrl.protocol = "https:"
    normalizedUrl.hostname = canonicalProductionHost
    normalizedUrl.port = ""
  }

  return normalizedUrl
}

export function normalizeCanonicalBaseUrl(url: URL) {
  const normalizedUrl = normalizeCanonicalHost(url)

  if (canonicalProductionHosts.has(normalizedUrl.hostname)) {
    normalizedUrl.pathname = "/"
    normalizedUrl.search = ""
    normalizedUrl.hash = ""
  }

  return normalizedUrl
}

export function getCanonicalRequestUrl(url: URL) {
  return normalizeCanonicalHost(url)
}
