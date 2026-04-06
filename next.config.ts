import type { NextConfig } from "next"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

const supabaseImagePattern = supabaseUrl
  ? (() => {
      const parsedUrl = new URL(supabaseUrl)

      return {
        protocol: parsedUrl.protocol.replace(":", "") as "http" | "https",
        hostname: parsedUrl.hostname,
        pathname: "/storage/v1/object/**",
      }
    })()
  : null

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseImagePattern ? [supabaseImagePattern] : [],
  },
}

export default nextConfig
