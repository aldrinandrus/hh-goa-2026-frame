/** Site URL helpers — configurable via NEXT_PUBLIC_APP_URL */
export function getAppUrl(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export function builderPublicPath(id: string): string {
  return `/builder/${id}`;
}

export function builderPublicUrl(id: string): string {
  return `${getAppUrl().replace(/\/$/, "")}${builderPublicPath(id)}`;
}
