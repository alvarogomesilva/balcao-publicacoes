import type { User } from "@/store/auth-store";

function isValidUser(value: unknown): value is User {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.uid === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.email === "string"
  );
}

export function buildUserProfile(
  uid: string,
  data: Record<string, unknown> | undefined | null,
): User | null {
  if (!data) {
    return null;
  }

  const candidate: User = {
    uid,
    name: String(data.name ?? ""),
    email: String(data.email ?? ""),
    createdAt: data.createdAt ?? null,
  };

  return isValidUser(candidate) ? candidate : null;
}

export function readStoredUser() {
  try {
    const rawUser = localStorage.getItem("@u");

    if (!rawUser) {
      return null;
    }

    const parsed = JSON.parse(rawUser) as unknown;
    return isValidUser(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
