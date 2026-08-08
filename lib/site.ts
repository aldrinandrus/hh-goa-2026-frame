/** Site URL helpers — configurable via NEXT_PUBLIC_APP_URL */
export function getAppUrl(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
  }
  return getServerAppUrl() || "http://localhost:3000";
}

/** Absolute origin for server routes (API, OG). Prefer explicit env on Vercel. */
export function getServerAppUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (explicit) return explicit;
  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(/\/$/, "");
  if (prod) return `https://${prod}`;
  const preview = process.env.VERCEL_URL?.replace(/\/$/, "");
  if (preview) return `https://${preview}`;
  return "";
}

export function builderPublicPath(id: string): string {
  return `/builder/${id}`;
}

export function builderPublicUrl(id: string): string {
  return `${getAppUrl().replace(/\/$/, "")}${builderPublicPath(id)}`;
}
