import { encryptionUtils } from "@/lib/encryption.ts";

const DEFAULT_FALLBACK = "/dashboard";

function stripBasepath(pathname: string): string {
  const basepath = String(import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  if (basepath && (pathname === basepath || pathname.startsWith(`${basepath}/`))) {
    return pathname.slice(basepath.length) || "/";
  }
  return pathname;
}

export function toRouterPath(
  path: unknown,
  fallback: string = DEFAULT_FALLBACK,
): string {
  if (typeof path !== "string" || !path.trim()) {
    return fallback;
  }

  let normalized = path.trim();

  try {
    if (/^https?:\/\//i.test(normalized)) {
      normalized = new URL(normalized).pathname;
    }
  } catch {
    return fallback;
  }

  normalized = stripBasepath(normalized);

  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }

  return normalized;
}

export function isProfileIncomplete(user: {
  age?: unknown;
  gender?: unknown;
} | null | undefined): boolean {
  if (!user) {
    return true;
  }

  const isEmpty = (value: unknown) =>
    value === null || value === undefined || value === "";

  return isEmpty(user.age) || user.age === 0 || isEmpty(user.gender);
}

export function resolvePostAuthPath(
  redirectParam: string | undefined,
  fallback: string = DEFAULT_FALLBACK,
): string {
  if (!redirectParam) {
    return toRouterPath(fallback);
  }

  const decrypted = encryptionUtils.decrypt(redirectParam);

  if (typeof decrypted === "string" && decrypted.length > 0) {
    return toRouterPath(decrypted, fallback);
  }

  if (redirectParam.startsWith("/")) {
    return toRouterPath(redirectParam, fallback);
  }

  return toRouterPath(fallback);
}

export function encryptRouterPath(pathname: string): string {
  return encryptionUtils.encrypt(toRouterPath(pathname));
}

export function hardNavigateToAppPath(routerPath: string) {
  const path = toRouterPath(routerPath);
  const base = String(import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");
  window.location.assign(`${base}${path.replace(/^\//, "")}`);
}
